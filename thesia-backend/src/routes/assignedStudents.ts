import { Router } from 'express';
import { getAssignedStudents } from '../controllers/assignedStudentsController';
import { authenticateToken, requireAdvisor } from '../middleware/auth';

const router = Router();

// Middleware específico para rutas de asesor
router.use(authenticateToken);
router.use(requireAdvisor);

// GET /api/advisors/assigned-students - Estudiantes asignados al asesor autenticado
router.get('/', getAssignedStudents);

export default router;
