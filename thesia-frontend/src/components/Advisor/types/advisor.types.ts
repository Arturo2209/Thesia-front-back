// 📋 TIPOS PRINCIPALES
export interface Advisor {
    id: number;
    name: string;
    email: string;
    telefono: string | null;
    specialty: string;
    avatar_url: string | null;
    available: boolean;
    rating: number;
    experience_years: number;
    completed_theses: number;
    current_students: number;
    max_capacity: number;
    available_capacity: number;
    disponible: boolean;
    about?: string;
    specializations: string[];
  }
  
  // 🎭 TIPOS PARA ESTADOS DEL COMPONENTE
  export type TabType = 'perfil' | 'comunicacion' | 'horarios';
  
  export interface AdvisorStats {
    current_students: number;
    completed_theses: number;
    experience_years: number;
    rating: number;
  }
  
  export interface ContactInfo {
    email: string;
    telefono?: string;
  }
  
  // 📡 TIPOS PARA API RESPONSES
  export interface GetMyAdvisorResponse {
    success: boolean;
    advisor: Advisor | null;
    message?: string;
    timestamp?: string;
  }
  
  export interface AdvisorAssignment {
    student_id: number;
    advisor_id: number;
    assigned_date: string;
    thesis_title?: string;
    phase?: string;
  }
  
  // 🔧 TIPOS PARA PROPS DE COMPONENTES
  export interface MiAsesorProps {
    // Por ahora no tiene props específicas
  }
  
  export interface AdvisorProfileCardProps {
    advisor: Advisor;
    onScheduleMeeting: () => void;
    loading?: boolean;
  }
  
  export interface AdvisorTabsProps {
    advisor: Advisor;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
  }
  
  export interface AdvisorProfileTabProps {
    advisor: Advisor;
  }
  
  // 🎨 TIPOS PARA ESTADOS DE DISPONIBILIDAD
  export type AvailabilityStatus = 'available' | 'busy' | 'offline';
  
  export interface AdvisorAvailability {
    status: AvailabilityStatus;
    next_available?: string;
    working_hours?: {
      start: string;
      end: string;
    };
  }
  
  // 📚 TIPOS PARA ESPECIALIDADES/TAGS
  export interface Specialization {
    id: number;
    name: string;
    category: string;
  }
  
  // 📅 TIPOS PARA FUTURAS FUNCIONALIDADES
  export interface Meeting {
    id: number;
    date: string;
    time: string;
    duration: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    topic?: string;
  }
  
  export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    sent_date: string;
    read: boolean;
  }