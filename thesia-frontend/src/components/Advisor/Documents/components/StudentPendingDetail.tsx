import React, { useEffect, useState } from 'react';
import advisorService from '../../../../services/advisorService';
import type { AdvisorDocument } from '../types/document.types';
import { myDocumentsStyles } from '../../../Documents/styles/MyDocuments.styles';

interface Props {
  studentId?: number;
  student: string;
  onBack: () => void;
}

const statusClass = (s: AdvisorDocument['status']) => {
  switch (s) {
    case 'aprobado': return 'green';
    case 'rechazado': return 'red';
    case 'en_revision': return 'yellow';
    case 'pendiente':
    default: return 'gray';
  }
};

const StudentPendingDetail: React.FC<Props> = ({ studentId, student, onBack }) => {
  const [docs, setDocs] = useState<AdvisorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdvisorDocument | null>(null);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await advisorService.getPendingDocuments();
      const filtered = all.filter(d => (studentId ? d.studentId === studentId : d.student === student));
      setDocs(filtered);
      setLoading(false);
    })();
  }, [studentId, student]);

  const handleApprove = async (doc: AdvisorDocument) => {
    await advisorService.approveDocument(doc.id);
    setDocs(prev => prev.filter(d => d.id !== doc.id));
  };

  const handleReject = async (doc: AdvisorDocument) => {
    await advisorService.rejectDocument(doc.id);
    setDocs(prev => prev.filter(d => d.id !== doc.id));
  };

  const handleSaveComment = async () => {
    if (!selected) return;
    setSaving(true);
    await advisorService.commentOnDocument(selected.id, comment);
    setSaving(false);
    setSelected(null);
    setComment('');
  };

  // const phases = useMemo(() => Array.from(new Set(docs.map(d => d.phase))).filter(Boolean) as string[], [docs]);

  return (
    <div className="my-documents-container">
      <div className="documents-header">
        <div className="header-content">
          <button className="action-button secondary" onClick={onBack} style={{ marginBottom: 8 }}>
            ← Volver
          </button>
          <h2>📁 Documentos de {student}</h2>
          <p>Revisa, comenta, aprueba o rechaza por cada entrega</p>
        </div>
        <div className="documents-count">
          <span className="count-number">{docs.length}</span>
          <span className="count-label">pendiente{docs.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="documents-list">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Cargando...</p></div>
        ) : docs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Sin pendientes</h3>
            <p>Este estudiante no tiene documentos por revisar</p>
          </div>
        ) : (
          docs.map((document) => (
            <div key={document.id} className="document-card">
              <div className="document-info">
                <div className="document-header">
                  <div className="document-name">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{document.title}</span>
                  </div>
                  <div className={`status-badge ${statusClass(document.status)}`}>
                    {document.status}
                  </div>
                </div>

                <div className="document-meta">
                  <div className="meta-item">
                    <span className="meta-label">Fase:</span>
                    <span className="meta-value">{document.phase || 'N/A'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Subido:</span>
                    <span className="meta-value">{document.submittedAt}</span>
                  </div>
                </div>

                {document.comentarios && (
                  <div className="comment-preview">
                    <div className="comment-header">
                      <span className="comment-icon">💬</span>
                      <span className="comment-author">Asesor</span>
                    </div>
                    <p className="comment-text">{document.comentarios}</p>
                  </div>
                )}
              </div>

              <div className="document-actions">
                <button 
                  className="action-button secondary"
                  onClick={() => { setSelected(document); setComment(document.comentarios || ''); }}
                >
                  <span className="button-icon">💬</span>
                  Comentar
                </button>
                <button className="action-button primary" onClick={() => handleApprove(document)}>
                  <span className="button-icon">✅</span>
                  Aprobar
                </button>
                <button className="action-button danger" onClick={() => handleReject(document)}>
                  <span className="button-icon">❌</span>
                  Rechazar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="document-card" style={{ border: '1px solid #1976d266' }}>
          <h3>💬 Agregar/Editar comentario</h3>
          <div style={{ margin: '8px 0' }}><strong>{selected.title}</strong></div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd' }}
            placeholder="Escribe tu comentario..."
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button className="action-button primary" onClick={handleSaveComment} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar comentario'}
            </button>
            <button className="action-button" onClick={() => { setSelected(null); setComment(''); }}>Cancelar</button>
          </div>
        </div>
      )}

      <style>{myDocumentsStyles}</style>
    </div>
  );
};

export default StudentPendingDetail;
