import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

declare global {
  interface Window {
    google: any;
  }
}

const Login: React.FC = () => {
  // Estado para redirección inmediata tras login
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Verificar si ya está autenticado
    if (authService.isAuthenticated()) {
      const user = authService.getStoredUser();
      if (user?.role === 'asesor') {
        navigate('/advisor/dashboard');
      } else {
        navigate('/dashboard');
      }
      return;
    }

    // Cargar el script de Google
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '568210598033-0asqd2des37td5np5h1gauspsjsa62b1.apps.googleusercontent.com',
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        // Renderizar el botón de Google en el botón existente
        const googleBtn = document.getElementById('google-login-button');
        if (googleBtn) {
          // Limpiar el botón y agregar el de Google
          googleBtn.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtn, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            width: 300,
          });
        }

        console.log('🔧 Google Sign-In inicializado en Login');
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [navigate]);

  const handleGoogleResponse = async (response: any) => {
    console.log('🔐 Iniciando autenticación con Google...');
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authService.verifyGoogleToken(response.credential);
      
      if (result.success && result.user) {
        console.log('✅ Autenticación exitosa:', result.user);
        
        // 🎯 NUEVA LÓGICA: Usar isFirstLogin del backend
        const needsProfileCompletion = result.isFirstLogin === true;
        
        if (needsProfileCompletion) {
          console.log('📝 Primer login detectado - Redirigiendo a completar perfil');
          navigate('/complete-profile', { replace: true });
        } else {
          console.log('✅ Usuario con perfil completo - Redirigiendo al dashboard');
          navigate('/dashboard', { replace: true });
        }
      } else {
        console.error('❌ Error de autenticación:', result.message);
        setError(result.message || 'Error en la autenticación');
      }
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFallbackLogin = () => {
    // Si Google no carga, mostrar mensaje o abrir popup manual
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      setError('Error cargando Google Sign-In. Por favor recarga la página.');
    }
  };

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await authService.login({ email, password });
      if (result.success && result.token && result.user) {
        // Redirigir según rol usando estado para forzar render
        if (result.user.role === 'asesor') {
          setRedirectPath('/advisor/dashboard');
        } else {
          setRedirectPath('/dashboard');
        }
      } else {
        setError(result.message || 'Credenciales incorrectas');
      }
    } catch (error: any) {
      setError(error.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirección segura tras login exitoso
  React.useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [redirectPath, navigate]);

  // ...existing code...
  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo-group">
          <img
            src="/logo-thesia.png"
            alt="Thesia Logo"
            className="login-logo"
          />
        </div>
        <p className="login-desc">
          Gestor de Tesis y PreTesis - TECSUP Centro
        </p>

        {/* Estado de carga */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Verificando credenciales...</p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        {/* NUEVO: Separación visual y títulos */}
        <div className="login-section">
          <h3 className="login-title">Acceso para Asesores</h3>
          <form onSubmit={handleTraditionalLogin} style={{ marginBottom: '16px', marginTop: '8px' }}>
            <input
              type="email"
              placeholder="Correo institucional"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '90%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #dadce0' }}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '90%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #dadce0' }}
              required
            />
            <button
              type="submit"
              style={{ width: '95%', padding: '10px', borderRadius: '6px', background: '#1976d2', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              disabled={isLoading}
            >
              Ingresar como Asesor
            </button>
          </form>
        </div>

        <div className="login-divider">
          <span>O</span>
        </div>

        <div className="login-section">
          <h3 className="login-title">Acceso para Alumnos</h3>
          {/* Botón de Google (será reemplazado por el componente de Google) */}
          <div 
            id="google-login-button"
            className="login-google-btn"
            onClick={!window.google ? handleFallbackLogin : undefined}
            style={{
              display: isLoading ? 'none' : 'flex'
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="login-google-icon"
            />
            Continuar con Gmail
          </div>
        </div>

        {/* Info adicional */}
        <div className="login-info">
          <small>🔒 Solo cuentas @tecsup.edu.pe</small>
        </div>
      </div>
      
      <style>{`
        .login-bg {
          min-height: 100vh;
          width: 100vw;
          background: url('/bg-tecsup.jpg') center center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .login-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          padding: 0;
          width: 380px;
          min-height: 480px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .login-logo-group {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-logo {
          width: 100px;
          height: 100px;
        }
        .login-desc {
          position: absolute;
          top: 140px;
          left: 50%;
          transform: translateX(-50%);
          color: #666;
          font-size: 14px;
          line-height: 1.4;
          white-space: nowrap;
          margin: 0;
        }
        .login-section {
          margin-top: 170px;
          margin-bottom: 0;
          padding: 0 24px;
        }
        .login-title {
          font-size: 16px;
          font-weight: 600;
          color: #1976d2;
          margin-bottom: 8px;
          margin-top: 0;
        }
        .login-divider {
          width: 100%;
          text-align: center;
          margin: 12px 0 0 0;
        }
        .login-divider span {
          background: #fff;
          color: #888;
          padding: 2px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #eee;
        }
        .login-google-btn {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1px solid #dadce0;
          border-radius: 6px;
          padding: 12px 24px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #3c4043;
          transition: all 0.2s;
          width: 300px;
          height: 48px;
        }
        .login-google-btn:hover {
          box-shadow: 0 2px 8px rgba(60,64,67,.2);
          background: #f8f9fa;
        }
        .login-google-icon {
          width: 20px;
          height: 20px;
        }
        .login-info {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          color: #666;
        }
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .loading-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #1976d2;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        .error-message {
          position: absolute;
          top: 170px;
          left: 50%;
          transform: translateX(-50%);
          background: #fee2e2;
          border: 1px solid #ef4444;
          color: #dc2626;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          max-width: 280px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          z-index: 5;
        }
        .close-error {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .login-card {
            width: 90vw;
            min-height: 520px;
          }
          .login-logo {
            width: 80px;
            height: 80px;
          }
          .login-desc {
            font-size: 13px;
            top: 150px;
          }
          .login-section {
            margin-top: 150px;
            padding: 0 8px;
          }
          .login-google-btn {
            width: 240px;
          }
          .error-message {
            max-width: 250px;
            top: 180px;
          }
        }
      `}</style>
    </div>
  );
}
export default Login;