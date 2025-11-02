import { Router } from 'express';
import { authenticateToken, requireAdvisor } from '../middleware/auth';
import { getAssignedStudents } from '../controllers/assignedStudentsController';
import { 
  getPendingAdvisorRequests, 
  acceptAdvisorRequest, 
  rejectAdvisorRequest,
  getPendingAdvisorMeetings,
  acceptAdvisorMeeting,
  rejectAdvisorMeeting,
  getPendingAdvisorProgress,
  acceptAdvisorProgress,
  rejectAdvisorProgress,
  commentAdvisorProgress 
} from '../controllers/advisorController';

const router = Router();

// Configuración global
router.use(authenticateToken);
router.use(requireAdvisor);

// Middleware de logging para debugging
router.use((req, res, next) => {
  console.log('🎯 Ruta solicitada:', req.path);
  console.log('👤 Usuario:', req.user?.email);
  next();
});

// GET /api/advisor/requests - Listar solicitudes de asesoría pendientes para el asesor autenticado
router.get('/requests', authenticateToken, getPendingAdvisorRequests);

// PUT /api/advisor/requests/:id/accept - Aceptar solicitud de asesoría
router.put('/requests/:id/accept', authenticateToken, acceptAdvisorRequest);

// 1. Rutas sin parámetros (deben ir PRIMERO)
router.get('/assigned-students', getAssignedStudents);
router.get('/meetings/requests', getPendingAdvisorMeetings);
router.get('/progress/requests', getPendingAdvisorProgress);
router.get('/requests', getPendingAdvisorRequests);

// 2. Rutas con parámetros (van DESPUÉS)
router.put('/meetings/:id/accept', acceptAdvisorMeeting);
router.put('/meetings/:id/reject', rejectAdvisorMeeting);
router.put('/progress/:id/accept', acceptAdvisorProgress);
router.put('/progress/:id/reject', rejectAdvisorProgress);
router.put('/progress/:id/comment', commentAdvisorProgress);
router.put('/requests/:id/accept', acceptAdvisorRequest);
router.put('/requests/:id/reject', rejectAdvisorRequest);

export default router;
