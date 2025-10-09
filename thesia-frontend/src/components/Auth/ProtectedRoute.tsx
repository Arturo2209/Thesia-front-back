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
      console.log(`📝 Perfil completado: ${user?.profileCompleted ? '✅ Sí' : '❌ No'}`);
    }
  }, [location.pathname]);

  // 🔐 PASO 1: Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    console.log('🚫 Acceso denegado - Redirigiendo al login');
    
    // Limpiar datos posiblemente corruptos
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir al login
    return <Navigate to="/" replace />;
  }

  // 🔐 PASO 2: Obtener datos del usuario
  const user = authService.getStoredUser();
  const currentPath = location.pathname;

  // 🔧 NUEVA PROTECCIÓN: BLOQUEAR /complete-profile SI YA COMPLETÓ EL PERFIL
  if (currentPath === '/complete-profile' && user?.profileCompleted) {
    console.log('🚫 Perfil ya completado - Bloqueando acceso a /complete-profile');
    console.log('🔄 Redirigiendo a dashboard...');
    return <Navigate to="/dashboard" replace />;
  }

  // 🔧 NUEVA PROTECCIÓN: REDIRIGIR A COMPLETAR PERFIL SI NO LO HA HECHO
  if (currentPath !== '/complete-profile' && !user?.profileCompleted) {
    console.log('⚠️ Perfil incompleto - Redirigiendo a /complete-profile');
    console.log('📝 Usuario debe completar su perfil primero');
    return <Navigate to="/complete-profile" replace />;
  }

  // 🔧 PROTECCIÓN ADICIONAL: VERIFICAR DATOS MÍNIMOS REQUERIDOS
  if (user?.profileCompleted && (!user.carrera || !user.codigo_estudiante)) {
    console.log('⚠️ Datos de perfil inconsistentes - Forzando completar perfil');
    console.log('🔧 Marcando perfil como incompleto...');
    
    // Actualizar el estado local para forzar completar perfil
    const updatedUser = { ...user, profileCompleted: false };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return <Navigate to="/complete-profile" replace />;
  }

  // ✅ ACCESO PERMITIDO
  console.log('✅ Acceso permitido a:', currentPath);
  
  // Log del estado del usuario para debug
  if (user) {
    console.log('📊 Estado del usuario:', {
      nombre: user.name,
      email: user.email,
      rol: user.role,
      carrera: user.carrera,
      codigo: user.codigo_estudiante,
      profileCompleted: user.profileCompleted
    });
  }

  return <>{children}</>;
};

export default ProtectedRoute;