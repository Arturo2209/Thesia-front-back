import Documento from '../models/Documento';
import LogActividad from '../models/LogActividad';
import Tesis from '../models/Tesis';
import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import sequelize from '../config/database';
import fs from 'fs';

// Subir documento
export const uploadDocument = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'No se recibió ningún archivo'
			});
		}

		const { phase, description } = req.body;
		const userId = req.user?.id;

		console.log('📤 Subiendo documento:', {
			phase,
			description,
			fileName: req.file.filename,
			userId
		});

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
			return res.status(400).json({
				success: false,
				message: 'No tienes una tesis registrada'
			});
		}

		// Crear documento
		const documento = await Documento.create({
			id_tesis: tesis.id_tesis,
			nombre_archivo: req.file.filename,
			url_archivo: req.file.path,
			version: 1,
			tipo_entrega: description || 'Entrega regular',
			formato_archivo: req.file.originalname.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx',
			fase: phase,
			tamaño_archivo: req.file.size,
			estado: 'pendiente',
			validado_por_asesor: false,
		});

		// Registrar en bitácora
		await LogActividad.create({
			usuario_id: req.user?.id || 0,
			accion: 'SUBIR_DOCUMENTO',
			entidad: 'Documento',
			detalle: `Documento subido: ${req.file.filename} (ID: ${documento.id_documento})`,
		});

		return res.status(201).json({ success: true, documento });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al subir documento', error });
	}
};

// Obtener documentos por tesis
export const getDocumentsByTesis = async (req: Request, res: Response) => {
	try {
		const { id_tesis } = req.params;
		const documentos = await Documento.findAll({ where: { id_tesis } });
		return res.json({ success: true, documentos });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error al obtener documentos', error });
	}
};

// Obtener documentos pendientes de revisión para un asesor
export const getPendingReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        
        console.log('🔍 === INICIO getPendingReview ===');
        console.log('👤 Usuario autenticado:', {
            id: userId,
            email: req.user?.email,
            role: req.user?.role
        });

		const query = `
			SELECT DISTINCT 
				d.*, 
				u.id_usuario AS id_estudiante,
				CONCAT(u.nombre, ' ', u.apellido) AS estudiante
			FROM documento d
			JOIN tesispretesis t ON d.id_tesis = t.id_tesis
			JOIN usuario u ON u.id_usuario = t.id_usuario_estudiante
			WHERE t.id_asesor = ?
			  AND d.estado = 'pendiente'
			  AND d.validado_por_asesor = false
			ORDER BY d.fecha_subida DESC
		`;

        console.log('📝 Ejecutando consulta para documentos pendientes...');
        const [documents] = await sequelize.query(query, {
            replacements: [userId]
        });

        console.log(`✅ Encontrados ${documents.length} documentos pendientes de revisión`);

		return res.json({
            success: true,
            data: documents,
            count: documents.length
        });

    } catch (error) {
        console.error('❌ Error en getPendingReview:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener documentos pendientes de revisión'
        });
    }
};

// Middleware de validación para subir documento
export const validateUploadDocument = [
	body('phase').isString().notEmpty().withMessage('La fase es requerida'),
	body('description').optional().isString().isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
	(req: Request, res: Response, next: () => void) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			if (req.file && req.file.path) {
				try {
					fs.unlinkSync(req.file.path);
					console.log('🗑️ Archivo eliminado por validación fallida:', req.file.path);
				} catch (error) {
					console.error('❌ Error eliminando archivo:', error);
				}
			}
			return res.status(400).json({ success: false, errors: errors.array() });
		}
		next();
	},
];

// Middleware de validación para eliminar documento
export const validateDeleteDocumento = [
	param('id').isInt().withMessage('ID de documento inválido'),
	(req: Request, res: Response, next: () => void) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}
		next();
	},
];
