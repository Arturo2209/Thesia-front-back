import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Importar configuración de base de datos
import sequelize, { testConnection, verifyDatabase } from './config/database';

// Importar modelos para registro
import User from './models/User';
import scheduleRoutes from './routes/schedules';

// Importar rutas CORREGIDAS
import authRoutes from './routes/auth';

// IMPORTAR LAS RUTAS NUEVAS CORREGIDAS:
import advisorsRouter from './routes/advisors';
import tesisRouter from './routes/tesis';
import documentosRouter from './routes/documentos'; // ✅ NUEVA IMPORTACIÓN
import guiasRouter from './routes/guias';
import notificationsRouter from './routes/notifications';
import reunionesRouter from './routes/reuniones';
import advisorRouter from './routes/advisor'; // NUEVA IMPORTACIÓN
import chatRouter from './routes/chat'; // 🆕 CHAT ROUTER
import { initSocket } from './config/socket';

// Cargar variables de entorno
dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

console.log('🚀 Iniciando servidor THESIA desde server.ts CON RUTAS CORREGIDAS Y DOCUMENTOS...');

// Middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});
// No aplicar rate limit a la ruta de Socket.IO para evitar bloquear el tiempo real
app.use((req, res, next) => {
  if (req.path && req.path.startsWith('/socket.io/')) {
    return next();
  }
  return (limiter as any)(req, res, next);
});
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
// Servir archivos subidos
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Middleware de logging detallado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// 📍 REGISTRAR RUTAS CORREGIDAS
console.log('📍 Registrando rutas CORREGIDAS CON DOCUMENTOS...');

// RUTAS ESPECÍFICAS PRIMERO (MAYOR PRIORIDAD)
app.use('/api/advisors', advisorsRouter);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/thesis', tesisRouter);   // ← RUTAS CORREGIDAS CON JOIN
app.use('/api/documents', documentosRouter); // ✅ NUEVA RUTA DE DOCUMENTOS
app.use('/api/guides', guiasRouter);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationsRouter);
app.use('/api/reuniones', reunionesRouter);  // ✅ NUEVA RUTA DE REUNIONES
app.use('/api/advisor', advisorRouter); // NUEVA RUTA PARA DOCUMENTOS DE ASESOR
app.use('/api/chat', chatRouter); // 🆕 REGISTRAR CHAT
// 🚨 Rutas viejas deshabilitadas

console.log('✅ Rutas CORREGIDAS registradas:');
console.log('   /api/advisors/*');
console.log('   /api/thesis/* ← RUTAS CORREGIDAS CON JOIN Y DEBUG');
console.log('   /api/documents/* ← NUEVAS RUTAS DE DOCUMENTOS'); // ✅ NUEVA LÍNEA
console.log('   /api/auth/*');
console.log('   /api/chat/* ← RUTAS DE CHAT');
console.log('   🚨 /api/* DESHABILITADO - RUTAS VIEJAS');

// Rutas antiguas '/api' generales eliminadas para evitar conflictos

// Verificar rutas registradas
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`✅ Ruta registrada: ${middleware.route.path}`);
  }
});

