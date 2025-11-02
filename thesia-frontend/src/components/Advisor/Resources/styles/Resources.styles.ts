export const resourcesStyles = `
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .main-content {
    flex: 1;
    margin-left: 280px;
    background: #f5f5f5;
    min-height: 100vh;
    position: relative;
    width: calc(100% - 280px);
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
    padding: 8px;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .content-section {
    padding: 32px;
    max-width: 100%;
    margin: 0 auto;
  }

  .dashboard-header {
    margin-bottom: 32px;
  }

  .dashboard-title {
    color: #333;
    font-size: 28px;
    margin-bottom: 8px;
  }

  .dashboard-subtitle {
    color: #666;
    font-size: 16px;
  }

  @media (max-width: 1024px) {
    .main-content {
      margin-left: 240px;
      width: calc(100vw - 240px);
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

    .main-header {
      padding: 12px 16px;
    }

    .main-header h1 {
      font-size: 18px;
    }
  }
`;