export const documentHistoryStyles = `
  .document-history-container {
    background: #f8fafc;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  /* HEADER */
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    max-width: calc(100% - 48px); /* Considerando el padding del container */
  }

  .header-content h2 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 24px;
    font-weight: 600;
  }

  .header-content p {
    margin: 0;
    color: #7f8c8d;
    font-size: 16px;
  }

  .history-stats {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;
    padding: 16px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 12px;
    color: white;
    min-width: 120px;
    flex: 1;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  }

  .stat-number {
    display: block;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
    line-height: 1;
  }

  .stat-label {
    display: block;
    font-size: 12px;
    opacity: 0.9;
    white-space: nowrap;
  }

  /* VIEW SELECTOR */
  .view-selector {
    display: flex;
    margin: 0 24px 24px;
    background: white;
    border-radius: 12px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .view-button {
    flex: 1;
    padding: 12px 20px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .view-button:hover {
    background: rgba(0,0,0,0.05);
  }

  .view-button.active {
    background: white;
    color: #3b82f6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .view-icon {
    font-size: 16px;
  }

  /* SECTION TITLE */
  .section-title {
    margin: 0 0 20px 0;
    color: #2c3e50;
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 8px;
    border-bottom: 1px solid #ecf0f1;
  }

  /* TIMELINE VIEW */
  .timeline-view {
    padding: 0 24px;
    min-height: calc(100vh - 280px);
  }

  .timeline {
    position: relative;
    padding-left: 30px;
    max-width: 900px;
    margin: 0 auto;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #667eea, #764ba2);
  }

  .timeline-item {
    position: relative;
    margin-bottom: 24px;
  }

  .timeline-marker {
    position: absolute;
    left: -22px;
    top: 8px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: white;
    border: 3px solid #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .activity-icon {
    font-size: 14px;
  }

  .timeline-content {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    width: 100%;
    max-width: calc(100% - 40px); /* Considerando el espacio del marcador */
  }

  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    gap: 16px;
  }

  .activity-title {
    font-weight: 600;
    color: #2c3e50;
    font-size: 16px;
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .activity-time {
    color: #7f8c8d;
    font-size: 14px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .activity-details {
    margin-top: 8px;
    overflow: hidden;
  }

  .activity-document {
    color: #2c3e50;
    font-size: 15px;
    margin-bottom: 6px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
  }

  .activity-meta {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }

  .activity-phase {
    color: #7f8c8d;
    font-size: 14px;
  }

  .activity-status {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
  }

  .activity-status.green { background: #d4edda; color: #155724; }
  .activity-status.red { background: #f8d7da; color: #721c24; }
  .activity-status.yellow { background: #fff3cd; color: #856404; }
  .activity-status.gray { background: #f8f9fa; color: #6c757d; }

  .timeline-connector {
    position: absolute;
    left: -16px;
    bottom: -15px;
    width: 2px;
    height: 15px;
    background: #ecf0f1;
  }

  /* VERSIONS VIEW */
  .versions-view {
    padding: 0 24px;
    min-height: calc(100vh - 280px);
  }

  .version-group {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .group-header {
    padding: 20px 24px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }

  .group-title {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 18px;
    font-weight: 600;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
    flex: 1;
    min-width: 0;
  }

  .group-meta {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .version-count {
    color: #7f8c8d;
    font-size: 14px;
    white-space: nowrap;
  }

  .group-status {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .group-status.green { background: #d4edda; color: #155724; }
  .group-status.red { background: #f8d7da; color: #721c24; }
  .group-status.yellow { background: #fff3cd; color: #856404; }
  .group-status.gray { background: #f8f9fa; color: #6c757d; }

  .group-dates {
    text-align: right;
  }

  .date-info {
    display: flex;
    flex-direction: column;
    margin-bottom: 4px;
  }

  .date-label {
    font-size: 12px;
    color: #7f8c8d;
  }

  .date-value {
    font-size: 14px;
    color: #2c3e50;
    font-weight: 500;
  }

  .versions-list {
    padding: 0;
  }

  .version-item {
    padding: 16px 24px;
    border-bottom: 1px solid #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .version-item:last-child {
    border-bottom: none;
  }

  .version-info {
    flex: 1;
    min-width: 0;
  }

  .version-header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .version-number {
    background: #667eea;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    min-width: 24px;
    text-align: center;
    flex-shrink: 0;
  }

  .version-name {
    color: #2c3e50;
    font-weight: 500;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
    flex: 1;
    min-width: 0;
  }

  .version-status {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .version-status.green { background: #d4edda; color: #155724; }
  .version-status.red { background: #f8d7da; color: #721c24; }
  .version-status.yellow { background: #fff3cd; color: #856404; }
  .version-status.gray { background: #f8f9fa; color: #6c757d; }

  .version-meta {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #7f8c8d;
  }

  .action-button.view {
    padding: 8px 16px;
    border: 1px solid #667eea;
    background: transparent;
    color: #667eea;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
  }

  .action-button.view:hover {
    background: #667eea;
    color: white;
  }

  /* EMPTY STATES */
  .empty-timeline,
  .empty-versions {
    text-align: center;
    padding: 60px 20px;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-timeline h3,
  .empty-versions h3 {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 20px;
  }

  .empty-timeline p,
  .empty-versions p {
    margin: 0;
    color: #7f8c8d;
  }

  /* LOADING & ERROR STATES */
  .loading-container,
  .error-container {
    text-align: center;
    padding: 60px 20px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .retry-button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 16px;
    transition: background 0.3s ease;
  }

  .retry-button:hover {
    background: #5a67d8;
  }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .document-history-container {
      padding: 16px;
    }

    .history-header {
      padding: 20px;
      margin-bottom: 20px;
    }

    .history-stats {
      gap: 12px;
    }

    .stat-item {
      min-width: 100px;
      padding: 12px;
    }

    .view-selector {
      margin: 0 20px 20px;
    }

    .timeline-view,
    .versions-view {
      padding: 0 20px;
    }
  }

  @media (max-width: 768px) {
    .document-history-container {
      padding: 12px;
    }

    .history-header {
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .header-content h2 {
      font-size: 20px;
    }

    .history-stats {
      align-self: stretch;
      justify-content: space-around;
    }

    .stat-item {
      min-width: 90px;
      padding: 10px;
    }

    .stat-number {
      font-size: 20px;
    }

    .view-selector {
      margin: 0 16px 16px;
    }

    .view-button {
      padding: 8px 12px;
      font-size: 13px;
    }

    .timeline-view,
    .versions-view {
      padding: 0 16px;
      min-height: calc(100vh - 240px);
    }

    .group-header {
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .group-dates {
      text-align: left;
    }

    .version-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    .document-history-container {
      padding: 8px;
    }

    .history-header {
      padding: 12px;
      margin-bottom: 16px;
    }

    .header-content h2 {
      font-size: 18px;
    }

    .stat-item {
      min-width: calc(50% - 8px);
      flex: 0 0 calc(50% - 8px);
    }

    .view-selector {
      margin: 0 12px 16px;
    }

    .timeline-view,
    .versions-view {
      padding: 0 12px;
    }

    .timeline {
      padding-left: 24px;
    }

    .timeline::before {
      left: 12px;
    }

    .timeline-marker {
      left: -18px;
      width: 24px;
      height: 24px;
    }
  }
`;