


import React, { useEffect, useState } from 'react';
import type { AdvisorDocument } from '../types/document.types';
import advisorService from '../../../../services/advisorService';
import '../styles/DocumentsList.styles.css';

const DocumentsList: React.FC = () => {
  // Colores para los estados
  const statusColors: Record<string, string> = {
    pendiente: '#e0a800',
    en_revision: '#1976d2',
    aprobado: '#43a047',
    rechazado: '#e53935',
  };
  // Estados principales
  const [documents, setDocuments] = useState<AdvisorDocument[]>([]);
  const [loading, setLoading] = useState(false);
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

  // UI mejorada con colores, confirmaciones y feedback visual
  return (
    <div className="documents-list-container">
      <h2>Documentos Recibidos</h2>
      {loading ? (
        <div>Cargando documentos...</div>
      ) : (
        <ul className="documents-list">
          {documents.map(doc => (
            <li key={doc.id} className="document-item">
              <div className="document-title">{doc.title}</div>
              <div className="document-details">
                <span>Estudiante: {doc.student}</span>
                <span>
                  Estado: <span style={{color: statusColors[doc.status] || '#333', fontWeight:'bold'}}>{doc.status}</span>
                </span>
                <span>Fecha envío: {doc.submittedAt}</span>
                <span>Comentario: {doc.comentarios || <em>Sin comentario</em>}</span>
              </div>
              <button onClick={() => handleSelect(doc)} style={{marginTop:8, marginRight:8}}>Comentar</button>
              <button onClick={() => handleAccept(doc)} disabled={actionLoading === doc.id} style={{marginRight:8, background:'#43a047', color:'#fff'}}>
                {actionLoading === doc.id && confirmAction?.type === 'accept' ? 'Aceptando...' : 'Aceptar'}
              </button>
              <button onClick={() => handleReject(doc)} disabled={actionLoading === doc.id} style={{color:'#fff', background:'#e53935', marginRight:8}}>
                {actionLoading === doc.id && confirmAction?.type === 'reject' ? 'Rechazando...' : 'Rechazar'}
              </button>
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
            <button onClick={doAction} disabled={actionLoading === confirmAction.doc.id} style={{background: confirmAction.type === 'accept' ? '#43a047' : '#e53935', color:'#fff'}}>
              {actionLoading === confirmAction.doc.id ? (confirmAction.type === 'accept' ? 'Aceptando...' : 'Rechazando...') : 'Sí, confirmar'}
            </button>
            <button onClick={() => setConfirmAction(null)} style={{marginLeft:8}}>Cancelar</button>
          </div>
          {actionMessage && <div style={{marginTop:8, color:'#1976d2'}}>{actionMessage}</div>}
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
