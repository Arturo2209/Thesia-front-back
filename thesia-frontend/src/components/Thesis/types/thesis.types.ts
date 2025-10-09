// 🔧 TIPOS ACTUALIZADOS PARA MANEJAR CICLO CORRECTAMENTE
export interface Advisor {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo_institucional: string;
    especialidad: string;
    avatar_url?: string;
    available_capacity: number;
    current_students: number;
    max_capacity: number;
  }
  
  // 🔧 THESIS DATA CON TODOS LOS CAMPOS NECESARIOS
  export interface ThesisData {
    id?: number;
    titulo: string;
    descripcion: string;
    ciclo: string; // 🔧 CICLO DESDE USUARIO VIA JOIN
    estado?: string;
    tipo?: string;
    fase_actual?: string;
    progreso_porcentaje?: number;
    fecha_creacion?: string;
    fecha_limite?: string;
    calificacion?: number | null;
    area?: string;
    
    // Datos del asesor
    id_asesor?: number;
    asesor_nombre?: string;
    asesor_email?: string;
    asesor_especialidad?: string;
    asesor_telefono?: string;
    asesor_avatar?: string;
    
    // Datos del estudiante
    codigo_estudiante?: string;
    carrera?: string;
    estudiante_nombre?: string;
  }
  
  // 🔧 FORM DATA CON CICLO AUTO-RELLENADO
  export interface FormData {
    titulo: string;
    descripcion: string;
    ciclo: string; // Se auto-rellena desde perfil del usuario
  }
  
  // 🔧 INTERFACES PARA COMPONENTES
  export interface MyThesisProps {
    // Props del componente principal si las necesitas
  }
  
  export interface ThesisFormProps {
    formData: FormData;
    cycles: string[];
    error: string;
    submitting: boolean;
    selectedAdvisor: number | null;
    filteredAdvisors: Advisor[];
    advisorsLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onErrorClose: () => void;
    onAdvisorSelect: (advisorId: number) => void;
  }
  
  export interface AdvisorSelectorProps {
    advisors: Advisor[];
    filteredAdvisors: Advisor[];
    selectedAdvisor: number | null;
    advisorsLoading: boolean;
    onAdvisorSelect: (advisorId: number) => void;
  }
  
  export interface ThesisRegisteredProps {
    thesisData: ThesisData;
    onEdit: () => void;
    onLogout: () => void;
  }
  
  // 🔧 INTERFACES PARA SERVICIOS
  export interface CreateThesisRequest {
    titulo: string;
    descripcion: string;
    ciclo: string; // V Ciclo o VI Ciclo
    id_asesor: number;
  }
  
  export interface UpdateThesisRequest {
    titulo: string;
    descripcion: string;
    id_asesor?: number;
  }
  
  export interface ThesisServiceResponse {
    success: boolean;
    message?: string;
    thesis?: ThesisData;
    hasThesis?: boolean;
    timestamp?: string;
  }
  
  export interface AdvisorsResponse {
    success: boolean;
    advisors: Advisor[];
    total: number;
    message?: string;
  }