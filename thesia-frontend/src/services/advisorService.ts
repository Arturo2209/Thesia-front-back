import { apiService } from './api';
import type { AdvisorDocument } from '../components/Advisor/Documents/types/document.types';
import type { GetMyAdvisorResponse } from '../components/Advisor/types/advisor.types';
import type { AdvisorStudent } from '../components/Advisor/Students/types/student.types';

// 📡 SERVICIO PARA MI ASESOR
export const advisorService = {
  /**
   * ✅ Aceptar avance/documento
   */
  async acceptDocument(documentId: number): Promise<{ success: boolean; message: string }> {
    try {
  const response = await apiService.put(`/advisor/documents/${documentId}/approve`, {});
      return { success: true, message: response?.message || 'Avance aceptado' };
    } catch (error) {
      console.error('[AdvisorService] Error aceptando avance:', error);
      return { success: false, message: 'Error al aceptar avance' };
    }
  },

  /**
   * ❌ Rechazar avance/documento
   */
  /**
   * 📄 Obtener documentos/avances pendientes de revisión para el asesor
   */
  async getPendingDocuments(): Promise<AdvisorDocument[]> {
    try {
      const response = await apiService.get('/advisor/documents') as unknown as GetPendingDocumentsResponse;
      // Mapear respuesta del backend (data: Documento[] crudo) al tipo esperado por el front
      const rows = Array.isArray(response?.data) ? response.data : [];
      const mapped: AdvisorDocument[] = rows.map((row: any) => ({
        id: Number(row.id_documento ?? row.id ?? 0),
        studentId: row.id_estudiante ? Number(row.id_estudiante) : undefined,
        title: row.nombre_archivo || row.tipo_entrega || 'Documento',
        student: row.estudiante || [row.estudiante_nombre, row.estudiante_apellido].filter(Boolean).join(' ') || 'Desconocido',
        status: (row.estado || 'pendiente') as AdvisorDocument['status'],
        submittedAt: row.fecha_subida ? new Date(row.fecha_subida).toLocaleString() : '',
        comentarios: row.comentarios ?? null,
        fileUrl: row.url_archivo || undefined,
        phase: row.fase || undefined,
        description: row.tipo_entrega || undefined,
      }));
      return mapped;
    } catch (error) {
      console.error('[AdvisorService] Error obteniendo documentos pendientes:', error);
      return [];
    }
  },

  /**
   * � Obtener historial de documentos revisados por el asesor
   */
  async getDocumentsHistory(): Promise<AdvisorDocument[]> {
    try {
      const response = await apiService.get('/advisor/documents/history') as any;
      const rows = Array.isArray(response?.data) ? response.data : [];
      const mapped: AdvisorDocument[] = rows.map((row: any) => ({
        id: Number(row.id_documento ?? row.id ?? 0),
        studentId: row.id_estudiante ? Number(row.id_estudiante) : undefined,
        title: row.nombre_archivo || row.tipo_entrega || 'Documento',
        student: (row.estudiante_nombre || row.nombre || '') + (row.estudiante_apellido ? ` ${row.estudiante_apellido}` : ''),
        status: (row.estado || 'pendiente') as AdvisorDocument['status'],
        submittedAt: row.fecha_subida ? new Date(row.fecha_subida).toLocaleString() : '',
        comentarios: row.comentarios ?? null,
        fileUrl: row.url_archivo || undefined,
        phase: row.fase || undefined,
        description: row.tipo_entrega || undefined,
      }));
      return mapped;
    } catch (error) {
      console.error('[AdvisorService] Error obteniendo historial de documentos:', error);
      return [];
    }
  },

  /**
   * �💬 Agregar comentario del asesor a un avance/documento
   */
  async commentOnDocument(documentId: number, comentario: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.put(`/advisor/documents/${documentId}/comment`, { comment: comentario });
      return { success: true, message: response?.message || 'Comentario agregado' };
    } catch (error) {
      console.error('[AdvisorService] Error comentando documento:', error);
      return { success: false, message: 'Error al agregar comentario' };
    }
  },
  /**
   * 🎯 Obtener MI asesor asignado
   */
  async getMyAdvisor(): Promise<GetMyAdvisorResponse> {
    try {
      console.log('🔄 [AdvisorService] Obteniendo mi asesor...');
      
      // ✅ USAR apiService.get con type assertion
      const response = await apiService.get('/advisors/my-advisor') as any;
      
      // ✅ response YA ES directamente la data del servidor
      console.log('✅ [AdvisorService] Respuesta recibida:', response);
      
      // 🔧 Verificar estructura de la respuesta
      if (response && typeof response === 'object') {
        const typedResponse = response as GetMyAdvisorResponse;
        
        console.log('📊 Asesor obtenido:', {
          success: typedResponse.success,
          hasAdvisor: !!typedResponse.advisor,
          advisorName: typedResponse.advisor?.name
        });
        
        return typedResponse;
      } else {
        console.error('❌ Respuesta del servidor tiene formato inesperado:', response);
        throw new Error('Formato de respuesta inválido');
      }

    } catch (error) {
      console.error('❌ [AdvisorService] Error obteniendo mi asesor:', error);
      
      // 🔧 Retornar respuesta de error estructurada
      return {
        success: false,
        advisor: null,
        message: error instanceof Error ? error.message : 'Error cargando información del asesor'
      };
    }
  },

  /**
   * 📅 Agendar reunión con el asesor (próximamente)
   */
  async scheduleMeeting(advisorId: number, meetingData: any): Promise<any> {
    try {
      console.log('🔄 [AdvisorService] Agendando reunión...');
      
      // ✅ Type assertion para evitar errores de TypeScript
      const response = await apiService.post(`/advisors/${advisorId}/meetings`, meetingData) as any;
      
      return {
        success: true,
        meeting: response.meeting || null,
        message: 'Reunión agendada exitosamente'
      };

    } catch (error) {
      console.error('❌ [AdvisorService] Error agendando reunión:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error agendando reunión'
      };
    }
  },

  /**
   * 💬 Enviar mensaje al asesor (próximamente)
   */
  async sendMessage(advisorId: number, messageData: any): Promise<any> {
    try {
      console.log('🔄 [AdvisorService] Enviando mensaje...');
      
      // ✅ Type assertion para evitar errores de TypeScript
      const response = await apiService.post(`/advisors/${advisorId}/messages`, messageData) as any;
      
      return {
        success: true,
        message: response.message || 'Mensaje enviado',
        messageId: response.messageId || null
      };

    } catch (error) {
      console.error('❌ [AdvisorService] Error enviando mensaje:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error enviando mensaje'
      };
    }
  },

  /**
   * 📊 Obtener horarios de disponibilidad del asesor (próximamente)
   */
  async getAdvisorSchedule(advisorId: number): Promise<any> {
    try {
      console.log('🔄 [AdvisorService] Obteniendo horarios...');
      
      // ✅ Type assertion para evitar errores de TypeScript
      const response = await apiService.get(`/advisors/${advisorId}/schedule`) as any;
      
      return {
        success: true,
        schedule: response.schedule || []
      };

    } catch (error) {
      console.error('❌ [AdvisorService] Error obteniendo horarios:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error cargando horarios'
      };
    }
  },

  /**
   * 📚 Obtener estudiantes asignados al asesor
   */
  async getAssignedStudents(): Promise<AdvisorStudent[]> {
    try {
      console.log('🔄 [AdvisorService] Obteniendo estudiantes asignados...');

      const response = (await apiService.get('/advisor/students')) as unknown as GetAssignedStudentsResponse;
      console.log('✅ [AdvisorService] Respuesta del backend:', response);

      const mappedStudents = response.students.map((student) => ({
        id: student.id,
        name: student.name || 'Sin nombre',
        email: student.email || 'Sin correo',
        specialty: student.specialty || 'Sin especialidad',
        thesisTitle: student.thesisTitle || 'Sin título',
        phase: student.phase || 'Sin fase',
        assignedDate: student.assignedDate || 'Sin fecha',
      }));

      console.log('✅ [AdvisorService] Estudiantes mapeados:', mappedStudents);
      return mappedStudents;
    } catch (error) {
      console.error('❌ [AdvisorService] Error obteniendo estudiantes asignados:', error);
      return [];
    }
  },

  /**
   * ✅ Aprobar documento
   */
  async approveDocument(documentId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.put(`/advisor/documents/${documentId}/approve`, {});
      return { success: true, message: response?.message || 'Documento aprobado' };
    } catch (error) {
      console.error('[AdvisorService] Error aprobando documento:', error);
      return { success: false, message: 'Error al aprobar documento' };
    }
  },

  /**
   * ❌ Rechazar documento
   */
  async rejectDocument(documentId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.put(`/advisor/documents/${documentId}/reject`, {});
      return { success: true, message: response?.message || 'Documento rechazado' };
    } catch (error) {
      console.error('[AdvisorService] Error rechazando documento:', error);
      return { success: false, message: 'Error al rechazar documento' };
    }
  },
};

export default advisorService;

/**
 * Interfaz para la respuesta de obtener estudiantes asignados
 */
interface GetAssignedStudentsResponse {
  success: boolean;
  students: Array<{
    id: number;
    name: string;
    email: string;
    specialty: string;
    thesisTitle?: string;
    phase?: string;
    assignedDate?: string;
  }>;
  total: number;
  timestamp: string;
}

interface GetPendingDocumentsResponse {
  success: boolean;
  data: any[];
  count: number;
}