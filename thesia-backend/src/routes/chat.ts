import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getChatMessages, sendMessage } from '../controllers/chatController';
import { chatUpload } from '../middleware/upload';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/chat/messages - Obtener mensajes
router.get('/messages', getChatMessages);

// POST /api/chat/send - Enviar mensaje
// soporta texto (JSON) y archivos (multipart/form-data)
router.post('/send', chatUpload.single('file'), sendMessage);

export default router;