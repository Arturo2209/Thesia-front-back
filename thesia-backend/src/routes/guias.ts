import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { authenticateToken } from '../middleware/auth';
import Guia from '../models/Guia';
import User from '../models/User';
import Tesis from '../models/Tesis';

const router = express.Router();

// 🔧 SOLUCIÓN PARA __dirname EN ES MODULES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para subida de guías
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/guides');
    
    console.log('📁 Creando directorio para guías:', uploadPath);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('✅ Directorio creado:', uploadPath);
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uploadPath = path.join(__dirname, '../../uploads/guides');
    const fullPath = path.join(uploadPath, cleanName);
    
    if (fs.existsSync(fullPath)) {
      const extension = path.extname(cleanName);
      const nameWithoutExt = path.basename(cleanName, extension);
      const timestamp = Date.now();
      const uniqueName = `${nameWithoutExt}_${timestamp}${extension}`;
      cb(null, uniqueName);
    } else {
      cb(null, cleanName);
    }
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, DOC y DOCX'));
    }
  }
});

// 📚 GET /api/guides/my - Obtener guías disponibles para el estudiante
router.get('/my', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    console.log('📚 === OBTENIENDO GUÍAS PARA ESTUDIANTE ===', userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // ✅ Buscar la tesis del estudiante para obtener su asesor
    const tesis = await Tesis.findOne({
      where: { id_usuario_estudiante: userId }
    });

    if (!tesis) {
      return res.json({
        success: true,
        message: 'No tienes una tesis asignada aún',
        guides: []
      });
    }

    console.log('✅ Tesis encontrada:', tesis.id_tesis, 'Asesor:', tesis.id_asesor);

    // Verificar si tiene asesor asignado
    if (!tesis.id_asesor) {
      return res.json({
        success: true,
        message: 'Tu tesis no tiene un asesor asignado aún',
        guides: []
      });
    }

    // Obtener guías activas del asesor
    const guias = await Guia.findAll({
      where: {
        id_asesor: tesis.id_asesor, // ✅ CAMPO CORRECTO
        activo: true
      },
      order: [['fecha_creacion', 'DESC']]
    });

    console.log('📚 Guías encontradas:', guias.length);

    // Mapear guías al formato esperado por el frontend
    const mappedGuides = guias.map(guia => ({
      id: guia.id_guia,
      fileName: guia.nombre_archivo,
      title: guia.nombre_archivo,
      description: guia.descripcion || 'Guía de apoyo para tu tesis',
      phase: guia.fase_aplicable || 'general',
      uploadDate: guia.fecha_creacion.toISOString(),
      uploadedBy: 'Tu asesor'
    }));

    res.json({
      success: true,
      message: `${mappedGuides.length} guía(s) disponible(s)`,
      guides: mappedGuides
    });

  } catch (error) {
    console.error('❌ Error obteniendo guías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      guides: []
    });
  }
});

