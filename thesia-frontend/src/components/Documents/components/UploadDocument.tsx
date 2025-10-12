import React, { useState, useRef, useEffect } from 'react';
import documentsService from '../../../services/documentsService';
import notificationsService from '../../../services/notificationsService';
import thesisService from '../../../services/thesisService';
import type { ThesisPhase, UploadDocumentRequest } from '../types/documents.types';
import { uploadDocumentStyles } from '../styles/UploadDocument.styles';

interface UploadDocumentProps {
  onUploadSuccess: () => void;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({ onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState<{
    phase: ThesisPhase | '';
    file: File | null;
    description: string;
    chapterNumber: number;
  }>({
    phase: '',
    file: null,
    description: '',
    chapterNumber: 1
  });

  // Estados para fases disponibles
  const [availablePhases, setAvailablePhases] = useState<string[]>(['fase_1_plan_proyecto']);
  const [loadingPhases, setLoadingPhases] = useState(true);
  const [phasesError, setPhasesError] = useState<string | null>(null);

  // Estados de UI
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showGuides, setShowGuides] = useState(false);
  
  // Validaciones
  const [errors, setErrors] = useState<{
    phase?: string;
    file?: string;
    description?: string;
  }>({});

  // Función: Cargar fases disponibles
  const loadAvailablePhases = async () => {
    try {
      setLoadingPhases(true);
      setPhasesError(null);
      console.log('📋 === CARGANDO FASES DISPONIBLES ===');
      
      const response = await documentsService.getAvailablePhases();
      
      if (response.success) {
        setAvailablePhases(response.availablePhases);
        console.log('✅ Fases disponibles cargadas:', response.availablePhases);
        
        if (response.debugInfo) {
          console.log('🔍 Debug info:', response.debugInfo);
        }
      } else {
        console.error('❌ Error cargando fases:', response.message);
        setPhasesError(response.message);
        setAvailablePhases(['fase_1_plan_proyecto']);
      }
      
    } catch (error) {
      console.error('❌ Error cargando fases disponibles:', error);
      setPhasesError('Error de conexión al cargar las fases disponibles');
      setAvailablePhases(['fase_1_plan_proyecto']);
    } finally {
      setLoadingPhases(false);
    }
  };

  // Hook: Cargar fases al montar el componente
  useEffect(() => {
    loadAvailablePhases();
  }, []);

  // Función: Obtener texto legible de la fase
  const getPhaseText = (phase: string): string => {
    const phaseTexts: Record<string, string> = {
      'fase_1_plan_proyecto': 'Fase 1: Plan de Proyecto',
      'fase_2_diagnostico': 'Fase 2: Diagnóstico',
      'fase_3_marco_teorico': 'Fase 3: Marco Teórico',
      'fase_4_desarrollo': 'Fase 4: Desarrollo',
      'fase_5_resultados': 'Fase 5: Resultados'
    };
    return phaseTexts[phase] || phase;
  };

  // Función: Obtener mensaje de por qué una fase no está disponible
  const getPhaseUnavailableReason = (phase: string): string => {
    const reasons: Record<string, string> = {
      'fase_2_diagnostico': 'Necesitas que se apruebe el Plan de Proyecto primero',
      'fase_3_marco_teorico': 'Necesitas que se apruebe el Diagnóstico primero',
      'fase_4_desarrollo': 'Necesitas que se apruebe el Marco Teórico primero',
      'fase_5_resultados': 'Necesitas que se apruebe el Desarrollo primero'
    };
    return reasons[phase] || 'Fase no disponible aún';
  };

  // Función simplificada para obtener solo nombre y extensión
  const getSimpleFileName = (fileName: string): string => {
    return fileName;
  };

  // ✅ FUNCIÓN: Obtener ID real del asesor
  const getAdvisorId = async (): Promise<number | null> => {
    try {
      console.log('🔍 === OBTENIENDO ID DEL ASESOR ===');
      
      // 1. Intentar obtener desde mi tesis
      const myThesisResponse = await thesisService.getMyThesis();
      
      if (myThesisResponse.success && myThesisResponse.thesis?.id_asesor) {
        console.log('✅ Asesor encontrado desde tesis:', {
          id_asesor: myThesisResponse.thesis.id_asesor,
          asesor_nombre: myThesisResponse.thesis.asesor_nombre
        });
        return myThesisResponse.thesis.id_asesor;
      }

      // 2. Como fallback, intentar desde userData (aunque puede no ser confiable)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.id_asesor && userData.id_asesor > 0) {
        console.log('⚠️ Usando asesor desde userData (fallback):', userData.id_asesor);
        return userData.id_asesor;
      }

      console.log('❌ No se pudo determinar el asesor asignado');
      return null;

    } catch (error) {
      console.error('❌ Error obteniendo ID del asesor:', error);
      return null;
    }
  };

