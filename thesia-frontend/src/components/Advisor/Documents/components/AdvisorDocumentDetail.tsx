import React, { useEffect, useState } from 'react';
import documentsService from '../../../../services/documentsService';
import advisorService from '../../../../services/advisorService';
import type { DocumentDetail as DocumentDetailType, Comment } from '../../../Documents/types/documents.types';
import { documentDetailStyles } from '../../../Documents/styles/DocumentDetail.styles';

interface AdvisorDocumentDetailProps {
  documentId: number;
  onBack: () => void;
  onApproved?: () => void;
  onRejected?: () => void;
}

const AdvisorDocumentDetail: React.FC<AdvisorDocumentDetailProps> = ({ documentId, onBack, onApproved, onRejected }) => {
  const [document, setDocument] = useState<DocumentDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await documentsService.getDocumentDetail(documentId);
      if (res.success) {
        setDocument(res.document);
      } else {
        setError(res.message || 'Error al cargar detalles');
      }
    } catch (e) {
      setError('Error de conexión al cargar detalles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [documentId]);

  const handleApprove = async () => {
    if (!document) return;
    try {
      setProcessing(true);
      const res = await advisorService.approveDocument(document.id);
      if (res.success) {
        onApproved?.();
        onBack();
      } else {
        alert(res.message || 'No se pudo aprobar');
      }
    } catch (e) {
      alert('Error de conexión al aprobar');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!document) return;
    try {
      setProcessing(true);
      const res = await advisorService.rejectDocument(document.id);
      if (res.success) {
        onRejected?.();
        onBack();
      } else {
        alert(res.message || 'No se pudo rechazar');
      }
    } catch (e) {
      alert('Error de conexión al rechazar');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    try {
      setDownloading(true);
  const blob = await documentsService.downloadDocument(document.id);
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = (document as any).originalFileName || (document as any).fileName || 'documento.pdf';
  window.document.body.appendChild(a);
  a.click();
  window.document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Error al descargar');
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'aprobado': return 'green';
      case 'en_revision': return 'yellow';
      case 'rechazado': return 'red';
      case 'pendiente':
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'aprobado': return 'Aprobado';
      case 'en_revision': return 'En Revisión';
      case 'rechazado': return 'Rechazado';
      case 'pendiente': return 'Pendiente';
      default: return status;
    }
  };

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

  if (error || !document) {
    return (
      <div className="document-detail-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <div className="error-message">{error || 'Documento no encontrado'}</div>
          <div className="error-actions">
            <button className="back-button" onClick={onBack}>Volver</button>
          </div>
        </div>
        <style>{documentDetailStyles}</style>
      </div>
    );
  }

  return (
    <div className="document-detail-container">
      <div className="detail-header">
        <div className="header-navigation">
          <button className="back-button" onClick={onBack}>← Volver</button>
          <div className="header-actions">
            <button className="action-button secondary" onClick={handleDownload} disabled={downloading}>
              {downloading ? 'Descargando...' : 'Descargar'}
            </button>
            <button className="action-button primary" onClick={handleApprove} disabled={processing}>
              {processing ? 'Procesando...' : 'Aprobar'}
            </button>
            <button className="action-button danger" onClick={handleReject} disabled={processing}>
              {processing ? 'Procesando...' : 'Rechazar'}
            </button>
          </div>
        </div>
      </div>

      <div className="document-info-card">
        <div className="document-header">
          <div className="document-title">
            <span className="file-icon">📄</span>
            <div className="title-content">
              <h1>{document.originalFileName}</h1>
              <div className="subtitle">{getPhaseText(document.phase)}</div>
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
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
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
              <span className="metadata-value">{getStatusText(document.status)}</span>
            </div>
          </div>

          {document.description && (
            <div className="document-description">
              <h3>Descripción</h3>
              <p>{document.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="comments-section">
        <div className="comments-header">
          <h2>Comentarios</h2>
          <div className="comments-count">{document.comments.length} comentario{document.comments.length !== 1 ? 's' : ''}</div>
        </div>
        {document.comments.length === 0 ? (
          <div className="no-comments">
            <div className="no-comments-icon">💭</div>
            <h3>Sin comentarios aún</h3>
            <p>Este documento no tiene comentarios.</p>
          </div>
        ) : (
          <div className="comments-list">
            {document.comments.map((comment: Comment, index: number) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-author">
                    <div className="author-avatar">{comment.advisorName.charAt(0).toUpperCase()}</div>
                    <div className="author-info">
                      <div className="author-name">{comment.advisorName}</div>
                      <div className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="comment-number">#{index + 1}</div>
                </div>
                <div className="comment-content"><p>{comment.comment}</p></div>
              </div>
            ))}
          </div>
        )}
        {/* Formulario de nuevo comentario */}
        <div className="document-card" style={{ marginTop: 16 }}>
          <h3>Agregar comentario</h3>
          <CommentForm documentId={document.id} onAdded={loadDetail} />
        </div>
      </div>

      <style>{documentDetailStyles}</style>
    </div>
  );
};

const CommentForm: React.FC<{ documentId: number; onAdded: () => void }> = ({ documentId, onAdded }) => {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!text.trim()) return;
    try {
      setSaving(true);
      await advisorService.commentOnDocument(documentId, text.trim());
      setText('');
      onAdded();
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd' }}
        placeholder="Escribe tu comentario..."
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button className="action-button primary" onClick={save} disabled={saving || !text.trim()}>
          {saving ? 'Guardando...' : 'Guardar comentario'}
        </button>
      </div>
    </div>
  );
};

export default AdvisorDocumentDetail;