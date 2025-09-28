import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import apiService from '../../services/api';
import authService from '../../services/authService';
import dashboardService from '../../services/dashboardService'; // 👈 NUEVO

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // 🔄 ESTADOS PARA DATOS REALES
  const [backendStatus, setBackendStatus] = useState('Probando...');
  const [isConnected, setIsConnected] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 CARGAR DATOS REALES
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Test de conexión
        const connectionTest = await apiService.testConnection();
        setBackendStatus('✅ Backend conectado');
        setIsConnected(true);
        
        // Cargar datos del dashboard
        const data = await dashboardService.getDashboardData();
        setDashboardData(data.data);
        
        console.log('📊 Datos del dashboard cargados:', data.data);
        
      } catch (error) {
        console.error('❌ Error cargando dashboard:', error);
        setBackendStatus('❌ Error de conexión');
        setIsConnected(false);
        setError('Error cargando datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      await authService.logout();
      console.log('✅ Logout exitoso, redirigiendo...');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Error en logout:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    }
  };

  const handleRegisterThesis = () => {
    console.log('🎯 Botón "Registrar ahora" presionado');
    navigate('/mi-tesis');
  };

  const handleUploadDocument = () => {
    console.log('Navegando a Mis Documentos...');
    navigate('/mis-documentos');
  };

  const handleContactAdvisor = () => {
    console.log('Navegando a Mi Asesor...');
    navigate('/mi-asesor');
  };

  const handleViewCalendar = () => {
    console.log('Navegando a Mi Calendario...');
    navigate('/mi-calendario');
  };

  // 🔄 MOSTRAR LOADING O ERROR
  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '18px',
            gap: '12px'
          }}>
            <div>🔄</div>
            <div>Cargando datos del dashboard...</div>
          </div>
        </div>

        <style>{`
          .dashboard-container {
            display: flex;
            min-height: 100vh;
            width: 100vw;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .main-content {
            flex: 1;
            margin-left: 280px;
            background: #f5f5f5;
            min-height: 100vh;
            width: calc(100vw - 280px);
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            gap: '16px'
          }}>
            <div style={{ fontSize: '48px' }}>❌</div>
            <div style={{ fontSize: '18px', color: '#dc2626' }}>{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '12px 24px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔄 Reintentar
            </button>
          </div>
        </div>

        <style>{`
          .dashboard-container {
            display: flex;
            min-height: 100vh;
            width: 100vw;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .main-content {
            flex: 1;
            margin-left: 280px;
            background: #f5f5f5;
            min-height: 100vh;
            width: calc(100vw - 280px);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="dashboard-section">
          {/* 🔄 WELCOME HEADER CON DATOS REALES */}
          <div className="welcome-header">
            <h2>¡Bienvenid@ {dashboardData?.user.name || 'Usuario'}! 👋</h2>
            <p>
              {dashboardData?.user.roleDisplay || 'Estudiante'} 
              {dashboardData?.user.carrera && ` - ${dashboardData.user.carrera}`}
            </p>
            <p>Aquí tienes un resumen de tu progreso y próximas tareas.</p>
          </div>

          {/* Backend Status */}
          <div style={{
            background: isConnected ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${isConnected ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            <strong>🔗 Backend Status:</strong> 
            <span style={{color: isConnected ? '#059669' : '#dc2626'}}>{backendStatus}</span>
          </div>

          {/* 🔄 ALERT BANNER DINÁMICO */}
          {!dashboardData?.thesis.hasThesis && (
            <div className="alert-banner">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <strong>Información de Tesis Pendiente</strong>
                <p>Debes registrar la información de tu tesis o pretesis para acceder a todas las funcionalidades.</p>
                <button onClick={handleRegisterThesis} className="register-btn">
                  Registrar ahora →
                </button>
              </div>
            </div>
          )}

          <div className="dashboard-grid">
            <div className="left-column">
              {/* 🔄 PROGRESS CON DATOS REALES */}
              <div className="card">
                <h3>Progreso de Tesis</h3>
                <div className="progress-info">
                  <span>Fase {dashboardData?.thesis.phase || 0} de 5</span>
                  <span>{dashboardData?.thesis.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${dashboardData?.thesis.progress || 0}%`}}
                  ></div>
                </div>
              </div>

              {/* 🔄 ACTIVIDADES REALES */}
              <div className="card">
                <h3>Actividad Reciente</h3>
                {dashboardData?.activities && dashboardData.activities.length > 0 ? (
                  <div>
                    {dashboardData.activities.slice(0, 3).map((activity: any) => (
                      <div key={activity.id} style={{ 
                        padding: '12px 0', 
                        borderBottom: '1px solid #eee',
                        fontSize: '14px'
                      }}>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                          {activity.description}
                        </div>
                        <div style={{ color: '#666', fontSize: '12px' }}>
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
                  <p className="no-activity">Aún no cuentas con actividades</p>
                )}
                <a href="#" className="view-all-link">Ver toda la actividad</a>
              </div>

              {/* 🔄 STATS CON DATOS REALES */}
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-number">{dashboardData?.thesis.progress || 0}%</div>
                  <div className="stat-label">Progreso Total</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-number">{dashboardData?.documents.approved || 0}</div>
                  <div className="stat-label">Docs Aprobados</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-number">{dashboardData?.documents.pending || 0}</div>
                  <div className="stat-label">Pendientes</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-number">{dashboardData?.thesis.daysRemaining || 105}</div>
                  <div className="stat-label">Días Restantes</div>
                </div>
              </div>
            </div>

            <div className="right-column">
              {/* Quick Actions */}
              <div className="card">
                <h3>Acciones Rápidas</h3>
                <div className="quick-actions">
                  <button onClick={handleUploadDocument} className="action-btn">
                    <span>📤</span> Subir Documento
                  </button>
                  <button onClick={handleContactAdvisor} className="action-btn">
                    <span>👨‍🏫</span> Contactar Asesor
                  </button>
                  <button onClick={handleViewCalendar} className="action-btn">
                    <span>📅</span> Ver Calendario
                  </button>
                </div>
              </div>

              {/* 🔄 ASESOR CON DATOS REALES */}
              <div className="card">
                <h3>Mi Asesor</h3>
                <div className="advisor-info">
                  <span>👨‍🏫</span>
                  <div>
                    {dashboardData?.advisor.hasAdvisor ? (
                      <>
                        <p style={{ fontWeight: '500', marginBottom: '4px' }}>
                          {dashboardData.advisor.name}
                        </p>
                        <p style={{ fontSize: '14px', color: '#666' }}>
                          {dashboardData.advisor.email}
                        </p>
                      </>
                    ) : (
                      <p>Aún no disponible, registrar información de tu tesis</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          background: #f5f5f5;
          min-height: 100vh;
          width: calc(100vw - 280px);
        }

        .main-header {
          background: white;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .main-header h1 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .notification-icon {
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .notification-icon:hover {
          background: #f0f0f0;
        }

        .dashboard-section {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-header {
          margin-bottom: 24px;
        }

        .welcome-header h2 {
          color: #333;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .welcome-header p {
          color: #666;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .alert-banner {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 32px;
          display: flex;
          gap: 12px;
        }

        .alert-icon {
          font-size: 20px;
          color: #856404;
        }

        .alert-content strong {
          color: #856404;
          display: block;
          margin-bottom: 4px;
        }

        .alert-content p {
          color: #664d03;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .register-btn {
          background: #fd7e14;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .register-btn:hover {
          background: #e85d04;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .card h3 {
          color: #333;
          margin-bottom: 16px;
          font-size: 18px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          color: #666;
          font-weight: 500;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #1976d2, #42a5f5);
          transition: width 0.5s ease;
        }

        .no-activity {
          color: #666;
          font-style: italic;
          margin-bottom: 16px;
        }

        .view-all-link {
          color: #1976d2;
          text-decoration: none;
          font-size: 14px;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-card.blue {
          border-left: 4px solid #1976d2;
        }

        .stat-card.green {
          border-left: 4px solid #28a745;
        }

        .stat-card.orange {
          border-left: 4px solid #fd7e14;
        }

        .stat-card.purple {
          border-left: 4px solid #6f42c1;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-card.blue .stat-number {
          color: #1976d2;
        }

        .stat-card.green .stat-number {
          color: #28a745;
        }

        .stat-card.orange .stat-number {
          color: #fd7e14;
        }

        .stat-card.purple .stat-number {
          color: #6f42c1;
        }

        .stat-label {
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
          font-size: 14px;
        }

        .action-btn:hover {
          background: #e9ecef;
          border-color: #1976d2;
          transform: translateY(-1px);
        }

        .action-btn span {
          font-size: 16px;
        }

        .advisor-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #666;
        }

        .advisor-info p {
          margin: 0;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 260px;
            width: calc(100vw - 260px);
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            width: 100vw;
          }
          
          .dashboard-section {
            padding: 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .welcome-header h2 {
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;