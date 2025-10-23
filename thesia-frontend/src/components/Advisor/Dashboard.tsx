import React from 'react';
import { useAdvisorDashboard } from './hooks/useAdvisorDashboard';
import StudentsList from './StudentsList';
import Sidebar from './Layout/Sidebar';
console.log('[AdvisorDashboard] Renderizando Sidebar exclusivo del asesor');

const AdvisorDashboard: React.FC = () => {
  const { data, loading, error } = useAdvisorDashboard();

  console.log('[AdvisorDashboard] Renderizando dashboard...');
  return (
    <div>
      <Sidebar />
      <main className="advisor-main-content">
        <h1 style={{ color: '#1976d2' }}>Panel del Asesor</h1>
        <p style={{ color: '#333' }}>Bienvenido al dashboard del asesor. Aquí verás tus reuniones próximas, estudiantes asignados y documentos pendientes de revisión.</p>
        <div style={{ margin: '1rem 0', color: '#e91e63', fontWeight: 'bold' }}>
          [LOG] Estado: {loading ? 'Cargando...' : error ? 'Error' : 'Listo'}
        </div>
        {loading ? (
          <p style={{ color: '#1976d2', fontWeight: 'bold' }}>Cargando datos...</p>
        ) : error ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>
        ) : data ? (
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h3>Estudiantes asignados</h3>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>{data.totalEstudiantes}</span>
            </div>
            <div>
              <h3>Reuniones pendientes</h3>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>{data.reunionesPendientes}</span>
            </div>
            <div>
              <h3>Documentos por revisar</h3>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e91e63' }}>{data.documentosPorRevisar}</span>
            </div>
          </div>
        ) : (
          <p style={{ color: '#333', fontWeight: 'bold' }}>No se encontraron datos.</p>
        )}
        <div style={{ marginTop: '2rem' }}>
          <StudentsList />
        </div>
        <div style={{ marginTop: '2rem', color: '#1976d2', fontSize: '1rem' }}>
          [LOG] Renderizado completo del dashboard asesor
        </div>
      </main>
    </div>
  );
};

export default AdvisorDashboard;
