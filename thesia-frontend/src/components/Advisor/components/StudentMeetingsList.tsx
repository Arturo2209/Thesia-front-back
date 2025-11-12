import React, { useEffect, useState } from 'react';
import meetingService from '../../../services/meetingService';
import { mapMeetingStatus } from '../../../types/meeting.types';
import type { StudentMeeting } from '../../../types/meeting.types';

// Lista con subtítulos (secciones) solicitados: Próxima reunión, Confirmadas próximas, Pendientes por aprobar,
// Rechazadas / Canceladas, Realizadas. Sin filtros ni botón manual. Refresco vía socket (remount por key en padre).

const styles = `
.student-meetings { margin-top:24px; }
.meetings-grid { display:flex; flex-direction:column; gap:12px; }
.meeting-card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:12px 16px; box-shadow:0 1px 3px rgba(0,0,0,0.08); display:flex; flex-direction:column; gap:6px; }
.status-chip { font-size:12px; padding:2px 8px; border-radius:16px; background:#eef2ff; width:max-content; }
.status-chip.pendiente { background:#fff7ed; color:#b45309; border:1px solid #fed7aa; }
.status-chip.aceptada { background:#ecfdf5; color:#047857; border:1px solid #bbf7d0; }
.status-chip.rechazada, .status-chip.cancelada { background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
.status-chip.realizada { background:#f5f3ff; color:#6d28d9; border:1px solid #ddd6fe; }
.meeting-meta { font-size:13px; color:#555; }
.empty { padding:20px; text-align:center; border:2px dashed #cbd5e1; border-radius:12px; background:#fafafa; }
.section { margin:18px 0; }
.section h5 { margin:8px 0 10px; font-size:16px; color:#334155; display:flex; align-items:center; gap:8px; }
.next-meeting { border:1px solid #bfdbfe; background:#eff6ff; box-shadow:0 1px 4px rgba(59,130,246,0.25); }
.next-badge { background:#2563eb; color:#fff; font-size:12px; padding:2px 8px; border-radius:16px; }
@media (max-width: 768px){ .next-badge { margin-top:4px; } }
`;

const StudentMeetingsList: React.FC = () => {
  const [meetings, setMeetings] = useState<StudentMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await meetingService.getStudentMeetings();
      if (res.success) {
        const sorted = [...res.meetings].sort((a, b) => {
          const ta = new Date(`${a.fecha_reunion}T${a.hora_inicio.slice(0,5)}:00`).getTime();
          const tb = new Date(`${b.fecha_reunion}T${b.hora_inicio.slice(0,5)}:00`).getTime();
          return ta - tb;
        });
        setMeetings(sorted);
      } else {
        setError('Error cargando reuniones');
      }
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Utilidades de fecha
  const parseDateTime = (m: StudentMeeting): Date => {
    const time = (m.hora_inicio || '').slice(0,5);
    return new Date(`${m.fecha_reunion}T${time}:00`);
  };
  const now = new Date();
  const isFuture = (m: StudentMeeting) => parseDateTime(m) >= now;
  const byDateAsc = (a: StudentMeeting, b: StudentMeeting) => parseDateTime(a).getTime() - parseDateTime(b).getTime();
  const byDateDesc = (a: StudentMeeting, b: StudentMeeting) => parseDateTime(b).getTime() - parseDateTime(a).getTime();

  // Derivar secciones
  const futureAccepted = meetings.filter(m => m.estado === 'aceptada' && isFuture(m)).sort(byDateAsc);
  const futurePending = meetings.filter(m => m.estado === 'pendiente' && isFuture(m)).sort(byDateAsc);
  const nextMeeting = futureAccepted[0] || futurePending[0] || null;
  const otherFutureAccepted = futureAccepted.filter(m => m !== nextMeeting);
  const otherFuturePending = futurePending.filter(m => m !== nextMeeting);
  const recentRejected = meetings.filter(m => (m.estado === 'rechazada' || m.estado === 'cancelada')).sort(byDateDesc);
  const recentDone = meetings.filter(m => m.estado === 'realizada').sort(byDateDesc);

  const renderCard = (m: StudentMeeting, extraClass = '') => (
    <div key={m.id_reunion} className={`meeting-card ${extraClass}`}>
      <strong>{m.fecha_reunion} • {m.hora_inicio.slice(0,5)} - {m.hora_fin.slice(0,5)}</strong>
      <div className="meeting-meta">
        Estado: <span className={`status-chip ${m.estado}`}>{mapMeetingStatus(m.estado)}</span>
        {m.modalidad && <span style={{ marginLeft: 8 }}>• Modalidad: <strong>{m.modalidad}</strong></span>}
      </div>
      {m.agenda && <div className="meeting-meta">Agenda: {m.agenda}</div>}
      {m.ubicacion && <div className="meeting-meta">Ubicación: {m.ubicacion}</div>}
      {m.enlace && <div className="meeting-meta">Enlace: <a href={m.enlace} target="_blank" rel="noopener noreferrer">Entrar</a></div>}
      {m.comentarios && <div className="meeting-meta">Notas: {m.comentarios}</div>}
      {m.asesor_nombre && <div className="meeting-meta">Asesor: {m.asesor_nombre}</div>}
    </div>
  );

  return (
    <div className="student-meetings">
      <h4>📋 Mis Reuniones</h4>
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && meetings.length === 0 && <div className="empty">No tienes reuniones registradas</div>}

      {/* Próxima reunión */}
      {nextMeeting && (
        <div className="section">
          <h5>Próxima reunión <span className="next-badge">próximamente</span></h5>
          {renderCard(nextMeeting, 'next-meeting')}
        </div>
      )}

      {/* Confirmadas próximas */}
      {otherFutureAccepted.length > 0 && (
        <div className="section">
          <h5>Confirmadas próximas</h5>
          <div className="meetings-grid">
            {otherFutureAccepted.map(m => renderCard(m))}
          </div>
        </div>
      )}

      {/* Pendientes por aprobar */}
      {otherFuturePending.length > 0 && (
        <div className="section">
          <h5>Pendientes por aprobar</h5>
          <div className="meetings-grid">
            {otherFuturePending.map(m => renderCard(m))}
          </div>
        </div>
      )}

      {/* Rechazadas / Canceladas */}
      {recentRejected.length > 0 && (
        <div className="section">
          <h5>Rechazadas / Canceladas (recientes)</h5>
          <div className="meetings-grid">
            {recentRejected.map(m => renderCard(m))}
          </div>
        </div>
      )}

      {/* Realizadas */}
      {recentDone.length > 0 && (
        <div className="section">
          <h5>Realizadas</h5>
          <div className="meetings-grid">
            {recentDone.map(m => renderCard(m))}
          </div>
        </div>
      )}

      <style>{styles}</style>
    </div>
  );
};

export default StudentMeetingsList;
