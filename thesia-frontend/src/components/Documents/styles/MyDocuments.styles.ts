export const myDocumentsStyles = `
  .my-documents-container {
    width: 100%;
  }

  /* === LOADING & ERROR STATES === */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-left: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-container p {
    color: #64748b;
    font-size: 16px;
    margin: 0;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-message {
    color: #ef4444;
    font-size: 16px;
    margin-bottom: 24px;
  }

  .retry-button {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .retry-button:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    transform: translateY(-1px);
  }

  /* === HEADER === */
  .documents-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .header-content h2 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 24px;
    font-weight: 600;
  }

  .header-content p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }

  .documents-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    min-width: 80px;
  }

  .count-number {
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  .count-label {
    font-size: 12px;
    opacity: 0.9;
    margin-top: 4px;
  }

  /* === SEARCH & FILTERS === */
  .search-filter-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 24px;
  }

  .search-box {
    position: relative;
    margin-bottom: 20px;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: #9ca3af;
  }

  .search-box input {
    width: 100%;
    padding: 12px 16px 12px 48px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
    background: #f9fafb;
    color: #374151; 
  }

  .search-box input:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    color: #1f2937;
  }

  .search-box input::placeholder {
    color: #9ca3af;
    opacity: 1;
  }

  .filters-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .filter-group label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .filter-group select {
    padding: 10px 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    background: #f9fafb;
    color: #374151;               // ✅ AGREGADO: Color del texto
    transition: all 0.2s;
    cursor: pointer;  
  }

  .filter-group select:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    color: #1f2937; 
  }
  
  .filter-group select option {
    background: white;
    color: #374151;
    padding: 8px 12px;
  }

  .filter-group select option:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  /* === DOCUMENTS LIST === */
  .documents-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .document-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    padding: 20px;
  }

  .document-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }

  .document-info {
    flex: 1;
    min-width: 0;
  }

  .document-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .document-name {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .file-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .file-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
  }

  /* === STATUS BADGES === */
  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
  }

  .status-badge.green {
    background: #d1fae5;
    color: #065f46;
  }

  .status-badge.yellow {
    background: #fef3c7;
    color: #92400e;
  }

  .status-badge.red {
    background: #fee2e2;
    color: #991b1b;
  }

  .status-badge.gray {
    background: #f3f4f6;
    color: #374151;
  }

  /* === DOCUMENT META === */
  .document-meta {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .meta-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
  }

  .meta-value {
    font-size: 12px;
    color: #374151;
    font-weight: 600;
  }

  /* === COMMENT PREVIEW === */
  .comment-preview {
    background: #f8fafc;
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
    margin-top: 8px;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .comment-icon {
    font-size: 14px;
    color: #3b82f6;
  }

  .comment-author {
    font-size: 12px;
    font-weight: 600;
    color: #3b82f6;
  }

  .comment-text {
    margin: 0;
    font-size: 13px;
    color: #4b5563;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* === ACTIONS === */
  .document-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-left: 24px;
    flex-shrink: 0;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 120px;
    justify-content: center;
    text-decoration: none;
  }

  .action-button.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  .action-button.primary:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .action-button.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .action-button.secondary:hover {
    background: #e5e7eb;
    color: #1f2937;
    transform: translateY(-1px);
  }

  .button-icon {
    font-size: 14px;
  }

  /* === EMPTY STATE === */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .empty-icon {
    font-size: 64px;
    opacity: 0.5;
    margin-bottom: 16px;
  }

  .empty-state h3 {
    margin: 0 0 8px 0;
    color: #374151;
    font-size: 18px;
    font-weight: 600;
  }

  .empty-state p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    max-width: 400px;
    line-height: 1.5;
  }

  /* === RESPONSIVE === */
  @media (max-width: 1024px) {
    .document-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .document-actions {
      margin-left: 0;
      margin-top: 16px;
      flex-direction: row;
      width: 100%;
    }

    .action-button {
      flex: 1;
    }
  }

  @media (max-width: 768px) {
    .documents-header {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }

    .filters-row {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .document-meta {
      flex-direction: column;
      gap: 8px;
    }

    .search-filter-section {
      padding: 16px;
    }

    .document-card {
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    .content-section {
      padding: 12px;
    }

    .documents-header {
      padding: 16px;
    }

    .search-filter-section {
      padding: 12px;
    }

    .document-card {
      padding: 12px;
    }

    .file-name {
      font-size: 14px;
    }

    .action-button {
      padding: 8px 12px;
      font-size: 12px;
      min-width: 100px;
    }

    .comment-preview {
      padding: 8px 12px;
    }
  }
`;