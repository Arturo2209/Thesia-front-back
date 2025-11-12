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
      // Obtener documentos (orden por fecha solo para consistencia; luego calculamos por jerarquía de fase)
      const documentos = await Documento.findAll({
        where: { id_tesis: tesis.id_tesis },
        order: [['fecha_subida', 'ASC']]
      });

      // Jerarquía de fases definida
      const phaseOrder = [
        'fase_1_plan_proyecto',
        'fase_2_diagnostico',
        'fase_3_marco_teorico',
        'fase_4_desarrollo',
        'fase_5_resultados'
      ] as const;
      const indexOf = (f: string) => phaseOrder.indexOf(f as any);

      const aprobados = documentos
        .filter(d => d.estado === 'aprobado')
        .map(d => d.fase)
        // ordenar por jerarquía (por si fechas no reflejan progreso real)
        .sort((a,b) => indexOf(a) - indexOf(b));

      const todasFases = documentos
        .map(d => d.fase)
        .sort((a,b) => indexOf(a) - indexOf(b));

      // Mayor fase aprobada (progreso consolidado)
      const highestApproved = aprobados.length ? aprobados[aprobados.length - 1] : null;
      // Mayor fase subida (aunque esté pendiente / rechazada)
      const highestSubmitted = todasFases.length ? todasFases[todasFases.length - 1] : null;

      // Lógica de "última desbloqueada": usamos la mayor aprobada; si no hay aprobadas todavía, usamos la mayor enviada
      const faseDerivada = highestApproved || highestSubmitted || null;

      // También exponemos ambas para futuras vistas/analytics
      const faseFrontend = faseDerivada ? mapPhaseToFrontend(faseDerivada) : null;

      // Obtener usuario estudiante (nombre / correo) via raw query por eficiencia
      const [userRows] = await sequelize.query(
        'SELECT nombre, apellido, correo_institucional FROM usuario WHERE id_usuario = ? LIMIT 1',
        { replacements: [tesis.id_usuario_estudiante] }
      );
      const userData = Array.isArray(userRows) && userRows.length > 0 ? (userRows as any)[0] : null;

      // Log detallado por estudiante
      console.log(`👤 Estudiante ${tesis.id_usuario_estudiante} | Tesis ${tesis.id_tesis}`);
      console.log('   Documentos fases:', documentos.map(d => `${d.fase}:${d.estado}`));
      console.log('   Aprobados ordenados:', aprobados);
      console.log('   highestApproved:', highestApproved, 'highestSubmitted:', highestSubmitted, 'faseDerivada:', faseDerivada);

      estudiantes.push({
        id: tesis.id_usuario_estudiante,
        name: userData ? `${userData.nombre} ${userData.apellido}` : 'Desconocido',
        email: userData?.correo_institucional || 'Sin correo',
        thesisTitle: tesis.titulo || 'Sin título',
        // fase_actual de la tesis vs fases derivadas
        phaseRaw: faseDerivada,              // fase seleccionada para mostrar
        phase: faseFrontend,                // fase mapeada para frontend (mismo código actualmente)
        highestApprovedPhase: highestApproved,
        highestSubmittedPhase: highestSubmitted,
        thesisPhaseActual: tesis.fase_actual, // Valor en ENUM propuesta/desarrollo/revision/sustentacion
        assignedDate: tesis.fecha_creacion?.toISOString() || null,
        status: tesis.estado,
        documentsCount: documentos.length,
        approvedCount: aprobados.length,
        debugAllPhases: documentos.map(d => d.fase),
        debugApprovedPhases: aprobados
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
