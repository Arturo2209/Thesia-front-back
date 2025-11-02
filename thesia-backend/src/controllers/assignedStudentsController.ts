import { Request, Response } from 'express';
import sequelize from '../config/database';

// Obtener estudiantes asignados a un asesor
export const getAssignedStudents = async (req: Request, res: Response) => {
  try {
    console.log('🔍 === INICIO getAssignedStudents ===');
    
    // Verificación de autenticación
    if (!req.user) {
      console.log('❌ Usuario no autenticado');
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const advisorId = req.user.id;
    console.log('👤 Asesor autenticado:', {
      id: advisorId,
      email: req.user.email,
      role: req.user.role
    });
    if (!advisorId) {
      return res.status(401).json({ success: false, message: 'No autorizado' });
    }
    // Buscar estudiantes con tesis asignada a este asesor
    const query = `
      SELECT 
        u.id_usuario as student_id,
        u.nombre as student_name,
        u.apellido as student_lastname,
        u.correo_institucional as student_email,
        t.id_asesor as advisor_id,
        t.fecha_creacion as assigned_date,
        t.titulo as thesis_title,
        t.fase_actual as phase,
        t.estado as status
      FROM tesispretesis t
      JOIN usuario u ON t.id_usuario_estudiante = u.id_usuario
      WHERE t.id_asesor = ? AND t.estado IN ('pendiente', 'en_proceso', 'aprobada')
      ORDER BY t.fecha_creacion DESC
    `;
    console.log('📝 Ejecutando consulta SQL para asesor:', advisorId);
    const [results] = await sequelize.query(query, { replacements: [advisorId] });
    
    console.log('📊 Resultados encontrados:', results.length);
    console.log('🔍 Detalles de los resultados:', results);
    
    res.json({ 
      success: true, 
      data: results,
      meta: {
        count: results.length,
        advisorId
      }
    });
  } catch (error) {
    console.error('[AssignedStudents] Error:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo estudiantes asignados', error });
  }
};
