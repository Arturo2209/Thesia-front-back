import { useEffect, useState } from 'react';
import type { AdvisorDashboardData } from '../types/advisor.types';

export function useAdvisorDashboard() {
  const [data, setData] = useState<AdvisorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulación de llamada a API (reemplazar por fetch real)
    setLoading(true);
    setTimeout(() => {
      setData({
        totalEstudiantes: 8,
        reunionesPendientes: 3,
        documentosPorRevisar: 5,
      });
      setLoading(false);
    }, 1000);
  }, []);

  return { data, loading, error };
}
