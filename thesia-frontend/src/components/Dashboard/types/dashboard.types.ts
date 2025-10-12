// 📊 INTERFACES PRINCIPALES
export interface DashboardData {
    user: UserInfo;
    thesis: ThesisInfo;
    documents: DocumentsStats;
    advisor: AdvisorInfo;
    activities: ActivityEvent[];
    guides: GuideInfo[];
    pendingTasks: PendingTask[];
    quickActions: QuickAction[];
  }
  
  // 👤 INFORMACIÓN DEL USUARIO
  export interface UserInfo {
    name: string;
    role: string;
    roleDisplay: string;
    carrera: string;
    profileCompleted: boolean;
    email: string;
    ciclo?: string;
  }
  
  // 📚 INFORMACIÓN DE LA TESIS
  export interface ThesisInfo {
    hasThesis: boolean;
    id?: number;
    title?: string;
    description?: string;
    currentPhase: PhaseInfo;
    overallProgress: number;
    daysRemaining: number;
    nextDeadline?: string;
    status: 'no_thesis' | 'propuesta' | 'desarrollo' | 'revision' | 'sustentacion' | 'completed';
  }
  
  // 📂 INFORMACIÓN DE FASES
  export interface PhaseInfo {
    current: number; // 1-5
    name: string;
    progress: number; // 0-100
    isCompleted: boolean;
    isUnlocked: boolean;
    documentsRequired: number;
    documentsCompleted: number;
    nextDocumentType?: string;
  }
  
  // 📄 ESTADÍSTICAS DE DOCUMENTOS
  export interface DocumentsStats {
    totalUploaded: number;
    approved: number;
    pending: number;
    rejected: number;
    byPhase: {
      [phase: string]: {
        uploaded: number;
        approved: number;
        pending: number;
        rejected: number;
      };
    };
    lastUpload?: string;
    approvalRate: number; // Porcentaje de aprobación
  }
  
  // 👨‍🏫 INFORMACIÓN DEL ASESOR
  export interface AdvisorInfo {
    hasAdvisor: boolean;
    id?: number;
    name?: string;
    email?: string;
    especialidad?: string;
    isOnline?: boolean;
    lastActivity?: string;
    responseTime?: string; // "24 horas promedio"
    totalStudents?: number;
  }
  
  // 📋 EVENTO DE ACTIVIDAD
  export interface ActivityEvent {
    id: number;
    type: 'document_upload' | 'document_approval' | 'document_rejection' | 'meeting' | 'comment' | 'phase_change' | 'thesis_registration' | 'guide_download';
    title: string;
    description: string;
    date: string;
    icon: string;
    actionable?: boolean;
    actionUrl?: string;
    priority: 'low' | 'medium' | 'high';
  }
  
  // ✅ TAREA PENDIENTE
  export interface PendingTask {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate?: string;
    type: 'resubmit_document' | 'upload_next_document' | 'schedule_meeting' | 'download_guide' | 'complete_profile' | 'register_thesis';
    actionUrl: string;
    estimatedTime: string; // "10 minutos", "1 hora"
    isOverdue: boolean;
  }
  
  // 🚀 ACCIÓN RÁPIDA
  export interface QuickAction {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    url: string;
    isEnabled: boolean;
    badge?: string | number; // Para mostrar notificaciones
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
    requiresThesis?: boolean;
  }
  
  // 📚 INFORMACIÓN DE GUÍAS
  export interface GuideInfo {
    hasNewGuides: boolean;
    totalGuides: number;
    newGuidesCount: number;
    lastUploadDate?: string;
    availablePhases: string[];
  }
  
  // 🎯 PROGRESO DETALLADO POR FASE
  export interface PhaseProgress {
    phase1: PhaseDetail;
    phase2: PhaseDetail;
    phase3: PhaseDetail;
    phase4: PhaseDetail;
    phase5: PhaseDetail;
  }
  
  export interface PhaseDetail {
    name: string;
    shortName: string;
    status: 'locked' | 'current' | 'completed';
    progress: number;
    documentsRequired: string[];
    documentsCompleted: string[];
    isUnlocked: boolean;
    estimatedDays: number;
  }
  
  // 📊 ESTADÍSTICAS AVANZADAS
  export interface AdvancedStats {
    productivity: {
      documentsPerWeek: number;
      averageRevisionDays: number;
      mostActiveDay: string;
      totalWorkingDays: number;
    };
    quality: {
      firstTimeApprovalRate: number;
      averageRevisionsPerDocument: number;
      mostCommonRejectionReason: string;
    };
    timeline: {
      startDate: string;
      expectedEndDate: string;
      currentPace: 'ahead' | 'on_track' | 'behind';
      daysAheadBehind: number;
    };
  }
  
  // 🔔 NOTIFICACIONES
  export interface Notification {
    id: number;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
    actionText?: string;
  }
  
  // 🎨 CONFIGURACIÓN DE TEMA/UI
  export interface DashboardConfig {
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
    showAdvancedStats: boolean;
    autoRefreshInterval: number; // minutos
    defaultView: 'overview' | 'detailed';
  }
  
  // 🔧 RESPUESTAS DE LA API
  export interface DashboardApiResponse {
    success: boolean;
    message: string;
    data: DashboardData;
    timestamp: string;
    version: string;
  }
  
  export interface DashboardError {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
  }
  
  // 🎯 HELPERS Y UTILITARIOS
  export interface DashboardHelpers {
    calculateOverallProgress: (documents: DocumentsStats) => number;
    getNextAction: (thesis: ThesisInfo, documents: DocumentsStats) => PendingTask | null;
    formatTimeAgo: (date: string) => string;
    getPhaseColor: (phase: number) => string;
    getPriorityColor: (priority: 'high' | 'medium' | 'low') => string;
  }
  
  // 📱 ESTADOS DEL COMPONENTE
  export interface DashboardState {
    loading: boolean;
    error: DashboardError | null;
    data: DashboardData | null;
    connectionStatus: 'checking' | 'connected' | 'error';
    lastUpdated: string;
    isRefreshing: boolean;
  }
  
  // 🔄 ACCIONES DISPONIBLES
  export type DashboardAction = 
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_DATA'; payload: DashboardData }
    | { type: 'SET_ERROR'; payload: DashboardError | null }
    | { type: 'SET_CONNECTION_STATUS'; payload: 'checking' | 'connected' | 'error' }
    | { type: 'REFRESH_DATA' }
    | { type: 'MARK_NOTIFICATION_READ'; payload: number }
    | { type: 'UPDATE_CONFIG'; payload: Partial<DashboardConfig> };