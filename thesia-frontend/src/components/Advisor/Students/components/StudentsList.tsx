import React, { useEffect, useState } from 'react';
import advisorService from '../../../../services/advisorService';
import type { AdvisorStudent } from '../types/student.types';
import '../styles/StudentsList.styles.css';

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<AdvisorStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await advisorService.getAssignedStudents();
        console.log('📊 Estudiantes obtenidos:', data); // Log para verificar los datos obtenidos
        setStudents(data);
      } catch (err) {
        console.error('❌ Error obteniendo estudiantes asignados:', err);
        setError('Error al cargar los estudiantes. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div>Cargando estudiantes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="students-list-container">
      <h2>Estudiantes Asignados</h2>
      <ul className="students-list">
        {students.length > 0 ? (
          students.map(student => (
            <li key={student.id} className="student-item">
              <div className="student-name">{student.name}</div>
              <div className="student-email">{student.email}</div>
              <div className="student-specialty">{student.specialty}</div>
              <div className="student-thesis">{student.thesisTitle}</div>
              <div className="student-phase">Fase: {student.phase}</div>
              <div className="student-assigned-date">Asignado el: {student.assignedDate}</div>
            </li>
          ))
        ) : (
          <div>No hay estudiantes asignados.</div>
        )}
      </ul>
    </div>
  );
};

export default StudentsList;
