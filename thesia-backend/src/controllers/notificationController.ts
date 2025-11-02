import { Request, Response } from 'express';
import LogActividad from '../models/LogActividad';
// Si tienes el modelo Notificacion, impórtalo aquí
// import Notificacion from '../models/Notificacion';
import { body, validationResult } from 'express-validator';

// Crear notificación (ejemplo básico)
export const createNotification = async (req: Request, res: Response) => {
	try {
		// Supón que recibes los datos por req.body
		const {
			id_usuario,
			mensaje,
			tipo,
			id_referencia,
			tipo_referencia,
			prioridad = 'media',
		} = req.body;

		// Aquí deberías crear la notificación en la base de datos
		// const notificacion = await Notificacion.create({ ... });
		// Para ejemplo, simula un objeto creado:
		const notificacion = {
			id_notificacion: Math.floor(Math.random() * 10000),
			id_usuario,
			mensaje,
			tipo,
			id_referencia,
			tipo_referencia,
			prioridad,
		};

		// Registrar en bitácora
		await LogActividad.create({
			usuario_id: req.user?.id || 0,
			accion: 'CREAR_NOTIFICACION',
			entidad: 'Notificacion',
			detalle: `Notificación creada para usuario ${id_usuario} (ID: ${notificacion.id_notificacion})`,
		});

		return res.status(201).json({ success: true, notificacion });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al crear notificación', error });
	}
};

// Obtener notificaciones por usuario
export const getNotificationsByUser = async (req: Request, res: Response) => {
	try {
		const { id_usuario } = req.params;
		// const notificaciones = await Notificacion.findAll({ where: { id_usuario } });
		// Para ejemplo, simula un array vacío:
		const notificaciones: any[] = [];
		return res.json({ success: true, notificaciones });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al obtener notificaciones', error });
	}
};

export const validateCreateNotification = [
	body('id_usuario').isInt().withMessage('id_usuario debe ser un número entero'),
	body('mensaje').isString().notEmpty().withMessage('El mensaje es requerido'),
	body('tipo').isString().notEmpty().withMessage('El tipo es requerido'),
	body('prioridad').optional().isIn(['baja', 'media', 'alta']),
	body('id_referencia').optional().isInt(),
	body('tipo_referencia').optional().isString(),
	(req: Request, res: Response, next: () => void) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}
		next();
	},
];
