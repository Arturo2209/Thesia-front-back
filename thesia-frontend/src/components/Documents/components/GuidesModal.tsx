import React, { useEffect, useState } from 'react';
import documentsService from '../../../services/documentsService';
// Declarar módulo para TypeScript si hay error de declaración implícita
// (workaround rápido sin crear .d.ts separado)
declare module './GuidesModal';

interface GuidesModalProps {
  onClose: () => void;
  currentPhase?: string;
}

interface StudentGuide {
  id: number;
  fileName: string;
  title?: string;
  description?: string;
  phase?: string;
  uploadDate: string;
  uploadedBy?: string;
}

const GuidesModal: React.FC<GuidesModalProps> = ({ onClose, currentPhase }) => {
  const [guides, setGuides] = useState<StudentGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await documentsService.getMyGuides();
      if (res.success) {
        let list = res.guides.map(g => ({
          id: g.id,
            fileName: g.fileName,
            title: g.title,
            description: g.description,
            phase: g.phase,
            uploadDate: g.uploadDate,
            uploadedBy: g.uploadedBy
        }));
        // Filtrar por fase actual si existe y no es general
        if (currentPhase) {
          list = list.filter(g => !g.phase || g.phase === 'general' || g.phase === currentPhase);
        }
        setGuides(list.sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
      } else {
        setError(res.message || 'No se pudieron obtener las guías');
      }
    } catch (e:any) {
      setError(e.message || 'Error cargando guías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuides();
  }, [currentPhase]);

  const download = async (id: number, fileName: string) => {
    try {
      const blob = await documentsService.downloadGuide(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e:any) {
      setError('Error descargando guía');
    }
  };

  return (
    <div className="guides-modal-overlay">
      <div className="guides-modal">
        <div className="guides-modal-header">
          <h3>Guías / Recursos</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="guides-modal-content">
          {loading && <div className="no-guides"><div className="no-guides-icon">⏳</div>Cargando guías...</div>}
          {error && <div className="no-guides" style={{color:'#991b1b'}}><div className="no-guides-icon">❌</div>{error}</div>}
          {!loading && !error && guides.length === 0 && (
            <div className="no-guides">
              <div className="no-guides-icon">📭</div>
              <h4>No hay guías disponibles</h4>
              <p>Tu asesor aún no ha publicado recursos para esta fase. Vuelve a revisar más tarde.</p>
            </div>
          )}
          {guides.length > 0 && (
            <div className="guides-list">
              {guides.map(g => (
                <div key={g.id} className="guide-item">
                  <div className="guide-icon">📄</div>
                  <div className="guide-info">
                    <h4 title={g.fileName}>{g.fileName}</h4>
                    {g.description && <p>{g.description}</p>}
                    <div className="guide-meta">
                      <span>{g.phase || 'general'}</span>
                      <span>{new Date(g.uploadDate).toLocaleDateString()}</span>
                      {g.uploadedBy && <span>Asesor: {g.uploadedBy}</span>}
                    </div>
                  </div>
                  <button className="download-guide-btn" onClick={() => download(g.id, g.fileName)}>Descargar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidesModal;