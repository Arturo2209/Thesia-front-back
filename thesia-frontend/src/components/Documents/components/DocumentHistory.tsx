import React, { useState, useEffect } from 'react';
import documentsService from '../../../services/documentsService';
import type { Document } from '../types/documents.types';
import { documentHistoryStyles } from '../styles/DocumentHistory.styles';

interface DocumentHistoryProps {
  onViewDocument: (documentId: number) => void;
  refreshTrigger: number;
}

interface GroupedDocument {
  baseName: string;
  phase: string;
  versions: Document[];
  totalVersions: number;
  latestStatus: string;
  firstUpload: string;
  lastActivity: string;
}

interface ActivityItem {
  id: string;
  type: 'upload' | 'approval' | 'rejection' | 'resubmit';
  date: string;
  document: string;
  phase: string;
  status?: string;
  version?: number;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({ 
  onViewDocument, 
  refreshTrigger 
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [groupedDocuments, setGroupedDocuments] = useState<GroupedDocument[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'timeline' | 'versions'>('timeline');

  // Cargar documentos
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📚 === CARGANDO HISTORIAL DE DOCUMENTOS ===');

      const response = await documentsService.getMyDocuments({});
      
      if (response.success) {
        console.log('✅ Documentos para historial cargados:', response.documents.length);
        setDocuments(response.documents);
        processDocumentsForHistory(response.documents);
      } else {
        setError(response.message || 'Error cargando historial');
      }
      
    } catch (error) {
      console.error('❌ Error cargando historial:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Procesar documentos para crear grupos y actividad
  const processDocumentsForHistory = (docs: Document[]) => {
    console.log('🔄 === PROCESANDO DOCUMENTOS PARA HISTORIAL ===');
    
    // 📊 AGRUPAR POR NOMBRE BASE Y FASE
    const groups: Record<string, Document[]> = {};
    
    docs.forEach(doc => {
      // Crear clave única por fase (no agrupar versiones diferentes)
      const key = `${doc.phase}`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(doc);
    });

    // 📋 CREAR GRUPOS ESTRUCTURADOS
    const grouped: GroupedDocument[] = Object.entries(groups).map(([key, versions]) => {
      // Ordenar por fecha de subida (más reciente primero)
      const sortedVersions = versions.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );

      const latest = sortedVersions[0];
      const oldest = sortedVersions[sortedVersions.length - 1];

      return {
        baseName: getPhaseDisplayName(key),
        phase: key,
        versions: sortedVersions,
        totalVersions: versions.length,
        latestStatus: latest.status,
        firstUpload: oldest.uploadDate,
        lastActivity: latest.uploadDate
      };
    });

    // Ordenar grupos por última actividad
    const sortedGroups = grouped.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );

    console.log('📊 Grupos creados:', sortedGroups.length);
    setGroupedDocuments(sortedGroups);

    // 🕒 GENERAR ACTIVIDAD RECIENTE
    const activity: ActivityItem[] = [];
    
    docs
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 10) // Últimos 10 eventos
      .forEach((doc, index) => {
        activity.push({
          id: `${doc.id}-${index}`,
          type: getActivityType(doc.status),
          date: doc.uploadDate,
          document: doc.originalFileName,
          phase: getPhaseDisplayName(doc.phase),
          status: doc.status,
          version: 1 // Por ahora asumimos versión 1
        });
      });

    setRecentActivity(activity);
  };

  // Helper: Obtener nombre de fase para mostrar
  const getPhaseDisplayName = (phase: string): string => {
    const phaseNames: Record<string, string> = {
      'fase_1_plan_proyecto': 'Plan de Proyecto',
      'fase_2_diagnostico': 'Diagnóstico',
      'fase_3_marco_teorico': 'Marco Teórico', 
      'fase_4_desarrollo': 'Desarrollo',
      'fase_5_resultados': 'Resultados'
    };
    return phaseNames[phase] || phase;
  };

  // Helper: Determinar tipo de actividad
  const getActivityType = (status: string): 'upload' | 'approval' | 'rejection' | 'resubmit' => {
    switch (status) {
      case 'aprobado': return 'approval';
      case 'rechazado': return 'rejection';
      case 'pendiente': 
      case 'en_revision': return 'upload';
      default: return 'upload';
    }
  };

  // Helper: Obtener icono del estado
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'aprobado': return '✅';
      case 'rechazado': return '❌';
      case 'en_revision': return '🔍';
      case 'pendiente': return '⏳';
      default: return '📄';
    }
  };

  // Helper: Obtener color del estado
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'aprobado': return 'green';
      case 'rechazado': return 'red';
      case 'en_revision': return 'yellow';
      case 'pendiente': return 'gray';
      default: return 'gray';
    }
  };

  // Helper: Obtener icono de actividad
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'upload': return '📤';
      case 'approval': return '✅';
      case 'rejection': return '❌';
      case 'resubmit': return '🔄';
      default: return '📄';
    }
  };

  // Helper: Formatear fecha relativa
  const getRelativeTime = (date: string): string => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
    
    return uploadDate.toLocaleDateString('es-ES');
  };

  // Cargar al inicio
  useEffect(() => {
    loadDocuments();
  }, [refreshTrigger]);

  // LOADING STATE
  if (loading) {
    return (
      <div className="document-history-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
        <style>{documentHistoryStyles}</style>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="document-history-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <div className="error-message">{error}</div>
          <button className="retry-button" onClick={loadDocuments}>
            🔄 Reintentar
          </button>
        </div>
        <style>{documentHistoryStyles}</style>
      </div>
    );
  }

  return (
    <div className="document-history-container">
      {/* HEADER */}
      <div className="history-header">
        <div className="header-content">
          <h2>📚 Historial de Actividad</h2>
          <p>Timeline de versiones y cambios en tus documentos</p>
        </div>
        <div className="history-stats">
          <div className="stat-item">
            <span className="stat-number">{documents.length}</span>
            <span className="stat-label">Total documentos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{groupedDocuments.length}</span>
            <span className="stat-label">Fases activas</span>
          </div>
        </div>
      </div>

      {/* VIEW SELECTOR */}
      <div className="view-selector">
        <button 
          className={`view-button ${activeView === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveView('timeline')}
        >
          <span className="view-icon">🕒</span>
          Actividad Reciente
        </button>
        <button 
          className={`view-button ${activeView === 'versions' ? 'active' : ''}`}
          onClick={() => setActiveView('versions')}
        >
          <span className="view-icon">📊</span>
          Por Versiones
        </button>
      </div>

      {/* CONTENT */}
      {activeView === 'timeline' ? (
        /* ✅ VISTA TIMELINE - ACTIVIDAD RECIENTE */
        <div className="timeline-view">
          {recentActivity.length === 0 ? (
            <div className="empty-timeline">
              <div className="empty-icon">📭</div>
              <h3>No hay actividad reciente</h3>
              <p>Sube tu primer documento para ver el historial de actividad</p>
            </div>
          ) : (
            <div className="timeline-container">
              <h3 className="section-title">🕒 Actividad de los últimos 30 días</h3>
              
              <div className="timeline">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="timeline-item">
                    <div className="timeline-marker">
                      <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                    </div>
                    
                    <div className="timeline-content">
                      <div className="activity-header">
                        <span className="activity-title">
                          {activity.type === 'upload' && 'Documento subido'}
                          {activity.type === 'approval' && 'Documento aprobado'}
                          {activity.type === 'rejection' && 'Documento rechazado'}
                          {activity.type === 'resubmit' && 'Documento resubido'}
                        </span>
                        <span className="activity-time">{getRelativeTime(activity.date)}</span>
                      </div>
                      
                      <div className="activity-details">
                        <div className="activity-document">
                          📄 {activity.document}
                        </div>
                        <div className="activity-meta">
                          <span className="activity-phase">📂 {activity.phase}</span>
                          {activity.status && (
                            <span className={`activity-status ${getStatusColor(activity.status!)}`}>
                              {getStatusIcon(activity.status!)} {activity.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {index < recentActivity.length - 1 && (
                      <div className="timeline-connector"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ✅ VISTA VERSIONES - AGRUPADO POR FASE */
        <div className="versions-view">
          {groupedDocuments.length === 0 ? (
            <div className="empty-versions">
              <div className="empty-icon">📄</div>
              <h3>No hay documentos</h3>
              <p>Sube documentos para ver el historial de versiones por fase</p>
            </div>
          ) : (
            <div className="versions-container">
              <h3 className="section-title">📊 Documentos agrupados por fase</h3>
              
              {groupedDocuments.map((group) => (
                <div key={group.phase} className="version-group">
                  <div className="group-header">
                    <div className="group-info">
                      <h4 className="group-title">📂 {group.baseName}</h4>
                      <div className="group-meta">
                        <span className="version-count">{group.totalVersions} versión{group.totalVersions > 1 ? 'es' : ''}</span>
                        <span className={`group-status ${getStatusColor(group.latestStatus)}`}>
                          {getStatusIcon(group.latestStatus)} {group.latestStatus}
                        </span>
                      </div>
                    </div>
                    <div className="group-dates">
                      <div className="date-info">
                        <span className="date-label">Primer envío:</span>
                        <span className="date-value">{new Date(group.firstUpload).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="date-info">
                        <span className="date-label">Última actividad:</span>
                        <span className="date-value">{getRelativeTime(group.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="versions-list">
                    {group.versions.map((version, index) => (
                      <div key={version.id} className="version-item">
                        <div className="version-info">
                          <div className="version-header">
                            <span className="version-number">v{group.versions.length - index}</span>
                            <span className="version-name">{version.originalFileName}</span>
                            <span className={`version-status ${getStatusColor(version.status)}`}>
                              {getStatusIcon(version.status)} {version.status}
                            </span>
                          </div>
                          <div className="version-meta">
                            <span className="version-date">{getRelativeTime(version.uploadDate)}</span>
                            <span className="version-size">{version.fileSizeDisplay}</span>
                          </div>
                        </div>
                        
                        <div className="version-actions">
                          <button 
                            className="action-button view"
                            onClick={() => onViewDocument(version.id)}
                          >
                            👁️ Ver
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{documentHistoryStyles}</style>
    </div>
  );
};

export default DocumentHistory;