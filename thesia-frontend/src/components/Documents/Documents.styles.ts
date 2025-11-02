import { css } from '@emotion/css';

export const documentsStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    overflow-x: hidden;
  }

  .student-documents-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f5f7fa;
    position: relative;
  }

  .main-content {
    flex: 1;
    margin-left: 280px;
    width: calc(100% - 280px);
    min-height: 100vh;
    background: #f5f7fa;
    position: relative;
    z-index: 1;
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
    color: #4b5563;
  }

  .notification-icon:hover {
    background: #f3f4f6;
  }

  .content-section {
    padding: 24px;
  }

  .documents-header {
    margin-bottom: 24px;
  }

  .documents-header h2 {
    font-size: 24px;
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .documents-header p {
    color: #64748b;
    font-size: 14px;
    line-height: 1.5;
  }

  .tabs-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .tabs-nav {
    display: flex;
    padding: 8px 16px 0;
    border-bottom: 1px solid #e5e7eb;
    background: white;
  }

  .tab-button {
    padding: 12px 16px;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    transition: all 0.2s ease;
  }

  .tab-button:hover {
    color: #3b82f6;
  }

  .tab-button.active {
    color: #3b82f6;
    font-weight: 600;
  }

  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #3b82f6;
  }

  .tab-icon {
    font-size: 20px;
  }

  .tab-content {
    padding: 24px;
    background: white;
  }

  /* === LOADING STATES === */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 16px;
    padding: 20px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* === RESPONSIVE === */
  @media (max-width: 1024px) {
    .main-content {
      margin-left: 260px;
      width: calc(100% - 260px);
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      width: 100%;
    }

    .content-section {
      padding: 16px;
    }

    .main-header {
      padding: 12px 16px;
    }

    .documents-header h2 {
      font-size: 20px;
    }
  }

  @media (max-width: 640px) {
    .content-section {
      padding: 12px;
    }

    .documents-header {
      margin-bottom: 20px;
    }

    .tabs-container {
      border-radius: 8px;
    }
  }
`;