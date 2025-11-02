import { Router } from 'express';
import { param, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { createUser, getUsersByRole, validateCreateUser } from '../controllers/userController';

const router = Router();

// Endpoint: Crear usuario con validación
router.post('/create', authenticateToken, validateCreateUser, createUser);

// Endpoint: Obtener usuarios por rol
router.get('/rol/:rol',
	authenticateToken,
	param('rol').isIn(['estudiante', 'asesor', 'admin']).withMessage('Rol no válido'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array(), message: 'Parámetro rol inválido' });
		}
		next();
	},
	getUsersByRole
);

export default router;
