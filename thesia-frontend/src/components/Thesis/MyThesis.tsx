import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import authService from '../../services/authService';
import thesisService from '../../services/thesisService';

// Importar tipos y componentes
import type { Advisor, ThesisData, FormData } from './types/thesis.types';
import ThesisForm from './components/ThesisForm';
import ThesisRegistered from './components/ThesisRegistered';
import ThesisEditForm from './components/ThesisEditForm';
import { baseStyles } from './styles/MyThesis.styles';

console.log('🚀 MY THESIS COMPONENT CARGADO - VERSIÓN 3.2 CON EDICIÓN COMPLETA');

const MyThesis: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [loading, setLoading] = useState(true);
  const [hasThesis, setHasThesis] = useState(false);
  const [thesisData, setThesisData] = useState<ThesisData | null>(null);
  const [user, setUser] = useState<any>(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descripcion: '',
    ciclo: '', // 🔧 Se auto-llenará desde el perfil del usuario
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Estados de asesores
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [advisorsLoading, setAdvisorsLoading] = useState(false);
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<number | null>(null);

  // 🔧 ESTADO PARA MODO EDICIÓN
  const [isEditing, setIsEditing] = useState(false);

  // 🔧 SOLO CICLOS V Y VI PERMITIDOS
  const cycles = ['V Ciclo', 'VI Ciclo'];

  // 🔧 INICIALIZACIÓN CON AUTO-RELLENO DE CICLO DESDE PERFIL
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        console.log('🚀 === INICIALIZANDO MyThesis COMPONENT ===');
        
        const storedUser = authService.getStoredUser();
        console.log('👤 Usuario desde localStorage:', {
          id: storedUser?.id,
          email: storedUser?.email,
          carrera: storedUser?.carrera,
          ciclo: storedUser?.ciclo,
          codigo_estudiante: storedUser?.codigo_estudiante
        });
        
        if (!storedUser) {
          console.log('❌ No hay usuario autenticado');
          navigate('/login');
          return;
        }
        
        setUser(storedUser);

        // 🔧 AUTO-LLENAR CICLO DESDE EL PERFIL DEL USUARIO
        let cicloFormateado = 'V Ciclo'; // Por defecto
        
        if (storedUser.ciclo) {
          if (storedUser.ciclo === 5) {
            cicloFormateado = 'V Ciclo';
          } else if (storedUser.ciclo === 6) {
            cicloFormateado = 'VI Ciclo';
          } else {
            console.log('⚠️ Ciclo no estándar detectado:', storedUser.ciclo, '- usando V Ciclo por defecto');
          }
        } else {
          console.log('⚠️ Usuario sin ciclo en perfil - usando V Ciclo por defecto');
        }
        
        console.log('✅ === CICLO AUTO-CONFIGURADO ===');
        console.log('Ciclo numérico del usuario:', storedUser.ciclo);
        console.log('Ciclo formateado para formulario:', cicloFormateado);
        console.log('================================');
        
        setFormData(prev => ({
          ...prev,
          ciclo: cicloFormateado
        }));
        
        // Cargar datos principales
        await loadData(storedUser);
        
      } catch (error) {
        console.error('❌ Error inicializando componente:', error);
        setError('Error cargando la aplicación. Por favor recarga la página.');
      }
    };
  
    initializeComponent();
  }, [navigate]);

  // 🔧 CARGAR DATOS PRINCIPALES (TESIS Y ASESORES)
  const loadData = async (currentUser?: any) => {
    try {
      setLoading(true);
      console.log('🔍 === CARGANDO DATOS PRINCIPALES ===');
      
      const userToUse = currentUser || user;
      console.log('👤 Usuario para cargar datos:', {
        id: userToUse?.id,
        carrera: userToUse?.carrera,
        ciclo: userToUse?.ciclo
      });
      
      // 🔧 OBTENER MI TESIS (CON CICLO DESDE USUARIO VIA JOIN)
      const myThesis = await thesisService.getMyThesis();
      console.log('📋 === RESPUESTA DE MI TESIS ===');
      console.log('Has Thesis:', myThesis.hasThesis);
      console.log('Thesis Data:', myThesis.thesis);
      
      if (myThesis.hasThesis && myThesis.thesis) {
        console.log('✅ === USUARIO TIENE TESIS REGISTRADA ===');
        console.log('ID Tesis:', myThesis.thesis.id);
        console.log('Título:', myThesis.thesis.titulo);
        console.log('Ciclo (desde usuario):', myThesis.thesis.ciclo);
        console.log('Asesor:', myThesis.thesis.asesor_nombre);
        console.log('Estado:', myThesis.thesis.estado);
        console.log('========================================');
        
        setHasThesis(true);
        setThesisData(myThesis.thesis);
        
        // 🔧 CONFIGURAR FORMULARIO CON DATOS EXISTENTES
        const cicloFromProfile = userToUse?.ciclo;
        let cicloToUse = myThesis.thesis.ciclo; // Usar el ciclo que viene del backend (desde usuario)
        
        // Si por alguna razón no hay ciclo en la respuesta, usar el del perfil
        if (!cicloToUse && cicloFromProfile) {
          cicloToUse = cicloFromProfile === 5 ? 'V Ciclo' : 
                      cicloFromProfile === 6 ? 'VI Ciclo' : 'V Ciclo';
          console.log('⚠️ Usando ciclo desde perfil como fallback:', cicloToUse);
        }
        
        setFormData({
          titulo: myThesis.thesis.titulo || '',
          descripcion: myThesis.thesis.descripcion || '',
          ciclo: cicloToUse || 'V Ciclo',
        });
        
        // Configurar asesor seleccionado
        if (myThesis.thesis.id_asesor) {
          console.log('🎯 Asesor asignado ID:', myThesis.thesis.id_asesor);
          setSelectedAdvisor(myThesis.thesis.id_asesor);
        }
        
        console.log('🔧 FormData configurado para tesis existente:', {
          titulo: myThesis.thesis.titulo,
          descripcion: myThesis.thesis.descripcion?.substring(0, 30) + '...',
          ciclo: cicloToUse,
          asesor_id: myThesis.thesis.id_asesor
        });
        
      } else {
        console.log('📝 === USUARIO SIN TESIS - MOSTRAR FORMULARIO ===');
        setHasThesis(false);
        
        // 🔧 ASEGURAR CICLO PARA NUEVO REGISTRO
        if (userToUse?.ciclo) {
          const cicloFormateado = userToUse.ciclo === 5 ? 'V Ciclo' : 
                                  userToUse.ciclo === 6 ? 'VI Ciclo' : 'V Ciclo';
          
          setFormData(prev => ({
            ...prev,
            ciclo: cicloFormateado
          }));
          
          console.log('🔄 Ciclo configurado para nuevo registro:', cicloFormateado);
        }
        
        // Cargar asesores para el formulario
        await loadAdvisors(userToUse);
      }
      
    } catch (error) {
      console.error('❌ Error cargando datos principales:', error);
      setError('Error cargando los datos. Por favor recarga la página.');
    } finally {
      setLoading(false);
    }
  };

  // 🔧 CARGAR ASESORES FILTRADOS POR CARRERA - ERRORES CORREGIDOS
  const loadAdvisors = async (currentUser?: any) => {
    try {
      setAdvisorsLoading(true);
      const userToUse = currentUser || user;
      
      console.log('👨‍🏫 === CARGANDO ASESORES ===');
      console.log('Usuario:', userToUse?.email);
      console.log('Carrera del usuario:', userToUse?.carrera);
      
      const advisorsData = await thesisService.getAdvisors();
      console.log('📊 Respuesta de asesores:', {
        success: advisorsData.success,
        total: advisorsData.total || advisorsData.advisors?.length || 0
      });
      
      if (advisorsData.advisors && advisorsData.advisors.length > 0) {
        console.log('✅ Asesores recibidos:', advisorsData.advisors.length);
        
        // 🔧 CORRECCIÓN: Acceder a las propiedades correctas del backend
        console.log('Primer asesor (raw del backend):', {
          ...advisorsData.advisors[0]
        });
        
        // 🔧 MAPEAR ASESORES AL FORMATO CORRECTO - USANDO PROPIEDADES CORRECTAS
        const mappedAdvisors: Advisor[] = advisorsData.advisors.map((advisor: any) => {
          const fullName = advisor.name || '';
          const nameParts = fullName.split(' ');
          const nombre = nameParts.slice(0, 2).join(' ') || 'Sin nombre';
          const apellido = nameParts.slice(2).join(' ') || '';
          
          return {
            id_usuario: advisor.id, // ✅ CORRECTO: advisor.id del backend
            nombre: nombre,
            apellido: apellido,
            correo_institucional: advisor.email || '',
            especialidad: advisor.specialty || 'Sin especialidad', // ✅ CORRECTO: advisor.specialty del backend
            avatar_url: advisor.avatar_url,
            current_students: 0,
            max_capacity: 5,
            available_capacity: 5
          };
        });

        console.log('✅ Primer asesor mapeado correctamente:', {
          id_usuario: mappedAdvisors[0]?.id_usuario,
          nombre: mappedAdvisors[0]?.nombre,
          apellido: mappedAdvisors[0]?.apellido,
          especialidad: mappedAdvisors[0]?.especialidad,
          correo: mappedAdvisors[0]?.correo_institucional
        });
        
        console.log('✅ Especialidades disponibles:', 
          [...new Set(mappedAdvisors.map(a => a.especialidad))]);
        
        setAdvisors(mappedAdvisors);
        
        // 🔧 FILTRAR POR CARRERA DEL USUARIO
        if (userToUse?.carrera) {
          const filtered = filterAdvisorsByCareer(mappedAdvisors, userToUse.carrera);
          console.log(`🎯 Asesores filtrados para "${userToUse.carrera}":`, filtered.length);
          setFilteredAdvisors(filtered);
        } else {
          console.log('⚠️ Usuario sin carrera, mostrando todos los asesores');
          setFilteredAdvisors(mappedAdvisors);
        }
        
      } else {
        console.log('❌ No se recibieron asesores');
        setError('No se pudieron cargar los asesores disponibles');
      }
      
    } catch (error) {
      console.error('❌ Error cargando asesores:', error);
      setError('Error al cargar los asesores. Por favor, recarga la página.');
    } finally {
      setAdvisorsLoading(false);
    }
    console.log('========================');
  };

  // 🔧 FILTRAR ASESORES POR CARRERA DEL ESTUDIANTE
  const filterAdvisorsByCareer = (advisors: Advisor[], studentCareer: string): Advisor[] => {
    console.log('🔍 === FILTRANDO ASESORES POR CARRERA ===');
    console.log('Carrera del estudiante:', studentCareer);
    console.log('Total asesores antes del filtro:', advisors.length);
    
    // Mapeo de carreras a especialidades de asesores
    const careerMapping: { [key: string]: string[] } = {
      'Arquitectura de Plataformas y Servicios de TI': [
        'Desarrollo de Software', 'Ciberseguridad', 'Big Data y Analytics', 
        'Inteligencia Artificial', 'Redes y Telecomunicaciones'
      ],
      'Diseño y Desarrollo de Simuladores y Videojuegos': [
        'Desarrollo de Software', 'Videojuegos y Simuladores', 
        'Inteligencia Artificial', 'Diseño Gráfico'
      ],
      'Automatización Industrial': [
        'Automatización Industrial', 'Mecatrónica Industrial', 'Sistemas Embebidos',
        'Control de Procesos', 'Robótica Aplicada'
      ],
      'Mecatrónica Industrial': [
        'Mecatrónica Industrial', 'Automatización Industrial', 'Robótica Aplicada', 
        'Sistemas Embebidos', 'Control de Procesos'
      ],
      'Producción y Gestión Industrial': [
        'Producción y Manufactura', 'Gestión de Calidad', 'Automatización Industrial',
        'Logística y Supply Chain', 'Mejora Continua'
      ],
      'Gestión y Mantenimiento de Maquinaria Pesada': [
        'Maquinaria Pesada', 'Mantenimiento Industrial', 'Producción y Manufactura',
        'Gestión de Mantenimiento'
      ],
      'Mantenimiento de Equipo Pesado': [
        'Maquinaria Pesada', 'Mantenimiento Industrial', 'Gestión de Mantenimiento'
      ],
      'Diseño Industrial': [
        'Diseño Industrial', 'Producción y Manufactura', 'Desarrollo de Productos'
      ],
      'Administración de Negocios Internacionales': [
        'Negocios Internacionales', 'Marketing Digital', 'Gestión Empresarial',
        'Comercio Internacional'
      ],
      'Tecnología Mecánica Eléctrica': [
        'Mecatrónica Industrial', 'Automatización Industrial', 'Mantenimiento Industrial',
        'Sistemas Eléctricos'
      ]
    };

    const relevantSpecialties = careerMapping[studentCareer] || [];
    console.log('Especialidades relevantes:', relevantSpecialties);
    
    if (relevantSpecialties.length === 0) {
      console.log('⚠️ No hay mapeo específico, mostrando todos los asesores');
      return advisors;
    }

    const filtered = advisors.filter(advisor => {
      const match = relevantSpecialties.some(specialty => 
        advisor.especialidad.toLowerCase().includes(specialty.toLowerCase()) ||
        specialty.toLowerCase().includes(advisor.especialidad.toLowerCase())
      );
      console.log(`Asesor ${advisor.nombre}: "${advisor.especialidad}" - Match: ${match}`);
      return match;
    });
    
    console.log('Asesores después del filtro:', filtered.length);
    console.log('======================================');
    
    return filtered.length > 0 ? filtered : advisors; // Si no hay matches, mostrar todos
  };

  // 🔧 MANEJAR CAMBIOS EN INPUTS (CON PROTECCIÓN DE CICLO)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 🔧 PREVENIR CAMBIOS EN EL CICLO (CAMPO READONLY)
    if (name === 'ciclo') {
      console.log('⚠️ === INTENTO DE CAMBIAR CICLO BLOQUEADO ===');
      console.log('El ciclo está fijo desde el perfil del usuario');
      console.log('Ciclo actual:', formData.ciclo);
      console.log('Valor intentado:', value);
      console.log('===============================================');
      return; // No permitir cambios en el ciclo
    }
    
    console.log(`🔄 Campo ${name} actualizado:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔧 MANEJAR SELECCIÓN DE ASESOR
  const handleAdvisorSelect = (advisorId: number) => {
    console.log('👨‍🏫 === ASESOR SELECCIONADO ===');
    console.log('ID del asesor:', advisorId);
    
    const selectedAdvisorData = filteredAdvisors.find(a => a.id_usuario === advisorId);
    if (selectedAdvisorData) {
      console.log('Datos del asesor:', {
        nombre: selectedAdvisorData.nombre,
        apellido: selectedAdvisorData.apellido,
        especialidad: selectedAdvisorData.especialidad,
        email: selectedAdvisorData.correo_institucional
      });
    }
    
    setSelectedAdvisor(advisorId);
    console.log('==============================');
  };

  // 🔧 MANEJAR ENVÍO DEL FORMULARIO - CREAR O ACTUALIZAR
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    console.log('📝 === INICIANDO ENVÍO DE FORMULARIO ===');
    console.log('Modo:', isEditing ? 'EDICIÓN' : 'CREACIÓN');
    console.log('Datos del formulario:', {
      titulo: formData.titulo,
      descripcion: formData.descripcion?.substring(0, 50) + '...',
      ciclo: formData.ciclo,
      tesis_id: thesisData?.id
    });
    
    try {
      // Validaciones básicas
      if (!formData.titulo.trim()) {
        setError('Por favor ingresa el título de tu tesis');
        return;
      }

      if (formData.titulo.trim().length < 10) {
        setError('El título debe tener al menos 10 caracteres');
        return;
      }

      if (!formData.descripcion.trim()) {
        setError('Por favor ingresa la descripción del proyecto');
        return;
      }

      if (formData.descripcion.trim().length < 50) {
        setError('La descripción debe tener al menos 50 caracteres');
        return;
      }

      setSubmitting(true);
      setError('');

      let result;
      
      if (isEditing && thesisData?.id) {
        // 🔧 MODO EDICIÓN: ACTUALIZAR TESIS EXISTENTE
        console.log('📝 Actualizando tesis existente con ID:', thesisData.id);
        result = await thesisService.updateThesis(thesisData.id, {
          titulo: formData.titulo.trim(),
          descripcion: formData.descripcion.trim()
          // NO enviar id_asesor para evitar cambios accidentales
        });
        
        console.log('✅ Respuesta de actualización:', {
          success: result.success,
          message: result.message
        });
      } else {
        // 🔧 MODO CREACIÓN: NUEVA TESIS
        if (!selectedAdvisor) {
          setError('Por favor selecciona un asesor');
          return;
        }
        
        console.log('📝 Creando nueva tesis...');
        result = await thesisService.createThesis({
          titulo: formData.titulo.trim(),
          descripcion: formData.descripcion.trim(),
          ciclo: formData.ciclo,
          id_asesor: selectedAdvisor
        });
      }

      console.log('📋 === RESULTADO FINAL ===');
      console.log('Success:', result.success);
      console.log('Message:', result.message);
      console.log('Thesis data:', result.thesis);
      
      if (result.success) {
        console.log('✅ === OPERACIÓN EXITOSA ===');
        
        if (isEditing) {
          // 🔧 ACTUALIZAR DATOS LOCALES CON RESPUESTA DEL SERVIDOR
          if (result.thesis) {
            console.log('📊 Actualizando datos locales con:', {
              id: result.thesis.id,
              titulo: result.thesis.titulo,
              ciclo: result.thesis.ciclo,
              asesor: result.thesis.asesor_nombre
            });
            setThesisData(result.thesis);
          }
          
          // 🔧 VOLVER A VISTA DE TESIS REGISTRADA
          setIsEditing(false);
          setHasThesis(true);
          console.log('🔄 Modo edición desactivado - volviendo a vista normal');
        } else {
          // Nueva tesis creada
          localStorage.setItem('thesisJustCompleted', 'true');
          console.log('🎉 Nueva tesis registrada exitosamente');
        }
        
        // Recargar datos para asegurar consistencia
        await loadData();
        
      } else {
        console.log('❌ Error en la operación:', result.message);
        setError(result.message || 'Error al procesar la solicitud');
      }

    } catch (error: any) {
      console.error('❌ Error en handleSubmit:', error);
      setError(error.message || 'Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // 🔧 MANEJAR LOGOUT
  const handleLogout = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      await authService.logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // 🔧 MANEJAR EDICIÓN DE TESIS EXISTENTE
  const handleEdit = () => {
    console.log('✏️ === INICIANDO EDICIÓN DE TESIS ===');
    console.log('Datos actuales de la tesis:', {
      id: thesisData?.id,
      titulo: thesisData?.titulo,
      descripcion: thesisData?.descripcion?.substring(0, 50) + '...',
      ciclo: thesisData?.ciclo,
      asesor: thesisData?.asesor_nombre
    });
    
    // 🔧 CONFIGURAR FORMULARIO CON DATOS EXISTENTES
    setFormData({
      titulo: thesisData?.titulo || '',
      descripcion: thesisData?.descripcion || '',
      ciclo: thesisData?.ciclo || (user?.ciclo === 5 ? 'V Ciclo' : 'VI Ciclo')
    });
    
    // 🔧 CONFIGURAR ASESOR SELECCIONADO ACTUAL
    if (thesisData?.id_asesor) {
      setSelectedAdvisor(thesisData.id_asesor);
      console.log('Asesor actual configurado:', thesisData.id_asesor);
    }
    
    // 🔧 ACTIVAR MODO EDICIÓN
    setIsEditing(true);
    setHasThesis(false);
    
    // Cargar asesores si no están cargados (para mostrar opciones aunque estén bloqueadas)
    if (filteredAdvisors.length === 0 && user?.carrera) {
      console.log('🔄 Cargando asesores para modo edición...');
      loadAdvisors(user);
    }
    
    console.log('✅ Modo edición activado');
    console.log('======================================');
  };
  
  // 🔧 CANCELAR EDICIÓN
  const handleCancelEdit = () => {
    console.log('❌ === CANCELANDO EDICIÓN ===');
    console.log('Volviendo a vista de tesis registrada...');
    
    setIsEditing(false);
    setHasThesis(true);
    setError('');
    
    // 🔧 RESTAURAR DATOS ORIGINALES
    if (thesisData) {
      setFormData({
        titulo: thesisData.titulo || '',
        descripcion: thesisData.descripcion || '',
        ciclo: thesisData.ciclo || 'V Ciclo'
      });
    }
    
    console.log('✅ Edición cancelada correctamente');
  };

  // 🔧 RENDERIZADO - ESTADO DE CARGA
  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando información de tu tesis...</p>
          </div>
        </div>
        <style>{baseStyles}</style>
      </div>
    );
  }

  // 🔧 RENDERIZADO - TESIS EXISTENTE (VISTA NORMAL)
  if (hasThesis && thesisData && !isEditing) {
    console.log('🎯 Renderizando vista de tesis registrada');
    return (
      <div className="dashboard-container">
        <Sidebar onLogout={handleLogout} />
        <ThesisRegistered 
          thesisData={thesisData} 
          onEdit={handleEdit}
          onLogout={handleLogout}
        />
      </div>
    );
  }
  
  // 🔧 RENDERIZADO - MODO EDICIÓN
  if (isEditing && thesisData) {
    console.log('✏️ Renderizando formulario de edición');
    return (
      <div className="dashboard-container">
        <Sidebar onLogout={handleLogout} />
        <ThesisEditForm
          formData={formData}
          thesisData={thesisData}
          error={error}
          submitting={submitting}
          selectedAdvisor={selectedAdvisor}
          filteredAdvisors={filteredAdvisors}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onErrorClose={() => setError('')}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  // 🔧 RENDERIZADO - FORMULARIO DE REGISTRO (NUEVA TESIS)
  console.log('📝 Renderizando formulario de registro');
  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <ThesisForm
        formData={formData}
        cycles={cycles}
        error={error}
        submitting={submitting}
        selectedAdvisor={selectedAdvisor}
        filteredAdvisors={filteredAdvisors}
        advisorsLoading={advisorsLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onErrorClose={() => setError('')}
        onAdvisorSelect={handleAdvisorSelect}
      />
      <style>{baseStyles}</style>
    </div>
  );
};

export default MyThesis;