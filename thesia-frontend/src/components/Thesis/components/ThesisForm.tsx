import React from 'react';
import type { Advisor, FormData } from '../types/thesis.types';
import AdvisorSelector from './AdvisorSelector';
import { thesisFormStyles } from '../styles/ThesisForm.styles.ts';
import StudentHeader from '../../Shared/StudentHeader';

interface ThesisFormProps {
  formData: FormData;
  cycles: string[];
  error: string;
  submitting: boolean;
  selectedAdvisor: number | null;
  filteredAdvisors: Advisor[];
  advisorsLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onErrorClose: () => void;
  onAdvisorSelect: (advisorId: number) => void;
}

const ThesisForm: React.FC<ThesisFormProps> = ({
  formData,
  cycles,
  error,
  submitting,
  selectedAdvisor,
  filteredAdvisors,
  advisorsLoading,
  onInputChange,
  onSubmit,
  onErrorClose,
  onAdvisorSelect
}) => {
  return (
    <>
      <div className="main-content">
        <StudentHeader title="Sistema de Tesis y Pretesis" />

        <div className="content-section">
          <div className="thesis-form-container">
            <div className="form-header">
              <div className="form-icon">
                📋
              </div>
              <div className="form-title-section">
                <h2>Registrar Mi Tesis</h2>
                <p>Completa todos los campos para registrar tu proyecto de tesis</p>
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

            <form onSubmit={onSubmit} className="thesis-form">
              {/* CONTENIDO PRINCIPAL DEL FORMULARIO */}
              <div className="form-content">
                {/* Información del proyecto */}
                <div className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon">📝</span>
                    Información del Proyecto
                  </h3>

                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="titulo">
                        Título de la Tesis *
                      </label>
                      <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={onInputChange}
                        placeholder="Ingresa el título de tu proyecto de tesis"
                        required
                        minLength={10}
                        maxLength={200}
                      />
                      <div className="input-help">
                        Mínimo 10 caracteres, máximo 200
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="ciclo">
                        Ciclo Académico *
                      </label>
                      <select
                        id="ciclo"
                        name="ciclo"
                        value={formData.ciclo}
                        onChange={onInputChange}
                        required
                        className="readonly-input"
                        disabled
                      >
                        <option value="">Selecciona tu ciclo</option>
                        {cycles.map((cycle) => (
                          <option key={cycle} value={cycle}>
                            {cycle}
                          </option>
                        ))}
                      </select>
                      <div className="input-help">
                        Ciclo configurado desde tu perfil
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="descripcion">
                        Descripción del Proyecto *
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={onInputChange}
                        placeholder="Describe brevemente tu proyecto de tesis, objetivos, metodología y alcance..."
                        required
                        rows={6}
                        minLength={50}
                        maxLength={1000}
                      />
                      <div className="input-help">
                        Mínimo 50 caracteres, máximo 1000. Sé específico sobre los objetivos y metodología.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de envío y footer - DENTRO DEL FORM-CONTENT */}
                <div className="form-actions">
                  <div className="buttons-row">
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={submitting || !selectedAdvisor}
                    >
                      {submitting ? (
                        <>
                          <div className="spinner-small"></div>
                          Registrando...
                        </>
                      ) : (
                        <>
                          <span className="button-icon">📝</span>
                          Registrar Tesis y Asesor
                        </>
                      )}
                    </button>
                  </div>

                  <div className="form-footer">
                    <p>
                      * Campos obligatorios. Una vez registrada tu tesis, podrás editarla desde tu dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* SIDEBAR DE ASESORES */}
              <div className="advisors-sidebar">
                <div className="advisors-header">
                  <span className="advisors-icon">👨‍🏫</span>
                  <h3>Seleccionar Asesor</h3>
                </div>
                
                <div className="advisors-content">
                  <div className="advisors-info">
                    <p>Solo se muestran asesores con capacidad disponible</p>
                  </div>

                  {advisorsLoading ? (
                    <div className="advisors-loading">
                      <div className="spinner"></div>
                      <p>Cargando asesores...</p>
                    </div>
                  ) : filteredAdvisors.length === 0 ? (
                    <div className="no-advisors">
                      <div className="no-advisors-icon">👨‍🏫</div>
                      <h4>No hay asesores disponibles</h4>
                      <p>No se encontraron asesores para tu carrera en este momento.</p>
                    </div>
                  ) : (
                    <>
                      <div className="advisors-list">
                        {filteredAdvisors.map((advisor) => {
                          const isSelected = selectedAdvisor === advisor.id_usuario;
                          const isAvailable = advisor.available_capacity > 0;
                          
                          return (
                            <div
                              key={advisor.id_usuario}
                              className={`advisor-card ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                              onClick={() => isAvailable && onAdvisorSelect(advisor.id_usuario)}
                            >
                              <div className="advisor-header">
                                <div className="advisor-avatar">
                                  {advisor.nombre.charAt(0)}{advisor.apellido?.charAt(0) || ''}
                                </div>
                                <div className="advisor-basic-info">
                                  <h4 className="advisor-name">
                                    {advisor.nombre} {advisor.apellido}
                                  </h4>
                                  <span className="advisor-specialty">
                                    {advisor.especialidad}
                                  </span>
                                </div>
                                {isSelected && (
                                  <div className="selected-indicator">
                                    <span className="check-icon">✓</span>
                                  </div>
                                )}
                              </div>

                              <div className="advisor-contact">
                                <span className="contact-icon">📧</span>
                                <span>{advisor.correo_institucional}</span>
                              </div>

                              <div className="advisor-capacity">
                                <span className="capacity-icon">👥</span>
                                <span className={`capacity-status ${isAvailable ? 'available' : 'unavailable'}`}>
                                  {advisor.available_capacity}/{advisor.max_capacity} disponibles
                                </span>
                              </div>

                              {!isAvailable && (
                                <div className="unavailable-reason">
                                  No disponible ({advisor.current_students}/{advisor.max_capacity})
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {selectedAdvisor && (
                        <div className="selection-confirmation">
                          <div className="confirmation-content">
                            <span className="confirmation-icon">✅</span>
                            <span className="confirmation-text">
                              Asesor seleccionado correctamente
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{thesisFormStyles}</style>
    </>
  );
};

export default ThesisForm;