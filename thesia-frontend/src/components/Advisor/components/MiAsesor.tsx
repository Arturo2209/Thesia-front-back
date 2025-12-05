import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Layout/Sidebar';
import StudentHeader from '../../Shared/StudentHeader';
// Nuevo chat de ancho completo para probar distribución y estilos
import FullWidthChat from './FullWidthChat';
// import AdvisorSchedule from './AdvisorSchedule';
import type { TabType, Advisor } from '../types/advisor.types';
// import StudentMeetingsList from './StudentMeetingsList';
import { miAsesorStyles } from '../styles/MiAsesor.styles';
import advisorService from '../../../services/advisorService';
import authService from '../../../services/authService'; // ← AGREGAR ESTA LÍNEA

const MiAsesor: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("perfil");
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Cargar datos del asesor desde API
  useEffect(() => {
    const user = authService.getStoredUser();
    console.log('🔍 [MiAsesor] Usuario en localStorage:', user);
    if (user && user.role === 'asesor') {
      // Mostrar perfil propio del asesor
      setAdvisor({
        id: user.id,
        name: user.name,
        email: user.email,
        specialty: user.especialidad || 'Sin especialidad',
        telefono: user.telefono || null,
        avatar_url: user.picture || null,
        current_students: 0,
        max_capacity: 5,
        available_capacity: 5,
        disponible: true,
        rating: 4.8,
        experience_years: 10,
        completed_theses: 0,
        about: 'Docente y asesor de tesis en TECSUP.',
        specializations: [user.especialidad || 'Metodología de Investigación'],
        available: true
      });
      setLoading(false);
      setError(null);
    } else {
      loadMyAdvisor();
    }
  }, []);

  const loadMyAdvisor = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = authService.getStoredUser();
      console.log('🔍 [MiAsesor] Intentando cargar asesor para usuario:', user?.email, '-', user?.role);

      const response = await advisorService.getMyAdvisor();
      console.log('🔍 [MiAsesor] Respuesta de getMyAdvisor:', response);

      if (response.success && response.advisor) {
        console.log('✅ [MiAsesor] Asesor cargado exitosamente:', response.advisor.name);
        setAdvisor(response.advisor);
      } else {
        console.log('ℹ️ [MiAsesor] No hay asesor asignado:', response.message);
        setAdvisor(null);
        setError(response.message || 'No tienes un asesor asignado');
      }

    } catch (error) {
      console.error('❌ [MiAsesor] Error cargando asesor:', error);
      setError('Error cargando la información del asesor');
    } finally {
      setLoading(false);
    }
  };

  // Botón de agendar reunión eliminado según requerimiento; función ya no necesaria.

  // ✅ USAR LA MISMA FUNCIÓN DE LOGOUT QUE DOCUMENTS.TSX
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // 🎨 Obtener iniciales del nombre
  const getInitials = (name: string): string => {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Estado de disponibilidad: no se muestra en UI por requerimiento

  // LOADING STATE
  if (loading) {
    return (
      <div className="asesor-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <StudentHeader title="Sistema de Tesis y Pretesis" />
          <div className="asesor-section">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando información del asesor...</p>
            </div>
          </div>
        </div>
        
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="asesor-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <StudentHeader title="Sistema de Tesis y Pretesis" />
          <div className="asesor-section">
            <div className="error-container">
              <div className="error-icon">❌</div>
              <div className="error-message">{error}</div>
              <button className="retry-button" onClick={loadMyAdvisor}>
                🔄 Reintentar
              </button>
            </div>
          </div>
        </div>
        <style>{miAsesorStyles}</style>
      </div>
    );
  }

  // NO ADVISOR ASSIGNED
  if (!advisor) {
    return (
      <div className="asesor-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <StudentHeader title="Sistema de Tesis y Pretesis" />
          <div className="asesor-section">
            <div className="asesor-header">
              <h2>Mi Asesor</h2>
              <p>Información y comunicación con tu asesor de tesis</p>
            </div>
            <div className="error-container">
              <div className="error-icon">👤</div>
              <h3>No tienes un asesor asignado</h3>
              <p>Contacta con la coordinación para que te asignen un asesor de tesis.</p>
            </div>
          </div>
        </div>
        <style>{miAsesorStyles}</style>
      </div>
    );
  }

  return (
    <div className="asesor-container">
      {/* ✅ EXACTAMENTE IGUAL QUE DOCUMENTS.TSX */}
      <Sidebar onLogout={handleLogout} />
      
      <div className="main-content">
        {/* HEADER */}
        <StudentHeader title="Sistema de Tesis y Pretesis" />

        <div className={`asesor-section ${activeTab === 'comunicacion' ? 'wide' : ''}`}>
          {/* HEADER */}
          <div className="asesor-header">
            <h2>Mi Asesor</h2>
            <p>Información y comunicación con tu asesor de tesis</p>
          </div>

          {/* ADVISOR PROFILE CARD */}
          <div className="advisor-profile-card">
            <div className="advisor-main-info">
              <div className="advisor-avatar">
                {advisor.avatar_url ? (
                  <img src={advisor.avatar_url} alt={advisor.name} />
                ) : (
                  getInitials(advisor.name)
                )}
              </div>
              
              <div className="advisor-details">
                <div className="advisor-name-status">
                  <h3>{advisor.name}</h3>
                </div>
                <p className="advisor-title">{advisor.specialty}</p>
                <div className="advisor-stats">
                  <span className="rating">⭐ 4.8/5.0</span>
                  <span className="experience">15 años de experiencia</span>
                  <span className="completed">45 tesis completadas</span>
                </div>
              </div>

            </div>
          </div>

          {/* TABS */}
          <div className="tabs-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'perfil' ? 'active' : ''}`}
                onClick={() => setActiveTab('perfil')}
              >
                👤 Perfil
              </button>
              <button 
                className={`tab ${activeTab === 'comunicacion' ? 'active' : ''}`}
                onClick={() => setActiveTab('comunicacion')}
              >
                💬 Comunicación
              </button>
              {/* Tabs de horarios y reuniones fueron movidos a /mis-reuniones */}
            </div>

            {/* TAB CONTENT */}
            <div className="tab-content">
              {activeTab === 'perfil' && (
                <div className="profile-content">
                  <div className="content-grid">
                    <div className="about-section">
                      <h4>Sobre el Asesor</h4>
                      <p>
                        Docente con amplia experiencia en investigación académica y dirección de tesis. 
                        Especializado en metodología de investigación, análisis estadístico y redacción científica. 
                        Comprometido con la excelencia académica y el desarrollo profesional de los estudiantes.
                      </p>
                    </div>
                    
                    <div className="contact-section">
                      <h4>Información de Contacto</h4>
                      <div className="contact-info">
                        <div className="contact-item">
                          <span className="contact-icon">📧</span>
                          <span>{advisor.email}</span>
                        </div>
                        {advisor.telefono && (
                          <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <span>{advisor.telefono}</span>
                          </div>
                        )}
                        <div className="contact-item">
                          <span className="contact-icon">🏢</span>
                          <span>Oficina 201 - Pabellón A</span>
                        </div>
                        <div className="contact-item">
                          <span className="contact-icon">🕐</span>
                          <span>Lun-Vie: 9:00 AM - 5:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="specializations-section">
                    <h4>Áreas de Especialización</h4>
                    <div className="specialization-tags">
                      <span className="tag">Metodología de Investigación</span>
                      <span className="tag">Análisis Estadístico</span>
                      <span className="tag">Redacción Científica</span>
                      <span className="tag">Gestión de Proyectos</span>
                      <span className="tag">Evaluación de Impacto</span>
                    </div>
                  </div>

                  <div className="stats-section">
                    <div className="stat-item">
                      <span className="stat-label">Estudiantes actuales:</span>
                      <span className="stat-value">{advisor.current_students}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tesis completadas:</span>
                      <span className="stat-value">45</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Experiencia:</span>
                      <span className="stat-value">15 años</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Disponibilidad:</span>
                      <span className="stat-value">
                        {advisor.available_capacity}/{advisor.max_capacity} cupos
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comunicacion' && (
                <div className="communication-content">
                  <FullWidthChat advisor={advisor} />
                </div>
              )}

              {/* Contenidos de horarios y reuniones removidos */}
            </div>
          </div>
        </div>
      </div>

      <style>{miAsesorStyles}</style>
    </div>
  );
};

export default MiAsesor;