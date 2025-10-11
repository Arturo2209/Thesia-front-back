import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import sequelize from '../config/database';

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
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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

    // Debug: mostrar asesores encontrados
    if (advisors.length > 0) {
      console.log('📊 Asesores encontrados para tu especialidad:');
      advisors.forEach((advisor, index) => {
        console.log(`   ${index + 1}. ${advisor.nombre} ${advisor.apellido} - Capacidad: ${advisor.current_students}/${advisor.max_capacity}`);
      });
    } else {
      console.log('⚠️ No se encontraron asesores para la especialidad:', student.especialidad);
      console.log('🔄 Buscando asesores de todas las especialidades como fallback...');
      
      // 🔧 FALLBACK: Si no hay asesores de la especialidad, mostrar todos
      const fallbackQuery = `
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
        WHERE u.rol = 'asesor' AND u.estado = 'activo'
        ORDER BY u.especialidad, u.nombre
      `;
      
      const [fallbackResults] = await sequelize.query(fallbackQuery);
      const fallbackAdvisors = fallbackResults as Advisor[];
      console.log(`📋 Fallback: Encontrados ${fallbackAdvisors.length} asesores de todas las especialidades`);
      
      // Usar los asesores del fallback
      advisors.push(...fallbackAdvisors);
    }

    // 🔧 FORMATEAR RESPUESTA PARA EL FRONTEND
    const formattedAdvisors = advisors.map(advisor => ({
      id: advisor.id_usuario,
      name: `${advisor.nombre} ${advisor.apellido}`.trim(),
      email: advisor.correo_institucional,
      specialty: advisor.especialidad || 'Sin especialidad',
      telefono: advisor.telefono || null,
      avatar_url: advisor.avatar_url || null,
      current_students: advisor.current_students,
      max_capacity: advisor.max_capacity,
      available_capacity: advisor.available_capacity,
      disponible: advisor.available_capacity > 0
    }));

    console.log('📤 === RESPUESTA ASESORES FILTRADOS ENVIADA ===');
    console.log(`🎯 Especialidad del estudiante: ${student.especialidad}`);
    console.log(`📊 Total asesores enviados: ${formattedAdvisors.length}`);
    console.log(`✅ Asesores disponibles: ${formattedAdvisors.filter(a => a.disponible).length}`);
    
    // Debug: mostrar primer asesor formateado
    if (formattedAdvisors.length > 0) {
      console.log('🔍 Primer asesor formateado:', {
        id: formattedAdvisors[0].id,
        name: formattedAdvisors[0].name,
        specialty: formattedAdvisors[0].specialty,
        email: formattedAdvisors[0].email
      });
    }

    res.json({
      success: true,
      advisors: formattedAdvisors,
      total: formattedAdvisors.length,
      available: formattedAdvisors.filter(a => a.disponible).length,
      student_speciality: student.especialidad,
      message: formattedAdvisors.length > 0 
        ? `Se encontraron ${formattedAdvisors.length} asesores para ${student.especialidad}`
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

// GET /api/advisors/:id - Obtener un asesor específico
router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`👨‍🏫 Obteniendo asesor con ID: ${id}`);
    
    // 🔧 CONSULTA CORREGIDA - SIN u.max_capacity QUE NO EXISTE
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
      WHERE u.rol = 'asesor' AND u.estado = 'activo' AND u.id_usuario = ?
    `;

    console.log('🔍 === EJECUTANDO CONSULTA DE ASESOR ESPECÍFICO ===');
    
    const [results] = await sequelize.query(query, {
      replacements: [id]
    });
    const advisors = results as Advisor[];

    if (advisors.length === 0) {
      console.log(`❌ Asesor con ID ${id} no encontrado`);
      res.status(404).json({
        success: false,
        message: 'Asesor no encontrado o no disponible'
      });
      return;
    }

    const advisor = advisors[0];
    console.log('✅ Asesor encontrado:', {
      id: advisor.id_usuario,
      nombre: `${advisor.nombre} ${advisor.apellido}`.trim(),
      especialidad: advisor.especialidad,
      disponible: advisor.available_capacity > 0
    });

    // 🔧 FORMATEAR RESPUESTA
    const formattedAdvisor = {
      id: advisor.id_usuario,
      name: `${advisor.nombre} ${advisor.apellido}`.trim(),
      email: advisor.correo_institucional,
      specialty: advisor.especialidad || 'Sin especialidad',
      telefono: advisor.telefono || null,
      avatar_url: advisor.avatar_url || null,
      current_students: advisor.current_students,
      max_capacity: advisor.max_capacity,
      available_capacity: advisor.available_capacity,
      disponible: advisor.available_capacity > 0
    };

    res.json({
      success: true,
      advisor: formattedAdvisor,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error obteniendo asesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

export default router;