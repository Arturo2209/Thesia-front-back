import { apiService } from './api';
import type { 
  NotificationsApiResponse, 
  MarkAsReadResponse,
  NotificationFilter,
  NotificationData 
} from '../components/Notifications/types/notifications.types';

// 📡 SERVICIO PARA NOTIFICACIONES
export const notificationsService = {
  /**
   * 📋 Obtener notificaciones del usuario actual
   */
  async getMyNotifications(
    page: number = 1, 
    limit: number = 20, 
    filter?: NotificationFilter
  ): Promise<NotificationsApiResponse> {
    try {
      console.log('🔔 [NotificationsService] Obteniendo notificaciones...', { page, limit, filter });

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      // Aplicar filtros si existen
      if (filter?.type && filter.type !== 'all') {
        params.append('tipo', filter.type);
      }
      if (filter?.priority && filter.priority !== 'all') {
        params.append('prioridad', filter.priority);
      }
      if (filter?.isRead !== 'all' && typeof filter?.isRead === 'boolean') {
        params.append('leido', filter.isRead ? '1' : '0');
      }
      if (filter?.dateRange?.from) {
        params.append('fecha_desde', filter.dateRange.from);
      }
      if (filter?.dateRange?.to) {
        params.append('fecha_hasta', filter.dateRange.to);
      }

      // ✅ USAR apiService.get con type assertion
      const response = await apiService.get(`/notifications?${params.toString()}`) as any;
      
      console.log('✅ [NotificationsService] Notificaciones obtenidas:', response);
      
      // 🔧 Verificar estructura de la respuesta
      if (response && typeof response === 'object') {
        const typedResponse = response as NotificationsApiResponse;
        return typedResponse;
      } else {
        console.error('❌ Respuesta del servidor tiene formato inesperado:', response);
        throw new Error('Formato de respuesta inválido');
      }

    } catch (error) {
      console.error('❌ [NotificationsService] Error obteniendo notificaciones:', error);
      throw error;
    }
  },

  /**
   * 📖 Marcar una notificación como leída
   */
  async markAsRead(notificationId: number): Promise<MarkAsReadResponse> {
    try {
      console.log('📖 [NotificationsService] Marcando notificación como leída:', notificationId);

      // ✅ USAR PUT en lugar de PATCH (como en tu estructura)
      const response = await apiService.put(`/notifications/${notificationId}/read`, {
        leido: 1
      }) as any;
      
      console.log('✅ [NotificationsService] Notificación marcada como leída:', response);
      
      return {
        success: true,
        message: 'Notificación marcada como leída',
        updatedCount: 1
      };

    } catch (error) {
      console.error('❌ [NotificationsService] Error marcando notificación como leída:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error marcando notificación como leída',
        updatedCount: 0
      };
    }
  },

  /**
   * 📖 Marcar múltiples notificaciones como leídas
   */
  async markMultipleAsRead(notificationIds: number[]): Promise<MarkAsReadResponse> {
    try {
      console.log('📖 [NotificationsService] Marcando múltiples notificaciones como leídas:', notificationIds);

      // ✅ USAR PUT con array de IDs
      const response = await apiService.put('/notifications/read-multiple', {
        notificationIds,
        leido: 1
      }) as any;
      
      console.log('✅ [NotificationsService] Notificaciones marcadas como leídas:', response);
      
      return {
        success: true,
        message: 'Notificaciones marcadas como leídas',
        updatedCount: notificationIds.length
      };

    } catch (error) {
      console.error('❌ [NotificationsService] Error marcando notificaciones como leídas:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error marcando notificaciones como leídas',
        updatedCount: 0
      };
    }
  },

  /**
   * 📖 Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<MarkAsReadResponse> {
    try {
      console.log('📖 [NotificationsService] Marcando todas las notificaciones como leídas...');

      // ✅ USAR PUT para marcar todas
      const response = await apiService.put('/notifications/read-all', {
        leido: 1
      }) as any;
      
      console.log('✅ [NotificationsService] Todas las notificaciones marcadas como leídas:', response);
      
      return {
        success: true,
        message: 'Todas las notificaciones marcadas como leídas',
        updatedCount: response.updatedCount || 0
      };

    } catch (error) {
      console.error('❌ [NotificationsService] Error marcando todas las notificaciones como leídas:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error marcando todas las notificaciones como leídas',
        updatedCount: 0
      };
    }
  },

  /**
   * 🗑️ Eliminar una notificación
   */
  async deleteNotification(notificationId: number): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🗑️ [NotificationsService] Eliminando notificación:', notificationId);

      // ✅ USAR apiService.delete
      const response = await apiService.delete(`/notifications/${notificationId}`) as any;
      
      console.log('✅ [NotificationsService] Notificación eliminada:', response);
      
      return {
        success: true,
        message: 'Notificación eliminada exitosamente'
      };

    } catch (error) {
      console.error('❌ [NotificationsService] Error eliminando notificación:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error eliminando notificación'
      };
    }
  },

  /**
   * 🔔 Obtener contador de notificaciones no leídas
   */
  async getUnreadCount(): Promise<{ success: boolean; unreadCount: number }> {
    try {
      console.log('🔔 [NotificationsService] Obteniendo contador de no leídas...');

      // ✅ USAR apiService.get
      const response = await apiService.get('/notifications/unread-count') as any;
      
      console.log('✅ [NotificationsService] Contador obtenido:', response);
      
      return {
        success: true,
        unreadCount: response.unreadCount || 0
      };

    } catch (error) {
      console.error('❌ [NotificationsService] Error obteniendo contador:', error);
      
      return {
        success: false,
        unreadCount: 0
      };
    }
  },

  /**
   * 🔔 Crear una nueva notificación
   * 🎯 MÉTODO CORREGIDO PARA INTEGRACIONES AUTOMÁTICAS
   */
  async createNotification(notificationData: {
    id_usuario: number;
    mensaje: string;
    tipo: 'reunion' | 'plazo' | 'comentario' | 'estado' | 'general' | 'documento';
    prioridad?: 'alta' | 'media' | 'baja';
    id_referencia?: number | undefined; // ← CORREGIDO: undefined en lugar de number
    tipo_referencia?: 'reunion' | 'documento' | 'tesis' | 'comentario' | undefined; // ← CORREGIDO
  }): Promise<{ success: boolean; message: string; notification?: NotificationData }> {
    try {
      console.log('🔔 [NotificationsService] Creando nueva notificación:', notificationData);

      // 🔧 LIMPIAR DATOS ANTES DE ENVIAR
      const cleanData = {
        id_usuario: notificationData.id_usuario,
        mensaje: notificationData.mensaje,
        tipo: notificationData.tipo,
        prioridad: notificationData.prioridad || 'media',
        id_referencia: notificationData.id_referencia || null, // ← CONVERTIR undefined a null
        tipo_referencia: notificationData.tipo_referencia || null // ← CONVERTIR undefined a null
      };

      console.log('🧹 [NotificationsService] Datos limpiados para envío:', cleanData);

      // ✅ USAR apiService.post
      const response = await apiService.post('/notifications', cleanData) as any;
      
      console.log('✅ [NotificationsService] Notificación creada exitosamente:', response);
      
      return {
        success: true,
        message: 'Notificación creada exitosamente',
        notification: response.notification || null
      };

    } catch (error) {
      console.error('❌ [NotificationsService] Error creando notificación:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error creando notificación'
      };
    }
  },

  /**
   * 🧪 Obtener estadísticas de notificaciones (para admin/debug)
   */
  async getNotificationStats(): Promise<{
    success: boolean;
    stats?: {
      total: number;
      unread: number;
      byType: Record<NotificationData['tipo'], number>;
      byPriority: Record<NotificationData['prioridad'], number>;
      recent: number; // últimas 24h
    };
    message: string;
  }> {
    try {
      console.log('📊 [NotificationsService] Obteniendo estadísticas de notificaciones...');

      // ✅ USAR apiService.get
      const response = await apiService.get('/notifications/stats') as any;
      
      console.log('✅ [NotificationsService] Estadísticas obtenidas:', response);
      
      return {
        success: true,
        stats: response.stats || {},
        message: 'Estadísticas obtenidas exitosamente'
      };

    } catch (error) {
      console.error('❌ [NotificationsService] Error obteniendo estadísticas:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error obteniendo estadísticas'
      };
    }
  },

  /**
   * 🔄 Polling para notificaciones en tiempo real (alternativa a WebSockets)
   */
  async checkForNewNotifications(lastCheck: string): Promise<{
    success: boolean;
    hasNew: boolean;
    newNotifications: NotificationData[];
    unreadCount: number;
    message: string;
  }> {
    try {
      console.log('🔄 [NotificationsService] Verificando nuevas notificaciones desde:', lastCheck);

      // ✅ USAR apiService.get con parámetros
      const response = await apiService.get(`/notifications/check-new?since=${encodeURIComponent(lastCheck)}`) as any;
      
      if (response.hasNew) {
        console.log('🆕 [NotificationsService] Nuevas notificaciones encontradas:', response.newNotifications?.length || 0);
      }
      
      return {
        success: true,
        hasNew: response.hasNew || false,
        newNotifications: response.newNotifications || [],
        unreadCount: response.unreadCount || 0,
        message: 'Verificación completada'
      };

    } catch (error) {
      console.error('❌ [NotificationsService] Error verificando nuevas notificaciones:', error);
      
      return {
        success: false,
        hasNew: false,
        newNotifications: [],
        unreadCount: 0,
        message: error instanceof Error ? error.message : 'Error verificando nuevas notificaciones'
      };
    }
  }
};

export default notificationsService;