import type { ConnectionTestResponse, UsersTestResponse, ApiResponse } from '../types/api.types';

const API_BASE_URL = 'http://localhost:3001/api';

// Función para obtener headers con token
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  
  // Solo agregar Content-Type si NO es FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token agregado a headers');
  } else {
    console.log('⚠️ No se encontró token en localStorage');
  }
  
  return headers;
};

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

  // Función genérica para hacer peticiones GET (CON AUTENTICACIÓN)
  get: async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      console.log('📡 GET request a:', endpoint);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getAuthHeaders(), // 🔑 AGREGAMOS AUTENTICACIÓN AQUÍ
      });
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('🚪 Token expirado o inválido');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Opcional: redirigir a login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ GET exitoso:', endpoint);
      return data;
    } catch (error) {
      console.error(`❌ Error en GET ${endpoint}:`, error);
      throw error;
    }
  },

  // Función genérica para hacer peticiones POST (CON AUTENTICACIÓN)
  post: async <T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      console.log('📡 POST request a:', endpoint);
      
      // 🔧 DETECTAR SI ES FORMDATA
      const isFormData = data instanceof FormData;
      
      console.log('🔍 Tipo de datos:', isFormData ? 'FormData' : 'JSON');
      
      if (isFormData) {
        // 📋 Log del contenido del FormData
        console.log('📋 Contenido del FormData:');
        for (const [key, value] of data.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}:`, {
              name: value.name,
              size: value.size,
              type: value.type
            });
          } else {
            console.log(`  ${key}:`, value);
          }
        }
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(isFormData), // 🔑 Pasar flag isFormData
        body: isFormData ? data : JSON.stringify(data), // 🔧 No hacer stringify si es FormData
      });
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('🚪 Token expirado o inválido');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ POST exitoso:', endpoint);
      return result;
    } catch (error) {
      console.error(`❌ Error en POST ${endpoint}:`, error);
      throw error;
    }
  },

  // Función genérica para hacer peticiones PUT (CON AUTENTICACIÓN)
  put: async <T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      console.log('📡 PUT request a:', endpoint);
      
      const isFormData = data instanceof FormData;
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('🚪 Token expirado o inválido');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ PUT exitoso:', endpoint);
      return result;
    } catch (error) {
      console.error(`❌ Error en PUT ${endpoint}:`, error);
      throw error;
    }
  },

  // Función genérica para hacer peticiones DELETE (CON AUTENTICACIÓN)
  delete: async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      console.log('📡 DELETE request a:', endpoint);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('🚪 Token expirado o inválido');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ DELETE exitoso:', endpoint);
      return result;
    } catch (error) {
      console.error(`❌ Error en DELETE ${endpoint}:`, error);
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

// Exportaciones individuales para compatibilidad
export const get = apiService.get;
export const post = apiService.post;
export const put = apiService.put;
export const del = apiService.delete;

// Exportar también como default
export default apiService;