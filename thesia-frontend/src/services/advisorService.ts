import { apiService } from './api';
import type { AdvisorDocument } from '../components/Advisor/Documents/types/document.types';
import type { GetMyAdvisorResponse } from '../components/Advisor/types/advisor.types';

// 📡 SERVICIO PARA MI ASESOR
export const advisorService = {
  /**
   * ✅ Aceptar avance/documento
   */
  async acceptDocument(documentId: number): Promise<{ success: boolean; message: string }> {
    try {
  const response = await apiService.put(`/advisor/progress/${documentId}/accept`, {});
      return { success: true, message: response?.message || 'Avance aceptado' };
    } catch (error) {
      console.error('[AdvisorService] Error aceptando avance:', error);
      return { success: false, message: 'Error al aceptar avance' };
    }
  },

  /**
   * ❌ Rechazar avance/documento
   */
  async rejectDocument(documentId: number): Promise<{ success: boolean; message: string }> {
    try {
  const response = await apiService.put(`/advisor/progress/${documentId}/reject`, {});
      return { success: true, message: response?.message || 'Avance rechazado' };
    } catch (error) {
      console.error('[AdvisorService] Error rechazando avance:', error);
      return { success: false, message: 'Error al rechazar avance' };
    }
  },
  /**
   * 📄 Obtener documentos/avances pendientes de revisión para el asesor
   */
  async getPendingDocuments(): Promise<AdvisorDocument[]> {
    try {
      const response = await apiService.get('/advisor/progress/requests');
      // Suponiendo que el backend retorna un array de documentos con los campos correctos
  return response as unknown as AdvisorDocument[];
    } catch (error) {
      console.error('[AdvisorService] Error obteniendo documentos pendientes:', error);
      return [];
    }
  },

  /**
   * 💬 Agregar comentario del asesor a un avance/documento
   */
  async commentOnDocument(documentId: number, comentario: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.put(`/advisor/progress/${documentId}/comment`, { comentario });
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
  }
};

export default advisorService;