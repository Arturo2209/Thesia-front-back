import { useEffect, useState } from 'react';
import type { AdvisorAssignment } from '../types/advisor.types';
import { apiService } from '../../../services/api';

export function useAssignedStudents() {
  const [students, setStudents] = useState<AdvisorAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/advisors/assigned-students');
        console.log('📊 Respuesta de estudiantes asignados:', response);
        
        if (response.success && Array.isArray(response.data)) {
          console.log(`✅ Se encontraron ${response.data.length} estudiantes`);
          setStudents(response.data);
        } else {
          console.log('⚠️ No se encontraron estudiantes o formato inválido');
          setStudents([]);
        }
      } catch (err) {
        console.error('❌ Error obteniendo estudiantes:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { 
    students, 
    loading, 
    error,
    totalStudents: students.length 
  };
}