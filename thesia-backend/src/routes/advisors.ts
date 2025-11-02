import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole } from '@middleware/auth';
import sequelize from '@config/database';

const router = Router();

// Interfaz para el asesor (usando nombres de tu BD)
interface Advisor {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo_institucional: string;
  especialidad: string;
  avatar_url?: string;
  telefono?: string;
  current_students: number;
  max_capacity: number;
  available_capacity: number;
}

// GET /api/advisors - Obtener asesores FILTRADOS por especialidad del estudiante
router.get('/', authenticateToken, requireRole(['estudiante', 'asesor', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔐 Token verificado para usuario:', req.user?.email);
    console.log('👨‍🏫 Endpoint /advisors ejecutado');

    const userId = req.user?.id;

    // 🔧 OBTENER LA ESPECIALIDAD DEL ESTUDIANTE PRIMERO
    console.log('🎓 Obteniendo especialidad del estudiante...');
    const [studentData] = await sequelize.query(
      'SELECT especialidad, ciclo_actual FROM usuario WHERE id_usuario = ?',
      { replacements: [userId] }
    );

    const student = (studentData as any[])[0];
    if (!student) {
      console.log('❌ Estudiante no encontrado');
      res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
      return;
    }

    console.log('✅ Estudiante encontrado:', {
      especialidad: student.especialidad,
      ciclo: student.ciclo_actual
    });

    // 🔧 CONSULTA FILTRADA POR ESPECIALIDAD
    const query = `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.correo_institucional,
        u.especialidad,
        u.avatar_url,
        u.telefono,
        COALESCE(t.current_students, 0) as current_students,
        5 as max_capacity,
        GREATEST(0, 5 - COALESCE(t.current_students, 0)) as available_capacity
      FROM usuario u
      LEFT JOIN (
        SELECT 
          id_asesor as advisor_id,
          COUNT(*) as current_students
        FROM tesispretesis 
        WHERE estado IN ('en_proceso', 'pendiente', 'aprobada')
        GROUP BY id_asesor
      ) t ON u.id_usuario = t.advisor_id
      WHERE u.rol = 'asesor' 
        AND u.estado = 'activo'
        AND u.especialidad = ?
      ORDER BY u.nombre
    `;

    console.log('🔍 === EJECUTANDO CONSULTA DE ASESORES FILTRADA POR ESPECIALIDAD ===');
    console.log('🎯 Filtrando por especialidad:', student.especialidad);
    
    const [results] = await sequelize.query(query, {
      replacements: [student.especialidad]
    });
    const advisors = results as Advisor[];

    console.log(`✅ Encontrados ${advisors.length} asesores para ${student.especialidad}`);

    res.json({
      success: true,
      advisors,
      total: advisors.length,
      message: advisors.length > 0 
        ? `Se encontraron ${advisors.length} asesores para ${student.especialidad}`
        : `No se encontraron asesores disponibles para ${student.especialidad}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en /advisors:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

export default router;