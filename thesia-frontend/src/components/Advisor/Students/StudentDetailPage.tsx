import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Usar el Sidebar propio del rol asesor (no el del estudiante)
import Sidebar from '../Layout/Sidebar';
import { miAsesorStyles } from '../styles/MiAsesor.styles';
import Chat from '../components/Chat';
import advisorService from '../../../services/advisorService';
import type { AdvisorStudent } from './types/student.types';
import authService from '../../../services/authService';

type TabKey = 'perfil' | 'comunicacion';

const StudentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>('perfil');
  const [student, setStudent] = useState<AdvisorStudent | null>(() => {
    const fromState = (location.state as any)?.student as AdvisorStudent | undefined;
    return fromState || null;
  });
  const [loading, setLoading] = useState<boolean>(!student);
  const [error, setError] = useState<string | null>(null);

  // Back button handler aligned with other advisor pages
  const handleBack = () => {
    navigate('/advisor/students');
  };

  // Load student if not passed via navigation state
  useEffect(() => {
    const load = async () => {
      if (student) return; // already available via state
      if (!id) {
        setError('ID de estudiante inválido');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fallback: reuse assigned students list and find by id
        const list = await advisorService.getAssignedStudents();
        const found = list.find(s => String(s.id) === String(id));
        if (found) {
          setStudent(found);
          setError(null);
        } else {
          setError('No se encontró el estudiante');
        }
      } catch (e) {
        setError('Error cargando estudiante');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Logout handler (same pattern as other pages)
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/', { replace: true });
    } catch (e) {
      console.error('Error en logout:', e);
    }
  };

  // Adapter to reuse Chat component which expects an Advisor-like shape
  const chatPeer = useMemo(() => {
    if (!student) return null;
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      telefono: null as string | null,
      specialty: student.specialty || 'Estudiante',
      avatar_url: null as string | null,
      available: true,
      rating: 0,
      experience_years: 0,
      completed_theses: 0,
      current_students: 0,
      max_capacity: 0,
      available_capacity: 0,
      disponible: true,
      about: undefined,
      specializations: [] as string[]
    };
  }, [student]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(w => w.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="asesor-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <header className="main-header">
            <h1>Sistema de Tesis y Pretesis</h1>
            <div className="notification-icon">🔔</div>
          </header>
          <div className="asesor-section">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando información del estudiante...</p>
            </div>
          </div>
        </div>
        <style>{miAsesorStyles}</style>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="asesor-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <header className="main-header">
            <h1>Sistema de Tesis y Pretesis</h1>
            <div className="notification-icon">🔔</div>
          </header>
          <div className="asesor-section">
            <div className="error-container">
              <div className="error-icon">❌</div>
              <div className="error-message">{error || 'No se pudo cargar el estudiante'}</div>
              <button className="retry-button" onClick={handleBack}>Volver</button>
            </div>
          </div>
        </div>
        <style>{miAsesorStyles}</style>
      </div>
    );
  }

  return (
    <div className="asesor-container">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="asesor-section">
          {/* Header with title */}
          <div className="asesor-header">
            <h2>Estudiante</h2>
            <p>Perfil y comunicación con el estudiante asignado</p>
          </div>

          {/* Profile summary card */}
          <div className="advisor-profile-card">
            <div className="advisor-main-info">
              <div className="advisor-avatar">
                {getInitials(student.name)}
              </div>
              <div className="advisor-details">
                <div className="advisor-name-status">
                  <h3>{student.name}</h3>
                  <span className={`status-badge available`}>● Activo</span>
                </div>
                <p className="advisor-title">{student.specialty || 'Estudiante'}</p>
                <div className="advisor-stats">
                  <span className="rating">🎓 {student.thesisTitle || 'Tesis sin título'}</span>
                  <span className="experience">Fase: {student.phase || 'N/D'}</span>
                  <span className="completed">Asignado: {student.assignedDate || 'N/D'}</span>
                </div>
              </div>

              <button onClick={handleBack} className="schedule-btn" style={{minWidth: 120}}>
                ← Volver
              </button>
            </div>
          </div>

          {/* Tabs: Perfil / Comunicación (no horarios) */}
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
            </div>

            <div className="tab-content">
              {activeTab === 'perfil' && (
                <div className="profile-content">
                  <div className="content-grid">
                    <div className="about-section">
                      <h4>Sobre el Estudiante</h4>
                      <p>
                        Estudiante asignado para trabajo de tesis. Mantén la comunicación y realiza el seguimiento del progreso.
                      </p>
                    </div>

                    <div className="contact-section">
                      <h4>Información de Contacto</h4>
                      <div className="contact-info">
                        <div className="contact-item">
                          <span className="contact-icon">📧</span>
                          <span>{student.email}</span>
                        </div>
                        <div className="contact-item">
                          <span className="contact-icon">📚</span>
                          <span>{student.thesisTitle || 'Tesis sin título'}</span>
                        </div>
                        <div className="contact-item">
                          <span className="contact-icon">📄</span>
                          <span>Fase actual: {student.phase || 'No definida'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comunicacion' && chatPeer && (
                <div className="communication-content">
                  <Chat advisor={chatPeer} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{miAsesorStyles}</style>
    </div>
  );
};

export default StudentDetailPage;
