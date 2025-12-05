// Simplified notifications page for student role: minimal header + grouped list
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import StudentHeader from '../Shared/StudentHeader';
import authService from '../../services/authService';
import { useNotifications } from './hooks/useNotifications';
import NotificationsList from './components/NotificationsList';
import { notificationsStyles } from './styles/Notifications.styles';

const Notificaciones: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    hasMore,
    hasUnread,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error en logout:', err);
    }
  };

  const handleRefresh = () => refresh();

  return (
    <div className="notifications-container">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <StudentHeader title="Sistema de Tesis y Pretesis" />

        <div className="content-section">
          <div className="notifications-page-container">
            <header className="notifications-secondary-header" style={{ marginBottom: 12 }}>
              <div className="header-left">
                <h2>
                  🔔 Notificaciones {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                  )}
                </h2>
                <p className="header-subtitle" style={{ marginTop: 4 }}>
                  Últimas novedades de reuniones, documentos y tesis
                </p>
              </div>
              <div className="header-actions">
                <button
                  className="refresh-button"
                  onClick={handleRefresh}
                  disabled={loading}
                  title="Refrescar"
                >
                  {loading ? '⏳' : '🔄'}
                </button>
                {hasUnread && (
                  <button
                    className="mark-all-button"
                    onClick={markAllAsRead}
                    title="Marcar todas como leídas"
                  >
                    ✅ Todas
                  </button>
                )}
              </div>
            </header>

            {error && (
              <div style={{ background:'#ffe5e5', border:'1px solid #fca5a5', padding:16, borderRadius:8, marginBottom:16 }}>
                <strong style={{ color:'#b91c1c' }}>Error:</strong> {error}
              </div>
            )}

            <NotificationsList
              notifications={notifications}
              loading={loading}
              hasMore={hasMore}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onLoadMore={loadMore}
            />
          </div>
        </div>
      </div>
      <style>{notificationsStyles}</style>
    </div>
  );
};

export default Notificaciones;