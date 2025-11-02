export const thesisRegisteredStyles = `
  .main-content {
    position: fixed;
    top: 0;
    left: 280px;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow-y: auto;
    overflow-x: hidden;
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
    left: 0;
    right: 0;
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
    box-sizing: border-box;
  }

  .thesis-registered-container {
    width: 100%;
    box-sizing: border-box;
  }

  .thesis-layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 32px;
    width: 100%;
    box-sizing: border-box;
  }

  .thesis-info-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .info-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .card-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
  }

  .card-header h3 {
    margin: 0;
    color: #374151;
    font-size: 16px;
    font-weight: 600;
  }

  .card-content {
    padding: 20px;
  }

  .card-content p {
    margin: 0;
    color: #4b5563;
    line-height: 1.6;
    font-size: 14px;
    word-break: break-word;
  }

  .edit-button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .edit-info-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .edit-info-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .button-icon {
    font-size: 16px;
  }

  .advisor-info-section {
    position: sticky;
    top: 90px;
  }

  .advisor-card-large {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .advisor-header {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .advisor-icon {
    font-size: 24px;
  }

  .advisor-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .advisor-details {
    padding: 24px;
    text-align: center;
  }

  .advisor-avatar-large {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .avatar-initials {
    font-size: 28px;
    font-weight: 600;
    color: white;
  }

  .advisor-info-text h4 {
    margin: 0 0 8px;
    color: #1f2937;
    font-size: 18px;
    font-weight: 600;
  }

  .advisor-specialty {
    margin: 0 0 16px;
    color: #3b82f6;
    font-size: 14px;
    font-weight: 500;
    background: #eff6ff;
    padding: 4px 12px;
    border-radius: 20px;
    display: inline-block;
  }

  .advisor-contact {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
    color: #6b7280;
    font-size: 14px;
    background: #f9fafb;
    padding: 8px 16px;
    border-radius: 8px;
    word-break: break-all;
  }

  .email-icon {
    flex-shrink: 0;
    font-size: 16px;
  }

  .advisor-description {
    margin-top: 16px;
  }

  .advisor-description p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
    text-align: left;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
  }

  @media (max-width: 1200px) {
    .main-content {
      left: 260px;
    }
  }

  @media (max-width: 1024px) {
    .thesis-layout {
      grid-template-columns: 1fr;
    }

    .advisor-info-section {
      position: relative;
      top: 0;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      left: 0;
    }

    .content-section {
      padding: 16px;
    }

    .thesis-layout {
      gap: 20px;
    }

    .card-content,
    .advisor-details {
      padding: 16px;
    }

    .advisor-contact {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .main-header {
      padding: 12px 16px;
    }

    .content-section {
      padding: 12px;
    }

    .card-content p,
    .advisor-description p {
      font-size: 13px;
    }

    .advisor-avatar-large {
      width: 60px;
      height: 60px;
    }

    .avatar-initials {
      font-size: 24px;
    }
  }
`;