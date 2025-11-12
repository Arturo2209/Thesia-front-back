export const dashboardStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    overflow-x: hidden;
  }

  .dashboard-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    position: relative;
    overflow-x: hidden;
    background: #ffffff; /* Fondo cambiado a blanco para uniformidad */
  }

  /* Unificamos el layout con el resto de vistas: usamos margin-left en lugar de padding en el contenedor */
  .main-content {
    flex: 1;
    min-height: 100vh;
    position: relative;
    margin-left: 280px; /* Alineado con el ancho del Sidebar */
    padding-bottom: 32px; /* Espacio inferior para evitar corte */
    overflow-x: hidden;
    transition: margin-left 0.3s ease; /* Transición suave cuando cambia el ancho del sidebar */
  }

  /* === HEADER === */
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

  /* === CONTENT SECTION === */
  .content-section {
    padding: 32px;
    max-width: 100%;
    margin: 0 auto;
  }

  /* === CONNECTION STATUS === */
  .connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 500;
  }

  .connection-status.connected {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #d1fae5;
  }

  .connection-status.checking {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .connection-status.error {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  /* === ALERT BANNER === */
  .alert-banner {
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
  }

  .alert-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }

  .alert-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .alert-text {
    flex: 1;
  }

  .alert-text h3 {
    margin: 0 0 8px 0;
    color: #92400e;
    font-size: 16px;
    font-weight: 600;
  }

  .alert-text p {
    margin: 0;
    color: #92400e;
    font-size: 14px;
  }

  .alert-button {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .alert-button:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transform: translateY(-1px);
  }

  /* === USER INFO === */
  .user-info-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 32px;
  }

  .user-info-section h4 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 18px;
    font-weight: 600;
  }

  .user-info-section p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }

  /* === DASHBOARD GRID === */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 32px;
  }

  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* === DASHBOARD CARDS === */
  .dashboard-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .card-header {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .card-icon {
    font-size: 20px;
    opacity: 0.9;
  }

  .card-content {
    padding: 20px;
  }

  /* === PROGRESS CARD === */
  .thesis-info h4 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
  }

  .thesis-info p {
    margin: 0 0 16px 0;
    color: #6b7280;
    font-size: 14px;
  }

  .progress-bar {
    background: #f3f4f6;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    height: 100%;
    transition: width 0.3s ease;
  }

  .progress-text {
    margin: 0;
    text-align: right;
    color: #6b7280;
    font-size: 12px;
    font-weight: 500;
  }

  .no-thesis {
    text-align: center;
    padding: 20px;
    color: #6b7280;
  }

  .no-thesis-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .no-thesis h4 {
    margin: 0 0 8px 0;
    color: #374151;
    font-size: 16px;
  }

  .no-thesis p {
    margin: 0;
    font-size: 14px;
  }

  /* === STATS GRID === */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    border-left: 4px solid;
  }

  .stat-card:hover {
    transform: translateY(-2px);
  }

  .stat-card.blue {
    border-left-color: #3b82f6;
  }

  .stat-card.green {
    border-left-color: #10b981;
  }

  .stat-card.orange {
    border-left-color: #f59e0b;
  }

  .stat-card.purple {
    border-left-color: #8b5cf6;
  }

  .stat-icon {
    font-size: 24px;
    margin-bottom: 8px;
    display: block;
  }

  .stat-card.blue .stat-icon,
  .stat-card.blue .stat-number {
    color: #3b82f6;
  }

  .stat-card.green .stat-icon,
  .stat-card.green .stat-number {
    color: #10b981;
  }

  .stat-card.orange .stat-icon,
  .stat-card.orange .stat-number {
    color: #f59e0b;
  }

  .stat-card.purple .stat-icon,
  .stat-card.purple .stat-number {
    color: #8b5cf6;
  }

  .stat-number {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
    display: block;
  }

  .stat-label {
    color: #6b7280;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* === ACTIVITIES === */
  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .activity-item {
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .activity-item:last-child {
    border-bottom: none;
  }

  .activity-description {
    font-weight: 500;
    color: #374151;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .activity-date {
    color: #6b7280;
    font-size: 12px;
  }

  .no-activities {
    text-align: center;
    padding: 20px;
    color: #6b7280;
  }

  .no-activities-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .no-activities p {
    margin: 0;
    font-size: 14px;
  }

  .view-all-button {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    color: #3b82f6;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }

  .view-all-button:hover {
    background: #f1f5f9;
    border-color: #3b82f6;
  }

  /* === QUICK ACTIONS === */
  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }

  .action-button:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: translateY(-1px);
  }

  .action-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .action-content {
    display: flex;
    flex-direction: column;
  }

  .action-title {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
    margin-bottom: 2px;
  }

  .action-subtitle {
    color: #6b7280;
    font-size: 12px;
  }

  /* === ADVISOR CARD === */
  .advisor-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .advisor-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 18px;
    flex-shrink: 0;
  }

  .advisor-details {
    flex: 1;
  }

  .advisor-details h4 {
    margin: 0 0 4px 0;
    color: #1f2937;
    font-size: 16px;
    font-weight: 600;
  }

  .advisor-details p {
    margin: 0 0 12px 0;
    color: #6b7280;
    font-size: 14px;
  }

  .contact-button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .contact-button:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
  }

  .no-advisor {
    text-align: center;
    padding: 20px;
    color: #6b7280;
  }

  .no-advisor-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .no-advisor h4 {
    margin: 0 0 8px 0;
    color: #374151;
    font-size: 16px;
  }

  .no-advisor p {
    margin: 0;
    font-size: 14px;
  }

  /* === LOADING & ERROR STATES === */
  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    gap: 16px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-container p {
    color: #6b7280;
    font-size: 16px;
  }

  .error-icon {
    font-size: 48px;
  }

  .error-message {
    font-size: 18px;
    color: #dc2626;
    text-align: center;
  }

  .retry-button {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .retry-button:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    transform: translateY(-1px);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* === RESPONSIVE === */
  @media (max-width: 1024px) {
    .main-content {
      margin-left: 240px; /* Sidebar más estrecho en pantallas medianas */
    }

    .dashboard-grid {
      gap: 24px;
      grid-template-columns: 1fr; /* Colapsa a una sola columna */
    }

    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0; /* Sin sidebar fijo visible */
      width: 100vw;
    }

    .content-section {
      padding: 16px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .alert-content {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .main-header h1 {
      font-size: 18px;
    }

    .card-content {
      padding: 16px;
    }
  }
`;