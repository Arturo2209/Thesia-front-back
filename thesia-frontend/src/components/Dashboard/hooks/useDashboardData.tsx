import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import documentsService from '../../../services/documentsService';
import thesisService from '../../../services/thesisService';
import advisorService from '../../../services/advisorService';
import dashboardService from '../../../services/dashboardService';
import type {
  DashboardData,
  DashboardState,
  DashboardError,
  UserInfo,
  ThesisInfo,
  DocumentsStats,
  AdvisorInfo,
  ActivityEvent,
  GuideInfo,
  PendingTask,
  QuickAction,
  PhaseInfo
} from '../types/dashboard.types';

// 🔧 HELPER FUNCTIONS
const dashboardHelpers = {
  // 📊 Calcular progreso general basado en documentos aprobados
  calculateOverallProgress: (documents: DocumentsStats): number => {
    if (documents.totalUploaded === 0) return 0;
    
    // Contar fases completadas (con al menos 1 documento aprobado)
    const phases = ['fase_1_plan_proyecto', 'fase_2_diagnostico', 'fase_3_marco_teorico', 'fase_4_desarrollo', 'fase_5_resultados'];
    const completedPhases = phases.filter(phase => 
      documents.byPhase[phase]?.approved > 0
    ).length;
    
    return Math.round((completedPhases / 5) * 100);
  },

  // 🎯 Determinar siguiente acción inteligente
  getNextAction: (thesis: ThesisInfo, documents: DocumentsStats): PendingTask | null => {
    if (!thesis.hasThesis) {
      return {
        id: 1,
        title: 'Registrar tu tesis',
        description: 'Crea tu proyecto de tesis para comenzar a subir documentos',
        priority: 'high',
        type: 'register_thesis',
        actionUrl: '/mi-tesis', // ✅ CORREGIDO: ruta correcta
        estimatedTime: '15 minutos',
        isOverdue: false
      };
    }

    // Verificar documentos rechazados (prioridad alta)
    if (documents.rejected > 0) {
      return {
        id: 2,
        title: 'Resubir documentos rechazados',
        description: `Tienes ${documents.rejected} documento(s) rechazado(s) que necesitan corrección`,
        priority: 'high',
        type: 'resubmit_document',
        actionUrl: '/mis-documentos', // ✅ CORREGIDO: ruta correcta
        estimatedTime: '1-2 horas',
        isOverdue: true
      };
    }

    // Determinar siguiente documento a subir
    const currentPhase = thesis.currentPhase.current;
    const phaseNames = [
      'fase_1_plan_proyecto',
      'fase_2_diagnostico', 
      'fase_3_marco_teorico',
      'fase_4_desarrollo',
      'fase_5_resultados'
    ];

    const currentPhaseName = phaseNames[currentPhase - 1];
    const currentPhaseStats = documents.byPhase[currentPhaseName];

    if (!currentPhaseStats || currentPhaseStats.approved === 0) {
      return {
        id: 3,
        title: `Subir documento de ${getPhaseDisplayName(currentPhase)}`,
        description: `Sube tu primer documento para la fase ${currentPhase}`,
        priority: 'medium',
        type: 'upload_next_document',
        actionUrl: '/mis-documentos', // ✅ CORREGIDO: ruta correcta
        estimatedTime: '30 minutos',
        isOverdue: false
      };
    }

    // Si la fase actual está completa, sugerir siguiente fase
    if (currentPhase < 5) {
      return {
        id: 4,
        title: `Comenzar ${getPhaseDisplayName(currentPhase + 1)}`,
        description: `¡Felicidades! Fase ${currentPhase} completada. Comienza la siguiente fase`,
        priority: 'medium',
        type: 'upload_next_document',
        actionUrl: '/mis-documentos', // ✅ CORREGIDO: ruta correcta
        estimatedTime: '45 minutos',
        isOverdue: false
      };
    }

    return null;
  },

  // 📅 Formatear tiempo relativo
  formatTimeAgo: (date: string): string => {
    if (!date) return 'Sin fecha';
    
    try {
      const now = new Date();
      const past = new Date(date);
      const diffMs = now.getTime() - past.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffDays > 0) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
      if (diffHours > 0) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      if (diffMinutes > 0) return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
      return 'Ahora mismo';
    } catch (error) {
      return 'Fecha inválida';
    }
  },

  // 🎨 Colores por fase
  getPhaseColor: (phase: number): string => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return colors[phase - 1] || '#6B7280';
  },

  // 🚦 Colores por prioridad
  getPriorityColor: (priority: 'high' | 'medium' | 'low'): string => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  }
};

