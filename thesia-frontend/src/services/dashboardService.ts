// Dashboard Service - Para obtener datos del usuario y su progreso
interface DashboardData {
    user: {
      name: string;
      role: string;
      roleDisplay: string;
      carrera: string;
      profileCompleted: boolean;
      email: string;
    };
    thesis: {
      hasThesis: boolean;
      title?: string;
      phase: number;
      progress: number;
      daysRemaining: number;
    };
    documents: {
      totalUploaded: number;
      approved: number;
      pending: number;
      rejected: number;
    };
    advisor: {
      hasAdvisor: boolean;
      name?: string;
      email?: string;
    };
    activities: Array<{
      id: number;
      description: string;
      date: string;
      type: 'document' | 'meeting' | 'comment' | 'profile' | 'login';
    }>;
  }
  
  class DashboardService {
    private baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  
    // Obtener todos los datos del dashboard
    async getDashboardData(): Promise<{ success: boolean; data: DashboardData; timestamp: string }> {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Token no encontrado');
        }
  
        console.log('🔄 Obteniendo datos del dashboard...');
  
        const response = await fetch(`${this.baseURL}/api/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error response:', response.status, errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('✅ Datos del dashboard recibidos:', data);
        
        return data;
  
      } catch (error) {
        console.error('❌ Error obteniendo datos del dashboard:', error);
        throw error;
      }
    }
  
    // Obtener estadísticas específicas
    async getStats() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Token no encontrado');
        }
  
        const response = await fetch(`${this.baseURL}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        throw error;
      }
    }
  }
  
export default new DashboardService();