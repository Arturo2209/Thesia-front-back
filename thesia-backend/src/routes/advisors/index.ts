import { Router } from 'express';
import { authenticateToken, requireAdvisor } from '../../middleware/auth';
import { getMyAdvisor } from '../../controllers/myAdvisorController';
import { getAssignedStudents } from '../../controllers/assignedStudentsController';
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
} from '../../controllers/advisorController';

const router = Router();

// Ruta pública (solo requiere autenticación)
router.use(authenticateToken);
router.get('/my-advisor', getMyAdvisor);

// Middleware para rutas protegidas de asesores
router.use(requireAdvisor);

// Rutas para estudiantes asignados
router.get('/assigned-students', getAssignedStudents);

// Rutas para solicitudes de asesoría
router.get('/requests', getPendingAdvisorRequests);
router.put('/requests/:id/accept', acceptAdvisorRequest);
router.put('/requests/:id/reject', rejectAdvisorRequest);

// Rutas para reuniones
router.get('/meetings/requests', getPendingAdvisorMeetings);
router.put('/meetings/:id/accept', acceptAdvisorMeeting);
router.put('/meetings/:id/reject', rejectAdvisorMeeting);

// Rutas para avances
router.get('/progress/requests', getPendingAdvisorProgress);
router.put('/progress/:id/accept', acceptAdvisorProgress);
router.put('/progress/:id/reject', rejectAdvisorProgress);
router.put('/progress/:id/comment', commentAdvisorProgress);

export default router;