export const advisorScheduleStyles = `
  .schedule-container {
    padding: 0; /* el contenedor externo ya agrega padding */
    max-width: 100%;
    margin: 0;
    width: 100%;
  }

  .schedule-header {
    text-align: left;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .schedule-header h3 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 24px;
  }

  .schedule-subtitle {
    margin: 0;
    color: #6b7280;
    font-size: 16px;
  }

  .error-message {
    background: #fee2e2;
    color: #991b1b;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .general-schedule h4,
  .date-selector h4 {
    margin: 20px 0 16px 0;
    color: #374151;
    font-size: 18px;
  }

  .schedule-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }

  .day-schedule {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .day-name {
    margin: 0 0 12px 0;
    color: #1f2937;
    font-size: 16px;
    font-weight: 600;
  }

  .time-slots {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .time-slot {
    background: #f9fafb;
    border-radius: 8px;
    padding: 12px;
    border-left: 4px solid;
  }

  .slot-time {
    font-weight: 600;
    color: #1f2937;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .slot-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .modalidad-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    color: white;
  }

  .slot-location {
    font-size: 11px;
    color: #6b7280;
  }

  .date-input-container {
    margin-bottom: 20px;
  }

  .date-input-container label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
  }

  .date-input {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    width: 200px;
  }

  .available-slots h5 {
    margin: 16px 0 12px 0;
    color: #374151;
    font-size: 16px;
  }

  .slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .slot-button {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .slot-button:hover:not(:disabled) {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  .slot-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .slot-time-btn {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .slot-modalidad {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 2px;
  }

  .slot-location-btn {
    font-size: 11px;
    color: #9ca3af;
  }

  .loading-state,
  .loading-slots {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #6b7280;
  }

  .spinner,
  .spinner-small {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f4f6;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }

  .no-schedule,
  .no-slots {
    text-align: center;
    padding: 30px;
    color: #6b7280;
    background: #f9fafb;
    border-radius: 8px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 1024px) {
    .schedule-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .schedule-grid {
      grid-template-columns: 1fr;
    }
    
    .slots-grid {
      grid-template-columns: 1fr;
    }

    .schedule-container { padding: 0; }
  }
`;