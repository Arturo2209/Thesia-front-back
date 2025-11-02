import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getChatMessages, sendMessage } from '../controllers/chatController';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/chat/messages - Obtener mensajes
router.get('/messages', getChatMessages);

// POST /api/chat/send - Enviar mensaje
router.post('/send', sendMessage);

export default router;