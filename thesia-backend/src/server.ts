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

console.log('🚀 Iniciando servidor THESIA desde server.ts...');

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

// Rutas principales
app.use('/api/auth', authRoutes);
console.log('✅ Rutas auth registradas en /api/auth/*');

app.use('/api', apiRoutes);
console.log('✅ Rutas API registradas en /api/*');

// Ruta de prueba principal
app.get('/', (req, res) => {
  console.log('🏠 Endpoint raíz ejecutado');
  res.json({ 
    message: 'Backend THESIA funcionando correctamente desde server.ts',
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

// Health check directo (sin /api)
app.get('/health', (req, res) => {
  console.log('✅ Health check directo ejecutado');
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: 'Conectado a thesia_db'
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
      health_direct: 'GET /health',
      health_api: 'GET /api/health',
      database_status: 'GET /api/database/status',
      database_tables: 'GET /api/database/tables',
      auth_google: 'POST /api/auth/google/verify',
      auth_update: 'POST /api/auth/update-profile'
    }
  });
});

// 🗄️ INICIALIZAR SERVIDOR
const startServer = async () => {
  try {
    console.log('🗄️ Conectando a base de datos...');
    
    // Probar conexión a BD
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      console.log('💡 Verificar configuración en .env:');
      console.log(`   DB_HOST=${process.env.DB_HOST}`);
      console.log(`   DB_PORT=${process.env.DB_PORT}`);
      console.log(`   DB_USER=${process.env.DB_USER}`);
      console.log(`   DB_NAME=${process.env.DB_NAME}`);
    } else {
      await verifyDatabase();
    }

    // Iniciar servidor (incluso si BD falla, para debugging)
    app.listen(PORT, () => {
      console.log('✅ Servidor iniciado correctamente');
      console.log(`🌐 Ejecutándose en http://localhost:${PORT}`);
      console.log('');
      console.log('📍 Endpoints para probar:');
      console.log(`   🏠 http://localhost:${PORT}/`);
      console.log(`   ❤️ http://localhost:${PORT}/health`);
      console.log(`   🔧 http://localhost:${PORT}/api/health`);
      console.log(`   🗄️ http://localhost:${PORT}/api/database/status`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    
    // Iniciar servidor de todos modos para debugging
    app.listen(PORT, () => {
      console.log(`⚠️ Servidor iniciado en modo de emergencia en puerto ${PORT}`);
    });
  }
};

startServer();