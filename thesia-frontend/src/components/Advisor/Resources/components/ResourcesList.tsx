import React, { useEffect, useState, useRef } from 'react';
import documentsService from '../../../../services/documentsService';
import type { AdvisorResource, UploadGuideForm } from '../types/resource.types';
import '../styles/ResourcesList.styles.css';
// Reutilizamos estilos globales de tarjetas/botones del dashboard para unificar diseño
import { dashboardStyles } from '../../../Dashboard/Dashboard.styles';

const phaseOptions = [
  { value: 'general', label: 'General (todas las fases)' },
  { value: 'fase_1_plan_proyecto', label: 'Fase 1 - Plan de Proyecto' },
  { value: 'fase_2_diagnostico', label: 'Fase 2 - Diagnóstico' },
  { value: 'fase_3_marco_teorico', label: 'Fase 3 - Marco Teórico' },
  { value: 'fase_4_desarrollo', label: 'Fase 4 - Desarrollo' },
  { value: 'fase_5_resultados', label: 'Fase 5 - Resultados' },
];

const ResourcesList: React.FC = () => {
  const [guides, setGuides] = useState<AdvisorResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState<UploadGuideForm>({ file: null, description: '', phase: 'general' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await documentsService.getMyUploadedGuides();
      if (res.success) {
        setGuides(res.guides.sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
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
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setUploadForm(prev => ({ ...prev, file: f }));
    }
  };

  const formatSize = (size: number) => {
    if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
    if (size > 1024) return (size / 1024).toFixed(1) + ' KB';
    return size + ' B';
  };

  const downloadGuide = async (id: number, fileName: string) => {
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

  const submitGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) return;
    try {
      setUploading(true);
      setSuccessMsg(null);
      const res = await documentsService.uploadGuide({ file: uploadForm.file, description: uploadForm.description, phase: uploadForm.phase === 'general' ? undefined : uploadForm.phase });
      if (res.success) {
        setSuccessMsg('Guía subida correctamente');
        setUploadForm({ file: null, description: '', phase: 'general' });
        if (fileInputRef.current) fileInputRef.current.value='';
        await loadGuides();
      } else {
        setError(res.message);
      }
    } catch (e:any) {
      setError(e.message || 'Error subiendo guía');
    } finally {
      setUploading(false);
    }
  };

  const deleteGuide = async (id: number) => {
    if (!confirm('¿Eliminar esta guía definitivamente?')) return;
    const res = await documentsService.deleteGuide(id);
    if (res.success) {
      setGuides(g => g.filter(x => x.id !== id));
    } else {
      setError(res.message);
    }
  };

  const toggleGuide = async (id: number, active: boolean) => {
    const res = await documentsService.toggleGuideStatus(id, !active);
    if (res.success) {
      setGuides(g => g.map(x => x.id === id ? { ...x, active: !active } : x));
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="resources-page content-section">
      <div className="resources-header">
        <div>
          <h2 className="resources-title">📚 Recursos y Guías</h2>
          <p className="resources-subtitle">Sube plantillas o ejemplos para tus estudiantes. Ellos verán solo las guías activas de su asesor.</p>
        </div>
      </div>

      <div className="resources-layout">
        {/* Panel de subida */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Subir nueva guía</h3>
            <span className="card-icon" aria-hidden>📤</span>
          </div>
          <div className="card-content">
          <form onSubmit={submitGuide} className="upload-form-guides">
            <div className="form-row">
              <label className="form-label">Archivo (PDF / DOC / DOCX)</label>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              {uploadForm.file && <div className="file-chip">{uploadForm.file.name} • {formatSize(uploadForm.file.size)}</div>}
            </div>
            <div className="form-row">
              <label className="form-label">Descripción (opcional)</label>
              <textarea maxLength={300} value={uploadForm.description} onChange={e=>setUploadForm(p=>({...p, description:e.target.value}))} placeholder="Explica brevemente el contenido o propósito" />
              <div className="char-count">{uploadForm.description.length}/300</div>
            </div>
            <div className="form-row">
              <label className="form-label">Fase aplicable</label>
              <select value={uploadForm.phase} onChange={e=>setUploadForm(p=>({...p, phase:e.target.value}))}>
                {phaseOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <button type="submit" className="retry-button" disabled={uploading || !uploadForm.file}>
              {uploading ? 'Subiendo...' : 'Subir Guía'}
            </button>
            {successMsg && <div className="success-inline">✅ {successMsg}</div>}
          </form>
          <div className="help-box">
            <strong>Consejos:</strong>
            <ul>
              <li>Sube plantillas limpias y actualizadas.</li>
              <li>Desactiva (en vez de borrar) guías que ya no quieras mostrar.</li>
              <li>Usa la fase para guías específicas; deja "General" para material transversal.</li>
            </ul>
          </div>
          </div>
        </div>

        {/* Lista de guías */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Mis guías subidas</h3>
            <span className="card-icon" aria-hidden>📚</span>
          </div>
          <div className="card-content">
          {loading && <div className="loading-box">Cargando guías...</div>}
          {error && <div className="error-box">❌ {error}</div>}
          {!loading && guides.length === 0 && !error && (
            <div className="empty-box">No has subido guías todavía.</div>
          )}
          <div className="guides-list">
            {guides.map(g => (
              <div key={g.id} className={`guide-card ${!g.active ? 'inactive' : ''}`}>
                <div className="guide-main">
                  <div className="guide-file">📄 {g.fileName}</div>
                  <div className="guide-meta">
                    <span>{g.phase || 'general'}</span>
                    <span>{new Date(g.uploadDate).toLocaleDateString()}</span>
                    <span className={g.active ? 'badge-active' : 'badge-inactive'}>{g.active ? 'Activa' : 'Inactiva'}</span>
                  </div>
                  {g.description && <div className="guide-desc">{g.description}</div>}
                </div>
                <div className="guide-actions">
                  <button onClick={()=>downloadGuide(g.id, g.fileName)} className="action-btn" title="Descargar">⬇️</button>
                  <button onClick={()=>toggleGuide(g.id, g.active)} className="action-btn" title={g.active ? 'Desactivar' : 'Activar'}>{g.active ? '🚫' : '✅'}</button>
                  <button onClick={()=>deleteGuide(g.id)} className="action-btn delete" title="Eliminar">🗑️</button>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
      {/* Inyectamos estilos del dashboard para unificar tipografías, tarjetas y botones */}
      <style>{dashboardStyles}</style>
    </div>
  );
};

export default ResourcesList;
