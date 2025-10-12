import React, { useState, useEffect } from 'react';
import type { Advisor } from '../types/advisor.types';
import { advisorScheduleStyles } from '../styles/AdvisorSchedule.styles';

// 📋 TIPOS PARA HORARIOS
interface TimeSlot {
  id_disponibilidad: number;
  hora_inicio: string;
  hora_fin: string;
  modalidad: 'presencial' | 'virtual' | 'mixto';
  ubicacion?: string;
  available: boolean;
}

interface DaySchedule {
  [day: string]: TimeSlot[];
}

interface AdvisorScheduleProps {
  advisor: Advisor;
}

const AdvisorSchedule: React.FC<AdvisorScheduleProps> = ({ advisor }) => {
  const [schedule, setSchedule] = useState<DaySchedule>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🗓️ Días de la semana en español
  const dayNames: { [key: string]: string } = {
    'lunes': 'Lunes',
    'martes': 'Martes', 
    'miercoles': 'Miércoles',
    'jueves': 'Jueves',
    'viernes': 'Viernes',
    'sabado': 'Sábado'
  };

  // 🎨 Colores por modalidad
  const modalityColors: { [key: string]: string } = {
    'presencial': '#3b82f6',
    'virtual': '#10b981', 
    'mixto': '#8b5cf6'
  };

  // 🔄 Cargar horarios del asesor
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/schedules/advisor/${advisor.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          setSchedule(data.availability);
          console.log('✅ Horarios cargados:', data.availability);
        } else {
          setError(data.message || 'Error cargando horarios');
        }

      } catch (error) {
        console.error('❌ Error cargando horarios:', error);
        setError('Error de conexión al cargar horarios');
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [advisor.id]);

  // 📅 Cargar slots para fecha específica
  const loadSlotsForDate = async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/schedules/advisor/${advisor.id}/slots/${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.available_slots);
        console.log('✅ Slots disponibles:', data.available_slots);
      } else {
        setError(data.message || 'Error cargando slots disponibles');
      }

    } catch (error) {
      console.error('❌ Error cargando slots:', error);
      setError('Error de conexión al cargar slots');
    } finally {
      setLoading(false);
    }
  };

  // 📝 Manejar reserva de slot
  const handleReserveSlot = async (slot: TimeSlot) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/schedules/advisor/${advisor.id}/reserve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fecha: selectedDate,
          hora_inicio: slot.hora_inicio,
          hora_fin: slot.hora_fin,  // 🔧 ESTA LÍNEA FALTABA!
          modalidad: slot.modalidad,
          agenda: 'Reunión de seguimiento de tesis'
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        // ✅ FEEDBACK MEJORADO
        alert(`✅ ¡Solicitud enviada exitosamente!
  
  📅 Fecha: ${selectedDate}
  ⏰ Hora: ${slot.hora_inicio} - ${slot.hora_fin}  
  🎯 Modalidad: ${slot.modalidad}
  ${slot.ubicacion ? `📍 Ubicación: ${slot.ubicacion}` : ''}
  
  ℹ️ Estado: PENDIENTE DE APROBACIÓN
  🔔 El asesor ${advisor.name} recibirá una notificación
  📱 Te notificaremos cuando responda
  
  💡 Tip: Puedes revisar el estado en la sección "Mis Reuniones"`);
        
        // Recargar slots para mostrar que ya no está disponible
        loadSlotsForDate(selectedDate);
      } else {
        alert(`❌ Error al enviar solicitud: ${data.message}`);
      }
  
    } catch (error) {
      console.error('❌ Error reservando slot:', error);
      alert('❌ Error de conexión al enviar la solicitud de reunión');
    } finally {
      setLoading(false);
    }
  };

  // 📝 Manejar selección de fecha
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    
    if (date) {
      loadSlotsForDate(date);
    }
  };

  // 🎯 Formatear hora
  const formatTime = (time: string): string => {
    return time.slice(0, 5); // HH:MM
  };

  // 📅 Obtener fecha mínima (hoy)
  const getMinDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  // 📅 Obtener fecha máxima (30 días desde hoy)
  const getMaxDate = (): string => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading && Object.keys(schedule).length === 0) {
    return (
      <div className="schedule-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando horarios disponibles...</p>
        </div>
        <style>{advisorScheduleStyles}</style>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      {/* === HEADER === */}
      <div className="schedule-header">
        <h3>📅 Horarios de {advisor.name}</h3>
        <p className="schedule-subtitle">{advisor.specialty}</p>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* === HORARIOS GENERALES === */}
      <div className="general-schedule">
        <h4>🗓️ Disponibilidad Semanal</h4>
        
        {Object.keys(schedule).length === 0 ? (
          <div className="no-schedule">
            <p>📭 El asesor no tiene horarios configurados</p>
          </div>
        ) : (
          <div className="schedule-grid">
            {Object.entries(schedule).map(([day, slots]) => (
              <div key={day} className="day-schedule">
                <h5 className="day-name">{dayNames[day]}</h5>
                <div className="time-slots">
                  {slots.map((slot, index) => (
                    <div 
                      key={index} 
                      className="time-slot"
                      style={{ 
                        borderLeft: `4px solid ${modalityColors[slot.modalidad]}` 
                      }}
                    >
                      <div className="slot-time">
                        {formatTime(slot.hora_inicio)} - {formatTime(slot.hora_fin)}
                      </div>
                      <div className="slot-info">
                        <span 
                          className={`modalidad-badge modalidad-${slot.modalidad}`}
                          style={{ 
                            backgroundColor: modalityColors[slot.modalidad] 
                          }}
                        >
                          {slot.modalidad === 'presencial' && '🏢'}
                          {slot.modalidad === 'virtual' && '💻'}
                          {slot.modalidad === 'mixto' && '🔄'}
                          {slot.modalidad}
                        </span>
                        {slot.ubicacion && (
                          <div className="slot-location">
                            📍 {slot.ubicacion}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === SELECTOR DE FECHA === */}
      {Object.keys(schedule).length > 0 && (
        <div className="date-selector">
          <h4>📆 Agendar Reunión</h4>
          <div className="date-input-container">
            <label htmlFor="meeting-date">Selecciona una fecha:</label>
            <input
              id="meeting-date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={getMinDate()}
              max={getMaxDate()}
              className="date-input"
            />
          </div>

          {/* === SLOTS DISPONIBLES PARA LA FECHA === */}
          {selectedDate && (
            <div className="available-slots">
              <h5>⏰ Horarios Disponibles - {selectedDate}</h5>
              
              {loading ? (
                <div className="loading-slots">
                  <div className="spinner-small"></div>
                  Cargando horarios disponibles...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="no-slots">
                  <p>😔 No hay horarios disponibles para esta fecha</p>
                  <p>Intenta con otra fecha o contacta directamente al asesor</p>
                </div>
              ) : (
                <div className="slots-grid">
                  {availableSlots.map((slot, index) => (
                    <button 
                      key={index} 
                      className="slot-button"
                      onClick={() => handleReserveSlot(slot)}
                      disabled={loading}
                    >
                      <div className="slot-time-btn">
                        {formatTime(slot.hora_inicio)} - {formatTime(slot.hora_fin)}
                      </div>
                      <div className="slot-modalidad">
                        {slot.modalidad === 'presencial' && '🏢'}
                        {slot.modalidad === 'virtual' && '💻'}
                        {slot.modalidad === 'mixto' && '🔄'}
                        {slot.modalidad}
                      </div>
                      {slot.ubicacion && (
                        <div className="slot-location-btn">
                          📍 {slot.ubicacion}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{advisorScheduleStyles}</style>
    </div>
  );
};

export default AdvisorSchedule;