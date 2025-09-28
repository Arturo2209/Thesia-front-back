import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar configuración de base de datos
import sequelize, { testConnection, verifyDatabase } from './config/database';

// Importar modelos para registro
import User from './models/User';

// Importar rutas
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Middleware de logging detallado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// 📍 REGISTRAR RUTAS CON LOGS
console.log('📍 Registrando rutas...');
app.use('/api/auth', authRoutes);
console.log('✅ Rutas auth registradas en /api/auth/*');

app.use('/api', apiRoutes);
console.log('✅ Rutas API registradas en /api/*');

// Ruta de prueba principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend THESIA funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: 'MySQL conectado - usando BD existente thesia_db',
    endpoints: {
      auth: '/api/auth/*',
      api: '/api/*',
      health: '/api/health',
      database_status: '/api/database/status',
      database_tables: '/api/database/tables'
    }
  });
});

// 🚨 MIDDLEWARE PARA CAPTURAR RUTAS NO ENCONTRADAS
app.use((req, res) => {
  console.log(`❌ Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    available_endpoints: {
      root: 'GET /',
      health: 'GET /api/health',
      database_status: 'GET /api/database/status',
      database_tables: 'GET /api/database/tables',
      auth_google: 'POST /api/auth/google/verify',
      auth_update: 'POST /api/auth/update-profile'
    }
  });
});

// 🗄️ INICIALIZAR CONEXIÓN A TU BD EXISTENTE
const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor THESIA...');
    console.log('🗄️ Conectando a base de datos existente...');
    
    // Probar conexión a tu BD existente
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos. Verificar credenciales en .env');
      console.log('💡 Asegúrate de configurar:');
      console.log('   DB_HOST=localhost');
      console.log('   DB_PORT=3306');
      console.log('   DB_USER=root');
      console.log('   DB_PASSWORD=');
      console.log('   DB_NAME=thesia_db');
      process.exit(1);
    }

    // Verificar estructura de tu BD existente (no crear tablas)
    await verifyDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('✅ Servidor iniciado correctamente');
      console.log(`🌐 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`🗄️ Base de datos: ${process.env.DB_NAME} en ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log(`🔑 JWT configurado con expiración: ${process.env.JWT_EXPIRES_IN}`);
      console.log('📊 Usando estructura de BD existente');
      console.log('');
      console.log('📍 Endpoints disponibles:');
      console.log('   GET  / - Estado del servidor');
      console.log('   GET  /api/health - Estado de la API');
      console.log('   GET  /api/database/status - Estado de la BD');
      console.log('   GET  /api/database/tables - Listar tablas');
      console.log('   POST /api/auth/google/verify - Login con Google');
      console.log('   POST /api/auth/update-profile - Actualizar perfil');
      console.log('');
      console.log('🔗 Prueba: http://localhost:3001/api/database/status');
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Excepción no capturada:', err);
  process.exit(1);
});

// Iniciar servidor
startServer();

export default app;