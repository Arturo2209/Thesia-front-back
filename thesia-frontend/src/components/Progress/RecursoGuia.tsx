import React from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

const RecursoGuia: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleDownload = () => {
    // Simular descarga
    alert('Descargando Plan_De_Proyecto_Modelo.docx...');
  };

  return (
    <div className="recurso-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="recurso-section">
          {/* Header */}
          <div className="recurso-header">
            <h2>Recurso de guía para el Plan de Proyecto</h2>
            <p>Guía de documento para realizar correctamente las fases</p>
          </div>

          {/* Document Card */}
          <div className="document-card">
            <div className="document-info">
              <div className="document-icon">
                <span className="file-type">DOCX</span>
              </div>
              
              <div className="document-details">
                <h3>Plan_De_Proyecto_Modelo</h3>
                <p className="document-description">
                  Plantilla oficial para estructurar tu documento de tesis
                </p>
                <div className="document-meta">
                  <span className="meta-item">Tamaño: 1.2 MB</span>
                  <div className="rating">
                    <span className="stars">⭐ 4.9</span>
                    <span className="downloads">2100 descargas</span>
                  </div>
                </div>
              </div>
              
              <div className="document-tag">
                <span className="tag">Plantillas</span>
              </div>
            </div>
            
            <button onClick={handleDownload} className="download-btn">
              <span>⬇️</span> Descargar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .recurso-container {
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

        .recurso-section {
          padding: 32px;
          max-width: 800px;
          margin: 0 auto;
        }

        .recurso-header {
          margin-bottom: 32px;
        }

        .recurso-header h2 {
          color: #333;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .recurso-header p {
          color: #666;
          font-size: 16px;
        }

        .document-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid #e9ecef;
        }

        .document-info {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .document-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #1976d2, #42a5f5);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .file-type {
          color: white;
          font-weight: 600;
          font-size: 12px;
        }

        .document-details {
          flex: 1;
        }

        .document-details h3 {
          color: #333;
          font-size: 20px;
          margin-bottom: 8px;
        }

        .document-description {
          color: #666;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .document-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .meta-item {
          color: #666;
          font-size: 14px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stars {
          color: #ffc107;
          font-size: 14px;
        }

        .downloads {
          color: #666;
          font-size: 14px;
        }

        .document-tag {
          flex-shrink: 0;
        }

        .tag {
          background: #fff3cd;
          color: #856404;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .download-btn {
          width: 100%;
          background: #1976d2;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .download-btn:hover {
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
          
          .recurso-section {
            padding: 16px;
          }

          .document-card {
            padding: 16px;
          }

          .document-info {
            flex-direction: column;
            text-align: center;
          }

          .document-meta {
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            padding: 12px 16px;
          }
          
          .main-header h1 {
            font-size: 18px;
          }
          
          .recurso-section {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default RecursoGuia;