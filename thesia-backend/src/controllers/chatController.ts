import { Request, Response } from 'express';
import sequelize from '../config/database';
import { Op } from 'sequelize';

// GET /api/chat/messages - Obtener mensajes del chat entre estudiante y asesor
export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    console.log('💬 === OBTENIENDO MENSAJES DEL CHAT ===');
    console.log('Usuario:', { id: userId, role: userRole });

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Si es estudiante, buscar su asesor. Si es asesor, buscar el estudiante del que viene la solicitud
    let query;
    let otherUserId;

    if (userRole === 'estudiante') {
      query = `
        SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo_institucional,
          u.avatar_url,
          tp.id_tesis
        FROM tesispretesis tp
        JOIN usuario u ON u.id_usuario = tp.id_asesor
        WHERE tp.id_usuario_estudiante = ?
          AND tp.estado IN ('pendiente', 'en_proceso', 'aprobada')
        ORDER BY tp.fecha_creacion DESC
        LIMIT 1
      `;
      const [results] = await sequelize.query(query, {
        replacements: [userId]
      });
      
      if ((results as any[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No tienes un asesor asignado'
        });
      }
      otherUserId = (results as any[])[0].id_usuario;
      
    } else if (userRole === 'asesor') {
      const studentId = req.query.studentId;
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el ID del estudiante'
        });
      }
      
      query = `
        SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo_institucional,
          u.avatar_url,
          tp.id_tesis
        FROM tesispretesis tp
        JOIN usuario u ON u.id_usuario = tp.id_usuario_estudiante
        WHERE tp.id_asesor = ?
          AND tp.id_usuario_estudiante = ?
          AND tp.estado IN ('pendiente', 'en_proceso', 'aprobada')
      `;
      const [results] = await sequelize.query(query, {
        replacements: [userId, studentId]
      });
      
      if ((results as any[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No tienes asignado a este estudiante'
        });
      }
      otherUserId = studentId;
    }

    // Obtener mensajes
    const messagesQuery = `
      SELECT 
        m.id_mensaje,
        m.contenido,
        m.fecha_envio,
        m.tipo,
        m.id_remitente,
        u.nombre,
        u.apellido,
        u.avatar_url
      FROM mensajes m
      JOIN usuario u ON u.id_usuario = m.id_remitente
      WHERE (m.id_remitente = ? AND m.id_destinatario = ?)
         OR (m.id_remitente = ? AND m.id_destinatario = ?)
      ORDER BY m.fecha_envio ASC
    `;

    const [messages] = await sequelize.query(messagesQuery, {
      replacements: [userId, otherUserId, otherUserId, userId]
    });

    console.log(`✅ Encontrados ${(messages as any[]).length} mensajes`);

    res.json({
      success: true,
      messages: messages,
      total: (messages as any[]).length
    });

  } catch (error) {
    console.error('❌ Error obteniendo mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error : 'Error interno'
    });
  }
};

// POST /api/chat/send - Enviar un mensaje
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { content, recipientId } = req.body;

    console.log('💬 === ENVIANDO MENSAJE ===');
    console.log('De:', { id: userId, role: userRole });
    console.log('Para:', recipientId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!content || !recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere contenido del mensaje y destinatario'
      });
    }

    // Verificar que existe una relación estudiante-asesor
    const relationQuery = `
      SELECT id_tesis
      FROM tesispretesis
      WHERE (id_usuario_estudiante = ? AND id_asesor = ?)
         OR (id_usuario_estudiante = ? AND id_asesor = ?)
      AND estado IN ('pendiente', 'en_proceso', 'aprobada')
    `;

    const [relations] = await sequelize.query(relationQuery, {
      replacements: [userId, recipientId, recipientId, userId]
    });

    if ((relations as any[]).length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No existe una relación estudiante-asesor entre estos usuarios'
      });
    }

    // Crear el mensaje
    const insertQuery = `
      INSERT INTO mensajes (
        contenido,
        id_remitente,
        id_destinatario,
        tipo,
        fecha_envio,
        leido
      ) VALUES (?, ?, ?, 'texto', NOW(), false)
    `;

    const [result] = await sequelize.query(insertQuery, {
      replacements: [content, userId, recipientId]
    });

    console.log('✅ Mensaje enviado');

    // Obtener el mensaje creado
    const messageId = (result as any).insertId;
    const [messages] = await sequelize.query(`
      SELECT 
        m.id_mensaje,
        m.contenido,
        m.fecha_envio,
        m.tipo,
        m.id_remitente,
        u.nombre,
        u.apellido,
        u.avatar_url
      FROM mensajes m
      JOIN usuario u ON u.id_usuario = m.id_remitente
      WHERE m.id_mensaje = ?
    `, {
      replacements: [messageId]
    });

    res.status(201).json({
      success: true,
      message: messages[0]
    });

  } catch (error) {
    console.error('❌ Error enviando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error : 'Error interno'
    });
  }
};