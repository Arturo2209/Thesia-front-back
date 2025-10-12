import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

// 🔧 INTERFACE PARA ATRIBUTOS DE NOTIFICACIÓN
interface NotificacionAttributes {
  id_notificacion: number;
  id_usuario: number;
  mensaje: string;
  tipo: 'plazo' | 'comentario' | 'reunion' | 'estado' | 'general' | 'documento';
  fecha_envio: Date;
  leido: 0 | 1;
  id_referencia?: number;
  tipo_referencia?: 'documento' | 'reunion' | 'tesis' | 'comentario';
  prioridad: 'baja' | 'media' | 'alta';
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

// 🔧 INTERFACE PARA CREACIÓN (campos opcionales)
interface NotificacionCreationAttributes extends Optional<NotificacionAttributes, 
  'id_notificacion' | 'fecha_envio' | 'leido' | 'id_referencia' | 'tipo_referencia' | 'prioridad' | 'fecha_creacion' | 'fecha_modificacion'> {}

// 📄 MODELO SEQUELIZE
class Notificacion extends Model<NotificacionAttributes, NotificacionCreationAttributes> 
  implements NotificacionAttributes {
  
  public id_notificacion!: number;
  public id_usuario!: number;
  public mensaje!: string;
  public tipo!: 'plazo' | 'comentario' | 'reunion' | 'estado' | 'general' | 'documento';
  public fecha_envio!: Date;
  public leido!: 0 | 1;
  public id_referencia?: number;
  public tipo_referencia?: 'documento' | 'reunion' | 'tesis' | 'comentario';
  public prioridad!: 'baja' | 'media' | 'alta';
  public fecha_creacion!: Date;
  public fecha_modificacion!: Date;

  // 🔗 ASOCIACIONES (se definen después del modelo)
  public readonly usuario?: User;

  // 📊 TIMESTAMPS
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 🏗️ DEFINICIÓN DEL MODELO
Notificacion.init(
  {
    id_notificacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id_notificacion'
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_usuario',
      references: {
        model: User,
        key: 'id'
      }
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'mensaje'
    },
    tipo: {
      type: DataTypes.ENUM('plazo', 'comentario', 'reunion', 'estado', 'general', 'documento'),
      allowNull: false,
      field: 'tipo'
    },
    fecha_envio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_envio'
    },
    leido: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      field: 'leido',
      validate: {
        isIn: [[0, 1]]
      }
    },
    id_referencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_referencia'
    },
    tipo_referencia: {
      type: DataTypes.ENUM('documento', 'reunion', 'tesis', 'comentario'),
      allowNull: true,
      field: 'tipo_referencia'
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      allowNull: true,
      defaultValue: 'media',
      field: 'prioridad'
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    },
    fecha_modificacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_modificacion'
    }
  },
  {
    sequelize,
    tableName: 'notificacion', // 🔧 NOMBRE EXACTO DE TU TABLA
    modelName: 'Notificacion',
    timestamps: false, // 🔧 USAMOS NUESTROS PROPIOS TIMESTAMPS
    indexes: [
      {
        fields: ['id_usuario']
      },
      {
        fields: ['leido']
      },
      {
        fields: ['tipo']
      },
      {
        fields: ['prioridad']
      },
      {
        fields: ['fecha_envio']
      }
    ],
    hooks: {
      beforeUpdate: (notificacion) => {
        notificacion.fecha_modificacion = new Date();
      }
    }
  }
);

// 🔗 DEFINIR ASOCIACIONES
Notificacion.belongsTo(User, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// 📤 EXPORTAR MODELO
export default Notificacion;

// 🧪 FUNCIÓN HELPER PARA CREAR NOTIFICACIONES
export const crearNotificacion = async (
  id_usuario: number,
  mensaje: string,
  tipo: NotificacionAttributes['tipo'],
  options?: {
    prioridad?: NotificacionAttributes['prioridad'];
    id_referencia?: number;
    tipo_referencia?: NotificacionAttributes['tipo_referencia'];
  }
): Promise<Notificacion> => {
  try {
    console.log('📨 Creando notificación:', { id_usuario, mensaje, tipo, options });

    const notificacion = await Notificacion.create({
      id_usuario,
      mensaje,
      tipo,
      prioridad: options?.prioridad || 'media',
      id_referencia: options?.id_referencia,
      tipo_referencia: options?.tipo_referencia
    });

    console.log('✅ Notificación creada:', notificacion.id_notificacion);
    return notificacion;

  } catch (error) {
    console.error('❌ Error creando notificación:', error);
    throw error;
  }
};

// 🧪 FUNCIÓN HELPER PARA NOTIFICAR MÚLTIPLES USUARIOS
export const crearNotificacionMasiva = async (
  usuarios: number[],
  mensaje: string,
  tipo: NotificacionAttributes['tipo'],
  options?: {
    prioridad?: NotificacionAttributes['prioridad'];
    id_referencia?: number;
    tipo_referencia?: NotificacionAttributes['tipo_referencia'];
  }
): Promise<Notificacion[]> => {
  try {
    console.log('📨 Creando notificaciones masivas:', { usuarios: usuarios.length, tipo });

    const notificaciones = await Promise.all(
      usuarios.map(id_usuario => 
        Notificacion.create({
          id_usuario,
          mensaje,
          tipo,
          prioridad: options?.prioridad || 'media',
          id_referencia: options?.id_referencia,
          tipo_referencia: options?.tipo_referencia
        })
      )
    );

    console.log('✅ Notificaciones masivas creadas:', notificaciones.length);
    return notificaciones;

  } catch (error) {
    console.error('❌ Error creando notificaciones masivas:', error);
    throw error;
  }
};