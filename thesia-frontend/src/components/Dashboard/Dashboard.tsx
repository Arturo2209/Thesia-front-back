import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import StudentHeader from '../Shared/StudentHeader';
import authService from '../../services/authService';
import { useDashboardData } from './hooks/useDashboardData';  // Importar hook
import { dashboardStyles } from './Dashboard.styles';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Usar el hook en lugar de gestionar estado manual
  const { 
    loading, 
    error, 
    data: dashboardData, 
    retry 
  } = useDashboardData();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const handleRegisterThesis = () => {
    console.log('Navegando a registro de tesis');
    navigate('/mi-tesis');
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando tu dashboard...</p>
          </div>
        </div>
        <style>{dashboardStyles}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <div className="error-message">{error.message}</div>
            <button className="retry-button" onClick={retry}>
              🔄 Reintentar
            </button>
          </div>
        </div>
        <style>{dashboardStyles}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />
      
      <div className="main-content">
        <StudentHeader title={`¡Bienvenid@ ${dashboardData?.user?.name || 'Usuario'}!`} />
        
        <div className="content-section">
          {/* Connection status removed by request */}
          {/* ALERT BANNER - SOLO SI NO TIENE TESIS */}
          {!dashboardData?.thesis?.hasThesis && (
            <div className="alert-banner">
              <div className="alert-content">
                <div className="alert-icon">⚠️</div>
                <div className="alert-text">
                  <h3>Información de Tesis Pendiente</h3>
                  <p>Debes registrar la información de tu tesis o pretesis para acceder a todas las funcionalidades.</p>
                </div>
                <button className="alert-button" onClick={handleRegisterThesis}>
                  Registrar ahora →
                </button>
              </div>
            </div>
          )}

          {/* Sección de información de usuario */}
          <div className="user-info-section">
            <h4>{dashboardData?.user?.roleDisplay || 'Estudiante'}</h4>
            <p>
              {dashboardData?.user?.carrera && `${dashboardData.user.carrera} - `}
              Aquí tienes un resumen de tu progreso y próximas tareas.
            </p>
          </div>

          {/* Grid principal del dashboard */}
          <div className="dashboard-grid">
            
              {/* Mi Asesor removido por solicitud */}
            <div className="left-column">
              
              {/* Tarjeta de progreso de tesis */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Progreso de Tesis</h3>
                  <span className="card-icon">📚</span>
                </div>
                <div className="card-content">
                  {dashboardData?.thesis?.hasThesis ? (
                    <>
                      <div className="thesis-info">
                        <h4>"{dashboardData.thesis.title}"</h4>
                        <p>Fase {dashboardData.thesis.currentPhase?.current || 1} de 5</p>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${dashboardData.thesis.overallProgress || 0}%` }}
                          aria-label={`Progreso ${dashboardData.thesis.overallProgress || 0}%`}
                        />
                      </div>
                      <p className="progress-text" title={`Fases completadas: ${(dashboardData.thesis.overallProgress||0)/20}/5`}>
                        {dashboardData.thesis.overallProgress || 0}%
                      </p>
                      {dashboardData.meetings?.next && (
                        <div style={{marginTop:12, padding:12, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8}}>
                          <strong style={{display:'block', marginBottom:4}}>Próxima reunión:</strong>
                          <span style={{fontSize:13}}>
                            {new Date(`${dashboardData.meetings.next.date}T${dashboardData.meetings.next.time}:00`).toLocaleDateString('es-ES',{day:'numeric', month:'short'})} • {dashboardData.meetings.next.time} • {dashboardData.meetings.next.modality}
                          </span>
                          {dashboardData.meetings.next.location && (
                            <div style={{fontSize:12,color:'#64748b',marginTop:4}}>📍 {dashboardData.meetings.next.location}</div>
                          )}
                          {dashboardData.meetings.next.link && (
                            <div style={{fontSize:12,color:'#64748b',marginTop:4}}>🔗 {dashboardData.meetings.next.link}</div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-thesis">
                      <div className="no-thesis-icon">📝</div>
                      <h4>No tienes una tesis registrada aún</h4>
                      <p>Registra tu tesis para ver el progreso</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid de estadísticas */}
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-icon">📊</div>
                  <div className="stat-number">{dashboardData?.thesis?.overallProgress || 0}%</div>
                  <div className="stat-label">Progreso Total</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon">✅</div>
                  <div className="stat-number">{dashboardData?.documents.approved || 0}</div>
                  <div className="stat-label">Docs Aprobados</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-number">{dashboardData?.documents.pending || 0}</div>
                  <div className="stat-label">Pendientes</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-icon">📅</div>
                  <div className="stat-number">{dashboardData?.thesis.daysRemaining || 0}</div>
                  <div className="stat-label">Días Restantes</div>
                </div>
              </div>

              {/* Actividad Reciente removida por solicitud: se migrará al dropdown del icono de notificaciones */}
            </div>

            {/* Columna derecha */}
            <div className="right-column">
              
              {/* Acciones rápidas */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Acciones Rápidas</h3>
                  <span className="card-icon">⚡</span>
                </div>
                <div className="card-content">
                  <div className="quick-actions">
                    {dashboardData?.quickActions?.map((action) => (
                      <button 
                        key={action.id}
                        className="action-button"
                        onClick={() => navigate(action.url)}
                        disabled={!action.isEnabled}
                      >
                        <span className="action-icon">{action.icon}</span>
                        <div className="action-content">
                          <span className="action-title">{action.title}</span>
                          <span className="action-subtitle">{action.subtitle}</span>
                        </div>
                        {action.badge && (
                          <span className="action-badge">{action.badge}</span>
                        )}
                      </button>
                    )) || (
                      // Fallback si no hay acciones rápidas configuradas
                      <>
                        <button className="action-button" onClick={() => navigate('/mi-tesis')}>
                          <span className="action-icon">📝</span>
                          <div className="action-content">
                            <span className="action-title">Mi Tesis</span>
                            <span className="action-subtitle">Ver y editar información</span>
                          </div>
                        </button>
                        <button className="action-button" onClick={() => navigate('/mis-documentos')}>
                          <span className="action-icon">📄</span>
                          <div className="action-content">
                            <span className="action-title">Documentos</span>
                            <span className="action-subtitle">Subir y gestionar</span>
                          </div>
                        </button>
                        <button className="action-button" onClick={() => navigate('/mi-asesor')}>
                          <span className="action-icon">👨‍🏫</span>
                          <div className="action-content">
                            <span className="action-title">Mi Asesor</span>
                            <span className="action-subtitle">Contactar y reuniones</span>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                  {dashboardData?.meetings && (
                    <div style={{marginTop:20, background:'#f1f5f9', padding:12, borderRadius:8, fontSize:13}}>
                      <strong style={{display:'block', marginBottom:6}}>Resumen de reuniones</strong>
                      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                        <span>🕒 Próximas: {dashboardData.meetings.upcomingCount}</span>
                        <span>📝 Pendientes: {dashboardData.meetings.pendingCount}</span>
                        {dashboardData.meetings.next && (
                          <span>➡️ Siguiente: {new Date(`${dashboardData.meetings.next.date}T${dashboardData.meetings.next.time}:00`).toLocaleDateString('es-ES',{day:'numeric',month:'short'})} {dashboardData.meetings.next.time}</span>
                        )}
                      </div>
                      <button style={{marginTop:8, background:'#3b82f6',color:'#fff',border:'none',padding:'6px 12px',borderRadius:6,cursor:'pointer',fontSize:12}} onClick={() => navigate('/mis-reuniones')}>
                        Ver mis reuniones →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mi Asesor removido por solicitud */}

              {/* Tareas pendientes eliminadas por solicitud */}
            </div>
          </div>
        </div>
      </div>

      <style>{dashboardStyles}</style>
    </div>
  );
};

export default Dashboard;