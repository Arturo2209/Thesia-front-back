import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

// Definir atributos de la tesis según tu tabla existente
interface TesisAttributes {
  id_tesis: number;
  id_usuario_estudiante: number;
  titulo: string;
  descripcion?: string;
  estado: 'pendiente' | 'en_proceso' | 'entregado' | 'revisado' | 'aprobado' | 'rechazado';
  fecha_registro: Date;
  fecha_aprobacion?: Date;
  fecha_limite?: Date;
  id_asesor?: number;
  area?: string;
  tipo: 'tesis' | 'pretesis';
  fase_actual: 'propuesta' | 'desarrollo' | 'revision' | 'sustentacion';
  progreso_porcentaje: number;
  calificacion?: number;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

// Atributos opcionales para creación
interface TesisCreationAttributes extends Optional<TesisAttributes, 
  'id_tesis' | 'descripcion' | 'fecha_registro' | 'fecha_aprobacion' | 
  'fecha_limite' | 'id_asesor' | 'area' | 'calificacion' | 
  'fecha_creacion' | 'fecha_modificacion'> {}

// Clase del modelo
class Tesis extends Model<TesisAttributes, TesisCreationAttributes> implements TesisAttributes {
  declare id_tesis: number;
  declare id_usuario_estudiante: number;
  declare titulo: string;
  declare descripcion?: string;
  declare estado: 'pendiente' | 'en_proceso' | 'entregado' | 'revisado' | 'aprobado' | 'rechazado';
  declare fecha_registro: Date;
  declare fecha_aprobacion?: Date;
  declare fecha_limite?: Date;
  declare id_asesor?: number;
  declare area?: string;
  declare tipo: 'tesis' | 'pretesis';
  declare fase_actual: 'propuesta' | 'desarrollo' | 'revision' | 'sustentacion';
  declare progreso_porcentaje: number;
  declare calificacion?: number;
  declare fecha_creacion: Date;
  declare fecha_modificacion: Date;

  // Timestamps automáticos
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

// Definir el modelo según tu estructura existente
Tesis.init(
  {
    id_tesis: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id_usuario',
      },
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_proceso', 'entregado', 'revisado', 'aprobado', 'rechazado'),
      defaultValue: 'pendiente',
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_aprobacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_limite: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    id_asesor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id_usuario',
      },
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM('tesis', 'pretesis'),
      allowNull: false,
    },
    fase_actual: {
      type: DataTypes.ENUM('propuesta', 'desarrollo', 'revision', 'sustentacion'),
      defaultValue: 'propuesta',
    },
    progreso_porcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
    },
    calificacion: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_modificacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Tesis',
    tableName: 'tesispretesis',
    timestamps: false,
    indexes: [
      {
        fields: ['id_usuario_estudiante'],
      },
      {
        fields: ['id_asesor'],
      },
      {
        fields: ['estado'],
      },
      {
        fields: ['fase_actual'],
      },
    ],
  }
);

// Definir relaciones
Tesis.belongsTo(User, {
  foreignKey: 'id_usuario_estudiante',
  as: 'estudiante',
});

Tesis.belongsTo(User, {
  foreignKey: 'id_asesor',
  as: 'asesor',
});

export default Tesis;