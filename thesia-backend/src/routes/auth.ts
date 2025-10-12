import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

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

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no configurado');
    }

    console.log('🔑 Generando JWT token...');

    // Generar JWT con datos del usuario
    const jwtToken = jwt.sign(
      user.toJWT(), // Convertir a formato frontend
      jwtSecret,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'thesia-backend',
        audience: 'thesia-frontend'
      }
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
      return res.status(401).json({
        success: false,
        message: 'Token requerido'
      });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor'
      });
    }

    // Verificar JWT token
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    const { carrera, ciclo, codigo_estudiante, nombre, apellido, profileCompleted } = req.body;

    console.log('📝 === DATOS RECIBIDOS EN BACKEND ===');
    console.log('Todos los campos:', req.body);
    console.log('carrera:', carrera);
    console.log('ciclo:', ciclo);
    console.log('código_estudiante:', codigo_estudiante);
    console.log('nombre:', nombre);
    console.log('apellido:', apellido);
    console.log('profileCompleted:', profileCompleted);
    console.log('Usuario decodificado:', decoded.email);
    console.log('=====================================');

    // 🔧 VALIDACIONES ACTUALIZADAS
    if (!carrera) {
      return res.status(400).json({
        success: false,
        message: 'Carrera es requerida'
      });
    }

    if (!codigo_estudiante) {
      return res.status(400).json({
        success: false,
        message: 'Código de estudiante es requerido'
      });
    }

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nombre es requerido'
      });
    }

    if (!apellido || !apellido.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Apellido es requerido'
      });
    }

    // 🔧 NUEVA VALIDACIÓN: SOLO CICLOS 5 Y 6
    const cicloNumber = parseInt(ciclo);
    if (cicloNumber !== 5 && cicloNumber !== 6) {
      console.log('❌ Ciclo no permitido:', cicloNumber);
      return res.status(400).json({
        success: false,
        message: 'Solo se permiten estudiantes de V y VI ciclo para el registro de tesis'
      });
    }

    console.log('✅ Ciclo válido:', cicloNumber);

    // 🗄️ BUSCAR USUARIO EN BD
    const user = await User.findOne({
      where: { correo_institucional: decoded.email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en base de datos'
      });
    }

    console.log('👤 Usuario encontrado en BD - ANTES de actualizar:', {
      id: user.id_usuario,
      email: user.correo_institucional,
      nombre_actual: user.nombre,
      apellido_actual: user.apellido,
      codigo_actual: user.codigo_estudiante,
      ciclo_actual: user.ciclo_actual,
      especialidad_actual: user.especialidad,
      primer_acceso_antes: user.primer_acceso
    });

    // 🔄 ACTUALIZAR PERFIL EN BD
    await user.updateProfile({
      carrera,
      ciclo: cicloNumber,
      codigo_estudiante: codigo_estudiante.trim(),
      nombre: nombre.trim(),
      apellido: apellido.trim()
    });

    console.log('✅ Perfil actualizado en BD - DESPUÉS:', {
      id: user.id_usuario,
      nombre_nuevo: user.nombre,
      apellido_nuevo: user.apellido,
      codigo_nuevo: user.codigo_estudiante,
      ciclo_nuevo: user.ciclo_actual,
      especialidad_nuevo: user.especialidad,
      primer_acceso_despues: user.primer_acceso
    });

    // Generar nuevo token con datos actualizados
    const newToken = jwt.sign(
      user.toJWT(),
      jwtSecret,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'thesia-backend',
        audience: 'thesia-frontend'
      }
    );

    console.log('📤 === RESPUESTA ENVIADA AL FRONTEND ===');
    const responseData = {
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: user.toJWT(),
      token: newToken
    };
    console.log('Datos de respuesta:', responseData);
    console.log('Usuario en respuesta:', responseData.user);
    console.log('========================================');

    res.json(responseData);

  } catch (error: unknown) {
    console.error('❌ Error actualizando perfil:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// 👤 NUEVO ENDPOINT: Obtener usuario actual
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('👤 Obteniendo usuario actual - ID:', (req as any).user?.id);
    
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - Usuario no identificado'
      });
    }

    // 🔍 Buscar usuario en la base de datos usando el modelo User
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('❌ Usuario no encontrado en BD:', userId);
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    console.log('✅ Usuario encontrado:', {
      id: user.id_usuario,
      email: user.correo_institucional,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol,
      estado: user.estado
    });

    // 🔒 Verificar que el usuario esté activo
    if (user.estado !== 'activo') {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // 📦 Respuesta formateada usando el método toJWT() existente
    const userData = user.toJWT();

    console.log('📤 Datos enviados al frontend:', userData);

    res.json({
      success: true,
      user: userData,
      message: 'Usuario obtenido exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('❌ Error obteniendo usuario actual:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? errorMessage : 'Error interno'
    });
  }
});

export default router;