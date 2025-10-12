import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import type { Notification } from '../types/notifications.types';

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  hasMore: boolean;
  unreadCount: number;
  onMarkAsRead: (id: number) => Promise<boolean>;
  onMarkAllAsRead: () => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onLoadMore: () => Promise<void>;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  loading,
  hasMore,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onLoadMore
}) => {
  const navigate = useNavigate();

  // 📖 Manejar clic en notificación
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Marcar como leída si no lo está
      if (!notification.isRead) {
        await onMarkAsRead(notification.id);
      }

      // Navegar a la URL de acción si existe
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
    } catch (error) {
      console.error('❌ Error manejando clic en notificación:', error);
    }
  };

  // 📖 Manejar marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      const success = await onMarkAllAsRead();
      if (!success) {
        alert('❌ Error marcando notificaciones como leídas');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error de conexión');
    }
  };

  // 🔄 Loading state
  if (loading && notifications.length === 0) {
    return (
      <div className="notifications-loading">
        <div className="loading-spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  // 📭 Empty state
  if (!loading && notifications.length === 0) {
    return (
      <div className="notifications-empty">
        <div className="empty-icon">🔔</div>
        <h3>No tienes notificaciones</h3>
        <p>Cuando tengas nuevas notificaciones aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="notifications-list">
      {/* 📊 HEADER CON STATS */}
      <div className="notifications-header">
        <div className="notifications-stats">
          <span className="total-count">
            {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''}
          </span>
          {unreadCount > 0 && (
            <span className="unread-count">
              ({unreadCount} sin leer)
            </span>
          )}
        </div>

        {/* 📖 BOTÓN MARCAR TODAS COMO LEÍDAS */}
        {unreadCount > 0 && (
          <button 
            className="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
            title="Marcar todas como leídas"
          >
            ✅ Marcar todas como leídas
          </button>
        )}
      </div>

      {/* 📋 LISTA DE NOTIFICACIONES */}
      <div className="notifications-items">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={() => handleNotificationClick(notification)}
            onMarkAsRead={() => onMarkAsRead(notification.id)}
            onDelete={() => onDelete(notification.id)}
          />
        ))}
      </div>

      {/* 🔄 LOAD MORE BUTTON */}
      {hasMore && (
        <div className="notifications-load-more">
          <button 
            className="load-more-btn"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Cargando...
              </>
            ) : (
              '📄 Cargar más notificaciones'
            )}
          </button>
        </div>
      )}

      {/* 🔄 LOADING INDICATOR PARA PAGINACIÓN */}
      {loading && notifications.length > 0 && (
        <div className="notifications-loading-more">
          <div className="loading-spinner-small"></div>
          <span>Cargando más...</span>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;