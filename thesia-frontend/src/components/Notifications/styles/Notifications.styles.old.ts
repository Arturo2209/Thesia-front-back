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

/* 🔔 FILTROS DE NOTIFICACIONES */
.notifications-container .notification-filters {
  padding: 20px;
}

.notifications-container .filters-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.notifications-container .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.notifications-container .stat-item .stat-icon {
  font-size: 14px;
}

.notifications-container .stat-item .stat-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.notifications-container .stat-item .stat-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 12px;
}

.notifications-container .filter-group {
  margin-bottom: 16px;
}

.notifications-container .filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 13px;
}

.notifications-container .label-icon {
  font-size: 14px;
}

.notifications-container .filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.notifications-container .filter-btn {
  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  color: #64748b;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.notifications-container .filter-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.notifications-container .filter-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.notifications-container .filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.notifications-container .btn-icon {
  font-size: 12px;
}

.notifications-container .btn-label {
  font-weight: 500;
}

.notifications-container .btn-count {
  font-size: 10px;
  opacity: 0.8;
}

.notifications-container .filter-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.notifications-container .clear-filters-btn {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notifications-container .clear-filters-btn:hover:not(:disabled) {
  background: #d97706;
}

.notifications-container .clear-filters-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* 📋 LISTA DE NOTIFICACIONES */
.notifications-container .notifications-list {
  padding: 0;
}

.notifications-container .notifications-list .notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.notifications-container .notifications-stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.notifications-container .total-count {
  font-weight: 600;
  color: #374151;
  font-size: 13px;
}

.notifications-container .unread-count {
  color: #ef4444;
  font-weight: 500;
  font-size: 13px;
}

.notifications-container .mark-all-read-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notifications-container .mark-all-read-btn:hover {
  background: #059669;
}

.notifications-container .notifications-items {
  max-height: 500px;
  overflow-y: auto;
}

/* 📄 ITEM DE NOTIFICACIÓN - MÁS COMPACTO */
.notifications-container .notification-item {
  display: flex;
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s;
  position: relative;
}

.notifications-container .notification-item:hover {
  background: #f8fafc;
}

.notifications-container .notification-item.unread {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
}

.notifications-container .notification-item.high-priority {
  border-left-color: #ef4444;
}

.notifications-container .notification-item.medium-priority {
  border-left-color: #f59e0b;
}

.notifications-container .notification-item.low-priority {
  border-left-color: #10b981;
}

.notifications-container .notification-item.clickable {
  cursor: pointer;
}

.notifications-container .notification-item.processing {
  opacity: 0.6;
  pointer-events: none;
}

.notifications-container .unread-indicator {
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
}

.notifications-container .notification-content {
  display: flex;
  flex: 1;
  align-items: flex-start;
  gap: 12px;
}

.notifications-container .notification-icon {
  flex-shrink: 0;
}

.notifications-container .type-icon {
  font-size: 18px;
  display: block;
}

.notifications-container .notification-details {
  flex: 1;
}

.notifications-container .notification-message {
  color: #1f2937;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 6px;
  font-size: 14px;
}

.notifications-container .notification-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #64748b;
}

.notifications-container .notification-time {
  font-weight: 500;
}

.notifications-container .notification-type {
  text-transform: capitalize;
}

.notifications-container .priority-badge.high {
  background: #fef2f2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

.notifications-container .notification-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.notifications-container .notification-actions.visible {
  opacity: 1;
}

.notifications-container .action-btn {
  background: none;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.notifications-container .action-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.notifications-container .action-btn.mark-read:hover {
  background: #dcfce7;
  border-color: #10b981;
  color: #10b981;
}

.notifications-container .action-btn.delete:hover {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.notifications-container .action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.notifications-container .action-indicator {
  display: flex;
  align-items: center;
  color: #94a3b8;
  margin-left: 8px;
}

.notifications-container .action-arrow {
  font-size: 14px;
}

/* 📄 LOAD MORE - MÁS COMPACTO */
.notifications-container .notifications-load-more {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

.notifications-container .load-more-btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 auto;
  font-size: 12px;
}

.notifications-container .load-more-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.notifications-container .load-more-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.notifications-container .spinner-small {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.notifications-container .notifications-loading-more {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
}

.notifications-container .loading-spinner-small {
  width: 12px;
  height: 12px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 📭 ESTADOS VACÍOS Y ERROR */
.notifications-container .notifications-empty {
  padding: 48px 24px;
  text-align: center;
  color: #64748b;
}

.notifications-container .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.notifications-container .notifications-empty h3 {
  color: #374151;
  margin-bottom: 8px;
  font-size: 16px;
}

.notifications-container .notifications-empty p {
  font-size: 14px;
}

.notifications-container .notifications-loading {
  padding: 48px 24px;
  text-align: center;
  color: #64748b;
}

.notifications-container .loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.notifications-container .error-container {
  padding: 48px 24px;
  text-align: center;
}

.notifications-container .error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.notifications-container .error-container h2 {
  font-size: 18px;
  margin-bottom: 8px;
}

.notifications-container .retry-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 12px;
  font-size: 12px;
}

.notifications-container .retry-button:hover {
  background: #2563eb;
}

/* 💡 SECCIÓN DE AYUDA - MÁS COMPACTA */
.notifications-container .help-section {
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.notifications-container .help-section h3 {
  color: #374151;
  margin-bottom: 16px;
  text-align: center;
  font-size: 16px;
}

.notifications-container .help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.notifications-container .help-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.notifications-container .help-item:hover {
  border-color: #3b82f6;
}

.notifications-container .help-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.notifications-container .help-text h4 {
  color: #374151;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.notifications-container .help-text p {
  color: #64748b;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

/* 📱 RESPONSIVE - IGUAL A MI-TESIS */
@media (max-width: 1024px) {
  .notifications-container .main-content {
    margin-left: 240px;
    width: calc(100vw - 240px);
  }
}

@media (max-width: 1024px) {
  .notifications-container .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .notifications-container .main-content {
    margin-left: 0;
    width: 100vw;
  }
  
  .notifications-container .content-section {
    padding: 16px;
  }
  
  .notifications-container .notifications-secondary-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .notifications-container .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .notifications-container .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .notifications-container .filter-buttons {
    flex-direction: column;
  }
  
  .notifications-container .notification-item {
    padding: 12px;
  }
  
  .notifications-container .notification-meta {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .notifications-container .main-header {
    padding: 12px 16px;
  }

  .notifications-container .main-header h1 {
    font-size: 18px;
  }

  .notifications-container .content-section {
    padding: 12px;
  }
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