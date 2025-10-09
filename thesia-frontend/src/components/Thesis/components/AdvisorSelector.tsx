import React from 'react';
import type { Advisor } from '../types/thesis.types';

interface AdvisorSelectorProps {
  advisors: Advisor[];
  filteredAdvisors: Advisor[];
  selectedAdvisor: number | null;
  advisorsLoading: boolean;
  onAdvisorSelect: (advisorId: number) => void;
}

const AdvisorSelector: React.FC<AdvisorSelectorProps> = ({
  filteredAdvisors,
  selectedAdvisor,
  advisorsLoading,
  onAdvisorSelect
}) => {
  if (advisorsLoading) {
    return (
      <div className="advisors-loading">
        <div className="spinner"></div>
        <p>Cargando asesores disponibles...</p>
      </div>
    );
  }

  if (filteredAdvisors.length === 0) {
    return (
      <div className="no-advisors">
        <div className="no-advisors-icon">👨‍🏫</div>
        <h4>No hay asesores disponibles</h4>
        <p>No se encontraron asesores disponibles para tu carrera en este momento.</p>
      </div>
    );
  }

  return (
    <div className="advisors-container">
      <div className="advisors-info">
        <p>
          Se encontraron <strong>{filteredAdvisors.length}</strong> asesores disponibles para tu carrera.
          Haz clic en el asesor que prefieras:
        </p>
      </div>

      <div className="advisors-grid">
        {filteredAdvisors.map((advisor) => (
          <div
            key={advisor.id_usuario}
            className={`advisor-card ${selectedAdvisor === advisor.id_usuario ? 'selected' : ''}`}
            onClick={() => onAdvisorSelect(advisor.id_usuario)}
          >
            <div className="advisor-header">
              <div className="advisor-avatar">
                {advisor.avatar_url ? (
                  <img src={advisor.avatar_url} alt={advisor.nombre} />
                ) : (
                  <span className="avatar-placeholder">
                    {advisor.nombre.charAt(0)}{advisor.apellido.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="advisor-basic-info">
                <h4 className="advisor-name">
                  {advisor.nombre} {advisor.apellido}
                </h4>
                <p className="advisor-specialty">
                  {advisor.especialidad}
                </p>
              </div>

              {selectedAdvisor === advisor.id_usuario && (
                <div className="selected-indicator">
                  <span className="check-icon">✓</span>
                </div>
              )}
            </div>

            <div className="advisor-details">
              <div className="advisor-contact">
                <span className="contact-icon">📧</span>
                <span className="contact-email">{advisor.correo_institucional}</span>
              </div>
              
              <div className="advisor-capacity">
                <div className="capacity-info">
                  <span className="capacity-icon">👥</span>
                  <span>Disponibilidad: {advisor.available_capacity}/{advisor.max_capacity}</span>
                </div>
                <div className="capacity-bar">
                  <div 
                    className="capacity-fill"
                    style={{ 
                      width: `${(advisor.available_capacity / advisor.max_capacity) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="advisor-description">
              <p>Especialista en {advisor.especialidad} con experiencia en proyectos de investigación y desarrollo.</p>
            </div>
          </div>
        ))}
      </div>

      {selectedAdvisor && (
        <div className="selection-confirmation">
          <div className="confirmation-content">
            <span className="confirmation-icon">✅</span>
            <span>Has seleccionado a {filteredAdvisors.find(a => a.id_usuario === selectedAdvisor)?.nombre} como tu asesor</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorSelector;