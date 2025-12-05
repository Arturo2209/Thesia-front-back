import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarCss = `
.student-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
}

.student-sidebar .brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.student-sidebar .brand-icon {
  font-size: 28px;
}

.student-sidebar .brand-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.student-sidebar nav {
  padding: 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.student-sidebar .nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.1s ease;
}

.student-sidebar .nav-item:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-1px);
}

.student-sidebar .nav-item.active {
  background: rgba(255,255,255,0.25);
}

.student-sidebar .nav-icon {
  font-size: 18px;
  width: 22px;
  text-align: center;
}

@media (max-width: 1024px) {
  .student-sidebar { width: 240px; }
}
@media (max-width: 768px) {
  .student-sidebar { position: static; height: auto; width: 100%; flex-direction: row; }
  .student-sidebar nav { flex-direction: row; flex-wrap: wrap; }
}
`;

const StudentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: 'Inicio', icon: '🏠', path: '/' },
    { label: 'Mi Tesis', icon: '🎓', path: '/mi-tesis' },
    { label: 'Documentos', icon: '📄', path: '/documentos' },
    { label: 'Mi Asesor', icon: '👨\u200d🏫', path: '/mi-asesor' },
    { label: 'Reuniones', icon: '🗓️', path: '/mis-reuniones' },
    { label: 'Notificaciones', icon: '🔔', path: '/notificaciones' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="student-sidebar">
      <div className="brand">
        <span className="brand-icon">🎓</span>
        <span className="brand-title">THESIA</span>
      </div>
      <nav>
        {items.map((item) => (
          <a
            key={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigate(item.path); }}
            href={item.path}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <style>{sidebarCss}</style>
    </aside>
  );
};

export default StudentSidebar;
