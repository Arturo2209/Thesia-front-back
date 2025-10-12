// 📋 TIPOS PRINCIPALES PARA MENSAJES
export interface Message {
    id_message: number;
    sender_id: number;
    receiver_id: number;
    message_text: string;
    message_type: 'text' | 'file' | 'system';
    file_url?: string;
    file_name?: string;
    is_read: boolean;
    conversation_id: string;
    reply_to_id?: number;
    created_at: string;
    updated_at: string;
    
    // 📝 Datos adicionales del frontend
    sender_name?: string;
    sender_avatar?: string;
    is_own_message?: boolean;
    sending?: boolean; // Estado temporal mientras se envía
  }
  
  // 📡 TIPOS PARA API RESPONSES
  export interface GetMessagesResponse {
    success: boolean;
    messages: Message[];
    total: number;
    has_more: boolean;
    conversation_id: string;
    message?: string;
  }
  
  export interface SendMessageResponse {
    success: boolean;
    message: Message;
    message_text?: string;
  }
  
  export interface MarkAsReadResponse {
    success: boolean;
    updated_count: number;
    message?: string;
  }
  
  // 🎭 TIPOS PARA PROPS DE COMPONENTES
  export interface ChatComponentProps {
    advisor: {
      id: number;
      name: string;
      avatar_url?: string;
    };
    student: {
      id: number;
      name: string;
      avatar_url?: string;
    };
  }
  
  export interface MessageItemProps {
    message: Message;
    isOwnMessage: boolean;
    showAvatar?: boolean;
  }
  
  export interface ChatInputProps {
    onSendMessage: (text: string) => Promise<void>;
    disabled?: boolean;
    placeholder?: string;
  }
  
  // 📋 TIPOS PARA ESTADOS DEL CHAT
  export interface ChatState {
    messages: Message[];
    loading: boolean;
    sending: boolean;
    error: string | null;
    hasMore: boolean;
    conversationId: string;
  }
  
  // 🔧 TIPOS PARA PAYLOAD DE ENVÍO
  export interface SendMessagePayload {
    receiver_id: number;
    message_text: string;
    message_type?: 'text' | 'file';
    reply_to_id?: number;
  }
  
  // 📊 TIPOS PARA CONVERSACIÓN
  export interface Conversation {
    conversation_id: string;
    participant_id: number;
    participant_name: string;
    participant_avatar?: string;
    last_message?: Message;
    unread_count: number;
    updated_at: string;
  }
  
  // 📅 TIPOS PARA FILTROS Y PAGINACIÓN
  export interface MessageFilters {
    limit?: number;
    offset?: number;
    before_id?: number;
    after_id?: number;
    only_unread?: boolean;
  }