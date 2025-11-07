import React, { useEffect, useMemo, useState } from 'react';
import advisorService from '../../../../services/advisorService';
import type { AdvisorDocument } from '../types/document.types';

type ActivityType = 'upload' | 'approval' | 'rejection' | 'resubmit';

interface ActivityItem {
  id: string;
  type: ActivityType;
  date: string;
  document: string;
  student: string;
  phase?: string;
  status?: string;
}

interface GroupedDocs {
  key: string; // student|phase
  student: string;
  phase?: string;
  versions: AdvisorDocument[];
  totalVersions: number;
  latestStatus: string;
  firstUpload: string;
  lastActivity: string;
}

const DocumentsHistory: React.FC = () => {
  const [items, setItems] = useState<AdvisorDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | AdvisorDocument['status']>('all');
  const [activeView, setActiveView] = useState<'timeline' | 'versions'>('timeline');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await advisorService.getDocumentsHistory();
      setItems(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((d) => {
      const matchesSearch = search
        ? `${d.title} ${d.student} ${d.description || ''}`.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesStatus = status === 'all' ? true : d.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  const recentActivity: ActivityItem[] = useMemo(() => {
    return filtered
      .slice()
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 20)
      .map((d, idx) => ({
        id: `${d.id}-${idx}`,
        type: getActivityType(d.status),
        date: d.submittedAt,
        document: d.title,
        student: d.student,
        phase: d.phase,
        status: d.status,
      }));
  }, [filtered]);

  const groupedByStudentPhase: GroupedDocs[] = useMemo(() => {
    const groups: Record<string, AdvisorDocument[]> = {};
    filtered.forEach(d => {
      const key = `${d.student}|${d.phase || ''}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(d);
    });

    const toGroup = Object.entries(groups).map(([key, versions]) => {
      const sorted = versions.slice().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      const latest = sorted[0];
      const oldest = sorted[sorted.length - 1];
      const [student, phase] = key.split('|');
      return {
        key,
        student,
        phase: phase || undefined,
        versions: sorted,
        totalVersions: versions.length,
        latestStatus: latest.status,
        firstUpload: oldest.submittedAt,
        lastActivity: latest.submittedAt,
      } as GroupedDocs;
    });

    return toGroup.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }, [filtered]);

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🔎</span>
          <input
            placeholder="Buscar por título o estudiante"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }}
        >
          <option value="all">Todos</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
          <option value="en_revision">En revisión</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      {/* Selector de vista */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setActiveView('timeline')}
          style={tabStyle(activeView === 'timeline')}
        >
          🕒 Actividad Reciente
        </button>
        <button
          onClick={() => setActiveView('versions')}
          style={tabStyle(activeView === 'versions')}
        >
          📊 Por versiones (Estudiante/Fase)
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div>Cargando historial...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: 32 }}>📭</div>
          <div>No hay elementos en el historial</div>
        </div>
      ) : activeView === 'timeline' ? (
        <div className="timeline-container">
          <h3 className="section-title">🕒 Actividad de los últimos envíos</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recentActivity.map((a) => (
              <li key={a.id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <span>{getActivityIcon(a.type)}</span>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <strong>{a.document}</strong>
                    <span className={`status-badge ${statusClass((a.status || 'pendiente') as any)}`}>{a.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, color: '#555', marginTop: 6, flexWrap: 'wrap' }}>
                    <span>👤 {a.student}</span>
                    {a.phase && <span>📂 {a.phase}</span>}
                  </div>
                </div>
                <div style={{ color: '#666', fontSize: 12 }}>{getRelativeTime(a.date)}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="versions-container">
          <h3 className="section-title">📊 Documentos por estudiante y fase</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {groupedByStudentPhase.map((g) => (
              <li key={g.key} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0 }}>👤 {g.student}</h4>
                      {g.phase && <span>• 📂 {g.phase}</span>}
                      <span className={`status-badge ${statusClass(g.latestStatus as any)}`}>{g.latestStatus}</span>
                    </div>
                    <div style={{ color: '#666', marginTop: 4, fontSize: 12 }}>Total versiones: {g.totalVersions} • Última actividad: {getRelativeTime(g.lastActivity)}</div>
                  </div>
                </div>
                <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                  {g.versions.map((v, idx) => (
                    <div key={v.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #eee' }}>
                      <span style={{ fontWeight: 600 }}>v{g.versions.length - idx}</span>
                      <div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span>{v.title}</span>
                          <span className={`status-badge ${statusClass(v.status as any)}`}>{v.status}</span>
                        </div>
                        <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{getRelativeTime(v.submittedAt)}</div>
                      </div>
                      {v.fileUrl && (
                        <a href={v.fileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#1976d2' }}>Ver</a>
                      )}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentsHistory;

function getActivityType(status: string): ActivityType {
  switch (status) {
    case 'aprobado': return 'approval';
    case 'rechazado': return 'rejection';
    case 'en_revision': return 'upload';
    case 'pendiente': return 'upload';
    default: return 'upload';
  }
}

function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case 'upload': return '📤';
    case 'approval': return '✅';
    case 'rejection': return '❌';
    case 'resubmit': return '🔄';
    default: return '📄';
  }
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Hace menos de 1 hora';
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} día${days !== 1 ? 's' : ''}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `Hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
  return date.toLocaleDateString('es-ES');
}

function statusClass(s: AdvisorDocument['status'] | string): string {
  switch (s) {
    case 'aprobado': return 'green';
    case 'rechazado': return 'red';
    case 'en_revision': return 'yellow';
    case 'pendiente':
    default: return 'gray';
  }
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '10px 16px',
    borderRadius: 8,
    border: `1px solid ${active ? '#1976d2' : '#e0e0e0'}`,
    background: active ? '#1976d2' : '#f5f5f5',
    color: active ? '#fff' : '#333',
    cursor: 'pointer',
  };
}
