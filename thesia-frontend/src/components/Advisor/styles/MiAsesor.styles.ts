export const miAsesorStyles = `
  .asesor-container {
    display: flex;
    min-height: 100vh;
    width: 100vw;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow-x: hidden;
  }

  .main-content {
    flex: 1;
    margin-left: 280px;
    background: #f5f5f5;
    min-height: 100vh;
    width: calc(100vw - 280px);
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
    z-index: 50;
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
    padding: 8px;           // ← AGREGAR
    border-radius: 50%;     // ← AGREGAR
    transition: background 0.2s;  // ← AGREGAR
  }

  .notification-icon:hover {
    background: #f0f0f0;
  }
  .asesor-section {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .asesor-header {
    margin-bottom: 32px;
  }

  .asesor-header h2 {
    color: #333;
    font-size: 28px;
    margin-bottom: 8px;
  }

  .asesor-header p {
    color: #666;
    font-size: 16px;
  }

  /* === ADVISOR PROFILE CARD === */
  .advisor-profile-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-bottom: 24px;
  }

  .advisor-main-info {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .advisor-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
  }

  .advisor-details {
    flex: 1;
  }

  .advisor-name-status {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  .advisor-name-status h3 {
    color: #333;
    font-size: 24px;
    margin: 0;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-badge.available {
    background: #e8f5e8;
    color: #2e7d32;
  }

  .status-badge.busy {
    background: #fff3e0;
    color: #f57c00;
  }

  .status-badge.offline {
    background: #f3f4f6;
    color: #6b7280;
  }

  .advisor-title {
    color: #666;
    font-size: 16px;
    margin-bottom: 8px;
  }

  .advisor-stats {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #666;
  }

  .rating {
    color: #ff9800;
  }

  .schedule-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .schedule-btn:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  .schedule-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  /* === TABS CONTAINER === */
  .tabs-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid #eee;
  }

  .tab {
    flex: 1;
    padding: 16px 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .tab:hover {
    background: #f8f9fa;
  }

  .tab.active {
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
    background: #f8f9fa;
  }

  .tab-content {
    padding: 24px;
  }

  /* === PROFILE TAB CONTENT === */
  .profile-content {
  }

  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  .about-section h4,
  .contact-section h4,
  .specializations-section h4 {
    color: #333;
    margin-bottom: 12px;
    font-size: 16px;
  }

  .about-section p {
    color: #666;
    line-height: 1.6;
  }

  /* === CONTACT INFO === */
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;
    font-size: 14px;
  }

  .contact-icon {
    font-size: 16px;
  }

  /* === SPECIALIZATIONS === */
  .specializations-section {
    margin-bottom: 24px;
  }

  .specialization-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    background: #eff6ff;
    color: #3b82f6;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }

  /* === STATS SECTION === */
  .stats-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }

  .stat-item:last-child {
    border-bottom: none;
  }

  .stat-label {
    color: #666;
    font-size: 14px;
  }

  .stat-value {
    color: #3b82f6;
    font-weight: 600;
  }

  /* === COMING SOON SECTIONS === */
  .coming-soon {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }

  .coming-soon h4 {
    margin-bottom: 12px;
    color: #333;
  }

  /* === LOADING STATES === */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* === ERROR STATES === */
  .error-container {
    text-align: center;
    padding: 40px 20px;
    background: #fee2e2;
    border-radius: 8px;
    color: #991b1b;
    margin: 20px 0;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .retry-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 16px;
    transition: background 0.3s ease;
  }

  .retry-button:hover {
    background: #1d4ed8;
  }

  /* === RESPONSIVE DESIGN === */
  @media (max-width: 1024px) {
    .main-content {
      margin-left: 240px;
      width: calc(100vw - 240px);
    }

    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      width: 100vw;
    }
    
    .asesor-section {
      padding: 16px;
    }

    .advisor-main-info {
      flex-direction: column;
      text-align: center;
    }

    .tabs {
      flex-direction: column;
    }

    .tab-content {
      padding: 16px;
    }

    .advisor-stats {
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 480px) {
    .main-header {
      padding: 12px 16px;
    }
    
    .main-header h1 {
      font-size: 18px;
    }
    
    .asesor-section {
      padding: 12px;
    }

    .advisor-profile-card {
      padding: 16px;
    }

    .advisor-avatar {
      width: 60px;
      height: 60px;
      font-size: 24px;
    }

    .advisor-name-status h3 {
      font-size: 20px;
    }

    .specialization-tags {
      justify-content: center;
    }
  }
`;