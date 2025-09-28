import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';

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

// 📝 ENDPOINT: Completar perfil (actualizar en BD)
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
    
    const { carrera, ciclo } = req.body;

    if (!carrera || !ciclo) {
      return res.status(400).json({
        success: false,
        message: 'Carrera y ciclo son requeridos'
      });
    }

    console.log('📝 Actualizando perfil en BD:', {
      email: decoded.email,
      carrera: carrera,
      ciclo: ciclo
    });

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

    console.log('👤 Usuario encontrado en BD:', {
      id: user.id_usuario,
      email: user.correo_institucional,
      primer_acceso_antes: user.primer_acceso
    });

    // 🔄 ACTUALIZAR PERFIL EN BD
    await user.updateProfile({
      carrera,
      ciclo
    });

    console.log('✅ Perfil actualizado en BD:', {
      id: user.id_usuario,
      especialidad: user.especialidad,
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

    console.log('✅ Perfil completado exitosamente');

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: user.toJWT(),
      token: newToken
    });

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

export default router;