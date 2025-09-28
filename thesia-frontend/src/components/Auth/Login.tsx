import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

declare global {
  interface Window {
    google: any;
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si ya está autenticado
    if (authService.isAuthenticated()) {
      console.log('✅ Usuario ya autenticado, redirigiendo...');
      navigate('/dashboard');
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
          height: 320px;
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
        .login-google-btn {
          position: absolute;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
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
            height: 350px;
          }
          .login-logo {
            width: 80px;
            height: 80px;
          }
          .login-desc {
            font-size: 13px;
            top: 150px;
          }
          .login-google-btn {
            width: 280px;
            bottom: 80px;
          }
          .error-message {
            max-width: 250px;
            top: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;