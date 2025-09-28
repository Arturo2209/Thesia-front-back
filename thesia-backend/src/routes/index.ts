import { Router } from 'express';
import authRoutes from './auth.js';

const router = Router();

// Ruta de prueba básica
router.get('/', (req, res) => {
  res.json({ 
    message: 'API de Thesia funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Endpoint de prueba para el frontend
router.get('/test-connection', (req, res) => {
  res.json({
    success: true,
    message: '🎉 Conexión exitosa entre Frontend y Backend!',
    backend: 'Thesia API v1.0.0',
    port: 3001,
    timestamp: new Date().toISOString(),
    status: 'CONNECTED'
  });
});

// Endpoint básico de usuarios (sin BD por ahora)
router.get('/users/test', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint de usuarios funcionando',
    users: [
      { 
        id: 1, 
        name: 'Juan Pérez', 
        email: 'juan.perez@tecsup.edu.pe', 
        role: 'estudiante',
        avatar: 'https://via.placeholder.com/100'
      },
      { 
        id: 2, 
        name: 'Dr. María García', 
        email: 'maria.garcia@tecsup.edu.pe', 
        role: 'asesor',
        avatar: 'https://via.placeholder.com/100'
      }
    ]
  });
});

// Rutas de autenticación
router.use('/auth', authRoutes);

export default router;