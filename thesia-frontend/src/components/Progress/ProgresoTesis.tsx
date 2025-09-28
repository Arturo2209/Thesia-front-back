import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

const ProgresoTesis: React.FC = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(0);

  const handleLogout = () => {
    navigate('/');
  };

  const handleUploadDocument = (phaseIndex: number) => {
    setSelectedPhase(phaseIndex);
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
  };

  const handleViewGuide = () => {
    navigate('/recurso-guia');
  };

  const handleSubmitDocument = () => {
    alert('Documento subido correctamente');
    setShowUploadModal(false);
  };

  // Datos de las fases
  const phases = [
    {
      number: 1,
      title: "Plan de Proyecto",
      description: "Definición del tema y objetivos de la tesis",
      dueDate: "15/7/2024",
      documents: 0,
      status: "pending"
    },
    {
      number: 2,
      title: "Diagnóstico de la Solución - Cap.1",
      description: "Determinar la problemática, solución y objetivos",
      dueDate: "15/7/2024",
      documents: 0,
      status: "pending"
    },
    {
      number: 3,
      title: "Marco Teórico - Cap.2",
      description: "Desarrollo del marco teórico y estado del arte",
      dueDate: "30/9/2024",
      documents: 0,
      status: "pending"
    }
  ];

  return (
    <div className="progreso-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="header-actions">
            <button onClick={handleViewGuide} className="guide-btn">
              📖 Guía Modelo Ejemplo
            </button>
            <div className="notification-icon">🔔</div>
          </div>
        </header>

        <div className="progreso-section">
          {/* Header */}
          <div className="progreso-header">
            <h2>Progreso de Tesis</h2>
            <p>Seguimiento detallado de cada fase de tu proceso de tesis</p>
          </div>

          {/* Timeline */}
          <div className="timeline-container">
            {phases.map((phase, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className={`timeline-circle ${phase.status}`}>
                    {phase.status === 'completed' ? '✓' : phase.number}
                  </div>
                  {index < phases.length - 1 && <div className="timeline-line"></div>}
                </div>
                
                <div className="timeline-content">
                  <div className="phase-card">
                    <div className="phase-header">
                      <div className="phase-info">
                        <h3>Fase {phase.number}: {phase.title}</h3>
                        <p className="phase-description">{phase.description}</p>
                      </div>
                      <div className="phase-date">
                        <span className="date-icon">📅</span>
                        <span>{phase.dueDate}</span>
                      </div>
                    </div>
                    
                    <div className="phase-documents">
                      <div className="documents-info">
                        <span className="doc-icon">📄</span>
                        <span>Documentos ({phase.documents})</span>
                      </div>
                      <p className="no-documents">No hay documentos subidos</p>
                      <button 
                        onClick={() => handleUploadDocument(index)}
                        className="upload-btn"
                      >
                        Subir Documento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Subir Documento - Fase {phases[selectedPhase].number}</h3>
              <button onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            
            <div className="modal-content">
              <div className="phase-info-modal">
                <h4>{phases[selectedPhase].title}</h4>
                <p>{phases[selectedPhase].description}</p>
              </div>

              <div className="form-group">
                <label>Título del Documento</label>
                <input 
                  type="text" 
                  placeholder="Ej: Plan de Proyecto - Primera Versión"
                />
              </div>

              <div className="form-group">
                <label>Descripción (Opcional)</label>
                <textarea 
                  rows={3}
                  placeholder="Breve descripción del documento..."
                />
              </div>

              <div className="form-group">
                <label>Archivo</label>
                <div className="file-upload-area">
                  <div className="file-upload-content">
                    <span className="upload-icon">📁</span>
                    <p>Arrastra tu archivo aquí o haz click para seleccionar</p>
                    <small>Formatos: PDF, DOC, DOCX (Máx. 10MB)</small>
                  </div>
                  <input type="file" className="file-input" accept=".pdf,.doc,.docx" />
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={handleCloseModal} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={handleSubmitDocument} className="submit-btn">
                  📤 Subir Documento
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

        .progreso-container {
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

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .guide-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .guide-btn:hover {
          background: #218838;
        }

        .notification-icon {
          font-size: 20px;
          cursor: pointer;
        }

        .progreso-section {
          padding: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .progreso-header {
          margin-bottom: 32px;
        }

        .progreso-header h2 {
          color: #333;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .progreso-header p {
          color: #666;
          font-size: 16px;
        }

        .timeline-container {
          position: relative;
        }

        .timeline-item {
          display: flex;
          margin-bottom: 24px;
          position: relative;
        }

        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 24px;
          position: relative;
        }

        .timeline-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          border: 3px solid #e9ecef;
          position: relative;
          z-index: 2;
        }

        .timeline-circle.completed {
          background: #28a745;
          border-color: #28a745;
          color: white;
        }

        .timeline-circle.pending {
          background: white;
          border-color: #dee2e6;
          color: #6c757d;
        }

        .timeline-line {
          width: 2px;
          height: 60px;
          background: #dee2e6;
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
        }

        .timeline-content {
          flex: 1;
        }

        .phase-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #1976d2;
        }

        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .phase-info h3 {
          color: #333;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .phase-description {
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }

        .phase-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 14px;
        }

        .date-icon {
          font-size: 16px;
        }

        .phase-documents {
          border-top: 1px solid #eee;
          padding-top: 16px;
        }

        .documents-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }

        .doc-icon {
          font-size: 16px;
        }

        .no-documents {
          color: #666;
          font-style: italic;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .upload-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .upload-btn:hover {
          background: #1565c0;
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
          max-width: 600px;
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
          font-size: 18px;
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

        .phase-info-modal {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 24px;
        }

        .phase-info-modal h4 {
          color: #333;
          margin-bottom: 8px;
        }

        .phase-info-modal p {
          color: #666;
          font-size: 14px;
          margin: 0;
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

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1976d2;
        }

        .file-upload-area {
          position: relative;
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          transition: border-color 0.2s;
          cursor: pointer;
        }

        .file-upload-area:hover {
          border-color: #1976d2;
        }

        .file-upload-content {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .file-upload-content p {
          color: #333;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .file-upload-content small {
          color: #666;
          font-size: 12px;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .cancel-btn,
        .submit-btn {
          padding: 10px 20px;
          border-radius: 6px;
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

        .submit-btn {
          background: #1976d2;
          border: 1px solid #1976d2;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn:hover {
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
          
          .progreso-section {
            padding: 16px;
          }

          .phase-header {
            flex-direction: column;
            gap: 12px;
          }

          .timeline-marker {
            margin-right: 16px;
          }

          .phase-card {
            padding: 16px;
          }

          .header-actions {
            gap: 8px;
          }

          .guide-btn {
            padding: 6px 12px;
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            padding: 12px 16px;
          }
          
          .main-header h1 {
            font-size: 18px;
          }
          
          .progreso-section {
            padding: 12px;
          }

          .modal-content {
            padding: 16px;
          }

          .file-upload-area {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgresoTesis;