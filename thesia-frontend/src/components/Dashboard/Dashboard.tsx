import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import authService from '../../services/authService';
import { useDashboardData } from './hooks/useDashboardData';  // ✅ IMPORTAR EL HOOK
import { dashboardStyles } from './Dashboard.styles';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // ✅ USAR EL HOOK EN LUGAR DE useState MANUAL
  const { 
    loading, 
    error, 
    data: dashboardData, 
    connectionStatus,
    refresh,
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
    console.log('📝 Navegando a registro de tesis...');
    navigate('/mi-tesis');
  };

  // 🔄 LOADING STATE
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

  // ❌ ERROR STATE
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
        {/* HEADER */}
        <header className="main-header">
          <h1>¡Bienvenid@ {dashboardData?.user?.name || 'Usuario'}! 👋</h1>
          <div className="notification-icon">🔔</div>
        </header>
        
        <div className="content-section">
          {/* CONNECTION STATUS */}
          <div className={`connection-status ${connectionStatus}`}>
            <span className="connection-icon">🔗</span>
            <span className="connection-text">
              {connectionStatus === 'connected' && '✅ Backend conectado'}
              {connectionStatus === 'checking' && '🔄 Verificando conexión...'}
              {connectionStatus === 'error' && '❌ Error de conexión'}
            </span>
          </div>

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

          {/* USER INFO SECTION */}
          <div className="user-info-section">
            <h4>{dashboardData?.user?.roleDisplay || 'Estudiante'}</h4>
            <p>
              {dashboardData?.user?.carrera && `${dashboardData.user.carrera} - `}
              Aquí tienes un resumen de tu progreso y próximas tareas.
            </p>
          </div>

          {/* DASHBOARD GRID */}
          <div className="dashboard-grid">
            
            {/* LEFT COLUMN */}
            <div className="left-column">
              
              {/* PROGRESS CARD */}
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
                        />
                      </div>
                      <p className="progress-text">{dashboardData.thesis.overallProgress || 0}%</p>
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

              {/* STATS GRID */}
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

              {/* ACTIVITIES CARD */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Actividad Reciente</h3>
                  <span className="card-icon">🕒</span>
                </div>
                <div className="card-content">
                  {dashboardData?.activities && dashboardData.activities.length > 0 ? (
                    <div className="activities-list">
                      {dashboardData.activities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-description">
                            {activity.description}
                          </div>
                          <div className="activity-date">
                            {new Date(activity.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-activities">
                      <div className="no-activities-icon">📋</div>
                      <p>Aún no cuentas con actividades</p>
                    </div>
                  )}
                  <button className="view-all-button">
                    Ver toda la actividad →
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="right-column">
              
              {/* QUICK ACTIONS */}
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
                      // Fallback si no hay quick actions
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
                </div>
              </div>

              {/* ADVISOR CARD - ✅ MEJORADO CON DATOS DEL HOOK */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Mi Asesor</h3>
                  <span className="card-icon">👨‍🏫</span>
                </div>
                <div className="card-content">
                  {dashboardData?.advisor?.hasAdvisor ? (
                    <div className="advisor-info">
                      <div className="advisor-avatar">
                        {dashboardData.advisor.name?.charAt(0)}
                      </div>
                      <div className="advisor-details">
                        <h4>{dashboardData.advisor.name}</h4>
                        <p className="advisor-specialty">{dashboardData.advisor.especialidad}</p>
                        <p className="advisor-email">{dashboardData.advisor.email}</p>
                        <div className="advisor-stats">
                          <span>👥 {dashboardData.advisor.totalStudents} estudiantes</span>
                          <span className={`advisor-status ${dashboardData.advisor.isOnline ? 'online' : 'offline'}`}>
                            {dashboardData.advisor.isOnline ? '🟢 En línea' : '🔴 Desconectado'}
                          </span>
                        </div>
                        <button 
                          className="contact-button"
                          onClick={() => navigate('/mi-asesor')}
                        >
                          💬 Contactar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-advisor">
                      <div className="no-advisor-icon">👨‍🏫</div>
                      <h4>Sin asesor asignado</h4>
                      <p>Registra tu tesis para obtener un asesor</p>
                    </div>
                  )}
                </div>
              </div>

              {/* PENDING TASKS - ✅ NUEVO CON DATOS DEL HOOK */}
              {dashboardData?.pendingTasks && dashboardData.pendingTasks.length > 0 && (
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Tareas Pendientes</h3>
                    <span className="card-icon">✅</span>
                  </div>
                  <div className="card-content">
                    <div className="pending-tasks">
                      {dashboardData.pendingTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className={`task-item priority-${task.priority}`}>
                          <div className="task-info">
                            <h5>{task.title}</h5>
                            <p>{task.description}</p>
                            <span className="task-time">{task.estimatedTime}</span>
                          </div>
                          <button 
                            className="task-action"
                            onClick={() => navigate(task.actionUrl)}
                          >
                            ▶️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{dashboardStyles}</style>
    </div>
  );
};

export default Dashboard;