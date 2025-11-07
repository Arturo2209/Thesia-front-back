import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import authService from '../../services/authService';
import { useNotifications } from './hooks/useNotifications';
import NotificationsList from './components/NotificationsList';
import NotificationFilters from './components/NotificationFilters';
import { notificationsStyles } from './styles/Notifications.styles';

const Notificaciones: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const {
    notifications,
    loading,
    error,
    unreadCount,
    hasMore,
    filter,
    notificationsByType,
    notificationsByPriority,
    totalCount,
    hasUnread,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateFilter
  } = useNotifications();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Error en logout:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('❌ Error refrescando:', error);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (error) {
    return (
      <div className="notifications-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <header className="main-header">
            <h1>Sistema de Tesis y Pretesis</h1>
            <div className="notification-icon">🔔</div>
          </header>

          <div className="content-section">
            <div className="error-container">
              <div className="error-icon">❌</div>
              <h2>Error cargando notificaciones</h2>
              <p>{error}</p>
              <button className="retry-button" onClick={handleRefresh}>
                🔄 Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
        <style>{notificationsStyles}</style>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="content-section">
          <div className="notifications-page-container">
            <header className="notifications-secondary-header">
              <div className="header-left">
                <h2>
                  🔔 Notificaciones
                  {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                  )}
                </h2>
                <p className="header-subtitle">
                  Mantente al día con tus actividades académicas
                </p>
              </div>

              <div className="header-actions">
                <button
                  className={`filter-toggle ${showFilters ? 'active' : ''}`}
                  onClick={toggleFilters}
                  title="Mostrar/ocultar filtros"
                >
                  🔍 Filtros
                  {showFilters && <span className="toggle-indicator">×</span>}
                </button>

                <button
                  className="refresh-button"
                  onClick={handleRefresh}
                  disabled={loading}
                  title="Refrescar notificaciones"
                >
                  {loading ? '⏳' : '🔄'}
                </button>

                {hasUnread && (
                  <button
                    className="mark-all-button"
                    onClick={markAllAsRead}
                    title="Marcar todas como leídas"
                  >
                    ✅ Marcar todas
                  </button>
                )}
              </div>
            </header>

            <div className="quick-stats">
              <div className="stat-card">
                <span className="stat-icon">📋</span>
                <div className="stat-details">
                  <span className="stat-number">{totalCount}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>

              <div className="stat-card unread">
                <span className="stat-icon">🔔</span>
                <div className="stat-details">
                  <span className="stat-number">{unreadCount}</span>
                  <span className="stat-label">Sin leer</span>
                </div>
              </div>

              <div className="stat-card read">
                <span className="stat-icon">✅</span>
                <div className="stat-details">
                  <span className="stat-number">{totalCount - unreadCount}</span>
                  <span className="stat-label">Leídas</span>
                </div>
              </div>

              {Object.entries(notificationsByType).map(([type, count]) => (
                <div className="stat-card" key={type}>
                  <span className="stat-icon">{type}</span>
                  <div className="stat-details">
                    <span className="stat-number">{count}</span>
                    <span className="stat-label">{type}</span>
                  </div>
                </div>
              ))}
            </div>

            {showFilters && (
              <div className="filters-panel">
                <div className="filters-header">
                  <h3>🔍 Filtrar notificaciones</h3>
                  <button 
                    className="close-filters"
                    onClick={() => setShowFilters(false)}
                  >
                    ×
                  </button>
                </div>
                <NotificationFilters
                  filter={filter}
                  onFilterChange={updateFilter}
                  notificationsByType={notificationsByType}
                  notificationsByPriority={notificationsByPriority}
                  unreadCount={unreadCount}
                  totalCount={totalCount}
                />
              </div>
            )}

            <NotificationsList
              notifications={notifications}
              loading={loading}
              hasMore={hasMore}
              onMarkAsRead={(id) => markAsRead(Number(id))}
              onDelete={(id) => deleteNotification(Number(id))}
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