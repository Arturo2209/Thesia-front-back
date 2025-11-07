// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    timestamp?: string;
    // Agregar propiedades adicionales para auth
    token?: string;
    user?: any;
  }
  
  export interface ConnectionTestResponse {
    success: boolean;
    message: string;
    backend: string;
    port: number;
    timestamp: string;
    status: string;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    role: 'estudiante' | 'asesor' | 'coordinador';
    avatar?: string;
  }
  
  export interface UsersTestResponse {
    success: boolean;
    message: string;
    users: User[];
  }
  
  // Tipo específico para respuesta de autenticación
  export interface AuthApiResponse {
    success: boolean;
    message: string;
    user?: {
      email: string;
      name: string;
      picture: string;
      role: 'estudiante' | 'asesor' | 'coordinador';
      isVerified: boolean;
    };
    token?: string;
  }

  export interface Notification {
    id: number;
    type: string;
    message: string;
    timeAgo: string;
  }