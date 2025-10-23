import React, { useEffect, useState } from 'react';
import type { AdvisorAssignment } from './types/advisor.types';
import authService from '../../services/authService';

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<AdvisorAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación: obtener estudiantes asignados al asesor actual
    // Reemplaza por llamada real a la API
    const fetchStudents = async () => {
      setLoading(true);
      // Aquí deberías obtener el asesor actual desde authService
      const user = authService.getStoredUser();
      if (user && user.role === 'asesor') {
        // Simulación de datos
        setStudents([
          {
            student_id: 43,
            advisor_id: user.id,
            assigned_date: '2025-09-29',
            thesis_title: 'Tesis de Carlos Arturo',
            phase: 'propuesta',
          },
          {
            student_id: 45,
            advisor_id: user.id,
            assigned_date: '2025-10-12',
            thesis_title: 'Tesis de Kenny',
            phase: 'propuesta',
          },
        ]);
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  return (
    <div>
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
  );
};

export default StudentsList;
