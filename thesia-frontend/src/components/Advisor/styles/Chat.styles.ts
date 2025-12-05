export const chatStyles = `
  /* === CHAT CONTAINER === */
  .chat-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    /* Altura adaptativa para ocupar casi toda la pantalla dentro de la tarjeta */
    height: 74vh;
    min-height: 560px;
    max-height: none;
    background: white;
    border-radius: 12px; /* igual que perfil */
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  /* === CHAT HEADER === */
  .chat-header {
    display: flex;
    align-items: center;
    padding: 24px; /* igual que perfil */
    background: #f8f9fa;
    border-bottom: 1px solid #e5e7eb;
    gap: 12px;
  }

  .chat-header-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
  }

  .chat-header-info h4 {
    margin: 0;
    font-size: 20px; /* Más grande, consistente con perfil */
    color: #333;
    font-weight: 700;
  }

  .chat-header-info p {
    margin: 0;
    font-size: 12px;
    color: #666;
  }

  .chat-status {
    margin-left: auto;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }

  .chat-status.online {
    background: #dcfce7;
    color: #166534;
  }

  .chat-status.offline {
    background: #f1f5f9;
    color: #64748b;
  }

  /* === MESSAGES AREA === */
  .messages-container {
    flex: 1;
    overflow-y: auto;
    /* Aire horizontal; coherente con tarjeta */
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scroll-behavior: smooth;
  }

  .messages-container::-webkit-scrollbar {
    width: 6px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  /* === MESSAGE ITEM === */
  .message-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
    animation: messageSlideIn 0.3s ease-out;
  }

  .message-item.own {
    align-items: flex-end;
  }

  .message-item.other {
    align-items: flex-start;
  }

  .message-bubble {
    /* Ancho por línea ajustado, evitando tocar bordes */
    max-width: 86%;
    padding: 14px 18px;
    border-radius: 18px;
    font-size: 15px;
    line-height: 1.5;
    word-wrap: break-word;
    position: relative;
  }

  .message-bubble.own {
    background: #3b82f6;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .message-bubble.other {
    background: #f1f5f9;
    color: #334155;
    border-bottom-left-radius: 4px;
  }

  .message-time {
    font-size: 11px;
    opacity: 0.6;
    margin-top: 2px;
    color: #6b7280;
  }
  .message-time.subtle { opacity: 0.5; }
  .message-item.other .message-time { text-align: left; align-self: flex-start; }
  .message-item.own .message-time { text-align: right; align-self: flex-end; }

  .message-status {
    font-size: 11px;
    opacity: 0.7;
    margin-top: 2px;
  }

  .message-sending {
    opacity: 0.6;
  }

  .message-sending::after {
    content: ' ⏳';
    opacity: 0.5;
  }

  /* === CHAT INPUT === */
  .chat-input-container {
    display: flex;
    align-items: center;
    padding: 24px; /* igual que perfil */
    background: #fafafa;
    border-top: 1px solid #e5e7eb;
    gap: 10px;
  }

  .chat-input {
    flex: 1;
    padding: 14px 18px;
    border: 1px solid #d1d5db;
    border-radius: 20px;
    font-size: 15px;
    outline: none;
    resize: none;
    min-height: 44px; /* Más alto para mejor escritura */
    max-height: 160px;
    overflow-y: auto;
    background: white;
    color: #374151;
    font-family: inherit;
  }

  .chat-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .chat-input::placeholder {
    color: #9ca3af;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .chat-send-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: #3b82f6;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s;
  }

  /* === DAY SEPARATOR === */
  .day-separator {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px 0 4px 0;
    position: relative;
  }
  .day-separator span {
    background: #f8fafc;
    color: #475569;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .chat-send-btn:hover:not(:disabled) {
    background: #1d4ed8;
    transform: scale(1.05);
  }

  .chat-send-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  .chat-attach-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: #f3f4f6;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 1;
    transition: all 0.2s;
  }
  .message-file-link { color: #1f2937; text-decoration: none; }
  .message-file-link:hover { text-decoration: underline; }

  .chat-attach-btn:hover {
    background: #e5e7eb;
  }

  /* === QUICK ACTIONS === */
  .quick-actions {
    display: flex;
    gap: 10px;
    padding: 24px; /* igual que perfil */
    background: white;
    border-bottom: 1px solid #f1f5f9;
    flex-wrap: wrap;
  }

  .quick-action-btn {
    padding: 8px 12px;
    background: #eff6ff;
    color: #3b82f6;
    border: 1px solid #bfdbfe;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .quick-action-btn:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }

  /* === LOADING STATES === */
  .chat-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    color: #6b7280;
    font-size: 14px;
  }

  .chat-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f4f6;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }

  /* === EMPTY STATE === */
  .chat-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: #6b7280;
    text-align: center;
  }

  .chat-empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .chat-empty h4 {
    margin: 0 0 8px 0;
    color: #374151;
  }

  .chat-empty p {
    margin: 0;
    font-size: 14px;
  }

  /* === ANIMATIONS === */
  @keyframes messageSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* === RESPONSIVE === */
  @media (max-width: 1024px) {
    .chat-container {
      height: 68vh;
      min-height: 520px;
      max-height: none;
    }
  }

  @media (max-width: 768px) {
    .chat-container {
      height: 60vh;
      min-height: 500px;
      max-height: none;
    }
    
    .message-bubble {
      max-width: 90%;
      font-size: 13px;
    }
    
    .chat-header {
      padding: 12px 16px;
    }
    
    .chat-input-container {
      padding: 12px 16px;
    }
    
    .quick-actions {
      gap: 6px;
    }
    
    .quick-action-btn {
      font-size: 11px;
      padding: 6px 10px;
    }
  }

  @media (max-width: 480px) {
    .chat-container {
      height: 56vh;
      min-height: 460px;
      max-height: none;
    }
    
    .message-bubble {
      max-width: 94%;
      padding: 10px 14px;
    }
  }
`;