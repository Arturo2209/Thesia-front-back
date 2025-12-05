import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  notifications: Array<{
    id: number;
    icon: string;
    message: string;
    timeAgo: string;
    actionUrl?: string;
  }>;
  show: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, show, onClose }) => {
  const navigate = useNavigate();
  if (!show) return null;
  return (
    <div style={{
      position:'absolute',top:'120%',right:0,minWidth:320,maxWidth:400,
      background:'#fff',boxShadow:'0 6px 24px rgba(60,60,120,0.18)',borderRadius:16,zIndex:100,padding:'18px 18px 12px 18px',
      animation:'fadeInNotif 0.25s',
      border:'1px solid #e5e7eb'
    }}>
      <style>{`
        @keyframes fadeInNotif {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
        <span style={{fontSize:22,color:'#3b82f6'}}>🔔</span>
        <h4 style={{margin:0,fontSize:16,fontWeight:600,color:'#1f2937',flex:1}}>Notificaciones recientes</h4>
        <span style={{fontSize:18,color:'#64748b',cursor:'pointer'}} onClick={onClose}>✖️</span>
      </div>
      <div style={{maxHeight:220,overflowY:'auto',paddingRight:2}}>
        {notifications && notifications.length > 0 ? (
          <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:10}}>
            {notifications.slice(0,5).map(n => (
              <li key={n.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 0',borderBottom:'1px solid #f3f4f6'}}>
                <span style={{fontSize:20}}>{n.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:'#1e293b'}}>{n.message}</div>
                  <div style={{fontSize:12,color:'#64748b',marginTop:2}}>{n.timeAgo}</div>
                </div>
                {n.actionUrl && (
                  <a href={n.actionUrl} style={{fontSize:12,color:'#3b82f6',textDecoration:'underline',marginLeft:8}}>Ver</a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{fontSize:14,color:'#64748b',textAlign:'center',padding:'18px 0'}}>No hay notificaciones recientes</div>
        )}
      </div>
      <button style={{marginTop:14,background:'#3b82f6',color:'#fff',border:'none',padding:'8px 0',borderRadius:8,cursor:'pointer',fontSize:15,width:'100%',fontWeight:500,letterSpacing:0.2}} onClick={()=>{onClose();navigate('/notificaciones')}}>
        Ver todas las notificaciones
      </button>
    </div>
  );
};

export default NotificationDropdown;
