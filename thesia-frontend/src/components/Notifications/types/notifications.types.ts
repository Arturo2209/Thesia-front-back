// Tipos basados en tu tabla real de BD
export interface NotificationData {
    id_notificacion: number;
    id_usuario: number;
    mensaje: string;
    tipo: 'plazo' | 'comentario' | 'reunion' | 'estado' | 'general' | 'documento';
    fecha_envio: string;
    leido: 0 | 1;
    id_referencia?: number;
    tipo_referencia?: 'documento' | 'reunion' | 'tesis' | 'comentario';
    prioridad: 'baja' | 'media' | 'alta';
    fecha_creacion: string;
    fecha_modificacion: string;
  }
  
  // Tipo transformado para el frontend
  export interface Notification {
    id: number;
    userId: number;
    message: string;
    type: 'plazo' | 'comentario' | 'reunion' | 'estado' | 'general' | 'documento';
    isRead: boolean;
    referenceId?: number;
    referenceType?: 'documento' | 'reunion' | 'tesis' | 'comentario';
    priority: 'baja' | 'media' | 'alta';
    createdAt: string;
    sentAt: string;
    // Campos adicionales calculados
    timeAgo: string;
    icon: string;
    color: string;
    actionUrl?: string;
  }
  
  export interface NotificationsState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    unreadCount: number;
    filter: NotificationFilter;
    hasMore: boolean;
    page: number;
  }
  
  export interface NotificationFilter {
    type?: NotificationData['tipo'] | 'all';
    priority?: NotificationData['prioridad'] | 'all';
    isRead?: boolean | 'all';
    dateRange?: {
      from: string;
      to: string;
    };
  }
  
  export interface NotificationsApiResponse {
    success: boolean;
    message: string;
    notifications: NotificationData[];
    total: number;
    unreadCount: number;
    page: number;
    hasMore: boolean;
  }
  
  export interface MarkAsReadResponse {
    success: boolean;
    message: string;
    updatedCount: number;
  }