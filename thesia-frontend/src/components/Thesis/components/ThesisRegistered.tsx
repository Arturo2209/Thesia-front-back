import React from 'react';
import type { ThesisData } from '../types/thesis.types';
import { thesisRegisteredStyles } from '../styles/ThesisRegistered.styles';

interface ThesisRegisteredProps {
  thesisData: ThesisData;
  onEdit: () => void;
  onLogout: () => void;
}

const ThesisRegistered: React.FC<ThesisRegisteredProps> = ({
  thesisData,
  onEdit
}) => {
  return (
    <>
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="content-section">
          <div className="thesis-registered-container">
            <div className="thesis-layout">
              <div className="thesis-info-section">
                <div className="info-card">
                  <div className="card-header">
                    <h3>Título de la Tesis</h3>
                  </div>
                  <div className="card-content">
                    <p>{thesisData.titulo}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-header">
                    <h3>Ciclo</h3>
                  </div>
                  <div className="card-content">
                    <p>{thesisData.ciclo}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-header">
                    <h3>Descripción</h3>
                  </div>
                  <div className="card-content">
                    <p>{thesisData.descripcion}</p>
                  </div>
                </div>

                <div className="edit-button-container">
                  <button 
                    className="edit-info-btn"
                    onClick={onEdit}
                  >
                    <span className="button-icon">✏️</span>
                    Editar Información
                  </button>
                </div>
              </div>

              <div className="advisor-info-section">
                <div className="advisor-card-large">
                  <div className="advisor-header">
                    <div className="advisor-icon">👨‍🏫</div>
                    <h3>Mi Asesor Asignado</h3>
                  </div>

                  <div className="advisor-details">
                    <div className="advisor-avatar-large">
                      <span className="avatar-initials">
                        {thesisData.asesor_nombre?.split(' ').slice(0, 2).map(n => n.charAt(0)).join('') || 'A'}
                      </span>
                    </div>
                    
                    <div className="advisor-info-text">
                      <h4>{thesisData.asesor_nombre || 'Asesor no asignado'}</h4>
                      <p className="advisor-specialty">{thesisData.asesor_especialidad || 'Especialidad no disponible'}</p>
                      <div className="advisor-contact">
                        <span className="email-icon">📧</span>
                        <span>{thesisData.asesor_email || 'Email no disponible'}</span>
                      </div>
                      <div className="advisor-description">
                        <p>Especialista en {thesisData.asesor_especialidad || 'diversas áreas'} con experiencia en el desarrollo de proyectos de tesis y pretesis.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{thesisRegisteredStyles}</style>
    </>
  );
};

export default ThesisRegistered;