import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            width: 300,
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    
    try {
      // Verificar el token con nuestro backend
      const result = await authService.verifyGoogleToken(response.credential);
      
      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        onError(result.message || 'Error en la autenticación');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      onError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#1976d2', marginBottom: '10px' }}>
          Iniciar Sesión
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Usa tu cuenta institucional @tecsup.edu.pe
        </p>
      </div>

      {isLoading ? (
        <div style={{
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #1976d2',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px'
          }}></div>
          Verificando credenciales...
        </div>
      ) : (
        <div id="google-signin-button"></div>
      )}

      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        maxWidth: '300px'
      }}>
        ⚠️ Solo se permite el acceso con cuentas del dominio @tecsup.edu.pe
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GoogleLogin;