import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

const MiCalendario: React.FC = () => {
  const navigate = useNavigate();
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Lunes - 11/8/2024');
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [meetingType, setMeetingType] = useState('virtual');
  const [topic, setTopic] = useState('Revisión del Capítulo 1, SC24 Bullón-Nieves');

  const handleLogout = () => {
    navigate('/');
  };

  const handleScheduleMeeting = () => {
    setShowNewMeetingModal(true);
  };

  const handleCloseModal = () => {
    setShowNewMeetingModal(false);
  };

  const handleSubmitMeeting = () => {
    const meetingData = {
      date: selectedDate,
      time: selectedTime,
      type: meetingType,
      topic: topic
    };
    console.log('Datos de la reunión:', meetingData);
    alert('Solicitud de reunión enviada correctamente!');
    setShowNewMeetingModal(false);
  };

  // Horarios disponibles del asesor (esto vendría del backend)
  const availableSlots = [
    { date: "21/6/2024", time: "09:00" },
    { date: "24/6/2024", time: "10:00" },
    { date: "24/6/2024", time: "14:00" }
  ];

  // Horarios disponibles para seleccionar
  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00'];

  return (
    <div className="calendario-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="calendario-section">
          {/* Header */}
          <div className="calendario-header">
            <h2>Mi Calendario</h2>
            <p>Gestiona tus reuniones y fechas importantes</p>
          </div>

          <div className="calendar-grid">
            {/* Left Column */}
            <div className="left-column">
              {/* Próximas Reuniones */}
              <div className="card">
                <div className="card-header">
                  <h3>Próximas Reuniones</h3>
                  <button onClick={handleScheduleMeeting} className="new-meeting-btn">
                    + Nueva Reunión
                  </button>
                </div>
                <div className="meetings-list">
                  <p className="no-meetings">No se encuentra resultado, añade una nueva reunión.</p>
                </div>
              </div>

              {/* Fechas Límite Próximas */}
              <div className="card">
                <h3>Fechas Límite Próximas</h3>
                <div className="deadlines-list">
                  <p className="no-deadlines">No se encuentra resultado.</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Disponibilidad de Asesor */}
              <div className="card">
                <h3>Disponibilidad de Asesor</h3>
                <div className="availability-list">
                  {availableSlots.map((slot, index) => (
                    <div key={index} className="availability-item">
                      <div className="slot-info">
                        <div className="slot-date">{slot.date}</div>
                        <div className="slot-time">{slot.time}</div>
                      </div>
                      <button 
                        className="schedule-btn"
                        onClick={handleScheduleMeeting}
                      >
                        Agendar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progreso Actual */}
              <div className="card">
                <h3>Progreso Actual</h3>
                <div className="progress-info">
                  <div className="progress-text">
                    <span>Fase 0 de 5</span>
                    <span>0%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '0%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Nueva Reunión */}
      {showNewMeetingModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agendar Nueva Reunión</h2>
              <button onClick={handleCloseModal} className="close-btn">×</button>
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
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="selected-time">
                  <span className="time-indicator">🕐</span>
                  <span>Horario seleccionado: 07/07/2025 a las {selectedTime}</span>
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
              <button onClick={handleSubmitMeeting} className="submit-btn">
                <span>📅</span> Enviar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .calendario-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
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
          z-index: 50;
        }

        .main-header h1 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .notification-icon {
          font-size: 20px;
          cursor: pointer;
        }

        .calendario-section {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .calendario-header {
          margin-bottom: 32px;
        }

        .calendario-header h2 {
          color: #333;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .calendario-header p {
          color: #666;
          font-size: 16px;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card h3 {
          color: #333;
          font-size: 18px;
          margin-bottom: 16px;
        }

        .new-meeting-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .new-meeting-btn:hover {
          background: #1565c0;
        }

        .no-meetings,
        .no-deadlines {
          color: #666;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }

        .availability-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .availability-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #dee2e6;
        }

        .slot-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .slot-date {
          font-weight: 500;
          color: #333;
        }

        .slot-time {
          font-size: 14px;
          color: #666;
        }

        .schedule-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        }

        .schedule-btn:hover {
          background: #218838;
        }

        .progress-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 14px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #1976d2;
          transition: width 0.3s ease;
        }

        /* Modal Styles */
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

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 240px;
            width: calc(100vw - 240px);
          }

          .calendar-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            width: 100vw;
          }
          
          .calendario-section {
            padding: 16px;
          }

          .card {
            padding: 16px;
          }

          .card-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .availability-item {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

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

        @media (max-width: 480px) {
          .main-header {
            padding: 12px 16px;
          }
          
          .main-header h1 {
            font-size: 18px;
          }
          
          .calendario-section {
            padding: 12px;
          }

          .modal-container {
            width: 95%;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default MiCalendario;