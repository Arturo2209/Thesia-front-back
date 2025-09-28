import { Sequelize } from 'sequelize';

// Configuración para tu base de datos MySQL existente
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'thesia_db', // 👈 Tu BD existente
  logging: process.env.NODE_ENV === 'development' ? (sql) => {
    console.log('🗄️ SQL:', sql);
  } : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false, // 👈 Tu BD maneja timestamps manualmente
    underscored: true,  // 👈 Tu BD usa snake_case (id_usuario, etc.)
  },
  timezone: '+00:00' // UTC timezone
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL (thesia_db) establecida correctamente');
    
    // Verificar que las tablas existen
    const [results] = await sequelize.query("SHOW TABLES");
    console.log(`📊 Tablas encontradas: ${results.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error);
    return false;
  }
};

// Función para verificar estructura (NO crear tablas, solo verificar)
export const verifyDatabase = async () => {
  try {
    // Verificar que las tablas principales existen
    const requiredTables = [
      'usuario', 'tesispretesis', 'documento', 'reunion', 
      'comentario', 'notificacion', 'disponibilidadasesor'
    ];

    for (const table of requiredTables) {
      try {
        await sequelize.query(`DESCRIBE ${table}`);
        console.log(`✅ Tabla '${table}' verificada`);
      } catch (error) {
        console.warn(`⚠️ Tabla '${table}' no encontrada`);
      }
    }

    console.log('✅ Verificación de base de datos completada');
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  }
};

export default sequelize;