import { useState, useEffect, useCallback, useMemo } from 'react';
import { notificationsService } from '../../../services/notificationsService';
import type {
  NotificationsState,
  NotificationFilter,
  Notification,
  NotificationData
} from '../types/notifications.types';

// 🔧 HELPER FUNCTIONS
const notificationHelpers = {
  // 🔄 Transformar NotificationData (BD) a Notification (Frontend)
  transformNotification: (data: NotificationData): Notification => {
    return {
      id: data.id_notificacion,
      userId: data.id_usuario,
      message: data.mensaje,
      type: data.tipo,
      isRead: data.leido === 1,
      referenceId: data.id_referencia,
      referenceType: data.tipo_referencia,
      priority: data.prioridad,
      createdAt: data.fecha_creacion,
      sentAt: data.fecha_envio,
      // Campos calculados
      timeAgo: notificationHelpers.formatTimeAgo(data.fecha_envio),
      icon: notificationHelpers.getTypeIcon(data.tipo),
      color: notificationHelpers.getPriorityColor(data.prioridad),
      actionUrl: notificationHelpers.getActionUrl(data.tipo, data.id_referencia, data.tipo_referencia)
    };
  },

  // 📅 Formatear tiempo relativo
  formatTimeAgo: (dateString: string): string => {
    if (!dateString) return 'Sin fecha';
    
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now.getTime() - past.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return 'Ahora';
      if (diffMinutes < 60) return `hace ${diffMinutes} min`;
      if (diffHours < 24) return `hace ${diffHours}h`;
      if (diffDays < 7) return `hace ${diffDays}d`;
      if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem`;
      return past.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  },

  // 🎨 Obtener icono por tipo
  getTypeIcon: (type: NotificationData['tipo']): string => {
    const icons = {
      'plazo': '⏰',
      'comentario': '💬',
      'reunion': '📅',
      'estado': '📋',
      'general': '📢',
      'documento': '📄'
    };
    return icons[type] || '📢';
  },

  // 🎨 Obtener color por prioridad
  getPriorityColor: (priority: NotificationData['prioridad']): string => {
    const colors = {
      'alta': '#EF4444',
      'media': '#F59E0B',
      'baja': '#10B981'
    };
    return colors[priority] || '#6B7280';
  },

  // 🔗 Obtener URL de acción
  getActionUrl: (
    type: NotificationData['tipo'], 
    referenceId?: number, 
    referenceType?: NotificationData['tipo_referencia']
  ): string | undefined => {
    if (!referenceId) return undefined;

    switch (type) {
      case 'documento':
        return '/mis-documentos';
      case 'reunion':
        return '/mi-asesor';
      case 'comentario':
        return referenceType === 'documento' ? '/mis-documentos' : '/mi-asesor';
      case 'estado':
        return referenceType === 'tesis' ? '/mi-tesis' : '/mis-documentos';
      case 'plazo':
        return '/mi-tesis';
      case 'general':
        return '/dashboard';
      default:
        return undefined;
    }
  },

  // 🏷️ Obtener texto de tipo para mostrar  
  getTypeLabel: (type: NotificationData['tipo']): string => {
    const labels = {
      'plazo': 'Fecha límite',
      'comentario': 'Comentario',
      'reunion': 'Reunión',
      'estado': 'Estado',
      'general': 'General',
      'documento': 'Documento'
    };
    return labels[type] || 'Notificación';
  },

  // 🏷️ Obtener texto de prioridad
  getPriorityLabel: (priority: NotificationData['prioridad']): string => {
    const labels = {
      'alta': 'Alta',
      'media': 'Media',
      'baja': 'Baja'
    };
    return labels[priority] || 'Media';
  }
};

// 🎯 HOOK PRINCIPAL
export const useNotifications = () => {
  // 📱 Estado principal
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    loading: true,
    error: null,
    unreadCount: 0,
    filter: {
      type: 'all',
      priority: 'all',
      isRead: 'all'
    },
    hasMore: false,
    page: 1
  });

  // 🔄 Cargar notificaciones
  const loadNotifications = useCallback(async (
    page: number = 1, 
    reset: boolean = false
  ): Promise<void> => {
    try {
      if (reset) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      console.log('🔔 === CARGANDO NOTIFICACIONES ===', { page, filter: state.filter });

      const response = await notificationsService.getMyNotifications(
        page, 
        20, 
        state.filter
      );

      if (response.success) {
        // 🔄 Transformar datos de BD a formato frontend
        const transformedNotifications = response.notifications.map(
          notificationHelpers.transformNotification
        );

        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
          notifications: reset 
            ? transformedNotifications 
            : [...prev.notifications, ...transformedNotifications],
          unreadCount: response.unreadCount,
          hasMore: response.hasMore,
          page: response.page
        }));

        console.log('✅ Notificaciones cargadas:', {
          total: transformedNotifications.length,
          unread: response.unreadCount,
          hasMore: response.hasMore
        });

      } else {
        throw new Error(response.message || 'Error cargando notificaciones');
      }

    } catch (error) {
      console.error('❌ Error cargando notificaciones:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, [state.filter]);

  // 📖 Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId: number): Promise<boolean> => {
    try {
      console.log('📖 Marcando como leída:', notificationId);

      const response = await notificationsService.markAsRead(notificationId);

      if (response.success) {
        // 🔄 Actualizar estado local
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          ),
          unreadCount: Math.max(0, prev.unreadCount - 1)
        }));

        console.log('✅ Notificación marcada como leída');
        return true;
      } else {
        console.error('❌ Error del servidor:', response.message);
        return false;
      }

    } catch (error) {
      console.error('❌ Error marcando como leída:', error);
      return false;
    }
  }, []);

  // 📖 Marcar todas como leídas
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      console.log('📖 Marcando todas como leídas...');

      const response = await notificationsService.markAllAsRead();

      if (response.success) {
        // 🔄 Actualizar estado local
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.map(notification => ({
            ...notification,
            isRead: true
          })),
          unreadCount: 0
        }));

        console.log('✅ Todas las notificaciones marcadas como leídas');
        return true;
      } else {
        console.error('❌ Error del servidor:', response.message);
        return false;
      }

    } catch (error) {
      console.error('❌ Error marcando todas como leídas:', error);
      return false;
    }
  }, []);

  // 🗑️ Eliminar notificación
  const deleteNotification = useCallback(async (notificationId: number): Promise<boolean> => {
    try {
      console.log('🗑️ Eliminando notificación:', notificationId);

      const response = await notificationsService.deleteNotification(notificationId);

      if (response.success) {
        // 🔄 Remover del estado local
        setState(prev => {
          const notification = prev.notifications.find(n => n.id === notificationId);
          const wasUnread = notification && !notification.isRead;
          
          return {
            ...prev,
            notifications: prev.notifications.filter(n => n.id !== notificationId),
            unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount
          };
        });

        console.log('✅ Notificación eliminada');
        return true;
      } else {
        console.error('❌ Error del servidor:', response.message);
        return false;
      }

    } catch (error) {
      console.error('❌ Error eliminando notificación:', error);
      return false;
    }
  }, []);

  // 🔍 Actualizar filtros
  const updateFilter = useCallback((newFilter: Partial<NotificationFilter>): void => {
    console.log('🔍 Actualizando filtros:', newFilter);
    
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, ...newFilter },
      page: 1 // Reset página al cambiar filtros
    }));
  }, []);

  // 🔄 Refrescar notificaciones
  const refresh = useCallback(async (): Promise<void> => {
    await loadNotifications(1, true);
  }, [loadNotifications]);

  // 📄 Cargar más notificaciones (paginación)
  const loadMore = useCallback(async (): Promise<void> => {
    if (!state.hasMore || state.loading) return;
    
    await loadNotifications(state.page + 1, false);
  }, [loadNotifications, state.hasMore, state.loading, state.page]);

  // 🔔 Obtener contador de no leídas
  const refreshUnreadCount = useCallback(async (): Promise<void> => {
    try {
      const response = await notificationsService.getUnreadCount();
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          unreadCount: response.unreadCount
        }));
      }
    } catch (error) {
      console.error('❌ Error obteniendo contador:', error);
    }
  }, []);

  // 🚀 Cargar datos iniciales
  useEffect(() => {
    loadNotifications(1, true);
  }, [state.filter]); // Recargar cuando cambien los filtros

  // 📊 Datos computados usando useMemo
  const computedData = useMemo(() => {
    const unreadNotifications = state.notifications.filter(n => !n.isRead);
    const readNotifications = state.notifications.filter(n => n.isRead);
    
    const notificationsByType = state.notifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const notificationsByPriority = state.notifications.reduce((acc, notification) => {
      acc[notification.priority] = (acc[notification.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      unreadNotifications,
      readNotifications,
      notificationsByType,
      notificationsByPriority,
      hasUnread: unreadNotifications.length > 0,
      totalCount: state.notifications.length
    };
  }, [state.notifications]);

  return {
    // 📱 Estado
    ...state,
    
    // 📊 Datos computados
    ...computedData,
    
    // 🔄 Acciones
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateFilter,
    refreshUnreadCount,
    
    // 🧠 Helpers
    helpers: notificationHelpers
  };
};

export default useNotifications;