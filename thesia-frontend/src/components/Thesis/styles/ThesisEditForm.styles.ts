export const thesisEditFormStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .main-content {
    flex: 1;
    margin-left: 280px;
    background: #f5f5f5;
    min-height: 100vh;
    width: calc(100vw - 280px);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    max-width: 1200px;
    margin: 0 auto;
  }

  .thesis-edit-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .edit-header {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 24px 32px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .edit-icon {
    font-size: 32px;
    opacity: 0.9;
  }

  .edit-title-section h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
  }

  .edit-title-section p {
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

  .edit-form {
    padding: 32px;
  }

  .form-section {
    margin-bottom: 32px;
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

  .current-advisor-info {
    margin-top: 16px;
  }

  .advisor-card.readonly {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    opacity: 0.95;
  }

  .advisor-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .advisor-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 16px;
  }

  .avatar-placeholder {
    font-size: 16px;
    font-weight: 600;
  }

  .advisor-basic-info {
    flex: 1;
  }

  .advisor-name {
    color: #1f2937;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  .advisor-specialty {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
  }

  .readonly-indicator {
    color: #6b7280;
    font-size: 18px;
  }

  .advisor-details {
    margin-bottom: 16px;
  }

  .advisor-contact {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4a5568;
    font-size: 14px;
  }

  .contact-icon {
    font-size: 14px;
  }

  .contact-email {
    font-weight: 500;
  }

  .advisor-note {
    background: #dbeafe;
    border: 1px solid #3b82f6;
    padding: 12px;
    border-radius: 6px;
    margin-top: 12px;
  }

  .advisor-note p {
    margin: 0;
    font-size: 13px;
    color: #1e40af;
    line-height: 1.4;
  }

  .advisor-note strong {
    color: #1e3a8a;
  }

  .form-actions {
    background: #f8fafc;
    border-radius: 8px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    margin-top: 24px;
  }

  .buttons-row {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 16px;
  }

  .cancel-button,
  .submit-button {
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 140px;
    justify-content: center;
  }

  .cancel-button {
    background: #6b7280;
    color: white;
  }

  .cancel-button:hover:not(:disabled) {
    background: #4b5563;
    transform: translateY(-1px);
  }

  .submit-button {
    background: #3b82f6;
    color: white;
  }

  .submit-button:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  .cancel-button:disabled,
  .submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .button-icon {
    font-size: 14px;
  }

  .spinner-small {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
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

  @media (max-width: 1024px) {
    .main-content {
      margin-left: 260px;
      width: calc(100vw - 260px);
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

    .edit-form {
      padding: 24px;
    }

    .edit-header {
      padding: 20px 24px;
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }

    .buttons-row {
      flex-direction: column;
    }

    .cancel-button,
    .submit-button {
      min-width: 100%;
    }
  }
`;