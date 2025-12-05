import React from 'react';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  title: string;
  showNotifIcon?: boolean;
  notifications?: Array<{
    id: number;
    icon: string;
    message: string;
    timeAgo: string;
    actionUrl?: string;
  }>;
}

const Header: React.FC<HeaderProps> = ({ title, showNotifIcon = true, notifications = [] }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <div style={{
      width: '100%',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(60,60,120,0.08)',
      padding: '22px 38px 18px 38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      minHeight: 60,
      zIndex: 10
    }}>
      <h1 style={{margin:0,fontSize: '1.7rem',fontWeight:600,color:'#253047'}}>{title}</h1>
      {showNotifIcon && (
        <div style={{position:'relative'}}>
          <span
            role="img"
            aria-label="notificaciones"
            style={{cursor:'pointer',fontSize:28,color:'#fbbf24'}}
            onClick={() => setShowDropdown(v => !v)}
          >
            🛎️
          </span>
          <NotificationDropdown
            notifications={notifications}
            show={showDropdown}
            onClose={() => setShowDropdown(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
