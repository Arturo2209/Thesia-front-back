import { apiService } from './api';

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  isFirstLogin?: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role: 'estudiante' | 'asesor' | 'coordinador';
  isVerified?: boolean;
  profileCompleted?: boolean;
  // Campos adicionales:
  carrera?: string;
  ciclo?: number;
  codigo_estudiante?: string;
  telefono?: string;
  especialidad?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

// Interfaces para login tradicional
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export const authService = {
  // ========== MÉTODOS PARA GOOGLE AUTH ==========
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
      
      if (data.success && data.token) {
        const isAdvisor = data.user?.role === 'asesor';
        const userForFrontend = {
          ...data.user,
          profileCompleted: isAdvisor ? true : data.user?.profileCompleted,
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userForFrontend));
        console.log('💾 Datos guardados en localStorage (Google)');
        console.log('🎯 Es primer login:', data.isFirstLogin);
      }

      return data;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // ========== MÉTODOS PARA LOGIN TRADICIONAL ==========
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log('🔐 === INICIANDO LOGIN TRADICIONAL ===');
      console.log('📧 Email:', credentials.email);
      
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      
      console.log('📊 [authService] Respuesta del servidor:', response);
      if (response.success && response.token && response.user) {
        // Adaptar el objeto user para frontend
        const isAdvisor = (response.user.rol || response.user.role) === 'asesor';
        const userForFrontend = {
          id: response.user.id_usuario || response.user.id,
          email: response.user.correo_institucional || response.user.email,
          name: response.user.nombre && response.user.apellido ? `${response.user.nombre} ${response.user.apellido}` : response.user.nombre || response.user.name,
          role: response.user.rol || response.user.role,
          picture: response.user.avatar_url || response.user.picture,
          especialidad: response.user.especialidad,
          profileCompleted: isAdvisor ? true : response.user.profileCompleted,
        };
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userForFrontend));
        console.log('✅ [authService] LOGIN TRADICIONAL EXITOSO');
        console.log('💾 [authService] Token guardado:', response.token.substring(0, 20) + '...');
        console.log('👤 [authService] Usuario guardado:', userForFrontend);
        // Verificar que se guardó correctamente
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        console.log('🔍 [authService] Verificación almacenamiento:', {
          tokenSaved: savedToken ? 'Sí' : 'No',
          userSaved: savedUser ? 'Sí' : 'No',
          userData: savedUser
        });
      } else {
        console.log('❌ [authService] Login tradicional fallido:', response.message);
      }

      return response;
    } catch (error: any) {
      console.error('❌ [authService] ERROR EN LOGIN TRADICIONAL');
      console.error('Error completo:', error);
      
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión con el servidor' 
      };
    }
  },

  // ========== MÉTODOS COMUNES ==========
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = authService.getToken();
      if (!token) return null;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  getStoredUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('👤 No hay usuario en localStorage');
        return null;
      }
      
      const user = JSON.parse(userStr);
      console.log('👤 Usuario actual obtenido:', user.email, '- Rol:', user.role);
      return user;
    } catch (error) {
      console.error('❌ Error obteniendo usuario actual:', error);
      localStorage.removeItem('user'); // Limpiar dato corrupto
      return null;
    }
  },

  getToken: (): string | null => {
    const token = localStorage.getItem('token');
    console.log('🎫 Token disponible:', token ? 'Sí (' + token.substring(0, 20) + '...)' : 'No');
    return token;
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    const user = authService.getStoredUser();
    const isAuth = !!(token && user);
    
    console.log('🔍 === VERIFICANDO AUTENTICACIÓN ===');
    console.log('Token presente:', token ? 'Sí' : 'No');
    console.log('Usuario presente:', user ? 'Sí' : 'No');
    console.log('¿Está autenticado?', isAuth ? 'SÍ' : 'NO');
    
    return isAuth;
  },

  isProfileCompleted: (): boolean => {
    const user = authService.getStoredUser();
    return !!(user?.profileCompleted || (user?.carrera && user?.codigo_estudiante));
  },

  updateUserProfile: async (profileData: {
    carrera: string;
    ciclo: number;
    codigo_estudiante?: string;
    nombre?: string;
    apellido?: string;
  }): Promise<UpdateProfileResponse> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('📤 === ENVIANDO AL SERVIDOR (authService) ===');
      console.log('Datos completos a enviar:', profileData);

      const requestBody = {
        carrera: profileData.carrera,
        ciclo: profileData.ciclo,
        codigo_estudiante: profileData.codigo_estudiante,
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        profileCompleted: true
      };

      console.log('📦 Body final del request:', requestBody);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateProfileResponse = await response.json();

      console.log('📥 === RESPUESTA DEL SERVIDOR ===');
      console.log('Data completa recibida:', data);

      if (data.success && data.user) {
        // Actualizar datos locales
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('💾 Usuario actualizado en localStorage:', data.user);
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('🔑 Token actualizado en localStorage');
        }
        
        console.log('✅ Perfil actualizado exitosamente');
        return data;
      } else {
        console.error('❌ Error actualizando perfil:', data.message);
        throw new Error(data.message || 'Error actualizando perfil');
      }

    } catch (error) {
      console.error('❌ Error en updateUserProfile:', error);
      throw error;
    }
  },

  // Verificar token (llamada al backend)
  verifyToken: async (): Promise<{ valid: boolean; user?: User }> => {
    try {
      console.log('🔍 Verificando token con el servidor...');
      
      const response = await apiService.get<{ success: boolean; user: User }>('/auth/verify');
      
      console.log('✅ Token válido:', response.user?.email);
      return {
        valid: response.success,
        user: response.user
      };
    } catch (error) {
      console.error('❌ Token inválido o expirado:', error);
      return { valid: false };
    }
  },

  logout: async (): Promise<void> => {
    try {
      console.log('🚪 === CERRANDO SESIÓN ===');
      
      const token = authService.getToken();
      if (token) {
        await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ Sesión cerrada correctamente');
    }
  }
};

// Exportaciones individuales para compatibilidad
export const login = authService.login;
export const logout = authService.logout;
export const getCurrentUser = authService.getCurrentUser;
export const getToken = authService.getToken;
export const isAuthenticated = authService.isAuthenticated;

export default authService;
export type { AuthResponse };