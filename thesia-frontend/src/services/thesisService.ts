import type { 
  CreateThesisRequest, 
  UpdateThesisRequest, 
  ThesisServiceResponse, 
  AdvisorsResponse 
} from '../components/Thesis/types/thesis.types';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

console.log('🚀 THESIS SERVICE CARGADO - VERSIÓN 3.0 CON AUTO-CICLO');

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const thesisService = {
  // 🔧 OBTENER ASESORES - MEJORADO
  async getAdvisors(): Promise<AdvisorsResponse> {
    try {
      const token = getToken();
      console.log('👨‍🏫 === OBTENIENDO ASESORES (thesisService) ===');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }
      
      const response = await fetch(`${API_BASE}/advisors`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status advisors:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Error obteniendo asesores`);
      }

      const data: AdvisorsResponse = await response.json();
      console.log('✅ Asesores obtenidos exitosamente:', {
        total: data.total || data.advisors?.length || 0,
        primera_especialidad: data.advisors?.[0]?.especialidad || 'N/A'
      });
      
      return data;
      
    } catch (error) {
      console.error('❌ Error en getAdvisors (thesisService):', error);
      throw error;
    }
  },

  // 🔧 OBTENER MI TESIS - CON SOPORTE PARA CICLO DESDE USUARIO
  async getMyThesis(): Promise<ThesisServiceResponse> {
    try {
      const token = getToken();
      console.log('📖 === OBTENIENDO MI TESIS (thesisService) ===');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }
      
      const response = await fetch(`${API_BASE}/thesis/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status getMyThesis:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('ℹ️ No se encontró tesis registrada');
          return { 
            success: true, 
            hasThesis: false, 
            thesis: undefined,
            message: 'No tienes una tesis registrada aún'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ThesisServiceResponse = await response.json();
      
      console.log('📖 === RESPUESTA COMPLETA DE MI TESIS ===');
      console.log('Success:', result.success);
      console.log('Has Thesis:', result.hasThesis);
      
      if (result.hasThesis && result.thesis) {
        console.log('✅ TESIS ENCONTRADA CON DATOS COMPLETOS:');
        console.log('  🆔 ID:', result.thesis.id);
        console.log('  📝 Título:', result.thesis.titulo);
        console.log('  🔄 Ciclo (desde usuario):', result.thesis.ciclo);
        console.log('  👨‍🏫 Asesor:', result.thesis.asesor_nombre);
        console.log('  📧 Email Asesor:', result.thesis.asesor_email);
        console.log('  🎓 Carrera:', result.thesis.carrera);
        console.log('  🏫 Código Estudiante:', result.thesis.codigo_estudiante);
        console.log('  📊 Estado:', result.thesis.estado);
        console.log('  📅 Fecha Límite:', result.thesis.fecha_limite);
      } else {
        console.log('ℹ️ Usuario sin tesis registrada');
      }
      
      console.log('==========================================');
      return result;
      
    } catch (error) {
      console.error('❌ Error en getMyThesis (thesisService):', error);
      throw error;
    }
  },

  // 🔧 CREAR TESIS - CON VALIDACIÓN DE CICLO DESDE PERFIL
  async createThesis(thesisData: CreateThesisRequest): Promise<ThesisServiceResponse> {
    try {
      const token = getToken();
      console.log('📝 === CREANDO TESIS (thesisService) ===');
      console.log('Datos enviados:', {
        titulo: thesisData.titulo,
        descripcion: thesisData.descripcion?.substring(0, 50) + '...',
        ciclo: thesisData.ciclo,
        id_asesor: thesisData.id_asesor
      });
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      // 🔧 VALIDACIONES FRONTEND
      if (!thesisData.titulo?.trim()) {
        throw new Error('El título es obligatorio');
      }

      if (!thesisData.descripcion?.trim()) {
        throw new Error('La descripción es obligatoria');
      }

      if (!thesisData.ciclo) {
        throw new Error('El ciclo es obligatorio');
      }

      if (!thesisData.id_asesor) {
        throw new Error('Debes seleccionar un asesor');
      }

      // Validar formato de ciclo
      if (!['V Ciclo', 'VI Ciclo'].includes(thesisData.ciclo)) {
        throw new Error('Ciclo inválido. Solo se permite V Ciclo o VI Ciclo');
      }

      const requestBody = {
        titulo: thesisData.titulo.trim(),
        descripcion: thesisData.descripcion.trim(),
        ciclo: thesisData.ciclo,
        id_asesor: thesisData.id_asesor
      };

      console.log('📤 Body de la petición:', requestBody);

      const response = await fetch(`${API_BASE}/thesis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status createThesis:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor al crear tesis:', errorData);
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }

      const result: ThesisServiceResponse = await response.json();
      
      console.log('✅ === TESIS CREADA EXITOSAMENTE ===');
      console.log('Success:', result.success);
      console.log('Message:', result.message);
      if (result.thesis) {
        console.log('Tesis creada:', {
          id: result.thesis.id,
          titulo: result.thesis.titulo,
          ciclo: result.thesis.ciclo,
          asesor: result.thesis.asesor_nombre,
          estado: result.thesis.estado
        });
      }
      console.log('=====================================');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en createThesis (thesisService):', error);
      throw error;
    }
  },

  // 🔧 ACTUALIZAR TESIS - MANTENIENDO CICLO DESDE USUARIO
  async updateThesis(thesisId: number, thesisData: UpdateThesisRequest): Promise<ThesisServiceResponse> {
    try {
      const token = getToken();
      console.log('📝 === ACTUALIZANDO TESIS (thesisService) ===');
      console.log('ID Tesis:', thesisId);
      console.log('Datos a actualizar:', {
        titulo: thesisData.titulo,
        descripcion: thesisData.descripcion?.substring(0, 50) + '...',
        id_asesor: thesisData.id_asesor
      });
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      // Validaciones frontend
      if (!thesisData.titulo?.trim()) {
        throw new Error('El título es obligatorio');
      }

      if (!thesisData.descripcion?.trim()) {
        throw new Error('La descripción es obligatoria');
      }

      const requestBody = {
        titulo: thesisData.titulo.trim(),
        descripcion: thesisData.descripcion.trim(),
        ...(thesisData.id_asesor && { id_asesor: thesisData.id_asesor })
      };

      console.log('📤 Body de actualización:', requestBody);

      const response = await fetch(`${API_BASE}/thesis/${thesisId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status updateThesis:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error actualizando tesis:', errorData);
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }

      const result: ThesisServiceResponse = await response.json();
      
      console.log('✅ === TESIS ACTUALIZADA EXITOSAMENTE ===');
      console.log('Success:', result.success);
      console.log('Message:', result.message);
      if (result.thesis) {
        console.log('Tesis actualizada:', {
          id: result.thesis.id,
          titulo: result.thesis.titulo,
          ciclo: result.thesis.ciclo, // Mantiene el ciclo desde usuario
          asesor: result.thesis.asesor_nombre
        });
      }
      console.log('=======================================');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en updateThesis (thesisService):', error);
      throw error;
    }
  },

  // 🔧 OBTENER TESIS POR ID
  async getThesisById(thesisId: number): Promise<ThesisServiceResponse> {
    try {
      const token = getToken();
      console.log('🔍 === OBTENIENDO TESIS POR ID (thesisService) ===');
      console.log('ID solicitado:', thesisId);
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${API_BASE}/thesis/${thesisId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status getThesisById:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tesis no encontrada');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result: ThesisServiceResponse = await response.json();
      
      console.log('✅ Tesis obtenida por ID:', {
        id: result.thesis?.id,
        titulo: result.thesis?.titulo,
        ciclo: result.thesis?.ciclo
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en getThesisById (thesisService):', error);
      throw error;
    }
  },

  // 🔧 OBTENER TODAS LAS TESIS (PARA ADMIN/ASESORES)
  async getAllThesis(): Promise<ThesisServiceResponse> {
    try {
      const token = getToken();
      console.log('📚 === OBTENIENDO TODAS LAS TESIS (thesisService) ===');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${API_BASE}/thesis`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status getAllThesis:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result: ThesisServiceResponse = await response.json();
      console.log('✅ Todas las tesis obtenidas exitosamente');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en getAllThesis (thesisService):', error);
      throw error;
    }
  },

  // 🔧 ELIMINAR TESIS (SOFT DELETE)
  async deleteThesis(thesisId: number): Promise<ThesisServiceResponse> {
    try {
      const token = getToken();
      console.log('🗑️ === ELIMINANDO TESIS (thesisService) ===');
      console.log('ID a eliminar:', thesisId);
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${API_BASE}/thesis/${thesisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status deleteThesis:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }

      const result: ThesisServiceResponse = await response.json();
      console.log('✅ Tesis eliminada exitosamente');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en deleteThesis (thesisService):', error);
      throw error;
    }
  }
};

export default thesisService;