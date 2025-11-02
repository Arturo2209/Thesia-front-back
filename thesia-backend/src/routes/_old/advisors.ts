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

// GET /api/advisors/my-advisor - Obtener MI asesor asignado
router.get('/my-advisor', authenticateToken, requireRole(['estudiante', 'asesor', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔐 Token verificado para usuario:', req.user?.email);
    console.log('👨‍🎓 Endpoint /my-advisor ejecutado');

    const userId = req.user?.id;

    // 🔧 PASO 1: Buscar si el estudiante tiene un asesor asignado
    console.log('🔍 Buscando asesor asignado al estudiante...');
    
    const assignmentQuery = `
      SELECT 
        tp.id_asesor,
        tp.titulo,
        tp.fecha_creacion as assignment_date,
        tp.estado as thesis_status,
        tp.tipo
      FROM tesispretesis tp
      WHERE tp.id_usuario_estudiante = ?
        AND tp.estado IN ('pendiente', 'en_proceso', 'aprobada')
      ORDER BY tp.fecha_creacion DESC
      LIMIT 1
    `;

    const [assignmentResults] = await sequelize.query(assignmentQuery, {
      replacements: [userId]
    });
    
    const assignments = assignmentResults as any[];

    if (assignments.length === 0) {
      console.log('❌ No se encontró asesor asignado para el estudiante');
      res.json({
        success: true,
        advisor: null,
        message: 'No tienes un asesor asignado actualmente',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const assignment = assignments[0];
    const advisorId = assignment.id_asesor;
    
    console.log('✅ Asesor asignado encontrado:', {
      advisor_id: advisorId,
      thesis_title: assignment.titulo,
      assignment_date: assignment.assignment_date,
      status: assignment.thesis_status
    });

    // 🔧 PASO 2: Obtener datos completos del asesor
    const advisorQuery = `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.correo_institucional,
        u.especialidad,
        u.avatar_url,
        u.telefono,
        COALESCE(stats.current_students, 0) as current_students,
        5 as max_capacity,
        GREATEST(0, 5 - COALESCE(stats.current_students, 0)) as available_capacity,
        COALESCE(completed.completed_theses, 0) as completed_theses
      FROM usuario u
      LEFT JOIN (
        SELECT 
          id_asesor,
          COUNT(*) as current_students
        FROM tesispretesis 
        WHERE estado IN ('en_proceso', 'pendiente', 'aprobada')
        GROUP BY id_asesor
      ) stats ON u.id_usuario = stats.id_asesor
      LEFT JOIN (
        SELECT 
          id_asesor,
          COUNT(*) as completed_theses
        FROM tesispretesis 
        WHERE estado = 'finalizada'
        GROUP BY id_asesor
      ) completed ON u.id_usuario = completed.id_asesor
      WHERE u.id_usuario = ? AND u.rol = 'asesor'
    `;

    const [advisorResults] = await sequelize.query(advisorQuery, {
      replacements: [advisorId]
    });
    
    const advisors = advisorResults as any[];

    if (advisors.length === 0) {
      console.log('❌ Datos del asesor no encontrados');
      res.status(404).json({
        success: false,
        message: 'Los datos del asesor no están disponibles'
      });
      return;
    }

    const advisor = advisors[0];
    
    console.log('✅ Datos del asesor obtenidos:', {
      id: advisor.id_usuario,
      nombre: `${advisor.nombre} ${advisor.apellido}`,
      especialidad: advisor.especialidad,
      current_students: advisor.current_students,
      completed_theses: advisor.completed_theses
    });

    // 🔧 PASO 3: Formatear respuesta completa
    const formattedAdvisor = {
      id: advisor.id_usuario,
      name: `${advisor.nombre} ${advisor.apellido}`.trim(),
      email: advisor.correo_institucional,
      telefono: advisor.telefono || null,
      specialty: advisor.especialidad || 'Sin especialidad',
      avatar_url: advisor.avatar_url || null,
      available: advisor.available_capacity > 0,
      
      // 📊 Estadísticas (por ahora valores calculados/mock)
      rating: 4.8, // TODO: Implementar sistema de ratings
      experience_years: Math.max(1, Math.floor(advisor.completed_theses / 4)), // Estimado
      completed_theses: advisor.completed_theses,
      current_students: advisor.current_students,
      max_capacity: advisor.max_capacity,
      available_capacity: advisor.available_capacity,
      
      // 📝 Información adicional (mock por ahora)
      about: `Asesor especializado en ${advisor.especialidad}. Con experiencia supervisando proyectos de tesis y pretesis en diversas áreas de la especialidad.`,
      specializations: [
        advisor.especialidad,
        "Metodología de Investigación",
        "Desarrollo de Proyectos",
        "Análisis de Datos"
      ].filter(Boolean),
      
      // 📋 Información de la asignación
      assignment_info: {
        thesis_title: assignment.titulo,
        assignment_date: assignment.assignment_date,
        thesis_status: assignment.thesis_status,
        thesis_type: assignment.tipo
      }
    };

    console.log('📤 === RESPUESTA MI ASESOR ENVIADA ===');
    console.log(`👨‍🏫 Asesor: ${formattedAdvisor.name}`);
    console.log(`📊 Especialidad: ${formattedAdvisor.specialty}`);
    console.log(`📈 Estudiantes actuales: ${formattedAdvisor.current_students}/${formattedAdvisor.max_capacity}`);
    console.log(`🎯 Título de tesis: ${assignment.titulo}`);

    res.json({
      success: true,
      advisor: formattedAdvisor,
      message: `Asesor asignado: ${formattedAdvisor.name}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error obteniendo mi asesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

// GET /api/advisors/:id - Obtener un asesor específico
router.get('/:id', authenticateToken, requireRole(['estudiante', 'asesor', 'admin']), async (req: Request, res: Response): Promise<void> => {
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