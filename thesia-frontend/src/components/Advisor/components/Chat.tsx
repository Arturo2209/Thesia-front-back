import React, { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { authService } from '../../../services/authService';
import chatService from '../../../services/chatService';
import { chatStyles } from '../styles/Chat.styles';
import type { Advisor } from '../types/advisor.types';
import { io, type Socket } from 'socket.io-client';

// 📋 TIPOS LOCALES
interface Message {
  id_message: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  message_type: 'text' | 'file' | 'image' | 'system';
  file_url?: string;
  file_name?: string;
  is_read: boolean;
  conversation_id: string;
  reply_to_id?: number;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  sender_avatar?: string;
  is_own_message?: boolean;
  sending?: boolean;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  hasMore: boolean;
  conversationId: string;
}

interface ChatProps {
  advisor: Advisor;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  picture?: string;
}

// (Se removió el almacenamiento en localStorage para mantener el chat limpio y en tiempo real)

const Chat: React.FC<ChatProps> = ({ advisor }) => {
  // Altura fija por breakpoint para que no cambie al alternar pestañas
  const getChatHeight = () => {
    const w = window.innerWidth;
    if (w <= 480) return 520; // móvil
    if (w <= 768) return 560; // tablet vertical
    if (w <= 1024) return 640; // tablet horizontal / laptops pequeñas
    return 700; // desktop
  };

  const [chatHeight, setChatHeight] = useState<number>(() => {
    if (typeof window === 'undefined') return 700;
    return getChatHeight();
  });

  useEffect(() => {
    const onResize = () => setChatHeight(getChatHeight());
    window.addEventListener('resize', onResize);
    // Debug para confirmar aplicación de altura
    console.log('[Chat] Altura inicial calculada:', getChatHeight());
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    loading: false,
    sending: false,
    error: null,
    hasMore: true,
    conversationId: ''
  });

  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  // const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // 🔄 Cargar usuario actual
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        console.log('🔍 Intentando cargar usuario desde API...');
        
        const user = await authService.getCurrentUser();
        
        if (user) {
          setCurrentUser({
            id: user.id,
            name: user.name || 'Usuario',
            email: user.email,
            picture: user.picture || undefined
          });
          console.log('✅ Usuario configurado para el chat desde API');
          return;
        }
        
      } catch (apiError) {
        console.warn('⚠️ Error con API, usando fallback localStorage:', apiError);
        
        try {
          const userData = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          
          if (userData && token) {
            const user = JSON.parse(userData);
            setCurrentUser({
              id: user.id || user.id_usuario,
              name: user.name || user.nombre_completo || user.nombre || 'Usuario',
              email: user.email || user.correo_institucional,
              picture: user.picture || user.avatar_url || undefined
            });
            console.log('✅ Usuario configurado desde localStorage');
            return;
          }
          
        } catch (fallbackError) {
          console.error('❌ Error en fallback localStorage:', fallbackError);
        }
        
        setChatState(prev => ({
          ...prev,
          error: 'No se pudo cargar la información del usuario.'
        }));
      }
    };

    loadCurrentUser();
  }, []);

  // 🎯 Generar ID de conversación normalizada (independiente del rol)
  // Para que asesor y estudiante compartan el mismo identificador local de la conversación,
  // ordenamos los IDs y usamos el formato menor-mayor. Esto evita tener "A-B" para un rol y "B-A" para el otro.
  useEffect(() => {
    if (currentUser && advisor.id) {
      const sortedIds = [currentUser.id, advisor.id].sort((a, b) => a - b);
      const normalizedId = `${sortedIds[0]}-${sortedIds[1]}`;
      setChatState(prev => ({ ...prev, conversationId: normalizedId }));
      console.log('💬 [Chat] Montando conversación normalizada:', normalizedId);
      loadMessages(normalizedId);
      // Segundo fetch rápido para capturar mensajes que entren justo antes del montaje
      setTimeout(() => {
        console.log('🔄 [Chat] Refresco post-montaje de la conversación:', normalizedId);
        loadMessages(normalizedId);
      }, 1500);

      // 🔌 Conectar Socket.IO y unirse a la sala de la conversación
      if (!socketRef.current) {
        const token = localStorage.getItem('token');
        socketRef.current = io('http://localhost:3001', {
          auth: { token },
          transports: ['websocket']
        });

        socketRef.current.on('connect', () => {
          console.log('🔌 [Chat] Socket conectado (frontend):', socketRef.current?.id, 'userId:', currentUser.id, 'peerId:', advisor.id);
          socketRef.current?.emit('join', advisor.id); // Unirse con el peer (asesor o estudiante)
        });

        socketRef.current.on('chat:new_message', (payload: any) => {
          console.log('📩 [Chat] Evento chat:new_message recibido:', payload?.message?.id_mensaje, 'room:', payload?.room, 'sender:', payload?.senderId);
          try {
            const m = payload?.message;
            if (!m) return;
            const isOwn = currentUser && m.id_remitente === currentUser.id;
            const newMsg: Message = {
              id_message: m.id_mensaje,
              sender_id: m.id_remitente,
              receiver_id: isOwn ? advisor.id : (currentUser?.id || 0),
              message_text: m.contenido,
              message_type: 'text',
              is_read: true,
              conversation_id: normalizedId,
              created_at: m.fecha_envio,
              updated_at: m.fecha_envio,
              sender_name: `${m.nombre || ''} ${m.apellido || ''}`.trim(),
              sender_avatar: m.avatar_url || undefined,
              is_own_message: !!isOwn
            };
            // Evitar duplicados por ID
            setChatState(prev => {
              if (prev.messages.some(x => x.id_message === newMsg.id_message)) {
                console.log('🔁 [Chat] Mensaje duplicado ignorado:', newMsg.id_message);
                return prev;
              }
              console.log('➕ [Chat] Añadiendo mensaje nuevo (socket):', newMsg.id_message);
              return { ...prev, messages: [...prev.messages, newMsg] };
            });
            scrollToBottom();
          } catch {}
        });

        socketRef.current.on('disconnect', () => {
          console.log('🔌 Socket desconectado');
        });
      }
    }
  }, [currentUser, advisor.id]);

  // 🔁 Polling para nuevos mensajes
  useEffect(() => {
    if (!chatState.conversationId) return;
    // Mantener un resync cada 60s por si algún evento se pierde
    const interval = setInterval(() => {
      if (!chatState.loading && !chatState.sending) {
        loadMessages(chatState.conversationId);
      }
    }, 60000);
    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatState.conversationId]);

  // (Se removió el guardado automático en localStorage)

  // 📜 Cargar mensajes desde el backend
  const loadMessages = async (conversationId: string) => {
    try {
      setChatState(prev => ({ ...prev, loading: true, error: null }));
      console.log('🔄 Cargando mensajes para conversación:', conversationId);

      // Construir endpoint según rol actual
      const storedUser = authService.getStoredUser();
      const isAdvisor = storedUser?.role === 'asesor';
  // Si el usuario actual es asesor, necesitamos el ID del estudiante (advisor.id representa al peer adaptado)
  // Si es estudiante, no enviamos query param porque el backend infiere su asesor.
  const endpointSuffix = isAdvisor ? `?studentId=${advisor.id}` : '';

      const resp = await chatService.getMessages(endpointSuffix);

      if (!resp?.success) {
        throw new Error(resp?.message || 'No se pudieron cargar los mensajes');
      }

      const mapped: Message[] = (resp.messages || []).map((m: any) => {
        const isOwn = m.id_remitente === storedUser?.id;
        return {
          id_message: m.id_mensaje,
          sender_id: m.id_remitente,
          receiver_id: isOwn ? advisor.id : (storedUser?.id || 0),
          message_text: m.contenido,
          message_type: m.tipo === 'texto' ? 'text' : 'text',
          is_read: true,
          conversation_id: conversationId,
          created_at: m.fecha_envio,
          updated_at: m.fecha_envio,
          sender_name: `${m.nombre || ''} ${m.apellido || ''}`.trim(),
          sender_avatar: m.avatar_url || undefined,
          is_own_message: isOwn
        } as Message;
      });

      setChatState(prev => ({
        ...prev,
        messages: mapped,
        hasMore: false,
        loading: false
      }));

      scrollToBottom();

    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
      setChatState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error cargando mensajes'
      }));
    }
  };

  // ✉️ Enviar mensaje
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !currentUser || chatState.sending) return;

    try {
      setChatState(prev => ({ ...prev, sending: true, error: null }));

      // Limpiar input inmediatamente
      setMessage('');

      // Enviar a backend
  // Determinar destinatario real: si soy asesor, advisor.id es el estudiante; si soy estudiante, advisor.id es el asesor.
  const recipientId = advisor.id;
  const resp = await chatService.sendMessage(recipientId, messageText);
      if (!resp?.success) {
        throw new Error(resp?.message || 'No se pudo enviar el mensaje');
      }

      const m = resp.message;
      const newMsg: Message = {
        id_message: m.id_mensaje,
        sender_id: m.id_remitente,
        receiver_id: advisor.id,
        message_text: m.contenido,
        message_type: 'text',
        is_read: true,
        conversation_id: chatState.conversationId,
        created_at: m.fecha_envio,
        updated_at: m.fecha_envio,
        sender_name: `${m.nombre || ''} ${m.apellido || ''}`.trim() || currentUser.name,
        sender_avatar: m.avatar_url || currentUser.picture,
        is_own_message: true
      };

      setChatState(prev => {
        // Evitar duplicado si el evento por socket llegó primero
        if (prev.messages.some(x => x.id_message === m.id_mensaje)) {
          console.log('🔁 [Chat] Respuesta de envío ya reflejada por socket, evitando duplicado:', m.id_mensaje);
          return { ...prev, sending: false };
        }
        return {
          ...prev,
          messages: [...prev.messages, newMsg],
          sending: false
        };
      });

      // Refresco corto para asegurar sincronización (puede duplicar pero se deduplica)
      setTimeout(() => {
        console.log('🔄 [Chat] Refresco tras envío para sincronizar mensajes remotos');
        loadMessages(chatState.conversationId);
      }, 800);

    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      setChatState(prev => ({
        ...prev,
        sending: false,
        error: 'Error enviando mensaje'
      }));
    }
  };

  // 📎 Manejar carga de archivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Subida de archivos no soportada aún en backend de chat
    event.target.value = '';
    alert('Adjuntar archivos aún no está soportado en el chat.');
  };

  // 🧹 Limpiar historial de chat (función opcional para debugging)
  const clearChatHistory = () => {
    if (confirm('¿Estás seguro de que quieres refrescar la conversación?')) {
      setChatState(prev => ({ ...prev, messages: [] }));
      if (chatState.conversationId) {
        loadMessages(chatState.conversationId);
      }
    }
  };

  // 🎬 Acciones rápidas
  const handleQuickAction = (action: string) => {
    const quickMessages: Record<string, string> = {
      'consulta': '¡Hola profesor! Tengo una consulta sobre mi tesis.',
      'reunion': 'Buenos días, ¿podríamos agendar una reunión?',
      'progreso': 'Hola, quería compartir el progreso de mi trabajo.',
      'revision': '¿Podría revisar el documento que le envié?',
      'duda': 'Tengo una duda específica sobre la metodología.'
    };

    const messageText = quickMessages[action];
    if (messageText) {
      handleSendMessage(messageText);
    }
  };

  // ⌨️ Manejar teclas
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSendMessage(message);
      }
    }
  };

  // 🎛️ Auto-resize del textarea
  const handleInputChange = (value: string) => {
    setMessage(value);
    
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  // 📍 Scroll automático
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 🎨 Obtener iniciales
  const getInitials = (name: string): string => {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // 🕒 Formatear tiempo
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estados de carga
  if (chatState.loading && chatState.messages.length === 0) {
    return (
      <div className="chat-container" style={{height: chatHeight, minHeight: chatHeight, maxHeight: chatHeight}}>
        <div className="chat-loading">
          <div className="chat-spinner"></div>
          Cargando conversación...
        </div>
        <style>{chatStyles}</style>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="chat-container" style={{height: chatHeight, minHeight: chatHeight, maxHeight: chatHeight}}>
        <div className="chat-loading">
          <div className="chat-spinner"></div>
          Cargando usuario...
        </div>
        <style>{chatStyles}</style>
      </div>
    );
  }

  return (
    <div className="chat-container" style={{height: chatHeight, minHeight: chatHeight, maxHeight: chatHeight}}>
      {/* === CHAT HEADER MEJORADO === */}
      <div className="chat-header">
        <div className="chat-header-avatar">
          {advisor.avatar_url ? (
            <img src={advisor.avatar_url} alt={advisor.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
          ) : (
            getInitials(advisor.name)
          )}
        </div>
        <div className="chat-header-info">
          <h4>{advisor.name}</h4>
          <p>{advisor.specialty}</p>
        </div>
        {/* Estado eliminado por requerimiento (Disponible/Ocupado oculto) */}
        
        {/* BOTÓN DE DEBUG (solo en desarrollo) */}
        {import.meta.env.DEV && (
          <button 
            onClick={clearChatHistory}
            style={{
              marginLeft: '8px',
              padding: '4px 8px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            title="Limpiar historial (solo desarrollo)"
          >
            🧹
          </button>
        )}
      </div>

      {/* === QUICK ACTIONS === */}
      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => handleQuickAction('consulta')}>
          ❓ Consulta
        </button>
        <button className="quick-action-btn" onClick={() => handleQuickAction('reunion')}>
          📅 Reunión  
        </button>
        <button className="quick-action-btn" onClick={() => handleQuickAction('progreso')}>
          📈 Progreso
        </button>
        <button className="quick-action-btn" onClick={() => handleQuickAction('revision')}>
          👁️ Revisión
        </button>
        <button className="quick-action-btn" onClick={() => handleQuickAction('duda')}>
          🤔 Duda
        </button>
      </div>

      {/* === MESSAGES AREA === */}
      <div className="messages-container">
        {chatState.error && (
          <div className="error-message" style={{ 
            background: '#fee2e2', 
            color: '#991b1b', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px' 
          }}>
            ❌ {chatState.error}
          </div>
        )}

        {chatState.messages.length === 0 && !chatState.loading ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <h4>¡Inicia la conversación!</h4>
            <p>Envía tu primer mensaje a {advisor.name}</p>
          </div>
        ) : (
          <>
            {chatState.messages.map((msg) => (
              <div key={msg.id_message} className={`message-item ${msg.is_own_message ? 'own' : 'other'}`}>
                <div className={`message-bubble ${msg.is_own_message ? 'own' : 'other'} ${
                  msg.sending ? 'message-sending' : ''
                }`}>
                  <div className="message-content">
                    {msg.message_type === 'image' && msg.file_url ? (
                      <div className="message-image">
                        <img src={msg.file_url} alt={msg.file_name} style={{maxWidth: '200px', borderRadius: '8px'}} />
                        <span>{msg.file_name}</span>
                      </div>
                    ) : msg.message_type === 'file' && msg.file_url ? (
                      <div className="message-file">
                        <div className="file-icon">📄</div>
                        <a href={msg.file_url} download={msg.file_name} target="_blank" rel="noopener noreferrer">
                          {msg.file_name}
                        </a>
                      </div>
                    ) : (
                      <span>{msg.message_text}</span>
                    )}
                  </div>
                  
                  <div className="message-time">
                    {formatTime(msg.created_at)}
                  </div>
                  
                  {msg.is_own_message && (
                    <div className="message-status">
                      {msg.sending && '⏳'}
                      {!msg.sending && !msg.is_read && '✓'}
                      {!msg.sending && msg.is_read && '✓✓'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* === CHAT INPUT === */}
      <div className="chat-input-container">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        <button 
          className="chat-attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={chatState.sending}
          title="Adjuntar archivo (imágenes, PDF, Word, texto)"
        >
          {'📎'}
        </button>

        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Escribe un mensaje a ${advisor.name}...`}
          className="chat-input"
          disabled={chatState.sending}
          rows={1}
        />

        <button
          onClick={() => handleSendMessage(message)}
          disabled={chatState.sending || !message.trim()}
          className="chat-send-btn"
          title="Enviar mensaje (Enter)"
        >
          {chatState.sending ? '⏳' : '🚀'}
        </button>
      </div>

      <style>{chatStyles}</style>
    </div>
  );
};

export default Chat;