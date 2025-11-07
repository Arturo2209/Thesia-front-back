import React from 'react';
import type { Notification } from '../../../types/api.types';
import './NotificationsList.styles.css';

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  hasMore: boolean;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onLoadMore: () => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  loading,
  hasMore,
  onMarkAsRead,
  onDelete,
  onLoadMore,
}) => {
  return (
    <div className="notifications-content">
      {notifications.length === 0 ? (
        <p>No hay notificaciones disponibles.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification.id} className="notification-item">
              <div className="notification-header">
                <span className="notification-icon">📄</span>
                <span className="notification-title">{notification.type}</span>
              </div>
              <div className="notification-body">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{notification.timeAgo}</span>
              </div>
              <div className="notification-actions">
                <button
                  className="mark-read-button"
                  onClick={() => onMarkAsRead(notification.id)}
                  title="Marcar como leída"
                >
                  ✅ Marcar como leída
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(notification.id)}
                  title="Eliminar notificación"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <button
          className="load-more-button"
          onClick={onLoadMore}
          disabled={loading}
        >
          {loading ? '⏳ Cargando...' : '🔄 Cargar más'}
        </button>
      )}
    </div>
  );
};

export default NotificationsList;