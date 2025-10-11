import React, { useState, useEffect } from 'react';
import documentsService from '../../../services/documentsService';
import type { 
  Document, 
  DocumentFilters, 
  ThesisPhase, 
  DocumentStatus 
} from '../types/documents.types';
import { myDocumentsStyles } from '../styles/MyDocuments.styles';

interface MyDocumentsProps {
  onViewDocument: (documentId: number) => void;
  refreshTrigger: number;
  onRefresh: () => void;
}

const MyDocuments: React.FC<MyDocumentsProps> = ({ 
  onViewDocument, 
  refreshTrigger, 
  onRefresh
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<ThesisPhase | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');

  // Cargar documentos CON loading state (para carga inicial)
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📄 === CARGANDO DOCUMENTOS (INICIAL) ===');
      console.log('Estados de filtro actuales:', { searchTerm, phaseFilter, statusFilter });

      const filters: DocumentFilters = {};
      
      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
        console.log('🔍 Aplicando búsqueda:', filters.searchTerm);
      }
      
      if (phaseFilter !== 'all') {
        filters.phase = phaseFilter;
        console.log('📂 Aplicando filtro de fase:', filters.phase);
      }
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
        console.log('📊 Aplicando filtro de estado:', filters.status);
      }
      
      console.log('📋 Filtros finales enviados:', filters);

      const response = await documentsService.getMyDocuments(filters);
      
      if (response.success) {
        console.log('✅ Documentos cargados del servidor:', response.documents.length);
        console.log('📄 Documentos recibidos:', response.documents.map(d => ({ 
          id: d.id, 
          name: d.originalFileName, 
          phase: d.phase, 
          status: d.status 
        })));
        
        setDocuments(response.documents);
      } else {
        console.error('❌ Error del servidor:', response.message);
        setError(response.message || 'Error cargando documentos');
      }
      
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar documentos SIN cambiar loading state (mantiene foco)
  const loadDocumentsQuiet = async () => {
    try {
      setError(null);
      
      console.log('📄 === CARGANDO DOCUMENTOS (FILTROS) ===');
      console.log('Estados de filtro actuales:', { searchTerm, phaseFilter, statusFilter });

      const filters: DocumentFilters = {};
      
      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
        console.log('🔍 Aplicando búsqueda:', filters.searchTerm);
      }
      
      if (phaseFilter !== 'all') {
        filters.phase = phaseFilter;
        console.log('📂 Aplicando filtro de fase:', filters.phase);
      }
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
        console.log('📊 Aplicando filtro de estado:', filters.status);
      }
      
      console.log('📋 Filtros finales enviados:', filters);

      const response = await documentsService.getMyDocuments(filters);
      
      if (response.success) {
        console.log('✅ Documentos filtrados del servidor:', response.documents.length);
        console.log('📄 Documentos recibidos:', response.documents.map(d => ({ 
          id: d.id, 
          name: d.originalFileName, 
          phase: d.phase, 
          status: d.status 
        })));
        
        setDocuments(response.documents);
      } else {
        console.error('❌ Error del servidor:', response.message);
        setError(response.message || 'Error cargando documentos');
      }
      
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    }
  };

  // Effect para carga inicial (CON loading state)
  useEffect(() => {
    console.log('🔄 useEffect refreshTrigger activado:', refreshTrigger);
    loadDocuments();
  }, [refreshTrigger]);

  // Effect para filtros (SIN loading state, mantiene foco)
  useEffect(() => {
    console.log('🔄 useEffect filtros activado:', { searchTerm, phaseFilter, statusFilter });
    
    const timeoutId = setTimeout(() => {
      console.log('⏱️ Debounce completado, cargando documentos...');
      loadDocumentsQuiet();
    }, 300);
    
    return () => {
      console.log('🔄 Limpiando timeout anterior');
      clearTimeout(timeoutId);
    };
  }, [searchTerm, phaseFilter, statusFilter]);

  // Obtener color del estado
  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'aprobado': return 'green';
      case 'en_revision': return 'yellow';
      case 'rechazado': return 'red';
      case 'pendiente': return 'gray';
      default: return 'gray';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: DocumentStatus) => {
    switch (status) {
      case 'aprobado': return 'Aprobado';
      case 'en_revision': return 'En Revisión';
      case 'rechazado': return 'Rechazado';
      case 'pendiente': return 'Pendiente';
      default: return status;
    }
  };

  // Obtener texto de la fase
  const getPhaseText = (phase: ThesisPhase) => {
    switch (phase) {
      case 'fase_1_plan_proyecto': return 'Fase 1: Plan de Proyecto';
      case 'fase_2_diagnostico': return 'Fase 2: Diagnóstico';
      case 'fase_3_marco_teorico': return 'Fase 3: Marco Teórico';
      case 'fase_4_desarrollo': return 'Fase 4: Desarrollo';
      case 'fase_5_resultados': return 'Fase 5: Resultados';
      default: return phase;
    }
  };

  // Manejar cambios de filtros con logging
  const handleSearchChange = (value: string) => {
    console.log('🔍 Búsqueda cambiada:', value);
    setSearchTerm(value);
  };

  const handlePhaseFilterChange = (value: ThesisPhase | 'all') => {
    console.log('📂 Filtro de fase cambiado:', value);
    setPhaseFilter(value);
  };

  const handleStatusFilterChange = (value: DocumentStatus | 'all') => {
    console.log('📊 Filtro de estado cambiado:', value);
    setStatusFilter(value);
  };

  // Descargar documento
  const handleDownload = async (document: Document) => {
    try {
      console.log('📥 Iniciando descarga:', document.originalFileName);
      
      const blob = await documentsService.downloadDocument(document.id);
      
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.originalFileName || document.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Descarga completada');
      
    } catch (error) {
      console.error('❌ Error descargando:', error);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="my-documents-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando documentos...</p>
        </div>
        <style>{myDocumentsStyles}</style>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="my-documents-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <div className="error-message">{error}</div>
          <button className="retry-button" onClick={loadDocuments}>
            🔄 Reintentar
          </button>
        </div>
        <style>{myDocumentsStyles}</style>
      </div>
    );
  }

  return (
    <div className="my-documents-container">
      {/* HEADER */}
      <div className="documents-header">
        <div className="header-content">
          <h2>📁 Mis Documentos</h2>
          <p>Gestiona tus documentos de tesis por fases</p>
        </div>
        <div className="documents-count">
          <span className="count-number">{documents.length}</span>
          <span className="count-label">
            {documents.length === 1 ? 'documento' : 'documentos'}
          </span>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="search-filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre de archivo..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            autoComplete="off"
          />
        </div>
        
        <div className="filters-row">
          <div className="filter-group">
            <label>Fase:</label>
            <select 
              value={phaseFilter} 
              onChange={(e) => handlePhaseFilterChange(e.target.value as ThesisPhase | 'all')}
            >
              <option value="all">Todas las fases</option>
              <option value="fase_1_plan_proyecto">Fase 1: Plan de Proyecto</option>
              <option value="fase_2_diagnostico">Fase 2: Diagnóstico</option>
              <option value="fase_3_marco_teorico">Fase 3: Marco Teórico</option>
              <option value="fase_4_desarrollo">Fase 4: Desarrollo</option>
              <option value="fase_5_resultados">Fase 5: Resultados</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Estado:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => handleStatusFilterChange(e.target.value as DocumentStatus | 'all')}
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_revision">En Revisión</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOCUMENTS LIST */}
      <div className="documents-list">
        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No hay documentos</h3>
            <p>
              {searchTerm || phaseFilter !== 'all' || statusFilter !== 'all'
                ? 'No se encontraron documentos con los filtros aplicados'
                : 'Aún no has subido ningún documento'
              }
            </p>
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.id} className="document-card">
              <div className="document-info">
                <div className="document-header">
                  <div className="document-name">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{document.originalFileName}</span>
                  </div>
                  <div className={`status-badge ${getStatusColor(document.status)}`}>
                    {getStatusText(document.status)}
                  </div>
                </div>
                
                <div className="document-meta">
                  <div className="meta-item">
                    <span className="meta-label">Fase:</span>
                    <span className="meta-value">{getPhaseText(document.phase)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Subido:</span>
                    <span className="meta-value">
                      {new Date(document.uploadDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Tamaño:</span>
                    <span className="meta-value">{document.fileSizeDisplay}</span>
                  </div>
                </div>

                {/* LATEST COMMENT PREVIEW */}
                {document.latestComment && (
                  <div className="comment-preview">
                    <div className="comment-header">
                      <span className="comment-icon">💬</span>
                      <span className="comment-author">{document.latestComment.advisorName}</span>
                    </div>
                    <p className="comment-text">
                      {document.latestComment.comment.length > 100 
                        ? `${document.latestComment.comment.substring(0, 100)}...`
                        : document.latestComment.comment
                      }
                    </p>
                  </div>
                )}
              </div>

              <div className="document-actions">
                <button 
                  className="action-button primary"
                  onClick={() => onViewDocument(document.id)}
                >
                  <span className="button-icon">👁️</span>
                  Ver Detalles
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => handleDownload(document)}
                >
                  <span className="button-icon">📥</span>
                  Descargar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{myDocumentsStyles}</style>
    </div>
  );
};

export default MyDocuments;