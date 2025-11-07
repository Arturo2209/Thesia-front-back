import express from 'express';

const app = express(); // Inicializar la instancia de Express

import apiRoutes from '../routes/api'; // Corregir la ruta del archivo

// Registrar rutas de la API
console.log('🔧 Registrando rutas de la API en /api');
app.use('/api', apiRoutes);

// Verificar rutas registradas
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`✅ Ruta registrada: ${middleware.route.path}`);
  }
});