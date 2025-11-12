import React, { useState, useEffect } from 'react';
import type { Advisor } from '../types/advisor.types';
import { advisorScheduleStyles } from '../styles/AdvisorSchedule.styles';
import Modal from '../../Shared/Modal';

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
  const [confirmSlot, setConfirmSlot] = useState<TimeSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [modalidad, setModalidad] = useState<'presencial' | 'virtual' | 'mixto' | ''>('');
  const [agendaText, setAgendaText] = useState('Reunión de seguimiento de tesis');
  const todayIso = new Date().toISOString().split('T')[0];
  const navBtnStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' };
  const badgeStyle: React.CSSProperties = { background:'#e0f2fe', color:'#0369a1', padding:'6px 10px', borderRadius:9999, fontWeight:700, fontSize:12 };

  // (Eliminado el grid semanal; ya no se usan dayNames/modalityColors)

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
          // Auto-seleccionar HOY y precargar sus horarios disponibles
          try {
            if (!selectedDate) {
              const todayIso = new Date().toISOString().split('T')[0];
              setSelectedDate(todayIso);
              await loadSlotsForDate(todayIso);
            }
          } catch (e) { console.warn('No se pudo preseleccionar la fecha de hoy', e); }
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

  // 📝 Abrir confirmación antes de reservar
  const handleOpenConfirm = (slot: TimeSlot) => {
    setConfirmSlot(slot);
  };

  // ✅ Confirmar y enviar solicitud
  const handleConfirmReserve = async () => {
    if (!confirmSlot) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/schedules/advisor/${advisor.id}/reserve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fecha: selectedDate,
          hora_inicio: confirmSlot.hora_inicio,
          hora_fin: confirmSlot.hora_fin,
          modalidad: modalidad || confirmSlot.modalidad,
          agenda: agendaText
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult({ type: 'success', message: '¡Solicitud enviada exitosamente!' });
        setModalidad('');
        // refrescar disponibles
        loadSlotsForDate(selectedDate);
      } else {
        setResult({ type: 'error', message: data.message || 'Error al enviar solicitud' });
      }
    } catch (err) {
      console.error('❌ Error reservando slot:', err);
      setResult({ type: 'error', message: 'Error de conexión al enviar la solicitud de reunión' });
    } finally {
      setSubmitting(false);
      setConfirmSlot(null);
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

  // ⏮⏭ Navegación por días
  const navigateDay = (offset: number) => {
    if (!selectedDate) return;
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + offset);
    const nextIso = current.toISOString().split('T')[0];
    // Respetar límites min/max
    if (nextIso < getMinDate() || nextIso > getMaxDate()) return;
    setSelectedDate(nextIso);
    loadSlotsForDate(nextIso);
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

      {/* === AGENDAR REUNIÓN (simplificado, sin grid semanal) === */}
      {Object.keys(schedule).length > 0 && (
        <div className="date-selector">
          <h4>📆 Agendar Reunión</h4>
          <div className="date-input-container">
            <label htmlFor="meeting-date" style={{ fontWeight: 600 }}>Selecciona una fecha:</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => navigateDay(-1)} disabled={!selectedDate || selectedDate <= getMinDate()} style={navBtnStyle}>◀</button>
              <input
                id="meeting-date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={getMinDate()}
                max={getMaxDate()}
                className="date-input"
                style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1' }}
              />
              <button type="button" onClick={() => navigateDay(1)} disabled={!selectedDate || selectedDate >= getMaxDate()} style={navBtnStyle}>▶</button>
              {selectedDate === todayIso && (
                <span style={badgeStyle}>Hoy</span>
              )}
            </div>
            {selectedDate !== todayIso && (
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Hoy es {todayIso}. Estás viendo {selectedDate}.</div>
            )}
          </div>

          {/* === SLOTS DISPONIBLES PARA LA FECHA === */}
          {selectedDate && (
            <div className="available-slots">
              <h5>⏰ Horarios disponibles para {selectedDate}</h5>
              
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
                      onClick={() => handleOpenConfirm(slot)}
                      disabled={loading}
                      title={`Modalidad: ${slot.modalidad}${slot.ubicacion ? ' | Ubicación: '+slot.ubicacion : ''}`}
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

      {/* Modal de confirmación */}
      <Modal
        isOpen={!!confirmSlot}
        title="Confirmar solicitud de reunión"
        onClose={() => setConfirmSlot(null)}
        actions={[
          { label: 'Cancelar', onClick: () => setConfirmSlot(null), variant: 'secondary', disabled: submitting },
          { label: submitting ? 'Enviando…' : 'Confirmar', onClick: handleConfirmReserve, variant: 'primary', disabled: submitting }
        ]}
      >
        {confirmSlot && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>📅 <strong>Fecha:</strong> {selectedDate}</div>
              <div>⏰ <strong>Hora:</strong> {formatTime(confirmSlot.hora_inicio)} - {formatTime(confirmSlot.hora_fin)}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Modalidad:</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['presencial','virtual','mixto'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModalidad(m as any)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 10,
                        border: modalidad === m ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                        background: modalidad === m ? '#eff6ff' : '#fff',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Agenda / motivo:</label>
                <textarea
                  value={agendaText}
                  onChange={e => setAgendaText(e.target.value)}
                  rows={3}
                  style={{ width: '100%', resize: 'vertical', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
                  placeholder="Describe brevemente el objetivo de la reunión"
                />
              </div>
            </div>
            <div style={{ color: '#64748b', fontSize: 13 }}>
              Se enviará una solicitud a {advisor.name}. Si eliges presencial el asesor añadirá la ubicación al aprobar; si es virtual añadirá el enlace.
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de resultado */}
      <Modal
        isOpen={!!result}
        title={result?.type === 'success' ? 'Solicitud enviada' : 'No se pudo enviar'}
        onClose={() => setResult(null)}
        actions={[{ label: 'Aceptar', onClick: () => setResult(null), variant: 'primary' }]}
      >
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ color: result.type === 'success' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {result.message}
            </div>
            {result.type === 'success' && confirmSlot == null && (
              <div style={{ color: '#475569' }}>
                Puedes revisar el estado en la pestaña «Mis reuniones».
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdvisorSchedule;