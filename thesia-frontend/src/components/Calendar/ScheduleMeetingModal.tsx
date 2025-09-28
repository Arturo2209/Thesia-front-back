import React, { useState } from 'react';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (meetingData: any) => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedDate, setSelectedDate] = useState('Lunes - 11/8/2024');
  const [selectedTime, setSelectedTime] = useState('07/07/2025 a las 11:00');
  const [meetingType, setMeetingType] = useState('virtual');
  const [topic, setTopic] = useState('Revisión del Capítulo 1, SC24 Bullón-Nieves');

  // Horarios disponibles
  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00'
  ];

  const handleSubmit = () => {
    const meetingData = {
      date: selectedDate,
      time: selectedTime,
      type: meetingType,
      topic: topic
    };
    onSubmit(meetingData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agendar Nueva Reunión</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-content">
          <p className="modal-subtitle">Selecciona un horario disponible de tu asesor</p>

          {/* Disponibilidad del Asesor */}
          <div className="form-section">
            <label className="form-label">Disponibilidad del Asesor</label>
            <div className="date-selector">
              <h3>{selectedDate}</h3>
              <div className="time-slots">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    className={`time-slot ${selectedTime.includes(time) ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(`07/07/2025 a las ${time}`)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <div className="selected-time">
              <span className="time-indicator">🕐</span>
              <span>Horario seleccionado: {selectedTime}</span>
            </div>
          </div>

          {/* Tipo de Reunión */}
          <div className="form-section">
            <label className="form-label">Tipo de reunión</label>
            <div className="meeting-type-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="meetingType"
                  value="virtual"
                  checked={meetingType === 'virtual'}
                  onChange={(e) => setMeetingType(e.target.value)}
                />
                <div className="radio-content">
                  <span className="radio-icon">💻</span>
                  <div>
                    <div className="radio-title">Virtual</div>
                    <div className="radio-subtitle">Reunión por videollamada (Zoom, Meet, Teams)</div>
                  </div>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="meetingType"
                  value="presencial"
                  checked={meetingType === 'presencial'}
                  onChange={(e) => setMeetingType(e.target.value)}
                />
                <div className="radio-content">
                  <span className="radio-icon">📍</span>
                  <div>
                    <div className="radio-title">Presencial</div>
                    <div className="radio-subtitle">Reunión en oficina de asesor</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Tema de la reunión */}
          <div className="form-section">
            <label className="form-label">Tema de la reunión</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="topic-input"
              placeholder="Revisión del Capítulo 1, SC24 Bullón-Nieves"
            />
          </div>

          {/* Botón de enviar */}
          <button onClick={handleSubmit} className="submit-btn">
            <span>📅</span> Enviar Solicitud
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
          font-size: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #f5f5f5;
        }

        .modal-content {
          padding: 24px;
        }

        .modal-subtitle {
          color: #666;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .date-selector h3 {
          color: #333;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .time-slots {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .time-slot {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .time-slot:hover {
          border-color: #1976d2;
          background: #f8f9fa;
        }

        .time-slot.selected {
          background: #1976d2;
          color: white;
          border-color: #1976d2;
        }

        .selected-time {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #e8f5e8;
          border-radius: 6px;
          color: #2e7d32;
          font-size: 14px;
        }

        .time-indicator {
          font-size: 16px;
        }

        .meeting-type-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .radio-option {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .radio-option:hover {
          border-color: #1976d2;
          background: #f8f9fa;
        }

        .radio-option input[type="radio"] {
          margin: 0;
        }

        .radio-option input[type="radio"]:checked + .radio-content {
          color: #1976d2;
        }

        .radio-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
        }

        .radio-icon {
          font-size: 20px;
        }

        .radio-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .radio-subtitle {
          color: #666;
          font-size: 13px;
        }

        .topic-input {
          width: 100%;
          min-height: 80px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
          box-sizing: border-box;
        }

        .topic-input:focus {
          outline: none;
          border-color: #1976d2;
        }

        .submit-btn {
          width: 100%;
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: #5a6268;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 10px;
          }

          .modal-header,
          .modal-content {
            padding: 16px;
          }

          .time-slots {
            gap: 6px;
          }

          .time-slot {
            padding: 6px 12px;
            font-size: 13px;
          }

          .radio-option {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScheduleMeetingModal;