import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../Layout/Sidebar"; // Import Sidebar component

const MiPerfil: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    codigo: "117006",
    nombres: "Melanie Nieves",
    carrera: "Diseño y Desarrollo De Software",
    ciclo: "V Ciclo"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Aquí irá la lógica para enviar al backend
    // await profileService.updateProfile(formData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    navigate('/');
  };

  return (
    <div className="perfil-container">
      <Sidebar onLogout={handleLogout} /> {/* Replace hardcoded sidebar */}
      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-icon">👤</div>
            <div>
              <h2>Mi Perfil</h2>
              <p>Completa tu información personal para continuar</p>
            </div>
          </div>

          <div className="info-banner">
            <div className="info-icon">ℹ️</div>
            <div>
              <strong>Información requerida</strong>
              <p>Para acceder al sistema completo, necesitas completar todos los campos obligatorios. Esta información será utilizada para personalizar tu experiencia y gestionar tu proceso de tesis.</p>
            </div>
          </div>

          <form className="profile-form">
            <div className="form-group">
              <label>Código de Estudiante *</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                placeholder="117006"
              />
            </div>

            <div className="form-group">
              <label>Nombres Completos *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                placeholder="Melanie Nieves"
              />
            </div>

            <div className="form-group">
              <label>Carrera *</label>
              <select name="carrera" value={formData.carrera} onChange={handleInputChange}>
                <option>Diseño y Desarrollo De Software</option>
                <option>Ingeniería de Sistemas</option>
                <option>Administración de Empresas</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ciclo Actual *</label>
              <select name="ciclo" value={formData.ciclo} onChange={handleInputChange}>
                <option>V Ciclo</option>
                <option>VI Ciclo</option>
                <option>VII Ciclo</option>
                <option>VIII Ciclo</option>
              </select>
            </div>

            <button type="button" onClick={handleSubmit} className="submit-btn">
              💾 Guardar y Continuar
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

        .perfil-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }

        .sidebar {
          width: 280px;
          min-width: 280px;
          background: linear-gradient(135deg, #1976d2, #42a5f5);
          color: white;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }

        .sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar-logo {
          width: 32px;
          height: 32px;
        }

        .sidebar-title {
          font-size: 20px;
          font-weight: 700;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .nav-item:hover,
        .nav-item.active {
          background: rgba(255,255,255,0.1);
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 12px;
          opacity: 0.8;
        }

        .user-email {
          font-size: 14px;
          font-weight: 500;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: rgba(255,255,255,0.1);
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

        .profile-section {
          padding: 32px;
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .profile-icon {
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

        .profile-header h2 {
          margin: 0;
          color: #333;
        }

        .profile-header p {
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

        .profile-form {
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
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #1976d2;
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
          .sidebar {
            width: 240px;
            min-width: 240px;
          }
          
          .main-content {
            margin-left: 240px;
            width: calc(100vw - 240px);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1000;
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .main-content {
            margin-left: 0;
            width: 100vw;
          }
          
          .profile-section {
            padding: 16px;
          }

          .profile-form {
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
          
          .profile-section {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default MiPerfil;