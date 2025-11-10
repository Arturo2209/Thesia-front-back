export interface AdvisorResource {
  id: number;
  fileName: string;
  description?: string;
  phase?: string;
  uploadDate: string;
  active: boolean;
}

export interface UploadGuideForm {
  file: File | null;
  description: string;
  phase: string; // 'general' o fase específica
}
