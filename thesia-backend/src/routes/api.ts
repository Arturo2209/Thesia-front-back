import { Router } from 'express';
import jwt from 'jsonwebtoken';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import User from '../models/User';
import Thesis from '../models/Tesis';

const router = Router();

console.log('🔧 Cargando archivo api.ts...');

// Ruta de prueba para API
router.get('/health', (req, res) => {
  console.log('✅ Endpoint /health ejecutado');
  res.json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    service: 'THESIA Backend API'
  });
});

// 🆕 ENDPOINT: Test de conexión (que busca el frontend)
router.get('/test-connection', async (req, res) => {
  console.log('🔍 Endpoint /test-connection ejecutado');
  
  try {
    // Probar conexión a BD
    await sequelize.authenticate();
    console.log('✅ Test de conexión exitoso');

    res.json({
      status: 'success',
      message: 'Conexión al backend exitosa',
      database: 'Connected',
      timestamp: new Date().toISOString(),
      server: 'THESIA Backend'
    });

  } catch (error) {
    console.error('❌ Error en test de conexión:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error de conexión con la base de datos',
      database: 'Disconnected',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// 🗄️ ENDPOINT: Verificar conexión a BD (más detallado)
router.get('/database/status', async (req, res) => {
  console.log('🔍 Endpoint /database/status ejecutado');
  
  try {
    console.log('🔍 Verificando estado de la base de datos...');

    // 1. Probar conexión básica
    await sequelize.authenticate();
    console.log('✅ Conexión a BD exitosa');

    // 2. Obtener información básica
    const [dbInfo] = await sequelize.query(`
      SELECT 
        DATABASE() as current_database,
        VERSION() as mysql_version,
        NOW() as server_time
    `);

    // 3. Contar usuarios
    const userCount = await User.count();

    console.log('📊 Información de BD obtenida');

    res.json({
      status: 'CONNECTED',
      message: 'Base de datos funcionando correctamente',
      database: {
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        current_database: (dbInfo[0] as any).current_database,
        mysql_version: (dbInfo[0] as any).mysql_version,
        server_time: (dbInfo[0] as any).server_time
      },
      statistics: {
        total_users: userCount
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error verificando BD:', error);
    
    res.status(500).json({
      status: 'ERROR',
      message: 'Error conectando a la base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint simple para tablas
router.get('/database/tables', async (req, res) => {
  console.log('🔍 Endpoint /database/tables ejecutado');
  
  try {
    const [tablesResult] = await sequelize.query("SHOW TABLES");
    
    res.json({
      status: 'OK',
      database: process.env.DB_NAME,
      total_tables: tablesResult.length,
      tables: tablesResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error listando tablas:', error);
    
    res.status(500).json({
      status: 'ERROR',
      message: 'Error obteniendo información de tablas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// 🔐 MIDDLEWARE: Verificar JWT
const verifyToken = (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET no configurado');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor'
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = decoded;
    
    console.log('🔐 Token verificado para usuario:', decoded.email);
    next();
    
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// 🏠 ENDPOINT: Dashboard principal con datos reales de tesis
router.get('/dashboard', verifyToken, async (req: any, res) => {
  try {
    console.log('🏠 Endpoint /dashboard ejecutado (con datos reales de tesis)');
    
    const userEmail = req.user.email;
    console.log('👤 Obteniendo datos para usuario:', userEmail);

    // Buscar usuario en BD
    const user = await User.findOne({
      where: { correo_institucional: userEmail }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en la base de datos'
      });
    }

    console.log('✅ Usuario encontrado:', {
      id: user.id_usuario,
      nombre: user.nombre,
      rol: user.rol,
      primer_acceso: user.primer_acceso
    });

    // 📊 BUSCAR TESIS REAL DEL USUARIO
    const userThesis = await Thesis.findOne({
      where: { id_usuario_estudiante: user.id_usuario }
    });

    // 🔧 DEFINIR TIPOS CORRECTOS PARA thesisData
    let thesisData: {
      hasThesis: boolean;
      title: string | null;
      phase: number;
      progress: number;
      daysRemaining: number;
      estado: string | null;
      fase_actual: string | null;
    } = {
      hasThesis: false,
      title: null,
      phase: 0,
      progress: 0,
      daysRemaining: 105,
      estado: null,
      fase_actual: null
    };

    if (userThesis) {
      // Calcular días restantes hasta fecha límite
      const today = new Date();
      const fechaLimite = userThesis.fecha_limite ? new Date(userThesis.fecha_limite) : null;
      const daysRemaining = fechaLimite ? 
        Math.ceil((fechaLimite.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 105;

      // Mapear fase actual a número
      const faseMap: { [key: string]: number } = {
        'propuesta': 1,
        'desarrollo': 2, 
        'revision': 3,
        'sustentacion': 4
      };

      thesisData = {
        hasThesis: true,
        title: userThesis.titulo,
        phase: faseMap[userThesis.fase_actual] || 1,
        progress: Math.round(parseFloat(userThesis.progreso_porcentaje.toString())),
        daysRemaining: Math.max(0, daysRemaining),
        estado: userThesis.estado,
        fase_actual: userThesis.fase_actual
      };
    } else {
      // Si completó perfil pero no tiene tesis, dar algo de progreso
      if (!user.primer_acceso) {
        thesisData.progress = 10; // 10% por completar perfil
        thesisData.phase = 0; // Fase 0: Preparación
      }
    }

    // 📄 DATOS DE DOCUMENTOS (simulados por ahora)
    const documentsData = {
      totalUploaded: 0,
      approved: 0,
      pending: 0,
      rejected: 0
    };

    // 👨‍🏫 DATOS DEL ASESOR (real si tiene tesis)
    let advisorData: {
      hasAdvisor: boolean;
      name: string | null;
      email: string | null;
    } = {
      hasAdvisor: false,
      name: null,
      email: null
    };

    if (userThesis && userThesis.id_asesor) {
      const advisor = await User.findOne({
        where: { id_usuario: userThesis.id_asesor },
        attributes: ['nombre', 'apellido', 'correo_institucional']
      });

      if (advisor) {
        advisorData = {
          hasAdvisor: true,
          name: `${advisor.nombre} ${advisor.apellido}`,
          email: advisor.correo_institucional
        };
      }
    }

    // 📈 ACTIVIDADES RECIENTES (basadas en datos reales del usuario)
    const activities = [];

    // Actividad: Registro inicial
    activities.push({
      id: 1,
      description: 'Registro inicial en el sistema',
      date: user.fecha_registro.toISOString(),
      type: 'profile'
    });

    // Actividad: Completar perfil (si ya lo hizo)
    if (!user.primer_acceso) {
      activities.push({
        id: 2,
        description: 'Perfil completado exitosamente',
        date: user.fecha_modificacion.toISOString(),
        type: 'profile'
      });
    }

    // Actividad: Registro de tesis (si la tiene)
    if (userThesis) {
      activities.push({
        id: 3,
        description: `Tesis "${userThesis.titulo}" registrada`,
        date: userThesis.fecha_registro.toISOString(),
        type: 'thesis'
      });
    }

    // Actividad: Último acceso
    if (user.fecha_ultimo_acceso) {
      activities.push({
        id: 4,
        description: 'Último acceso al sistema',
        date: user.fecha_ultimo_acceso.toISOString(),
        type: 'login'
      });
    }

    // Ordenar actividades por fecha (más reciente primero)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 🎯 DETERMINAR ROLE DISPLAY
    let roleDisplay = 'Estudiante';
    if (user.rol === 'asesor') roleDisplay = 'Asesor';
    if (user.rol === 'coordinador') roleDisplay = 'Coordinador';

    // 🏠 RESPUESTA CON TODOS LOS DATOS REALES
    const responseData = {
      user: {
        name: `${user.nombre} ${user.apellido}`,
        role: user.rol,
        roleDisplay: roleDisplay,
        carrera: user.especialidad || 'No especificada',
        profileCompleted: !user.primer_acceso,
        email: user.correo_institucional
      },
      thesis: thesisData,
      documents: documentsData,
      advisor: advisorData,
      activities: activities.slice(0, 5) // Últimas 5 actividades
    };

    console.log('📊 Enviando datos del dashboard:', {
      userName: responseData.user.name,
      role: responseData.user.role,
      hasThesis: responseData.thesis.hasThesis,
      thesisTitle: responseData.thesis.title ? (responseData.thesis.title.substring(0, 30) + '...') : 'N/A',
      progress: responseData.thesis.progress,
      totalActivities: activities.length
    });

    res.json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en dashboard:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 📊 ENDPOINT: Estadísticas específicas
router.get('/dashboard/stats', verifyToken, async (req: any, res) => {
  try {
    console.log('📊 Endpoint /dashboard/stats ejecutado');
    
    const userEmail = req.user.email;
    
    // Buscar usuario
    const user = await User.findOne({
      where: { correo_institucional: userEmail }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Estadísticas simuladas basadas en el usuario real
    const stats = {
      totalProgress: user.primer_acceso ? 5 : 15, // 5% inicial, 15% si completó perfil
      documentsApproved: 0, // Por ahora 0 hasta implementar documentos
      documentsPending: 0,
      daysRemaining: 105, // ~3.5 meses simulados
      lastActivity: user.fecha_ultimo_acceso || user.fecha_modificacion,
      profileStatus: user.primer_acceso ? 'Incompleto' : 'Completado',
      memberSince: user.fecha_registro
    };

    console.log('📊 Estadísticas generadas para:', user.correo_institucional);

    res.json({
      success: true,
      stats: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas'
    });
  }
});

// 👤 ENDPOINT: Información del usuario autenticado
router.get('/me', verifyToken, async (req: any, res) => {
  try {
    console.log('👤 Endpoint /me ejecutado');
    
    const userEmail = req.user.email;
    
    // Buscar usuario completo en BD
    const user = await User.findOne({
      where: { correo_institucional: userEmail },
      attributes: [
        'id_usuario',
        'nombre', 
        'apellido', 
        'correo_institucional',
        'rol',
        'especialidad',
        'telefono',
        'estado',
        'primer_acceso',
        'fecha_registro',
        'fecha_ultimo_acceso'
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar fecha de último acceso
    user.fecha_ultimo_acceso = new Date();
    await user.save();

    console.log('✅ Información de usuario obtenida y último acceso actualizado');

    res.json({
      success: true,
      user: {
        id: user.id_usuario,
        name: `${user.nombre} ${user.apellido}`,
        email: user.correo_institucional,
        role: user.rol,
        carrera: user.especialidad,
        telefono: user.telefono,
        profileCompleted: !user.primer_acceso,
        memberSince: user.fecha_registro,
        lastAccess: user.fecha_ultimo_acceso
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en /me:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo información del usuario'
    });
  }
});

// 🔍 ENDPOINT: Buscar usuarios (solo para coordinadores/asesores)
router.get('/users/search', verifyToken, async (req: any, res) => {
  try {
    console.log('🔍 Endpoint /users/search ejecutado');
    
    const userEmail = req.user.email;
    const { query, role, limit = 10 } = req.query;
    
    // Verificar que el usuario tenga permisos
    const currentUser = await User.findOne({
      where: { correo_institucional: userEmail }
    });

    if (!currentUser || (currentUser.rol !== 'coordinador' && currentUser.rol !== 'asesor')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para buscar usuarios'
      });
    }

    // Construir query de búsqueda
    const whereClause: any = {};
    
    if (query) {
        whereClause[Op.or] = [
            { nombre: { [Op.like]: `%${query}%` } },
            { apellido: { [Op.like]: `%${query}%` } },
            { correo_institucional: { [Op.like]: `%${query}%` } }
        ];
    }
    
    if (role) {
      whereClause.rol = role;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: [
        'id_usuario',
        'nombre',
        'apellido', 
        'correo_institucional',
        'rol',
        'especialidad',
        'estado',
        'fecha_registro'
      ],
      limit: parseInt(limit as string),
      order: [['fecha_registro', 'DESC']]
    });

    console.log(`✅ Encontrados ${users.length} usuarios`);

    res.json({
      success: true,
      users: users.map(user => ({
        id: user.id_usuario,
        name: `${user.nombre} ${user.apellido}`,
        email: user.correo_institucional,
        role: user.rol,
        carrera: user.especialidad,
        status: user.estado,
        memberSince: user.fecha_registro
      })),
      total: users.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en búsqueda de usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error buscando usuarios'
    });
  }
});

// 👨‍🏫 ENDPOINT: Obtener asesores disponibles
router.get('/advisors', verifyToken, async (req: any, res) => {
  try {
    console.log('👨‍🏫 Endpoint /advisors ejecutado');
    
    // Buscar usuarios con rol de asesor
    const advisors = await User.findAll({
      where: { 
        rol: 'asesor',
        estado: 'activo' 
      },
      attributes: [
        'id_usuario',
        'nombre',
        'apellido',
        'correo_institucional',
        'especialidad',
        'telefono'
      ],
      order: [['nombre', 'ASC']]
    });

    console.log(`✅ Encontrados ${advisors.length} asesores disponibles`);

    res.json({
      success: true,
      advisors: advisors.map(advisor => ({
        id: advisor.id_usuario,
        name: `${advisor.nombre} ${advisor.apellido}`,
        email: advisor.correo_institucional,
        specialty: advisor.especialidad,
        phone: advisor.telefono,
        fullInfo: `${advisor.nombre} ${advisor.apellido} - ${advisor.especialidad || 'Sin especialidad'}`
      })),
      total: advisors.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error obteniendo asesores:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo lista de asesores'
    });
  }
});

// 📝 ENDPOINT: Crear nueva tesis/pretesis
router.post('/thesis', verifyToken, async (req: any, res) => {
  try {
    console.log('📝 Endpoint POST /thesis ejecutado');
    
    const userEmail = req.user.email;
    const { titulo, descripcion, id_asesor, area, tipo = 'pretesis' } = req.body;

    // Validar campos requeridos
    if (!titulo || !descripcion || !id_asesor) {
      return res.status(400).json({
        success: false,
        message: 'Los campos titulo, descripcion e id_asesor son requeridos'
      });
    }

    // Buscar usuario actual
    const user = await User.findOne({
      where: { correo_institucional: userEmail }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que no tenga ya una tesis registrada
    const existingThesis = await Thesis.findOne({
      where: { id_usuario_estudiante: user.id_usuario }
    });

    if (existingThesis) {
      return res.status(409).json({
        success: false,
        message: 'Ya tienes una tesis registrada',
        thesis: {
          id: existingThesis.id_tesis,
          titulo: existingThesis.titulo,
          estado: existingThesis.estado
        }
      });
    }

    // Verificar que el asesor existe y tiene rol de asesor
    const advisor = await User.findOne({
      where: { 
        id_usuario: id_asesor,
        rol: 'asesor',
        estado: 'activo'
      }
    });

    if (!advisor) {
      return res.status(400).json({
        success: false,
        message: 'El asesor seleccionado no es válido o no está disponible'
      });
    }

    console.log('📝 Creando nueva tesis:', {
      usuario: user.correo_institucional,
      titulo: titulo.substring(0, 50) + '...',
      asesor: `${advisor.nombre} ${advisor.apellido}`
    });

    // Calcular fecha límite (6 meses desde hoy)
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() + 6);

    // Crear la tesis
    const newThesis = await Thesis.create({
      id_usuario_estudiante: user.id_usuario,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      id_asesor: parseInt(id_asesor),
      area: area?.trim() || null,
      tipo: tipo,
      estado: 'pendiente',
      fase_actual: 'propuesta',
      progreso_porcentaje: 5.00, // 5% inicial por registrar
      fecha_limite: fechaLimite
    });

    console.log('✅ Tesis creada exitosamente:', {
      id: newThesis.id_tesis,
      titulo: newThesis.titulo,
      estado: newThesis.estado
    });

    res.status(201).json({
      success: true,
      message: 'Tesis registrada exitosamente',
      thesis: {
        id: newThesis.id_tesis,
        titulo: newThesis.titulo,
        descripcion: newThesis.descripcion,
        area: newThesis.area,
        tipo: newThesis.tipo,
        estado: newThesis.estado,
        fase_actual: newThesis.fase_actual,
        progreso_porcentaje: newThesis.progreso_porcentaje,
        fecha_registro: newThesis.fecha_registro,
        fecha_limite: newThesis.fecha_limite,
        advisor: {
          id: advisor.id_usuario,
          name: `${advisor.nombre} ${advisor.apellido}`,
          email: advisor.correo_institucional,
          specialty: advisor.especialidad
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error creando tesis:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno creando la tesis',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 📖 ENDPOINT: Obtener tesis del usuario actual
router.get('/thesis/my', verifyToken, async (req: any, res) => {
    try {
      console.log('📖 Endpoint GET /thesis/my ejecutado');
      
      const userEmail = req.user.email;
  
      // Buscar usuario
      const user = await User.findOne({
        where: { correo_institucional: userEmail }
      });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
  
      console.log('👤 Usuario encontrado:', {
        id: user.id_usuario,
        email: user.correo_institucional
      });
  
      // Buscar tesis del usuario con información del asesor
      const thesis = await Thesis.findOne({
        where: { id_usuario_estudiante: user.id_usuario }
      });
  
      if (!thesis) {
        console.log('ℹ️ Usuario sin tesis registrada');
        return res.json({
          success: true,
          hasThesis: false,
          message: 'No tienes una tesis registrada',
          thesis: null
        });
      }
  
      // Obtener información del asesor
      let advisor = null;
      if (thesis.id_asesor) {
        advisor = await User.findOne({
          where: { id_usuario: thesis.id_asesor },
          attributes: ['id_usuario', 'nombre', 'apellido', 'correo_institucional', 'especialidad', 'telefono']
        });
      }
  
      console.log('✅ Tesis encontrada:', {
        id: thesis.id_tesis,
        titulo: thesis.titulo?.substring(0, 50) + '...' || 'Sin título',
        estado: thesis.estado
      });
  
      res.json({
        success: true,
        hasThesis: true,
        thesis: {
          id: thesis.id_tesis,
          titulo: thesis.titulo,
          descripcion: thesis.descripcion,
          area: thesis.area,
          tipo: thesis.tipo,
          estado: thesis.estado,
          fase_actual: thesis.fase_actual,
          progreso_porcentaje: thesis.progreso_porcentaje,
          fecha_registro: thesis.fecha_registro,
          fecha_limite: thesis.fecha_limite,
          fecha_aprobacion: thesis.fecha_aprobacion,
          calificacion: thesis.calificacion,
          advisor: advisor ? {
            id: advisor.id_usuario,
            name: `${advisor.nombre} ${advisor.apellido}`,
            email: advisor.correo_institucional,
            specialty: advisor.especialidad,
            phone: advisor.telefono
          } : null
        },
        timestamp: new Date().toISOString()
      });
  
    } catch (error) {
      console.error('❌ Error obteniendo tesis del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo información de la tesis',
        error: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : 'Error desconocido') : 
          'Error interno'
      });
    }
});

console.log('✅ Rutas de api.ts configuradas');

export default router;