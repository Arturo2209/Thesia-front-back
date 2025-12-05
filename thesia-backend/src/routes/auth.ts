import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_ISSUER, JWT_AUDIENCE } from '../config/auth';
import { login } from '../controllers/authController';
import sequelize from '../config/database';

const router = Router();

// Configurar cliente de Google OAuth2
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// 🔐 ENDPOINT: Login con Google (guardar en BD)
router.post('/google/verify', async (req, res) => {
  try {
    console.log('🔐 Recibida petición de autenticación Google');
    const { token } = req.body;

    if (!token) {
      console.log('❌ Token no proporcionado');
      return res.status(400).json({
        success: false,
        message: 'Token requerido'
      });
    }

    console.log('🔍 Verificando token con Google...');
    
    // Verificar el token con Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Token inválido');
    }

    console.log('✅ Token verificado con Google');
    console.log('📧 Email recibido:', payload.email);

    // Verificar dominio @tecsup.edu.pe
    if (!payload.email?.endsWith('@tecsup.edu.pe')) {
      console.log('❌ Email no pertenece al dominio institucional');
      return res.status(403).json({
        success: false,
        message: 'Solo se permite el acceso con cuentas institucionales @tecsup.edu.pe'
      });
    }

    console.log('✅ Email verificado y dominio válido');

    // 🗄️ BUSCAR O CREAR USUARIO EN TU BD
    const { user, created } = await User.findOrCreateByGoogle({
      email: payload.email!,
      name: payload.name || 'Usuario',
      picture: payload.picture,
      googleId: payload.sub
    });

    if (created) {
      console.log('👤 Nuevo usuario creado en BD:', {
        id: user.id_usuario,
        email: user.correo_institucional,
        nombre: user.nombre,
        primer_acceso: user.primer_acceso
      });
    } else {
      console.log('👤 Usuario existente encontrado:', {
        id: user.id_usuario,
        email: user.correo_institucional,
        nombre: user.nombre,
        primer_acceso: user.primer_acceso
      });
      
      // Actualizar último acceso
      user.fecha_ultimo_acceso = new Date();
      user.fecha_modificacion = new Date();
      await user.save();
    }

    const jwtSecret = JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no configurado');
    }

    console.log('🔑 Generando JWT token...');

    // Generar JWT con datos del usuario
    const jwtToken = jwt.sign(
      user.toJWT(),
      jwtSecret as string,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      } as jwt.SignOptions
    );

    console.log('✅ JWT token generado exitosamente');
    console.log('📊 Datos del usuario para frontend:', user.toJWT());

    res.json({
      success: true,
      message: 'Autenticación exitosa',
      user: user.toJWT(),
      token: jwtToken,
      isFirstLogin: user.primer_acceso // 🎯 IMPORTANTE: Indicar si es primer acceso
    });

  } catch (error: unknown) {
    console.error('❌ Error en autenticación:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Error desconocido') : undefined
    });
  }
});

// 📝 ENDPOINT: Completar perfil (ACTUALIZADO CON VALIDACIÓN DE CICLO)
router.post('/update-profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token requerido' });
    }
    const token = authHeader.substring(7);
    const jwtSecret = JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'Error de configuración del servidor' });
    }
    // Verificar JWT token
    const decoded = jwt.verify(token, jwtSecret) as any;
    const { carrera, ciclo, codigo_estudiante, nombre, apellido } = req.body;
    // Validar que el usuario tiene correo_institucional definido
    if (!decoded.email || typeof decoded.email !== 'string') {
      return res.status(400).json({ success: false, message: 'No se puede actualizar el perfil: usuario no válido o no es estudiante.' });
    }
    // Buscar usuario en BD
    const user = await User.findOne({ where: { correo_institucional: decoded.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado en base de datos' });
    }
    // Actualizar perfil en BD
    await user.updateProfile({
      carrera,
      ciclo,
      codigo_estudiante: codigo_estudiante.trim(),
      nombre: nombre.trim(),
      apellido: apellido.trim()
    });
    // Generar nuevo JWT actualizado
    const newToken = jwt.sign(
      user.toJWT(),
      jwtSecret as string,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      } as jwt.SignOptions
    );
    res.json({ success: true, message: 'Perfil actualizado exitosamente', user: user.toJWT(), token: newToken });
  } catch (error: unknown) {
    console.error('❌ Error obteniendo usuario actual:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: process.env.NODE_ENV === 'development' ? errorMessage : 'Error interno' });
  }
});

// POST /login para el login tradicional
router.post('/login', login);

// GET /me - Obtener información del usuario autenticado
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    console.log('👤 === OBTENIENDO INFORMACIÓN DEL USUARIO ===');
    console.log('ID:', userId);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    // Obtener información del usuario con sus roles y permisos
    const query = `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.correo_institucional,
        u.rol,
        u.especialidad,
        u.avatar_url,
        u.estado,
        CASE 
          WHEN u.rol = 'estudiante' THEN (
            SELECT COUNT(*) 
            FROM tesispretesis 
            WHERE id_usuario_estudiante = u.id_usuario
          )
          WHEN u.rol = 'asesor' THEN (
            SELECT COUNT(*) 
            FROM tesispretesis 
            WHERE id_asesor = u.id_usuario
          )
          ELSE 0
        END as tesis_count
      FROM usuario u
      WHERE u.id_usuario = ?
    `;

    const [results] = await sequelize.query(query, {
      replacements: [userId]
    });

    const users = results as any[];

    if (users.length === 0) {
      console.log('❌ Usuario no encontrado en la base de datos');
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    const user = users[0];
    console.log('✅ Usuario encontrado:', {
      id: user.id_usuario,
      email: user.correo_institucional,
      role: user.rol
    });

    // Formatear respuesta
    const formattedUser = {
      id: user.id_usuario,
      name: `${user.nombre} ${user.apellido}`.trim(),
      email: user.correo_institucional,
      role: user.rol,
      specialty: user.especialidad || null,
      avatar_url: user.avatar_url || null,
      status: user.estado,
      thesis_count: user.tesis_count,
      permissions: {
        can_upload_documents: user.rol === 'estudiante',
        can_review_documents: user.rol === 'asesor',
        can_schedule_meetings: true,
        can_manage_thesis: user.rol === 'estudiante' || user.rol === 'asesor'
      }
    };

    res.json({
      success: true,
      user: formattedUser
    });

  } catch (error) {
    console.error('❌ Error obteniendo información del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error : 'Error interno'
    });
  }
});

export default router;