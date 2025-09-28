import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    console.log(`🔍 Verificando acceso a: ${location.pathname}`);
    
    const isAuth = authService.isAuthenticated();
    console.log(`🔐 Usuario autenticado: ${isAuth ? '✅ Sí' : '❌ No'}`);
    
    if (isAuth) {
      const user = authService.getStoredUser();
      console.log(`👤 Usuario actual:`, user?.name, `(${user?.role})`);
    }
  }, [location.pathname]);

  // Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    console.log('🚫 Acceso denegado - Redirigiendo al login');
    
    // Limpiar datos posiblemente corruptos
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir al login
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, mostrar el componente
  console.log('✅ Acceso permitido');
  return <>{children}</>;
};

export default ProtectedRoute;