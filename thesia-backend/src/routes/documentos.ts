import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize'; // ✅ AGREGAR IMPORT PARA FILTROS
import Documento from '../models/Documento';
import Tesis from '../models/Tesis';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 🔧 SOLUCIÓN PARA __dirname EN ES MODULES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/documents');
    
    console.log('📁 Creando directorio:', uploadPath);
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('✅ Directorio creado:', uploadPath);
    } else {
      console.log('📁 Directorio ya existe:', uploadPath);
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Limpiar nombre original
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    console.log('📝 Nombre archivo limpio:', cleanName);
    
    // Verificar si ya existe
    const uploadPath = path.join(__dirname, '../../uploads/documents');
    const fullPath = path.join(uploadPath, cleanName);
    
    if (fs.existsSync(fullPath)) {
      // Si existe, agregar timestamp solo al final del nombre (antes de la extensión)
      const extension = path.extname(cleanName);
      const nameWithoutExt = path.basename(cleanName, extension);
      const timestamp = Date.now();
      const uniqueName = `${nameWithoutExt}_${timestamp}${extension}`;
      
      console.log('⚠️ Archivo ya existe, usando nombre único:', uniqueName);
      cb(null, uniqueName);
    } else {
      // Si no existe, usar nombre original limpio
      console.log('✅ Usando nombre original:', cleanName);
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
    console.log('🔍 Validando archivo:', {
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    console.log('📄 Extensión detectada:', fileExtension);
    
    if (allowedTypes.includes(fileExtension)) {
      console.log('✅ Archivo válido');
      cb(null, true);
    } else {
      console.log('❌ Archivo no válido');
      cb(new Error('Solo se permiten archivos PDF, DOC y DOCX'));
    }
  }
});

// ✅ NUEVA FUNCIÓN: Obtener fases disponibles para el usuario
async function getAvailablePhases(userId: number): Promise<string[]> {
  try {
    console.log('🔍 === VERIFICANDO FASES DISPONIBLES ===', userId);
    
    // Buscar la tesis del usuario
    const tesis = await Tesis.findOne({
      where: { id_usuario_estudiante: userId }
    });

    if (!tesis) {
      console.log('❌ No se encontró tesis para el usuario');
      return ['fase_1_plan_proyecto']; // Solo Fase 1 disponible
    }

    console.log('✅ Tesis encontrada:', tesis.id_tesis);

    // Buscar todos los documentos aprobados del usuario
    const documentosAprobados = await Documento.findAll({
      where: {
        id_tesis: tesis.id_tesis,
        estado: 'aprobado'
      },
      attributes: ['fase'],
      group: ['fase'] // Solo obtener fases únicas
    });

    const fasesAprobadas = documentosAprobados.map(doc => doc.fase);
    console.log('📋 Fases aprobadas (BD):', fasesAprobadas);

    // Determinar fases disponibles - LÓGICA PROGRESIVA
    const availablePhases = ['fase_1_plan_proyecto']; // Siempre disponible

    // Lógica progresiva: Cada fase se desbloquea cuando la anterior está aprobada
    if (fasesAprobadas.includes('propuesta')) {
      availablePhases.push('fase_2_diagnostico');
      console.log('✅ Fase 2 desbloqueada: propuesta aprobada');
    }
    if (fasesAprobadas.includes('avance1')) {
      availablePhases.push('fase_3_marco_teorico');
      console.log('✅ Fase 3 desbloqueada: avance1 aprobado');
    }
    if (fasesAprobadas.includes('avance2')) {
      availablePhases.push('fase_4_desarrollo');
      console.log('✅ Fase 4 desbloqueada: avance2 aprobado');
    }
    if (fasesAprobadas.includes('final')) {
      availablePhases.push('fase_5_resultados');
      console.log('✅ Fase 5 desbloqueada: final aprobado');
    }

    console.log('🎯 Fases disponibles calculadas:', availablePhases);
    return availablePhases;

  } catch (error) {
    console.error('❌ Error calculando fases disponibles:', error);
    return ['fase_1_plan_proyecto']; // Solo Fase 1 en caso de error
  }
}

// ✅ NUEVA RUTA: GET /api/documents/available-phases - Obtener fases disponibles
router.get('/available-phases', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    console.log('📋 === GET FASES DISPONIBLES ===', userId);

    const availablePhases = await getAvailablePhases(userId);

    // Info adicional para debug
    const tesis = await Tesis.findOne({
      where: { id_usuario_estudiante: userId }
    });

    let debugInfo = null;
    if (tesis) {
      const documentosAprobados = await Documento.findAll({
        where: {
          id_tesis: tesis.id_tesis,
          estado: 'aprobado'
        },
        attributes: ['fase', 'nombre_archivo', 'fecha_subida']
      });

      debugInfo = {
        tesisId: tesis.id_tesis,
        tesisTitle: tesis.titulo,
        approvedDocuments: documentosAprobados.map(doc => ({
          phase: doc.fase,
          fileName: doc.nombre_archivo,
          approvedDate: doc.fecha_subida
        }))
      };
    }

    res.json({
      success: true,
      availablePhases,
      message: `${availablePhases.length} fase(s) disponible(s)`,
      debugInfo
    });

  } catch (error) {
    console.error('❌ Error obteniendo fases disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      availablePhases: ['fase_1_plan_proyecto']
    });
  }
});

