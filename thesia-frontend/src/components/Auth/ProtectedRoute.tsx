import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    console.log('--- [ProtectedRoute] ---');
    console.log(`Ruta solicitada: ${location.pathname}`);
    const isAuth = authService.isAuthenticated();
    console.log(`¿Autenticado?: ${isAuth ? 'Sí' : 'No'}`);
    if (isAuth) {
      const user = authService.getStoredUser();
      console.log(`[USER] email: ${user?.email}`);
      console.log(`[USER] rol: ${user?.role}`);
      console.log(`[USER] profileCompleted: ${user?.profileCompleted}`);
      console.log(`[USER] carrera: ${user?.carrera}`);
      console.log(`[USER] codigo_estudiante: ${user?.codigo_estudiante}`);
      console.log(`[USER] especialidad: ${user?.especialidad}`);
      console.log(`[USER] ciclo: ${user?.ciclo}`);
      console.log(`[USER] id: ${user?.id}`);
    }
    console.log('------------------------');
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


  // 🔒 BLOQUEAR /complete-profile PARA ASESORES SIEMPRE
  if (currentPath === '/complete-profile' && user?.role === 'asesor') {
    console.warn('[ProtectedRoute] Redirigiendo: asesor no puede acceder a /complete-profile');
    return <Navigate to="/advisor/dashboard" replace />;
  }

  // 🔧 BLOQUEAR /complete-profile SI YA COMPLETÓ EL PERFIL (solo estudiantes)
  if (currentPath === '/complete-profile' && user?.role === 'estudiante' && user?.profileCompleted) {
    console.warn('[ProtectedRoute] Redirigiendo: estudiante ya completó perfil');
    return <Navigate to="/dashboard" replace />;
  }



  // 🚫 BLOQUEAR ACCESO DE ASESOR A RUTAS DE ESTUDIANTE, PERMITIR TODAS LAS /advisor/*
  const isAdvisorRoute = currentPath.startsWith('/advisor/');
  if (user?.role === 'asesor') {
    if (!isAdvisorRoute) {
      console.warn(`[ProtectedRoute] Redirigiendo: asesor no puede acceder a ruta de estudiante (${currentPath})`);
      return <Navigate to="/advisor/dashboard" replace />;
    } else {
      console.log(`[ProtectedRoute] Asesor accediendo a ruta de asesor: ${currentPath}`);
    }
    // Si es ruta de asesor, permitir acceso
  }

  // 🔧 SOLO ESTUDIANTES: REDIRIGIR A COMPLETAR PERFIL SI NO LO HA HECHO
  if (user?.role === 'estudiante' && currentPath !== '/complete-profile' && !user?.profileCompleted) {
    console.warn('[ProtectedRoute] Redirigiendo: estudiante con perfil incompleto');
    return <Navigate to="/complete-profile" replace />;
  }

  // 🔧 PROTECCIÓN ADICIONAL: VERIFICAR DATOS MÍNIMOS REQUERIDOS
  // Solo estudiantes deben tener carrera y codigo_estudiante
  if (user?.role === 'estudiante' && user?.profileCompleted && (!user.carrera || !user.codigo_estudiante)) {
    console.warn('[ProtectedRoute] Redirigiendo: datos de perfil inconsistentes, forzando completar perfil (solo estudiante)');
    console.log(`[ProtectedRoute] Estado de carrera: ${user.carrera}, codigo_estudiante: ${user.codigo_estudiante}`);
    // Actualizar el estado local para forzar completar perfil
    const updatedUser = { ...user, profileCompleted: false };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return <Navigate to="/complete-profile" replace />;
  }

  // ✅ ACCESO PERMITIDO
  console.log(`[ProtectedRoute] Acceso permitido a: ${currentPath}`);

  return <>{children}</>;
};

export default ProtectedRoute;