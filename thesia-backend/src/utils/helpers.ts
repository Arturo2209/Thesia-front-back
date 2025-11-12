// Utilidad: Convierte fase del frontend a valor de BD
export function mapPhaseToDatabase(phase: string): string {
  const phaseMap: Record<string, string> = {
    'fase_1_plan_proyecto': 'fase_1_plan_proyecto',
    'fase_2_diagnostico': 'fase_2_diagnostico',
    'fase_3_marco_teorico': 'fase_3_marco_teorico',
    'fase_4_desarrollo': 'fase_4_desarrollo',
    'fase_5_resultados': 'fase_5_resultados'
  };
  return phaseMap[phase] || phase;
}

// Utilidad: Convierte fase de BD a valor para frontend
export function mapPhaseToFrontend(fase: string): string {
  const phaseMap: Record<string, string> = {
    'fase_1_plan_proyecto': 'fase_1_plan_proyecto',
    'fase_2_diagnostico': 'fase_2_diagnostico',
    'fase_3_marco_teorico': 'fase_3_marco_teorico',
    'fase_4_desarrollo': 'fase_4_desarrollo',
    'fase_5_resultados': 'fase_5_resultados',
    // Compatibilidad con valores antiguos
    'PROPUESTA': 'fase_1_plan_proyecto',
    'ANTEPROYECTO': 'fase_2_diagnostico',
    'PROYECTO': 'fase_3_marco_teorico',
    'SUSTENTACION': 'fase_4_desarrollo',
    'FINALIZADO': 'fase_5_resultados'
  };
  return phaseMap[fase] || fase;
}

// Utilidad: Convierte estado de BD a valor para frontend
export function mapStatusToFrontend(estado: string): string {
  // Normalizar estados a códigos en minúscula esperados por el frontend
  // Valores soportados en front: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'
  const normalized = (estado || '').toLowerCase();
  const statusMap: Record<string, string> = {
    pendiente: 'pendiente',
    en_revision: 'en_revision',
    aprobado: 'aprobado',
    rechazado: 'rechazado',
    observado: 'rechazado', // Mapear observado a rechazado si existiese en BD
    finalizado: 'aprobado'  // Mapear finalizado a aprobado para métricas
  };
  return statusMap[normalized] || normalized;
}

// Utilidad: Formatea tamaño de archivo en bytes a string legible
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
