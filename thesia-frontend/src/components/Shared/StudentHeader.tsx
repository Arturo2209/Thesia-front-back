import React from 'react';
import { useNavigate } from 'react-router-dom';
import notificationsService from '../../services/notificationsService';
import type { NotificationData } from '../Notifications/types/notifications.types';

type Props = {
  title: string;
  right?: React.ReactNode;
};

const formatTimeAgo = (iso: string) => {
  try {
    const then = new Date(iso).getTime();
    const diff = Date.now() - then;
    const m = 60 * 1000, h = 60 * m, d = 24 * h;
    if (diff < m) return 'justo ahora';
    if (diff < h) return `${Math.floor(diff / m)} min`;
    if (diff < d) return `${Math.floor(diff / h)} h`;
    return `${Math.floor(diff / d)} d`;
  } catch {
    return '';
  }
};

const iconForType = (t: NotificationData['tipo']) => ({
  reunion: '📅',
  comentario: '💬',
  documento: '📄',
  plazo: '⏰',
  estado: '🔄',
  general: '🔔'
}[t] || '🔔');

const StudentHeader: React.FC<Props> = ({ title, right }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<NotificationData[]>([]);
  const [unread, setUnread] = React.useState<number>(0);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [listRes, countRes] = await Promise.all([
        notificationsService.getMyNotifications(1, 5),
        notificationsService.getUnreadCount()
      ]);
      setItems(listRes.notifications || []);
      setUnread(countRes.unreadCount || 0);
    } catch (e) {
      console.warn('No se pudieron cargar notificaciones del header', e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // precargar al montar
    loadData();
    const id = window.setInterval(loadData, 90_000); // refresco cada 90s
    return () => window.clearInterval(id);
  }, [loadData]);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const goAll = () => navigate('/notificaciones');

  return (
    <header className="main-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <h1>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }} ref={panelRef}>
        {right}
        <button
          aria-label="Notificaciones"
          className="notification-icon"
          style={{ position: 'relative', border: 'none', background: 'transparent' }}
          onClick={() => { setOpen(v => !v); if (!open) loadData(); }}
        >
          🔔
          {unread > 0 && (
            <span style={{
              position: 'absolute',
              top: -2,
              right: -2,
              background: '#ef4444',
              color: '#fff',
              borderRadius: 999,
              fontSize: 10,
              padding: '1px 5px',
              lineHeight: 1,
              border: '2px solid #fff'
            }}>{unread > 99 ? '99+' : unread}</span>
          )}
        </button>

        {open && (
          <div style={{
            position: 'absolute',
            top: 40,
            right: 0,
            width: 360,
            maxWidth: '88vw',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            boxShadow: '0 10px 24px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#fff',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontWeight: 700 }}>Notificaciones</div>
              {unread > 0 && <div style={{ fontSize: 12, opacity: 0.95 }}>{unread} sin leer</div>}
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: 16, fontSize: 14, color: '#64748b' }}>Cargando...</div>
              ) : items.length === 0 ? (
                <div style={{ padding: 16, fontSize: 14, color: '#64748b' }}>No tienes notificaciones recientes</div>
              ) : (
                items.map((n) => (
                  <div key={n.id_notificacion} style={{ display: 'flex', gap: 10, padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 18 }}>{iconForType(n.tipo)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: '#111827' }}>{n.mensaje}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{formatTimeAgo(n.fecha_envio || n.fecha_creacion)}</div>
                    </div>
                    {n.leido === 0 && <span style={{ width: 8, height: 8, borderRadius: 999, background: '#3b82f6', alignSelf: 'center' }} />}
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <button
                onClick={async () => { await notificationsService.markAllAsRead(); loadData(); }}
                style={{
                  background: '#eef2ff', color: '#1e40af', border: '1px solid #c7d2fe',
                  padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13
                }}
              >
                Marcar todo leído
              </button>
              <button
                onClick={() => navigate('/notificaciones')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff',
                  border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13
                }}
              >
                Ver todas →
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default StudentHeader;
