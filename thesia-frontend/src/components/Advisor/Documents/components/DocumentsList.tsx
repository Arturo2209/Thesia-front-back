


import React, { useEffect, useMemo, useState } from 'react';
import type { AdvisorDocument } from '../types/document.types';
import advisorService from '../../../../services/advisorService';
import '../styles/DocumentsList.styles.css';
import { myDocumentsStyles } from '../../../Documents/styles/MyDocuments.styles';

const DocumentsList: React.FC = () => {
  // (Usamos clases status-badge del estilo compartido)
  // Estados principales
  const [documents, setDocuments] = useState<AdvisorDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [phase, setPhase] = useState<string | 'all'>('all');
  const [selectedDoc, setSelectedDoc] = useState<AdvisorDocument | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<{type: 'accept'|'reject', doc: AdvisorDocument}|null>(null);

  useEffect(() => {
    setLoading(true);
    advisorService.getPendingDocuments().then(docs => {
      setDocuments(docs);
      setLoading(false);
    });
  }, []);

  const handleSelect = (doc: AdvisorDocument) => {
    setSelectedDoc(doc);
    setComment(doc.comentarios || '');
    setMessage('');
  };

  const handleComment = async () => {
    if (!selectedDoc) return;
    setSubmitting(true);
    const res = await advisorService.commentOnDocument(selectedDoc.id, comment);
    setMessage(res.message);
    setSubmitting(false);
    advisorService.getPendingDocuments().then(docs => setDocuments(docs));
  };

  const handleAccept = (doc: AdvisorDocument) => setConfirmAction({type: 'accept', doc});
  const handleReject = (doc: AdvisorDocument) => setConfirmAction({type: 'reject', doc});

  const doAction = async () => {
    if (!confirmAction) return;
    setActionLoading(confirmAction.doc.id);
    setActionMessage('');
    let res;
    if (confirmAction.type === 'accept') {
      res = await advisorService.acceptDocument(confirmAction.doc.id);
    } else {
      res = await advisorService.rejectDocument(confirmAction.doc.id);
    }
    setActionMessage(res.message);
    setActionLoading(null);
    setConfirmAction(null);
    advisorService.getPendingDocuments().then(docs => setDocuments(docs));
  };

  const phases = useMemo(() => {
    const set = new Set<string>();
    documents.forEach(d => { if (d.phase) set.add(d.phase); });
    return Array.from(set);
  }, [documents]);

  const filtered = useMemo(() => {
    return documents.filter(d => {
      const matchSearch = search ? (`${d.title} ${d.student} ${d.description || ''}`).toLowerCase().includes(search.toLowerCase()) : true;
      const matchPhase = phase === 'all' ? true : d.phase === phase;
      return matchSearch && matchPhase;
    });
  }, [documents, search, phase]);

  const statusClass = (s: AdvisorDocument['status']) => {
    switch (s) {
      case 'aprobado': return 'green';
      case 'rechazado': return 'red';
      case 'en_revision': return 'yellow';
      case 'pendiente':
      default: return 'gray';
    }
  };

  // UI mejorada con colores, confirmaciones y feedback visual
  return (
    <div className="documents-list-container">
      {/* Header + filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ margin: 0 }}>📥 Por revisar</h3>
          <span style={{ background: 'rgba(25,118,210,0.1)', color: '#1976d2', padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>
            {filtered.length} pendiente{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, maxWidth: 520, justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <span>🔎</span>
            <input
              placeholder="Buscar por título o estudiante"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }}
            />
          </div>
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value as any)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }}
          >
            <option value="all">Todas las fases</option>
            {phases.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner"></div><p>Cargando documentos...</p></div>
      ) : (
        <ul className="documents-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.map(doc => (
            <li key={doc.id} className="document-card">
              <div className="document-info">
                <div className="document-header">
                  <div className="document-name">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{doc.title}</span>
                  </div>
                  <div className={`status-badge ${statusClass(doc.status)}`}>{doc.status}</div>
                </div>
                <div className="document-meta">
                  <div className="meta-item"><span className="meta-label">Estudiante:</span><span className="meta-value">{doc.student}</span></div>
                  {doc.phase && <div className="meta-item"><span className="meta-label">Fase:</span><span className="meta-value">{doc.phase}</span></div>}
                  <div className="meta-item"><span className="meta-label">Enviado:</span><span className="meta-value">{doc.submittedAt}</span></div>
                </div>
                {doc.comentarios && (
                  <div className="comment-preview">
                    <div className="comment-header"><span className="comment-icon">💬</span><span className="comment-author">Asesor</span></div>
                    <p className="comment-text">{doc.comentarios}</p>
                  </div>
                )}
              </div>
              <div className="document-actions">
                <button className="action-button secondary" onClick={() => handleSelect(doc)}>💬 Comentar</button>
                <button className="action-button primary" onClick={() => handleAccept(doc)} disabled={actionLoading === doc.id}>
                  {actionLoading === doc.id && confirmAction?.type === 'accept' ? 'Aceptando...' : '✅ Aprobar'}
                </button>
                <button className="action-button danger" onClick={() => handleReject(doc)} disabled={actionLoading === doc.id}>
                  {actionLoading === doc.id && confirmAction?.type === 'reject' ? 'Rechazando...' : '❌ Rechazar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

  {/* Modal de comentario */}
      {selectedDoc && (
        <div className="comment-modal" style={{background:'#fff',border:'1px solid #ccc',padding:16,marginTop:16, borderRadius:8, boxShadow:'0 2px 8px #0001'}}>
          <h3>Agregar/Editar comentario</h3>
          <div><strong>{selectedDoc.title}</strong> - {selectedDoc.student}</div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            style={{width:'100%',marginTop:8}}
            placeholder="Escribe tu comentario..."
          />
          <div style={{marginTop:8}}>
            <button onClick={handleComment} disabled={submitting} style={{background:'#1976d2',color:'#fff'}}>
              {submitting ? 'Guardando...' : 'Guardar comentario'}
            </button>
            <button onClick={() => { setSelectedDoc(null); setMessage(''); }} style={{marginLeft:8}}>Cancelar</button>
          </div>
          {message && <div style={{marginTop:8,color:'green'}}>{message}</div>}
        </div>
      )}

      {/* Modal de confirmación para aceptar/rechazar */}
      {confirmAction && (
        <div className="comment-modal" style={{background:'#fff',border:'2px solid #1976d2',padding:20,marginTop:16, borderRadius:8, boxShadow:'0 2px 8px #0002'}}>
          <h3>{confirmAction.type === 'accept' ? 'Confirmar aceptación' : 'Confirmar rechazo'}</h3>
          <div>¿Estás seguro que deseas <b>{confirmAction.type === 'accept' ? 'aceptar' : 'rechazar'}</b> el avance <b>{confirmAction.doc.title}</b> de <b>{confirmAction.doc.student}</b>?</div>
          <div style={{marginTop:12}}>
            <button onClick={doAction} disabled={actionLoading === confirmAction.doc.id} className={`action-button ${confirmAction.type === 'accept' ? 'primary' : 'danger'}`}>
              {actionLoading === confirmAction.doc.id ? (confirmAction.type === 'accept' ? 'Aceptando...' : 'Rechazando...') : 'Sí, confirmar'}
            </button>
            <button onClick={() => setConfirmAction(null)} style={{marginLeft:8}}>Cancelar</button>
          </div>
          {actionMessage && <div style={{marginTop:8, color:'#1976d2'}}>{actionMessage}</div>}
        </div>
      )}
      <style>{myDocumentsStyles}</style>
    </div>
  );
};

export default DocumentsList;
