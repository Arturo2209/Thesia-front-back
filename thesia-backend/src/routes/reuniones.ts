import { Router } from 'express';
import { param, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { createReunion, getReunionesByTesis, validateCreateReunion, getPendingMeetings } from '../controllers/reunionController';

const router = Router();

// Endpoint: Crear reunión con validación
router.post('/create', authenticateToken, validateCreateReunion, createReunion);

// Endpoint: Obtener reuniones por tesis
router.get('/tesis/:id_tesis',
	authenticateToken,
	param('id_tesis').isInt({ min: 1 }).withMessage('ID de tesis inválido'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array(), message: 'Parámetro id_tesis inválido' });
		}
		next();
	},
	getReunionesByTesis
);

// Endpoint: Obtener reuniones pendientes del usuario autenticado
router.get('/pendientes', authenticateToken, getPendingMeetings);

export default router;