// 📋 GET /api/documents/my - Obtener documentos del estudiante CON FILTROS ✅ CORREGIDO
router.get('/my', authenticateToken, async (req: Request, res: Response) => {
  try {
    console.log('📄 === OBTENIENDO DOCUMENTOS DEL ESTUDIANTE ===');
    console.log('Usuario ID:', (req as any).user?.id);
    console.log('🔍 Query params recibidos:', req.query);
    
    const userId = (req as any).user?.id;
    
    // ✅ EXTRAER FILTROS DE QUERY PARAMS
    const { search, phase, status, startDate, endDate } = req.query;
    
    console.log('🔍 Filtros extraídos:', { search, phase, status, startDate, endDate });
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Buscar la tesis del estudiante
    const tesis = await Tesis.findOne({
      where: { id_usuario_estudiante: userId }
    });

    if (!tesis) {
      return res.json({
        success: true,
        message: 'No tienes una tesis registrada aún',
        documents: [],
        total: 0,
        page: 1,
        limit: 50
      });
    }

    console.log('✅ Tesis encontrada ID:', tesis.id_tesis);

    // ✅ CONSTRUIR FILTROS DINÁMICAMENTE
    const whereConditions: any = { 
      id_tesis: tesis.id_tesis  // Siempre filtrar por la tesis del usuario
    };

    // ✅ FILTRO POR BÚSQUEDA (nombre de archivo)
    if (search && typeof search === 'string' && search.trim()) {
      whereConditions.nombre_archivo = {
        [Op.like]: `%${search.trim()}%`
      };
      console.log('🔍 Aplicando filtro de búsqueda:', search.trim());
    }

    // ✅ FILTRO POR FASE
    if (phase && typeof phase === 'string' && phase !== 'all') {
      const dbPhase = mapPhaseToDatabase(phase);
      whereConditions.fase = dbPhase;
      console.log('📂 Aplicando filtro de fase:', phase, '→', dbPhase);
    }

    // ✅ FILTRO POR ESTADO
    if (status && typeof status === 'string' && status !== 'all') {
      whereConditions.estado = status; // ✅ Usar campo estado directamente
      console.log('📊 Aplicando filtro de estado:', status);
    }

    // ✅ FILTROS POR FECHA
    if (startDate && typeof startDate === 'string') {
      whereConditions.fecha_subida = {
        ...whereConditions.fecha_subida,
        [Op.gte]: new Date(startDate)
      };
      console.log('📅 Aplicando filtro fecha inicio:', startDate);
    }

    if (endDate && typeof endDate === 'string') {
      whereConditions.fecha_subida = {
        ...whereConditions.fecha_subida,
        [Op.lte]: new Date(endDate + ' 23:59:59')
      };
      console.log('📅 Aplicando filtro fecha fin:', endDate);
    }

    console.log('🔧 Condiciones WHERE finales:', whereConditions);

    // ✅ CONSULTA CON FILTROS APLICADOS
    const documentos = await Documento.findAll({
      where: whereConditions, // ✅ USAR FILTROS DINÁMICOS
      order: [['fecha_subida', 'DESC']]
    });

    console.log('📊 Documentos encontrados DESPUÉS de filtros:', documentos.length);

    // Mapear los documentos al formato esperado por el frontend
    const mappedDocuments = documentos.map(doc => {
      console.log('📄 Procesando documento:', {
        id: doc.id_documento,
        nombre: doc.nombre_archivo,
        fase: doc.fase,
        estado: doc.estado, // ✅ Usar campo estado
        validado: doc.validado_por_asesor
      });

      return {
        id: doc.id_documento,
        fileName: doc.nombre_archivo,
        originalFileName: doc.nombre_archivo,
        phase: mapPhaseToFrontend(doc.fase),
        status: mapStatusToFrontend(doc.estado),
        uploadDate: doc.fecha_subida ? doc.fecha_subida.toISOString() : new Date().toISOString(),
        fileSizeDisplay: formatFileSize(doc.tamaño_archivo || 0),
        fileSize: doc.tamaño_archivo || 0,
        fileType: doc.formato_archivo.toUpperCase(),
        chapterNumber: 1,
        description: doc.tipo_entrega,
        latestComment: null
      };
    });

    console.log('✅ Documentos mapeados:', mappedDocuments.length);
    console.log('📋 Resumen de documentos:', mappedDocuments.map(d => ({ 
      id: d.id, 
      name: d.originalFileName, 
      phase: d.phase, 
      status: d.status 
    })));

    res.json({
      success: true,
      message: 'Documentos obtenidos correctamente',
      documents: mappedDocuments,
      total: mappedDocuments.length,
      page: 1,
      limit: 50,
      // ✅ AGREGAR INFO DE DEBUG
      appliedFilters: {
        search: search || null,
        phase: phase || null,
        status: status || null,
        startDate: startDate || null,
        endDate: endDate || null
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo documentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 📤 POST /api/documents/upload - Subir documento CON VALIDACIÓN DE FASES ✅ MEJORADO
router.post('/upload', authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('📤 === SUBIENDO DOCUMENTO ===');
    console.log('Usuario ID:', (req as any).user?.id);
    console.log('Archivo recibido:', req.file?.filename);
    console.log('Datos del formulario:', req.body);
    
    const userId = (req as any).user?.id;
    const { phase, description, chapterNumber } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!req.file) {
      console.log('❌ No se recibió archivo');
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo'
      });
    }

    if (!phase) {
      return res.status(400).json({
        success: false,
        message: 'La fase es requerida'
      });
    }

    // ✅ VALIDAR QUE LA FASE ESTÉ DISPONIBLE
    console.log('🔍 Validando fase disponible:', phase);
    const availablePhases = await getAvailablePhases(userId);
    
    if (!availablePhases.includes(phase)) {
      console.log('❌ Fase no disponible:', phase);
      console.log('Fases disponibles:', availablePhases);
      
      // Eliminar archivo subido ya que no se puede procesar
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Archivo eliminado por fase no válida');
      }
      
      return res.status(400).json({
        success: false,
        message: 'No puedes subir documentos a esta fase aún. Completa y aprueba las fases anteriores primero.',
        availablePhases,
        currentPhase: phase,
        hint: 'Necesitas que el asesor apruebe la fase anterior para desbloquear la siguiente.'
      });
    }

    console.log('✅ Fase validada correctamente:', phase);

    console.log('🔍 Buscando tesis del usuario:', userId);

    // Buscar la tesis del estudiante
    const tesis = await Tesis.findOne({
      where: { id_usuario_estudiante: userId }
    });

    if (!tesis) {
      console.log('❌ No se encontró tesis para el usuario');
      
      // Eliminar archivo subido
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        message: 'No tienes una tesis registrada. Crea tu tesis primero.'
      });
    }

    console.log('✅ Tesis encontrada:', tesis.id_tesis);

    // 🔧 CORREGIDO: Crear el documento y hacer reload para obtener las fechas
    const documento = await Documento.create({
      id_tesis: tesis.id_tesis,
      nombre_archivo: req.file.filename,
      url_archivo: req.file.path,
      tipo_entrega: description || phase,
      formato_archivo: path.extname(req.file.originalname).toLowerCase() === '.pdf' ? 'pdf' : 'docx',
      fase: mapPhaseToDatabase(phase),
      tamaño_archivo: req.file.size,
      validado_por_asesor: false,
      estado: 'pendiente' // ✅ Estado inicial explícito
    });

    // 🔧 NUEVO: Hacer reload para obtener las fechas generadas por MySQL
    await documento.reload();

    console.log('✅ Documento creado en BD:', documento.id_documento);
    console.log('📅 Fecha subida:', documento.fecha_subida);
    console.log('📊 Estado inicial:', documento.estado);

    // 🔧 CORREGIDO: Usar fechas con verificación
    const fechaSubida = documento.fecha_subida || new Date();

    // Respuesta al frontend
    const responseDocument = {
      id: documento.id_documento,
      fileName: documento.nombre_archivo,
      originalFileName: req.file.originalname,
      phase: phase,
      status: 'pendiente',
      uploadDate: fechaSubida.toISOString(),
      fileSizeDisplay: formatFileSize(req.file.size),
      fileSize: req.file.size,
      fileType: documento.formato_archivo.toUpperCase(),
      chapterNumber: parseInt(chapterNumber) || 1,
      description: description || null
    };

    console.log('✅ Respuesta preparada:', responseDocument);

    res.json({
      success: true,
      message: 'Documento subido exitosamente',
      document: responseDocument
    });

  } catch (error) {
    console.error('❌ Error subiendo documento:', error);
    
    // Eliminar archivo si hubo error
    if (req.file && fs.existsSync(req.file.path)) {
      console.log('🗑️ Eliminando archivo por error:', req.file.path);
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// 📄 GET /api/documents/:id - Obtener detalles de un documento (🔧 CORREGIDO SIN INCLUDE)
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = (req as any).user?.id;

    console.log('📖 === OBTENIENDO DETALLE DEL DOCUMENTO ===');
    console.log('Document ID:', documentId);
    console.log('User ID:', userId);

    if (!documentId || isNaN(documentId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de documento inválido'
      });
    }

    // 🔧 PASO 1: Buscar documento SIN include (para evitar errores de asociación)
    const documento = await Documento.findByPk(documentId);

    if (!documento) {
      console.log('❌ Documento no encontrado con ID:', documentId);
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    console.log('✅ Documento encontrado:', {
      id: documento.id_documento,
      nombre: documento.nombre_archivo,
      id_tesis: documento.id_tesis,
      fase: documento.fase
    });

    // 🔧 PASO 2: Verificar permisos buscando la tesis por separado
    const tesis = await Tesis.findOne({
      where: { 
        id_tesis: documento.id_tesis,
        id_usuario_estudiante: userId 
      }
    });

    if (!tesis) {
      console.log('❌ Usuario no autorizado para este documento');
      console.log('Buscando tesis con ID:', documento.id_tesis, 'para usuario:', userId);
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este documento'
      });
    }

    console.log('✅ Permisos verificados. Tesis:', tesis.titulo);

    // 🔧 PASO 3: Preparar respuesta con verificación segura de fechas
    const fechaSubida = documento.fecha_subida || new Date();
    const fechaModificacion = documento.fecha_modificacion || fechaSubida;

    const documentDetail = {
      id: documento.id_documento,
      fileName: documento.nombre_archivo,
      originalFileName: documento.nombre_archivo,
      phase: mapPhaseToFrontend(documento.fase),
      status: mapStatusToFrontend(documento.estado),
      uploadDate: fechaSubida.toISOString(),
      lastModified: fechaModificacion.toISOString(),
      fileSizeDisplay: formatFileSize(documento.tamaño_archivo || 0),
      fileSize: documento.tamaño_archivo || 0,
      fileType: documento.formato_archivo.toUpperCase(),
      chapterNumber: 1,
      description: documento.tipo_entrega || 'Sin descripción',
      comments: []
    };

    console.log('✅ Respuesta preparada:', {
      id: documentDetail.id,
      fileName: documentDetail.fileName,
      phase: documentDetail.phase,
      status: documentDetail.status
    });

    res.json({
      success: true,
      message: 'Detalle del documento obtenido correctamente',
      document: documentDetail
    });

  } catch (error) {
    console.error('❌ ERROR COMPLETO EN GET DOCUMENTO:');
    console.error('Message:', error instanceof Error ? error.message : 'Error desconocido');
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack available');
    console.error('Error object:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : 
        'Error interno del servidor'
    });
  }
});

