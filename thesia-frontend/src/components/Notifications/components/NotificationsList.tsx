import React from 'react';
import type { Notification } from '../types/notifications.types';
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
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
              style={{ borderLeft: `3px solid ${n.color || '#e0e0e0'}` }}
            >
              <div className="notification-header">
                <span className="notification-icon">{n.icon || '�'}</span>
                <span className="notification-title">{n.type}</span>
                <span className="notification-time">{n.timeAgo}</span>
              </div>
              <div className="notification-body">
                <p className="notification-message">{n.message}</p>
              </div>
              <div className="notification-actions">
                {!n.isRead && (
                  <button
                    className="mark-read-button"
                    onClick={() => onMarkAsRead(n.id)}
                    title="Marcar como leída"
                  >
                    ✅ Marcar como leída
                  </button>
                )}
                <button
                  className="delete-button"
                  onClick={() => onDelete(n.id)}
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