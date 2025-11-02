import { Request, Response } from 'express';
import LogActividad from '../models/LogActividad';
import { body, validationResult } from 'express-validator';
import sequelize from '../config/database';

// Si tienes el modelo Reunion, impórtalo aquí
// import Reunion from '../models/Reunion';

// Crear reunión (ejemplo básico)
export const createReunion = async (req: Request, res: Response) => {
	try {
		// Supón que recibes los datos por req.body
		const {
			id_tesis,
			fecha_reunion,
			hora_inicio,
			hora_fin,
			enlace,
			ubicacion,
			estado = 'pendiente',
			id_asesor,
			id_estudiante,
			agenda,
			comentarios,
			duracion_minutos = 60,
		} = req.body;

		// Aquí deberías crear la reunión en la base de datos
		// const reunion = await Reunion.create({ ... });
		// Para ejemplo, simula un objeto creado:
		const reunion = {
			id_reunion: Math.floor(Math.random() * 10000),
			id_tesis,
			fecha_reunion,
			hora_inicio,
			hora_fin,
			enlace,
			ubicacion,
			estado,
			id_asesor,
			id_estudiante,
			agenda,
			comentarios,
			duracion_minutos,
		};

		// Registrar en bitácora
		await LogActividad.create({
			usuario_id: req.user?.id || 0,
			accion: 'CREAR_REUNION',
			entidad: 'Reunion',
			detalle: `Reunión creada: ${fecha_reunion} ${hora_inicio} (ID: ${reunion.id_reunion})`,
		});

		return res.status(201).json({ success: true, reunion });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al crear reunión', error });
	}
};

// Obtener reuniones por tesis
export const getReunionesByTesis = async (req: Request, res: Response) => {
	try {
		const { id_tesis } = req.params;
		// const reuniones: Reunion[] = await Reunion.findAll({ where: { id_tesis } });
		// Para ejemplo, simula un array vacío:
		const reuniones: any[] = [];
		return res.json({ success: true, reuniones });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al obtener reuniones', error });
	}
};

export const validateCreateReunion = [
  body('id_tesis').isInt().withMessage('id_tesis debe ser un número entero'),
  body('fecha_reunion').isISO8601().withMessage('fecha_reunion debe ser una fecha válida'),
  body('hora_inicio').isString().notEmpty().withMessage('hora_inicio es requerida'),
  body('hora_fin').isString().notEmpty().withMessage('hora_fin es requerida'),
  body('estado').optional().isIn(['pendiente', 'realizada', 'cancelada']),
  body('id_asesor').isInt().withMessage('id_asesor debe ser un número entero'),
  body('id_estudiante').isInt().withMessage('id_estudiante debe ser un número entero'),
  body('agenda').optional().isString(),
  body('comentarios').optional().isString(),
  body('duracion_minutos').optional().isInt({ min: 1 }),
  (req: Request, res: Response, next: () => void) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Obtener reuniones pendientes para el usuario autenticado
export const getPendingMeetings = async (req: Request, res: Response) => {
  try {
    console.log('🔍 === INICIO getPendingMeetings ===');
    const userId = req.user?.id;

    console.log('👤 Usuario autenticado:', {
      id: userId,
      email: req.user?.email,
      role: req.user?.role
    });

    // Obtener reuniones pendientes según el rol
    const isAdvisor = req.user?.role === 'asesor';
    
    const query = `
      SELECT 
        r.id_reunion,
        r.fecha_reunion,
        r.hora_inicio,
        r.hora_fin,
        r.estado,
        r.agenda as tema,
        u.nombre as nombre_estudiante,
        u.apellido as apellido_estudiante,
        t.titulo as titulo_tesis
      FROM reunion r
      JOIN usuario u ON r.id_estudiante = u.id_usuario
      JOIN tesispretesis t ON r.id_tesis = t.id_tesis
      WHERE r.estado = 'pendiente'
      AND ${isAdvisor ? 'r.id_asesor = ?' : 'r.id_estudiante = ?'}
      ORDER BY r.fecha_reunion ASC, r.hora_inicio ASC
    `;

    console.log('📝 Ejecutando consulta para reuniones pendientes...');
    const [results] = await sequelize.query(query, {
      replacements: [userId]
    });

    console.log(`✅ Encontradas ${results.length} reuniones pendientes`);

    res.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error('❌ Error en getPendingMeetings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo reuniones pendientes' 
    });
  }
};
