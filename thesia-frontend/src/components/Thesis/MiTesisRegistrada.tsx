import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

const MiTesisRegistrada: React.FC = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const handleEditInfo = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleSaveChanges = () => {
    // Aquí irá la lógica para guardar cambios
    alert('Información actualizada correctamente');
    setShowEditModal(false);
  };

  return (
    <div className="tesis-registrada-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="tesis-section">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">✅</div>
            <div>
              <h2>Mi Tesis</h2>
              <p className="success-text">Tesis registrada exitosamente</p>
            </div>
          </div>

          <div className="content-grid">
            {/* Left Column - Thesis Info */}
            <div className="thesis-info-card">
              <div className="info-section">
                <h3>Título de la Tesis</h3>
                <p>Sistema web de gestión y seguimiento para las tesis y pretesis</p>
              </div>

              <div className="info-section">
                <h3>Ciclo</h3>
                <p>VI Ciclo</p>
              </div>

              <div className="info-section">
                <h3>Descripción</h3>
                <p>Sistema web para gestionar y dar seguimiento a tesis y pre-tesis, facilitando la organización, el monitoreo de avances y la comunicación entre estudiantes y asesores.</p>
              </div>

              <button onClick={handleEditInfo} className="edit-btn">
                Editar Información
              </button>
            </div>

            {/* Right Column - Advisor Info */}
            <div className="advisor-card">
              <div className="advisor-header">
                <span className="advisor-icon">👨‍🏫</span>
                <h3>Mi Asesor Asignado</h3>
              </div>

              <div className="advisor-info">
                <h4>Ing. Jaime Gómez</h4>
                <p className="advisor-specialty">Ingeniería de Software</p>
                <div className="contact-info">
                  <span className="contact-icon">📧</span>
                  <a href="mailto:jgomez@tecsup.edu.pe">jgomez@tecsup.edu.pe</a>
                </div>
                <div className="advisor-description">
                  <p>Especialista en gestión de proyectos y metodologías ágiles en el desarrollo de software educativo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Información de Tesis</h3>
              <button onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Título de la Tesis</label>
                <input 
                  type="text" 
                  defaultValue="Sistema web de gestión y seguimiento para las tesis y pretesis"
                />
              </div>
              <div className="form-group">
                <label>Ciclo</label>
                <select defaultValue="VI Ciclo">
                  <option>V Ciclo</option>
                  <option>VI Ciclo</option>
                  <option>VII Ciclo</option>
                  <option>VIII Ciclo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea 
                  rows={4}
                  defaultValue="Sistema web para gestionar y dar seguimiento a tesis y pre-tesis, facilitando la organización, el monitoreo de avances y la comunicación entre estudiantes y asesores."
                />
              </div>
              <div className="modal-actions">
                <button onClick={handleCloseModal} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={handleSaveChanges} className="save-btn">
                  Guardar Cambios
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

        .tesis-registrada-container {
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

        .tesis-section {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .success-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .success-icon {
          width: 48px;
          height: 48px;
          background: #28a745;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }

        .success-header h2 {
          margin: 0;
          color: #333;
          font-size: 28px;
        }

        .success-text {
          color: #28a745;
          font-weight: 500;
          margin: 4px 0 0 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .thesis-info-card,
        .advisor-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .info-section {
          margin-bottom: 24px;
        }

        .info-section h3 {
          color: #333;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-section p {
          color: #666;
          line-height: 1.5;
          font-size: 15px;
        }

        .edit-btn {
          background: transparent;
          color: #666;
          border: 1px solid #ddd;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          border-color: #1976d2;
          color: #1976d2;
          background: #f8f9fa;
        }

        .advisor-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .advisor-icon {
          font-size: 24px;
        }

        .advisor-header h3 {
          color: #1976d2;
          margin: 0;
          font-size: 16px;
        }

        .advisor-info h4 {
          color: #333;
          margin-bottom: 4px;
          font-size: 18px;
        }

        .advisor-specialty {
          color: #666;
          margin-bottom: 12px;
          font-style: italic;
        }

        .contact-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .contact-icon {
          color: #666;
        }

        .contact-info a {
          color: #1976d2;
          text-decoration: none;
          font-size: 14px;
        }

        .contact-info a:hover {
          text-decoration: underline;
        }

        .advisor-description p {
          color: #666;
          font-size: 14px;
          line-height: 1.4;
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
          margin-bottom: 6px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1976d2;
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

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            width: 100vw;
          }
          
          .tesis-section {
            padding: 16px;
          }

          .thesis-info-card,
          .advisor-card {
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
          
          .tesis-section {
            padding: 12px;
          }

          .modal-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default MiTesisRegistrada;