import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

// Tipos para la tesis (para usar con el backend)
// type ThesisData = {
//   titulo: string;
//   ciclo: string;
//   descripcion: string;
//   asesor: string;
// };

const MiTesis: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: "Sistema web de gestión y seguimiento para las tesis y pretesis",
    ciclo: "V Ciclo",
    descripcion: "Sistema web para gestionar y dar seguimiento a tesis y pre-tesis, facilitando la organización, el monitoreo de avances y la comunicación entre estudiantes y asesores.",
    asesor: "Jaime Gomez - Desarrollo Web (2/7 Tesis)"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Aquí irá la lógica para enviar al backend
    // await thesisService.registerThesis(formData);
    navigate('/mi-tesis-registrada');  // ← CAMBIO AQUÍ
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="tesis-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="tesis-section">
          {/* Header */}
          <div className="tesis-header">
            <div className="tesis-icon">📝</div>
            <div>
              <h2>Mi Tesis</h2>
              <p>Registra la información de tu tesis o pretesis</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="info-banner">
            <div className="info-icon">ℹ️</div>
            <div>
              <strong>Información de Tesis Requerida</strong>
              <p>Para continuar con el proceso, necesitas completar la información de tu tesis y seleccionar un asesor disponible.</p>
            </div>
          </div>

          {/* Form */}
          <form className="tesis-form">
            <div className="form-group">
              <label>Título de la Tesis/Pretesis *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Sistema web de gestión y seguimiento para las tesis y pretesis"
              />
            </div>

            <div className="form-group">
              <label>Ciclo de Carrera *</label>
              <select name="ciclo" value={formData.ciclo} onChange={handleInputChange}>
                <option>V Ciclo</option>
                <option>VI Ciclo</option>
                <option>VII Ciclo</option>
                <option>VIII Ciclo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descripción del Proyecto *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                placeholder="Sistema web para gestionar y dar seguimiento a tesis y pre-tesis, facilitando la organización, el monitoreo de avances y la comunicación entre estudiantes y asesores."
              />
            </div>

            <div className="form-group">
              <label>Seleccionar Asesor *</label>
              <select name="asesor" value={formData.asesor} onChange={handleInputChange}>
                <option>Jaime Gomez - Desarrollo Web (2/7 Tesis)</option>
                <option>María Rodriguez - Base de Datos (1/7 Tesis)</option>
                <option>Carlos Mendez - Sistemas (3/7 Tesis)</option>
                <option>Ana López - UX/UI (0/7 Tesis)</option>
              </select>
              <small className="helper-text">Solo se muestran asesores con capacidad disponible</small>
            </div>

            <button type="button" onClick={handleSubmit} className="submit-btn">
              💾 Registrar Tesis y Asesor
            </button>
          </form>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .tesis-container {
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
          max-width: 800px;
          margin: 0 auto;
        }

        .tesis-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .tesis-icon {
          width: 48px;
          height: 48px;
          background: #1976d2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }

        .tesis-header h2 {
          margin: 0;
          color: #333;
        }

        .tesis-header p {
          margin: 4px 0 0 0;
          color: #666;
        }

        .info-banner {
          background: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 32px;
          display: flex;
          gap: 12px;
        }

        .info-icon {
          color: #1976d2;
          font-size: 20px;
        }

        .info-banner strong {
          color: #1976d2;
        }

        .info-banner p {
          margin: 4px 0 0 0;
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }

        .tesis-form {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #000;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
          font-family: inherit;
          background: #f8f9fa;
          color: #000;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
          background: #f8f9fa;
          color: #000;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1976d2;
          background: #f8f9fa;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #6c757d;
        }

        .helper-text {
          display: block;
          margin-top: 4px;
          color: #6c757d;
          font-size: 12px;
        }

        .submit-btn {
          width: 100%;
          background: #1976d2;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
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
          
          .tesis-section {
            padding: 16px;
          }

          .tesis-form {
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
        }
      `}</style>
    </div>
  );
};

export default MiTesis;