// 🧪 DEBUG: Endpoint para diagnosticar el problema
router.get('/:id/debug', authenticateToken, async (req: Request, res: Response) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = (req as any).user?.id;

    console.log('🧪 === DEBUG ENDPOINT INICIADO ===');
    console.log('Document ID solicitado:', documentId);
    console.log('User ID:', userId);
    
    // Contar documentos totales
    const totalDocumentos = await Documento.count();
    console.log('📊 Total documentos en BD:', totalDocumentos);
    
    if (totalDocumentos === 0) {
      return res.json({
        success: true,
        message: 'DEBUG: No hay documentos en la base de datos',
        debug: {
          totalDocuments: 0,
          documentExists: false,
          suggestion: 'Necesitas subir documentos primero'
        }
      });
    }

    // Verificar si existe el documento específico
    const documento = await Documento.findByPk(documentId);
    console.log('📄 Documento encontrado:', !!documento);
    
    if (!documento) {
      // Listar todos los documentos disponibles
      const todosLosDocumentos = await Documento.findAll({
        attributes: ['id_documento', 'nombre_archivo', 'id_tesis'],
        limit: 10
      });
      
      return res.json({
        success: true,
        message: 'DEBUG: Documento no encontrado',
        debug: {
          documentId,
          documentExists: false,
          totalDocuments: totalDocumentos,
          availableDocuments: todosLosDocumentos.map(doc => ({
            id: doc.id_documento,
            name: doc.nombre_archivo,
            tesisId: doc.id_tesis
          }))
        }
      });
    }

    // Si el documento existe, verificar la tesis
    console.log('📄 Info documento:', {
      id: documento.id_documento,
      nombre: documento.nombre_archivo,
      id_tesis: documento.id_tesis
    });

    const tesis = await Tesis.findByPk(documento.id_tesis);
    console.log('📚 Tesis encontrada:', !!tesis);

    res.json({
      success: true,
      message: 'DEBUG: Información completa',
      debug: {
        documentId,
        userId,
        documentExists: true,
        documento: {
          id: documento.id_documento,
          nombre: documento.nombre_archivo,
          id_tesis: documento.id_tesis,
          fase: documento.fase,
          validado: documento.validado_por_asesor
        },
        tesis: tesis ? {
          id: tesis.id_tesis,
          titulo: tesis.titulo,
          id_estudiante: tesis.id_usuario_estudiante,
          esDelUsuario: tesis.id_usuario_estudiante === userId
        } : null,
        permisos: tesis ? tesis.id_usuario_estudiante === userId : false
      }
    });

  } catch (error) {
    console.error('🧪 ERROR EN DEBUG:', error);
    res.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : 'No stack',
      type: error instanceof Error ? error.constructor.name : typeof error
    });
  }
});

