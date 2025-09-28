import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import authService from '../../services/authService';
import thesisService from '../../services/thesisService';

const MyThesis: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasThesis, setHasThesis] = useState(false);
  const [thesisData, setThesisData] = useState<any>(null);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    id_asesor: '',
    area: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando datos de Mi Tesis...');
      
      // Verificar si tiene tesis
      const myThesis = await thesisService.getMyThesis();
      
      if (myThesis.hasThesis && myThesis.thesis) {
        console.log('✅ Usuario tiene tesis');
        setHasThesis(true);
        setThesisData(myThesis.thesis);
      } else {
        console.log('ℹ️ Usuario sin tesis, cargando asesores...');
        setHasThesis(false);
        
        // Cargar asesores
        const advisorsData = await thesisService.getAdvisors();
        setAdvisors(advisorsData.advisors || []);
        console.log('👨‍🏫 Asesores cargados:', advisorsData.advisors?.length || 0);
      }
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      alert('Error cargando datos. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Enviando formulario...', formData);
    
    if (!formData.titulo || !formData.descripcion || !formData.id_asesor) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      
      const result = await thesisService.createThesis({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        id_asesor: parseInt(formData.id_asesor),
        area: formData.area,
        tipo: 'pretesis'
      });

      console.log('✅ Resultado:', result);
      alert('¡Tesis registrada exitosamente!');
      
      // Recargar
      await loadData();
      
    } catch (error) {
      console.error('❌ Error creando tesis:', error);
      alert('Error al registrar la tesis: ' + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner">🔄</div>
            <p>Cargando información de tesis...</p>
          </div>
        </div>
        <style>{baseStyles}</style>
      </div>
    );
  }

  // Si ya tiene tesis registrada, mostrar la vista completa
  if (hasThesis && thesisData) {
    return (
      <div className="app-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Mi Tesis</h1>
            <p className="page-subtitle">Registra la información de tu tesis o pretesis</p>
          </div>

          {/* Main Content */}
          <div className="page-body">
            
            {/* Success Banner */}
            <div className="success-banner">
              <div className="success-icon">✅</div>
              <div className="success-content">
                <h3>Mi Tesis</h3>
                <p>Tesis registrada exitosamente</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
              
              {/* Left Column - Thesis Information */}
              <div className="thesis-section">
                
                {/* Title Card */}
                <div className="info-card">
                  <div className="card-header">
                    <h4>TÍTULO DE LA TESIS</h4>
                  </div>
                  <div className="card-content">
                    <h2 className="thesis-title">{thesisData.titulo}</h2>
                  </div>
                </div>

                {/* Cycle Card */}
                <div className="info-card">
                  <div className="card-header">
                    <h4>CICLO</h4>
                  </div>
                  <div className="card-content">
                    <div className="cycle-badge">{thesisData.area || 'V Ciclo'}</div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="info-card">
                  <div className="card-header">
                    <h4>DESCRIPCIÓN</h4>
                  </div>
                  <div className="card-content">
                    <p className="description-text">{thesisData.descripcion}</p>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="edit-section">
                  <button 
                    className="edit-btn"
                    onClick={() => setEditMode(!editMode)}
                  >
                    Editar Información
                  </button>
                </div>

              </div>

              {/* Right Column - Advisor Information */}
              <div className="advisor-section">
                
                <div className="advisor-card">
                  <div className="advisor-header">
                    <div className="advisor-icon">👨‍🏫</div>
                    <h3>Mi Asesor Asignado</h3>
                  </div>
                  
                  {thesisData.advisor ? (
                    <div className="advisor-details">
                      <h4 className="advisor-name">{thesisData.advisor.name}</h4>
                      <p className="advisor-specialty">
                        {thesisData.advisor.specialty || 'Desarrollo Web'}
                      </p>
                      
                      <div className="contact-info">
                        <div className="contact-item">
                          <span className="contact-icon">📧</span>
                          <span className="contact-text">{thesisData.advisor.email}</span>
                        </div>
                      </div>
                      
                      <div className="advisor-description">
                        <p>
                          Especialista en gestión de proyectos y metodologías 
                          ágiles en el desarrollo de software educativo.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="no-advisor">
                      <p>No se encontró información del asesor</p>
                    </div>
                  )}
                  
                </div>
              </div>

            </div>
          </div>
        </div>

        <style>{baseStyles}</style>
        <style>{thesisStyles}</style>
      </div>
    );
  }

  // Si no tiene tesis, mostrar formulario de registro
  return (
    <div className="app-container">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Mi Tesis</h1>
          <p className="page-subtitle">Registra la información de tu tesis o pretesis</p>
        </div>

        {/* Main Content */}
        <div className="page-body">
          
          {/* Info Banner */}
          <div className="info-banner">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <h3>Información de Tesis Requerida</h3>
              <p>Para continuar con el proceso, necesitas completar la información de tu tesis y seleccionar un asesor disponible.</p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="thesis-form">
              
              <div className="form-group">
                <label className="form-label">Título de la Tesis/Pretesis *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  placeholder="Sistema web de gestión y seguimiento para las tesis y pretesis"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Ciclo de Carrera *</label>
                <select
                  className="form-select"
                  value={formData.area || 'V Ciclo'}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                >
                  <option value="V Ciclo">V Ciclo</option>
                  <option value="VI Ciclo">VI Ciclo</option>
                  <option value="VII Ciclo">VII Ciclo</option>
                  <option value="VIII Ciclo">VIII Ciclo</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Descripción del Proyecto *</label>
                <textarea
                  className="form-textarea"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Sistema web para gestionar y dar seguimiento a tesis y pre-tesis, facilitando la organización, el monitoreo de avances y la comunicación entre estudiantes y asesores."
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Seleccionar Asesor *</label>
                <select
                  className="form-select"
                  value={formData.id_asesor}
                  onChange={(e) => setFormData({...formData, id_asesor: e.target.value})}
                  required
                >
                  <option value="">Selecciona un asesor...</option>
                  {advisors.map((advisor) => (
                    <option key={advisor.id} value={advisor.id}>
                      {advisor.fullInfo}
                    </option>
                  ))}
                </select>
                <small className="form-help">Solo se muestran asesores con capacidad disponible</small>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="btn-icon">🔄</span>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">📝</span>
                      Registrar Tesis y Asesor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{baseStyles}</style>
      <style>{formStyles}</style>
    </div>
  );
};