// 📥 GET /api/guides/:id/download - Descargar guía
router.get('/:id/download', authenticateToken, async (req: Request, res: Response) => {
  try {
    const guiaId = parseInt(req.params.id);
    const userId = (req as any).user?.id;

    console.log('📥 === DESCARGANDO GUÍA ===', guiaId);

    const guia = await Guia.findByPk(guiaId);

    if (!guia || !guia.activo) {
      return res.status(404).json({
        success: false,
        message: 'Guía no encontrada'
      });
    }

    // ✅ Verificar que el estudiante tenga acceso (es de su asesor)
    const tesis = await Tesis.findOne({
      where: { 
        id_usuario_estudiante: userId,
        id_asesor: guia.id_asesor // ✅ CAMPO CORRECTO
      }
    });

    if (!tesis) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para descargar esta guía'
      });
    }

    const filePath = guia.url_archivo;
    
    if (!fs.existsSync(filePath)) {
      console.log('❌ Archivo no existe en:', filePath);
      return res.status(404).json({
        success: false,
        message: 'Archivo de guía no encontrado'
      });
    }

    console.log('✅ Enviando guía:', filePath);

    res.setHeader('Content-Disposition', `attachment; filename="${guia.nombre_archivo}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(path.resolve(filePath));

  } catch (error) {
    console.error('❌ Error descargando guía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 📤 POST /api/guides/upload - Subir nueva guía (solo asesores)
router.post('/upload', authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.rol;
    const { description, phase } = req.body;

    console.log('📤 === ASESOR SUBIENDO GUÍA ===');
    console.log('Usuario ID:', userId, 'Rol:', userRole);

    // Verificar que sea asesor
    if (userRole !== 'asesor') {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({
        success: false,
        message: 'Solo los asesores pueden subir guías'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo'
      });
    }

    // Crear la guía en la base de datos
    const guia = await Guia.create({
      id_asesor: userId,
      nombre_archivo: req.file.filename,
      url_archivo: req.file.path,
      descripcion: description || null,
      fase_aplicable: phase || null,
      activo: true
    });

    console.log('✅ Guía creada:', guia.id_guia);

    res.json({
      success: true,
      message: 'Guía subida exitosamente',
      guide: {
        id: guia.id_guia,
        fileName: guia.nombre_archivo,
        description: guia.descripcion,
        phase: guia.fase_aplicable,
        uploadDate: guia.fecha_creacion.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error subiendo guía:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 📋 GET /api/guides/uploaded - Obtener guías subidas por el asesor
router.get('/uploaded', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.rol;

    console.log('📋 === OBTENIENDO GUÍAS SUBIDAS POR ASESOR ===', userId);

    // Verificar que sea asesor
    if (userRole !== 'asesor') {
      return res.status(403).json({
        success: false,
        message: 'Solo los asesores pueden ver esta información'
      });
    }

    // Obtener todas las guías del asesor
    const guias = await Guia.findAll({
      where: {
        id_asesor: userId
      },
      order: [['fecha_creacion', 'DESC']]
    });

    console.log('📚 Guías subidas encontradas:', guias.length);

    // Mapear guías al formato esperado
    const mappedGuides = guias.map(guia => ({
      id: guia.id_guia,
      fileName: guia.nombre_archivo,
      description: guia.descripcion,
      phase: guia.fase_aplicable,
      uploadDate: guia.fecha_creacion.toISOString(),
      active: guia.activo
    }));

    res.json({
      success: true,
      message: `${mappedGuides.length} guía(s) encontrada(s)`,
      guides: mappedGuides
    });

  } catch (error) {
    console.error('❌ Error obteniendo guías subidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 🗑️ DELETE /api/guides/:id - Eliminar guía (solo asesores)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const guiaId = parseInt(req.params.id);
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.rol;

    console.log('🗑️ === ELIMINANDO GUÍA ===', guiaId);

    // Verificar que sea asesor
    if (userRole !== 'asesor') {
      return res.status(403).json({
        success: false,
        message: 'Solo los asesores pueden eliminar guías'
      });
    }

    // Buscar la guía
    const guia = await Guia.findByPk(guiaId);

    if (!guia) {
      return res.status(404).json({
        success: false,
        message: 'Guía no encontrada'
      });
    }

    // Verificar que la guía pertenece al asesor
    if (guia.id_asesor !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No puedes eliminar guías de otros asesores'
      });
    }

    // Eliminar archivo físico
    if (fs.existsSync(guia.url_archivo)) {
      fs.unlinkSync(guia.url_archivo);
    }

    // Eliminar registro de la base de datos
    await guia.destroy();

    console.log('✅ Guía eliminada:', guiaId);

    res.json({
      success: true,
      message: 'Guía eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando guía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 🔄 PUT /api/guides/:id/toggle - Activar/desactivar guía
router.put('/:id/toggle', authenticateToken, async (req: Request, res: Response) => {
  try {
    const guiaId = parseInt(req.params.id);
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.rol;
    const { active } = req.body;

    console.log('🔄 === CAMBIANDO ESTADO DE GUÍA ===', guiaId, active);

    // Verificar que sea asesor
    if (userRole !== 'asesor') {
      return res.status(403).json({
        success: false,
        message: 'Solo los asesores pueden cambiar el estado de las guías'
      });
    }

    // Buscar la guía
    const guia = await Guia.findByPk(guiaId);

    if (!guia) {
      return res.status(404).json({
        success: false,
        message: 'Guía no encontrada'
      });
    }

    // Verificar que la guía pertenece al asesor
    if (guia.id_asesor !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No puedes modificar guías de otros asesores'
      });
    }

    // Actualizar estado
    guia.activo = active;
    await guia.save();

    console.log('✅ Estado de guía cambiado:', guiaId, active);

    res.json({
      success: true,
      message: `Guía ${active ? 'activada' : 'desactivada'} exitosamente`
    });

  } catch (error) {
    console.error('❌ Error cambiando estado de guía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;