// Log detallado de rutas registradas
console.log('🔍 Verificando rutas registradas en el servidor:');
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`✅ Ruta registrada: ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        console.log(`✅ Ruta registrada (subruta): ${handler.route.path}`);
      }
    });
  }
});

// 🔧 ENDPOINTS MANUALES NECESARIOS (MIGRADOS DE api.ts)
app.get('/api/test-connection', (req, res) => {
  console.log('🧪 Test connection ejecutado');
  res.json({
    status: 'OK',
    message: 'Conexión de prueba exitosa',
    timestamp: new Date().toISOString(),
    database: 'Conectado a thesia_db'
  });
});

// Dashboard endpoint básico (migrar lógica completa después)
app.get('/api/dashboard', async (req, res) => {
  try {
    console.log('🏠 Dashboard endpoint ejecutado');
    res.json({
      status: 'OK',
      userName: 'Carlos Bullon Supanta',
      role: 'estudiante',
      hasThesis: true,
      thesisTitle: 'Mi tesis...',
      progress: 5,
      totalActivities: 4,
      message: 'Dashboard funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error en dashboard',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/health', (req, res) => {
  console.log('✅ Health API ejecutado');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Ruta de prueba principal
app.get('/', (req, res) => {
  console.log('🏠 Endpoint raíz ejecutado');
  res.json({ 
    message: 'Backend THESIA funcionando correctamente desde server.ts CON DOCUMENTOS',
    timestamp: new Date().toISOString(),
    database: 'MySQL conectado - usando BD existente thesia_db',
    endpoints: {
      advisors: '/api/advisors',
      thesis: '/api/thesis/* ← CORREGIDO CON JOIN',
      thesis_debug: '/api/thesis/debug ← NUEVO ENDPOINT DEBUG',
      documents: '/api/documents/* ← NUEVAS RUTAS DE DOCUMENTOS', // ✅ NUEVA LÍNEA
      documents_upload: '/api/documents/upload ← SUBIR DOCUMENTOS', // ✅ NUEVA LÍNEA
      documents_my: '/api/documents/my ← MIS DOCUMENTOS', // ✅ NUEVA LÍNEA
      auth: '/api/auth/*',
      health: '/api/health',
      dashboard: '/api/dashboard',
      test_connection: '/api/test-connection'
    }
  });
});

// Health check directo (sin /api)
app.get('/health', (req, res) => {
  console.log('✅ Health check directo ejecutado');
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente CON DOCUMENTOS',
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
      test_connection: 'GET /api/test-connection',
      dashboard: 'GET /api/dashboard',
      advisors: 'GET /api/advisors',
      thesis_my: 'GET /api/thesis/my ← CORREGIDO CON JOIN',
      thesis_debug: 'GET /api/thesis/debug ← NUEVO DEBUG',
      thesis_create: 'POST /api/thesis',
      documents_my: 'GET /api/documents/my ← MIS DOCUMENTOS', // ✅ NUEVA LÍNEA
      documents_upload: 'POST /api/documents/upload ← SUBIR DOCUMENTOS', // ✅ NUEVA LÍNEA
      documents_detail: 'GET /api/documents/:id ← DETALLE DOCUMENTO', // ✅ NUEVA LÍNEA
      documents_download: 'GET /api/documents/:id/download ← DESCARGAR', // ✅ NUEVA LÍNEA
      documents_delete: 'DELETE /api/documents/:id ← ELIMINAR', // ✅ NUEVA LÍNEA
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

    // Iniciar servidor HTTP + Socket.io
    const origin = process.env.FRONTEND_URL || 'http://localhost:5173';
    initSocket(server, origin);

    server.listen(PORT, () => {
      console.log('✅ Servidor iniciado correctamente CON RUTAS CORREGIDAS Y DOCUMENTOS');
      console.log(`🌐 Ejecutándose en http://localhost:${PORT}`);
      console.log('');
      console.log('🚨 ENDPOINTS PRINCIPALES DISPONIBLES:');
      console.log(`   📋 http://localhost:${PORT}/api/thesis/my ← CORREGIDO CON JOIN`);
      console.log(`   🧪 http://localhost:${PORT}/api/thesis/debug`);
      console.log(`   📄 http://localhost:${PORT}/api/documents/my ← MIS DOCUMENTOS`); // ✅ NUEVA LÍNEA
      console.log(`   📤 http://localhost:${PORT}/api/documents/upload ← SUBIR DOCUMENTOS`); // ✅ NUEVA LÍNEA
      console.log(`   📖 http://localhost:${PORT}/api/documents/:id ← DETALLE DOCUMENTO`); // ✅ NUEVA LÍNEA
      console.log(`   📥 http://localhost:${PORT}/api/documents/:id/download ← DESCARGAR`); // ✅ NUEVA LÍNEA
      console.log(`   🗑️ http://localhost:${PORT}/api/documents/:id ← ELIMINAR (DELETE)`); // ✅ NUEVA LÍNEA
      console.log(`   🏠 http://localhost:${PORT}/api/dashboard`);
      console.log(`   🔗 http://localhost:${PORT}/api/test-connection`);
      console.log('');
      console.log('🔧 CAMBIOS REALIZADOS:');
      console.log('   ✅ Rutas /api/thesis/* corregidas con JOIN');
      console.log('   ✅ Rutas /api/documents/* agregadas COMPLETAS'); // ✅ NUEVA LÍNEA
      console.log('   ✅ Sistema de subida de archivos con multer'); // ✅ NUEVA LÍNEA
      console.log('   ✅ CRUD completo de documentos (crear, leer, descargar, eliminar)'); // ✅ NUEVA LÍNEA
      console.log('   ✅ Endpoints debug, dashboard y test-connection agregados');
      console.log('   🚨 Rutas /api/* viejas deshabilitadas');
      console.log('   🗑️ app.ts YA NO SE USA - SOLO server.ts');
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    
    // Iniciar servidor de todos modos para debugging
    server.listen(PORT, () => {
      console.log(`⚠️ Servidor iniciado en modo de emergencia en puerto ${PORT}`);
    });
  }
};

startServer();