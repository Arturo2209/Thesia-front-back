export const notificationsStyles = `
.notifications-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.main-header h1 {
  font-size: 2rem;
  color: #333;
}

.content-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
}

.notifications-page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notifications-secondary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left h2 {
  font-size: 1.5rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-details {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
}

.filters-panel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.notifications-content {
  margin-top: 1.5rem;
}

.help-section {
  margin-top: 2rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.help-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.help-icon {
  font-size: 1.5rem;
}

.help-text h4 {
  margin: 0;
  color: #333;
}

.help-text p {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.error-container {
  text-align: center;
  padding: 3rem 1rem;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background: #1a73e8;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background: #1557b0;
}

.unread-badge {
  background: #e53935;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .notifications-secondary-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .help-grid {
    grid-template-columns: 1fr;
  }
}`;