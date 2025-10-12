import React, { useState } from 'react';
import type { Notification } from '../types/notifications.types';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  onMarkAsRead: () => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onMarkAsRead,
  onDelete
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // 📖 Manejar marcar como leída
  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar trigger del onClick del item
    
    if (notification.isRead || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onMarkAsRead();
    } catch (error) {
      console.error('❌ Error marcando como leída:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 🗑️ Manejar eliminación
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta notificación?');
    if (!confirmDelete) return;
    
    setIsProcessing(true);
    try {
      const success = await onDelete();
      if (!success) {
        alert('❌ Error eliminando la notificación');
      }
    } catch (error) {
      console.error('❌ Error eliminando:', error);
      alert('❌ Error de conexión');
    } finally {
      setIsProcessing(false);
    }
  };

  // 🎨 Obtener clases CSS
  const getItemClasses = (): string => {
    let classes = 'notification-item';
    
    if (!notification.isRead) classes += ' unread';
    if (notification.priority === 'alta') classes += ' high-priority';
    if (notification.priority === 'media') classes += ' medium-priority';
    if (notification.priority === 'baja') classes += ' low-priority';
    if (isProcessing) classes += ' processing';
    if (notification.actionUrl) classes += ' clickable';
    
    return classes;
  };

  return (
    <div 
      className={getItemClasses()}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 🔔 INDICADOR DE NO LEÍDA */}
      {!notification.isRead && (
        <div className="unread-indicator"></div>
      )}

      {/* 📄 CONTENIDO PRINCIPAL */}
      <div className="notification-content">
        {/* 🎨 ICONO Y TIPO */}
        <div className="notification-icon">
          <span 
            className="type-icon"
            style={{ color: notification.color }}
          >
            {notification.icon}
          </span>
        </div>

        {/* 📝 MENSAJE Y DETALLES */}
        <div className="notification-details">
          <div className="notification-message">
            {notification.message}
          </div>
          
          <div className="notification-meta">
            <span className="notification-time">
              {notification.timeAgo}
            </span>
            
            <span className="notification-type">
              {notification.type}
            </span>
            
            {notification.priority === 'alta' && (
              <span className="priority-badge high">
                🔴 Alta prioridad
              </span>
            )}
          </div>
        </div>

        {/* ⚡ ACCIONES (visible en hover) */}
        <div className={`notification-actions ${showActions ? 'visible' : ''}`}>
          {/* 📖 MARCAR COMO LEÍDA */}
          {!notification.isRead && (
            <button
              className="action-btn mark-read"
              onClick={handleMarkAsRead}
              disabled={isProcessing}
              title="Marcar como leída"
            >
              {isProcessing ? '⏳' : '✅'}
            </button>
          )}

          {/* 🗑️ ELIMINAR */}
          <button
            className="action-btn delete"
            onClick={handleDelete}
            disabled={isProcessing}
            title="Eliminar notificación"
          >
            {isProcessing ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>

      {/* 🚀 INDICADOR DE ACCIÓN DISPONIBLE */}
      {notification.actionUrl && (
        <div className="action-indicator">
          <span className="action-arrow">→</span>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;