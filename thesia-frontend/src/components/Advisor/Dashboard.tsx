import React from 'react';
import { useAdvisorDashboard } from './hooks/useAdvisorDashboard';
import StudentsList from './StudentsList';
import Sidebar from './Layout/Sidebar';
import { dashboardStyles } from './styles/Dashboard.styles';

interface StatCardProps {
  title: string;
  value: number;
  color: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, description }) => (
  <div className="stat-card" style={{ borderColor: color }}>
    <h3 className="stat-title">{title}</h3>
    <span className="stat-value" style={{ color }}>{value}</span>
    {description && <p className="stat-description">{description}</p>}
  </div>
);

const AdvisorDashboard: React.FC = () => {
  const { data, loading, error } = useAdvisorDashboard();

  return (
    <div className="asesor-container">
      <Sidebar />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h2 className="dashboard-title">Panel del Asesor</h2>
              <p className="dashboard-subtitle">
                Bienvenido a tu espacio de gestión. Aquí encontrarás un resumen de tus actividades y responsabilidades.
              </p>
            </div>
            
            {loading && <div className="loading-indicator">Actualizando datos...</div>}
          </div>

          {error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button className="retry-button" onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </div>
          ) : data ? (
            <>
              <div className="stats-grid">
                <StatCard
                  title="Estudiantes Asignados"
                  value={data.totalEstudiantes}
                  color="#4caf50"
                  description="Tesistas bajo tu supervisión"
                />
                <StatCard
                  title="Reuniones Pendientes"
                  value={data.reunionesPendientes}
                  color="#ff9800"
                  description="Asesorías programadas"
                />
                <StatCard
                  title="Documentos por Revisar"
                  value={data.documentosPorRevisar}
                  color="#e91e63"
                  description="Documentos que requieren tu atención"
                />
              </div>

              <section className="dashboard-section">
                <h2 className="section-title">Estudiantes Asignados</h2>
                <StudentsList />
              </section>
            </>
          ) : null}
        </div>
      </div>
      <style>{dashboardStyles}</style>
    </div>
  );
};

export default AdvisorDashboard;
