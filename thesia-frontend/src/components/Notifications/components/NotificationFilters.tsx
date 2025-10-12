import React from 'react';
import type { NotificationFilter, NotificationData } from '../types/notifications.types';

interface NotificationFiltersProps {
  filter: NotificationFilter;
  onFilterChange: (newFilter: Partial<NotificationFilter>) => void;
  notificationsByType: Record<string, number>;
  notificationsByPriority: Record<string, number>;
  unreadCount: number;
  totalCount: number;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filter,
  onFilterChange,
  notificationsByType,
  notificationsByPriority,
  unreadCount,
  totalCount
}) => {
  
  // 🔍 Tipos de notificación disponibles
  const notificationTypes: Array<{ 
    value: NotificationData['tipo'] | 'all', 
    label: string, 
    icon: string 
  }> = [
    { value: 'all', label: 'Todas', icon: '📋' },
    { value: 'reunion', label: 'Reuniones', icon: '📅' },
    { value: 'documento', label: 'Documentos', icon: '📄' },
    { value: 'comentario', label: 'Comentarios', icon: '💬' },
    { value: 'plazo', label: 'Plazos', icon: '⏰' },
    { value: 'estado', label: 'Estados', icon: '📋' },
    { value: 'general', label: 'General', icon: '📢' }
  ];

  // 🚦 Prioridades disponibles
  const priorityLevels: Array<{
    value: NotificationData['prioridad'] | 'all',
    label: string,
    icon: string,
    color: string
  }> = [
    { value: 'all', label: 'Todas', icon: '🏷️', color: '#6B7280' },
    { value: 'alta', label: 'Alta', icon: '🔴', color: '#EF4444' },
    { value: 'media', label: 'Media', icon: '🟡', color: '#F59E0B' },
    { value: 'baja', label: 'Baja', icon: '🟢', color: '#10B981' }
  ];

  // 📖 Estados de lectura
  const readStates: Array<{
    value: boolean | 'all',
    label: string,
    icon: string
  }> = [
    { value: 'all', label: 'Todas', icon: '📋' },
    { value: false, label: 'No leídas', icon: '🔔' },
    { value: true, label: 'Leídas', icon: '✅' }
  ];

  return (
    <div className="notification-filters">
      {/* 📊 ESTADÍSTICAS GENERALES */}
      <div className="filters-stats">
        <div className="stat-item">
          <span className="stat-icon">📋</span>
          <span className="stat-label">Total:</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔔</span>
          <span className="stat-label">Sin leer:</span>
          <span className="stat-value">{unreadCount}</span>
        </div>
      </div>

      {/* 🔍 FILTROS PRINCIPALES */}
      <div className="filters-main">
        
        {/* 📂 FILTRO POR TIPO */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">📂</span>
            Tipo de notificación
          </label>
          <div className="filter-buttons">
            {notificationTypes.map((type) => {
              const count = type.value === 'all' ? totalCount : (notificationsByType[type.value] || 0);
              const isActive = filter.type === type.value;
              
              return (
                <button
                  key={type.value}
                  className={`filter-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onFilterChange({ type: type.value })}
                  disabled={count === 0 && type.value !== 'all'}
                >
                  <span className="btn-icon">{type.icon}</span>
                  <span className="btn-label">{type.label}</span>
                  <span className="btn-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🚦 FILTRO POR PRIORIDAD */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">🚦</span>
            Prioridad
          </label>
          <div className="filter-buttons">
            {priorityLevels.map((priority) => {
              const count = priority.value === 'all' ? totalCount : (notificationsByPriority[priority.value] || 0);
              const isActive = filter.priority === priority.value;
              
              return (
                <button
                  key={priority.value}
                  className={`filter-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onFilterChange({ priority: priority.value })}
                  disabled={count === 0 && priority.value !== 'all'}
                  style={{ 
                    '--priority-color': priority.color 
                  } as React.CSSProperties}
                >
                  <span className="btn-icon">{priority.icon}</span>
                  <span className="btn-label">{priority.label}</span>
                  <span className="btn-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 📖 FILTRO POR ESTADO DE LECTURA */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">📖</span>
            Estado de lectura
          </label>
          <div className="filter-buttons">
            {readStates.map((state) => {
              let count: number;
              if (state.value === 'all') {
                count = totalCount;
              } else if (state.value === false) {
                count = unreadCount;
              } else {
                count = totalCount - unreadCount;
              }
              
              const isActive = filter.isRead === state.value;
              
              return (
                <button
                  key={state.value.toString()}
                  className={`filter-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onFilterChange({ isRead: state.value })}
                  disabled={count === 0 && state.value !== 'all'}
                >
                  <span className="btn-icon">{state.icon}</span>
                  <span className="btn-label">{state.label}</span>
                  <span className="btn-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🔄 BOTÓN LIMPIAR FILTROS */}
        <div className="filter-actions">
          <button
            className="clear-filters-btn"
            onClick={() => onFilterChange({
              type: 'all',
              priority: 'all',
              isRead: 'all'
            })}
            disabled={
              filter.type === 'all' && 
              filter.priority === 'all' && 
              filter.isRead === 'all'
            }
          >
            🔄 Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;