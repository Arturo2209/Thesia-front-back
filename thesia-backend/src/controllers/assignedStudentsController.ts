import { Request, Response } from 'express';
import sequelize from '../config/database';
import Documento from '../models/Documento';
import Tesis from '../models/Tesis';
import { mapPhaseToFrontend } from '../utils/helpers';

// Obtener estudiantes asignados a un asesor
export const getAssignedStudents = async (req: Request, res: Response) => {
  try {
    console.log('🔍 === INICIO getAssignedStudents (mejorado) ===');

    if (!req.user) {
      console.log('❌ Usuario no autenticado');
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }

    const advisorId = req.user.id;
    if (!advisorId) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    // Traer todas las tesis del asesor
    const tesisRows = await Tesis.findAll({
      where: { id_asesor: advisorId },
      order: [['fecha_creacion', 'DESC']]
    });

    console.log('📚 Tesis encontradas para asesor:', tesisRows.length);

    // Mapear a estructura básica y luego enriquecer con la fase derivada
    const estudiantes = [] as any[];

    for (const tesis of tesisRows) {
      // Obtener documentos de la tesis para calcular fase derivada (aprobados primero)
      const documentos = await Documento.findAll({
        where: { id_tesis: tesis.id_tesis },
        order: [['fecha_subida', 'ASC']]
      });

      // Fases aprobadas
      const aprobados = documentos.filter(d => d.estado === 'aprobado').map(d => d.fase);
      // Si hay aprobados, tomar la última aprobada como progreso; si no, tomar la fase del último documento cualquiera
      let faseDerivada: string | null = null;
      if (aprobados.length > 0) {
        faseDerivada = aprobados[aprobados.length - 1];
      } else if (documentos.length > 0) {
        faseDerivada = documentos[documentos.length - 1].fase;
      } else {
        faseDerivada = null; // Sin documentos todavía
      }

      // Formatear fase al estilo frontend (si existe)
      const faseFrontend = faseDerivada ? mapPhaseToFrontend(faseDerivada) : null;

      // Obtener usuario estudiante (nombre / correo) via raw query por eficiencia
      const [userRows] = await sequelize.query(
        'SELECT nombre, apellido, correo_institucional FROM usuario WHERE id_usuario = ? LIMIT 1',
        { replacements: [tesis.id_usuario_estudiante] }
      );
      const userData = Array.isArray(userRows) && userRows.length > 0 ? (userRows as any)[0] : null;

      estudiantes.push({
        id: tesis.id_usuario_estudiante,
        name: userData ? `${userData.nombre} ${userData.apellido}` : 'Desconocido',
        email: userData?.correo_institucional || 'Sin correo',
        thesisTitle: tesis.titulo || 'Sin título',
        // fase_actual de la tesis vs fase derivada de documentos
        phaseRaw: faseDerivada,
        phase: faseFrontend, // Valor mapeado (ej: fase_2_diagnostico)
        thesisPhaseActual: tesis.fase_actual, // Valor en ENUM propuesta/desarrollo/revision/sustentacion
        assignedDate: tesis.fecha_creacion?.toISOString() || null,
        status: tesis.estado,
        documentsCount: documentos.length,
        approvedCount: aprobados.length
      });
    }

    res.json({
      success: true,
      students: estudiantes,
      total: estudiantes.length,
      meta: {
        advisorId,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[AssignedStudents] Error mejorado:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo estudiantes asignados', error: error instanceof Error ? error.message : String(error) });
  }
};
