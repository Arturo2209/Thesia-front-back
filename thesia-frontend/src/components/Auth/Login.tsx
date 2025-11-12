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

  // Fallback eliminado: dejamos solo el botón nativo de Google (GSI)

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
        <div className="login-header">
          <img src="/logo-thesia.png" alt="Thesia Logo" className="login-logo" />
          <p className="login-desc">Gestor de Tesis y PreTesis - TECSUP Centro</p>
        </div>

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

        <div className="login-section">
          <h3 className="login-title">Acceso para Asesores</h3>
          <form onSubmit={handleTraditionalLogin} className="login-form">
            <input
              type="email"
              placeholder="Correo institucional"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <button type="submit" className="login-submit" disabled={isLoading}>
              Ingresar como Asesor
            </button>
          </form>
        </div>

  <div className="login-divider"><span>O</span></div>

        <div className="login-section">
          <h3 className="login-title">Acceso para Alumnos</h3>
          {/* Contenedor vacío para que Google GSI renderice su botón por defecto */}
          <div id="google-login-button" className="login-google-btn" style={{ display: isLoading ? 'none' : undefined }} />
        </div>

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
          padding: 24px;
        }
        .login-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          padding: 24px 24px 20px;
          width: 420px;
          text-align: center;
          position: relative;
        }
    .login-header { display:flex; flex-direction:column; align-items:center; gap:8px; margin-bottom: 12px; }
  .login-logo { width: 140px !important; height: 140px !important; }
        .login-desc { color: #6b7280; font-size: 13px; margin: 0 0 8px; }

        .login-section { margin-top: 10px; }
        .login-title { font-size: 15px; font-weight: 700; color: #1976d2; margin: 0 0 8px; }
        .login-form { display:flex; flex-direction:column; gap:10px; align-items:center; }
        .login-input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #dadce0; font-size: 14px; }
        .login-submit { width: 100%; padding: 10px 12px; border-radius: 8px; background: #1976d2; color: #fff; font-weight: 700; border: none; cursor: pointer; }
        .login-submit:disabled { opacity: .7; cursor: not-allowed; }

        .login-divider { width:100%; display:flex; align-items:center; justify-content:center; margin: 12px 0; }
        .login-divider span { background:#fff; color:#888; padding: 2px 12px; border-radius: 12px; font-size: 13px; font-weight: 500; border: 1px solid #eee; }

        .login-google-btn { margin-top: 8px; display: inline-flex; width: auto; height: auto; padding: 0; border: none; background: transparent; box-shadow: none; }

        .login-info { margin-top: 12px; font-size: 11px; color: #6b7280; }

        .loading-overlay { position:absolute; inset:0; background: rgba(255,255,255,.95); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:10; }
        .loading-spinner { border: 3px solid #f3f3f3; border-top:3px solid #1976d2; border-radius:50%; width:30px; height:30px; animation: spin 1s linear infinite; margin-bottom: 10px; }
        @keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }

        .error-message { background:#fee2e2; border:1px solid #ef4444; color:#dc2626; padding:8px 12px; border-radius:6px; font-size:12px; display:flex; align-items:center; justify-content:space-between; gap:8px; margin: 6px 0; }
        .close-error { background:none; border:none; color:#dc2626; cursor:pointer; font-size:16px; font-weight:bold; padding:0; width:20px; height:20px; display:flex; align-items:center; justify-content:center; }

        @media (max-width: 600px) {
          .login-card { width: 92vw; padding: 20px 16px; }
          .login-logo { width: 110px !important; height: 110px !important; }
        }
      `}</style>
    </div>
  );
}
export default Login;