import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import sequelize from '../config/database';

const router = Router();

// 📅 OBTENER HORARIOS DISPONIBLES DE UN ASESOR ESPECÍFICO
router.get('/advisor/:advisorId', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { advisorId } = req.params;
    console.log('📅 Obteniendo horarios del asesor:', advisorId);

    // 🔍 OBTENER DISPONIBILIDAD BASE DEL ASESOR
    const availabilityQuery = `
      SELECT 
        d.id_disponibilidad,
        d.dia_semana,
        d.hora_inicio,
        d.hora_fin,
        d.modalidad,
        d.ubicacion,
        d.enlace_virtual,
        d.max_reuniones_por_dia,
        d.notas,
        u.nombre,
        u.apellido,
        u.especialidad
      FROM disponibilidadasesor d
      JOIN usuario u ON d.id_asesor = u.id_usuario
      WHERE d.id_asesor = ? AND d.activo = 1
      ORDER BY 
        FIELD(d.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'),
        d.hora_inicio
    `;

    const [availabilityResults] = await sequelize.query(availabilityQuery, {
      replacements: [advisorId]
    });
    const availabilityRows = availabilityResults as any[];

    if (availabilityRows.length === 0) {
      res.json({
        success: true,
        availability: [],
        message: 'El asesor no tiene horarios configurados'
      });
      return;
    }

    // 📊 AGRUPAR POR DÍA DE LA SEMANA
    const scheduleByDay = availabilityRows.reduce((acc: any, row: any) => {
      const day = row.dia_semana;
      if (!acc[day]) {
        acc[day] = [];
      }
      
      acc[day].push({
        id_disponibilidad: row.id_disponibilidad,
        hora_inicio: row.hora_inicio,
        hora_fin: row.hora_fin,
        modalidad: row.modalidad,
        ubicacion: row.ubicacion,
        enlace_virtual: row.enlace_virtual,
        max_reuniones_por_dia: row.max_reuniones_por_dia,
        notas: row.notas
      });
      
      return acc;
    }, {});

    console.log('✅ Horarios obtenidos:', {
      asesor: `${availabilityRows[0].nombre} ${availabilityRows[0].apellido}`,
      especialidad: availabilityRows[0].especialidad,
      dias_disponibles: Object.keys(scheduleByDay).length
    });

    res.json({
      success: true,
      advisor: {
        id: parseInt(advisorId),
        nombre: availabilityRows[0].nombre,
        apellido: availabilityRows[0].apellido,
        especialidad: availabilityRows[0].especialidad
      },
      availability: scheduleByDay,
      total_slots: availabilityRows.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo horarios del asesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

// 🗓️ OBTENER SLOTS DISPONIBLES PARA UNA FECHA ESPECÍFICA
router.get('/advisor/:advisorId/slots/:date', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { advisorId, date } = req.params;
    console.log('🗓️ Obteniendo slots disponibles:', { advisorId, date });

    // Validar formato de fecha
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido. Use YYYY-MM-DD'
      });
      return;
    }

    // Obtener día de la semana
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const dayOfWeek = dayNames[targetDate.getDay()];

    console.log('📅 Fecha procesada:', {
      fecha: date,
      dia_semana: dayOfWeek,
      es_fin_semana: dayOfWeek === 'domingo' || dayOfWeek === 'sabado'
    });

    // 🔍 OBTENER DISPONIBILIDAD PARA ESE DÍA
    const availabilityQuery = `
      SELECT 
        d.id_disponibilidad,
        d.hora_inicio,
        d.hora_fin,
        d.modalidad,
        d.ubicacion,
        d.max_reuniones_por_dia
      FROM disponibilidadasesor d
      WHERE d.id_asesor = ? 
        AND d.dia_semana = ? 
        AND d.activo = 1
      ORDER BY d.hora_inicio
    `;

    const [availabilityResults] = await sequelize.query(availabilityQuery, {
      replacements: [advisorId, dayOfWeek]
    });
    const availabilityRows = availabilityResults as any[];

    if (availabilityRows.length === 0) {
      res.json({
        success: true,
        available_slots: [],
        message: `El asesor no tiene disponibilidad los ${dayOfWeek}s`
      });
      return;
    }

    // 🚫 OBTENER SLOTS YA OCUPADOS PARA ESA FECHA
    const occupiedQuery = `
      SELECT 
        s.hora_inicio,
        s.hora_fin,
        s.estado,
        s.motivo
      FROM slots_ocupados s
      WHERE s.id_disponibilidad IN (${availabilityRows.map(() => '?').join(',')})
        AND s.fecha_especifica = ?
        AND s.estado IN ('reservado', 'ocupado')
    `;

    const occupiedParams = [...availabilityRows.map((row: any) => row.id_disponibilidad), date];
    
    const [occupiedResults] = await sequelize.query(occupiedQuery, {
      replacements: occupiedParams
    });
    const occupiedRows = occupiedResults as any[];

    // 🔄 GENERAR SLOTS DISPONIBLES (CADA 30 MINUTOS)
    const availableSlots: any[] = [];

    for (const availability of availabilityRows) {
      const startTime = new Date(`2000-01-01T${availability.hora_inicio}`);
      const endTime = new Date(`2000-01-01T${availability.hora_fin}`);

      while (startTime < endTime) {
        const slotStart = startTime.toTimeString().slice(0, 5);
        const slotEnd = new Date(startTime.getTime() + 30 * 60000).toTimeString().slice(0, 5);

        // Verificar si el slot está ocupado
        const isOccupied = occupiedRows.some((occupied: any) => {
          const occupiedStart = occupied.hora_inicio.slice(0, 5);
          const occupiedEnd = occupied.hora_fin.slice(0, 5);
          return slotStart >= occupiedStart && slotStart < occupiedEnd;
        });

        if (!isOccupied) {
          availableSlots.push({
            id_disponibilidad: availability.id_disponibilidad,
            hora_inicio: slotStart,
            hora_fin: slotEnd,
            modalidad: availability.modalidad,
            ubicacion: availability.ubicacion,
            available: true
          });
        }

        // Avanzar 30 minutos
        startTime.setTime(startTime.getTime() + 30 * 60000);
      }
    }

    console.log('✅ Slots procesados:', {
      total_disponibilidad: availabilityRows.length,
      slots_ocupados: occupiedRows.length,
      slots_disponibles: availableSlots.length
    });

    res.json({
      success: true,
      date: date,
      day_of_week: dayOfWeek,
      available_slots: availableSlots,
      occupied_slots: occupiedRows,
      total_available: availableSlots.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo slots disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

// 📝 RESERVAR UN SLOT (CREAR REUNIÓN CON NOTIFICACIONES) - VERSION CORREGIDA
router.post('/advisor/:advisorId/reserve', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { advisorId } = req.params;
    const { fecha, hora_inicio, hora_fin, modalidad, agenda } = req.body;
    const studentId = (req as any).user?.id;

    console.log('📝 Reservando slot:', {
      advisorId,
      studentId, 
      fecha,
      hora_inicio,
      hora_fin,
      modalidad
    });

    // Validaciones básicas
    if (!fecha || !hora_inicio || !hora_fin) {
      res.status(400).json({
        success: false,
        message: 'Fecha, hora de inicio y fin son requeridos'
      });
      return;
    }

    // 🔍 Obtener datos del estudiante
    const [studentResults] = await sequelize.query(
      'SELECT nombre, apellido FROM usuario WHERE id_usuario = ?',
      { replacements: [studentId] }
    );
    const studentRows = studentResults as any[];

    if (studentRows.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    const studentName = `${studentRows[0].nombre} ${studentRows[0].apellido}`;

    // 🔍 Obtener ID de tesis del estudiante (CORREGIDO: id_asesor en lugar de id_usuario_asesor)
    const [thesisResults] = await sequelize.query(
      'SELECT id_tesis, titulo FROM tesispretesis WHERE id_usuario_estudiante = ? AND id_asesor = ? ORDER BY fecha_creacion DESC LIMIT 1',
      { replacements: [studentId, advisorId] }
    );
    const thesisRows = thesisResults as any[];

    if (thesisRows.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No tienes una tesis registrada con este asesor para agendar reuniones'
      });
      return;
    }

    console.log('🎓 Tesis encontrada:', {
      id_tesis: thesisRows[0].id_tesis,
      titulo: thesisRows[0].titulo
    });

    // 🔍 Verificar que el slot esté disponible
    const verifySlotQuery = `
      SELECT COUNT(*) as ocupado
      FROM slots_ocupados s
      JOIN disponibilidadasesor d ON s.id_disponibilidad = d.id_disponibilidad
      WHERE d.id_asesor = ?
        AND s.fecha_especifica = ?
        AND ((s.hora_inicio <= ? AND s.hora_fin > ?) OR (s.hora_inicio < ? AND s.hora_fin >= ?))
        AND s.estado IN ('reservado', 'ocupado')
    `;

    const [verifyResults] = await sequelize.query(verifySlotQuery, {
      replacements: [advisorId, fecha, hora_inicio, hora_inicio, hora_fin, hora_fin]
    });
    const verifyRows = verifyResults as any[];

    if (verifyRows[0].ocupado > 0) {
      res.status(400).json({
        success: false,
        message: 'El horario seleccionado ya no está disponible'
      });
      return;
    }

    // 📝 CREAR REUNIÓN EN ESTADO PENDIENTE (VERSIÓN CORREGIDA)
    const createMeetingQuery = `
      INSERT INTO reunion (
        id_tesis, fecha_reunion, hora_inicio, hora_fin, 
        estado, id_asesor, id_estudiante, agenda
      ) VALUES (?, ?, ?, ?, 'pendiente', ?, ?, ?)
    `;

    const [meetingResults] = await sequelize.query(createMeetingQuery, {
      replacements: [
        thesisRows[0].id_tesis, 
        fecha, 
        hora_inicio, 
        hora_fin, 
        advisorId, 
        studentId, 
        agenda || 'Reunión de seguimiento de tesis'
      ]
    });

    // 🔧 EXTRAER insertId CORRECTAMENTE PARA MARIADB
    let meetingId: number;

    console.log('🔍 Tipo de meetingResults:', typeof meetingResults, Array.isArray(meetingResults));

    if (typeof meetingResults === 'number') {
    // Si el resultado es directamente el insertId (como en tu caso)
    meetingId = meetingResults;
    } else if (Array.isArray(meetingResults)) {
    // Para MariaDB/MySQL el resultado puede ser un array
    const resultInfo = meetingResults as any;
    meetingId = resultInfo.insertId || resultInfo[0]?.insertId;
    } else if (typeof meetingResults === 'object' && meetingResults !== null) {
    // Para casos donde es objeto con propiedad insertId
    meetingId = (meetingResults as any).insertId;
    } else {
    // Último recurso
    meetingId = meetingResults as any;
    }

    console.log('🆔 Meeting result completo:', meetingResults);
    console.log('🆔 Meeting ID extraído:', meetingId);

    // Verificar que meetingId sea válido
    if (!meetingId || isNaN(meetingId)) {
      console.error('❌ No se pudo obtener meetingId válido:', { meetingResults, meetingId });
      res.status(500).json({
        success: false,
        message: 'Error interno: No se pudo crear la reunión correctamente'
      });
      return;
    }

    // Obtener día de la semana
    const targetDate = new Date(fecha);
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const dayOfWeek = dayNames[targetDate.getDay()];

    console.log('🗓️ Datos para slot ocupado:', {
      fecha,
      hora_inicio,
      hora_fin,
      studentId,
      meetingId,
      advisorId,
      dayOfWeek
    });

    // ⚡ CREAR SLOT OCUPADO TEMPORAL
    const createSlotQuery = `
      INSERT INTO slots_ocupados (
        id_disponibilidad, fecha_especifica, hora_inicio, hora_fin,
        estado, id_estudiante, id_reunion, motivo
      ) SELECT 
        d.id_disponibilidad, ? as fecha_especifica, ? as hora_inicio, ? as hora_fin,
        'reservado' as estado, ? as id_estudiante, ? as id_reunion, 'Reunión pendiente de aprobación' as motivo
      FROM disponibilidadasesor d
      WHERE d.id_asesor = ? 
        AND d.dia_semana = ?
        AND d.hora_inicio <= ? 
        AND d.hora_fin >= ?
        AND d.activo = 1
      LIMIT 1
    `;

    await sequelize.query(createSlotQuery, {
      replacements: [fecha, hora_inicio, hora_fin, studentId, meetingId, advisorId, dayOfWeek, hora_inicio, hora_fin]
    });

    // 🔔 CREAR NOTIFICACIÓN PARA EL ASESOR
    const notificationMessage = `📅 Nueva solicitud de reunión de ${studentName} para el ${fecha} de ${hora_inicio} a ${hora_fin}. Tema: ${agenda || 'Reunión de seguimiento'}`;
    
    const createNotificationQuery = `
      INSERT INTO notificacion (
        id_usuario, mensaje, tipo, tipo_referencia, 
        id_referencia, prioridad
      ) VALUES (?, ?, 'reunion', 'reunion', ?, 'alta')
    `;

    await sequelize.query(createNotificationQuery, {
      replacements: [advisorId, notificationMessage, meetingId]
    });

    console.log('✅ Reunión y notificación creadas exitosamente:', {
      meeting_id: meetingId,
      fecha,
      hora_inicio,
      hora_fin,
      notificacion_enviada: true
    });

    res.json({
      success: true,
      message: 'Solicitud de reunión enviada exitosamente',
      meeting_id: meetingId,
      status: 'pendiente',
      details: {
        fecha,
        hora_inicio,
        hora_fin,
        modalidad,
        agenda: agenda || 'Reunión de seguimiento',
        asesor_notificado: true
      },
      next_steps: 'El asesor recibirá una notificación y deberá aprobar o rechazar la reunión'
    });

  } catch (error) {
    console.error('❌ Error reservando slot:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

// 📋 OBTENER REUNIONES PENDIENTES (PARA ASESORES)
router.get('/advisor/:advisorId/pending-meetings', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { advisorId } = req.params;
    console.log('📋 Obteniendo reuniones pendientes para asesor:', advisorId);

    const pendingMeetingsQuery = `
      SELECT 
        r.id_reunion,
        r.fecha_reunion,
        r.hora_inicio,
        r.hora_fin,
        r.agenda,
        r.estado,
        r.fecha_creacion,
        CONCAT(u.nombre, ' ', u.apellido) as estudiante_nombre,
        u.correo_institucional as estudiante_email,
        t.titulo as tesis_titulo,
        t.id_tesis
      FROM reunion r
      JOIN usuario u ON r.id_estudiante = u.id_usuario  
      JOIN tesispretesis t ON r.id_tesis = t.id_tesis
      WHERE r.id_asesor = ? 
        AND r.estado = 'pendiente'
        AND r.fecha_reunion >= CURDATE()
      ORDER BY r.fecha_reunion ASC, r.hora_inicio ASC
    `;

    const [results] = await sequelize.query(pendingMeetingsQuery, {
      replacements: [advisorId]
    });
    const meetings = results as any[];

    console.log('✅ Reuniones pendientes encontradas:', meetings.length);

    res.json({
      success: true,
      pending_meetings: meetings,
      total: meetings.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo reuniones pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

// ✅ APROBAR REUNIÓN
router.put('/meeting/:meetingId/approve', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { meetingId } = req.params;
    const { ubicacion, enlace, comentarios } = req.body;
    const advisorId = (req as any).user?.id;

    console.log('✅ Aprobando reunión:', meetingId);

    // Actualizar reunión a aceptada
    const updateMeetingQuery = `
      UPDATE reunion 
      SET estado = 'aceptada', 
          ubicacion = ?, 
          enlace = ?, 
          comentarios = ?
      WHERE id_reunion = ? AND id_asesor = ?
    `;

    await sequelize.query(updateMeetingQuery, {
      replacements: [ubicacion, enlace, comentarios, meetingId, advisorId]
    });

    // Actualizar slot a ocupado
    await sequelize.query(
      'UPDATE slots_ocupados SET estado = "ocupado", motivo = "Reunión confirmada" WHERE id_reunion = ?',
      { replacements: [meetingId] }
    );

    // Obtener datos para notificación al estudiante
    const [meetingData] = await sequelize.query(
      `SELECT r.id_estudiante, r.fecha_reunion, r.hora_inicio, 
              CONCAT(u_estudiante.nombre, ' ', u_estudiante.apellido) as estudiante_nombre,
              CONCAT(u_asesor.nombre, ' ', u_asesor.apellido) as asesor_nombre
       FROM reunion r 
       JOIN usuario u_estudiante ON r.id_estudiante = u_estudiante.id_usuario
       JOIN usuario u_asesor ON r.id_asesor = u_asesor.id_usuario  
       WHERE r.id_reunion = ?`,
      { replacements: [meetingId] }
    );
    const meeting = (meetingData as any[])[0];

    // Notificar al estudiante
    const studentNotification = `✅ Tu reunión del ${meeting.fecha_reunion} a las ${meeting.hora_inicio} fue APROBADA por ${meeting.asesor_nombre}. ${ubicacion ? `Ubicación: ${ubicacion}` : ''} ${enlace ? `Enlace: ${enlace}` : ''}`;
    
    await sequelize.query(
      'INSERT INTO notificacion (id_usuario, mensaje, tipo, tipo_referencia, id_referencia, prioridad) VALUES (?, ?, "reunion", "reunion", ?, "alta")',
      { replacements: [meeting.id_estudiante, studentNotification, meetingId] }
    );

    console.log('✅ Reunión aprobada y estudiante notificado');

    res.json({
      success: true,
      message: 'Reunión aprobada exitosamente',
      meeting_id: meetingId,
      student_notified: true
    });

  } catch (error) {
    console.error('❌ Error aprobando reunión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

// ❌ RECHAZAR REUNIÓN  
router.put('/meeting/:meetingId/reject', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { meetingId } = req.params;
    const { motivo } = req.body;
    const advisorId = (req as any).user?.id;

    console.log('❌ Rechazando reunión:', meetingId);

    // Actualizar reunión a rechazada
    await sequelize.query(
      'UPDATE reunion SET estado = "rechazada", comentarios = ? WHERE id_reunion = ? AND id_asesor = ?',
      { replacements: [motivo, meetingId, advisorId] }
    );

    // Liberar slot ocupado
    await sequelize.query(
      'DELETE FROM slots_ocupados WHERE id_reunion = ?',
      { replacements: [meetingId] }
    );

    // Obtener datos para notificación
    const [meetingData] = await sequelize.query(
      `SELECT r.id_estudiante, r.fecha_reunion, r.hora_inicio,
              CONCAT(u_asesor.nombre, ' ', u_asesor.apellido) as asesor_nombre
       FROM reunion r 
       JOIN usuario u_asesor ON r.id_asesor = u_asesor.id_usuario
       WHERE r.id_reunion = ?`,
      { replacements: [meetingId] }
    );
    const meeting = (meetingData as any[])[0];

    // Notificar al estudiante
    const studentNotification = `❌ Tu reunión del ${meeting.fecha_reunion} a las ${meeting.hora_inicio} fue RECHAZADA por ${meeting.asesor_nombre}. Motivo: ${motivo || 'No especificado'}. Puedes solicitar otro horario.`;
    
    await sequelize.query(
      'INSERT INTO notificacion (id_usuario, mensaje, tipo, tipo_referencia, id_referencia, prioridad) VALUES (?, ?, "reunion", "reunion", ?, "alta")',
      { replacements: [meeting.id_estudiante, studentNotification, meetingId] }
    );

    console.log('❌ Reunión rechazada y estudiante notificado');

    res.json({
      success: true,
      message: 'Reunión rechazada',
      meeting_id: meetingId,
      student_notified: true,
      slot_released: true
    });

  } catch (error) {
    console.error('❌ Error rechazando reunión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

// 📊 OBTENER REUNIONES DEL ESTUDIANTE
router.get('/student/my-meetings', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = (req as any).user?.id;
    console.log('📊 Obteniendo reuniones del estudiante:', studentId);

    const meetingsQuery = `
      SELECT 
        r.id_reunion,
        r.fecha_reunion,
        r.hora_inicio,
        r.hora_fin,
        r.agenda,
        r.estado,
        r.ubicacion,
        r.enlace,
        r.comentarios,
        r.fecha_creacion,
        CONCAT(u.nombre, ' ', u.apellido) as asesor_nombre,
        u.correo_institucional as asesor_email,
        t.titulo as tesis_titulo
      FROM reunion r
      JOIN usuario u ON r.id_asesor = u.id_usuario  
      JOIN tesispretesis t ON r.id_tesis = t.id_tesis
      WHERE r.id_estudiante = ?
        AND r.fecha_reunion >= CURDATE() - INTERVAL 30 DAY
      ORDER BY r.fecha_reunion DESC, r.hora_inicio DESC
    `;

    const [results] = await sequelize.query(meetingsQuery, {
      replacements: [studentId]
    });
    const meetings = results as any[];

    console.log('✅ Reuniones del estudiante encontradas:', meetings.length);

    res.json({
      success: true,
      meetings,
      total: meetings.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo reuniones del estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Error interno'
    });
  }
});

export default router;