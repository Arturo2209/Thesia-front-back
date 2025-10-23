import React from 'react';
import './ThesesList.styles.css';

const ThesesList: React.FC = () => {
  // Simulación de tesis asignadas
  const theses = [
    { id: 43, title: 'Tesis de Carlos Arturo', phase: 'propuesta', student: 'Carlos Arturo', date: '2025-09-29' },
    { id: 45, title: 'Tesis de Kenny', phase: 'propuesta', student: 'Kenny', date: '2025-10-12' },
  ];

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
