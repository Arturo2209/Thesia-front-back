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
import { getPendingReview } from '../controllers/documentController';
import Documento from '../models/Documento';
import Tesis from '../models/Tesis';
import sequelize from '../config/database';

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

// Nueva ruta para obtener documentos pendientes
router.get('/documents', getPendingReview);

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

// === Gestión de documentos (aprobación / rechazo / comentarios) ===
// PUT /api/advisor/documents/:id/approve - Aprobar documento
router.put('/documents/:id/approve', async (req, res) => {
  try {
    const docId = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    const documento = await Documento.findByPk(docId);
    if (!documento) return res.status(404).json({ success: false, message: 'Documento no encontrado' });

    const tesis = await Tesis.findByPk(documento.id_tesis);
    if (!tesis || tesis.id_asesor !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado para aprobar este documento' });
    }

    await documento.update({ estado: 'aprobado', validado_por_asesor: true });
    return res.json({ success: true, message: 'Documento aprobado' });
  } catch (error) {
    console.error('❌ Error aprobando documento:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// PUT /api/advisor/documents/:id/reject - Rechazar documento
router.put('/documents/:id/reject', async (req, res) => {
  try {
    const docId = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    const documento = await Documento.findByPk(docId);
    if (!documento) return res.status(404).json({ success: false, message: 'Documento no encontrado' });

    const tesis = await Tesis.findByPk(documento.id_tesis);
    if (!tesis || tesis.id_asesor !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado para rechazar este documento' });
    }

    await documento.update({ estado: 'rechazado', validado_por_asesor: false });
    return res.json({ success: true, message: 'Documento rechazado' });
  } catch (error) {
    console.error('❌ Error rechazando documento:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// PUT /api/advisor/documents/:id/comment - Agregar/actualizar comentario
router.put('/documents/:id/comment', async (req, res) => {
  try {
    const docId = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    const { comment } = req.body as { comment?: string };
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    const documento = await Documento.findByPk(docId);
    if (!documento) return res.status(404).json({ success: false, message: 'Documento no encontrado' });

    const tesis = await Tesis.findByPk(documento.id_tesis);
    if (!tesis || tesis.id_asesor !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado para comentar este documento' });
    }

    await documento.update({ comentarios: comment ?? null });
    return res.json({ success: true, message: 'Comentario agregado' });
  } catch (error) {
    console.error('❌ Error comentando documento:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// GET /api/advisor/documents/history - Historial de documentos revisados por el asesor
router.get('/documents/history', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    // Traer documentos de tesis donde el asesor es el dueño y que ya no están pendientes
    const query = `
      SELECT d.*, u.id_usuario AS id_estudiante, u.nombre AS estudiante_nombre, u.apellido AS estudiante_apellido
      FROM documento d
      JOIN tesispretesis t ON d.id_tesis = t.id_tesis
      JOIN usuario u ON u.id_usuario = t.id_usuario_estudiante
      WHERE t.id_asesor = ?
        AND (d.estado IN ('aprobado','rechazado','en_revision') OR d.validado_por_asesor = true)
      ORDER BY d.fecha_subida DESC
    `;

    const [rows] = await sequelize.query(query, { replacements: [userId] });
    const data = Array.isArray(rows) ? rows : [];

    return res.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('❌ Error obteniendo historial de documentos del asesor:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener historial de documentos' });
  }
});

export default router;
