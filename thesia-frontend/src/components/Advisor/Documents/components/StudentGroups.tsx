import React, { useEffect, useMemo, useState } from 'react';
import advisorService from '../../../../services/advisorService';
import type { AdvisorDocument } from '../types/document.types';
import { myDocumentsStyles } from '../../../Documents/styles/MyDocuments.styles';

interface StudentGroupsProps {
  onSelectStudent: (group: { studentId?: number; student: string }) => void;
}

const StudentGroups: React.FC<StudentGroupsProps> = ({ onSelectStudent }) => {
  const [docs, setDocs] = useState<AdvisorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await advisorService.getPendingDocuments();
      setDocs(data);
      setLoading(false);
    })();
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, { studentId?: number; student: string; items: AdvisorDocument[] }>();
    docs.forEach(d => {
      const key = `${d.studentId || ''}|${d.student}`;
      if (!map.has(key)) {
        map.set(key, { studentId: d.studentId, student: d.student || 'Estudiante', items: [] });
      }
      map.get(key)!.items.push(d);
    });
    let arr = Array.from(map.values());
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      arr = arr.filter(g => g.student.toLowerCase().includes(s));
    }
    // ordenar por cantidad desc
    arr.sort((a, b) => b.items.length - a.items.length);
    return arr;
  }, [docs, search]);

  if (loading) {
    return (
      <div className="my-documents-container">
        <div className="loading-container"><div className="spinner"></div><p>Cargando estudiantes...</p></div>
        <style>{myDocumentsStyles}</style>
      </div>
    );
  }

  return (
    <div className="my-documents-container">
      <div className="documents-header">
        <div className="header-content">
          <h2>👥 Estudiantes con documentos por revisar</h2>
          <p>Agrupados por estudiante para facilitar la revisión</p>
        </div>
        <div className="documents-count">
          <span className="count-number">{groups.length}</span>
          <span className="count-label">{groups.length === 1 ? 'estudiante' : 'estudiantes'}</span>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar estudiante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="documents-list">
        {groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Sin documentos pendientes</h3>
            <p>No hay estudiantes con documentos por revisar</p>
          </div>
        ) : (
          groups.map((g) => (
            <div key={(g.studentId || 'x') + g.student} className="document-card">
              <div className="document-info">
                <div className="document-header">
                  <div className="document-name">
                    <span className="file-icon">👤</span>
                    <span className="file-name">{g.student}</span>
                  </div>
                  <div className="status-badge yellow">{g.items.length} pendiente{g.items.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="document-meta">
                  <div className="meta-item">
                    <span className="meta-label">Fases:</span>
                    <span className="meta-value">{Array.from(new Set(g.items.map(i => i.phase))).filter(Boolean).join(', ') || 'N/A'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Último envío:</span>
                    <span className="meta-value">{g.items[0]?.submittedAt}</span>
                  </div>
                </div>
              </div>
              <div className="document-actions">
                <button className="action-button primary" onClick={() => onSelectStudent({ studentId: g.studentId, student: g.student })}>
                  <span className="button-icon">👁️</span>
                  Ver Detalles
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

export default StudentGroups;