// 📝 HELPER: Obtener nombre de fase para mostrar
const getPhaseDisplayName = (phase: number): string => {
  const names = [
    'Plan de Proyecto',
    'Diagnóstico',
    'Marco Teórico',
    'Desarrollo',
    'Resultados'
  ];
  return names[phase - 1] || `Fase ${phase}`;
};

// 🎯 HOOK PRINCIPAL
export const useDashboardData = () => {
  const navigate = useNavigate();
  
  // 📱 Estado principal
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    data: null,
    connectionStatus: 'checking',
    lastUpdated: '',
    isRefreshing: false
  });

  // 🔄 Función para cargar todos los datos
  const loadDashboardData = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null, connectionStatus: 'checking' }));
      
      console.log('🔄 === CARGANDO DATOS DEL DASHBOARD ===');

      // 🔧 Cargar datos en paralelo
      const [userInfo, thesisData, documentsData, advisorData, guidesData] = await Promise.allSettled([
        getUserInfo(),
        getThesisInfo(),
        getDocumentsStats(),
        getAdvisorInfo(),
        getGuidesInfo()
      ]);

      // 🧠 Procesar resultados
      const user = userInfo.status === 'fulfilled' ? userInfo.value : getDefaultUserInfo();
      const thesis = thesisData.status === 'fulfilled' ? thesisData.value : getDefaultThesisInfo();
      const documents = documentsData.status === 'fulfilled' ? documentsData.value : getDefaultDocumentsStats();
      const advisor = advisorData.status === 'fulfilled' ? advisorData.value : getDefaultAdvisorInfo();
      const guides = guidesData.status === 'fulfilled' ? guidesData.value : getDefaultGuideInfo();

      // 📊 Calcular datos derivados
      const activities = generateActivityTimeline(documents, thesis);
      const pendingTasks = generatePendingTasks(thesis, documents, guides);
      const quickActions = generateQuickActions(thesis, documents, guides, user);

      // 🎯 Construir data final
      const dashboardData: DashboardData = {
        user,
        thesis,
        documents,
        advisor,
        activities,
        guides: [guides], // ✅ CORREGIDO: Array con un GuideInfo
        pendingTasks,
        quickActions
      };

      setState(prev => ({
        ...prev,
        loading: false,
        data: dashboardData,
        connectionStatus: 'connected',
        lastUpdated: new Date().toISOString(),
        error: null
      }));

      console.log('✅ Dashboard data cargada exitosamente:', dashboardData);

    } catch (error) {
      console.error('❌ Error cargando dashboard data:', error);
      
      const dashboardError: DashboardError = {
        code: 'LOAD_ERROR',
        message: error instanceof Error ? error.message : 'Error desconocido cargando dashboard',
        details: error,
        retryable: true
      };

      setState(prev => ({
        ...prev,
        loading: false,
        error: dashboardError,
        connectionStatus: 'error'
      }));
    }
  }, []);

  // 👤 Obtener información del usuario
  const getUserInfo = useCallback(async (): Promise<UserInfo> => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    return {
      name: userData.nombre || userData.name || 'Usuario',
      role: userData.rol || userData.role || 'estudiante',
      roleDisplay: userData.rol === 'estudiante' ? 'Estudiante' : 
                  userData.rol === 'asesor' ? 'Asesor' : 'Usuario',
      carrera: userData.carrera || 'No especificada',
      profileCompleted: !!(userData.nombre && userData.carrera),
      email: userData.correo_institucional || userData.email || '',
      ciclo: userData.ciclo
    };
  }, []);

  // 📚 Obtener información de la tesis
  const getThesisInfo = useCallback(async (): Promise<ThesisInfo> => {
    try {
      const response = await thesisService.getMyThesis();
      
      if (response.success && response.thesis) {
        const thesis = response.thesis;
        
        // Calcular fase actual basada en documentos
        const currentPhase = calculateCurrentPhase(thesis);
        
        return {
          hasThesis: true,
          id: thesis.id, // ✅ CORRECTO: usar 'id'
          title: thesis.titulo, // ✅ CORRECTO: usar 'titulo' de la BD
          description: thesis.descripcion, // ✅ CORRECTO: usar 'descripcion' de la BD
          currentPhase,
          overallProgress: 0, // Se calculará con documentos
          daysRemaining: calculateDaysRemaining(thesis.fecha_limite), // ✅ CORRECTO: usar 'fecha_limite' de la BD
          nextDeadline: thesis.fecha_limite,
          status: mapThesisStatus(thesis.estado || 'pendiente')  // ✅ CORRECTO: usar 'estado' de la BD
        };
      }
      
      return getDefaultThesisInfo();
      
    } catch (error) {
      console.error('❌ Error obteniendo tesis:', error);
      return getDefaultThesisInfo();
    }
  }, []);

  // 📄 Obtener estadísticas de documentos
  const getDocumentsStats = useCallback(async (): Promise<DocumentsStats> => {
    try {
      const response = await documentsService.getMyDocuments();
      
      if (response.success && response.documents) {
        const docs = response.documents;
        
        // Calcular estadísticas por fase
        const byPhase: DocumentsStats['byPhase'] = {};
        const phases = ['fase_1_plan_proyecto', 'fase_2_diagnostico', 'fase_3_marco_teorico', 'fase_4_desarrollo', 'fase_5_resultados'];
        
        phases.forEach(phase => {
          const phaseDocs = docs.filter(doc => doc.phase === phase);
          byPhase[phase] = {
            uploaded: phaseDocs.length,
            approved: phaseDocs.filter(doc => doc.status === 'aprobado').length,
            pending: phaseDocs.filter(doc => doc.status === 'pendiente').length,
            rejected: phaseDocs.filter(doc => doc.status === 'rechazado').length
          };
        });

        const totalUploaded = docs.length;
        const approved = docs.filter(doc => doc.status === 'aprobado').length;
        const pending = docs.filter(doc => doc.status === 'pendiente').length;
        const rejected = docs.filter(doc => doc.status === 'rechazado').length;

        return {
          totalUploaded,
          approved,
          pending,
          rejected,
          byPhase,
          lastUpload: docs.length > 0 ? docs[0].uploadDate : undefined,
          approvalRate: totalUploaded > 0 ? Math.round((approved / totalUploaded) * 100) : 0
        };
      }
      
      return getDefaultDocumentsStats();
      
    } catch (error) {
      console.error('❌ Error obteniendo documentos:', error);
      return getDefaultDocumentsStats();
    }
  }, []);

  // 👨‍🏫 Obtener información del asesor
  const getAdvisorInfo = useCallback(async (): Promise<AdvisorInfo> => {
    try {
      const response = await advisorService.getMyAdvisor();
      
      if (response.success && response.advisor) {
        const advisor = response.advisor;
        
        return {
          hasAdvisor: true,
          id: advisor.id,
          name: advisor.name,
          email: advisor.email,
          especialidad: advisor.specialty || 'No especificada', // ✅ CORRECTO: usar 'specialty' del tipo Advisor
          isOnline: false, // Esto se podría implementar con websockets
          lastActivity: 'Sin actividad reciente', // ✅ CORRECTO: valor por defecto
          responseTime: '24-48 horas',
          totalStudents: advisor.current_students || 0 // ✅ CORRECTO: usar 'current_students' del tipo Advisor
        };
      }
      
      return getDefaultAdvisorInfo();
      
    } catch (error) {
      console.error('❌ Error obteniendo asesor:', error);
      return getDefaultAdvisorInfo();
    }
  }, []);

  // 📚 Obtener información de guías
  const getGuidesInfo = useCallback(async (): Promise<GuideInfo> => {
    try {
      const response = await documentsService.getMyGuides();
      
      if (response.success && Array.isArray(response.guides)) { // ✅ CORRECTO: verificar que es array
        const guides = response.guides;
        
        return {
          hasNewGuides: guides.length > 0,
          totalGuides: guides.length,
          newGuidesCount: guides.length, // Simplificado - todas son "nuevas"
          lastUploadDate: guides.length > 0 ? guides[0].uploadDate : undefined,
          availablePhases: [...new Set(guides.map(g => g.phase).filter(Boolean))]
        };
      }
      
      return getDefaultGuideInfo();
      
    } catch (error) {
      console.error('❌ Error obteniendo guías:', error);
      return getDefaultGuideInfo();
    }
  }, []);

  // 🔄 Función de refresh
  const refreshData = useCallback(async (): Promise<void> => {
    if (state.isRefreshing) return;
    
    setState(prev => ({ ...prev, isRefreshing: true }));
    await loadDashboardData();
    setState(prev => ({ ...prev, isRefreshing: false }));
  }, [loadDashboardData, state.isRefreshing]);

  // 🚀 Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 📊 Datos calculados usando useMemo para optimización
  const calculatedData = useMemo(() => {
    if (!state.data) return null;

    const { documents, thesis } = state.data;
    
    // Actualizar progreso general en la tesis
    const overallProgress = dashboardHelpers.calculateOverallProgress(documents);
    
    return {
      ...state.data,
      thesis: {
        ...thesis,
        overallProgress
      }
    };
  }, [state.data]);

  return {
    // 📱 Estado
    loading: state.loading,
    error: state.error,
    data: calculatedData,
    connectionStatus: state.connectionStatus,
    lastUpdated: state.lastUpdated,
    isRefreshing: state.isRefreshing,
    
    // 🔄 Acciones
    refresh: refreshData,
    retry: loadDashboardData,
    
    // 🧠 Helpers
    helpers: dashboardHelpers
  };
};

