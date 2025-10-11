import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        role: string;
        carrera?: string;
        codigo?: string;
      };
    }
  }
}

// Interface para el payload del JWT
interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: string;
  carrera?: string;
  codigo?: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔍 Verificando token...', {
      authHeader: authHeader ? 'Presente' : 'Ausente',
      token: token ? 'Presente' : 'Ausente'
    });

    if (!token) {
      console.log('❌ Token no encontrado');
      res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_aqui';

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('❌ Error verificando token:', err.message);
        res.status(403).json({
          success: false,
          message: 'Token inválido',
          error: err.message
        });
        return;
      }

      const payload = decoded as JwtPayload;
      req.user = payload;
      console.log('✅ Token verificado para usuario:', payload.email, 'Rol:', payload.role);
      next();
    });
  } catch (error) {
    console.error('❌ Error en authenticateToken:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      console.log('❌ Usuario no autenticado en requireRole');
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      console.log('❌ Rol no autorizado:', req.user.role, 'Roles requeridos:', roles);
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
      return;
    }

    console.log('✅ Rol autorizado:', req.user.role);
    next();
  };
};

// Middleware para verificar que sea estudiante
export const requireStudent = requireRole(['estudiante']);

// Middleware para verificar que sea asesor
export const requireAdvisor = requireRole(['asesor']);

// Middleware para verificar que sea admin
export const requireAdmin = requireRole(['admin']);