import { Request, Response } from 'express';
import sequelize from '../config/database';

// GET /api/advisors/my-advisor - Obtener MI asesor asignado
export const getMyAdvisor = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔐 Token verificado para usuario:', req.user?.email);
    console.log('👨‍🎓 Endpoint /my-advisor ejecutado');

    const userId = req.user?.id;

    // Log para verificar el ID del usuario
    console.log('🔍 ID del usuario:', userId);

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

    // Log para verificar la consulta SQL
    console.log('🔧 Consulta SQL ejecutada:', assignmentQuery);

    const [assignmentResults] = await sequelize.query(assignmentQuery, {
      replacements: [userId]
    });
    
    const assignments = assignmentResults as any[];

    // Log para verificar los resultados de la consulta
    console.log('📊 Resultados de la consulta:', assignments);

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

    // Log para verificar el asesor encontrado
    console.log('✅ Asesor encontrado:', assignments[0]);

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
      
      // 📊 Estadísticas
      rating: 4.8, // TODO: Implementar sistema de ratings
      experience_years: Math.max(1, Math.floor(advisor.completed_theses / 4)), // Estimado
      completed_theses: advisor.completed_theses,
      current_students: advisor.current_students,
      max_capacity: advisor.max_capacity,
      available_capacity: advisor.available_capacity,
      
      // 📝 Información adicional
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
};