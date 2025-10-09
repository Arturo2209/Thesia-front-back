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
  // 🆕 NUEVOS CAMPOS AGREGADOS:
  carrera?: string;
  ciclo?: number;
  codigo_estudiante?: string;
  telefono?: string;
  especialidad?: string;
}

// 🆕 NUEVO INTERFACE PARA ACTUALIZAR PERFIL
export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export const authService = {
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('💾 Datos guardados en localStorage');
        console.log('🎯 Es primer login:', data.isFirstLogin);
      }

      return data;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

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
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    const user = authService.getStoredUser();
    return !!(token && user);
  },

  isProfileCompleted: (): boolean => {
    const user = authService.getStoredUser();
    return !!(user?.profileCompleted || (user?.carrera && user?.codigo_estudiante));
  },

  // 🔧 MÉTODO ACTUALIZADO PARA COMPLETAR PERFIL CON APELLIDO
  updateUserProfile: async (profileData: {
    carrera: string;
    ciclo: number;
    codigo_estudiante?: string;
    nombre?: string;
    apellido?: string;  // 🔧 NUEVO CAMPO AGREGADO
  }): Promise<UpdateProfileResponse> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('📤 === ENVIANDO AL SERVIDOR (authService) ===');
      console.log('Datos completos a enviar:', profileData);
      console.log('nombre:', profileData.nombre);
      console.log('apellido:', profileData.apellido);  // 🔧 NUEVO LOG
      console.log('carrera:', profileData.carrera);
      console.log('ciclo:', profileData.ciclo);
      console.log('codigo_estudiante:', profileData.codigo_estudiante);
      console.log('===========================================');

      const requestBody = {
        carrera: profileData.carrera,
        ciclo: profileData.ciclo,
        codigo_estudiante: profileData.codigo_estudiante,
        nombre: profileData.nombre,
        apellido: profileData.apellido,  // 🔧 INCLUIR APELLIDO EN EL REQUEST
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

      console.log('📥 === RESPUESTA DEL SERVIDOR (authService) ===');
      console.log('Data completa recibida:', data);
      if (data.user) {
        console.log('Usuario actualizado:', data.user);
        console.log('nombre en respuesta:', data.user.name);
        console.log('codigo_estudiante en respuesta:', data.user.codigo_estudiante);
        console.log('carrera en respuesta:', data.user.carrera);
        console.log('profileCompleted en respuesta:', data.user.profileCompleted);
      }
      console.log('===============================================');

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

  logout: async (): Promise<void> => {
    try {
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
    }
  }
};

export default authService;
export type { AuthResponse };