import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import sequelize from '../config/database';
import { createTesis, getTesisByEstudiante, validateCreateTesis } from '../controllers/tesisController';

console.log('🚀 ARCHIVO TESIS.TS CARGADO - VERSIÓN 4.1 - ERRORES TYPESCRIPT CORREGIDOS');

const router = Router();

// Interfaces actualizadas
interface RegisterThesisRequest {
  titulo: string;
  descripcion: string;
  ciclo: string;
  id_asesor: number;
}

// 🔧 POST /api/thesis - CREAR NUEVA TESIS CON VALIDACIÓN DE CICLO
router.post('/',
  authenticateToken,
  [
    body('titulo').isString().notEmpty().isLength({ max: 150 }).withMessage('El título es obligatorio y debe tener máximo 150 caracteres'),
    body('descripcion').isString().notEmpty().isLength({ max: 1000 }).withMessage('La descripción es obligatoria y debe tener máximo 1000 caracteres'),
    body('ciclo').isIn(['V Ciclo', 'VI Ciclo']).withMessage('El ciclo debe ser "V Ciclo" o "VI Ciclo"'),
    body('id_asesor').isInt({ min: 1 }).withMessage('El id_asesor debe ser un número entero positivo')
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array(), message: 'Parámetros inválidos' });
      return;
    }
  try {
    console.log('📝 === ENDPOINT POST /thesis EJECUTADO === ✅');
    console.log('👤 Usuario autenticado:', req.user?.email);
    console.log('🆔 ID Usuario:', req.user?.id);
    console.log('📊 Datos recibidos COMPLETOS:', req.body);

    const { titulo, descripcion, ciclo, id_asesor }: RegisterThesisRequest = req.body;
    const student_id = req.user?.id;

    // 🔧 VALIDACIONES BÁSICAS
    if (!titulo || !descripcion || !ciclo || !id_asesor) {
      console.log('❌ Faltan campos obligatorios:', {
        titulo: !!titulo,
        descripcion: !!descripcion,
        ciclo: !!ciclo,
        id_asesor: !!id_asesor
      });
      res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
      return;
    }

    // 🔧 OBTENER DATOS DEL USUARIO (INCLUYE CICLO_ACTUAL)
    const [userData] = await sequelize.query(
      'SELECT ciclo_actual, especialidad, nombre, apellido FROM usuario WHERE id_usuario = ?',
      { replacements: [student_id] }
    );

    const user = (userData as any[])[0];
    if (!user) {
      console.log('❌ Usuario no encontrado en BD');
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    console.log('👤 Datos del usuario obtenidos:', {
      ciclo_actual: user.ciclo_actual,
      especialidad: user.especialidad,
      nombre: user.nombre,
      apellido: user.apellido
    });

    // 🔧 VALIDACIÓN DE CICLO CONSISTENTE CON PERFIL
    const userCiclo = user.ciclo_actual;
    let expectedCiclo = null;
    
    if (userCiclo === 5) {
      expectedCiclo = 'V Ciclo';
    } else if (userCiclo === 6) {
      expectedCiclo = 'VI Ciclo';
    }
    
    // Validar que solo sean ciclos permitidos
    if (!expectedCiclo) {
      console.log('❌ Ciclo de usuario no válido:', userCiclo);
      res.status(400).json({
        success: false,
        message: `Tu perfil tiene un ciclo no válido (${userCiclo}). Solo se permiten V y VI ciclo. Por favor actualiza tu perfil.`
      });
      return;
    }

    // Validar consistencia entre perfil y formulario
    if (ciclo !== expectedCiclo) {
      console.log('❌ Ciclo inconsistente:', { 
        ciclo_usuario: userCiclo,
        expected: expectedCiclo,
        recibido: ciclo 
      });
      res.status(400).json({
        success: false,
        message: `El ciclo seleccionado (${ciclo}) no coincide con tu perfil académico (${expectedCiclo}). Por favor actualiza tu perfil.`
      });
      return;
    }

    console.log('✅ Ciclo validado correctamente:', { userCiclo, expectedCiclo, ciclo });

    // 🔧 VERIFICAR SI YA TIENE TESIS REGISTRADA
    const [existingThesis] = await sequelize.query(
      'SELECT id_tesis FROM tesispretesis WHERE id_usuario_estudiante = ?',
      { replacements: [student_id] }
    );

    if ((existingThesis as any[]).length > 0) {
      console.log('❌ Usuario ya tiene tesis registrada');
      res.status(400).json({
        success: false,
        message: 'Ya tienes una tesis registrada. Puedes editarla desde tu dashboard.'
      });
      return;
    }

    // 🔧 VERIFICAR QUE EL ASESOR EXISTE Y ESTÁ ACTIVO
    const [advisorData] = await sequelize.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.especialidad,
        u.correo_institucional,
        u.estado
      FROM usuario u
      WHERE u.rol = 'asesor' AND u.estado = 'activo' AND u.id_usuario = ?
    `, { replacements: [id_asesor] });

    const advisor = (advisorData as any[])[0];
    if (!advisor) {
      console.log('❌ Asesor no encontrado o inactivo');
      res.status(404).json({
        success: false,
        message: 'El asesor seleccionado no existe o no está disponible'
      });
      return;
    }

    console.log('✅ Asesor encontrado y válido:', {
      id: advisor.id_usuario,
      nombre: advisor.nombre,
      apellido: advisor.apellido,
      especialidad: advisor.especialidad
    });

    // 🔧 INSERTAR NUEVA TESIS (SIN CAMPO CICLO - SE OBTIENE DEL USUARIO)
    const insertQuery = `
      INSERT INTO tesispretesis (
        id_usuario_estudiante, 
        titulo, 
        descripcion, 
        id_asesor, 
        estado, 
        tipo,
        fase_actual,
        progreso_porcentaje,
        fecha_registro,
        fecha_limite,
        fecha_creacion,
        fecha_modificacion
      ) VALUES (?, ?, ?, ?, 'pendiente', 'pretesis', 'propuesta', 5.00, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH), NOW(), NOW())
    `;

    const [result] = await sequelize.query(insertQuery, {
      replacements: [student_id, titulo, descripcion, id_asesor]
    });

    const thesisId = (result as any).insertId;
    console.log(`✅ Tesis registrada exitosamente con ID: ${thesisId}`);

    // 🔧 RESPUESTA DE ÉXITO CON TODOS LOS DATOS
    const responseData = {
      id: thesisId,
      titulo,
      descripcion,
      ciclo: expectedCiclo, // Ciclo validado desde el perfil
      estado: 'pendiente',
      tipo: 'pretesis',
      fase_actual: 'propuesta',
      progreso_porcentaje: 5.00,
      asesor_nombre: `${advisor.nombre} ${advisor.apellido}`.trim(),
      asesor_especialidad: advisor.especialidad,
      asesor_email: advisor.correo_institucional,
      fecha_limite: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 6 meses
    };

    console.log('📤 === RESPUESTA ENVIADA AL FRONTEND ===');
    console.log('Datos completos:', responseData);
    console.log('========================================');

    res.status(201).json({
      success: true,
      message: 'Tesis registrada exitosamente',
      thesis: responseData
    });

  } catch (error) {
    console.error('❌ Error registrando tesis:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 🔧 GET /api/thesis/my - CONSULTA CORREGIDA CON JOIN COMPLETO Y ERRORES TYPESCRIPT SOLUCIONADOS
router.get('/my', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📖 === ENDPOINT GET /thesis/my EJECUTADO - V4.1 ERRORES TYPESCRIPT CORREGIDOS ===');
    const userEmail = req.user?.email;
    const userId = req.user?.id;
    console.log('👤 Usuario autenticado:', { id: userId, email: userEmail });

    // 🔧 CONSULTA COMPLETAMENTE CORREGIDA CON JOIN PARA CICLO
    const query = `
      SELECT 
        -- DATOS DE LA TESIS
        t.id_tesis,
        t.titulo,
        t.descripcion,
        t.estado,
        t.id_asesor,
        t.tipo,
        t.fase_actual,
        t.progreso_porcentaje,
        t.fecha_registro,
        t.fecha_creacion,
        t.fecha_limite,
        t.area,
        t.calificacion,
        
        -- 🔧 DATOS DEL ASESOR (CON VERIFICACIÓN NULL)
        COALESCE(asesor.nombre, 'Sin') as asesor_nombre,
        COALESCE(asesor.apellido, 'Asignar') as asesor_apellido,
        COALESCE(asesor.correo_institucional, 'no-disponible@tecsup.edu.pe') as asesor_email,
        COALESCE(asesor.especialidad, 'Sin especialidad') as asesor_especialidad,
        asesor.telefono as asesor_telefono,
        asesor.avatar_url as asesor_avatar,
        
        -- 🔧 DATOS DEL ESTUDIANTE (INCLUYENDO CICLO_ACTUAL)
        estudiante.ciclo_actual,
        estudiante.especialidad as carrera_estudiante,
        estudiante.codigo_estudiante,
        estudiante.nombre as estudiante_nombre,
        estudiante.apellido as estudiante_apellido
        
      FROM tesispretesis t
      INNER JOIN usuario estudiante ON t.id_usuario_estudiante = estudiante.id_usuario
      LEFT JOIN usuario asesor ON t.id_asesor = asesor.id_usuario AND asesor.rol = 'asesor'
      WHERE t.id_usuario_estudiante = ?
      ORDER BY t.fecha_creacion DESC
      LIMIT 1
    `;

    console.log('🔍 === EJECUTANDO CONSULTA CON JOIN COMPLETO ===');
    console.log('Query SQL (primeras 300 chars):', query.substring(0, 300) + '...');
    console.log('Usuario ID para consulta:', userId);

    // 🔧 CORRECCIÓN DE ERROR TYPESCRIPT: Remover QueryTypes.SELECT que no existe
    const queryResult = await sequelize.query(query, { 
      replacements: [userId]
    });

    // 🔧 CORRECCIÓN DE ERROR TYPESCRIPT: Manejar correctamente el resultado de la consulta
    const rows = queryResult[0] as any[] || [];

    console.log('📊 === RESULTADO RAW DE LA CONSULTA ===');
    console.log('Filas encontradas:', rows.length);
    
    if (rows.length > 0) {
      const thesis = rows[0];
      
      console.log('📋 === DATOS COMPLETOS DE LA BASE DE DATOS (RAW) ===');
      console.log('🆔 ID Tesis:', thesis.id_tesis);
      console.log('📝 Título:', thesis.titulo);
      console.log('🔄 Ciclo Actual (RAW):', thesis.ciclo_actual, 'tipo:', typeof thesis.ciclo_actual);
      console.log('👨‍🏫 Asesor Nombre (RAW):', thesis.asesor_nombre);
      console.log('👨‍🏫 Asesor Apellido (RAW):', thesis.asesor_apellido);
      console.log('📧 Asesor Email (RAW):', thesis.asesor_email);
      console.log('🎓 Carrera Estudiante (RAW):', thesis.carrera_estudiante);
      console.log('🏫 Código Estudiante (RAW):', thesis.codigo_estudiante);
      console.log('🆔 ID Asesor:', thesis.id_asesor);
      console.log('=============================================');

      // 🔧 FORMATEAR CICLO CORRECTAMENTE
      let cicloFormateado = 'V Ciclo'; // Por defecto
      if (thesis.ciclo_actual !== null && thesis.ciclo_actual !== undefined) {
        console.log('🔄 Procesando ciclo_actual:', thesis.ciclo_actual, 'tipo:', typeof thesis.ciclo_actual);
        
        const cicloNumero = parseInt(thesis.ciclo_actual);
        switch(cicloNumero) {
          case 5:
            cicloFormateado = 'V Ciclo';
            break;
          case 6:
            cicloFormateado = 'VI Ciclo';
            break;
          default:
            cicloFormateado = `Ciclo ${cicloNumero}`;
        }
        
        console.log('✅ Ciclo formateado correctamente:', cicloFormateado);
      } else {
        console.log('⚠️ No hay ciclo_actual en los datos, usando V Ciclo por defecto');
      }

      // 🔧 CREAR RESPUESTA COMPLETA
      const responseData = {
        id: thesis.id_tesis,
        titulo: thesis.titulo,
        descripcion: thesis.descripcion,
        ciclo: cicloFormateado, // 🔧 CICLO DESDE USUARIO VIA JOIN
        estado: thesis.estado,
        id_asesor: thesis.id_asesor,
        tipo: thesis.tipo,
        fase_actual: thesis.fase_actual,
        progreso_porcentaje: parseFloat(thesis.progreso_porcentaje) || 0,
        fecha_creacion: thesis.fecha_creacion,
        fecha_limite: thesis.fecha_limite,
        area: thesis.area,
        calificacion: thesis.calificacion ? parseFloat(thesis.calificacion) : null,
        
        // 🔧 DATOS DEL ASESOR COMPLETOS
        asesor_nombre: thesis.asesor_nombre && thesis.asesor_apellido 
          ? `${thesis.asesor_nombre} ${thesis.asesor_apellido}`.trim()
          : 'Asesor no asignado',
        asesor_email: thesis.asesor_email || 'Email no disponible',
        asesor_especialidad: thesis.asesor_especialidad || 'Especialidad no disponible',
        asesor_telefono: thesis.asesor_telefono || null,
        asesor_avatar: thesis.asesor_avatar || null,
        
        // 🔧 DATOS DEL ESTUDIANTE
        codigo_estudiante: thesis.codigo_estudiante,
        carrera: thesis.carrera_estudiante,
        estudiante_nombre: `${thesis.estudiante_nombre} ${thesis.estudiante_apellido}`.trim()
      };

      console.log('📤 === RESPUESTA FINAL ENVIADA AL FRONTEND ===');
      console.log('🔄 Ciclo Final:', responseData.ciclo);
      console.log('👨‍🏫 Asesor Final:', responseData.asesor_nombre);
      console.log('📧 Email Asesor Final:', responseData.asesor_email);
      console.log('🎓 Carrera Final:', responseData.carrera);
      console.log('🏫 Código Final:', responseData.codigo_estudiante);
      console.log('🆔 ID Asesor Final:', responseData.id_asesor);
      console.log('===============================================');

      res.json({
        success: true,
        hasThesis: true,
        thesis: responseData,
        timestamp: new Date().toISOString()
      });

    } else {
      console.log('ℹ️ Usuario sin tesis registrada');
      res.json({
        success: true,
        hasThesis: false,
        thesis: null,
        message: 'No tienes una tesis registrada aún',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Error obteniendo mi tesis:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      timestamp: new Date().toISOString()
    });
  }
});

// 🔧 PUT /api/thesis/:id - ACTUALIZAR TESIS EXISTENTE
import { param } from 'express-validator';

router.put('/:id',
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('ID de tesis inválido'),
  (req: Request, res: Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array(), message: 'Parámetro id inválido' });
      return;
    }
    next();
  },
  async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 === ENDPOINT PUT /thesis/:id EJECUTADO - MODO EDICIÓN === ✅');
    const { id } = req.params;
    const { titulo, descripcion } = req.body; // NO ACEPTAR id_asesor por ahora
    const student_id = req.user?.id;

    console.log('📊 Datos de actualización:', { 
      tesis_id: id, 
      titulo, 
      descripcion, 
      student_id 
    });

    // Validaciones básicas
    if (!titulo || !descripcion) {
      res.status(400).json({
        success: false,
        message: 'Título y descripción son obligatorios'
      });
      return;
    }

    if (titulo.trim().length < 10) {
      res.status(400).json({
        success: false,
        message: 'El título debe tener al menos 10 caracteres'
      });
      return;
    }

    if (descripcion.trim().length < 50) {
      res.status(400).json({
        success: false,
        message: 'La descripción debe tener al menos 50 caracteres'
      });
      return;
    }

    // 🔧 VERIFICAR QUE LA TESIS PERTENECE AL USUARIO
    const [existing] = await sequelize.query(
      'SELECT id_tesis, titulo FROM tesispretesis WHERE id_tesis = ? AND id_usuario_estudiante = ?',
      { replacements: [id, student_id] }
    );

    if ((existing as any[]).length === 0) {
      res.status(404).json({
        success: false,
        message: 'Tesis no encontrada o no tienes permisos para editarla'
      });
      return;
    }

    console.log('✅ Tesis encontrada y verificada');

    // 🔧 ACTUALIZAR SOLO TÍTULO Y DESCRIPCIÓN
    const updateQuery = `
      UPDATE tesispretesis 
      SET 
        titulo = ?, 
        descripcion = ?, 
        fecha_modificacion = NOW()
      WHERE id_tesis = ? AND id_usuario_estudiante = ?
    `;

    await sequelize.query(updateQuery, { 
      replacements: [titulo.trim(), descripcion.trim(), id, student_id] 
    });

    console.log('✅ Tesis actualizada exitosamente (solo título y descripción)');

    // 🔧 OBTENER DATOS ACTUALIZADOS CON JOIN COMPLETO
    const [updatedData] = await sequelize.query(`
      SELECT 
        t.id_tesis,
        t.titulo,
        t.descripcion,
        t.estado,
        t.id_asesor,
        t.tipo,
        t.fase_actual,
        t.progreso_porcentaje,
        t.fecha_limite,
        estudiante.ciclo_actual,
        estudiante.especialidad as carrera_estudiante,
        estudiante.codigo_estudiante,
        asesor.nombre as asesor_nombre,
        asesor.apellido as asesor_apellido,
        asesor.especialidad as asesor_especialidad,
        asesor.correo_institucional as asesor_email
      FROM tesispretesis t
      INNER JOIN usuario estudiante ON t.id_usuario_estudiante = estudiante.id_usuario
      LEFT JOIN usuario asesor ON t.id_asesor = asesor.id_usuario
      WHERE t.id_tesis = ?
    `, { replacements: [id] });

    const updated = (updatedData as any[])[0];
    
    // Formatear ciclo
    const cicloFormateado = updated.ciclo_actual === 5 ? 'V Ciclo' : 
                           updated.ciclo_actual === 6 ? 'VI Ciclo' : 
                           `Ciclo ${updated.ciclo_actual}`;

    const responseData = {
      id: updated.id_tesis,
      titulo: updated.titulo,
      descripcion: updated.descripcion,
      ciclo: cicloFormateado,
      estado: updated.estado,
      id_asesor: updated.id_asesor,
      tipo: updated.tipo,
      fase_actual: updated.fase_actual,
      progreso_porcentaje: parseFloat(updated.progreso_porcentaje) || 0,
      fecha_limite: updated.fecha_limite,
      asesor_nombre: updated.asesor_nombre && updated.asesor_apellido 
        ? `${updated.asesor_nombre} ${updated.asesor_apellido}`.trim()
        : 'Asesor no asignado',
      asesor_email: updated.asesor_email || 'Email no disponible',
      asesor_especialidad: updated.asesor_especialidad || 'Especialidad no disponible',
      codigo_estudiante: updated.codigo_estudiante,
      carrera: updated.carrera_estudiante
    };

    console.log('📤 === RESPUESTA DE ACTUALIZACIÓN ENVIADA ===');
    console.log('Datos actualizados:', {
      titulo: responseData.titulo,
      ciclo: responseData.ciclo,
      asesor: responseData.asesor_nombre
    });

    res.json({
      success: true,
      message: 'Tesis actualizada exitosamente',
      thesis: responseData
    });

  } catch (error) {
    console.error('❌ Error actualizando tesis:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 🔧 DELETE /api/thesis/:id - ELIMINAR TESIS (SOFT DELETE)
router.delete('/:id',
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('ID de tesis inválido'),
  (req: Request, res: Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array(), message: 'Parámetro id inválido' });
      return;
    }
    next();
  },
  async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🗑️ === ENDPOINT DELETE /thesis/:id EJECUTADO === ✅');
    const { id } = req.params;
    const student_id = req.user?.id;

    // Verificar que la tesis pertenece al usuario
    const [existing] = await sequelize.query(
      'SELECT id_tesis, titulo FROM tesispretesis WHERE id_tesis = ? AND id_usuario_estudiante = ?',
      { replacements: [id, student_id] }
    );

    if ((existing as any[]).length === 0) {
      console.log('❌ Tesis no encontrada');
      res.status(404).json({
        success: false,
        message: 'Tesis no encontrada'
      });
      return;
    }

    // Soft delete - cambiar estado a inactivo o eliminar
    await sequelize.query(
      'UPDATE tesispretesis SET estado = ?, fecha_modificacion = NOW() WHERE id_tesis = ?',
      { replacements: ['rechazado', id] }
    );

    console.log('✅ Tesis eliminada (soft delete)');

    res.json({
      success: true,
      message: 'Tesis eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando tesis:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 🚨 ENDPOINT TEMPORAL PARA DEBUG
router.get('/debug', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🚨 === ENDPOINT DEBUG CON AUTH EJECUTADO ===');
    const userId = req.user?.id;
    console.log('🚨 DEBUG - User ID desde token:', userId);
    
    // Consulta directa para ver qué pasa
    const queryResult = await sequelize.query(`
      SELECT 
        t.id_tesis,
        t.titulo,
        t.descripcion,
        t.estado,
        t.id_asesor,
        estudiante.ciclo_actual,
        estudiante.especialidad as carrera_estudiante,
        estudiante.codigo_estudiante,
        asesor.nombre as asesor_nombre,
        asesor.apellido as asesor_apellido,
        asesor.especialidad as asesor_especialidad,
        asesor.correo_institucional as asesor_email
      FROM tesispretesis t
      INNER JOIN usuario estudiante ON t.id_usuario_estudiante = estudiante.id_usuario
      LEFT JOIN usuario asesor ON t.id_asesor = asesor.id_usuario
      WHERE t.id_usuario_estudiante = ?
      LIMIT 1
    `, { replacements: [userId] });

    const rows = queryResult[0] as any[];
    
    console.log('🚨 DEBUG - Número de filas encontradas:', rows.length);
    console.log('🚨 DEBUG - Resultado directo:', rows[0] || 'NO HAY DATOS');
    
    if (rows.length > 0) {
      const data = rows[0];
      console.log('🚨 DEBUG - DATOS DETALLADOS:');
      console.log('   📝 Título:', data.titulo);
      console.log('   🔄 Ciclo actual:', data.ciclo_actual);
      console.log('   👨‍🏫 Asesor nombre:', data.asesor_nombre);
      console.log('   👨‍🏫 Asesor apellido:', data.asesor_apellido);
      console.log('   📧 Asesor email:', data.asesor_email);
      console.log('   🎓 Carrera:', data.carrera_estudiante);
      console.log('   🏫 Código estudiante:', data.codigo_estudiante);
    }
    
    res.json({
      success: true,
      debug: true,
      testing: 'CON AUTENTICACIÓN',
      userId,
      rowCount: rows.length,
      rawData: rows[0] || null,
      message: rows.length > 0 ? 'Datos encontrados' : 'No se encontraron datos'
    });

  } catch (error) {
    console.error('🚨 Error en debug con auth:', error);
    res.status(500).json({ 
      success: false, 
      error: (error as Error).message,
      debug: true 
    });
  }
});

// Endpoint: Crear tesis
router.post('/create', authenticateToken, validateCreateTesis, createTesis);

// Endpoint: Obtener tesis por estudiante
router.get('/estudiante/:id_usuario_estudiante', authenticateToken, getTesisByEstudiante);

export default router;