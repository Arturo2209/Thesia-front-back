export const documentDetailStyles = `
  .document-detail-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* === LOADING & ERROR STATES === */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-left: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  .loading-container p {
    color: #64748b;
    font-size: 16px;
    margin: 0;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-message {
    color: #ef4444;
    font-size: 16px;
    margin-bottom: 24px;
  }

  .error-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .retry-button,
  .back-button {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .retry-button {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
  }

  .retry-button:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    transform: translateY(-1px);
  }

  .back-button {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .back-button:hover {
    background: #e5e7eb;
    color: #1f2937;
  }

  /* === HEADER === */
  .detail-header {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 24px;
    padding: 24px;
  }

  .header-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }

  /* === ACTION BUTTONS === */
  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }

  .action-button.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  .action-button.primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .action-button.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .action-button.secondary:hover:not(:disabled) {
    background: #e5e7eb;
    color: #1f2937;
    transform: translateY(-1px);
  }

  /* ✅ ESTILO DANGER AGREGADO */
  .action-button.danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }

  .action-button.danger:hover:not(:disabled) {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  .action-button.large {
    padding: 16px 32px;
    font-size: 16px;
    min-width: 200px;
    justify-content: center;
  }

  .action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .button-icon {
    font-size: 16px;
  }

  .spinner-small {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-left: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* === DOCUMENT INFO CARD === */
  .document-info-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 24px;
    overflow: hidden;
  }

  .document-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 32px;
    border-bottom: 1px solid #e5e7eb;
  }

  .document-title {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
    min-width: 0;
  }

  .file-icon {
    font-size: 32px;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .title-content h1 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.3;
  }

  .subtitle {
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
  }

  /* === STATUS BADGES === */
  .status-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
    margin-left: 16px;
  }

  .status-badge.green {
    background: #d1fae5;
    color: #065f46;
  }

  .status-badge.yellow {
    background: #fef3c7;
    color: #92400e;
  }

  .status-badge.red {
    background: #fee2e2;
    color: #991b1b;
  }

  .status-badge.gray {
    background: #f3f4f6;
    color: #374151;
  }

  /* === DOCUMENT METADATA === */
  .document-metadata {
    padding: 32px;
  }

  .metadata-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .metadata-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .metadata-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metadata-value {
    font-size: 14px;
    color: #1f2937;
    font-weight: 500;
  }

  .document-description {
    border-top: 1px solid #e5e7eb;
    padding-top: 24px;
  }

  .document-description h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .document-description p {
    margin: 0;
    color: #4b5563;
    line-height: 1.6;
    font-size: 14px;
  }

  /* === COMMENTS SECTION === */
  .comments-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 24px;
    overflow: hidden;
  }

  .comments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    border-bottom: 1px solid #e5e7eb;
    background: #f8fafc;
  }

  .comments-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }

  .comments-count {
    background: #3b82f6;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  /* === NO COMMENTS === */
  .no-comments {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
  }

  .no-comments-icon {
    font-size: 48px;
    opacity: 0.5;
    margin-bottom: 16px;
  }

  .no-comments h3 {
    margin: 0 0 8px 0;
    color: #374151;
    font-size: 18px;
    font-weight: 600;
  }

  .no-comments p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    max-width: 400px;
    line-height: 1.5;
  }

  /* === COMMENTS LIST === */
  .comments-list {
    padding: 24px 32px;
  }

  /* === COMMENT COMPOSE (advisor) === */
  .comment-compose {
    padding: 24px 32px;
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
  }

  .compose-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .compose-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .compose-hint {
    color: #6b7280;
    font-size: 12px;
  }

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .comment-field-wrapper { display: flex; flex-direction: column; gap: 8px; }

  .comment-textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 2px solid #e5e7eb;
    background: #f9fafb;
    font-size: 14px;
    color: #1f2937;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    resize: vertical;
  }

  .comment-textarea:focus {
    border-color: #3b82f6;
    background: #ffffff;
  }

  .comment-textarea::placeholder {
    color: #9ca3af;
    opacity: 1;
    font-family: inherit;
  }

  .comment-meta-row { display: flex; justify-content: flex-end; }
  .char-remaining { font-size: 12px; color: #6b7280; }
  .char-remaining.warn { color: #92400e; }
  .char-remaining.error { color: #b91c1c; }

  .comment-actions { display: flex; gap: 8px; }

  .comment-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    transition: all 0.2s;
  }

  .comment-card:last-child {
    margin-bottom: 0;
  }

  .comment-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .comment-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
  }

  .author-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .author-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }

  .comment-date {
    font-size: 12px;
    color: #6b7280;
  }

  .comment-number {
    background: #e2e8f0;
    color: #374151;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .comment-content {
    margin-bottom: 16px;
  }

  .comment-content p {
    margin: 0;
    color: #374151;
    line-height: 1.6;
    font-size: 14px;
    white-space: pre-wrap;
  }

  /* === COMMENT ATTACHMENTS === */
  .comment-attachments {
    border-top: 1px solid #e2e8f0;
    padding-top: 16px;
  }

  .comment-attachments h4 {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
  }

  .attachments-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .attachment-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 13px;
  }

  .attachment-icon {
    font-size: 14px;
    color: #6b7280;
  }

  .attachment-name {
    color: #374151;
  }

  /* === STATUS ACTIONS === */
  .status-actions {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 32px;
    text-align: center;
  }

  .status-message {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    border-radius: 12px;
    margin-bottom: 24px;
    text-align: left;
  }

  .status-message.approved {
    background: #d1fae5;
    border: 1px solid #a7f3d0;
  }

  .status-message.rejected {
    background: #fee2e2;
    border: 1px solid #fecaca;
  }

  /* ✅ ESTILO PARA MENSAJE PENDIENTE AGREGADO */
  .status-message.pending {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
  }

  .status-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .status-content h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
  }

  .status-content p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }

  .status-message.approved .status-content h3,
  .status-message.approved .status-content p {
    color: #065f46;
  }

  .status-message.rejected .status-content h3,
  .status-message.rejected .status-content p {
    color: #991b1b;
  }

  /* ✅ ESTILO PARA TEXTO PENDIENTE AGREGADO */
  .status-message.pending .status-content h3,
  .status-message.pending .status-content p {
    color: #0369a1;
  }

  /* === ANIMATIONS === */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* === RESPONSIVE === */
  @media (max-width: 1024px) {
    .metadata-grid {
      grid-template-columns: 1fr 1fr;
    }

    .comments-list {
      padding: 16px 24px;
    }

    .comment-card {
      padding: 20px;
    }
  }

  @media (max-width: 768px) {
    .header-navigation {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .header-actions {
      justify-content: center;
    }

    .document-header {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
      padding: 24px;
    }

    .status-badge {
      margin-left: 0;
    }

    .document-metadata,
    .comments-header,
    .comments-list,
    .comment-compose {
      padding: 16px 24px;
    }

    .metadata-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .title-content h1 {
      font-size: 20px;
    }

    .comment-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .comment-number {
      align-self: flex-end;
    }

    .status-message {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }

    .status-actions {
      padding: 24px 16px;
    }
  }

  @media (max-width: 480px) {
    .document-info-card,
    .comments-section,
    .status-actions,
    .detail-header {
      margin-left: -12px;
      margin-right: -12px;
      border-radius: 0;
    }

    .document-header,
    .document-metadata,
    .comments-header,
    .comments-list,
    .comment-compose,
    .status-actions,
    .detail-header {
      padding: 16px;
    }

    .document-title {
      gap: 12px;
    }

    .file-icon {
      font-size: 24px;
    }

    .title-content h1 {
      font-size: 18px;
    }

    .comment-card {
      padding: 16px;
    }

    .author-avatar {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }

    .action-button {
      padding: 12px 16px;
      font-size: 13px;
    }

    .action-button.large {
      padding: 14px 24px;
      font-size: 14px;
      min-width: auto;
      width: 100%;
    }

    .header-actions {
      flex-direction: column;
      gap: 8px;
    }
  }
`;