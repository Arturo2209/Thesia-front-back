import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo_estudiante: '',
    nombre: '',
    apellido: '', // 🔧 NUEVO CAMPO AGREGADO
    carrera: '',
    ciclo: 5 // 🔧 CAMBIO: Por defecto V ciclo (5)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener datos del usuario actual
  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      // 🔧 SEPARAR NOMBRE Y APELLIDO DEL CAMPO NAME
      const fullName = user.name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts.slice(0, 2).join(' ') || '';
      const lastName = nameParts.slice(2).join(' ') || '';

      setFormData(prev => ({
        ...prev,
        nombre: firstName,
        apellido: lastName,
        codigo_estudiante: user.codigo_estudiante || ''
      }));
    }
  }, []);

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

  // 🔧 CAMBIO PRINCIPAL: Solo ciclos V y VI
  const ciclosData = [
    { value: 5, label: 'V Ciclo', description: 'Apto para tesis' },
    { value: 6, label: 'VI Ciclo', description: 'Apto para tesis' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // 🔧 VALIDACIONES ACTUALIZADAS
      if (!formData.codigo_estudiante || formData.codigo_estudiante.length < 6) {
        setError('El código de estudiante debe tener al menos 6 caracteres');
        setIsLoading(false);
        return;
      }

      if (!formData.carrera) {
        setError('Por favor selecciona tu carrera');
        setIsLoading(false);
        return;
      }

      if (!formData.nombre.trim()) {
        setError('Por favor ingresa tu nombre');
        setIsLoading(false);
        return;
      }

      if (!formData.apellido.trim()) {
        setError('Por favor ingresa tu apellido');
        setIsLoading(false);
        return;
      }

      // 🔧 VALIDACIÓN DE CICLO
      if (formData.ciclo !== 5 && formData.ciclo !== 6) {
        setError('Solo se permiten estudiantes de V y VI ciclo');
        setIsLoading(false);
        return;
      }

      console.log('📝 Completando perfil con datos:', formData);

      // 🔧 LLAMAR AL SERVICIO CON APELLIDO SEPARADO
      const result = await authService.updateUserProfile({
        carrera: formData.carrera,
        ciclo: formData.ciclo,
        codigo_estudiante: formData.codigo_estudiante,
        nombre: formData.nombre,
        apellido: formData.apellido // 🔧 NUEVO CAMPO
      });

      if (result.success) {
        console.log('✅ Perfil completado exitosamente');
        
        // Actualizar datos locales
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          console.log('💾 Datos de usuario actualizados en localStorage');
        }

        if (result.token) {
          localStorage.setItem('token', result.token);
          console.log('🔑 Token actualizado');
        }

        // Mostrar mensaje de éxito y redirigir
        console.log('🎉 Redirigiendo al dashboard...');
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
      <div className="main-content-centered">
        <header className="main-header">
          <h1>🎓 THESIA - Sistema de Tesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-icon">👤</div>
            <div>
              <h2>Completa tu Perfil Académico</h2>
              <p>Para acceder al sistema completo, necesitamos tu información académica</p>
            </div>
          </div>

          <div className="info-banner">
            <div className="info-icon">ℹ️</div>
            <div>
              <strong>Requisitos para Tesis - TECSUP</strong>
              <p>Solo estudiantes de <strong>V y VI ciclo</strong> pueden registrar proyectos de tesis. Si estás en ciclos anteriores, podrás acceder cuando llegues al V ciclo.</p>
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
            <div className="form-row">
              <div className="form-group">
                <label>Código de Estudiante *</label>
                <input
                  type="text"
                  name="codigo_estudiante"
                  value={formData.codigo_estudiante}
                  onChange={handleInputChange}
                  placeholder="Ej: 116534"
                  maxLength={10}
                  required
                  disabled={isLoading}
                />
                <small className="form-hint">Tu código único de estudiante TECSUP</small>
              </div>

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
                <small className="form-hint">Tu programa académico actual en TECSUP</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nombres *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Carlos Arturo"
                  required
                  disabled={isLoading}
                />
                <small className="form-hint">Solo tus nombres</small>
              </div>

              <div className="form-group">
                <label>Apellidos *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Ej: Bullon Supanta"
                  required
                  disabled={isLoading}
                />
                <small className="form-hint">Tus apellidos completos</small>
              </div>
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
                {ciclosData.map((ciclo) => (
                  <option key={ciclo.value} value={ciclo.value}>
                    {ciclo.label} - {ciclo.description}
                  </option>
                ))}
              </select>
              <small className="form-hint">
                ✅ Solo estudiantes de V y VI ciclo pueden acceder al sistema de tesis
              </small>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading || !formData.carrera || !formData.codigo_estudiante || !formData.nombre.trim() || !formData.apellido.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Guardando información...
                </>
              ) : (
                <>
                  💾 Completar Perfil y Acceder al Sistema
                </>
              )}
            </button>
          </form>

          <div className="welcome-note">
            <div className="note-header">
              <span className="note-icon">🎯</span>
              <strong>¿Qué puedes hacer después?</strong>
            </div>
            <ul className="benefits-list">
              <li>📝 Registrar y gestionar tu proyecto de tesis</li>
              <li>👨‍🏫 Solicitar y comunicarte con asesores especializados</li>
              <li>📄 Subir y gestionar documentos académicos</li>
              <li>📅 Programar reuniones de seguimiento</li>
              <li>📊 Monitorear el progreso de tu proyecto</li>
              <li>🔔 Recibir notificaciones importantes</li>
            </ul>
            <p className="security-note">
              🔒 <strong>Privacidad garantizada:</strong> Tu información está protegida y solo será utilizada para mejorar tu experiencia académica en THESIA.
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
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .main-content-centered {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-header {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 2px solid #1976d2;
        }

        .main-header h1 {
          margin: 0;
          font-size: 22px;
          color: #1976d2;
          font-weight: 700;
        }

        .notification-icon {
          font-size: 20px;
          cursor: pointer;
          opacity: 0.7;
        }

        .profile-section {
          flex: 1;
          padding: 40px 32px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          text-align: center;
          justify-content: center;
        }

        .profile-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 28px;
          box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
        }

        .profile-header h2 {
          margin: 0 0 8px 0;
          color: white;
          font-size: 28px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .profile-header p {
          margin: 0;
          color: rgba(255,255,255,0.9);
          font-size: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .info-banner {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border: 2px solid #e3f2fd;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
          display: flex;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .info-icon {
          color: #1976d2;
          font-size: 24px;
          margin-top: 2px;
        }

        .info-banner strong {
          color: #1976d2;
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .info-banner p {
          margin: 0;
          color: #555;
          font-size: 14px;
          line-height: 1.5;
        }

        .error-banner {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border: 2px solid #ffcdd2;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          position: relative;
          box-shadow: 0 4px 20px rgba(211, 47, 47, 0.1);
        }

        .error-icon {
          color: #d32f2f;
          font-size: 24px;
          margin-top: 2px;
        }

        .error-banner strong {
          color: #d32f2f;
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .error-banner p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .close-error {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #d32f2f;
          cursor: pointer;
          font-size: 24px;
          font-weight: bold;
          width: 32px;
          height: 32px;
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
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          margin-bottom: 32px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .form-hint {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: #666;
          font-style: italic;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
          color: white;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 56px;
          box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(25, 118, 210, 0.4);
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .welcome-note {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          border-left: 4px solid #1976d2;
        }

        .note-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .note-icon {
          font-size: 24px;
        }

        .note-header strong {
          color: #1976d2;
          font-size: 18px;
        }

        .benefits-list {
          list-style: none;
          margin: 0 0 20px 0;
          padding: 0;
        }

        .benefits-list li {
          padding: 8px 0;
          color: #555;
          font-size: 14px;
          line-height: 1.5;
          border-bottom: 1px solid #f0f0f0;
        }

        .benefits-list li:last-child {
          border-bottom: none;
        }

        .security-note {
          margin: 0;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          color: #666;
          font-size: 13px;
          line-height: 1.5;
          border-left: 3px solid #28a745;
        }

        .security-note strong {
          color: #28a745;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-section {
            padding: 20px 16px;
          }

          .profile-form {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .profile-header h2 {
            font-size: 24px;
          }

          .main-header {
            padding: 12px 16px;
          }

          .main-header h1 {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .profile-section {
            padding: 16px 12px;
          }

          .profile-form {
            padding: 16px;
          }

          .welcome-note {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CompleteProfile;