// 📥 GET /api/documents/:id/download - Descargar documento (sin cambios)
router.get('/:id/download', authenticateToken, async (req: Request, res: Response) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = (req as any).user?.id;

    console.log('📥 === DESCARGANDO DOCUMENTO ===', documentId);

    // 🔧 CORREGIDO: Sin include para evitar errores
    const documento = await Documento.findByPk(documentId);

    if (!documento) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar permisos por separado
    const tesis = await Tesis.findOne({
      where: { 
        id_tesis: documento.id_tesis,
        id_usuario_estudiante: userId 
      }
    });

    if (!tesis) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para descargar este documento'
      });
    }

    const filePath = documento.url_archivo;
    
    if (!fs.existsSync(filePath)) {
      console.log('❌ Archivo no existe en:', filePath);
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado en el sistema'
      });
    }

    console.log('✅ Enviando archivo:', filePath);

    // Configurar headers para descarga
    res.setHeader('Content-Disposition', `attachment; filename="${documento.nombre_archivo}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Enviar archivo
    res.sendFile(path.resolve(filePath));

  } catch (error) {
    console.error('❌ Error descargando documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 🗑️ DELETE /api/documents/:id - Eliminar documento (✅ MEJORADO CON VALIDACIÓN DE ESTADO)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = (req as any).user?.id;

    console.log('🗑️ === ELIMINANDO DOCUMENTO ===', documentId);

    // 🔧 CORREGIDO: Sin include para evitar errores
    const documento = await Documento.findByPk(documentId);

    if (!documento) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar permisos por separado
    const tesis = await Tesis.findOne({
      where: { 
        id_tesis: documento.id_tesis,
        id_usuario_estudiante: userId 
      }
    });

    if (!tesis) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este documento'
      });
    }

    // ✅ VALIDACIÓN MEJORADA: Solo permitir eliminar documentos pendientes
    if (documento.estado !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden eliminar documentos con estado "Pendiente"',
        currentStatus: documento.estado
      });
    }

    // Eliminar archivo físico
    if (fs.existsSync(documento.url_archivo)) {
      console.log('🗑️ Eliminando archivo físico:', documento.url_archivo);
      fs.unlinkSync(documento.url_archivo);
    } else {
      console.log('⚠️ Archivo físico no encontrado:', documento.url_archivo);
    }

    // Eliminar registro de la base de datos
    await documento.destroy();

    console.log('✅ Documento eliminado correctamente');

    res.json({
      success: true,
      message: 'Documento eliminado correctamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 🔄 POST /api/documents/:id/resubmit - Resubir nueva versión de documento rechazado (sin cambios)
router.post('/:id/resubmit', authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = (req as any).user?.id;
    const { description } = req.body;

    console.log('🔄 === RESUBIENDO DOCUMENTO ===', documentId);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo'
      });
    }

    // 🔧 CORREGIDO: Sin include para evitar errores
    const documento = await Documento.findByPk(documentId);

    if (!documento) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar permisos por separado
    const tesis = await Tesis.findOne({
      where: { 
        id_tesis: documento.id_tesis,
        id_usuario_estudiante: userId 
      }
    });

    if (!tesis) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para resubir este documento'
      });
    }

    // Eliminar archivo anterior
    if (fs.existsSync(documento.url_archivo)) {
      fs.unlinkSync(documento.url_archivo);
    }

    // Actualizar el documento con el nuevo archivo
    await documento.update({
      nombre_archivo: req.file.filename,
      url_archivo: req.file.path,
      tipo_entrega: description || documento.tipo_entrega,
      formato_archivo: path.extname(req.file.originalname).toLowerCase() === '.pdf' ? 'pdf' : 'docx',
      tamaño_archivo: req.file.size,
      validado_por_asesor: false,
      estado: 'pendiente', // ✅ Resetear a pendiente
      version: (documento.version || 1) + 1
    });

    // 🔧 NUEVO: Hacer reload para obtener las fechas actualizadas
    await documento.reload();

    const fechaSubida = documento.fecha_subida || new Date();

    const responseDocument = {
      id: documento.id_documento,
      fileName: documento.nombre_archivo,
      originalFileName: req.file.originalname,
      phase: mapPhaseToFrontend(documento.fase),
      status: 'pendiente',
      uploadDate: fechaSubida.toISOString(),
      fileSizeDisplay: formatFileSize(req.file.size),
      fileSize: req.file.size,
      fileType: documento.formato_archivo.toUpperCase(),
      chapterNumber: 1,
      description: description || null
    };

    console.log('✅ Documento resubido exitosamente');

    res.json({
      success: true,
      message: 'Documento resubido exitosamente',
      document: responseDocument
    });

  } catch (error) {
    console.error('❌ Error resubiendo documento:', error);
    
    // Eliminar archivo si hubo error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// 📊 GET /api/documents/stats - Estadísticas de documentos (sin cambios)
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    console.log('📊 === OBTENIENDO ESTADÍSTICAS ===');

    const tesis = await Tesis.findOne({
      where: { id_usuario_estudiante: userId }
    });

    if (!tesis) {
      return res.json({
        success: true,
        message: 'Estadísticas obtenidas',
        stats: {
          total: 0,
          byStatus: { pendiente: 0, en_revision: 0, aprobado: 0, rechazado: 0 },
          byPhase: { fase_1_plan_proyecto: 0, fase_2_diagnostico: 0, fase_3_marco_teorico: 0, fase_4_desarrollo: 0, fase_5_resultados: 0 },
          recentUploads: 0,
          pendingReviews: 0
        }
      });
    }

    // Obtener conteos reales usando el campo estado
    const total = await Documento.count({
      where: { id_tesis: tesis.id_tesis }
    });

    const aprobados = await Documento.count({
      where: { 
        id_tesis: tesis.id_tesis,
        estado: 'aprobado'
      }
    });

    const pendientes = await Documento.count({
      where: { 
        id_tesis: tesis.id_tesis,
        estado: 'pendiente'
      }
    });

    const enRevision = await Documento.count({
      where: { 
        id_tesis: tesis.id_tesis,
        estado: 'en_revision'
      }
    });

    const rechazados = await Documento.count({
      where: { 
        id_tesis: tesis.id_tesis,
        estado: 'rechazado'
      }
    });

    // Conteos por fase
    const porFase = await Promise.all([
      Documento.count({ where: { id_tesis: tesis.id_tesis, fase: 'propuesta' } }),
      Documento.count({ where: { id_tesis: tesis.id_tesis, fase: 'avance1' } }),
      Documento.count({ where: { id_tesis: tesis.id_tesis, fase: 'avance2' } }),
      Documento.count({ where: { id_tesis: tesis.id_tesis, fase: 'final' } })
    ]);

    const stats = {
      total,
      byStatus: { 
        pendiente: pendientes, 
        en_revision: enRevision, 
        aprobado: aprobados, 
        rechazado: rechazados 
      },
      byPhase: { 
        fase_1_plan_proyecto: porFase[0], 
        fase_2_diagnostico: porFase[1], 
        fase_3_marco_teorico: porFase[2], 
        fase_4_desarrollo: porFase[3], 
        fase_5_resultados: 0 
      },
      recentUploads: total,
      pendingReviews: pendientes + enRevision
    };

    console.log('✅ Estadísticas calculadas:', stats);

    res.json({
      success: true,
      message: 'Estadísticas obtenidas',
      stats
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// === FUNCIONES HELPER ===
function mapPhaseToFrontend(dbPhase: string): string {
  const mapping: Record<string, string> = {
    'propuesta': 'fase_1_plan_proyecto',
    'avance1': 'fase_2_diagnostico',
    'avance2': 'fase_3_marco_teorico',
    'final': 'fase_4_desarrollo'
  };
  return mapping[dbPhase] || dbPhase;
}

function mapPhaseToDatabase(frontendPhase: string): 'propuesta' | 'avance1' | 'avance2' | 'final' {
  const mapping: Record<string, 'propuesta' | 'avance1' | 'avance2' | 'final'> = {
    'fase_1_plan_proyecto': 'propuesta',
    'fase_2_diagnostico': 'avance1',
    'fase_3_marco_teorico': 'avance2',
    'fase_4_desarrollo': 'final',
    'fase_5_resultados': 'final'
  };
  return mapping[frontendPhase] || 'propuesta';
}

function mapStatusToFrontend(estado: string): string {
  // ✅ Usar directamente el campo estado
  return estado;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;