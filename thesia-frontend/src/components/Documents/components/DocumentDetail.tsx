import React, { useState, useEffect } from 'react';
import documentsService from '../../../services/documentsService';
import type { DocumentDetail as DocumentDetailType, Comment } from '../types/documents.types';
import { documentDetailStyles } from '../styles/DocumentDetail.styles';

interface DocumentDetailProps {
  documentId: number;
  onBack: () => void;
  onRefresh: () => void;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ 
  documentId, 
  onBack, 
  onRefresh 
}) => {
  const [document, setDocument] = useState<DocumentDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para acciones
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Cargar detalles del documento
  const loadDocumentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📖 === CARGANDO DETALLE DEL DOCUMENTO ===', documentId);
      
      const response = await documentsService.getDocumentDetail(documentId);
      
      if (response.success) {
        setDocument(response.document);
        console.log('✅ Detalle cargado:', response.document);
      } else {
        setError(response.message || 'Error cargando detalles');
      }
      
    } catch (error) {
      console.error('❌ Error cargando detalles:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    loadDocumentDetail();
  }, [documentId]);

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprobado': return 'green';
      case 'en_revision': return 'yellow';
      case 'rechazado': return 'red';
      case 'pendiente': return 'gray';
      default: return 'gray';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprobado': return 'Aprobado';
      case 'en_revision': return 'En Revisión';
      case 'rechazado': return 'Rechazado';
      case 'pendiente': return 'Pendiente';
      default: return status;
    }
  };

  // Obtener texto de la fase
  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'fase_1_plan_proyecto': return 'Fase 1: Plan de Proyecto';
      case 'fase_2_diagnostico': return 'Fase 2: Diagnóstico';
      case 'fase_3_marco_teorico': return 'Fase 3: Marco Teórico';
      case 'fase_4_desarrollo': return 'Fase 4: Desarrollo';
      case 'fase_5_resultados': return 'Fase 5: Resultados';
      default: return phase;
    }
  };

  // Descargar documento
  const handleDownload = async () => {
    if (!document) return;
    
    try {
      setDownloading(true);
      console.log('📥 Descargando documento:', document.fileName);
      
      const blob = await documentsService.downloadDocument(document.id);
      
      // Crear URL y descargar
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
      alert('Error al descargar el documento. Inténtalo de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  // ✅ FUNCIÓN ELIMINAR RESTAURADA Y MEJORADA
  const handleDelete = async () => {
    if (!document) return;
    
    // Verificar que solo se pueda eliminar documentos pendientes
    if (document.status !== 'pendiente') {
      alert('Solo se pueden eliminar documentos con estado "Pendiente".');
      return;
    }
    
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar "${document.originalFileName}"?\n\n` +
      'Esta acción no se puede deshacer y el archivo será eliminado permanentemente.'
    );
    
    if (!confirmed) return;
    
    try {
      setDeleting(true);
      console.log('🗑️ === ELIMINANDO DOCUMENTO ===', document.id);
      
      const response = await documentsService.deleteDocument(document.id);
      
      if (response.success) {
        console.log('✅ Documento eliminado exitosamente');
        
        // Mostrar confirmación
        alert('Documento eliminado exitosamente');
        
        // Refrescar la lista y volver
        onRefresh();
        onBack();
      } else {
        console.error('❌ Error del servidor:', response.message);
        alert(`Error al eliminar: ${response.message}`);
      }
      
    } catch (error) {
      console.error('❌ Error eliminando documento:', error);
      alert('Error de conexión al eliminar el documento. Inténtalo de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="document-detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando detalles del documento...</p>
        </div>
        <style>{documentDetailStyles}</style>
      </div>
    );
  }

  // ERROR STATE
  if (error || !document) {
    return (
      <div className="document-detail-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <div className="error-message">{error || 'Documento no encontrado'}</div>
          <div className="error-actions">
            <button className="retry-button" onClick={loadDocumentDetail}>
              🔄 Reintentar
            </button>
            <button className="back-button" onClick={onBack}>
              ← Volver
            </button>
          </div>
        </div>
        <style>{documentDetailStyles}</style>
      </div>
    );
  }

  return (
    <div className="document-detail-container">
      {/* HEADER CON BOTONES DE ACCIÓN */}
      <div className="detail-header">
        <div className="header-navigation">
          <button className="back-button" onClick={onBack}>
            ← Volver a Documentos
          </button>
          <div className="header-actions">
            {/* BOTÓN DESCARGAR */}
            <button 
              className="action-button secondary"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <span className="spinner-small"></span>
                  Descargando...
                </>
              ) : (
                <>
                  <span className="button-icon">📥</span>
                  Descargar
                </>
              )}
            </button>
            
            {/* ✅ BOTÓN ELIMINAR - SOLO PARA DOCUMENTOS PENDIENTES */}
            {document.status === 'pendiente' && (
              <button 
                className="action-button danger"
                onClick={handleDelete}
                disabled={deleting}
                title="Eliminar documento (solo disponible para documentos pendientes)"
              >
                {deleting ? (
                  <>
                    <span className="spinner-small"></span>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <span className="button-icon">🗑️</span>
                    Eliminar
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENT INFO */}
      <div className="document-info-card">
        <div className="document-header">
          <div className="document-title">
            <span className="file-icon">📄</span>
            <div className="title-content">
              <h1>{document.originalFileName}</h1>
              <div className="subtitle">
                {getPhaseText(document.phase)} • Capítulo {document.chapterNumber}
              </div>
            </div>
          </div>
          <div className={`status-badge ${getStatusColor(document.status)}`}>
            {getStatusText(document.status)}
          </div>
        </div>

        <div className="document-metadata">
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="metadata-label">Subido:</span>
              <span className="metadata-value">
                {new Date(document.uploadDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Tamaño:</span>
              <span className="metadata-value">{document.fileSizeDisplay}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Tipo:</span>
              <span className="metadata-value">{document.fileType}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Estado:</span>
              <span className="metadata-value">
                {getStatusText(document.status)}
                {document.status === 'pendiente' && ' (Puedes eliminar este documento)'}
              </span>
            </div>
            {document.lastModified && (
              <div className="metadata-item">
                <span className="metadata-label">Última modificación:</span>
                <span className="metadata-value">
                  {new Date(document.lastModified).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}
          </div>

          {document.description && (
            <div className="document-description">
              <h3>Descripción</h3>
              <p>{document.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className="comments-section">
        <div className="comments-header">
          <h2>💬 Comentarios del Asesor</h2>
          <div className="comments-count">
            {document.comments.length} comentario{document.comments.length !== 1 ? 's' : ''}
          </div>
        </div>

        {document.comments.length === 0 ? (
          <div className="no-comments">
            <div className="no-comments-icon">💭</div>
            <h3>Sin comentarios aún</h3>
            <p>
              {document.status === 'pendiente' 
                ? 'Tu documento está pendiente de revisión por parte del asesor.'
                : 'No hay comentarios disponibles para este documento.'
              }
            </p>
          </div>
        ) : (
          <div className="comments-list">
            {document.comments.map((comment: Comment, index: number) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-author">
                    <div className="author-avatar">
                      {comment.advisorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="author-info">
                      <div className="author-name">{comment.advisorName}</div>
                      <div className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="comment-number">#{index + 1}</div>
                </div>

                <div className="comment-content">
                  <p>{comment.comment}</p>
                </div>

                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="comment-attachments">
                    <h4>📎 Archivos adjuntos:</h4>
                    <div className="attachments-list">
                      {comment.attachments.map((attachment: string, attachIndex: number) => (
                        <div key={attachIndex} className="attachment-item">
                          <span className="attachment-icon">📄</span>
                          <span className="attachment-name">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIONS BASED ON STATUS */}
      {document.status === 'rechazado' && (
        <div className="status-actions">
          <div className="status-message rejected">
            <div className="status-icon">❌</div>
            <div className="status-content">
              <h3>Documento Rechazado</h3>
              <p>
                Tu documento ha sido rechazado por el asesor. 
                Revisa los comentarios y sube una nueva versión corregida.
              </p>
            </div>
          </div>
          <button className="action-button primary large">
            <span className="button-icon">🔄</span>
            Subir Nueva Versión
          </button>
        </div>
      )}

      {document.status === 'aprobado' && (
        <div className="status-actions">
          <div className="status-message approved">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h3>¡Documento Aprobado!</h3>
              <p>
                Felicidades, tu documento ha sido aprobado por el asesor. 
                Puedes proceder con la siguiente fase de tu tesis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MENSAJE INFORMATIVO PARA DOCUMENTOS PENDIENTES */}
      {document.status === 'pendiente' && (
        <div className="status-actions">
          <div className="status-message pending">
            <div className="status-icon">⏳</div>
            <div className="status-content">
              <h3>Documento Pendiente</h3>
              <p>
                Tu documento está esperando revisión del asesor. 
                Mientras tanto, puedes descargar o eliminar el documento si necesitas hacer cambios.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{documentDetailStyles}</style>
    </div>
  );
};

export default DocumentDetail;