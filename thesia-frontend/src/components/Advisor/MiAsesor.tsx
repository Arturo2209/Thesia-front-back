import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

const MiAsesor: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");

  const handleScheduleMeeting = () => {
    alert("Función de agendar reunión...");
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="asesor-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="asesor-section">
          {/* Header */}
          <div className="asesor-header">
            <h2>Mi Asesor</h2>
            <p>Información y comunicación con tu asesor de tesis</p>
          </div>

          {/* Advisor Profile Card */}
          <div className="advisor-profile-card">
            <div className="advisor-main-info">
              <div className="advisor-avatar">JG</div>
              <div className="advisor-details">
                <div className="advisor-name-status">
                  <h3>Jaime Gómez</h3>
                  <span className="status-badge available">● Disponible</span>
                </div>
                <p className="advisor-title">Ingeniería de Software</p>
                <div className="advisor-stats">
                  <span className="rating">⭐ 4.9/5.0</span>
                  <span className="experience">8 años de experiencia</span>
                  <span className="completed">34 tesis completadas</span>
                </div>
              </div>
              <button onClick={handleScheduleMeeting} className="schedule-btn">
                📅 Agendar Reunión
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'perfil' ? 'active' : ''}`}
                onClick={() => setActiveTab('perfil')}
              >
                👤 Perfil
              </button>
              <button 
                className={`tab ${activeTab === 'comunicacion' ? 'active' : ''}`}
                onClick={() => setActiveTab('comunicacion')}
              >
                💬 Comunicación
              </button>
              <button 
                className={`tab ${activeTab === 'horarios' ? 'active' : ''}`}
                onClick={() => setActiveTab('horarios')}
              >
                🕐 Horarios
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'perfil' && (
                <div className="profile-content">
                  <div className="content-grid">
                    <div className="about-section">
                      <h4>Sobre el Asesor</h4>
                      <p>
                        Especialista en Ingeniería de Software con especialización en 
                        desarrollo de aplicaciones web. Experiencia en metodologías 
                        ágiles y arquitecturas de software.
                      </p>
                    </div>
                    
                    <div className="contact-section">
                      <h4>Información de Contacto</h4>
                      <div className="contact-info">
                        <div className="contact-item">
                          <span className="contact-icon">📧</span>
                          <span>jaime.gomez@tecsup.edu.pe</span>
                        </div>
                        <div className="contact-item">
                          <span className="contact-icon">📞</span>
                          <span>+51 999 123 456</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="specializations-section">
                    <h4>Áreas de Especialización</h4>
                    <div className="specialization-tags">
                      <span className="tag">Desarrollo Web</span>
                      <span className="tag">Arquitectura de Software</span>
                      <span className="tag">Metodologías Ágiles</span>
                      <span className="tag">Bases de Datos</span>
                      <span className="tag">UX/UI Design</span>
                    </div>
                  </div>

                  <div className="stats-section">
                    <div className="stat-item">
                      <span className="stat-label">Estudiantes actuales:</span>
                      <span className="stat-value">12</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tesis completadas:</span>
                      <span className="stat-value">34</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Experiencia:</span>
                      <span className="stat-value">8 años</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comunicacion' && (
                <div className="communication-content">
                  <div className="coming-soon">
                    <h4>💬 Sistema de Comunicación</h4>
                    <p>Funcionalidad de chat y mensajería próximamente...</p>
                  </div>
                </div>
              )}

              {activeTab === 'horarios' && (
                <div className="schedule-content">
                  <div className="coming-soon">
                    <h4>🕐 Horarios de Disponibilidad</h4>
                    <p>Calendario de disponibilidad próximamente...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .asesor-container {
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

        .asesor-section {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .asesor-header {
          margin-bottom: 32px;
        }

        .asesor-header h2 {
          color: #333;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .asesor-header p {
          color: #666;
          font-size: 16px;
        }

        .advisor-profile-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .advisor-main-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .advisor-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #1976d2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
        }

        .advisor-details {
          flex: 1;
        }

        .advisor-name-status {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .advisor-name-status h3 {
          color: #333;
          font-size: 24px;
          margin: 0;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.available {
          background: #e8f5e8;
          color: #2e7d32;
        }

        .advisor-title {
          color: #666;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .advisor-stats {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #666;
        }

        .rating {
          color: #ff9800;
        }

        .schedule-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .schedule-btn:hover {
          background: #1565c0;
        }

        .tabs-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #eee;
        }

        .tab {
          flex: 1;
          padding: 16px 24px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .tab:hover {
          background: #f8f9fa;
        }

        .tab.active {
          color: #1976d2;
          border-bottom: 2px solid #1976d2;
          background: #f8f9fa;
        }

        .tab-content {
          padding: 24px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .about-section h4,
        .contact-section h4,
        .specializations-section h4 {
          color: #333;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .about-section p {
          color: #666;
          line-height: 1.6;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
        }

        .contact-icon {
          font-size: 16px;
        }

        .specializations-section {
          margin-bottom: 24px;
        }

        .specialization-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .stats-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-label {
          color: #666;
          font-size: 14px;
        }

        .stat-value {
          color: #1976d2;
          font-weight: 600;
        }

        .coming-soon {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .coming-soon h4 {
          margin-bottom: 12px;
          color: #333;
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 240px;
            width: calc(100vw - 240px);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            width: 100vw;
          }
          
          .asesor-section {
            padding: 16px;
          }

          .advisor-main-info {
            flex-direction: column;
            text-align: center;
          }

          .tabs {
            flex-direction: column;
          }

          .tab-content {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            padding: 12px 16px;
          }
          
          .main-header h1 {
            font-size: 18px;
          }
          
          .asesor-section {
            padding: 12px;
          }

          .advisor-profile-card {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default MiAsesor;