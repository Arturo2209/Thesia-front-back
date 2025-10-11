import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import authService from '../../services/authService';
import dashboardService from '../../services/dashboardService';
import thesisService from '../../services/thesisService';
import apiService from '../../services/api';
import { dashboardStyles } from './Dashboard.styles';

// Tipos para el dashboard
interface DashboardData {
  user: {
    name: string;
    role: string;
    roleDisplay: string;
    carrera: string;
    profileCompleted: boolean;
    email: string;
  };
  thesis: {
    hasThesis: boolean;
    title?: string;
    phase: number;
    progress: number;
    daysRemaining: number;
  };
  documents: {
    totalUploaded: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  advisor: {
    hasAdvisor: boolean;
    name?: string;
    email?: string;
  };
  activities: Array<{
    id: number;
    description: string;
    date: string;
    type: 'document' | 'meeting' | 'comment' | 'profile' | 'login';
  }>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔗 1. TEST DE CONEXIÓN
      console.log('🔗 === PROBANDO CONEXIÓN AL BACKEND ===');
      await apiService.testConnection();
      setConnectionStatus('connected');
      
      // 👤 2. VERIFICAR USUARIO
      const storedUser = authService.getStoredUser();
      if (!storedUser) {
        console.log('❌ No hay usuario autenticado');
        navigate('/');
        return;
      }
      
      // 📚 3. VERIFICAR TESIS CON thesisService (MÁS CONFIABLE)
      console.log('📚 === VERIFICANDO TESIS EXISTENTE ===');
      let hasThesis = false;
      let thesisTitle = '';
      
      try {
        const thesisResponse = await thesisService.getMyThesis();
        console.log('📖 Respuesta de tesis:', {
          success: thesisResponse.success,
          hasThesis: thesisResponse.hasThesis,
          title: thesisResponse.thesis?.titulo
        });
        
        if (thesisResponse.success && thesisResponse.hasThesis && thesisResponse.thesis) {
          hasThesis = true;
          thesisTitle = thesisResponse.thesis.titulo;
          console.log('✅ Usuario TIENE tesis registrada:', thesisTitle);
        } else {
          console.log('ℹ️ Usuario NO tiene tesis registrada');
        }
      } catch (thesisError) {
        console.log('⚠️ Error verificando tesis (usando fallback):', thesisError);
      }
      
      // 📊 4. OBTENER DATOS DEL DASHBOARD
      let dashboardInfo;
      try {
        const dashboardResponse = await dashboardService.getDashboardData();
        
        // 🔧 FIX: La respuesta puede estar en .data O directamente en la respuesta
        dashboardInfo = dashboardResponse?.data || dashboardResponse;
        
        console.log('📊 Datos del dashboard cargados:', dashboardInfo);
        console.log('📊 Estructura completa dashboardResponse:', dashboardResponse);
        
        // 🔧 Si dashboardInfo sigue siendo undefined, crear estructura por defecto
        if (!dashboardInfo || typeof dashboardInfo !== 'object') {
          console.log('⚠️ Dashboard info es undefined o inválido, creando estructura por defecto');
          dashboardInfo = createDefaultDashboardData(storedUser);
        }
        
      } catch (dashboardError) {
        console.log('⚠️ Error obteniendo dashboard, usando datos por defecto:', dashboardError);
        dashboardInfo = createDefaultDashboardData(storedUser);
      }
      
      // 🔄 5. ASEGURAR QUE dashboardInfo TENGA LA ESTRUCTURA CORRECTA
      if (!dashboardInfo.user) {
        dashboardInfo.user = {
          name: storedUser.name || 'Usuario',
          role: storedUser.role || 'student',
          roleDisplay: 'Estudiante',
          carrera: storedUser.carrera || 'Sin carrera',
          profileCompleted: true,
          email: storedUser.email || ''
        };
      }
      
      if (!dashboardInfo.thesis) {
        dashboardInfo.thesis = {
          hasThesis: false,
          title: '',
          phase: 0,
          progress: 0,
          daysRemaining: 0
        };
      }
      
      if (!dashboardInfo.documents) {
        dashboardInfo.documents = {
          totalUploaded: 0,
          approved: 0,
          pending: 0,
          rejected: 0
        };
      }
      
      if (!dashboardInfo.advisor) {
        dashboardInfo.advisor = {
          hasAdvisor: false
        };
      }
      
      if (!dashboardInfo.activities) {
        dashboardInfo.activities = [];
      }
      
      // 🔄 6. COMBINAR DATOS CON LA VERIFICACIÓN REAL DE TESIS
      const finalDashboardData: DashboardData = {
        ...dashboardInfo,
        thesis: {
          ...dashboardInfo.thesis,
          hasThesis: hasThesis,           // ✅ VALOR REAL DE thesisService
          title: thesisTitle || dashboardInfo.thesis.title
        }
      };
      
      console.log('📋 === ESTADO FINAL DEL DASHBOARD ===');
      console.log('Usuario:', finalDashboardData.user.name);
      console.log('Tiene Tesis:', finalDashboardData.thesis.hasThesis);
      console.log('Título Tesis:', finalDashboardData.thesis.title || 'N/A');
      console.log('Estructura completa:', finalDashboardData);
      console.log('========================================');
      
      setDashboardData(finalDashboardData);
      
    } catch (error) {
      console.error('❌ Error general cargando dashboard:', error);
      setConnectionStatus('error');
      setError('Error cargando datos del dashboard. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultDashboardData = (user: any): DashboardData => ({
    user: {
      name: user.name || 'Usuario',
      role: user.role || 'student',
      roleDisplay: 'Estudiante',
      carrera: user.carrera || 'Sin carrera',
      profileCompleted: true,
      email: user.email || ''
    },
    thesis: {
      hasThesis: false,
      title: '',
      phase: 0,
      progress: 0,
      daysRemaining: 0
    },
    documents: {
      totalUploaded: 0,
      approved: 0,
      pending: 0,
      rejected: 0
    },
    advisor: {
      hasAdvisor: false
    },
    activities: []
  });

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
            <div className="error-message">{error}</div>
            <button className="retry-button" onClick={loadDashboardData}>
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
                        <p>Fase {dashboardData.thesis.phase || 1} de 5</p>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${dashboardData.thesis.progress || 25}%` }}
                        />
                      </div>
                      <p className="progress-text">{dashboardData.thesis.progress || 25}%</p>
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
                  <div className="stat-number">{dashboardData?.thesis.progress || 25}%</div>
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
                  <div className="stat-number">{dashboardData?.thesis.daysRemaining || 105}</div>
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
                    <button 
                      className="action-button"
                      onClick={() => navigate('/mi-tesis')}
                    >
                      <span className="action-icon">📝</span>
                      <div className="action-content">
                        <span className="action-title">Mi Tesis</span>
                        <span className="action-subtitle">Ver y editar información</span>
                      </div>
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => navigate('/mis-documentos')}
                    >
                      <span className="action-icon">📄</span>
                      <div className="action-content">
                        <span className="action-title">Documentos</span>
                        <span className="action-subtitle">Subir y gestionar</span>
                      </div>
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => navigate('/mi-asesor')}
                    >
                      <span className="action-icon">👨‍🏫</span>
                      <div className="action-content">
                        <span className="action-title">Mi Asesor</span>
                        <span className="action-subtitle">Contactar y reuniones</span>
                      </div>
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => navigate('/progreso')}
                    >
                      <span className="action-icon">📊</span>
                      <div className="action-content">
                        <span className="action-title">Progreso</span>
                        <span className="action-subtitle">Ver avance detallado</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* ADVISOR CARD */}
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
                        <p>{dashboardData.advisor.email}</p>
                        <button className="contact-button">
                          📧 Enviar mensaje
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
            </div>
          </div>
        </div>
      </div>

      <style>{dashboardStyles}</style>
    </div>
  );
};

export default Dashboard;