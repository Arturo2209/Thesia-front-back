import { Request, Response } from 'express';
import LogActividad from '../models/LogActividad';
import { body, validationResult } from 'express-validator';

// Si tienes el modelo User, impórtalo aquí
// import User from '../models/User';

// Crear usuario (ejemplo básico)
export const createUser = async (req: Request, res: Response) => {
	try {
		// Supón que recibes los datos por req.body
		const {
			nombre,
			apellido,
			correo_institucional,
			contraseña,
			rol,
			especialidad,
			codigo_estudiante,
			ciclo_actual,
		} = req.body;

		// Aquí deberías crear el usuario en la base de datos
		// const usuario = await User.create({ ... });
		// Para ejemplo, simula un objeto creado:
		const usuario = {
			id_usuario: Math.floor(Math.random() * 10000),
			nombre,
			apellido,
			correo_institucional,
			rol,
			especialidad,
			codigo_estudiante,
			ciclo_actual,
		};

		// Registrar en bitácora
		await LogActividad.create({
			usuario_id: req.user?.id || 0,
			accion: 'CREAR_USUARIO',
			entidad: 'Usuario',
			detalle: `Usuario creado: ${correo_institucional} (ID: ${usuario.id_usuario})`,
		});

		return res.status(201).json({ success: true, usuario });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al crear usuario', error });
	}
};

// Obtener usuarios por rol
export const getUsersByRole = async (req: Request, res: Response) => {
	try {
		const { rol } = req.params;
		// const usuarios = await User.findAll({ where: { rol } });
		// Para ejemplo, simula un array vacío:
		const usuarios: any[] = [];
		return res.json({ success: true, usuarios });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al obtener usuarios', error });
	}
};

export const validateCreateUser = [
  body('nombre').isString().notEmpty().withMessage('El nombre es requerido'),
  body('apellido').isString().notEmpty().withMessage('El apellido es requerido'),
  body('correo_institucional').isEmail().withMessage('El correo institucional debe ser válido'),
  body('contraseña').isString().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['estudiante', 'asesor', 'admin']).withMessage('El rol debe ser estudiante, asesor o admin'),
  body('especialidad').optional().isString(),
  body('codigo_estudiante').optional().isString(),
  body('ciclo_actual').optional().isInt({ min: 1, max: 12 }),
  (req: Request, res: Response, next: () => void) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
