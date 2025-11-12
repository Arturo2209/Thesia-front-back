import React from 'react';
import Sidebar from '../Layout/Sidebar';
import StudentMeetingsList from '../Advisor/components/StudentMeetingsList';
import AdvisorSchedule from '../Advisor/components/AdvisorSchedule';
import { io, Socket } from 'socket.io-client';
import authService from '../../services/authService';
import { miAsesorStyles } from '../Advisor/styles/MiAsesor.styles';
import advisorService from '../../services/advisorService';

// Página de reuniones del estudiante con dos pestañas: Horarios del asesor y Mis reuniones
const StudentMeetingsPage: React.FC = () => {
  const user = authService.getStoredUser();
  const [advisorId, setAdvisorId] = React.useState<number | null>(null);
  const socketRef = React.useRef<Socket | null>(null);
  const [refreshFlag, setRefreshFlag] = React.useState(0); // fuerza recarga lista reuniones
  const [activeTab, setActiveTab] = React.useState<'horarios' | 'reuniones'>('horarios');

  // Cargar ID del asesor asignado al estudiante usando el servicio existente
  React.useEffect(() => {
    const loadAdvisor = async () => {
      if (advisorId) return;
      try {
        const res = await advisorService.getMyAdvisor();
        if (res.success && res.advisor?.id) {
          setAdvisorId(res.advisor.id);
        }
      } catch (e) {
        console.warn('⚠️ No se pudo obtener asesor asignado:', e);
      }
    };
    if (user?.role === 'estudiante' && !advisorId) loadAdvisor();
  }, [advisorId, user]);

  // Inicializar socket para eventos de reuniones
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (socketRef.current) return; // evitar reconexión
    socketRef.current = io('http://localhost:3001', { auth: { token } });

    socketRef.current.on('connect', () => {
      console.log('🔌 [Meetings] Socket conectado meetings view');
    });

    socketRef.current.on('meeting:created', (payload: any) => {
      console.log('📥 [Meetings] Evento meeting:created', payload);
      // Si el estudiante crea o su asesor crea, refrescar listado
      setRefreshFlag(f => f + 1);
    });

    socketRef.current.on('meeting:updated', (payload: any) => {
      console.log('🔄 [Meetings] Evento meeting:updated', payload);
      setRefreshFlag(f => f + 1);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 [Meetings] Socket desconectado');
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <div className="asesor-container">
      <Sidebar />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>
        <div className="asesor-section">
          <div className="asesor-header">
            <h2>Reuniones</h2>
            <p>Gestiona tus solicitudes y revisa el estado de tus reuniones.</p>
          </div>

          {/* Tabs estilo MiAsesor */}
            <div className="tabs-container meetings-tabs-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'horarios' ? 'active' : ''}`}
                onClick={() => setActiveTab('horarios')}
              >
                📅 Horarios del asesor
              </button>
              <button 
                className={`tab ${activeTab === 'reuniones' ? 'active' : ''}`}
                onClick={() => setActiveTab('reuniones')}
              >
                📋 Mis reuniones
              </button>
            </div>

            <div className="tab-content meetings-tab-content">
              {activeTab === 'horarios' && (
                <div className="meetings-panel">
                  {(advisorId) ? (
                    <AdvisorSchedule advisor={{
                      id: advisorId,
                      name: 'Mi Asesor',
                      email: '',
                      telefono: null,
                      specialty: user?.especialidad || 'Especialidad',
                      avatar_url: null,
                      available: true,
                      rating: 0,
                      experience_years: 0,
                      completed_theses: 0,
                      current_students: 0,
                      max_capacity: 0,
                      available_capacity: 0,
                      disponible: true,
                      specializations: []
                    }} />
                  ) : (
                    <div className="no-advisor">
                      <p>No tienes un asesor asignado todavía.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reuniones' && (
                <div className="meetings-panel">
                  {/* Pasamos refreshFlag como key para forzar remount y nueva carga cuando hay eventos */}
                  <StudentMeetingsList key={refreshFlag} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{miAsesorStyles + pageStyles}</style>
    </div>
  );
};

const pageStyles = `
/* Wider layout similar to documents page */
.asesor-section { max-width: none; width: 100%; }
.meetings-tabs-container { box-shadow: 0 4px 14px rgba(0,0,0,0.07); border-radius:18px; }
.meetings-tab-content { min-height: 880px; padding:40px; }
.meetings-panel { 
  background:#fff; 
  border:1px solid #e2e8f0; 
  border-radius:24px; 
  padding:40px 44px; 
  box-shadow:0 6px 22px -4px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04); 
  min-height:820px; 
  width:100%; 
  box-sizing:border-box;
}
.meetings-tabs-container, 
.meetings-tabs-container .tab-content, 
.meetings-tabs-container .meetings-panel { width: 100% !important; max-width: none !important; }
.meetings-panel h3 { font-size:30px; }
.meetings-panel h4 { font-size:22px; }
.meetings-panel h5 { font-size:18px; }
.meetings-panel .schedule-container { max-width:100%; padding:0; }
.meetings-panel .schedule-header { text-align:left; margin-bottom:28px; border-bottom:1px solid #e2e8f0; }
.meetings-panel .schedule-header h3 { font-size:30px; }
.meetings-panel .general-schedule h4 { font-size:22px; }
.meetings-panel .date-selector h4 { font-size:22px; }
.no-advisor { padding: 56px; color: #64748b; text-align:center; font-size:18px; }

/* Student meetings list panel adjustments */
.meetings-panel .student-meetings-list, 
.meetings-panel .student-meetings-wrapper { width:100%; }

@media (max-width: 1400px) { .asesor-section { max-width: 100%; } }
@media (max-width: 1200px) {
  .meetings-tab-content { padding:32px; }
  .meetings-panel { padding:32px; min-height:720px; }
}
@media (max-width: 900px) {
  .meetings-tab-content { padding:28px; }
  .meetings-panel { padding:28px; }
}
@media (max-width: 768px) {
  .meetings-tab-content { min-height: 0; padding:20px; }
  .meetings-panel { min-height:auto; padding:22px 22px; border-radius:18px; }
}
`;

export default StudentMeetingsPage;
