import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface GuiaAttributes {
  id_guia: number;
  id_asesor: number;
  nombre_archivo: string;
  url_archivo: string;
  descripcion?: string;
  fase_aplicable?: 'fase_1_plan_proyecto' | 'fase_2_diagnostico' | 'fase_3_marco_teorico' | 'fase_4_desarrollo' | 'fase_5_resultados';
  activo: boolean;
  fecha_creacion: Date;
}

interface GuiaCreationAttributes extends Optional<GuiaAttributes, 
  'id_guia' | 'descripcion' | 'fase_aplicable' | 'activo' | 'fecha_creacion'> {}

class Guia extends Model<GuiaAttributes, GuiaCreationAttributes> 
  implements GuiaAttributes {
  
  declare id_guia: number;
  declare id_asesor: number;
  declare nombre_archivo: string;
  declare url_archivo: string;
  declare descripcion?: string;
  declare fase_aplicable?: 'fase_1_plan_proyecto' | 'fase_2_diagnostico' | 'fase_3_marco_teorico' | 'fase_4_desarrollo' | 'fase_5_resultados';
  declare activo: boolean;
  declare fecha_creacion: Date;
}

Guia.init({
  id_guia: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_asesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'id_usuario'
    }
  },
  nombre_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  url_archivo: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fase_aplicable: {
    type: DataTypes.ENUM('fase_1_plan_proyecto', 'fase_2_diagnostico', 'fase_3_marco_teorico', 'fase_4_desarrollo', 'fase_5_resultados'),
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'Guia',
  tableName: 'guias',
  timestamps: false,
  indexes: [
    {
      fields: ['id_asesor']
    },
    {
      fields: ['fase_aplicable']
    },
    {
      fields: ['activo']
    }
  ]
});

export default Guia;