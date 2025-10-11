import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 🔧 ACTUALIZADO: Definir atributos del modelo CON el nuevo campo estado
interface DocumentoAttributes {
  id_documento: number;
  id_tesis: number;
  nombre_archivo: string;
  url_archivo: string;
  fecha_subida: Date;
  version: number;
  tipo_entrega: string;
  formato_archivo: 'pdf' | 'docx';
  fase: 'propuesta' | 'avance1' | 'avance2' | 'final';
  validado_por_asesor: boolean;
  estado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'; // ✅ NUEVO CAMPO
  tamaño_archivo?: number;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

// 🔧 ACTUALIZADO: Atributos opcionales para creación (incluyendo estado)
interface DocumentoCreationAttributes extends Optional<DocumentoAttributes, 
  'id_documento' | 'fecha_subida' | 'version' | 'validado_por_asesor' | 'estado' | 'tamaño_archivo' | 'fecha_creacion' | 'fecha_modificacion'> {}

// 🔧 ACTUALIZADO: Definir el modelo con el nuevo campo
class Documento extends Model<DocumentoAttributes, DocumentoCreationAttributes> 
  implements DocumentoAttributes {
  
  declare id_documento: number;
  declare id_tesis: number;
  declare nombre_archivo: string;
  declare url_archivo: string;
  declare fecha_subida: Date;
  declare version: number;
  declare tipo_entrega: string;
  declare formato_archivo: 'pdf' | 'docx';
  declare fase: 'propuesta' | 'avance1' | 'avance2' | 'final';
  declare validado_por_asesor: boolean;
  declare estado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'; // ✅ NUEVO CAMPO
  declare tamaño_archivo?: number;
  declare fecha_creacion: Date;
  declare fecha_modificacion: Date;

  // Timestamps automáticos
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

// 🔧 ACTUALIZADO: Inicializar el modelo con el nuevo campo
Documento.init({
  id_documento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_tesis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tesispretesis',
      key: 'id_tesis'
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
  fecha_subida: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  tipo_entrega: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  formato_archivo: {
    type: DataTypes.ENUM('pdf', 'docx'),
    defaultValue: 'pdf',
  },
  fase: {
    type: DataTypes.ENUM('propuesta', 'avance1', 'avance2', 'final'),
    allowNull: false,
  },
  validado_por_asesor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // ✅ NUEVO CAMPO AGREGADO
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado'),
    allowNull: false,
    defaultValue: 'pendiente',
    comment: 'Estado del documento: pendiente por revisar, en revisión por asesor, aprobado o rechazado'
  },
  tamaño_archivo: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fecha_modificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'Documento',
  tableName: 'documento',
  timestamps: false,
  indexes: [
    {
      fields: ['id_tesis']
    },
    {
      fields: ['fase']
    },
    {
      fields: ['validado_por_asesor']
    },
    {
      fields: ['estado'] // ✅ NUEVO ÍNDICE para optimizar queries por estado
    }
  ]
});

export default Documento;