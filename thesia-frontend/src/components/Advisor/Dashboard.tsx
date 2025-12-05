import React, { useEffect, useMemo, useState } from 'react';
import { useAdvisorDashboard } from './hooks/useAdvisorDashboard';
import Sidebar from './Layout/Sidebar';
import { dashboardStyles } from './styles/Dashboard.styles';
import { dashboardStyles as studentDashboardStyles } from '../Dashboard/Dashboard.styles';
import advisorService from '../../services/advisorService';
import documentsService from '../../services/documentsService';
import { meetingService } from '../../services/meetingService';
import { notificationsService } from '../../services/notificationsService';
import type { AdvisorDocument } from './Documents/types/document.types';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  label?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, label }) => (
  <div className={`stat-card ${color}`}>
    <span className="stat-icon">{icon}</span>
    <span className="stat-number">{value}</span>
    <div className="stat-label">{title}</div>
    {label && <div className="stat-label" style={{ marginTop: 4 }}>{label}</div>}
  </div>
);

const AdvisorDashboard: React.FC = () => {
  const { data, loading, error } = useAdvisorDashboard();
  const [pendingDocs, setPendingDocs] = useState<AdvisorDocument[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [recentNotifs, setRecentNotifs] = useState<Array<{ id: number; mensaje: string; fecha_envio?: string; tipo?: string }>>([]);
  const [myGuidesCount, setMyGuidesCount] = useState<number>(0);
  const [myGuides, setMyGuides] = useState<Array<{ id: number; fileName: string; uploadDate?: string; description?: string }>>([]);
  const [pendingMeetings, setPendingMeetings] = useState<Array<{ id: number; fecha: string; hora_inicio: string; hora_fin?: string; estudiante?: string; estado?: string }>>([]);
  const [auxLoading, setAuxLoading] = useState<boolean>(true);

  const advisorId = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : {};
      return Number(u.id || u.id_usuario || u.userId || u.id_user) || undefined;
    } catch {
      return undefined;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadExtra = async () => {
      try {
        setAuxLoading(true);

        const docs = await advisorService.getPendingDocuments();
        const notifRes = await notificationsService.getMyNotifications(1, 5, { type: 'all', priority: 'all', isRead: 'all' });
        const unreadRes = await notificationsService.getUnreadCount();
        const guidesRes = await documentsService.getMyUploadedGuides();

        let meetings: Array<{ id: number; fecha: string; hora_inicio: string; hora_fin?: string; estudiante?: string; estado?: string }> = [];
        if (advisorId) {
          const mRes = await meetingService.getPendingMeetings(advisorId);
          meetings = (mRes.pending_meetings || []).slice(0, 5).map((m: any) => ({
            id: Number(m.id_reunion || m.id || 0),
            fecha: m.fecha_reunion || m.date || '',
            hora_inicio: (m.hora_inicio || m.time || '').slice(0, 5),
            hora_fin: (m.hora_fin || '').slice(0, 5),
            estudiante: m.estudiante_nombre || m.estudiante || m.student_name,
            estado: m.estado || m.status,
          }));
        }

        if (!mounted) return;

        setPendingDocs((docs || []).slice(0, 5));
        setRecentNotifs(Array.isArray((notifRes as any)?.notifications) ? (notifRes as any).notifications.slice(0, 5) : []);
        setUnreadCount((unreadRes && unreadRes.unreadCount) || 0);

        const guidesArr = Array.isArray(guidesRes?.guides) ? guidesRes.guides : [];
        setMyGuidesCount(guidesArr.length);
        setMyGuides(guidesArr.slice(0, 3).map((g: any) => ({
          id: g.id,
          fileName: g.fileName,
          uploadDate: g.uploadDate,
          description: g.description,
        })));
        setPendingMeetings(meetings);
      } catch (e) {
        console.error(e);
      } finally {
        setAuxLoading(false);
      }
    };

    loadExtra();
    return () => {
      mounted = false;
    };
  }, [advisorId]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-section">
          <h1>Panel del Asesor</h1>

          {/* Resumen de métricas */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginTop: 12 }}>
            <StatCard
              title="Estudiantes asignados"
              value={data?.totalEstudiantes ?? '-'}
              icon="👨‍🎓"
              color="blue"
            />
            <StatCard
              title="Reuniones pendientes"
              value={data?.reunionesPendientes ?? pendingMeetings.length}
              icon="📅"
              color="orange"
            />
            <StatCard
              title="Por revisar"
              value={data?.documentosPorRevisar ?? pendingDocs.length}
              icon="📄"
              color="purple"
            />
            <StatCard
              title="Mis guías"
              value={myGuidesCount}
              icon="📚"
              color="green"
            />
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: '#ffecec', color: '#b00020' }}>
              Ocurrió un error cargando el dashboard: {error}
            </div>
          )}

          {!auxLoading && !loading ? (
            <>
              {/* Acciones rápidas */}
              <div className="dashboard-card" style={{ marginTop: 16 }}>
                <div className="card-header">
                  <h3>Acciones rápidas</h3>
                  <span className="card-icon">⚡</span>
                </div>
                <div className="card-content">
                  <div className="actions-grid">
                    <a className="action-button" href="/advisor/documents">
                      <span className="action-icon">📄</span>
                      <div className="action-content">
                        <span className="action-title">Revisar documentos</span>
                        <span className="action-subtitle">Pendientes de evaluación</span>
                      </div>
                    </a>
                    <a className="action-button" href="/advisor/meetings">
                      <span className="action-icon">📅</span>
                      <div className="action-content">
                        <span className="action-title">Gestionar reuniones</span>
                        <span className="action-subtitle">Aprobar o reprogramar</span>
                      </div>
                    </a>
                    <a className="action-button" href="/advisor/resources">
                      <span className="action-icon">📚</span>
                      <div className="action-content">
                        <span className="action-title">Subir guía</span>
                        <span className="action-subtitle">Recursos para tus estudiantes</span>
                      </div>
                    </a>
                    <a className="action-button" href="/advisor/students">
                      <span className="action-icon">👨‍🎓</span>
                      <div className="action-content">
                        <span className="action-title">Ver estudiantes</span>
                        <span className="action-subtitle">Progreso y fase actual</span>
                      </div>
                    </a>
                    <a className="action-button" href="/notificaciones">
                      <span className="action-icon">🔔</span>
                      <div className="action-content">
                        <span className="action-title">Notificaciones</span>
                        <span className="action-subtitle">Mensajes recientes</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Grid principal */}
              <div className="dashboard-grid">
                <div className="left-column">
                  {/* Por revisar */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>Por revisar</h3>
                      <span className="card-icon">📄</span>
                    </div>
                    <div className="card-content">
                      {pendingDocs.length === 0 ? (
                        <div className="no-activities">
                          <div className="no-activities-icon">📄</div>
                          <p>No hay documentos pendientes</p>
                        </div>
                      ) : (
                        <ul className="item-list">
                          {pendingDocs.map((d) => (
                            <li key={d.id} className="item">
                              <div className="item-main">
                                <span className="item-icon">📘</span>
                                <div className="item-texts">
                                  <div className="item-title">{d.title || 'Documento'}</div>
                                  <div className="item-subtitle">{d.student || 'Estudiante'} · {d.phase || 'Fase'}</div>
                                </div>
                              </div>
                              <div className="item-meta">
                                <span className="tag warning">{(d.status || 'pendiente').toString()}</span>
                                <a className="link" href="/advisor/documents">Revisar</a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button className="view-all-button" onClick={() => (window.location.href = '/advisor/documents')}>Ver todos</button>
                    </div>
                  </div>

                  {/* Mis guías */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>Mis guías</h3>
                      <span className="card-icon">📚</span>
                    </div>
                    <div className="card-content">
                      {myGuides.length === 0 ? (
                        <div className="no-activities">
                          <div className="no-activities-icon">📚</div>
                          <p>Aún no has subido guías</p>
                        </div>
                      ) : (
                        <ul className="item-list">
                          {myGuides.map((g) => (
                            <li key={g.id} className="item">
                              <div className="item-main">
                                <span className="item-icon">📄</span>
                                <div className="item-texts">
                                  <div className="item-title">{g.fileName}</div>
                                  <div className="item-subtitle">{g.uploadDate ? new Date(g.uploadDate).toLocaleDateString() : ''}</div>
                                </div>
                              </div>
                              <div className="item-meta">
                                <a className="link" href="/advisor/resources">Ver</a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <a className="view-all-button" style={{ width: '50%' }} href="/advisor/resources">Subir guía</a>
                        <a className="view-all-button" style={{ width: '50%' }} href="/advisor/resources">Ver todas</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="right-column">
                  {/* Reuniones */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>Solicitudes de reunión</h3>
                      <span className="card-icon">📅</span>
                    </div>
                    <div className="card-content">
                      {advisorId ? (
                        pendingMeetings.length === 0 ? (
                          <div className="no-activities">
                            <div className="no-activities-icon">📅</div>
                            <p>Sin reuniones pendientes</p>
                          </div>
                        ) : (
                          <ul className="item-list">
                            {pendingMeetings.map((m) => (
                              <li key={m.id} className="item">
                                <div className="item-main">
                                  <span className="item-icon">🗓️</span>
                                  <div className="item-texts">
                                    <div className="item-title">{m.fecha} · {m.hora_inicio}{m.hora_fin ? ` - ${m.hora_fin}` : ''}</div>
                                    <div className="item-subtitle">{m.estudiante || 'Estudiante'} · {(m.estado || 'pendiente')}</div>
                                  </div>
                                </div>
                                <div className="item-meta">
                                  <a className="link" href="/advisor/meetings">Gestionar</a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )
                      ) : (
                        <p className="muted">No se pudo identificar tu usuario para cargar reuniones.</p>
                      )}
                    </div>
                  </div>

                  {/* Notificaciones */}
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>Notificaciones {unreadCount > 0 ? `(${unreadCount} sin leer)` : ''}</h3>
                      <span className="card-icon">🔔</span>
                    </div>
                    <div className="card-content">
                      {recentNotifs.length === 0 ? (
                        <div className="no-activities">
                          <div className="no-activities-icon">🔔</div>
                          <p>No hay notificaciones recientes</p>
                        </div>
                      ) : (
                        <ul className="item-list">
                          {recentNotifs.map((n: any) => (
                            <li key={n.id_notificacion || n.id} className="item">
                              <div className="item-main">
                                <span className="item-icon">
                                  {n.tipo === 'reunion' ? '📅' : n.tipo === 'comentario' ? '💬' : n.tipo === 'documento' ? '📄' : '🔔'}
                                </span>
                                <div className="item-texts">
                                  <div className="item-title">{n.mensaje}</div>
                                  <div className="item-subtitle">{n.fecha_envio ? new Date(n.fecha_envio).toLocaleString() : ''}</div>
                                </div>
                              </div>
                              <div className="item-meta">
                                <a className="link" href="/notificaciones">Ver</a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button className="view-all-button" onClick={() => (window.location.href = '/notificaciones')}>Ver todas</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      </div>
      <style>{studentDashboardStyles}</style>
      <style>{dashboardStyles}</style>
    </div>
  );
};

export default AdvisorDashboard;
