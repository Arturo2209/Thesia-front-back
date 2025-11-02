import { body } from 'express-validator';
// Agregar comentario del asesor a un avance (documento)
export const commentAdvisorProgress = [
  body('comentario').isString().notEmpty().withMessage('El comentario es requerido'),
  async (req: Request, res: Response) => {
    try {
      const advisorId = (req as any).user?.id;
      const { id } = req.params;
      const { comentario } = req.body;
      // Verificar que el documento existe y pertenece a una tesis del asesor
      const query = `
        SELECT d.* FROM documento d
        JOIN tesispretesis t ON d.id_tesis = t.id_tesis
        WHERE d.id_documento = ? AND t.id_asesor = ?
      `;
      const [rows] = await (Documento.sequelize as any).query(query, { replacements: [id, advisorId] });
      const doc = (rows as any[])[0];
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Avance no encontrado o no autorizado' });
      }
      // Guardar comentario (puedes usar un campo comentarios en Documento o una tabla aparte, aquí lo guardamos en Documento)
      await Documento.update({ comentarios: comentario, fecha_modificacion: new Date() }, { where: { id_documento: id } });
      res.json({ success: true, message: 'Comentario agregado correctamente' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al agregar comentario',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
      });
    }
  }
];
import Documento from '../models/Documento';
// Listar avances pendientes para el asesor autenticado
export const getPendingAdvisorProgress = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    // Buscar documentos de tesis donde el asesor es el asignado y el estado es pendiente o en_revision
    const query = `
      SELECT d.* FROM documento d
      JOIN tesispretesis t ON d.id_tesis = t.id_tesis
      WHERE t.id_asesor = ? AND d.estado IN ('pendiente', 'en_revision')
      ORDER BY d.fecha_subida DESC
    `;
    const [results] = await (Documento.sequelize as any).query(query, { replacements: [advisorId] });
    res.json({ success: true, progress: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo avances pendientes',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};

// Aceptar avance (documento)
export const acceptAdvisorProgress = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    const { id } = req.params;
    // Verificar que el documento existe, está pendiente/en_revision y pertenece a una tesis del asesor
    const query = `
      SELECT d.* FROM documento d
      JOIN tesispretesis t ON d.id_tesis = t.id_tesis
      WHERE d.id_documento = ? AND t.id_asesor = ? AND d.estado IN ('pendiente', 'en_revision')
    `;
    const [rows] = await (Documento.sequelize as any).query(query, { replacements: [id, advisorId] });
    const doc = (rows as any[])[0];
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Avance no encontrado o no autorizado' });
    }
    // Actualizar documento a aprobado
    await Documento.update({ estado: 'aprobado', validado_por_asesor: true, fecha_modificacion: new Date() }, { where: { id_documento: id } });
    // Notificar al estudiante (puedes mejorar esto con tu sistema de notificaciones)
    // ...
    res.json({ success: true, message: 'Avance aprobado correctamente' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al aprobar el avance',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};

// Rechazar avance (documento)
export const rejectAdvisorProgress = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    const { id } = req.params;
    // Verificar que el documento existe, está pendiente/en_revision y pertenece a una tesis del asesor
    const query = `
      SELECT d.* FROM documento d
      JOIN tesispretesis t ON d.id_tesis = t.id_tesis
      WHERE d.id_documento = ? AND t.id_asesor = ? AND d.estado IN ('pendiente', 'en_revision')
    `;
    const [rows] = await (Documento.sequelize as any).query(query, { replacements: [id, advisorId] });
    const doc = (rows as any[])[0];
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Avance no encontrado o no autorizado' });
    }
    // Actualizar documento a rechazado
    await Documento.update({ estado: 'rechazado', validado_por_asesor: false, fecha_modificacion: new Date() }, { where: { id_documento: id } });
    // Notificar al estudiante (puedes mejorar esto con tu sistema de notificaciones)
    // ...
    res.json({ success: true, message: 'Avance rechazado correctamente' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al rechazar el avance',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};
// Aceptar reunión solicitada
export const acceptAdvisorMeeting = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    const { id } = req.params;
    // Verificar que la reunión existe, está pendiente y pertenece al asesor
    const meeting = await Reunion.findOne({ where: { id_reunion: id, id_asesor: advisorId, estado: 'pendiente' } });
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Reunión no encontrada o no autorizada' });
    }
    meeting.estado = 'realizada';
    meeting.fecha_modificacion = new Date();
    await meeting.save();
    // Notificar al estudiante (puedes mejorar esto con tu sistema de notificaciones)
    // ...
    res.json({ success: true, message: 'Reunión aceptada correctamente' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al aceptar la reunión',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};

// Rechazar reunión solicitada
export const rejectAdvisorMeeting = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    const { id } = req.params;
    // Verificar que la reunión existe, está pendiente y pertenece al asesor
    const meeting = await Reunion.findOne({ where: { id_reunion: id, id_asesor: advisorId, estado: 'pendiente' } });
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Reunión no encontrada o no autorizada' });
    }
    meeting.estado = 'cancelada';
    meeting.fecha_modificacion = new Date();
    await meeting.save();
    // Notificar al estudiante (puedes mejorar esto con tu sistema de notificaciones)
    // ...
    res.json({ success: true, message: 'Reunión rechazada correctamente' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al rechazar la reunión',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};
import Reunion from '../models/Reunion';
// Listar reuniones pendientes de aceptación para el asesor autenticado
export const getPendingAdvisorMeetings = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    // Buscar reuniones con estado 'pendiente' y asignadas al asesor
    const meetings = await Reunion.findAll({
      where: {
        id_asesor: advisorId,
        estado: 'pendiente'
      },
      order: [['fecha_reunion', 'ASC'], ['hora_inicio', 'ASC']]
    });
    res.json({ success: true, meetings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo reuniones pendientes',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};
// Aceptar solicitud de asesoría de tesis
export const acceptAdvisorRequest = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    const { id } = req.params;
    // Verificar que la tesis existe, está pendiente y pertenece al asesor
    const [tesisRows] = await sequelize.query(
      `SELECT * FROM tesispretesis WHERE id_tesis = ? AND id_asesor = ? AND estado = 'pendiente'`,
      { replacements: [id, advisorId] }
    );
    const tesis = (tesisRows as any[])[0];
    if (!tesis) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada o no autorizada' });
    }
    // Actualizar estado a 'en_proceso'
    await sequelize.query(
      `UPDATE tesispretesis SET estado = 'en_proceso', fecha_modificacion = NOW() WHERE id_tesis = ?`,
      { replacements: [id] }
    );
    // Notificar al estudiante (puedes mejorar esto con tu sistema de notificaciones)
    // ...
    res.json({ success: true, message: 'Solicitud aceptada correctamente' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al aceptar la solicitud',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};

// Rechazar solicitud de asesoría de tesis
export const rejectAdvisorRequest = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    const { id } = req.params;
    // Verificar que la tesis existe, está pendiente y pertenece al asesor
    const [tesisRows] = await sequelize.query(
      `SELECT * FROM tesispretesis WHERE id_tesis = ? AND id_asesor = ? AND estado = 'pendiente'`,
      { replacements: [id, advisorId] }
    );
    const tesis = (tesisRows as any[])[0];
    if (!tesis) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada o no autorizada' });
    }
    // Actualizar estado a 'rechazado'
    await sequelize.query(
      `UPDATE tesispretesis SET estado = 'rechazado', fecha_modificacion = NOW() WHERE id_tesis = ?`,
      { replacements: [id] }
    );
    // Notificar al estudiante (puedes mejorar esto con tu sistema de notificaciones)
    // ...
    res.json({ success: true, message: 'Solicitud rechazada correctamente' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al rechazar la solicitud',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};
import { Request, Response } from 'express';
import sequelize from '../config/database';

// Listar solicitudes de asesoría pendientes para el asesor autenticado
export const getPendingAdvisorRequests = async (req: Request, res: Response) => {
  try {
    const advisorId = (req as any).user?.id;
    // Suponiendo que la tabla "tesis" tiene un campo id_asesor y estado_solicitud
    // y que estado_solicitud = 'pendiente' significa que está esperando aceptación
    const query = `
      SELECT t.id_tesis, t.titulo, t.descripcion, t.estado_solicitud, t.fecha_solicitud, u.id_usuario, u.nombre, u.apellido, u.email
      FROM tesis t
      JOIN usuario u ON t.id_estudiante = u.id_usuario
      WHERE t.id_asesor = ? AND t.estado_solicitud = 'pendiente'
      ORDER BY t.fecha_solicitud DESC
    `;
    const [results] = await sequelize.query(query, { replacements: [advisorId] });
    res.json({
      success: true,
      requests: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo solicitudes pendientes',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : 'Error interno'
    });
  }
};
