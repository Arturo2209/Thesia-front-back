// === TIPOS BASE ===
export type ThesisPhase = 
  | 'fase_1_plan_proyecto' 
  | 'fase_2_diagnostico' 
  | 'fase_3_marco_teorico'
  | 'fase_4_desarrollo'
  | 'fase_5_resultados';

export type DocumentStatus = 
  | 'pendiente' 
  | 'en_revision' 
  | 'aprobado' 
  | 'rechazado';

// === COMENTARIO ===
export interface Comment {
  id: number;
  comment: string;
  advisorName: string;
  createdAt: string;
  attachments?: string[];
}

// === DOCUMENTO BÁSICO ===
export interface Document {
  id: number;
  fileName: string;
  originalFileName: string;
  phase: ThesisPhase;
  status: DocumentStatus;
  uploadDate: string;
  fileSizeDisplay: string;
  fileSize: number;
  fileType: string;
  chapterNumber: number;
  description?: string;
  latestComment?: Comment;
}

// === DOCUMENTO DETALLADO (para la vista de detalles) ===
export interface DocumentDetail {
  id: number;
  fileName: string;
  originalFileName: string;
  phase: ThesisPhase;
  status: DocumentStatus;
  uploadDate: string;
  lastModified?: string;
  fileSizeDisplay: string;
  fileSize: number;
  fileType: string;
  chapterNumber: number;
  description?: string;
  comments: Comment[];
}

// === FILTROS ===
export interface DocumentFilters {
  searchTerm?: string;
  phase?: ThesisPhase | 'all';
  status?: DocumentStatus | 'all';
  startDate?: string;
  endDate?: string;
}

// === REQUESTS ===
export interface UploadDocumentRequest {
  phase: ThesisPhase;
  file: File;
  description?: string;
  chapterNumber: number;
}

// === RESPONSES ===
export interface DocumentsResponse {
  success: boolean;
  message: string;
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentDetailResponse {
  success: boolean;
  message: string;
  document: DocumentDetail;
}

export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  document?: Document;
}

export interface DocumentStatsResponse {
  success: boolean;
  message: string;
  stats: {
    total: number;
    byStatus: Record<DocumentStatus, number>;
    byPhase: Record<ThesisPhase, number>;
    recentUploads: number;
    pendingReviews: number;
  };
}