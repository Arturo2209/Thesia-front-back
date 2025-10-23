import React from 'react';
import type { AdvisorThesis } from '../types/thesis.types';
import '../styles/ThesesList.styles.css';

const theses: AdvisorThesis[] = [
  { id: 43, title: 'Tesis de Carlos Arturo', phase: 'propuesta', student: 'Carlos Arturo', date: '2025-09-29' },
  { id: 45, title: 'Tesis de Kenny', phase: 'propuesta', student: 'Kenny', date: '2025-10-12' },
];

const ThesesList: React.FC = () => {
  return (
    <div className="theses-list-container">
      <h2>Tesis Asignadas</h2>
      <ul className="theses-list">
        {theses.map(thesis => (
          <li key={thesis.id} className="thesis-item">
            <div className="thesis-title">{thesis.title}</div>
            <div className="thesis-details">
              <span>Estudiante: {thesis.student}</span>
              <span>Fase: {thesis.phase}</span>
              <span>Fecha asignación: {thesis.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThesesList;
