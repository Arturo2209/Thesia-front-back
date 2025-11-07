import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import type { User } from '../../services/authService';

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = authService.getStoredUser();
    if (userData) {
      setUser(userData);
      console.log('👤 Datos del usuario en Sidebar:', userData);
    }
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getActiveClass = (path: string) => {
    return isActive(path) ? 'nav-item active' : 'nav-item';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // 🔧 FUNCIÓN DE NAVEGACIÓN CORREGIDA
  const handleNavigation = (path: string) => {
    console.log(`🎯 Sidebar navegando a: ${path}`);
    
    // Verificar si el perfil está completo para ciertas rutas
    const user = authService.getStoredUser();
    // 🔧 CORREGIDO: Ahora puede acceder a codigo_estudiante
    const profileIncomplete = !user?.carrera || !user?.codigo_estudiante;
    
    const restrictedRoutes = ['/mis-documentos', '/mi-asesor', '/notificaciones'];
    
    if (profileIncomplete && restrictedRoutes.includes(path)) {
      console.log('🚫 Perfil incompleto - Redirigiendo a completar perfil');
      navigate('/complete-profile');
      return;
    }
    
    navigate(path);
  };

  // 🔧 FUNCIÓN PARA OBTENER CLASE CON RESTRICCIONES
  const getNavItemClass = (path: string) => {
    const user = authService.getStoredUser();
    const profileIncomplete = !user?.carrera || !user?.codigo_estudiante;
    const restrictedRoutes = ['/mis-documentos', '/mi-asesor', '/notificaciones'];
    
    const isRestricted = profileIncomplete && restrictedRoutes.includes(path);
    const isCurrentPath = location.pathname === path;
    
    let className = 'nav-item';
    if (isCurrentPath) className += ' active';
    if (isRestricted) className += ' restricted';
    
    return className;
  };

  return (
    <div className="sidebar">
      {/* 🎨 HEADER CON LOGO A LA IZQUIERDA */}
      <div className="sidebar-header">
        <div className="logo-container">
          <img 
            src="/logo.png" 
            alt="THESIA Logo"
            className="sidebar-logo"
            onError={(e) => {
              console.log('Error cargando logo, verificar que existe: /logo.png');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>
      
      {/* 🧭 NAVEGACIÓN */}
      <nav className="sidebar-nav">
        <div className={getActiveClass('/dashboard')} onClick={() => handleNavigation('/dashboard')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Inicio</span>
        </div>
        
        <div className={getActiveClass('/mi-tesis')} onClick={() => handleNavigation('/mi-tesis')}>
          <span className="nav-icon">📝</span>
          <span className="nav-text">Mi Tesis</span>
        </div>
        
        <div className={getNavItemClass('/mis-documentos')} onClick={() => handleNavigation('/mis-documentos')}>
          <span className="nav-icon">📄</span>
          <span className="nav-text">Documentos</span>
        </div>
        
        <div className={getNavItemClass('/mi-asesor')} onClick={() => handleNavigation('/mi-asesor')}>
          <span className="nav-icon">👨‍🏫</span>
          <span className="nav-text">Mi Asesor</span>
        </div>
        
        
        
        <div className={getNavItemClass('/notificaciones')} onClick={() => handleNavigation('/notificaciones')}>
          <span className="nav-icon">🔔</span>
          <span className="nav-text">Notificaciones</span>
        </div>
      </nav>

      {/* 👤 FOOTER CON USUARIO */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar" style={{
            backgroundImage: user?.picture ? `url(${user.picture})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {!user?.picture && (user ? getInitials(user.name) : 'U')}
          </div>
          <div className="user-details">
            <div className="user-role">
              {user?.role === 'asesor' ? 'Asesor' : 
               user?.role === 'coordinador' ? 'Coordinador' : 
               'Estudiante'}
            </div>
            <div className="user-name" title={user?.email}>
              {user?.name || 'Usuario'}
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="logout-btn"
        >
          <span className="nav-icon">↗</span>
          <span className="nav-text">Cerrar Sesión</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 280px;
          min-width: 280px;
          background: linear-gradient(180deg, #1976d2 0%, #1565c0 100%);
          color: white;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 50; /* Reducido para evitar conflictos con otros elementos */
          box-shadow: 2px 0 8px rgba(0,0,0,0.1);
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .sidebar-logo {
          width: calc(100% - 40px);  /* Se ajusta al sidebar automáticamente */
          max-width: 800px;          /* Máximo 200px */
          height: auto;
          max-height: 90px;
          object-fit: contain;
          border-radius: 4px;
          transition: transform 0.2s ease;
          filter: brightness(1.8) contrast(1.5) saturate(1.2);
          padding: 8px;
        }

        .sidebar-logo:hover {
          transform: scale(1.02);
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
          margin: 2px 12px;
          border-radius: 8px;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: rgba(255,255,255,0.15);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* 🔒 ESTILOS PARA SECCIONES RESTRINGIDAS */
        .nav-item.restricted {
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        .nav-item.restricted::after {
          content: '🔒';
          position: absolute;
          right: 20px;
          font-size: 14px;
        }

        .nav-item.restricted:hover {
          background: rgba(255,255,255,0.05) !important;
          transform: none !important;
        }

        .nav-icon {
          font-size: 18px;
          width: 20px;
          text-align: center;
        }

        .nav-text {
          font-size: 15px;
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .user-details {
          flex: 1;
          overflow: hidden;
        }

        .user-role {
          font-size: 12px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .logout-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        .main-content {
          margin-left: 280px; /* Ajustado para que el contenido principal no se superponga */
          padding: 20px;
          overflow-y: auto;
        }

        @media (max-width: 1024px) {
          .sidebar {
            width: 260px;
            min-width: 260px;
          }
          
          .sidebar-logo {
            width: 100px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            position: absolute; /* Cambiado a absolute para pantallas pequeñas */
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1000;
          }
          
          .sidebar-logo {
            width: 90px;
          }

          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;