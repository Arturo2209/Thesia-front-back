import { apiService } from './api';
import type { 
  DocumentsResponse, 
  DocumentDetailResponse, 
  UploadDocumentRequest, 
  UploadDocumentResponse,
  DocumentFilters,
  DocumentStatsResponse 
} from '../components/Documents/types/documents.types';

class DocumentsService {
  
  // 🌐 Helper para obtener la URL base de la API
  private getApiBaseUrl(): string {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/api'
      : '/api';
  }
  
  // 📋 Obtener todos los documentos del estudiante
  async getMyDocuments(filters?: DocumentFilters): Promise<DocumentsResponse> {
    try {
      console.log('📄 === OBTENIENDO MIS DOCUMENTOS ===');
      console.log('🔍 Filtros recibidos:', filters);
      
      // 🔧 Construir query parameters correctamente
      const params = new URLSearchParams();
      
      if (filters?.searchTerm?.trim()) {
        params.append('search', filters.searchTerm.trim()); // ✅ 'search' no 'searchTerm'
        console.log('🔍 Agregando búsqueda:', filters.searchTerm.trim());
      }
      
      if (filters?.phase && filters.phase !== 'all') {
        params.append('phase', filters.phase);
        console.log('📂 Agregando filtro de fase:', filters.phase);
      }
      
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
        console.log('📊 Agregando filtro de estado:', filters.status);
      }
      
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
        console.log('📅 Agregando fecha inicio:', filters.startDate);
      }
      
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
        console.log('📅 Agregando fecha fin:', filters.endDate);
      }
      
      const queryString = params.toString();
      const url = `/documents/my${queryString ? `?${queryString}` : ''}`;
      
      console.log('📡 URL de solicitud completa:', url);
      console.log('🔧 Query params construidos:', Object.fromEntries(params));
      
      const response = await apiService.get(url);
      
      console.log('✅ Documentos obtenidos del servidor:', response);
      
      // 🔧 Verificar estructura de la respuesta
      if (response && typeof response === 'object') {
        const typedResponse = response as DocumentsResponse;
        console.log('📊 Cantidad de documentos:', typedResponse.documents?.length || 0);
        console.log('📄 Documentos:', typedResponse.documents?.map(d => ({ 
          id: d.id, 
          name: d.originalFileName, 
          phase: d.phase, 
          status: d.status 
        })));
        return typedResponse;
      } else {
        console.error('❌ Respuesta del servidor tiene formato inesperado:', response);
        throw new Error('Formato de respuesta inválido');
      }
      
    } catch (error) {
      console.error('❌ Error obteniendo documentos:', error);
      
      // 🔧 Retornar respuesta de error estructurada
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        documents: [],
        total: 0,
        page: 1,
        limit: 10
      };
    }
  }

  // 📄 Obtener detalles de un documento específico
  async getDocumentDetail(documentId: number): Promise<DocumentDetailResponse> {
    try {
      console.log('📖 === OBTENIENDO DETALLE DEL DOCUMENTO ===', documentId);
      
      const response = await apiService.get(`/documents/${documentId}`);
      
      console.log('✅ Detalle del documento obtenido:', response);
      return response as DocumentDetailResponse;
      
    } catch (error) {
      console.error('❌ Error obteniendo detalle del documento:', error);
      throw error;
    }
  }

  // ✅ NUEVA FUNCIÓN: Obtener fases disponibles para el usuario
  async getAvailablePhases(): Promise<{
    success: boolean;
    availablePhases: string[];
    message: string;
    debugInfo?: any;
  }> {
    try {
      console.log('📋 === OBTENIENDO FASES DISPONIBLES ===');
      
      const response = await apiService.get('/documents/available-phases');
      
      console.log('✅ Fases disponibles obtenidas:', response);
      return response as {
        success: boolean;
        availablePhases: string[];
        message: string;
        debugInfo?: any;
      };
      
    } catch (error) {
      console.error('❌ Error obteniendo fases disponibles:', error);
      return {
        success: false,
        availablePhases: ['fase_1_plan_proyecto'], // Fallback: Solo Fase 1
        message: error instanceof Error ? error.message : 'Error obteniendo fases disponibles'
      };
    }
  }

  // 📤 Subir un nuevo documento
  async uploadDocument(uploadData: UploadDocumentRequest): Promise<UploadDocumentResponse> {
    try {
      console.log('⬆️ === SUBIENDO DOCUMENTO ===');
      console.log('Fase:', uploadData.phase);
      console.log('Archivo:', uploadData.file.name);
      console.log('Tamaño:', (uploadData.file.size / 1024 / 1024).toFixed(2), 'MB');
      
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('phase', uploadData.phase);
      if (uploadData.description) {
        formData.append('description', uploadData.description);
      }
      if (uploadData.chapterNumber) {
        formData.append('chapterNumber', uploadData.chapterNumber.toString());
      }
      
      const response = await apiService.post('/documents/upload', formData);
      
      console.log('✅ Documento subido exitosamente:', response);
      return response as UploadDocumentResponse;
      
    } catch (error) {
      console.error('❌ Error subiendo documento:', error);
      throw error;
    }
  }

  // 📊 Obtener estadísticas de documentos
  async getDocumentStats(): Promise<DocumentStatsResponse> {
    try {
      console.log('📊 === OBTENIENDO ESTADÍSTICAS DE DOCUMENTOS ===');
      
      const response = await apiService.get('/documents/stats');
      
      console.log('✅ Estadísticas obtenidas:', response);
      return response as DocumentStatsResponse;
      
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // 📥 Descargar documento
  async downloadDocument(documentId: number): Promise<Blob> {
    try {
      console.log('📥 === DESCARGANDO DOCUMENTO ===', documentId);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.getApiBaseUrl()}/documents/${documentId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error descargando documento');
      }

      const blob = await response.blob();
      console.log('✅ Documento descargado');
      return blob;
      
    } catch (error) {
      console.error('❌ Error descargando documento:', error);
      throw error;
    }
  }

  // 🗑️ Eliminar documento (solo si está pendiente)
  async deleteDocument(documentId: number): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🗑️ === ELIMINANDO DOCUMENTO ===', documentId);
      
      const response = await apiService.delete(`/documents/${documentId}`);
      
      console.log('✅ Documento eliminado:', response);
      return response as { success: boolean; message: string };
      
    } catch (error) {
      console.error('❌ Error eliminando documento:', error);
      throw error;
    }
  }

  // 🔄 Resubir nueva versión de documento rechazado
  async resubmitDocument(documentId: number, uploadData: UploadDocumentRequest): Promise<UploadDocumentResponse> {
    try {
      console.log('🔄 === RESUBIENDO DOCUMENTO ===', documentId);
      
      const formData = new FormData();
      formData.append('file', uploadData.file);
      if (uploadData.description) {
        formData.append('description', uploadData.description);
      }
      
      const response = await apiService.post(`/documents/${documentId}/resubmit`, formData);
      
      console.log('✅ Documento resubido exitosamente:', response);
      return response as UploadDocumentResponse;
      
    } catch (error) {
      console.error('❌ Error resubiendo documento:', error);
      throw error;
    }
  }

  // 📚 ========== NUEVAS FUNCIONES PARA GUÍAS ========== //

  // 📚 Obtener guías disponibles para el estudiante
  async getMyGuides(): Promise<{
    success: boolean;
    message: string;
    guides: Array<{
      id: number;
      fileName: string;
      title: string;
      description: string;
      phase: string;
      uploadDate: string;
      uploadedBy: string;
    }>;
  }> {
    try {
      console.log('📚 === OBTENIENDO MIS GUÍAS ===');
      
      const response = await apiService.get('/guides/my');
      
      console.log('✅ Guías obtenidas:', response);
      return response as {
        success: boolean;
        message: string;
        guides: Array<{
          id: number;
          fileName: string;
          title: string;
          description: string;
          phase: string;
          uploadDate: string;
          uploadedBy: string;
        }>;
      };
      
    } catch (error) {
      console.error('❌ Error obteniendo guías:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error obteniendo guías',
        guides: []
      };
    }
  }

  // 📥 Descargar guía
  async downloadGuide(guideId: number): Promise<Blob> {
    try {
      console.log('📥 === DESCARGANDO GUÍA ===', guideId);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.getApiBaseUrl()}/guides/${guideId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error('Error descargando guía');
      }

      const blob = await response.blob();
      console.log('✅ Guía descargada');
      return blob;
      
    } catch (error) {
      console.error('❌ Error descargando guía:', error);
      throw error;
    }
  }

  // 📤 Subir nueva guía (solo para asesores)
  async uploadGuide(uploadData: {
    file: File;
    description?: string;
    phase?: string;
  }): Promise<{
    success: boolean;
    message: string;
    guide?: {
      id: number;
      fileName: string;
      description?: string;
      phase?: string;
      uploadDate: string;
    };
  }> {
    try {
      console.log('📤 === ASESOR SUBIENDO GUÍA ===');
      console.log('Archivo:', uploadData.file.name);
      console.log('Fase:', uploadData.phase);
      
      const formData = new FormData();
      formData.append('file', uploadData.file);
      
      if (uploadData.description) {
        formData.append('description', uploadData.description);
      }
      
      if (uploadData.phase) {
        formData.append('phase', uploadData.phase);
      }
      
      const response = await apiService.post('/guides/upload', formData);
      
      console.log('✅ Guía subida exitosamente:', response);
      return response as {
        success: boolean;
        message: string;
        guide?: {
          id: number;
          fileName: string;
          description?: string;
          phase?: string;
          uploadDate: string;
        };
      };
      
    } catch (error) {
      console.error('❌ Error subiendo guía:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error subiendo guía'
      };
    }
  }

  // 📋 Obtener todas las guías del asesor (para gestión)
  async getMyUploadedGuides(): Promise<{
    success: boolean;
    message: string;
    guides: Array<{
      id: number;
      fileName: string;
      description?: string;
      phase?: string;
      uploadDate: string;
      active: boolean;
    }>;
  }> {
    try {
      console.log('📋 === OBTENIENDO GUÍAS SUBIDAS POR MÍ (ASESOR) ===');
      
      const response = await apiService.get('/guides/uploaded');
      
      console.log('✅ Guías subidas obtenidas:', response);
      return response as {
        success: boolean;
        message: string;
        guides: Array<{
          id: number;
          fileName: string;
          description?: string;
          phase?: string;
          uploadDate: string;
          active: boolean;
        }>;
      };
      
    } catch (error) {
      console.error('❌ Error obteniendo guías subidas:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error obteniendo guías subidas',
        guides: []
      };
    }
  }

  // 🗑️ Eliminar guía (solo asesores)
  async deleteGuide(guideId: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      console.log('🗑️ === ELIMINANDO GUÍA ===', guideId);
      
      const response = await apiService.delete(`/guides/${guideId}`);
      
      console.log('✅ Guía eliminada:', response);
      return response as {
        success: boolean;
        message: string;
      };
      
    } catch (error) {
      console.error('❌ Error eliminando guía:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error eliminando guía'
      };
    }
  }

  // 🔄 Activar/desactivar guía (solo asesores)
  async toggleGuideStatus(guideId: number, active: boolean): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      console.log('🔄 === CAMBIANDO ESTADO DE GUÍA ===', guideId, active);
      
      const response = await apiService.put(`/guides/${guideId}/toggle`, { active });
      
      console.log('✅ Estado de guía cambiado:', response);
      return response as {
        success: boolean;
        message: string;
      };
      
    } catch (error) {
      console.error('❌ Error cambiando estado de guía:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error cambiando estado de guía'
      };
    }
  }
}

const documentsService = new DocumentsService();
export default documentsService;