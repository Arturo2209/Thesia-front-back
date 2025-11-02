import { Router, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import sequelize from '../config/database';
import Notificacion, { crearNotificacion, crearNotificacionMasiva } from '../models/Notificacion';
import { createNotification, getNotificationsByUser, validateCreateNotification } from '../controllers/notificationController';

const router = Router();

console.log('🔔 Cargando archivo notifications.ts...');

// Endpoint: Crear notificación con validación
router.post('/create', authenticateToken, validateCreateNotification, createNotification);

// Endpoint: Obtener notificaciones por usuario
router.get('/usuario/:id_usuario',
  authenticateToken,
  param('id_usuario').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array(), message: 'Parámetro id_usuario inválido' });
    }
    next();
  },
  getNotificationsByUser
);

// 📋 GET /api/notifications - Obtener notificaciones del usuario actual
import { query } from 'express-validator';

router.get('/',
  authenticateToken,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('El parámetro page debe ser un entero positivo'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El parámetro limit debe ser un entero positivo y máximo 100'),
    query('tipo').optional().isString().isLength({ max: 50 }).withMessage('El tipo debe ser texto de máximo 50 caracteres'),
    query('prioridad').optional().isString().isLength({ max: 20 }).withMessage('La prioridad debe ser texto de máximo 20 caracteres'),
    query('leido').optional().isIn(['0', '1', 'true', 'false', 'all']).withMessage('El parámetro leido debe ser 0, 1, true, false o all'),
    query('fecha_desde').optional().isISO8601().withMessage('El parámetro fecha_desde debe ser una fecha válida'),
    query('fecha_hasta').optional().isISO8601().withMessage('El parámetro fecha_hasta debe ser una fecha válida')
  ],
  (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array(), message: 'Parámetros de consulta inválidos' });
    }
    next();
  },
  async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔔 === ENDPOINT GET /notifications EJECUTADO ===');
    const userId = (req as any).user?.id;
    
    // Parámetros de query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const tipo = req.query.tipo as string;
    const prioridad = req.query.prioridad as string;
    const leido = req.query.leido as string;
    const fecha_desde = req.query.fecha_desde as string;
    const fecha_hasta = req.query.fecha_hasta as string;

    console.log('📊 Parámetros recibidos:', {
      userId,
      page,
      limit,
      tipo,
      prioridad,
      leido,
      fecha_desde,
      fecha_hasta
    });

    // 🔧 CONSTRUIR QUERY DINÁMICO
    let whereConditions = ['n.id_usuario = ?'];
    let queryParams: any[] = [userId];

    // Filtros opcionales
    if (tipo && tipo !== 'all') {
      whereConditions.push('n.tipo = ?');
      queryParams.push(tipo);
    }

    if (prioridad && prioridad !== 'all') {
      whereConditions.push('n.prioridad = ?');
      queryParams.push(prioridad);
    }

    if (leido && leido !== 'all') {
      const leidoValue = leido === '1' || leido === 'true' ? 1 : 0;
      whereConditions.push('n.leido = ?');
      queryParams.push(leidoValue);
    }

    if (fecha_desde) {
      whereConditions.push('n.fecha_envio >= ?');
      queryParams.push(fecha_desde);
    }

    if (fecha_hasta) {
      whereConditions.push('n.fecha_envio <= ?');
      queryParams.push(fecha_hasta + ' 23:59:59');
    }

    // 📊 QUERY PRINCIPAL CON PAGINACIÓN
    const offset = (page - 1) * limit;
    const whereClause = whereConditions.join(' AND ');

    const notificationsQuery = `
      SELECT 
        n.id_notificacion,
        n.id_usuario,
        n.mensaje,
        n.tipo,
        n.fecha_envio,
        n.leido,
        n.id_referencia,
        n.tipo_referencia,
        n.prioridad,
        n.fecha_creacion,
        n.fecha_modificacion,
        u.nombre as usuario_nombre,
        u.apellido as usuario_apellido
      FROM notificacion n
      LEFT JOIN usuario u ON n.id_usuario = u.id_usuario
      WHERE ${whereClause}
      ORDER BY n.fecha_envio DESC
      LIMIT ? OFFSET ?
    `;

    // Agregar limit y offset a parámetros
    queryParams.push(limit, offset);

    console.log('🔍 Ejecutando query de notificaciones...');
    const [notificationsResults] = await sequelize.query(notificationsQuery, {
      replacements: queryParams
    });
    const notifications = notificationsResults as any[];

    // 📊 CONTAR TOTAL DE NOTIFICACIONES
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notificacion n
      WHERE ${whereClause}
    `;

    // Remover limit y offset para el count
    const countParams = queryParams.slice(0, -2);
    const [countResults] = await sequelize.query(countQuery, {
      replacements: countParams
    });
    const totalCount = (countResults as any[])[0].total;

    // 📊 CONTAR NO LEÍDAS
    const unreadQuery = `
      SELECT COUNT(*) as unread
      FROM notificacion n
      WHERE n.id_usuario = ? AND n.leido = 0
    `;

    const [unreadResults] = await sequelize.query(unreadQuery, {
      replacements: [userId]
    });
    const unreadCount = (unreadResults as any[])[0].unread;

    // ✅ FORMATEAR RESPUESTA
    const hasMore = (page * limit) < totalCount;

    console.log('✅ Notificaciones obtenidas:', {
      total: totalCount,
      page,
      returned: notifications.length,
      unread: unreadCount,
      hasMore
    });

    res.json({
      success: true,
      message: 'Notificaciones obtenidas exitosamente',
      notifications,
      total: totalCount,
      unreadCount,
      page,
      hasMore,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 📖 PUT /api/notifications/:id/read - Marcar como leída
router.put('/:id/read', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📖 === ENDPOINT PUT /notifications/:id/read EJECUTADO ===');
    const { id } = req.params;
    const userId = (req as any).user?.id;

    console.log('📖 Marcando notificación como leída:', { id, userId });

    // Verificar que la notificación pertenece al usuario
    const verifyQuery = `
      SELECT id_notificacion, leido
      FROM notificacion 
      WHERE id_notificacion = ? AND id_usuario = ?
    `;

    const [verifyResults] = await sequelize.query(verifyQuery, {
      replacements: [id, userId]
    });
    const notifications = verifyResults as any[];

    if (notifications.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
      return;
    }

    // Actualizar a leída
    const updateQuery = `
      UPDATE notificacion 
      SET leido = 1, fecha_modificacion = NOW()
      WHERE id_notificacion = ? AND id_usuario = ?
    `;

    await sequelize.query(updateQuery, {
      replacements: [id, userId]
    });

    console.log('✅ Notificación marcada como leída');

    res.json({
      success: true,
      message: 'Notificación marcada como leída',
      updatedCount: 1
    });

  } catch (error) {
    console.error('❌ Error marcando notificación como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 📖 PUT /api/notifications/read-multiple - Marcar múltiples como leídas
router.put('/read-multiple', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📖 === ENDPOINT PUT /notifications/read-multiple EJECUTADO ===');
    const { notificationIds } = req.body;
    const userId = (req as any).user?.id;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Se requiere un array de IDs de notificaciones'
      });
      return;
    }

    console.log('📖 Marcando múltiples notificaciones como leídas:', {
      count: notificationIds.length,
      userId
    });

    const placeholders = notificationIds.map(() => '?').join(',');
    const updateQuery = `
      UPDATE notificacion 
      SET leido = 1, fecha_modificacion = NOW()
      WHERE id_notificacion IN (${placeholders}) AND id_usuario = ?
    `;

    const [result] = await sequelize.query(updateQuery, {
      replacements: [...notificationIds, userId]
    });

    const updatedCount = (result as any).affectedRows || 0;

    console.log('✅ Notificaciones marcadas como leídas:', updatedCount);

    res.json({
      success: true,
      message: `${updatedCount} notificaciones marcadas como leídas`,
      updatedCount
    });

  } catch (error) {
    console.error('❌ Error marcando múltiples notificaciones como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 📖 PUT /api/notifications/read-all - Marcar todas como leídas
router.put('/read-all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📖 === ENDPOINT PUT /notifications/read-all EJECUTADO ===');
    const userId = (req as any).user?.id;

    console.log('📖 Marcando todas las notificaciones como leídas para usuario:', userId);

    const updateQuery = `
      UPDATE notificacion 
      SET leido = 1, fecha_modificacion = NOW()
      WHERE id_usuario = ? AND leido = 0
    `;

    const [result] = await sequelize.query(updateQuery, {
      replacements: [userId]
    });

    const updatedCount = (result as any).affectedRows || 0;

    console.log('✅ Todas las notificaciones marcadas como leídas:', updatedCount);

    res.json({
      success: true,
      message: `${updatedCount} notificaciones marcadas como leídas`,
      updatedCount
    });

  } catch (error) {
    console.error('❌ Error marcando todas las notificaciones como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 🗑️ DELETE /api/notifications/:id - Eliminar notificación
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🗑️ === ENDPOINT DELETE /notifications/:id EJECUTADO ===');
    const { id } = req.params;
    const userId = (req as any).user?.id;

    console.log('🗑️ Eliminando notificación:', { id, userId });

    // Verificar que la notificación pertenece al usuario
    const verifyQuery = `
      SELECT id_notificacion
      FROM notificacion 
      WHERE id_notificacion = ? AND id_usuario = ?
    `;

    const [verifyResults] = await sequelize.query(verifyQuery, {
      replacements: [id, userId]
    });
    const notifications = verifyResults as any[];

    if (notifications.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
      return;
    }

    // Eliminar notificación
    const deleteQuery = `
      DELETE FROM notificacion 
      WHERE id_notificacion = ? AND id_usuario = ?
    `;

    await sequelize.query(deleteQuery, {
      replacements: [id, userId]
    });

    console.log('✅ Notificación eliminada');

    res.json({
      success: true,
      message: 'Notificación eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 🔔 GET /api/notifications/unread-count - Contador de no leídas
router.get('/unread-count', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔔 === ENDPOINT GET /notifications/unread-count EJECUTADO ===');
    const userId = (req as any).user?.id;

    const countQuery = `
      SELECT COUNT(*) as unreadCount
      FROM notificacion 
      WHERE id_usuario = ? AND leido = 0
    `;

    const [results] = await sequelize.query(countQuery, {
      replacements: [userId]
    });
    const unreadCount = (results as any[])[0].unreadCount;

    console.log('✅ Contador de no leídas obtenido:', unreadCount);

    res.json({
      success: true,
      unreadCount
    });

  } catch (error) {
    console.error('❌ Error obteniendo contador de no leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 🔔 POST /api/notifications - Crear nueva notificación (para admin/testing)
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔔 === ENDPOINT POST /notifications EJECUTADO ===');
    const { id_usuario, mensaje, tipo, prioridad, id_referencia, tipo_referencia } = req.body;

    if (!id_usuario || !mensaje || !tipo) {
      res.status(400).json({
        success: false,
        message: 'Los campos id_usuario, mensaje y tipo son requeridos'
      });
      return;
    }

    console.log('🔔 Creando nueva notificación:', {
      id_usuario,
      mensaje: mensaje.substring(0, 50) + '...',
      tipo,
      prioridad
    });

    const notification = await crearNotificacion(
      id_usuario,
      mensaje,
      tipo,
      {
        prioridad: prioridad || 'media',
        id_referencia,
        tipo_referencia
      }
    );

    console.log('✅ Notificación creada:', notification.id_notificacion);

    res.status(201).json({
      success: true,
      message: 'Notificación creada exitosamente',
      notification: {
        id: notification.id_notificacion,
        mensaje: notification.mensaje,
        tipo: notification.tipo,
        prioridad: notification.prioridad,
        fecha_envio: notification.fecha_envio
      }
    });

  } catch (error) {
    console.error('❌ Error creando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 📊 GET /api/notifications/stats - Estadísticas de notificaciones
router.get('/stats', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📊 === ENDPOINT GET /notifications/stats EJECUTADO ===');
    const userId = (req as any).user?.id;

    // Estadísticas generales
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN leido = 0 THEN 1 ELSE 0 END) as unread,
        SUM(CASE WHEN fecha_envio >= NOW() - INTERVAL 1 DAY THEN 1 ELSE 0 END) as recent
      FROM notificacion 
      WHERE id_usuario = ?
    `;

    const [statsResults] = await sequelize.query(statsQuery, {
      replacements: [userId]
    });
    const stats = (statsResults as any[])[0];

    // Por tipo
    const typeQuery = `
      SELECT tipo, COUNT(*) as count
      FROM notificacion 
      WHERE id_usuario = ?
      GROUP BY tipo
    `;

    const [typeResults] = await sequelize.query(typeQuery, {
      replacements: [userId]
    });
    const byType = (typeResults as any[]).reduce((acc, row) => {
      acc[row.tipo] = row.count;
      return acc;
    }, {});

    // Por prioridad
    const priorityQuery = `
      SELECT prioridad, COUNT(*) as count
      FROM notificacion 
      WHERE id_usuario = ?
      GROUP BY prioridad
    `;

    const [priorityResults] = await sequelize.query(priorityQuery, {
      replacements: [userId]
    });
    const byPriority = (priorityResults as any[]).reduce((acc, row) => {
      acc[row.prioridad] = row.count;
      return acc;
    }, {});

    console.log('✅ Estadísticas obtenidas:', {
      total: stats.total,
      unread: stats.unread,
      recent: stats.recent
    });

    res.json({
      success: true,
      stats: {
        total: stats.total,
        unread: stats.unread,
        byType,
        byPriority,
        recent: stats.recent
      },
      message: 'Estadísticas obtenidas exitosamente'
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

// 🔄 GET /api/notifications/check-new - Verificar nuevas notificaciones
router.get('/check-new', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 === ENDPOINT GET /notifications/check-new EJECUTADO ===');
    const userId = (req as any).user?.id;
    const since = req.query.since as string;

    if (!since) {
      res.status(400).json({
        success: false,
        message: 'Parámetro "since" es requerido'
      });
      return;
    }

    // Buscar notificaciones nuevas
    const newQuery = `
      SELECT 
        n.id_notificacion,
        n.mensaje,
        n.tipo,
        n.fecha_envio,
        n.prioridad
      FROM notificacion n
      WHERE n.id_usuario = ? 
        AND n.fecha_envio > ?
      ORDER BY n.fecha_envio DESC
    `;

    const [newResults] = await sequelize.query(newQuery, {
      replacements: [userId, since]
    });
    const newNotifications = newResults as any[];

    // Contador actual de no leídas
    const [unreadResults] = await sequelize.query(
      'SELECT COUNT(*) as unreadCount FROM notificacion WHERE id_usuario = ? AND leido = 0',
      { replacements: [userId] }
    );
    const unreadCount = (unreadResults as any[])[0].unreadCount;

    console.log('✅ Verificación de nuevas notificaciones:', {
      hasNew: newNotifications.length > 0,
      count: newNotifications.length,
      unreadCount
    });

    res.json({
      success: true,
      hasNew: newNotifications.length > 0,
      newNotifications,
      unreadCount,
      message: 'Verificación completada'
    });

  } catch (error) {
    console.error('❌ Error verificando nuevas notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno'
    });
  }
});

console.log('✅ Rutas de notifications.ts configuradas');

export default router;