  // Validar archivo
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      return 'El archivo no puede ser mayor a 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos PDF, DOC y DOCX';
    }

    return null;
  };

  // Función centralizada para abrir selector de archivos
  const openFileSelector = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = (file: File) => {
    const fileError = validateFile(file);
    
    if (fileError) {
      setErrors(prev => ({ ...prev, file: fileError }));
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setErrors(prev => ({ ...prev, file: undefined }));
    setError(null);
  };

  // Manejar cambio en input de archivo
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Función para eliminar archivo
  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFormData(prev => ({ ...prev, file: null }));
    setErrors(prev => ({ ...prev, file: undefined }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Manejar drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Validación del formulario con fases
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.phase) {
      newErrors.phase = 'Selecciona una fase';
    } else if (!availablePhases.includes(formData.phase)) {
      newErrors.phase = `La fase "${getPhaseText(formData.phase)}" no está disponible aún`;
    }

    if (!formData.file) {
      newErrors.file = 'Selecciona un archivo';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ FUNCIÓN CORREGIDA: Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const uploadData: UploadDocumentRequest = {
        phase: formData.phase as ThesisPhase,
        file: formData.file!,
        description: formData.description || undefined,
        chapterNumber: formData.chapterNumber
      };

      console.log('📤 === SUBIENDO DOCUMENTO ===');
      console.log('Datos:', {
        phase: uploadData.phase,
        fileName: uploadData.file.name,
        description: uploadData.description
      });

      const response = await documentsService.uploadDocument(uploadData);

      if (response.success) {
        console.log('✅ Documento subido exitosamente');
        setSuccess('¡Documento subido exitosamente! Será revisado por tu asesor.');
        
        // 🔔 CREAR NOTIFICACIONES - VERSIÓN CORREGIDA SIN DUPLICAR VARIABLES
        try {
          console.log('🔔 === CREANDO NOTIFICACIONES ===');
          
          const advisorId = await getAdvisorId();
          
          if (advisorId) {
            // ✅ OBTENER DATOS DEL USUARIO UNA SOLA VEZ
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const studentName = `${currentUser.nombre || ''} ${currentUser.apellidos || currentUser.apellido || ''}`.trim() || 'Un estudiante';
            
            console.log('📋 Datos para notificaciones:', {
              advisorId,
              studentId: currentUser.id,
              studentName,
              fase: getPhaseText(formData.phase),
              fileName: formData.file?.name
            });

            // 🔔 NOTIFICACIÓN PARA EL ASESOR
            await notificationsService.createNotification({
              id_usuario: advisorId,
              mensaje: `${studentName} subió un nuevo documento en ${getPhaseText(formData.phase)}: ${formData.file?.name}`,
              tipo: 'documento',
              prioridad: 'media',
              id_referencia: response.document?.id || undefined,
              tipo_referencia: 'documento'
            });

            // 🔔 NOTIFICACIÓN PARA EL ESTUDIANTE (CONFIRMACIÓN)
            await notificationsService.createNotification({
              id_usuario: currentUser.id,
              mensaje: `✅ Documento "${formData.file?.name}" subido exitosamente en ${getPhaseText(formData.phase)}. Tu asesor será notificado.`,
              tipo: 'documento',
              prioridad: 'baja',
              id_referencia: response.document?.id || undefined,
              tipo_referencia: 'documento'
            });
            
            console.log('✅ Notificaciones creadas para asesor ID:', advisorId, 'y estudiante ID:', currentUser.id);
          } else {
            console.log('⚠️ No se pudo determinar el asesor - notificaciones omitidas');
          }
          
        } catch (notifError) {
          console.error('❌ Error creando notificaciones (no crítico):', notifError);
          // No mostrar error al usuario, es secundario
        }
        
        // Limpiar formulario
        setFormData({
          phase: '',
          file: null,
          description: '',
          chapterNumber: 1
        });
        
        // Reset input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Recargar fases disponibles (por si desbloqueó alguna nueva)
        setTimeout(() => {
          loadAvailablePhases();
        }, 1000);

        // Notificar al padre después de 2 segundos
        setTimeout(() => {
          onUploadSuccess();
        }, 2000);

      } else {
        throw new Error(response.message || 'Error subiendo documento');
      }

    } catch (error: any) {
      console.error('❌ Error subiendo documento:', error);
      
      // Manejo especial para errores de fase no disponible
      if (error.message && error.message.includes('fase')) {
        setError(`${error.message}\n\n🔄 Refrescando fases disponibles...`);
        // Recargar fases por si cambió algo
        setTimeout(() => {
          loadAvailablePhases();
        }, 2000);
      } else {
        setError(error.message || 'Error subiendo el documento. Inténtalo de nuevo.');
      }
      
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-document-container">
      {/* HEADER */}
      <div className="upload-header">
        <div className="header-content">
          <h2>📤 Subir Documento</h2>
          <p>Sube tu documento para que sea revisado por tu asesor</p>
        </div>
        <div className="header-actions">
          {/* 📚 BOTÓN DE GUÍAS */}
          <button 
            className="guides-button"
            onClick={() => setShowGuides(true)}
            type="button"
          >
            <span className="button-icon">📚</span>
            Ver Guías
          </button>
          
          <div className="upload-tips">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <div className="tip-title">Consejos:</div>
              <div className="tip-text">PDF, DOC, DOCX • Máx. 10MB</div>
            </div>
          </div>
        </div>
      </div>

      {/* LOADING DE FASES */}
      {loadingPhases && (
        <div className="phases-loading">
          <div className="spinner-small"></div>
          <span>Cargando fases disponibles...</span>
        </div>
      )}

      {/* ERROR DE FASES */}
      {phasesError && (
        <div className="phases-error">
          <div className="error-icon">⚠️</div>
          <div className="error-text">
            {phasesError}
            <button 
              onClick={loadAvailablePhases} 
              className="retry-button-small"
              disabled={loadingPhases}
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <div className="success-text">{success}</div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-message">
          <div className="error-icon">❌</div>
          <div className="error-text" style={{ whiteSpace: 'pre-line' }}>{error}</div>
        </div>
      )}

      {/* UPLOAD FORM */}
      <div className="upload-form-container">
        <form onSubmit={handleSubmit} className="upload-form">
          
          {/* PHASE SELECTION CON VALIDACIÓN */}
          <div className="form-group">
            <label className="form-label">
              Selecciona la fase <span className="required">*</span>
            </label>
            
            {loadingPhases ? (
              <div className="loading-select">
                <div className="spinner-small"></div>
                Cargando fases disponibles...
              </div>
            ) : (
              <select 
                value={formData.phase} 
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  phase: e.target.value as ThesisPhase 
                }))}
                className={`form-select ${errors.phase ? 'error' : ''}`}
                disabled={uploading}
              >
                <option value="">Selecciona una fase...</option>
                
                {/* OPCIONES DINÁMICAS BASADAS EN FASES DISPONIBLES */}
                {['fase_1_plan_proyecto', 'fase_2_diagnostico', 'fase_3_marco_teorico', 'fase_4_desarrollo', 'fase_5_resultados'].map(phase => {
                  const isAvailable = availablePhases.includes(phase);
                  return (
                    <option 
                      key={phase} 
                      value={phase}
                      disabled={!isAvailable}
                      title={!isAvailable ? getPhaseUnavailableReason(phase) : ''}
                    >
                      {getPhaseText(phase)} {!isAvailable ? '🔒' : ''}
                    </option>
                  );
                })}
              </select>
            )}
            
            {errors.phase && (
              <div className="error-text">{errors.phase}</div>
            )}
            
            {/* MOSTRAR RAZÓN SI LA FASE NO ESTÁ DISPONIBLE */}
            {formData.phase && !availablePhases.includes(formData.phase) && (
              <div className="phase-warning">
                <div className="warning-icon">🔒</div>
                <div className="warning-text">
                  {getPhaseUnavailableReason(formData.phase)}
                </div>
              </div>
            )}
          </div>

          {/* CHAPTER NUMBER */}
          {formData.phase && (
            <div className="form-group">
              <label className="form-label">Número de Capítulo</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.chapterNumber}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  chapterNumber: parseInt(e.target.value) || 1 
                }))}
                className="form-input"
                disabled={uploading}
              />
            </div>
          )}

          {/* FILE UPLOAD */}
          <div className="form-group">
            <label className="form-label">
              Documento <span className="required">*</span>
            </label>
            
            <div 
              className={`file-drop-area ${dragActive ? 'active' : ''} ${errors.file ? 'error' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {/* INPUT OCULTO */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="file-input"
                disabled={uploading}
              />
              
              {formData.file ? (
                /* ARCHIVO SELECCIONADO */
                <div className="file-selected">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <div className="file-name">{getSimpleFileName(formData.file.name)}</div>
                  </div>
                  
                  <div className="file-actions">
                    {/* Botón para cambiar archivo */}
                    <button 
                      type="button"
                      className="change-file-btn"
                      onClick={openFileSelector}
                      disabled={uploading}
                      title="Cambiar archivo"
                    >
                      🔄
                    </button>
                    
                    {/* Botón para eliminar archivo */}
                    <button 
                      type="button"
                      className="remove-file"
                      onClick={removeFile}
                      disabled={uploading}
                      title="Eliminar archivo"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                /* PLACEHOLDER */
                <div 
                  className="file-placeholder"
                  onClick={openFileSelector}
                >
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">
                    <div className="primary-text">
                      Haz clic para seleccionar o arrastra tu archivo aquí
                    </div>
                    <div className="secondary-text">
                      PDF, DOC, DOCX hasta 10MB
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {errors.file && (
              <div className="error-text">{errors.file}</div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label className="form-label">
              Descripción (Opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: e.target.value 
              }))}
              placeholder="Describe brevemente el contenido del documento o cambios realizados..."
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              rows={4}
              maxLength={500}
              disabled={uploading}
            />
            <div className="character-count">
              {formData.description.length}/500 caracteres
            </div>
            {errors.description && (
              <div className="error-text">{errors.description}</div>
            )}
          </div>

          {/* SUBMIT BUTTON CON VALIDACIÓN DE FASES */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={
                uploading || 
                !formData.phase || 
                !formData.file || 
                !availablePhases.includes(formData.phase) ||
                loadingPhases
              }
            >
              {uploading ? (
                <>
                  <span className="spinner-small"></span>
                  Subiendo...
                </>
              ) : loadingPhases ? (
                <>
                  <span className="spinner-small"></span>
                  Cargando fases...
                </>
              ) : (
                <>
                  <span className="button-icon">📤</span>
                  Subir Documento
                </>
              )}
            </button>
          </div>

          {/* INFO SECTION */}
          <div className="info-section">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <div className="info-title">Sistema de Fases Progresivo</div>
              <div className="info-text">
                Solo puedes subir documentos a las fases disponibles. 
                Completa y obtén la aprobación de cada fase para desbloquear la siguiente.
                <br/><br/>
                <strong>Proceso:</strong> Tu asesor tendrá hasta 7 días para revisar cada documento.
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL DE GUÍAS */}
      {showGuides && (
        <div className="guides-modal-overlay" onClick={() => setShowGuides(false)}>
          <div className="guides-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guides-modal-header">
              <h3>📚 Guías y Recursos</h3>
              <button 
                className="close-button"
                onClick={() => setShowGuides(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="guides-modal-content">
              <div className="guides-list">
                {/* EJEMPLO DE GUÍA */}
                <div className="guide-item">
                  <div className="guide-icon">📄</div>
                  <div className="guide-info">
                    <h4>Plan_De_Proyecto_Modelo.docx</h4>
                    <p>Plantilla oficial para estructurar tu documento de tesis</p>
                    <div className="guide-meta">
                      <span>📅 Subido hace 2 días</span>
                      <span>👨‍🏫 Por tu asesor</span>
                    </div>
                  </div>
                  <button className="download-guide-btn">
                    ⬇️ Descargar
                  </button>
                </div>
                
                {/* MENSAJE SI NO HAY GUÍAS */}
                <div className="no-guides">
                  <div className="no-guides-icon">📚</div>
                  <div className="no-guides-text">
                    <h4>No hay guías disponibles</h4>
                    <p>Tu asesor aún no ha subido guías para tu tesis. Las guías aparecerán aquí cuando estén disponibles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{uploadDocumentStyles}</style>
    </div>
  );
};

export default UploadDocument;