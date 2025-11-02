export const uploadDocumentStyles = `
  .upload-document-container {
    width: 100%;
  }

  /* === HEADER === */
  .upload-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .header-content h2 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 24px;
    font-weight: 600;
  }

  .header-content p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }

  /* 📚 NUEVO: CONTENEDOR DE ACCIONES DEL HEADER */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* 📚 NUEVO: BOTÓN DE GUÍAS */
  .guides-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .guides-button:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  .upload-tips {
    display: flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    min-width: 200px;
  }

  .tip-icon {
    font-size: 20px;
    opacity: 0.9;
  }

  .tip-title {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.9;
    margin-bottom: 2px;
  }

  .tip-text {
    font-size: 14px;
    font-weight: 500;
  }

  /* === SUCCESS/ERROR MESSAGES === */
  .success-message,
  .error-message {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 500;
  }

  .success-message {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .error-message {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .success-icon,
  .error-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  /* === LOADING/ERROR DE FASES === */
  .phases-loading,
  .phases-error {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 500;
  }

  .phases-loading {
    background: #f0f9ff;
    color: #0369a1;
    border: 1px solid #bae6fd;
  }

  .phases-error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .retry-button-small {
    background: #ef4444;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    margin-left: 8px;
    transition: all 0.2s;
  }

  .retry-button-small:hover:not(:disabled) {
    background: #dc2626;
    transform: translateY(-1px);
  }

  .retry-button-small:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* === FORM CONTAINER === */
  .upload-form-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .upload-form {
    padding: 32px;
  }

  /* === FORM GROUPS === */
  .form-group {
    margin-bottom: 24px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  .required {
    color: #ef4444;
  }

  /* === FORM ELEMENTS === */
  .form-select,
  .form-input,
  .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    background: #f9fafb;
    color: #374151;
    transition: all 0.2s;
    font-family: inherit;
  }

  .form-select:focus,
  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    color: #1f2937;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-select.error,
  .form-input.error,
  .form-textarea.error {
    border-color: #ef4444;
    background: #fef2f2;
    color: #991b1b;
  }

  .form-select:disabled,
  .form-input:disabled,
  .form-textarea:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }

  .form-select option {
    background: white;
    color: #374151;
    padding: 8px 12px;
  }
  
  .form-select option:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: #9ca3af;
    opacity: 1;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .character-count {
    font-size: 12px;
    color: #6b7280;
    text-align: right;
    margin-top: 4px;
  }

  .error-text {
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* === LOADING SELECT === */
  .loading-select {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    color: #6b7280;
    font-size: 14px;
  }

  /* === PHASE WARNING === */
  .phase-warning {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fef3c7;
    padding: 8px 12px;
    border-radius: 6px;
    border-left: 3px solid #f59e0b;
    margin-top: 8px;
  }

  .warning-icon {
    color: #d97706;
    font-size: 14px;
    flex-shrink: 0;
  }

  .warning-text {
    color: #92400e;
    font-size: 12px;
    font-weight: 500;
  }

  /* === FILE DROP AREA === */
  .file-drop-area {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    transition: all 0.2s;
    background: #f9fafb;
    position: relative;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-drop-area:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .file-drop-area.active {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: scale(1.02);
  }

  .file-drop-area.error {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }

  /* === FILE PLACEHOLDER === */
  .file-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    z-index: 2;
    position: relative;
  }

  .file-placeholder:hover .upload-icon {
    transform: scale(1.1);
    opacity: 0.8;
  }

  .upload-icon {
    font-size: 48px;
    opacity: 0.6;
    transition: all 0.2s;
  }

  .upload-text {
    text-align: center;
  }

  .primary-text {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }

  .secondary-text {
    font-size: 14px;
    color: #6b7280;
  }

  /* === FILE SELECTED === */
  .file-selected {
    display: flex;
    align-items: center;
    gap: 16px;
    background: white;
    padding: 16px 20px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .file-icon {
    font-size: 32px;
    flex-shrink: 0;
    color: #3b82f6;
  }

  .file-info {
    flex: 1;
    text-align: left;
    min-width: 0;
    max-width: 100%;
    width: 100%;
  }

  .file-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    word-wrap: break-word;
    overflow-wrap: break-word;
    margin-bottom: 4px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .file-size {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .change-file-btn {
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    cursor: pointer;
    font-size: 14px;
    padding: 8px 10px;
    border-radius: 6px;
    transition: all 0.2s;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
  }

  .change-file-btn:hover:not(:disabled) {
    background: #e5e7eb;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }

  .change-file-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .remove-file {
    background: #fef2f2;
    border: 1px solid #fecaca;
    cursor: pointer;
    font-size: 14px;
    padding: 8px 10px;
    border-radius: 6px;
    transition: all 0.2s;
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
  }

  .remove-file:hover:not(:disabled) {
    background: #fee2e2;
    border-color: #f87171;
    transform: translateY(-1px);
  }

  .remove-file:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* === UPLOAD PROGRESS === */
  .upload-progress {
    background: #f8fafc;
    padding: 16px 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin-bottom: 24px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  /* === FORM ACTIONS === */
  .form-actions {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }

  .submit-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 200px;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .submit-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  .submit-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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

  /* === INFO SECTION === */
  .info-section {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #eff6ff;
    padding: 16px 20px;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
  }

  .info-icon {
    font-size: 18px;
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .info-content {
    flex: 1;
  }

  .info-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 4px;
  }

  .info-text {
    font-size: 13px;
    color: #1e40af;
    line-height: 1.5;
  }

  /* === 📚 MODAL DE GUÍAS === */
  .guides-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .guides-modal {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .guides-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .guides-modal-header h3 {
    margin: 0;
    color: #1f2937;
    font-size: 20px;
    font-weight: 600;
  }

  .close-button {
    background: #f3f4f6;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6b7280;
    font-size: 16px;
    transition: all 0.2s;
  }

  .close-button:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .guides-modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .guides-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .guide-item {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #f9fafb;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
  }

  .guide-item:hover {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .guide-icon {
    font-size: 32px;
    color: #10b981;
    flex-shrink: 0;
  }

  .guide-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .guide-info h4 {
    margin: 0 0 4px 0;
    color: #1f2937;
    font-size: 16px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .guide-info p {
    margin: 0 0 8px 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .guide-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #9ca3af;
  }

  .download-guide-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .download-guide-btn:hover {
    background: #059669;
    transform: translateY(-1px);
  }

  .no-guides {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }

  .no-guides-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .no-guides h4 {
    margin: 0 0 8px 0;
    color: #374151;
    font-size: 18px;
    font-weight: 600;
  }

  .no-guides p {
    margin: 0;
    line-height: 1.5;
    max-width: 300px;
    margin: 0 auto;
  }

  /* === ANIMATIONS === */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* === RESPONSIVE === */
  @media (max-width: 1024px) {
    .upload-form {
      padding: 24px;
    }

    .file-selected {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .upload-header {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }

    .header-actions {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }
    
    .guides-button,
    .upload-tips {
      width: 100%;
      justify-content: center;
      min-width: auto;
    }

    .file-drop-area {
      padding: 24px 16px;
      min-height: 160px;
    }

    .upload-icon {
      font-size: 40px;
    }

    .primary-text {
      font-size: 14px;
    }

    .secondary-text {
      font-size: 12px;
    }

    .file-selected {
      padding: 12px 16px;
      gap: 12px;
    }

    .file-actions {
      gap: 6px;
    }

    .change-file-btn,
    .remove-file {
      min-width: 32px;
      height: 32px;
      padding: 6px 8px;
      font-size: 12px;
    }

    .submit-button {
      width: 100%;
      padding: 14px 24px;
    }

    /* RESPONSIVE MODAL */
    .guides-modal {
      width: 95%;
      max-height: 90vh;
    }
    
    .guides-modal-header,
    .guides-modal-content {
      padding: 16px;
    }
    
    .guide-item {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }
    
    .guide-meta {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .upload-header {
      padding: 16px;
    }

    .upload-form {
      padding: 16px;
    }

    .file-drop-area {
      padding: 16px 12px;
      min-height: 140px;
    }

    .upload-icon {
      font-size: 32px;
    }

    .file-selected {
      padding: 12px;
      gap: 8px;
      flex-direction: column;
      align-items: flex-start;
    }

    .file-info {
      width: 100%;
      margin-bottom: 8px;
    }

    .file-actions {
      width: 100%;
      justify-content: center;
      gap: 12px;
    }

    .change-file-btn,
    .remove-file {
      flex: 1;
      min-width: auto;
      height: 36px;
      padding: 8px 12px;
      font-size: 13px;
    }

    .file-icon {
      font-size: 24px;
    }

    .file-name {
      font-size: 13px;
    }

    .file-size {
      font-size: 11px;
    }

    .form-select,
    .form-input,
    .form-textarea {
      padding: 10px 12px;
      font-size: 13px;
    }

    .submit-button {
      font-size: 14px;
      padding: 12px 20px;
    }

    .info-section {
      padding: 12px 16px;
    }

    .info-title {
      font-size: 13px;
    }

    .info-text {
      font-size: 12px;
    }

    /* MODAL MUY PEQUEÑO */
    .guides-modal {
      width: 98%;
      max-height: 95vh;
    }

    .guides-modal-header {
      padding: 12px;
    }

    .guides-modal-header h3 {
      font-size: 18px;
    }

    .guides-modal-content {
      padding: 12px;
    }

    .guide-item {
      padding: 16px;
      gap: 8px;
    }

    .guide-icon {
      font-size: 24px;
    }

    .guide-info h4 {
      font-size: 14px;
    }

    .guide-info p {
      font-size: 12px;
    }

    .guide-meta {
      font-size: 10px;
      gap: 8px;
    }

    .download-guide-btn {
      padding: 6px 12px;
      font-size: 11px;
    }

    .no-guides {
      padding: 24px 12px;
    }

    .no-guides-icon {
      font-size: 36px;
    }

    .no-guides h4 {
      font-size: 16px;
    }

    .no-guides p {
      font-size: 12px;
    }
  }
`;