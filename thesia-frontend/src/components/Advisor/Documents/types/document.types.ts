export interface AdvisorDocument {
  id: number;
  studentId?: number;
  title: string;
  student: string;
  status: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';
  submittedAt: string;
  comentarios?: string | null; // Comentarios del asesor
  fileUrl?: string;
  phase?: string;
  description?: string;
}
