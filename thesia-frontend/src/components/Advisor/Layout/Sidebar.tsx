import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../../services/authService';
import './Sidebar.styles.css';

const advisorLinks = [
  { to: '/advisor/dashboard', label: 'Dashboard' },
  { to: '/advisor/theses', label: 'Tesis Asignadas' },
  { to: '/advisor/documents', label: 'Documentos Recibidos' },
  { to: '/advisor/students', label: 'Estudiantes Asignados' },
  { to: '/advisor/resources', label: 'Recursos y Guías' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getStoredUser();
  const handleClick = (to: string) => {
    console.log(`[SIDEBAR] Click en link: ${to}`);
    console.log(`[SIDEBAR] Usuario: ${user?.email}, Rol: ${user?.role}`);
    navigate(to);
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">THESIA</div>
      <nav className="sidebar-nav">
        <ul>
          {advisorLinks.map(link => (
            <li key={link.to} className={location.pathname === link.to ? 'active' : ''}>
              <button className="sidebar-link-btn" onClick={() => handleClick(link.to)}>{link.label}</button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
