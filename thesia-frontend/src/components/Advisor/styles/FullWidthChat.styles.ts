export const fullChatStyles = `
  .fwc-container {
    width: 100%;
    padding: 24px; /* espacio simétrico a ambos lados */
    box-sizing: border-box;
  }

  .fwc-summary {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 24px;
    margin-bottom: 16px;
  }

  .fwc-summary-left { display:flex; gap:16px; align-items:center; }
  .fwc-avatar {
    width: 64px; height: 64px; border-radius: 50%; background:#3b82f6; color:#fff;
    display:flex; align-items:center; justify-content:center; font-weight:700; font-size:24px;
    overflow:hidden;
  }
  .fwc-avatar img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
  .fwc-info { display:flex; flex-direction:column; }
  .fwc-name { margin:0; font-size:22px; color:#333; }
  .fwc-title { margin:4px 0 8px; color:#666; font-size:14px; }
  .fwc-stats { display:flex; gap:12px; color:#666; font-size:13px; }
  .fwc-stats .rating { color:#ff9800; }

  .fwc-card {
    background:#fff;
    border:1px solid #e2e8f0;
    border-radius:12px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    overflow:hidden;
  }

  .fwc-chat-header {
    display:flex; align-items:center; gap:12px;
    padding: 16px 24px;
    background:#f8f9fa; border-bottom:1px solid #e5e7eb;
  }
  .avatar-mini { width:40px; height:40px; border-radius:50%; background:#3b82f6; color:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .avatar-mini img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
  .peer-name { font-weight:700; color:#333; }
  .peer-role { font-size:12px; color:#666; }

  .fwc-quick { display:flex; gap:10px; flex-wrap:wrap; padding: 12px 24px; background:#fff; border-bottom:1px solid #f1f5f9; }
  .fwc-quick button { padding:8px 12px; background:#eff6ff; color:#3b82f6; border:1px solid #bfdbfe; border-radius:16px; font-size:12px; cursor:pointer; }
  .fwc-quick button:hover { background:#dbeafe; border-color:#93c5fd; }

  .fwc-messages { height: 56vh; min-height: 440px; overflow-y:auto; padding: 20px 24px; background:#fff; }
  .fwc-msg { display:flex; flex-direction: column; gap: 4px; margin-bottom:12px; }
  .fwc-msg.own { align-items:flex-end; }
  .fwc-msg.other { align-items:flex-start; }
  .fwc-bubble { max-width: 86%; padding: 12px 16px; border-radius: 16px; font-size:14px; line-height:1.5; }
  .fwc-msg.own .fwc-bubble { background:#3b82f6; color:#fff; border-bottom-right-radius:6px; }
  .fwc-msg.other .fwc-bubble { background:#f1f5f9; color:#334155; border-bottom-left-radius:6px; }
  .fwc-time { font-size:11px; opacity:0.6; margin-top:2px; color:#6b7280; }
  .fwc-time.subtle { opacity:0.5; }
  .fwc-msg.other .fwc-time { text-align:left; align-self:flex-start; }
  .fwc-msg.own .fwc-time { text-align:right; align-self:flex-end; }

  /* Day separator */
  .fwc-day-separator { display:flex; justify-content:center; align-items:center; margin:8px 0 4px; }
  .fwc-day-separator span { background:#f8fafc; color:#475569; font-size:12px; padding:4px 10px; border-radius:12px; border:1px solid #e2e8f0; }

  .fwc-input { display:flex; align-items:center; gap:10px; padding: 16px 24px; background:#fafafa; border-top:1px solid #e5e7eb; }
  .fwc-input textarea { flex:1; padding:12px 16px; border:1px solid #d1d5db; border-radius:16px; min-height:44px; max-height:140px; resize:none; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .fwc-file-link { color:#1f2937; text-decoration: none; }
    .fwc-file-link:hover { text-decoration: underline; }
  .fwc-input textarea:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); outline:none; }
  .fwc-input button { width:40px; height:40px; border:none; border-radius:50%; background:#3b82f6; color:#fff; font-size:16px; cursor:pointer; }
  .fwc-input button:disabled { background:#9ca3af; cursor:not-allowed; }

  .fwc-attach { width:36px; height:36px; border:none; border-radius:50%; background:#f3f4f6; color:#6b7280; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:16px; line-height:1; }
  .fwc-attach:hover { background:#e5e7eb; }

  @media (max-width: 1024px) {
    .fwc-messages { height: 52vh; }
  }
  @media (max-width: 768px) {
    .fwc-container { padding: 16px; }
    .fwc-messages { height: 48vh; }
    .fwc-bubble { max-width: 90%; }
  }
  @media (max-width: 480px) {
    .fwc-messages { height: 44vh; }
    .fwc-bubble { max-width: 94%; }
  }
`;
