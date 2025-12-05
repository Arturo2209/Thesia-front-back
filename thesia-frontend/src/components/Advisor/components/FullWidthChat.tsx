import React, { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Advisor } from '../types/advisor.types';
import { fullChatStyles } from '../styles/FullWidthChat.styles';
import { authService } from '../../../services/authService';
import chatService from '../../../services/chatService';
import { io, type Socket } from 'socket.io-client';

interface Message {
  id_message: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  created_at: string;
  is_own_message?: boolean;
  message_type?: 'text' | 'file' | 'image' | 'system';
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  picture?: string;
}

interface FullWidthChatProps {
  advisor: Advisor;
}

const FullWidthChat: React.FC<FullWidthChatProps> = ({ advisor }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState('');
  const [socketStatus, setSocketStatus] = useState<'connected'|'connecting'|'disconnected'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const initialLoadDoneRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const lastMessageIdRef = useRef<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) throw new Error('No user');
        setCurrentUser({ id: user.id, name: user.name || 'Usuario', email: user.email, picture: user.picture || undefined });
        setLoading(true);
        const storedUser = authService.getStoredUser();
        const isAdvisor = storedUser?.role === 'asesor';
        const endpointSuffix = isAdvisor ? `?studentId=${advisor.id}` : '';
        const resp = await chatService.getMessages(endpointSuffix);
        if (!resp?.success) throw new Error(resp?.message || 'No se pudieron cargar los mensajes');
        const mapped: Message[] = (resp.messages || []).map((m: any) => ({
          id_message: m.id_mensaje,
          sender_id: m.id_remitente,
          receiver_id: m.id_destinatario ?? advisor.id,
          message_text: m.contenido,
          created_at: m.fecha_envio,
          is_own_message: m.id_remitente === user.id,
          message_type: m.tipo === 'archivo' ? 'file' : 'text'
        }));
        setMessages(mapped);
        if (mapped.length > 0) {
          lastMessageIdRef.current = mapped[mapped.length - 1].id_message;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error cargando conversación');
      } finally {
        setLoading(false);
        // Evitar auto-scroll al fondo en la primera carga
        initialLoadDoneRef.current = true;
      }
    };
    load();
  }, [advisor.id]);

  // Scroll automático siempre que cambie la lista de mensajes
  useEffect(() => {
    // No auto-scroll en el primer render; sólo en mensajes nuevos
    if (!initialLoadDoneRef.current) return;
    scrollToBottom();
  }, [messages.length]);

  // Conexión Socket.IO para tiempo real
  useEffect(() => {
    const setupSocket = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) return;
        if (!socketRef.current) {
          const token = localStorage.getItem('token');
          socketRef.current = io('http://localhost:3001', { auth: { token } });
          socketRef.current.on('connect', () => {
            setSocketStatus('connected');
            socketRef.current?.emit('join', advisor.id);
          });
          socketRef.current.on('connect_error', (err) => {
            console.warn('⚠️ Error de conexión Socket.IO:', err?.message);
            setSocketStatus('disconnected');
          });
          socketRef.current.on('reconnect_attempt', () => setSocketStatus('connecting'));
          socketRef.current.on('reconnect_error', () => setSocketStatus('disconnected'));
          socketRef.current.on('disconnect', () => setSocketStatus('disconnected'));
          socketRef.current.on('chat:new_message', (payload: any) => {
            const m = payload?.message;
            if (!m) return;
            const isOwn = m.id_remitente === user.id;
            const newMsg: Message = {
              id_message: m.id_mensaje,
              sender_id: m.id_remitente,
              receiver_id: isOwn ? advisor.id : user.id,
              message_text: m.contenido,
              created_at: m.fecha_envio,
              is_own_message: isOwn,
              message_type: m.tipo === 'archivo' ? 'file' : 'text'
            };
            setMessages(prev => {
              if (prev.some(x => x.id_message === newMsg.id_message)) return prev;
              return [...prev, newMsg];
            });
            lastMessageIdRef.current = newMsg.id_message;
            scrollToBottom();
          });
        }
      } catch {}
    };
    setupSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketStatus('disconnected');
      }
    };
  }, [advisor.id]);

  // Fallback: Polling robusto cada 3s para nuevos mensajes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const storedUser = authService.getStoredUser();
        const isAdvisor = storedUser?.role === 'asesor';
        const endpointSuffix = isAdvisor ? `?studentId=${advisor.id}` : '';
        const resp = await chatService.getMessages(endpointSuffix);
        if (!resp?.success) return;
        const mapped: Message[] = (resp.messages || []).map((m: any) => ({
          id_message: m.id_mensaje,
          sender_id: m.id_remitente,
          receiver_id: m.id_destinatario ?? advisor.id,
          message_text: m.contenido,
          created_at: m.fecha_envio,
          is_own_message: currentUser ? m.id_remitente === currentUser.id : false,
          message_type: m.tipo === 'archivo' ? 'file' : 'text'
        }));
        // Añadir sólo los que son nuevos respecto al último ID
        const newOnes = mapped.filter(m => m.id_message > lastMessageIdRef.current);
        if (newOnes.length > 0) {
          setMessages(prev => [...prev, ...newOnes]);
          lastMessageIdRef.current = newOnes[newOnes.length - 1].id_message;
          scrollToBottom();
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [advisor.id, currentUser]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.scrollTop = el.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !currentUser || sending) return;
    try {
      setSending(true);
      setMessage('');
      const resp = await chatService.sendMessage(advisor.id, text);
      if (!resp?.success) throw new Error(resp?.message || 'No se pudo enviar el mensaje');
      const m = resp.message;
      const newMsg: Message = {
        id_message: m.id_mensaje,
        sender_id: m.id_remitente,
        receiver_id: advisor.id,
        message_text: m.contenido,
        created_at: m.fecha_envio,
        is_own_message: true,
        message_type: m.tipo === 'archivo' ? 'file' : 'text'
      };
      setMessages(prev => (prev.some(x => x.id_message === newMsg.id_message) ? prev : [...prev, newMsg]));
      lastMessageIdRef.current = newMsg.id_message;
      scrollToBottom();
    } catch (e) {
      setError('Error enviando mensaje');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(message);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const getFileName = (urlOrPath: string) => {
    try {
      const parts = urlOrPath.split('/');
      const last = parts[parts.length - 1] || urlOrPath;
      return decodeURIComponent(last.replace(/^[0-9]+-/, ''));
    } catch {
      return 'Archivo';
    }
  };

  return (
    <div className="fwc-container">

      {/* Chat panel full width inside card */}
      <div className="fwc-card">
        {/* Encabezado removido para evitar repetición de datos */}
        <div className={`fwc-socket-status ${socketStatus}`} title={`Estado: ${socketStatus}`} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
          {socketStatus === 'connected' && '🟢 Conectado'}
          {socketStatus === 'connecting' && '🟡 Conectando...'}
        </div>
        <div className="fwc-quick">
          <button onClick={() => handleSend('¡Hola profesor! Tengo una consulta sobre mi tesis.')}>❓ Consulta</button>
          <button onClick={() => handleSend('Buenos días, ¿podríamos agendar una reunión?')}>📅 Reunión</button>
          <button onClick={() => handleSend('Hola, quería compartir el progreso de mi trabajo.')}>📈 Progreso</button>
          <button onClick={() => handleSend('¿Podría revisar el documento que le envié?')}>👁️ Revisión</button>
          <button onClick={() => handleSend('Tengo una duda específica sobre la metodología.')}>🤔 Duda</button>
        </div>

        <div className="fwc-messages" ref={messagesContainerRef}>
          {loading && (
            <div className="fwc-loading">Cargando conversación...</div>
          )}
          {error && (
            <div className="fwc-error">{error}</div>
          )}
          {!loading && (() => {
            const items: React.ReactNode[] = [];
            for (let i = 0; i < messages.length; i++) {
              const msg = messages[i];
              const prev = i > 0 ? messages[i - 1] : null;
              const next = i < messages.length - 1 ? messages[i + 1] : null;

              const msgDate = new Date(msg.created_at);
              const prevDate = prev ? new Date(prev.created_at) : null;
              const isToday = (() => {
                const now = new Date();
                return msgDate.toDateString() === now.toDateString();
              })();
              const isNewDay = !prevDate || msgDate.toDateString() !== prevDate.toDateString();
              // Mostrar separador centrado solo para el día actual
              if (isNewDay && isToday) {
                items.push(
                  <div key={`day-${msgDate.toDateString()}-${i}`} className="fwc-day-separator">
                    <span>{msgDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                );
              }

              const showTime = (() => {
                if (!next) return true;
                const sameSender = next.sender_id === msg.sender_id;
                const t1 = new Date(msg.created_at).getTime();
                const t2 = new Date(next.created_at).getTime();
                const withinFiveMin = Math.abs(t2 - t1) <= 5 * 60 * 1000;
                return !(sameSender && withinFiveMin);
              })();

              items.push(
                <div key={msg.id_message} className={`fwc-msg ${msg.is_own_message ? 'own' : 'other'}`}>
                  <div className="fwc-bubble">
                    {msg.message_type === 'file' ? (
                      <a href={msg.message_text} target="_blank" rel="noopener noreferrer" className="fwc-file-link">
                        📄 {getFileName(msg.message_text)}
                      </a>
                    ) : (
                      msg.message_text
                    )}
                  </div>
                  <div className="fwc-time subtle">
                    {isToday
                      ? msgDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                      : `${msgDate.getDate()}/${msgDate.getMonth()+1}, ${msgDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                </div>
              );
            }
            return items;
          })()}
          <div ref={messagesEndRef} />
        </div>

        <div className="fwc-input">
          <input
            ref={fileInputRef}
            type="file"
            onChange={async (e) => {
              const f = e.currentTarget.files?.[0];
              e.currentTarget.value = '';
              if (!f || sending) return;
              try {
                setSending(true);
                const resp = await chatService.sendFile(advisor.id, f);
                if (!resp?.success) throw new Error(resp?.message || 'No se pudo enviar el archivo');
                const m = resp.message;
                const newMsg: Message = {
                  id_message: m.id_mensaje,
                  sender_id: m.id_remitente,
                  receiver_id: advisor.id,
                  message_text: m.contenido,
                  created_at: m.fecha_envio,
                  is_own_message: true,
                  message_type: 'file'
                };
                setMessages(prev => (prev.some(x => x.id_message === newMsg.id_message) ? prev : [...prev, newMsg]));
                lastMessageIdRef.current = newMsg.id_message;
                scrollToBottom();
              } catch (err) {
                setError('Error enviando archivo');
              } finally {
                setSending(false);
              }
            }}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <button className="fwc-attach" onClick={() => fileInputRef.current?.click()} title="Adjuntar archivo" aria-label="Adjuntar archivo">📎</button>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Escribe un mensaje a ${advisor.name}...`}
          />
          <button disabled={sending || !message.trim()} onClick={() => handleSend(message)} title="Enviar">
            ➤
          </button>
        </div>
      </div>

      <style>{fullChatStyles}</style>
    </div>
  );
};

export default FullWidthChat;
