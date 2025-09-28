import type { ConnectionTestResponse, UsersTestResponse, ApiResponse } from '../types/api.types';

const API_BASE_URL = 'http://localhost:3001/api';

// Configuración base para fetch
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Servicio base para llamadas API
export const apiService = {
  // Función de prueba de conexión
  testConnection: async (): Promise<ConnectionTestResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/test-connection`, {
        method: 'GET',
        ...fetchConfig,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error conectando con el backend:', error);
      throw error;
    }
  },

  // Obtener usuarios de prueba
  getTestUsers: async (): Promise<UsersTestResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/test`, {
        method: 'GET',
        ...fetchConfig,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Función genérica para hacer peticiones GET
  get: async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        ...fetchConfig,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error en GET ${endpoint}:`, error);
      throw error;
    }
  },

  // Función genérica para hacer peticiones POST
  post: async <T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        ...fetchConfig,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error en POST ${endpoint}:`, error);
      throw error;
    }
  },

  // Función para check de salud del servidor
  healthCheck: async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en health check:', error);
      throw error;
    }
  }
};

// Exportar también como default
export default apiService;