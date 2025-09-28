import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

const Notificaciones: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [showReminderConfig, setShowReminderConfig] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const handleMarkAllAsRead = () => {
    alert('Todas las notificaciones marcadas como leídas');
  };

  const handleEmailConfig = () => {
    setShowEmailConfig(true);
  };

  const handleReminderConfig = () => {
    setShowReminderConfig(true);
  };

  const handleCloseModals = () => {
    setShowEmailConfig(false);
    setShowReminderConfig(false);
  };

  const handleSaveEmailConfig = () => {
    alert('Configuración de email guardada');
    setShowEmailConfig(false);
  };

  const handleSaveReminderConfig = () => {
    alert('Configuración de recordatorios guardada');
    setShowReminderConfig(false);
  };

  // Filtros de notificaciones
  const filters = [
    'Todas', 'Sin leer', 'Fechas límite', 'Comentarios', 'Reuniones', 'Aprobaciones'
  ];

  // Datos de ejemplo (en producción vendrían del backend)
  const notifications = [
    {
      id: 1,
      type: 'deadline',
      title: 'Fecha límite próxima',
      message: 'La fecha límite para el Plan de Proyecto es en 3 días',
      time: 'Hace 2 horas',
      isRead: false
    },
    {
      id: 2,
      type: 'comment',
      title: 'Nuevo comentario del asesor',
      message: 'Tu asesor ha comentado en tu documento',
      time: 'Hace 1 día',
      isRead: false
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Reunión programada',
      message: 'Reunión con tu asesor programada para mañana',
      time: 'Hace 2 días',
      isRead: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline': return '⏰';
      case 'comment': return '💬';
      case 'meeting': return '📅';
      case 'approval': return '✅';
      default: return '🔔';
    }
  };

  return (
    <div className="notificaciones-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="notificaciones-section">
          {/* Header */}
          <div className="notificaciones-header">
            <div>
              <h2>Notificaciones</h2>
              <p>Mantente al día con todas las actualizaciones de tu tesis</p>
            </div>
            <button onClick={handleMarkAllAsRead} className="mark-all-btn">
              Marcar todas como leídas
            </button>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-icon">⚙️</div>
            <span className="filter-label">Filtrar por:</span>
            <div className="filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="empty-icon">📭</span>
                <h3>No hay notificaciones</h3>
                <p>Cuando tengas actualizaciones, aparecerán aquí.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {!notification.isRead && <div className="unread-indicator"></div>}
                </div>
              ))
            )}
          </div>

          {/* Configuration Section */}
          <div className="config-section">
            <h3>Configuración de Notificaciones</h3>
            
            <div className="config-item">
              <div className="config-info">
                <h4>Notificaciones por email</h4>
                <p>Recibir notificaciones importantes en tu correo</p>
              </div>
              <button onClick={handleEmailConfig} className="config-btn">
                Configurar
              </button>
            </div>

            <div className="config-item">
              <div className="config-info">
                <h4>Recordatorios automáticos</h4>
                <p>Recibir recordatorios antes de fechas límite</p>
              </div>
              <button onClick={handleReminderConfig} className="config-btn">
                Configurar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Configuration Modal */}
      {showEmailConfig && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configuración de Email</h3>
              <button onClick={handleCloseModals} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Notificaciones de fechas límite
                </label>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Comentarios del asesor
                </label>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Confirmaciones de reuniones
                </label>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Aprobaciones de documentos
                </label>
              </div>
              <div className="modal-actions">
                <button onClick={handleCloseModals} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={handleSaveEmailConfig} className="save-btn">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Configuration Modal */}
      {showReminderConfig && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configuración de Recordatorios</h3>
              <button onClick={handleCloseModals} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Recordar fechas límite con anticipación de:</label>
                <select defaultValue="3">
                  <option value="1">1 día</option>
                  <option value="3">3 días</option>
                  <option value="7">1 semana</option>
                  <option value="14">2 semanas</option>
                </select>
              </div>
              <div className="form-group">
                <label>Recordar reuniones con anticipación de:</label>
                <select defaultValue="1">
                  <option value="0.5">30 minutos</option>
                  <option value="1">1 hora</option>
                  <option value="24">1 día</option>
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Recordatorios diarios de tareas pendientes
                </label>
              </div>
              <div className="modal-actions">
                <button onClick={handleCloseModals} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={handleSaveReminderConfig} className="save-btn">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .notificaciones-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          background: #f5f5f5;
          min-height: 100vh;
          width: calc(100vw - 280px);
        }

        .main-header {
          background: white;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .main-header h1 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .notification-icon {
          font-size: 20px;
          cursor: pointer;
        }

        .notificaciones-section {
          padding: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .notificaciones-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .notificaciones-header h2 {
          color: #333;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .notificaciones-header p {
          color: #666;
          font-size: 16px;
        }

        .mark-all-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .mark-all-btn:hover {
          background: #1565c0;
        }

        .filters-section {
          background: white;
          padding: 20px 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-icon {
          font-size: 20px;
        }

        .filter-label {
          color: #333;
          font-weight: 500;
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #6c757d;
          padding: 6px 12px;
          border-radius: 16px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #e9ecef;
        }

        .filter-btn.active {
          background: #1976d2;
          border-color: #1976d2;
          color: white;
        }

        .notifications-list {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 32px;
          overflow: hidden;
        }

        .no-notifications {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        .no-notifications h3 {
          margin-bottom: 8px;
          color: #333;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
          position: relative;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: #f8f9fa;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item.unread {
          background: #f8f9ff;
          border-left: 4px solid #1976d2;
        }

        .notification-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h4 {
          color: #333;
          margin-bottom: 4px;
          font-size: 16px;
        }

        .notification-content p {
          color: #666;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .notification-time {
          color: #999;
          font-size: 12px;
        }

        .unread-indicator {
          width: 8px;
          height: 8px;
          background: #1976d2;
          border-radius: 50%;
          position: absolute;
          top: 24px;
          right: 24px;
        }

        .config-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .config-section h3 {
          color: #333;
          margin-bottom: 20px;
          font-size: 20px;
        }

        .config-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #eee;
        }

        .config-item:last-child {
          border-bottom: none;
        }

        .config-info h4 {
          color: #333;
          margin-bottom: 4px;
        }

        .config-info p {
          color: #666;
          font-size: 14px;
        }

        .config-btn {
          background: transparent;
          color: #1976d2;
          border: 1px solid #1976d2;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .config-btn:hover {
          background: #1976d2;
          color: white;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #f5f5f5;
        }

        .modal-content {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }

        .checkbox-label {
          display: flex !important;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          margin-bottom: 0 !important;
          font-weight: normal !important;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .cancel-btn,
        .save-btn {
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .cancel-btn {
          background: transparent;
          border: 1px solid #ddd;
          color: #666;
        }

        .cancel-btn:hover {
          background: #f8f9fa;
        }

        .save-btn {
          background: #1976d2;
          border: 1px solid #1976d2;
          color: white;
        }

        .save-btn:hover {
          background: #1565c0;
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 240px;
            width: calc(100vw - 240px);
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            width: 100vw;
          }
          
          .notificaciones-section {
            padding: 16px;
          }

          .notificaciones-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .filters-section {
            padding: 16px;
          }

          .notification-item {
            padding: 16px;
          }

          .config-item {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            padding: 12px 16px;
          }
          
          .main-header h1 {
            font-size: 18px;
          }
          
          .notificaciones-section {
            padding: 12px;
          }

          .modal-content {
            padding: 16px;
          }

          .filters {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Notificaciones;