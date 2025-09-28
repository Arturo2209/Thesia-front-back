import apiService from './api';
import type { AuthApiResponse } from '../types/api.types';

// Tipos para autenticación
export interface User {
    email: string;
    name: string;
    picture: string;
    role: 'estudiante' | 'asesor' | 'coordinador';
    isVerified: boolean;
    profileCompleted?: boolean; // 👈 NUEVO CAMPO
    carrera?: string;           // 👈 NUEVO CAMPO
    ciclo?: number;             // 👈 NUEVO CAMPO
  }

  export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
    isFirstLogin?: boolean; // 👈 NUEVO CAMPO
  }

export interface UpdateProfileResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string; // 👈 INCLUIR token aquí
  }

export const authService = {
  // Verificar token de Google con el backend
  verifyGoogleToken: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/auth/google/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: AuthResponse = await response.json();
  
      if (data.success && data.user && data.token) {
        // Guardar datos en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('💾 Datos guardados en localStorage');
        console.log('🎯 Es primer login:', data.isFirstLogin);
        
        return data;
      } else {
        console.error('❌ Error en respuesta del servidor:', data.message);
        return data;
      }
  
    } catch (error) {
      console.error('❌ Error verificando token:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión'
      };
    }
  },

  // Obtener usuario actual desde el backend
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      // Limpiar datos si hay error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Obtener usuario desde localStorage
  getStoredUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Obtener token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },
  isProfileCompleted: (): boolean => {
    const user = authService.getStoredUser();
    return user?.profileCompleted === true;
  },
  updateUserProfile: async (profileData: {
    carrera: string;
    ciclo: number;
  }): Promise<UpdateProfileResponse> => { // 👈 CAMBIAR el tipo de retorno
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          carrera: profileData.carrera,
          ciclo: profileData.ciclo,
          profileCompleted: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateProfileResponse = await response.json(); // 👈 TIPAR la respuesta

      if (data.success && data.user) {
        // Actualizar datos locales
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Actualizar token si viene uno nuevo
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        console.log('✅ Perfil actualizado exitosamente');
        return data;
      } else {
        console.error('❌ Error actualizando perfil:', data.message);
        return data;
      }

    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión con el servidor'
      };
    }
  },
  // Logout
  logout: async (): Promise<void> => {
    try {
      // Llamar endpoint de logout
      const response = await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Error en logout del servidor, pero continuando...');
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

export default authService;