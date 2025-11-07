export const thesisFormStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .main-content {
    flex: 1;
    margin-left: 280px; /* Ajuste para respetar el ancho del Sidebar */
    padding: 32px;
    max-width: calc(100vw - 280px); /* Ajuste dinámico para evitar espacio adicional */
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 8px;
  }

  @media (max-width: 1024px) {
    .main-content {
      margin-left: 260px;
      max-width: calc(100vw - 260px);
      padding: 24px;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      max-width: 100vw;
      padding: 16px;
    }
  }

  .main-header {
    background: white;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .main-header h1 {
    margin: 0;
    font-size: 20px;
    color: #2c3e50;
    font-weight: 600;
  }

  .notification-icon {
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .notification-icon:hover {
    background: #f0f0f0;
  }

  .content-section {
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .thesis-form-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .form-header {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 24px 32px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .form-icon {
    font-size: 32px;
    opacity: 0.9;
  }

  .form-title-section h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
  }

  .form-title-section p {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
  }

  .error-message {
    background: #fee2e2;
    border: 1px solid #fecaca;
    margin: 24px 32px;
    border-radius: 8px;
    padding: 0;
  }

  .error-content {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 12px;
  }

  .error-icon {
    font-size: 20px;
    color: #dc2626;
  }

  .error-text {
    flex: 1;
    color: #dc2626;
    font-weight: 500;
  }

  .error-close {
    background: none;
    border: none;
    color: #dc2626;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .error-close:hover {
    background: rgba(220, 38, 38, 0.1);
  }

  .thesis-form {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 32px;
    padding: 32px;
    align-items: start;
  }

  .form-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-section {
    background: #f8fafc;
    border-radius: 8px;
    padding: 24px;
    border: 1px solid #e2e8f0;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
  }

  .section-icon {
    font-size: 20px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-group label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
    font-size: 14px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;
    font-family: inherit;
    background: white;
    color: #374151;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .readonly-input {
    background: #f3f4f6 !important;
    color: #6b7280 !important;
    cursor: not-allowed !important;
    border-color: #d1d5db !important;
  }

  .readonly-input:focus {
    border-color: #d1d5db !important;
    box-shadow: none !important;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
  }

  .input-help {
    margin-top: 4px;
    font-size: 12px;
    color: #6b7280;
  }

  /* === SIDEBAR DE ASESORES === */
  .advisors-sidebar {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    height: fit-content;
    position: sticky;
    top: 20px;
  }

  .advisors-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .advisors-icon {
    font-size: 24px;
    opacity: 0.9;
  }

  .advisors-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .advisors-content {
    padding: 0;
  }

  .advisors-info {
    background: #f0fdf4;
    border-bottom: 1px solid #d1fae5;
    padding: 16px 20px;
    margin: 0;
  }

  .advisors-info p {
    margin: 0;
    color: #065f46;
    font-size: 13px;
    line-height: 1.4;
  }

  .advisors-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    gap: 16px;
  }

  .advisors-loading .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #d1fae5;
    border-top: 3px solid #10b981;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .advisors-loading p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }

  .no-advisors {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }

  .no-advisors-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .no-advisors h4 {
    margin: 0 0 8px 0;
    color: #374151;
    font-size: 16px;
  }

  .no-advisors p {
    margin: 0;
    font-size: 14px;
  }

  .advisors-list {
    max-height: 500px;
    overflow-y: auto;
  }

  .advisor-card {
    border-bottom: 1px solid #f3f4f6;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .advisor-card:last-child {
    border-bottom: none;
  }

  .advisor-card:hover {
    background: #f8fafc;
  }

  .advisor-card.selected {
    background: #f0fdf4;
    border-left: 4px solid #10b981;
  }

  .advisor-card.unavailable {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f9fafb;
  }

  .advisor-card.unavailable:hover {
    background: #f9fafb;
  }

  .advisor-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .advisor-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }

  .advisor-basic-info {
    flex: 1;
    min-width: 0;
  }

  .advisor-name {
    margin: 0 0 2px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.3;
  }

  .advisor-specialty {
    margin: 0;
    color: #10b981;
    font-size: 12px;
    font-weight: 500;
    background: #ecfdf5;
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .selected-indicator {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 20px;
    height: 20px;
    background: #10b981;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .advisor-card.selected .selected-indicator {
    opacity: 1;
  }

  .check-icon {
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .advisor-contact {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 12px;
    color: #6b7280;
  }

  .contact-icon {
    font-size: 12px;
  }

  .advisor-capacity {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #6b7280;
  }

  .capacity-icon {
    font-size: 12px;
  }

  .capacity-status {
    font-weight: 500;
  }

  .capacity-status.available {
    color: #10b981;
  }

  .capacity-status.unavailable {
    color: #ef4444;
  }

  .unavailable-reason {
    margin-top: 8px;
    padding: 8px;
    background: #fef2f2;
    border-radius: 4px;
    font-size: 11px;
    color: #dc2626;
    text-align: center;
  }

  /* === SECCIÓN DE CONFIRMACIÓN === */
  .selection-confirmation {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
  }

  .confirmation-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .confirmation-icon {
    font-size: 18px;
    color: #10b981;
  }

  .confirmation-text {
    flex: 1;
    color: #065f46;
    font-size: 14px;
    font-weight: 500;
  }

  /* === ACCIONES DEL FORMULARIO === */
  .form-actions {
    background: #f8fafc;
    border-radius: 8px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    margin-top: 24px;
    grid-column: 1 / -1;
  }

  .buttons-row {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 16px;
  }

  .submit-button {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
    justify-content: center;
  }

  .submit-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  }

  .submit-button:disabled {
    background: #d1d5db;
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
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .form-footer {
    text-align: center;
  }

  .form-footer p {
    color: #6b7280;
    font-size: 12px;
    margin: 0;
    line-height: 1.5;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* === RESPONSIVE === */
  @media (max-width: 1200px) {
    .main-content {
      margin-left: 260px;
      width: calc(100vw - 260px);
    }

    .content-section {
      padding: 24px;
    }

    .thesis-form {
      grid-template-columns: 1fr 320px;
      gap: 24px;
    }
  }

  @media (max-width: 1024px) {
    .main-content {
      margin-left: 260px;
      width: calc(100vw - 260px);
    }

    .thesis-form {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .advisors-sidebar {
      order: -1;
      position: static;
    }

    .advisors-list {
      max-height: 300px;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      width: 100vw;
    }

    .content-section {
      padding: 16px;
    }

    .thesis-form {
      padding: 24px;
      gap: 20px;
    }

    .form-header {
      padding: 20px 24px;
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }

    .advisors-list {
      max-height: 250px;
    }
  }

  @media (max-width: 480px) {
    .main-header {
      padding: 12px 16px;
    }

    .main-header h1 {
      font-size: 18px;
    }

    .content-section {
      padding: 12px;
    }

    .form-header {
      padding: 16px;
    }

    .thesis-form {
      padding: 16px;
    }

    .form-section,
    .advisors-content {
      padding: 16px;
    }
  }
`;