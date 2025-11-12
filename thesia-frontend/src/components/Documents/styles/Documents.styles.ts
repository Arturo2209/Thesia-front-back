export const documentsStyles = `
  .documents-container {
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #ffffff; /* Unificar fondo blanco */
    overflow-x: hidden;
  }

  .main-content {
    flex: 1;
    margin-left: 280px;
    /* Sin padding ni sombra para que el header quede pegado a la pantalla */
    background: #ffffff;
    overflow-y: auto;
  }

  .main-header {
    background: #ffffff;
    padding: 16px 24px; /* El padding vive en el header, no en main-content */
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .tabs-container {
    margin-top: 20px;
  }

  .tabs-nav {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 16px;
  }

  .tab-button {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
    background-color: #e0e0e0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  .tab-button.active {
    background-color: #1976d2;
    color: white;
    transform: scale(1.05);
  }

  .tab-button:hover {
    background-color: #bbdefb;
  }

  .tab-content {
    margin-top: 20px;
  }

  @media (max-width: 1024px) {
    .main-content {
      margin-left: 260px;
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      width: 100vw;
    }

    .tabs-container {
      flex-direction: column;
    }
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 280px;
    height: 100vh;
    background: #1976d2;
    color: white;
    z-index: 100;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  }

  .content-section {
    padding: 32px; /* El contenido sí tiene padding */
    box-sizing: border-box;
  }

  .dashboard-container {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }
`;