// 🎨 ESTILOS BASE - LAYOUT PANTALLA COMPLETA
const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .app-container {
    display: flex;
    min-height: 100vh;
    width: 100vw;
    background: #f8f9fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .main-content {
    flex: 1;
    margin-left: 280px;
    min-height: 100vh;
    width: calc(100vw - 280px);
    display: flex;
    flex-direction: column;
  }

  .page-header {
    background: white;
    padding: 24px 32px;
    border-bottom: 1px solid #e9ecef;
    flex-shrink: 0;
  }

  .page-title {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
  }

  .page-subtitle {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
  }

  .page-body {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60vh;
    gap: 16px;
  }

  .loading-spinner {
    font-size: 32px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      width: 100vw;
    }
    
    .page-header,
    .page-body {
      padding: 16px;
    }
  }
`;

// 🎨 ESTILOS PARA VISTA DE TESIS
const thesisStyles = `
  .success-banner {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 32px;
  }

  .success-icon {
    font-size: 24px;
  }

  .success-content h3 {
    margin: 0 0 4px 0;
    color: #155724;
    font-size: 16px;
    font-weight: 600;
  }

  .success-content p {
    margin: 0;
    color: #155724;
    font-size: 14px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 32px;
    align-items: start;
    max-width: 1200px;
  }

  .thesis-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .info-card {
    background: white;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    overflow: hidden;
  }

  .card-header {
    background: #f8f9fa;
    padding: 16px 20px;
    border-bottom: 1px solid #e9ecef;
  }

  .card-header h4 {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .card-content {
    padding: 20px;
  }

  .thesis-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    line-height: 1.4;
  }

  .cycle-badge {
    background: #e3f2fd;
    color: #1976d2;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    display: inline-block;
  }

  .description-text {
    margin: 0;
    color: #495057;
    line-height: 1.6;
    font-size: 14px;
  }

  .edit-section {
    margin-top: 8px;
  }

  .edit-btn {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .edit-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  .advisor-section {
    position: sticky;
    top: 32px;
  }

  .advisor-card {
    background: white;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    overflow: hidden;
  }

  .advisor-header {
    background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
    color: white;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .advisor-icon {
    font-size: 24px;
  }

  .advisor-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .advisor-details {
    padding: 24px;
  }

  .advisor-name {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
  }

  .advisor-specialty {
    margin: 0 0 20px 0;
    color: #4dabf7;
    font-size: 14px;
    font-weight: 500;
  }

  .contact-info {
    margin-bottom: 20px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .contact-icon {
    font-size: 14px;
    width: 20px;
  }

  .contact-text {
    font-size: 14px;
    color: #495057;
  }

  .advisor-description {
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
  }

  .advisor-description p {
    margin: 0;
    font-size: 13px;
    color: #6c757d;
    line-height: 1.5;
  }

  .no-advisor {
    padding: 24px;
    text-align: center;
    color: #6c757d;
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    .advisor-section {
      position: static;
    }
  }
`;

// 🎨 ESTILOS PARA FORMULARIO
const formStyles = `
  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: #e3f2fd;
    border: 1px solid #bbdefb;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 32px;
  }

  .info-icon {
    font-size: 20px;
    color: #1976d2;
    margin-top: 2px;
  }

  .info-content h3 {
    margin: 0 0 8px 0;
    color: #1976d2;
    font-size: 16px;
    font-weight: 600;
  }

  .info-content p {
    margin: 0;
    color: #0d47a1;
    font-size: 14px;
    line-height: 1.5;
  }

  .form-container {
    background: white;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    padding: 32px;
    max-width: 800px;
  }

  .thesis-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 14px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 12px 16px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    color: #495057;
    transition: all 0.2s;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
  }

  .form-help {
    color: #6c757d;
    font-size: 12px;
  }

  .form-actions {
    padding-top: 8px;
  }

  .submit-btn {
    background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 52px;
    max-width: 300px;
  }

  .submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #339af0 0%, #228be6 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(77, 171, 247, 0.3);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn-icon {
    font-size: 16px;
  }
`;

export default MyThesis;