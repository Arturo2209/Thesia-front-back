import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../Layout/Sidebar';
import meetingService from '../../../services/meetingService';
import advisorService from '../../../services/advisorService';
import authService from '../../../services/authService';
import { mapMeetingStatus } from '../../../types/meeting.types';
import type { PendingAdvisorMeeting, AdvisorHistoryMeeting } from '../../../types/meeting.types';
import type { AdvisorStudent } from '../../Advisor/Students/types/student.types';
import { io, Socket } from 'socket.io-client';
import { miAsesorStyles } from '../styles/MiAsesor.styles';

// Estilos modernizados y con mayor aprovechamiento de pantalla para el rol asesor
const pageStyles = `
/* Expandir ancho y jerarquía visual */
.asesor-section { max-width:none; width:100%; }
.meetings-wrapper { width:100%; display:flex; flex-direction:column; gap:32px; }
.meetings-section { padding: 12px 4px 64px; width:100%; }
.meetings-header { margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; }
.meetings-header h3 { font-size:28px; font-weight:600; letter-spacing:.5px; display:flex; align-items:center; gap:8px; }
.pending-count { display:inline-flex; align-items:center; justify-content:center; min-width:34px; height:26px; padding:0 10px; border-radius:9999px; background:#2563eb; color:#fff; font-size:13px; font-weight:700; }
.meetings-panel { 
  background:#fff; border:1px solid #e2e8f0; border-radius:28px; padding:38px 44px; 
  box-shadow:0 8px 28px -6px rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.08); 
  width:100%; box-sizing:border-box; min-height:760px; 
}
.pending-list { display:flex; flex-direction:column; gap:20px; }
.pending-card { 
  background:#fff; border:1px solid #e5e7eb; border-radius:18px; padding:20px 22px; 
  box-shadow:0 2px 8px rgba(0,0,0,0.06); display:grid; grid-template-columns: 1fr auto; gap:18px; 
  transition:box-shadow .25s, transform .25s; position:relative; overflow:hidden;
}
.pending-card:hover { transform:translateY(-2px); }
.pending-info { display:flex; flex-direction:column; gap:6px; }
.pending-info strong { font-size:17px; }
.pending-actions { display:flex; flex-direction:column; gap:10px; min-width:140px; }
button.action-btn { cursor:pointer; border:none; border-radius:10px; padding:12px 16px; font-weight:600; font-size:14px; letter-spacing:.3px; display:flex; align-items:center; gap:6px; }
button.approve { background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff; }
button.reject { background:linear-gradient(135deg,#dc2626,#ef4444); color:#fff; }
button.refresh { background:#2563eb; color:#fff; }
.meta { font-size:13px; color:#475569; line-height:1.3; }
.status-chip { display:inline-block; padding:4px 10px; border-radius:18px; font-size:12px; font-weight:600; background:#eef2ff; color:#3730a3; width:max-content; }
.status-chip.pendiente { background:#fff7ed; color:#b45309; }
.status-chip.aceptada { background:#ecfdf5; color:#047857; }
.status-chip.rechazada, .status-chip.cancelada { background:#fef2f2; color:#b91c1c; }
.status-chip.realizada { background:#f5f3ff; color:#6d28d9; }
.empty-state { padding:40px; text-align:center; border:2px dashed #cbd5e1; border-radius:20px; background:#f8fafc; font-size:15px; color:#64748b; }
.form-inline { display:flex; flex-direction:column; gap:10px; margin-top:12px; }
.form-inline input, .form-inline textarea { width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; background:#f9fafb; }
.form-inline input:focus, .form-inline textarea:focus { outline:none; border-color:#6366f1; background:#fff; }

/* Buscador en historial */
.search-row { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
.search-row input { flex:1; padding:12px 14px; border:1px solid #d1d5db; border-radius:12px; background:#f8fafc; font-size:14px; }
.search-row input:focus { outline:none; border-color:#2563eb; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,.12); }

@media (max-width: 1200px){ .meetings-panel { padding:34px 38px; } }
@media (max-width: 992px){ .meetings-panel { padding:30px 32px; } }
@media (max-width: 820px){ .pending-card { grid-template-columns:1fr; } .pending-actions { flex-direction:row; } }
@media (max-width: 768px){
  .meetings-panel { padding:26px 24px; border-radius:22px; min-height:auto; }
  .meetings-header h3 { font-size:24px; }
  button.action-btn { padding:10px 14px; }
}
`;

