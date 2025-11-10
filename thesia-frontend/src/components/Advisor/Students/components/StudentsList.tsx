import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import advisorService from '../../../../services/advisorService';
import type { AdvisorStudent } from '../types/student.types';
import '../styles/StudentsList.styles.css';
import { myDocumentsStyles } from '../../../Documents/styles/MyDocuments.styles';

// TODO: Replace with shared card styles (documentsStyles) if needed

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<AdvisorStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');

  // Helpers de presentación
  const phaseLabelMap: Record<string, string> = {
    'fase_1_plan_proyecto': 'Fase 1 - Plan de proyecto',
    'fase_2_diagnostico': 'Fase 2 - Diagnóstico',
    'fase_3_marco_teorico': 'Fase 3 - Marco teórico',
    'fase_4_desarrollo': 'Fase 4 - Desarrollo',
    'fase_5_resultados': 'Fase 5 - Resultados',
    // posibles valores desde tesis.fase_actual
    'propuesta': 'Propuesta',
    'desarrollo': 'Desarrollo',
    'revision': 'Revisión',
    'sustentacion': 'Sustentación'
  };

  const formatPhase = (code?: string | null) => {
    if (!code) return 'Sin fase';
    return phaseLabelMap[code] || code;
  };

  const truncate = (text: string, maxLen: number) => {
    if (!text) return '';
    return text.length > maxLen ? text.slice(0, maxLen - 1) + '…' : text;
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await advisorService.getAssignedStudents();
        console.log('📊 Estudiantes obtenidos:', data); // Log para verificar los datos obtenidos
        setStudents(data);
      } catch (err) {
        console.error('❌ Error obteniendo estudiantes asignados:', err);
        setError('Error al cargar los estudiantes. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div>Cargando estudiantes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filtrar por búsqueda simple
  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.thesisTitle || '').toLowerCase().includes(q) ||
      (s.phase || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="my-documents-container">
      <div className="documents-header">
        <div className="header-content">
          <h2>👨‍🎓 Estudiantes Asignados</h2>
          <p>Listado de estudiantes bajo tu asesoría. Usa la búsqueda para filtrar.</p>
        </div>
        <div className="documents-count">
          <span className="count-number">{filtered.length}</span>
          <span className="count-label">{filtered.length === 1 ? 'estudiante' : 'estudiantes'}</span>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, correo, tesis o fase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="documents-list">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Cargando estudiantes...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Sin resultados</h3>
            <p>{search ? 'No se encontraron estudiantes con la búsqueda aplicada' : 'No tienes estudiantes asignados aún.'}</p>
          </div>
        ) : (
          filtered.map(student => (
            <div key={student.id} className="document-card">
              <div className="document-info">
                <div className="document-header">
                  <div className="document-name" style={{alignItems:'center'}}>
                    <span className="file-icon">👤</span>
                    <span className="file-name" style={{display:'flex', flexDirection:'column'}}>
                      <span>{student.name}</span>
                      <small style={{fontWeight:400, color:'#6b7280'}}>{student.email}</small>
                    </span>
                  </div>
                  <div className="status-badge gray">{formatPhase(student.phase)}</div>
                </div>
                <div className="document-meta">
                  <div className="meta-item"><span className="meta-label">Especialidad:</span><span className="meta-value">{student.specialty || 'N/D'}</span></div>
                  <div className="meta-item" style={{maxWidth:'100%'}}><span className="meta-label">Tesis:</span><span className="meta-value" title={student.thesisTitle}>{truncate(student.thesisTitle || 'Sin título', 40)}</span></div>
                  <div className="meta-item"><span className="meta-label">Asignado:</span><span className="meta-value">{student.assignedDate || 'N/D'}</span></div>
                </div>
              </div>
              <div className="document-actions">
                <button
                  className="action-button primary"
                  onClick={() => navigate(`/advisor/students/${student.id}`, { state: { student } })}
                >
                  <span className="button-icon">👁️</span>
                  Ver Detalles
                </button>
                <button
                  className="action-button secondary"
                  onClick={() => navigate(`/advisor/students/${student.id}`, { state: { student }, replace:false })}
                >
                  <span className="button-icon">💬</span>
                  Comunicarse
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

export default StudentsList;
