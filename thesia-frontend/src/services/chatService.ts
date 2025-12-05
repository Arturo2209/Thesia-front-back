import apiService from './api';

export interface RawMessage {
  id_mensaje: number;
  contenido: string;
  fecha_envio: string;
  tipo: string; // 'texto'
  id_remitente: number;
  nombre?: string;
  apellido?: string;
  avatar_url?: string | null;
}

export interface GetMessagesResponse {
  success: boolean;
  messages: RawMessage[];
  total: number;
}

export interface SendMessageResponse {
  success: boolean;
  message: RawMessage;
}

const chatService = {
  // Nota: el backend de chat no usa el envoltorio ApiResponse estándar, así que devolvemos el JSON tal cual
  getMessages: async (endpointSuffix: string = ''): Promise<any> => {
    const resp = await apiService.get<any>(`/chat/messages${endpointSuffix}`);
    return resp;
  },
  sendMessage: async (recipientId: number, content: string): Promise<any> => {
    const resp = await apiService.post<any>('/chat/send', { recipientId, content });
    return resp;
  },
  sendFile: async (recipientId: number, file: File): Promise<any> => {
    const form = new FormData();
    form.append('recipientId', String(recipientId));
    form.append('file', file);
    const resp = await apiService.post<any>('/chat/send', form);
    return resp;
  }
};

export default chatService;