// 🔧 FUNCIONES HELPER ADICIONALES

const calculateCurrentPhase = (thesis: any): PhaseInfo => {
  // Simplificado - podríamos hacer esto más inteligente basado en documentos
  return {
    current: 1,
    name: 'Plan de Proyecto',
    progress: 0,
    isCompleted: false,
    isUnlocked: true,
    documentsRequired: 1,
    documentsCompleted: 0,
    nextDocumentType: 'Plan de Proyecto'
  };
};

const calculateDaysRemaining = (fechaLimite?: string): number => {
  if (!fechaLimite) return 0;
  
  try {
    const now = new Date();
    const deadline = new Date(fechaLimite);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  } catch (error) {
    return 0;
  }
};

const mapThesisStatus = (estado: string): ThesisInfo['status'] => {
  switch (estado) {
    case 'pendiente': return 'propuesta';
    case 'en_proceso': return 'desarrollo';
    case 'revisado': return 'revision';
    case 'aprobado': return 'completed';
    default: return 'propuesta';
  }
};

// 📊 Generar timeline de actividad
const generateActivityTimeline = (documents: DocumentsStats, thesis: ThesisInfo): ActivityEvent[] => {
  const events: ActivityEvent[] = [];
  
  // Simplificado - en la implementación real vendría de la API
  if (documents.totalUploaded > 0) {
    events.push({
      id: 1,
      type: 'document_upload',
      title: 'Documento subido',
      description: `Has subido ${documents.totalUploaded} documento(s)`,
      date: new Date().toISOString(),
      icon: '📄',
      priority: 'low'
    });
  }
  
  if (documents.approved > 0) {
    events.push({
      id: 2,
      type: 'document_approval',
      title: 'Documento aprobado',
      description: `${documents.approved} documento(s) aprobado(s)`,
      date: new Date().toISOString(),
      icon: '✅',
      priority: 'low'
    });
  }
  
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// ✅ Generar tareas pendientes
const generatePendingTasks = (thesis: ThesisInfo, documents: DocumentsStats, guides: GuideInfo): PendingTask[] => {
  const tasks: PendingTask[] = [];
  
  const nextAction = dashboardHelpers.getNextAction(thesis, documents);
  if (nextAction) {
    tasks.push(nextAction);
  }
  
  if (guides.hasNewGuides) {
    tasks.push({
      id: 100,
      title: 'Revisar guías nuevas',
      description: `Tienes ${guides.newGuidesCount} guía(s) nueva(s) disponible(s)`,
      priority: 'low',
      type: 'download_guide',
      actionUrl: '/mis-documentos', // ✅ CORREGIDO: ruta correcta
      estimatedTime: '5 minutos',
      isOverdue: false
    });
  }
  
  return tasks;
};

// 🚀 Generar acciones rápidas - ✅ COMPLETAMENTE CORREGIDO
const generateQuickActions = (thesis: ThesisInfo, documents: DocumentsStats, guides: GuideInfo, user: UserInfo): QuickAction[] => {
  const actions: QuickAction[] = [
    {
      id: 'upload_document',
      title: 'Subir Documento',
      subtitle: 'Sube un nuevo documento',
      icon: '📤',
      url: '/mis-documentos', // ✅ CORREGIDO: ruta correcta según sidebar
      isEnabled: thesis.hasThesis,
      color: 'blue',
      requiresThesis: true
    },
    {
      id: 'view_documents',
      title: 'Mis Documentos',
      subtitle: 'Ver todos mis documentos',
      icon: '📂',
      url: '/mis-documentos', // ✅ CORREGIDO: ruta correcta según sidebar
      isEnabled: true,
      badge: documents.totalUploaded > 0 ? documents.totalUploaded : undefined,
      color: 'green'
    },
    {
      id: 'view_guides',
      title: 'Guías',
      subtitle: 'Recursos de mi asesor',
      icon: '📚',
      url: '/mis-documentos', // ✅ CORREGIDO: ruta correcta según sidebar (mismo lugar)
      isEnabled: true,
      badge: guides.newGuidesCount > 0 ? guides.newGuidesCount : undefined,
      color: 'purple'
    },
    {
      id: 'thesis_management',
      title: thesis.hasThesis ? 'Mi Tesis' : 'Crear Tesis',
      subtitle: thesis.hasThesis ? 'Gestionar mi tesis' : 'Registrar nueva tesis',
      icon: '🎓',
      url: '/mi-tesis', // ✅ CORREGIDO: ruta correcta según sidebar
      isEnabled: true,
      color: 'orange'
    }
  ];
  
  return actions;
};

// 🔧 VALORES POR DEFECTO

const getDefaultUserInfo = (): UserInfo => ({
  name: 'Usuario',
  role: 'estudiante',
  roleDisplay: 'Estudiante',
  carrera: 'No especificada',
  profileCompleted: false,
  email: ''
});

const getDefaultThesisInfo = (): ThesisInfo => ({
  hasThesis: false,
  currentPhase: {
    current: 1,
    name: 'Plan de Proyecto',
    progress: 0,
    isCompleted: false,
    isUnlocked: true,
    documentsRequired: 1,
    documentsCompleted: 0
  },
  overallProgress: 0,
  daysRemaining: 0,
  status: 'no_thesis'
});

const getDefaultDocumentsStats = (): DocumentsStats => ({
  totalUploaded: 0,
  approved: 0,
  pending: 0,
  rejected: 0,
  byPhase: {},
  approvalRate: 0
});

const getDefaultAdvisorInfo = (): AdvisorInfo => ({
  hasAdvisor: false
});

const getDefaultGuideInfo = (): GuideInfo => ({
  hasNewGuides: false,
  totalGuides: 0,
  newGuidesCount: 0,
  availablePhases: []
});

export default useDashboardData;