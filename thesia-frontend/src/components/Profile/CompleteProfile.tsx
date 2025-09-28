import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    carrera: '',
    ciclo: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const carreras = [
    'Administración de Negocios Internacionales',
    'Arquitectura de Plataformas y Servicios de TI',
    'Automatización Industrial',
    'Diseño Industrial',
    'Diseño y Desarrollo de Simuladores y Videojuegos',
    'Gestión y Mantenimiento de Maquinaria Pesada',
    'Mantenimiento de Equipo Pesado',
    'Mecatrónica Industrial',
    'Producción y Gestión Industrial',
    'Tecnología Mecánica Eléctrica'
  ];

  const ciclos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'ciclo') {
      setFormData(prev => ({ ...prev, ciclo: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.carrera) {
        setError('Por favor selecciona tu carrera');
        setIsLoading(false);
        return;
      }

      console.log('📝 Completando perfil:', formData);

      const result = await authService.updateUserProfile({
        carrera: formData.carrera,
        ciclo: formData.ciclo
      });

      if (result.success) {
        console.log('✅ Perfil completado exitosamente');
        
        // Actualizar datos locales si vienen en la respuesta
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          console.log('💾 Datos de usuario actualizados');
        }

        // Actualizar token si viene uno nuevo
        if (result.token) {
          localStorage.setItem('token', result.token);
          console.log('🔑 Token actualizado');
        }

        // Redirigir al dashboard
        navigate('/dashboard', { replace: true });
      } else {
        console.error('❌ Error del servidor:', result.message);
        setError(result.message || 'Error completando el perfil');
      }

    } catch (error) {
      console.error('❌ Error completando perfil:', error);
      setError('Error de conexión con el servidor. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="perfil-container">
      {/* Main Content */}
      <div className="main-content-centered">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-icon">🎓</div>
            <div>
              <h2>¡Bienvenido a THESIA!</h2>
              <p>Completa tu información académica para personalizar tu experiencia</p>
            </div>
          </div>

          <div className="info-banner">
            <div className="info-icon">ℹ️</div>
            <div>
              <strong>Información requerida</strong>
              <p>Para acceder al sistema completo, necesitas completar tu carrera y ciclo académico. Esta información será utilizada para personalizar tu experiencia y gestionar tu proceso de tesis.</p>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <div className="error-icon">⚠️</div>
              <div>
                <strong>Error</strong>
                <p>{error}</p>
              </div>
              <button 
                type="button"
                onClick={() => setError('')}
                className="close-error"
              >
                ×
              </button>
            </div>
          )}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Carrera Profesional *</label>
              <select 
                name="carrera" 
                value={formData.carrera} 
                onChange={handleInputChange}
                required
                disabled={isLoading}
              >
                <option value="">Selecciona tu carrera</option>
                {carreras.map((carrera) => (
                  <option key={carrera} value={carrera}>
                    {carrera}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ciclo Académico Actual *</label>
              <select 
                name="ciclo" 
                value={formData.ciclo} 
                onChange={handleInputChange}
                required
                disabled={isLoading}
              >
                {ciclos.map((ciclo) => (
                  <option key={ciclo} value={ciclo}>
                    {ciclo}° Ciclo{ciclo === 10 ? ' (Último)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading || !formData.carrera}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Guardando...
                </>
              ) : (
                <>
                  💾 Completar Perfil y Continuar
                </>
              )}
            </button>
          </form>

          <div className="welcome-note">
            <p>
              <strong>💡 ¿Por qué necesitamos esta información?</strong>
            </p>
            <p>
              Nos ayuda a personalizar tu experiencia, mostrarte contenido relevante para tu carrera 
              y conectarte con los recursos académicos apropiados para tu nivel.
            </p>
            <p>
              🔒 Tu información está segura y solo será utilizada para mejorar tu experiencia académica en THESIA.
            </p>
          </div>
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
          background: #f5f5f5;
        }

        .main-content-centered {
          flex: 1;
          background: #f5f5f5;
          min-height: 100vh;
          width: 100vw;
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
          font-size: 24px;
        }

        .profile-header p {
          margin: 4px 0 0 0;
          color: #666;
          font-size: 16px;
        }

        .info-banner {
          background: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
        }

        .info-icon {
          color: #1976d2;
          font-size: 20px;
          margin-top: 2px;
        }

        .info-banner strong {
          color: #1976d2;
          display: block;
          margin-bottom: 4px;
        }

        .info-banner p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }

        .error-banner {
          background: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          position: relative;
        }

        .error-icon {
          color: #d32f2f;
          font-size: 20px;
          margin-top: 2px;
        }

        .error-banner strong {
          color: #d32f2f;
          display: block;
          margin-bottom: 4px;
        }

        .error-banner p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }

        .close-error {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: #d32f2f;
          cursor: pointer;
          font-size: 20px;
          font-weight: bold;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-error:hover {
          background: rgba(211, 47, 47, 0.1);
        }

        .profile-form {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }

        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
          background: white;
        }

        .form-group select:focus {
          outline: none;
          border-color: #1976d2;
        }

        .form-group select:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .submit-btn {
          width: 100%;
          background: #1976d2;
          color: white;
          padding: 14px 24px;
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
          min-height: 52px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1565c0;
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .welcome-note {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #1976d2;
        }

        .welcome-note p {
          margin-bottom: 12px;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .welcome-note p:last-child {
          margin-bottom: 0;
        }

        .welcome-note strong {
          color: #1976d2;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .main-content-centered {
            width: 100vw;
          }
          
          .profile-section {
            padding: 16px;
          }

          .profile-form {
            padding: 16px;
          }

          .main-header {
            padding: 12px 16px;
          }

          .main-header h1 {
            font-size: 18px;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .profile-header h2 {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .profile-section {
            padding: 12px;
          }

          .profile-form {
            padding: 12px;
          }

          .welcome-note {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CompleteProfile;