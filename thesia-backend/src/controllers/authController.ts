import User from '../models/User';
import LogActividad from '../models/LogActividad';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	console.log('🔐 [LOGIN] Intento de login tradicional:', { email });
	try {
		// Buscar usuario con provider manual
		const user = await User.findOne({
			where: { correo_institucional: email, provider: 'manual' }
		});
		if (!user) {
			console.log('❌ [LOGIN] Usuario no encontrado:', email);
			return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
		}
		console.log('✅ [LOGIN] Usuario encontrado:', { id: user.id_usuario, email: user.correo_institucional, rol: user.rol });
		// Verificar contraseña (en texto plano para pruebas)
		if (user.contraseña !== password) {
			console.log('❌ [LOGIN] Contraseña incorrecta para usuario:', email);
			return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
		}
		console.log('✅ [LOGIN] Contraseña correcta, generando JWT...');
			// Generar JWT con formato estándar (igual que Google)
			const jwtPayload = user.toJWT();
			const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || 'thesia_secret', { expiresIn: '12h' });
			console.log('✅ [LOGIN] Login exitoso, JWT generado:', jwtPayload);

			// Registrar actividad en la bitácora
			await LogActividad.create({
				usuario_id: user.id_usuario,
				accion: 'LOGIN',
				entidad: 'Usuario',
				detalle: `Login exitoso para usuario ${user.correo_institucional}`
			});
			return res.json({ success: true, user: jwtPayload, token });
	} catch (error) {
		console.error('❌ [LOGIN] Error en login tradicional:', error);
		return res.status(500).json({ success: false, message: 'Error interno del servidor', error });
	}
};
