export const dashboardStyles = `
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
    z-index: 10;
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

  .dashboard-content {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .dashboard-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
  }

  .dashboard-subtitle {
    color: #666;
    font-size: 16px;
    margin: 0;
    max-width: 600px;
  }

  .loading-indicator {
    background: rgba(25, 118, 210, 0.1);
    color: #1976d2;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .error-container {
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    margin: 2rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .error-message {
    color: #d32f2f;
    margin-bottom: 1rem;
  }

  .retry-button {
    background: #1976d2;
    color: white;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .retry-button:hover {
    background: #1565c0;
    transform: translateY(-1px);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-top: 3px solid;
    transition: transform 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .stat-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 1rem 0;
  }

  .stat-value {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .stat-description {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  .dashboard-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-top: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0 0 1.5rem 0;
  }

  @media (max-width: 1024px) {
    .main-content {
      margin-left: 240px;
      width: calc(100vw - 240px);
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      width: 100vw;
    }
    
    .dashboard-content {
      padding: 16px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .dashboard-header {
      flex-direction: column;
    }

    .loading-indicator {
      margin-top: 1rem;
    }
  }

  @media (max-width: 480px) {
    .main-header {
      padding: 12px 16px;
    }
    
    .main-header h1 {
      font-size: 18px;
    }
    
    .dashboard-content {
      padding: 12px;
    }

    .dashboard-title {
      font-size: 24px;
    }

    .stat-card {
      padding: 1rem;
    }
  }
`;