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
  
  // 🔔 Hook de notificaciones
  const {
    // Estado
    notifications,
    loading,
    error,
    unreadCount,
    hasMore,
    filter,
    
    // Datos computados
    notificationsByType,
    notificationsByPriority,
    totalCount,
    hasUnread,
    
    // Acciones
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateFilter,
    refreshUnreadCount
  } = useNotifications();

  // 🔄 Manejar logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Error en logout:', error);
    }
  };

  // 🔄 Manejar refrescar
  const handleRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('❌ Error refrescando:', error);
    }
  };

  // 🔍 Toggle filtros
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // ❌ Error state
  if (error) {
    return (
      <div className="notifications-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          {/* 📱 HEADER PRINCIPAL - IGUAL A MI-TESIS */}
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
        {/* 📱 HEADER PRINCIPAL - IGUAL A MI-TESIS */}
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        {/* 📄 CONTENT SECTION - IGUAL A MI-TESIS */}
        <div className="content-section">
          <div className="notifications-page-container">
            
            {/* 📊 HEADER SECUNDARIO DE NOTIFICACIONES */}
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
                {/* 🔍 TOGGLE FILTROS */}
                <button
                  className={`filter-toggle ${showFilters ? 'active' : ''}`}
                  onClick={toggleFilters}
                  title="Mostrar/ocultar filtros"
                >
                  🔍 Filtros
                  {showFilters && <span className="toggle-indicator">×</span>}
                </button>

                {/* 🔄 REFRESCAR */}
                <button
                  className="refresh-button"
                  onClick={handleRefresh}
                  disabled={loading}
                  title="Refrescar notificaciones"
                >
                  {loading ? '⏳' : '🔄'}
                </button>

                {/* 📖 MARCAR TODAS COMO LEÍDAS */}
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

            {/* 📊 ESTADÍSTICAS RÁPIDAS */}
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
              
              {Object.entries(notificationsByType).length > 0 && (
                <div className="stat-card priority">
                  <span className="stat-icon">🚦</span>
                  <div className="stat-details">
                    <span className="stat-number">
                      {notificationsByPriority['alta'] || 0}
                    </span>
                    <span className="stat-label">Prioridad alta</span>
                  </div>
                </div>
              )}
            </div>

            {/* 🔍 PANEL DE FILTROS (COLAPSIBLE) */}
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

            {/* 📋 LISTA DE NOTIFICACIONES */}
            <div className="notifications-content">
              <NotificationsList
                notifications={notifications}
                loading={loading}
                hasMore={hasMore}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
                onLoadMore={loadMore}
              />
            </div>

            {/* 💡 TIPS Y AYUDA */}
            {totalCount === 0 && !loading && (
              <div className="help-section">
                <h3>💡 ¿Cómo funcionan las notificaciones?</h3>
                <div className="help-grid">
                  <div className="help-item">
                    <span className="help-icon">📄</span>
                    <div className="help-text">
                      <h4>Documentos</h4>
                      <p>Te notificamos cuando tu asesor revise tus documentos</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-icon">📅</span>
                    <div className="help-text">
                      <h4>Reuniones</h4>
                      <p>Confirmaciones y recordatorios de tus citas</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-icon">⏰</span>
                    <div className="help-text">
                      <h4>Plazos</h4>
                      <p>Recordatorios de fechas límite importantes</p>
                    </div>
                  </div>
                  <div className="help-item">
                    <span className="help-icon">💬</span>
                    <div className="help-text">
                      <h4>Comentarios</h4>
                      <p>Feedback y sugerencias de tu asesor</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      <style>{notificationsStyles}</style>
    </div>
  );
};

export default Notificaciones;