const AdvisorMeetingsPage: React.FC = () => {
  const user = authService.getStoredUser();
  const advisorId = user?.id;
  const [pending, setPending] = useState<PendingAdvisorMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approveData, setApproveData] = useState<Record<number, { ubicacion?: string; enlace?: string; comentarios?: string }>>({});
  const [rejectReason, setRejectReason] = useState<Record<number, string>>({});
  // Historial state (lista de estudiantes ASIGNADOS)
  const [assignedStudents, setAssignedStudents] = useState<AdvisorStudent[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AdvisorStudent | null>(null);
  const [studentHistory, setStudentHistory] = useState<AdvisorHistoryMeeting[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPending = async () => {
    if (!advisorId) return;
    try {
      setLoading(true); setError(null);
      const res = await meetingService.getPendingMeetings(advisorId);
      if (res.success) setPending(res.pending_meetings); else setError('Error cargando reuniones');
    } catch (e:any){ setError(e.message || 'Error desconocido'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPending(); }, []);

  const loadAssignedStudents = async () => {
    if (!advisorId) return;
    try {
      setHistoryLoading(true);
      const res = await advisorService.getAssignedStudents();
      setAssignedStudents(res || []);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadStudentHistory = async (student: AdvisorStudent) => {
    if (!advisorId) return;
    const res = await meetingService.getAdvisorStudentHistory(advisorId, student.id);
    if (res.success) setStudentHistory(res.history || []);
  };

  useEffect(() => { loadAssignedStudents(); }, []);

  // Socket para actualizaciones en vivo
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    if (!advisorId) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    if (socketRef.current) return;
    socketRef.current = io('http://localhost:3001', { auth: { token } });
    socketRef.current.on('meeting:created', () => { loadPending(); if (selectedStudent) loadStudentHistory(selectedStudent); });
    socketRef.current.on('meeting:updated', () => { loadPending(); if (selectedStudent) loadStudentHistory(selectedStudent); });
    return () => { socketRef.current?.disconnect(); socketRef.current = null; };
  }, [advisorId]);

  const handleApprove = async (m: PendingAdvisorMeeting) => {
    const form = approveData[m.id_reunion] || {};
    const res = await meetingService.approveMeeting(m.id_reunion, form);
    if (res.success) {
      setPending(prev => prev.filter(p => p.id_reunion !== m.id_reunion));
    } else { alert('Error aprobando reunión'); }
  };

  const handleReject = async (m: PendingAdvisorMeeting) => {
    const motivo = rejectReason[m.id_reunion] || 'No especificado';
    const res = await meetingService.rejectMeeting(m.id_reunion, { motivo });
    if (res.success) {
      setPending(prev => prev.filter(p => p.id_reunion !== m.id_reunion));
    } else { alert('Error rechazando reunión'); }
  };

  // Tabs para separar Solicitudes Pendientes y Historial (similar a vista estudiante)
  const [activeTab, setActiveTab] = useState<'pendientes' | 'historial'>('pendientes');

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
            <p>Gestiona y responde las solicitudes de tus estudiantes.</p>
          </div>
          <div className="tabs-container meetings-tabs-container">
            <div className="tabs">
              <button className={`tab ${activeTab==='pendientes'?'active':''}`} onClick={()=>setActiveTab('pendientes')}>
                📥 Solicitudes pendientes <span className="pending-count" style={{transform:'translateY(-1px)'}}>{pending.length}</span>
              </button>
              <button className={`tab ${activeTab==='historial'?'active':''}`} onClick={()=>setActiveTab('historial')}>
                📚 Historial
              </button>
            </div>
            <div className="tab-content meetings-tab-content">
              {activeTab === 'pendientes' && (
                <div className="meetings-panel">
                  {loading && <p>Cargando...</p>}
                  {error && <p style={{color:'red'}}>{error}</p>}
                  {!loading && pending.length === 0 && (
                    <div className="empty-state">No hay solicitudes pendientes</div>
                  )}
                  <div className="pending-list">
                    {pending.map(m => (
                      <div key={m.id_reunion} className="pending-card">
                        <div className="pending-info">
                          <strong>{m.estudiante_nombre}</strong>
                          <span className="meta">{m.fecha_reunion} • {m.hora_inicio} - {m.hora_fin}</span>
                          <span className="meta">Tesis: {m.tesis_titulo || '—'}</span>
                          <span className="meta">Agenda: {m.agenda || 'General'}</span>
                          {m.modalidad && <span className="meta">Modalidad: <strong>{m.modalidad}</strong></span>}
                          <span className={`status-chip ${m.estado}`}>{mapMeetingStatus(m.estado as any)}</span>
                          <div className="form-inline">
                            <input
                              placeholder={`Ubicación ${m.modalidad === 'presencial' ? '(requerida)' : '(opcional)'}`}
                              value={approveData[m.id_reunion]?.ubicacion || ''}
                              onChange={e => setApproveData(d => ({...d, [m.id_reunion]: {...d[m.id_reunion], ubicacion:e.target.value}}))}
                              style={m.modalidad === 'presencial' && !(approveData[m.id_reunion]?.ubicacion) ? { borderColor: '#ef4444' } : undefined}
                            />
                            <input
                              placeholder={`Enlace virtual ${m.modalidad === 'virtual' ? '(requerido)' : '(opcional)'}`}
                              value={approveData[m.id_reunion]?.enlace || ''}
                              onChange={e => setApproveData(d => ({...d, [m.id_reunion]: {...d[m.id_reunion], enlace:e.target.value}}))}
                              style={m.modalidad === 'virtual' && !(approveData[m.id_reunion]?.enlace) ? { borderColor: '#ef4444' } : undefined}
                            />
                            <textarea placeholder="Comentarios (opcional)" rows={2} value={approveData[m.id_reunion]?.comentarios || ''} onChange={e => setApproveData(d => ({...d, [m.id_reunion]: {...d[m.id_reunion], comentarios:e.target.value}}))}></textarea>
                          </div>
                          <div className="form-inline">
                            <textarea placeholder="Motivo rechazo" rows={2} value={rejectReason[m.id_reunion] || ''} onChange={e => setRejectReason(r => ({...r, [m.id_reunion]: e.target.value}))}></textarea>
                          </div>
                        </div>
                        <div className="pending-actions">
                          <button
                            className="action-btn approve"
                            onClick={() => handleApprove(m)}
                            disabled={(m.modalidad === 'presencial' && !approveData[m.id_reunion]?.ubicacion) || (m.modalidad === 'virtual' && !approveData[m.id_reunion]?.enlace)}
                          >
                            ✅ Aprobar
                          </button>
                          <button className="action-btn reject" onClick={() => handleReject(m)}>❌ Rechazar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'historial' && (
                <div className="meetings-panel">
                  {!selectedStudent && (
                    <>
                      <div className="search-row">
                        <input
                          placeholder="Buscar por nombre, correo o título de tesis"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {historyLoading && <p>Cargando estudiantes...</p>}
                      {!historyLoading && assignedStudents.length === 0 && (
                        <div className="empty-state">No tienes estudiantes asignados aún</div>
                      )}
                      {!historyLoading && assignedStudents.length > 0 && (
                        <div className="pending-list">
                          {assignedStudents
                            .filter(s => {
                              if (!searchTerm.trim()) return true;
                              const q = searchTerm.toLowerCase();
                              const name = (s.name || '').toLowerCase();
                              const email = (s.email || '').toLowerCase();
                              const title = (s.thesisTitle || '').toLowerCase();
                              return name.includes(q) || email.includes(q) || title.includes(q);
                            })
                            .map(s => (
                            <div key={s.id} className="pending-card">
                              <div className="pending-info">
                                <strong>{s.name}</strong>
                                <span className="meta">{s.email || ''}</span>
                                <span className="meta">Tesis: {s.thesisTitle || '—'}</span>
                                {s.phase && <span className="meta">Fase: {s.phase}</span>}
                              </div>
                              <div className="pending-actions">
                                <button className="action-btn refresh" onClick={() => { setSelectedStudent(s); loadStudentHistory(s); }}>Ver historial</button>
                              </div>
                            </div>
                          ))}
                          {searchTerm.trim() && assignedStudents.filter(s => {
                            const q = searchTerm.toLowerCase();
                            return (s.name||'').toLowerCase().includes(q) || (s.email||'').toLowerCase().includes(q) || (s.thesisTitle||'').toLowerCase().includes(q);
                          }).length === 0 && (
                            <div className="empty-state">No hay coincidencias para “{searchTerm}”.</div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {selectedStudent && (
                    <>
                      <div className="meetings-header" style={{marginTop:0}}>
                        <h3>👤 {selectedStudent.name}</h3>
                        <button className="action-btn" onClick={() => { setSelectedStudent(null); setStudentHistory([]); }}>← Volver</button>
                      </div>
                      {studentHistory.length === 0 ? (
                        <div className="empty-state">Sin reuniones pasadas con este estudiante</div>
                      ) : (
                        <div className="pending-list">
                          {studentHistory.map(h => (
                            <div key={h.id_reunion} className="pending-card">
                              <div className="pending-info">
                                <strong>{h.fecha_reunion} • {h.hora_inicio} - {h.hora_fin}</strong>
                                <span className="meta">Estado: <span className={`status-chip ${h.estado}`}>{mapMeetingStatus(h.estado)}</span></span>
                                {h.agenda && <span className="meta">Agenda: {h.agenda}</span>}
                                {h.modalidad && <span className="meta">Modalidad: <strong>{h.modalidad}</strong></span>}
                                {h.ubicacion && <span className="meta">Ubicación: {h.ubicacion}</span>}
                                {h.enlace && <span className="meta">Enlace: {h.enlace}</span>}
                                {h.comentarios && <span className="meta">Comentarios: {h.comentarios}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
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

export default AdvisorMeetingsPage;
