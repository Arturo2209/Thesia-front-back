// Tipos para el flujo de reuniones
export type MeetingRawStatus = 'pendiente' | 'aceptada' | 'rechazada' | 'realizada' | 'cancelada';

export interface AvailabilityBlock {
  id_disponibilidad: number;
  hora_inicio: string; // HH:MM:SS o HH:MM
  hora_fin: string;
  modalidad: 'presencial' | 'virtual' | 'mixto';
  ubicacion?: string | null;
  enlace_virtual?: string | null;
  max_reuniones_por_dia?: number | null;
  notas?: string | null;
}

export interface AvailabilityByDay {
  [day: string]: AvailabilityBlock[];
}

export interface GeneratedSlot {
  id_disponibilidad: number;
  hora_inicio: string; // HH:MM
  hora_fin: string; // HH:MM
  modalidad: 'presencial' | 'virtual' | 'mixto';
  ubicacion?: string;
  available: boolean; // true si no está reservado/ocupado
}

export interface StudentMeeting {
  id_reunion: number;
  fecha_reunion: string; // YYYY-MM-DD
  hora_inicio: string; // HH:MM:SS
  hora_fin: string; // HH:MM:SS
  agenda: string | null;
  modalidad?: 'presencial' | 'virtual' | 'mixto';
  estado: MeetingRawStatus;
  ubicacion?: string | null;
  enlace?: string | null;
  comentarios?: string | null;
  fecha_creacion?: string;
  asesor_nombre?: string;
  asesor_email?: string;
  tesis_titulo?: string;
}

export interface PendingAdvisorMeeting {
  id_reunion: number;
  fecha_reunion: string;
  hora_inicio: string;
  hora_fin: string;
  agenda: string | null;
  modalidad?: 'presencial' | 'virtual' | 'mixto';
  estado: MeetingRawStatus;
  fecha_creacion: string;
  estudiante_nombre: string;
  estudiante_email?: string;
  tesis_titulo?: string;
  id_tesis?: number;
}

// Historial del asesor: estudiante con el que tiene historial
export interface AdvisorHistoryStudent {
  id_estudiante: number;
  estudiante_nombre: string;
  estudiante_email?: string;
}

// Reunión histórica (no pendiente) para el asesor con un estudiante
export interface AdvisorHistoryMeeting {
  id_reunion: number;
  fecha_reunion: string;
  hora_inicio: string;
  hora_fin: string;
  estado: MeetingRawStatus;
  agenda: string | null;
  modalidad?: 'presencial' | 'virtual' | 'mixto';
  ubicacion?: string | null;
  enlace?: string | null;
  comentarios?: string | null;
  fecha_creacion?: string;
}

export interface MeetingReservePayload {
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:MM
  hora_fin: string; // HH:MM
  modalidad: 'presencial' | 'virtual' | 'mixto';
  agenda?: string;
}

export interface MeetingApprovePayload {
  ubicacion?: string;
  enlace?: string;
  comentarios?: string;
}

export interface MeetingRejectPayload {
  motivo?: string;
}

export interface ReserveResponse {
  success: boolean;
  meeting_id?: number;
  status?: string;
  message?: string;
}

export interface GenericApiResponse<T = any> {
  success: boolean;
  message?: string;
  [key: string]: any;
  data?: T;
}

export const mapMeetingStatus = (raw: MeetingRawStatus): string => {
  switch (raw) {
    case 'pendiente': return 'Pendiente';
    case 'aceptada': return 'Confirmada';
    case 'rechazada': return 'Rechazada';
    case 'realizada': return 'Realizada';
    case 'cancelada': return 'Cancelada';
    default: return raw;
  }
};
