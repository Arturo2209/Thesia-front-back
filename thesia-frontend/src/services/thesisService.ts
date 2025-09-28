const API_BASE = 'http://localhost:3001/api';

const thesisService = {
  // Obtener asesores
  async getAdvisors() {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Obteniendo asesores...');
      
      const response = await fetch(`${API_BASE}/advisors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Asesores obtenidos:', data.total);
      return data;
      
    } catch (error) {
      console.error('❌ Error en getAdvisors:', error);
      throw error;
    }
  },

  // Crear tesis
  async createThesis(thesisData: any) {
    try {
      const token = localStorage.getItem('token');
      console.log('📝 Creando tesis...', thesisData.titulo);
      
      const response = await fetch(`${API_BASE}/thesis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thesisData),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Tesis creada:', data.thesis?.id);
      return data;
      
    } catch (error) {
      console.error('❌ Error en createThesis:', error);
      throw error;
    }
  },

  // Obtener mi tesis
  async getMyThesis() {
    try {
      const token = localStorage.getItem('token');
      console.log('📖 Obteniendo mi tesis...');
      
      const response = await fetch(`${API_BASE}/thesis/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('📖 Mi tesis result:', data.hasThesis ? 'Tiene tesis' : 'Sin tesis');
      return data;
      
    } catch (error) {
      console.error('❌ Error en getMyThesis:', error);
      throw error;
    }
  }
};

export default thesisService;