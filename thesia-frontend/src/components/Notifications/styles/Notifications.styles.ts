export const notificationsStyles = `
/* 🔔 RESET Y BASE */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
}

.notifications-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 🔧 MAIN CONTENT - IGUAL A MI-TESIS */
.notifications-container .main-content {
  flex: 1;
  margin-left: 280px;
  background: #f5f5f5;
  min-height: 100vh;
  width: calc(100% - 280px);
  position: relative;
  overflow-x: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 📱 HEADER PRINCIPAL - IGUAL A MI-TESIS */
.notifications-container .main-header {
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.notifications-container .main-header h1 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
  font-weight: 600;
}

.notifications-container .notification-icon {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}

.notifications-container .notification-icon:hover {
  background: #f0f0f0;
}

/* 📄 CONTENT SECTION - IGUAL A MI-TESIS */
.notifications-container .content-section {
  padding: 32px;
  max-width: 100%;
  margin: 0 auto;
}

.notifications-container .notifications-page-container {
  width: 100%;
}

/* 📊 HEADER DE NOTIFICACIONES (SECUNDARIO) */
.notifications-container .notifications-secondary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.notifications-container .header-left h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notifications-container .unread-badge {
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 50px;
  min-width: 18px;
  text-align: center;
}

.notifications-container .header-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.notifications-container .header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.notifications-container .filter-toggle, 
.notifications-container .refresh-button, 
.notifications-container .mark-all-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.notifications-container .filter-toggle:hover, 
.notifications-container .refresh-button:hover, 
.notifications-container .mark-all-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.notifications-container .filter-toggle.active {
  background: #1d4ed8;
}

.notifications-container .filter-toggle:disabled, 
.notifications-container .refresh-button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

/* 📊 ESTADÍSTICAS RÁPIDAS - MÁS COMPACTAS */
.notifications-container .quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.notifications-container .stat-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 3px solid #3b82f6;
  transition: transform 0.2s, box-shadow 0.2s;
}

.notifications-container .stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.notifications-container .stat-card.unread {
  border-left-color: #ef4444;
}

.notifications-container .stat-card.read {
  border-left-color: #10b981;
}

.notifications-container .stat-card.priority {
  border-left-color: #f59e0b;
}

.notifications-container .stat-icon {
  font-size: 20px;
}

.notifications-container .stat-details {
  display: flex;
  flex-direction: column;
}

.notifications-container .stat-number {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.notifications-container .stat-label {
  font-size: 12px;
  color: #64748b;
}

/* 🔍 PANEL DE FILTROS - MÁS COMPACTO */
.notifications-container .filters-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  animation: slideDown 0.3s ease-out;
}

.notifications-container .filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.notifications-container .filters-header h3 {
  margin: 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.notifications-container .close-filters {
  background: none;
  border: none;
  font-size: 18px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.notifications-container .close-filters:hover {
  background: #e2e8f0;
  color: #374151;
}

/* 📋 CONTENIDO DE NOTIFICACIONES */
.notifications-container .notifications-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 🎨 ANIMACIONES */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;