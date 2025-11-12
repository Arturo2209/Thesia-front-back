import React from 'react';
import ResourcesList from './components/ResourcesList';
import Sidebar from '../Layout/Sidebar';
import { dashboardStyles } from '../../Dashboard/Dashboard.styles';

// Inyectar override puntual para fondo blanco en recursos si otro estilo gris persiste
const resourcesOverride = `
  .dashboard-container, .main-content { background: #ffffff !important; }
`;

const AdvisorResourcesPage = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>
        <div className="content-section">
          <ResourcesList />
        </div>
      </div>
  <style>{dashboardStyles + resourcesOverride}</style>
    </div>
  );
};

export default AdvisorResourcesPage;