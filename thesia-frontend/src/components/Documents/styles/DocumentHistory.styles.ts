export const documentHistoryStyles = `
  .document-history-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* HEADER */
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
  }

  .header-content h2 {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 28px;
    font-weight: 700;
  }

  .header-content p {
    margin: 0;
    color: #7f8c8d;
    font-size: 16px;
  }

  .history-stats {
    display: flex;
    gap: 24px;
  }

  .stat-item {
    text-align: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 12px;
    color: white;
    min-width: 80px;
  }

  .stat-number {
    display: block;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .stat-label {
    display: block;
    font-size: 12px;
    opacity: 0.9;
  }

  /* VIEW SELECTOR */
  .view-selector {
    display: flex;
    gap: 0;
    margin-bottom: 30px;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 4px;
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
    min-height: 400px;
  }

  .timeline {
    position: relative;
    padding-left: 30px;
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
    margin-bottom: 30px;
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
  }

  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .activity-title {
    font-weight: 600;
    color: #2c3e50;
    font-size: 16px;
  }

  .activity-time {
    color: #7f8c8d;
    font-size: 14px;
  }

  .activity-details {
    margin-top: 8px;
  }

  .activity-document {
    color: #2c3e50;
    font-size: 15px;
    margin-bottom: 6px;
  }

  .activity-meta {
    display: flex;
    gap: 16px;
    align-items: center;
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
    min-height: 400px;
  }

  .version-group {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
  }

  .group-header {
    padding: 20px 24px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .group-title {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 18px;
    font-weight: 600;
  }

  .group-meta {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .version-count {
    color: #7f8c8d;
    font-size: 14px;
  }

  .group-status {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
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
    align-items: center;
  }

  .version-item:last-child {
    border-bottom: none;
  }

  .version-header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 6px;
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
  }

  .version-name {
    color: #2c3e50;
    font-weight: 500;
  }

  .version-status {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
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
  @media (max-width: 768px) {
    .history-header {
      flex-direction: column;
      gap: 20px;
    }

    .history-stats {
      align-self: stretch;
      justify-content: space-around;
    }

    .group-header {
      flex-direction: column;
      gap: 16px;
    }

    .group-dates {
      text-align: left;
    }

    .version-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
`;