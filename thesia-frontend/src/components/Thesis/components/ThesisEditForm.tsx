import React from 'react';
import type { Advisor, FormData, ThesisData } from '../types/thesis.types';
import { thesisEditFormStyles } from '../styles/ThesisEditForm.styles.ts';
import StudentHeader from '../../Shared/StudentHeader';

interface ThesisEditFormProps {
  formData: FormData;
  thesisData: ThesisData;
  error: string;
  submitting: boolean;
  selectedAdvisor: number | null;
  filteredAdvisors: Advisor[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onErrorClose: () => void;
  onCancel: () => void;
}

const ThesisEditForm: React.FC<ThesisEditFormProps> = ({
  formData,
  thesisData,
  error,
  submitting,
  selectedAdvisor,
  filteredAdvisors,
  onInputChange,
  onSubmit,
  onErrorClose,
  onCancel
}) => {
  return (
    <>
      <div className="main-content">
        <StudentHeader title="Sistema de Tesis y Pretesis" />

        <div className="content-section">
          <div className="thesis-edit-container">
            <div className="edit-header">
              <div className="edit-icon">✏️</div>
              <div className="edit-title-section">
                <h2>Editar Mi Tesis</h2>
                <p>Modifica la información de tu proyecto de tesis</p>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <div className="error-content">
                  <span className="error-icon">⚠️</span>
                  <span className="error-text">{error}</span>
                  <button 
                    className="error-close"
                    onClick={onErrorClose}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="edit-form">
              {/* Información del proyecto */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📝</span>
                  Información del Proyecto
                </h3>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="titulo">Título de la Tesis *</label>
                    <input
                      type="text"
                      id="titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={onInputChange}
                      placeholder="Ingresa el título de tu proyecto de tesis"
                      required
                       
                      maxLength={200}
                    />
                    <div className="input-help">Máximo 200 caracteres</div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="ciclo">Ciclo Académico</label>
                    <input
                      type="text"
                      id="ciclo"
                      name="ciclo"
                      value={formData.ciclo}
                      disabled
                      className="readonly-input"
                    />
                    <div className="input-help">
                      El ciclo no puede modificarse (proviene de tu perfil)
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="descripcion">Descripción del Proyecto *</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={onInputChange}
                      placeholder="Describe brevemente tu proyecto de tesis, objetivos, metodología y alcance..."
                      required
                      rows={6}
                      maxLength={1000}
                    />
                    <div className="input-help">
                      Máximo 1000 caracteres. Sé específico sobre los objetivos y metodología.
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Asesor Actual (SOLO LECTURA) */}
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">👨‍🏫</span>
                  Asesor Actual
                </h3>

                <div className="current-advisor-info">
                  <div className="advisor-card readonly">
                    <div className="advisor-header">
                      <div className="advisor-avatar">
                        <span className="avatar-placeholder">
                          {thesisData.asesor_nombre?.split(' ').slice(0, 2).map(n => n.charAt(0)).join('') || 'A'}
                        </span>
                      </div>
                      
                      <div className="advisor-basic-info">
                        <h4 className="advisor-name">
                          {thesisData.asesor_nombre || 'Asesor no asignado'}
                        </h4>
                        <p className="advisor-specialty">
                          {thesisData.asesor_especialidad || 'Especialidad no disponible'}
                        </p>
                      </div>

                      <div className="readonly-indicator">
                        <span title="Solo lectura">🔒</span>
                      </div>
                    </div>

                    <div className="advisor-details">
                      <div className="advisor-contact">
                        <span className="contact-icon">📧</span>
                        <span className="contact-email">{thesisData.asesor_email || 'Email no disponible'}</span>
                      </div>
                    </div>

                    <div className="advisor-note">
                      <p>
                        <strong>Nota:</strong> Para cambiar de asesor, contacta con el coordinador académico. 
                        El nuevo asesor debe aceptar la solicitud antes de que se haga efectivo el cambio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="form-actions">
                <div className="buttons-row">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onCancel}
                    disabled={submitting}
                  >
                    <span className="button-icon">❌</span>
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="spinner-small"></div>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <span className="button-icon">💾</span>
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>

                <div className="form-footer">
                  <p>
                    * Solo puedes modificar el título y descripción. Para cambios de asesor, contacta al coordinador académico.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{thesisEditFormStyles}</style>
    </>
  );
};

export default ThesisEditForm;