import React from 'react';
import type { AdvisorStudent } from '../types/student.types';
import '../styles/StudentsList.styles.css';

const students: AdvisorStudent[] = [
  { id: 1, name: 'Carlos Arturo', email: 'carlos@tecsup.edu.pe', progress: '60%', thesisTitle: 'Optimización de procesos industriales' },
  { id: 2, name: 'Kenny', email: 'kenny@tecsup.edu.pe', progress: '40%', thesisTitle: 'Automatización de sistemas eléctricos' },
];

const StudentsList: React.FC = () => {
  return (
    <div className="students-list-container">
      <h2>Estudiantes Asignados</h2>
      <ul className="students-list">
        {students.map(student => (
          <li key={student.id} className="student-item">
            <div className="student-name">{student.name}</div>
            <div className="student-details">
              <span>Email: {student.email}</span>
              <span>Progreso: {student.progress}</span>
              <span>Tesis: {student.thesisTitle}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsList;
