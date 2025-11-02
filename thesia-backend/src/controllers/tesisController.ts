import { Request, Response } from 'express';
import LogActividad from '../models/LogActividad';
import { body, validationResult } from 'express-validator';

// Si tienes el modelo Tesis, impórtalo aquí
// import Tesis from '../models/Tesis';

// Crear tesis/pretesis (ejemplo básico)
export const createTesis = async (req: Request, res: Response) => {
	try {
		// Supón que recibes los datos por req.body
		const {
			id_usuario_estudiante,
			titulo,
			descripcion,
			estado = 'pendiente',
			fecha_limite,
			id_asesor,
			area,
			tipo = 'tesis',
			fase_actual = 'propuesta',
			progreso_porcentaje = 0,
		} = req.body;

		// Aquí deberías crear la tesis en la base de datos
		// const tesis = await Tesis.create({ ... });
		// Para ejemplo, simula un objeto creado:
		const tesis = {
			id_tesis: Math.floor(Math.random() * 10000),
			id_usuario_estudiante,
			titulo,
			descripcion,
			estado,
			fecha_limite,
			id_asesor,
			area,
			tipo,
			fase_actual,
			progreso_porcentaje,
		};

		// Registrar en bitácora
		await LogActividad.create({
			usuario_id: req.user?.id || 0,
			accion: 'CREAR_TESIS',
			entidad: 'Tesis',
			detalle: `Tesis creada: ${titulo} (ID: ${tesis.id_tesis})`,
		});

		return res.status(201).json({ success: true, tesis });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al crear tesis', error });
	}
};

// Obtener tesis por estudiante
export const getTesisByEstudiante = async (req: Request, res: Response) => {
	try {
		const { id_usuario_estudiante } = req.params;
		// const tesis = await Tesis.findAll({ where: { id_usuario_estudiante } });
		// Para ejemplo, simula un array vacío:
		const tesis: any[] = [];
		return res.json({ success: true, tesis });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al obtener tesis', error });
	}
};

export const validateCreateTesis = [
  body('id_usuario_estudiante').isInt().withMessage('id_usuario_estudiante debe ser un número entero'),
  body('titulo').isString().notEmpty().isLength({ min: 10 }).withMessage('El título es requerido y debe tener al menos 10 caracteres'),
  body('descripcion').isString().notEmpty().isLength({ min: 30 }).withMessage('La descripción es requerida y debe tener al menos 30 caracteres'),
  body('estado').optional().isIn(['pendiente', 'aprobado', 'rechazado']),
  body('fecha_limite').optional().isISO8601().withMessage('fecha_limite debe ser una fecha válida'),
  body('id_asesor').isInt().withMessage('id_asesor debe ser un número entero'),
  body('area').optional().isString(),
  body('tipo').optional().isIn(['tesis', 'pretesis']),
  body('fase_actual').optional().isString(),
  body('progreso_porcentaje').optional().isFloat({ min: 0, max: 100 }),
  (req: Request, res: Response, next: () => void) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
