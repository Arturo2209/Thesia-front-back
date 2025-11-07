import React from 'react';
import { useAssignedStudents } from './hooks/useAssignedStudents';
import '../Dashboard/Dashboard.styles';

const StudentsList: React.FC = () => {
  const { students, loading } = useAssignedStudents();

  return (
    <div className="dashboard-container" style={{ paddingLeft: '280px' }}> {/* Ajuste para evitar superposición */}
      <div className="main-content">
        <div className="content-section">
          <h2>Estudiantes Asignados</h2>
          {loading ? (
            <p>Cargando estudiantes...</p>
          ) : students.length === 0 ? (
            <p>No tienes estudiantes asignados.</p>
          ) : (
            <ul>
              {students.map((student) => (
                <li key={student.student_id}>
                  <strong>{student.thesis_title}</strong> (ID: {student.student_id})<br />
                  Fase: {student.phase} | Fecha asignación: {student.assigned_date}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
