import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import advisorService from '../../../../services/advisorService';
import type { AdvisorDocument } from '../types/document.types';
import { myDocumentsStyles } from '../../../Documents/styles/MyDocuments.styles';
import documentsService from '../../../../services/documentsService';

interface Props {
  studentId?: number;
  student: string;
  onBack: () => void;
  hideBackButton?: boolean;
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

const StudentPendingDetail: React.FC<Props> = ({ studentId, student, onBack, hideBackButton }) => {
  const [docs, setDocs] = useState<AdvisorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filtros estilo estudiante
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AdvisorDocument['status'] | 'all'>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await advisorService.getPendingDocuments();
      const filtered = all.filter(d => (studentId ? d.studentId === studentId : d.student === student));
      setDocs(filtered);
      setLoading(false);
    })();
  }, [studentId, student]);

  // Approve/Reject and comment actions se realizan en el detalle

  // const phases = useMemo(() => Array.from(new Set(docs.map(d => d.phase))).filter(Boolean) as string[], [docs]);

  // Opciones de filtros calculadas
  const phaseOptions = useMemo(() => {
    const set = new Set<string>();
    docs.forEach(d => { if (d.phase) set.add(d.phase); });
    return Array.from(set);
  }, [docs]);

  const filteredDocs = useMemo(() => {
    return docs.filter(d => {
      const matchSearch = searchTerm
        ? `${d.title} ${d.student} ${d.description ?? ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      const matchPhase = phaseFilter === 'all' ? true : d.phase === phaseFilter;
      const matchStatus = statusFilter === 'all' ? true : d.status === statusFilter;
      return matchSearch && matchPhase && matchStatus;
    });
  }, [docs, searchTerm, phaseFilter, statusFilter]);

  // Descargar documento como en vista estudiante
  const handleDownload = async (document: AdvisorDocument) => {
    try {
      const blob = await documentsService.downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      // Nombre de archivo de respaldo usando title si no hay nombre original disponible
      link.download = (document.title && /\.[a-zA-Z0-9]+$/.test(document.title)) ? document.title : `${document.title || 'documento'}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Silenciar error en UI por ahora; se puede mejorar con toast
      // console.error('Error al descargar documento:', error);
    }
  };

  return (
    <div className="my-documents-container">
      <div className="documents-header">
        <div className="header-content">
          {!hideBackButton && (
            <button className="action-button secondary" onClick={onBack} style={{ marginBottom: 8 }}>
              ← Volver
            </button>
          )}
          <h2>📁 Documentos de {student}</h2>
          <p>Revisa, comenta, aprueba o rechaza por cada entrega</p>
        </div>
        <div className="documents-count">
          <span className="count-number">{docs.length}</span>
          <span className="count-label">pendiente{docs.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Búsqueda y filtros para esta lista del estudiante */}
      <div className="search-filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre de archivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Fase:</label>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value as any)}
            >
              <option value="all">Todas las fases</option>
              {phaseOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Estado:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AdvisorDocument['status'] | 'all')}
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

  <div className="documents-list">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Cargando...</p></div>
        ) : filteredDocs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Sin pendientes</h3>
            <p>{searchTerm || phaseFilter !== 'all' || statusFilter !== 'all' ? 'No se encontraron documentos con los filtros aplicados' : 'Este estudiante no tiene documentos por revisar'}</p>
          </div>
        ) : (
          filteredDocs.map((document) => (
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
                <button className="action-button primary" onClick={() => navigate(`/advisor/documents/${document.id}?studentId=${studentId || ''}&student=${encodeURIComponent(student)}`)}>
                  <span className="button-icon">👁️</span>
                  Ver Detalles
                </button>
                <button className="action-button secondary" onClick={() => handleDownload(document)}>
                  <span className="button-icon">📥</span>
                  Descargar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Los comentarios y acciones se gestionan en la vista de detalle */}

      <style>{myDocumentsStyles}</style>
    </div>
  );
};

export default StudentPendingDetail;
