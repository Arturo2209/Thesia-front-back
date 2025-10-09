import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import authService from '../../services/authService';

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  
  // 🔧 FORMULARIO ACTUALIZADO CON APELLIDO SEPARADO
  const [formData, setFormData] = useState({
    codigo_estudiante: '',
    nombre: '',        // Solo nombre
    apellido: '',      // 🔧 NUEVO CAMPO
    carrera: '',
    ciclo: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔧 PROTECCIÓN: Verificar si ya completó el perfil
  useEffect(() => {
    const user = authService.getStoredUser();
    
    console.log('🔍 Verificando estado del perfil:', {
      user: user?.name,
      profileCompleted: user?.profileCompleted
    });

    // 🚫 SI YA COMPLETÓ EL PERFIL, REDIRIGIR AL DASHBOARD
    if (user?.profileCompleted) {
      console.log('✅ Perfil ya completado - Redirigiendo a dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Cargar datos existentes si los hay
    if (user) {
      // 🔧 DIVIDIR EL NOMBRE COMPLETO SI VIENE JUNTO
      const nombreCompleto = user.name || '';
      const partesNombre = nombreCompleto.trim().split(' ');
      
      setFormData(prev => ({
        ...prev,
        nombre: partesNombre[0] || '',  // Primer palabra como nombre
        apellido: partesNombre.slice(1).join(' ') || '',  // Resto como apellido
        codigo_estudiante: user.codigo_estudiante || ''
      }));

      console.log('📝 Datos cargados en formulario:', {
        nombre: partesNombre[0] || '',
        apellido: partesNombre.slice(1).join(' ') || '',
        codigo_estudiante: user.codigo_estudiante || ''
      });
    }
  }, [navigate]);

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

  const ciclos = [5, 6];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'ciclo') {
      setFormData(prev => ({ ...prev, ciclo: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    console.log(`🔧 Campo actualizado: ${name} = ${value}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 🔧 VALIDACIONES ACTUALIZADAS
      if (!formData.codigo_estudiante || formData.codigo_estudiante.length < 4) {
        setError('Por favor ingresa tu código de estudiante');
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

      // 🔧 NUEVA VALIDACIÓN PARA APELLIDO
      if (!formData.apellido.trim()) {
        setError('Por favor ingresa tu apellido');
        setIsLoading(false);
        return;
      }

      console.log('📝 Completando perfil con datos separados:', formData);

      // 🔧 LLAMAR AL SERVICIO CON CAMPOS SEPARADOS
      const result = await authService.updateUserProfile({
        carrera: formData.carrera,
        ciclo: formData.ciclo,
        codigo_estudiante: formData.codigo_estudiante,
        nombre: formData.nombre,      // Solo nombre
        apellido: formData.apellido   // 🔧 APELLIDO SEPARADO
      });

      console.log('🔍 Resultado del servidor:', result);

      if (result.success) {
        console.log('✅ Perfil completado exitosamente');
        
        // Actualizar datos locales
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          console.log('💾 Datos de usuario actualizados en localStorage:', result.user);
        }

        if (result.token) {
          localStorage.setItem('token', result.token);
          console.log('🔑 Token actualizado');
        }

        // Redirigir al dashboard
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

  const handleLogout = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      await authService.logout();
      console.log('✅ Logout exitoso, redirigiendo...');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Error en logout:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="dashboard-section">
          {/* ALERTA DE PERFIL INCOMPLETO */}
          <div className="alert-banner">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Perfil Incompleto</strong>
              <p>Debes completar tu perfil antes de acceder a las funcionalidades del sistema.</p>
            </div>
          </div>

          {/* CARD DE MI PERFIL - IGUAL AL DASHBOARD */}
          <div className="card">
            <div className="profile-header">
              <span className="profile-icon">👤</span>
              <div>
                <h2>Mi Perfil</h2>
                <p>Completa tu información personal para continuar</p>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <div className="info-text">
                Para acceder al sistema completo, necesitas completar todos los campos obligatorios. Esta información será utilizada para personalizar tu experiencia y gestionar tu proceso de tesis.
              </div>
            </div>

            {error && (
              <div className="error-alert">
                <span className="error-icon">❌</span>
                <span className="error-message">{error}</span>
                <button className="error-close" onClick={() => setError('')}>×</button>
              </div>
            )}

            {/* 🔧 FORMULARIO ACTUALIZADO - NOMBRE Y APELLIDO SEPARADOS */}
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Código de Estudiante</label>
                  <input
                    type="text"
                    name="codigo_estudiante"
                    value={formData.codigo_estudiante}
                    onChange={handleInputChange}
                    placeholder="T17006"
                    className="form-input"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* 🔧 CAMPO NOMBRE SEPARADO */}
                <div className="form-group">
                  <label className="form-label">Nombre <span className="required">*</span></label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Carlos Arturo"
                    className="form-input"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                {/* 🔧 NUEVO CAMPO APELLIDO */}
                <div className="form-group">
                  <label className="form-label">Apellido <span className="required">*</span></label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Bullon Supanta"
                    className="form-input"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Carrera <span className="required">*</span>
                  </label>
                  <select 
                    name="carrera" 
                    value={formData.carrera} 
                    onChange={handleInputChange}
                    className="form-select"
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Ciclo Actual <span className="required">*</span>
                  </label>
                  <select 
                    name="ciclo" 
                    value={formData.ciclo} 
                    onChange={handleInputChange}
                    className="form-select"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Selecciona tu ciclo</option>
                    {ciclos.map((ciclo) => (
                      <option key={ciclo} value={ciclo}>
                        {ciclo}° Ciclo
                      </option>
                    ))}
                  </select>
                </div>

                {/* CELDA VACÍA PARA MANTENER EL GRID */}
                <div className="form-group"></div>
              </div>

              {/* 🔧 VALIDACIÓN ACTUALIZADA PARA INCLUIR APELLIDO */}
              <button 
                type="submit" 
                className="register-btn"
                disabled={isLoading || !formData.carrera || !formData.codigo_estudiante || !formData.nombre.trim() || !formData.apellido.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    💾 Guardar y Continuar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
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
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .notification-icon:hover {
          background: #f0f0f0;
        }

        .dashboard-section {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .alert-banner {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 32px;
          display: flex;
          gap: 12px;
        }

        .alert-icon {
          font-size: 20px;
          color: #856404;
        }

        .alert-content strong {
          color: #856404;
          display: block;
          margin-bottom: 4px;
        }

        .alert-content p {
          color: #664d03;
          margin: 0;
          font-size: 14px;
        }

        .card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
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
          background: #e3f2fd;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #1976d2;
        }

        .profile-header h2 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .profile-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .info-box {
          background: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .info-icon {
          font-size: 16px;
          margin-top: 2px;
          color: #1976d2;
        }

        .info-text {
          color: #1565c0;
          font-size: 14px;
          line-height: 1.5;
        }

        .error-alert {
          background: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .error-icon {
          font-size: 16px;
          color: #d32f2f;
        }

        .error-message {
          flex: 1;
          color: #d32f2f;
          font-size: 14px;
        }

        .error-close {
          background: none;
          border: none;
          color: #d32f2f;
          cursor: pointer;
          font-size: 18px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .error-close:hover {
          background: rgba(211, 47, 47, 0.1);
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #333;
        }

        .required {
          color: #d32f2f;
        }

        .form-input,
        .form-select {
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background: white;
          color: #333;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        .form-input:disabled,
        .form-select:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .form-input::placeholder {
          color: #999;
        }

        .register-btn {
          background: #fd7e14;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          align-self: flex-end;
          min-width: 200px;
        }

        .register-btn:hover:not(:disabled) {
          background: #e85d04;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(253, 126, 20, 0.3);
        }

        .register-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 260px;
            width: calc(100vw - 260px);
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            width: 100vw;
          }
          
          .dashboard-section {
            padding: 16px;
          }

          .card {
            padding: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default CompleteProfile;