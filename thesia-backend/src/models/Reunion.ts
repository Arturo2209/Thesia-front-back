import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReunionAttributes {
  id_reunion: number;
  id_tesis: number;
  fecha_reunion: Date;
  hora_inicio: string;
  hora_fin: string;
  enlace?: string;
  ubicacion?: string;
  estado: 'pendiente' | 'realizada' | 'cancelada';
  id_asesor: number;
  id_estudiante: number;
  agenda?: string;
  comentarios?: string;
  duracion_minutos: number;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

interface ReunionCreationAttributes extends Optional<ReunionAttributes, 'id_reunion' | 'enlace' | 'ubicacion' | 'agenda' | 'comentarios' | 'fecha_creacion' | 'fecha_modificacion'> {}

class Reunion extends Model<ReunionAttributes, ReunionCreationAttributes> implements ReunionAttributes {
  declare id_reunion: number;
  declare id_tesis: number;
  declare fecha_reunion: Date;
  declare hora_inicio: string;
  declare hora_fin: string;
  declare enlace?: string;
  declare ubicacion?: string;
  declare estado: 'pendiente' | 'realizada' | 'cancelada';
  declare id_asesor: number;
  declare id_estudiante: number;
  declare agenda?: string;
  declare comentarios?: string;
  declare duracion_minutos: number;
  declare fecha_creacion: Date;
  declare fecha_modificacion: Date;
}

Reunion.init(
  {
    id_reunion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_tesis: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_reunion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    enlace: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'realizada', 'cancelada'),
      defaultValue: 'pendiente',
    },
    id_asesor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agenda: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duracion_minutos: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
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
    modelName: 'Reunion',
    tableName: 'reunion',
    timestamps: false,
  }
);

export default Reunion;
