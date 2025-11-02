import { useEffect, useState } from 'react';
import type { AdvisorDashboardData } from '../types/advisor.types';
import { apiService } from '../../../services/api';
import { useAssignedStudents } from './useAssignedStudents';

export function useAdvisorDashboard() {
  const [data, setData] = useState<AdvisorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { students, loading: studentsLoading } = useAssignedStudents();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (studentsLoading) {
        setLoading(true);
        return;
      }
      setLoading(true);
      try {
        console.log('📊 Obteniendo datos del dashboard...');
        
        // Obtener reuniones pendientes
        const meetingsResponse = await apiService.get('/reuniones/pendientes');
        console.log('📅 Respuesta de reuniones:', meetingsResponse);
        
        // Obtener documentos por revisar
        const documentsResponse = await apiService.get('/documents/pending-review');
        console.log('📄 Respuesta de documentos:', documentsResponse);

        setData({
          totalEstudiantes: students.length,
          reunionesPendientes: meetingsResponse.data?.length || 0,
          documentosPorRevisar: documentsResponse.data?.length || 0,
        });
      } catch (err) {
        console.error('❌ Error obteniendo datos del dashboard:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [students, studentsLoading]);

  return { data, loading, error };
}
