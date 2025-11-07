export const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .dashboard-container {
    display: flex;
    min-height: 100vh;
    width: 100vw;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f5f7fa;
    overflow-x: hidden;
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
    width: 100%;
    max-width: none;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    gap: 16px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e3f2fd;
    border-top: 3px solid #1976d2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner-small {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 1024px) {
    .main-content {
      margin-left: 260px;
      max-width: calc(100vw - 260px);
      padding: 24px;
    }

    .content-section {
      padding: 24px;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      max-width: 100vw;
      padding: 16px;
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