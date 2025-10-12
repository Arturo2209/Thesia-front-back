import React, { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { authService } from '../../../services/authService';
import { chatStyles } from '../styles/Chat.styles';
import type { Advisor } from '../types/advisor.types';

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

// 🗄️ FUNCIONES PARA LOCALSTORAGE
const CHAT_STORAGE_KEY = 'thesia_chat_messages';

const saveChatMessages = (conversationId: string, messages: Message[]) => {
  try {
    const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    allChats[conversationId] = {
      messages: messages,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
    console.log('💾 Mensajes guardados en localStorage para conversación:', conversationId);
  } catch (error) {
    console.error('❌ Error guardando mensajes en localStorage:', error);
  }
};

const loadChatMessages = (conversationId: string): Message[] => {
  try {
    const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    const chatData = allChats[conversationId];
    
    if (chatData && chatData.messages) {
      console.log('📂 Mensajes cargados desde localStorage:', chatData.messages.length);
      return chatData.messages;
    }
    
    console.log('📂 No hay mensajes previos para esta conversación');
    return [];
  } catch (error) {
    console.error('❌ Error cargando mensajes desde localStorage:', error);
    return [];
  }
};

const Chat: React.FC<ChatProps> = ({ advisor }) => {
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
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 🎯 Generar ID de conversación y cargar mensajes
  useEffect(() => {
    if (currentUser && advisor.id) {
      const conversationId = `${currentUser.id}-${advisor.id}`;
      setChatState(prev => ({ ...prev, conversationId }));
      loadMessages(conversationId);
    }
  }, [currentUser, advisor.id]);

  // 💾 Guardar mensajes automáticamente cuando cambien
  useEffect(() => {
    if (chatState.conversationId && chatState.messages.length > 0 && !chatState.loading) {
      // Filtrar mensajes temporales (sending: true) antes de guardar
      const permanentMessages = chatState.messages.filter(msg => !msg.sending);
      if (permanentMessages.length > 0) {
        saveChatMessages(chatState.conversationId, permanentMessages);
      }
    }
  }, [chatState.messages, chatState.conversationId, chatState.loading]);

  // 📜 Cargar mensajes (localStorage + simulados si es primera vez)
  const loadMessages = async (conversationId: string) => {
    try {
      setChatState(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('🔄 Cargando mensajes para conversación:', conversationId);
      
      // 📂 INTENTAR CARGAR DESDE LOCALSTORAGE PRIMERO
      const savedMessages = loadChatMessages(conversationId);
      
      if (savedMessages.length > 0) {
        console.log('📂 Usando mensajes guardados desde localStorage');
        setChatState(prev => ({
          ...prev,
          messages: savedMessages,
          hasMore: false,
          loading: false
        }));
        scrollToBottom();
        return;
      }
      
      console.log('🆕 Primera vez en esta conversación, creando mensajes iniciales...');
      
      // 🎭 MENSAJES SIMULADOS SOLO SI NO HAY MENSAJES PREVIOS
      const simulatedMessages: Message[] = [
        {
          id_message: 1,
          sender_id: advisor.id,
          receiver_id: currentUser?.id || 0,
          message_text: '¡Hola! Bienvenido a nuestro chat. ¿En qué puedo ayudarte con tu tesis?',
          message_type: 'text',
          is_read: true,
          conversation_id: conversationId,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          sender_name: advisor.name,
          sender_avatar: advisor.avatar_url || undefined,
          is_own_message: false
        }
      ];

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      setChatState(prev => ({
        ...prev,
        messages: simulatedMessages,
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

      const tempMessage: Message = {
        id_message: Date.now(),
        sender_id: currentUser.id,
        receiver_id: advisor.id,
        message_text: messageText,
        message_type: 'text',
        is_read: false,
        conversation_id: chatState.conversationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender_name: currentUser.name,
        sender_avatar: currentUser.picture,
        is_own_message: true,
        sending: true
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, tempMessage]
      }));

      setMessage('');
      scrollToBottom();

      await new Promise(resolve => setTimeout(resolve, 1500));

      // 🔄 Convertir mensaje temporal a permanente
      const permanentMessage = { ...tempMessage, sending: false };
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id_message === tempMessage.id_message 
            ? permanentMessage
            : msg
        ),
        sending: false
      }));

      // 🤖 Respuesta automática del asesor
      setTimeout(() => {
        const responseMessage: Message = {
          id_message: Date.now() + 1,
          sender_id: advisor.id,
          receiver_id: currentUser.id,
          message_text: 'Gracias por tu mensaje. Lo revisaré y te responderé pronto.',
          message_type: 'text',
          is_read: false,
          conversation_id: chatState.conversationId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sender_name: advisor.name,
          sender_avatar: advisor.avatar_url || undefined,
          is_own_message: false
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, responseMessage]
        }));

        scrollToBottom();
      }, 2000);

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
    const files = event.target.files;
    if (!files || files.length === 0 || !currentUser) return;

    const file = files[0];
    
    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ El archivo es muy grande. Máximo 10MB permitido.');
      return;
    }

    // Validar tipo
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('❌ Tipo de archivo no permitido. Solo imágenes, PDF, Word y texto.');
      return;
    }

    try {
      setUploadingFile(true);
      console.log('📎 Subiendo archivo:', file.name);

      // Simular subida de archivo
      await new Promise(resolve => setTimeout(resolve, 2000));

      const fileMessage: Message = {
        id_message: Date.now(),
        sender_id: currentUser.id,
        receiver_id: advisor.id,
        message_text: `📎 ${file.name}`,
        message_type: file.type.startsWith('image/') ? 'image' : 'file',
        file_url: URL.createObjectURL(file), // En producción sería la URL del servidor
        file_name: file.name,
        is_read: false,
        conversation_id: chatState.conversationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender_name: currentUser.name,
        sender_avatar: currentUser.picture,
        is_own_message: true
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, fileMessage]
      }));

      scrollToBottom();
      console.log('✅ Archivo enviado exitosamente');

    } catch (error) {
      console.error('❌ Error subiendo archivo:', error);
      alert('❌ Error subiendo el archivo. Intenta nuevamente.');
    } finally {
      setUploadingFile(false);
      event.target.value = ''; // Limpiar input
    }
  };

  // 🧹 Limpiar historial de chat (función opcional para debugging)
  const clearChatHistory = () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el historial del chat?')) {
      try {
        const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
        delete allChats[chatState.conversationId];
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
        
        setChatState(prev => ({ ...prev, messages: [] }));
        loadMessages(chatState.conversationId);
        
        console.log('🧹 Historial del chat eliminado');
      } catch (error) {
        console.error('❌ Error limpiando historial:', error);
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
      <div className="chat-container">
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
      <div className="chat-container">
        <div className="chat-loading">
          <div className="chat-spinner"></div>
          Cargando usuario...
        </div>
        <style>{chatStyles}</style>
      </div>
    );
  }

  return (
    <div className="chat-container">
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
        <div className="chat-status online">
          🟢 Disponible
        </div>
        
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
          disabled={chatState.sending || uploadingFile}
          title="Adjuntar archivo (imágenes, PDF, Word, texto)"
        >
          {uploadingFile ? '⏳' : '📎'}
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