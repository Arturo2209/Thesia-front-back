export const thesisRegisteredStyles = `
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
    max-width: 1400px;
    margin: 0 auto;
  }

  .thesis-registered-container {
    width: 100%;
  }

  .success-header {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    gap: 20px;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .success-circle {
    width: 64px;
    height: 64px;
    background: #22c55e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }

  .success-circle .check-icon {
    color: white;
    font-size: 32px;
    font-weight: bold;
  }

  .success-info h2 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 28px;
    font-weight: 600;
  }

  .success-text {
    margin: 0;
    color: #22c55e;
    font-size: 16px;
    font-weight: 500;
  }

  .thesis-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 32px;
    align-items: start;
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
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .info-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
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
  }

  .edit-button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
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
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  .edit-info-btn:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  }

  .button-icon {
    font-size: 14px;
  }

  .advisor-info-section {
    display: flex;
    flex-direction: column;
  }

  .advisor-card-large {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    height: fit-content;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .advisor-card-large:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
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
    opacity: 0.9;
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
    margin: 0 auto 16px auto;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }

  .avatar-initials {
    font-size: 28px;
    font-weight: 600;
    color: white;
  }

  .advisor-info-text h4 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 18px;
    font-weight: 600;
  }

  .advisor-specialty {
    margin: 0 0 16px 0;
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
  }

  .email-icon {
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

  /* Responsive */
  @media (max-width: 1200px) {
    .main-content {
      margin-left: 260px;
      width: calc(100vw - 260px);
    }

    .content-section {
      padding: 24px;
    }

    .thesis-layout {
      gap: 24px;
    }
  }

  @media (max-width: 1024px) {
    .thesis-layout {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .advisor-card-large {
      max-width: 600px;
      margin: 0 auto;
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

    .success-header {
      flex-direction: column;
      text-align: center;
      gap: 16px;
      padding: 20px;
    }

    .success-info h2 {
      font-size: 24px;
    }

    .thesis-layout {
      gap: 20px;
    }

    .advisor-details {
      padding: 20px;
    }

    .advisor-avatar-large {
      width: 60px;
      height: 60px;
    }

    .avatar-initials {
      font-size: 24px;
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

    .success-header {
      padding: 16px;
    }

    .card-content,
    .advisor-details {
      padding: 16px;
    }
  }
`;