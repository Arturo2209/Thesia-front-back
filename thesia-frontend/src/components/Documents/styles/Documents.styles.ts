export const documentsStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .documents-container {
    display: flex;
    min-height: 100vh;
    background: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

  /* === TABS NAVIGATION === */
  .tabs-container {
    margin-bottom: 32px;
  }

  .tabs-nav {
    display: flex;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    width: fit-content;
  }

  .tab-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
    position: relative;
    min-width: 140px;
    justify-content: center;
  }

  .tab-button:hover {
    background: #f8fafc;
    color: #3b82f6;
  }

  .tab-button.active {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    font-weight: 600;
  }

  .tab-button.active .tab-icon {
    opacity: 1;
  }

  .tab-icon {
    font-size: 16px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .tab-text {
    font-size: 14px;
  }

  /* === CONTENT AREA === */
  .tab-content {
    min-height: 500px;
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
  }

  @media (max-width: 1024px) {
    .tabs-nav {
      width: 100%;
    }

    .tab-button {
      flex: 1;
      min-width: auto;
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

    .tabs-nav {
      flex-direction: column;
    }

    .tab-button {
      justify-content: flex-start;
      padding: 12px 16px;
    }
  }

  @media (max-width: 480px) {
    .content-section {
      padding: 12px;
    }

    .tab-text {
      display: none;
    }

    .tab-button {
      min-width: 60px;
      padding: 12px;
    }

    .tabs-nav {
      flex-direction: row;
      justify-content: center;
    }
  }
`;