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

  /* === FORM ELEMENTS (🔧 CORREGIDO) === */
  .form-select,
  .form-input,
  .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    background: #f9fafb;
    color: #374151;               /* ✅ Color del texto */
    transition: all 0.2s;
    font-family: inherit;
  }

  .form-select:focus,
  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    color: #1f2937;               /* ✅ Color del texto en focus */
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-select.error,
  .form-input.error,
  .form-textarea.error {
    border-color: #ef4444;
    background: #fef2f2;
    color: #991b1b;               /* ✅ Color del texto en error */
  }

  .form-select:disabled,
  .form-input:disabled,
  .form-textarea:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }

  /* ✅ ESTILOS PARA OPTIONS DEL SELECT */
  .form-select option {
    background: white;
    color: #374151;
    padding: 8px 12px;
  }
  
  .form-select option:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  /* ✅ ESTILOS PARA PLACEHOLDERS */
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

  /* === FILE SELECTED (🔧 COMPLETAMENTE NUEVO) === */
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
  }

  .file-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    word-wrap: break-word;
    overflow-wrap: break-word;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .file-size {
    font-size: 12px;
    color: #6b7280;
  }

  /* ✅ NUEVO: CONTENEDOR DE ACCIONES DEL ARCHIVO */
  .file-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  /* ✅ NUEVO: BOTÓN PARA CAMBIAR ARCHIVO */
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

  /* ✅ MEJORADO: BOTÓN PARA ELIMINAR ARCHIVO */
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

    .upload-tips {
      min-width: auto;
      width: 100%;
      justify-content: center;
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
  }
`;