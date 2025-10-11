import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interfaz basada en tu tabla 'usuario' existente
interface UserAttributes {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo_institucional: string;
  contraseña?: string;
  google_id?: string;
  avatar_url?: string;
  provider: 'google' | 'manual';
  telefono?: string;
  codigo_estudiante?: string;
  especialidad?: string;
  ciclo_actual?: number;  // 🔧 NUEVO CAMPO
  rol: 'estudiante' | 'asesor' | 'coordinador';
  estado: 'activo' | 'inactivo';
  primer_acceso: boolean;
  fecha_registro: Date;
  fecha_ultimo_acceso?: Date;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

// Interfaz para creación (sin campos auto-generados)
interface UserCreationAttributes extends Optional<UserAttributes, 
  'id_usuario' | 'contraseña' | 'google_id' | 'avatar_url' | 'telefono' | 
  'codigo_estudiante' | 'especialidad' | 'ciclo_actual' | 'fecha_ultimo_acceso' | 
  'fecha_creacion' | 'fecha_modificacion'> {}

// 🔧 MODELO CORREGIDO
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id_usuario: number;
  declare nombre: string;
  declare apellido: string;
  declare correo_institucional: string;
  declare contraseña?: string;
  declare google_id?: string;
  declare avatar_url?: string;
  declare provider: 'google' | 'manual';
  declare telefono?: string;
  declare codigo_estudiante?: string;
  declare especialidad?: string;
  declare ciclo_actual?: number;  // 🔧 NUEVO CAMPO
  declare rol: 'estudiante' | 'asesor' | 'coordinador';
  declare estado: 'activo' | 'inactivo';
  declare primer_acceso: boolean;
  declare fecha_registro: Date;
  declare fecha_ultimo_acceso?: Date;
  declare fecha_creacion: Date;
  declare fecha_modificacion: Date;

  // 🔧 MÉTODO toJWT ACTUALIZADO para frontend
  public toJWT(): any {
    return {
      id: this.id_usuario,
      email: this.correo_institucional,
      name: this.nombre,  // Solo nombre, no concatenar
      picture: this.avatar_url,
      role: this.rol,
      isVerified: this.estado === 'activo',
      profileCompleted: !this.primer_acceso,
      carrera: this.especialidad,
      ciclo: this.ciclo_actual,
      codigo_estudiante: this.codigo_estudiante,
      telefono: this.telefono
    };
  }

  // 🔧 MÉTODO MEJORADO: Buscar o crear usuario con Google
  static async findOrCreateByGoogle(googleData: {
    email: string;
    name: string;
    picture?: string;
    googleId: string;
  }) {
    try {
      console.log('🔍 Buscando usuario existente por email:', googleData.email);
      
      // Primero buscar si ya existe
      let user = await User.findOne({
        where: { correo_institucional: googleData.email }
      });

      if (user) {
        console.log('👤 Usuario existente encontrado:', {
          id: user.id_usuario,
          email: user.correo_institucional,
          primer_acceso: user.primer_acceso
        });

        // Actualizar google_id si no lo tenía
        if (!user.google_id && googleData.googleId) {
          user.google_id = googleData.googleId;
          user.avatar_url = googleData.picture || user.avatar_url;
          user.fecha_modificacion = new Date();
          await user.save();
          console.log('🔄 Google ID actualizado para usuario existente');
        }

        return { user, created: false };
      }

      // Si no existe, buscar por google_id
      user = await User.findOne({
        where: { google_id: googleData.googleId }
      });

      if (user) {
        console.log('👤 Usuario encontrado por Google ID pero email diferente');
        user.correo_institucional = googleData.email;
        user.fecha_modificacion = new Date();
        await user.save();
        return { user, created: false };
      }

      // Crear nuevo usuario
      console.log('➕ Creando nuevo usuario...');
      
      // 🔧 USAR SOLO EL NOMBRE, NO DIVIDIR
      const newUser = await User.create({
        nombre: googleData.name,  // Guardar nombre completo
        apellido: '',  // Dejar vacío por ahora
        correo_institucional: googleData.email,
        google_id: googleData.googleId,
        avatar_url: googleData.picture,
        provider: 'google',
        rol: User.determineRole(googleData.email),
        estado: 'activo',
        primer_acceso: true,
        fecha_registro: new Date(),
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      });

      console.log('✅ Nuevo usuario creado exitosamente:', {
        id: newUser.id_usuario,
        email: newUser.correo_institucional,
        nombre: newUser.nombre,
        rol: newUser.rol
      });

      return { user: newUser, created: true };

    } catch (error) {
      console.error('❌ Error en findOrCreateByGoogle:', error);
      throw error;
    }
  }

  // Método estático para determinar rol
  static determineRole(email: string): 'estudiante' | 'asesor' | 'coordinador' {
    if (email.includes('coordinador') || email.includes('admin')) {
      return 'coordinador';
    } else if (email.includes('docente') || email.includes('profesor')) {
      return 'asesor';
    }
    return 'estudiante';
  }

  // 🔧 MÉTODO updateProfile CORREGIDO - AHORA ACEPTA APELLIDO
  async updateProfile(profileData: {
    carrera?: string;
    ciclo?: number;
    codigo_estudiante?: string;
    nombre?: string;
    apellido?: string;    // 🔧 NUEVO CAMPO AGREGADO
    telefono?: string;
  }) {
    try {
      console.log('🔧 updateProfile - Datos recibidos:', profileData);

      // 🔧 ACTUALIZAR TODOS LOS CAMPOS QUE LLEGUEN
      if (profileData.carrera) {
        this.especialidad = profileData.carrera;
        console.log('✅ Especialidad/Carrera actualizada:', this.especialidad);
      }

      if (profileData.ciclo) {
        this.ciclo_actual = profileData.ciclo;
        console.log('✅ Ciclo actual actualizado:', this.ciclo_actual);
      }

      if (profileData.codigo_estudiante) {
        this.codigo_estudiante = profileData.codigo_estudiante;
        console.log('✅ Código de estudiante actualizado:', this.codigo_estudiante);
      }

      if (profileData.nombre) {
        this.nombre = profileData.nombre;
        console.log('✅ Nombre actualizado:', this.nombre);
      }

      // 🔧 NUEVO: ACTUALIZAR APELLIDO
      if (profileData.apellido) {
        this.apellido = profileData.apellido;
        console.log('✅ Apellido actualizado:', this.apellido);
      }

      if (profileData.telefono) {
        this.telefono = profileData.telefono;
        console.log('✅ Teléfono actualizado:', this.telefono);
      }

      // Marcar como perfil completado
      this.primer_acceso = false;
      this.fecha_ultimo_acceso = new Date();
      this.fecha_modificacion = new Date();

      console.log('💾 Guardando en BD - Datos finales:', {
        nombre: this.nombre,
        apellido: this.apellido,  // 🔧 NUEVO LOG
        codigo_estudiante: this.codigo_estudiante,
        especialidad: this.especialidad,
        ciclo_actual: this.ciclo_actual,
        primer_acceso: this.primer_acceso
      });

      await this.save();
      
      console.log('✅ Perfil actualizado y guardado exitosamente en BD');
      
      return this;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    }
  }
}

// 🔧 DEFINICIÓN SEQUELIZE ACTUALIZADA CON ciclo_actual
User.init({
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo_institucional: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      isTecsupEmail(value: string) {
        if (!value.endsWith('@tecsup.edu.pe')) {
          throw new Error('Solo se permiten emails del dominio @tecsup.edu.pe');
        }
      }
    }
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Opcional para OAuth2'
  },
  google_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    comment: 'ID de Google OAuth2'
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL de foto de perfil de Google'
  },
  provider: {
    type: DataTypes.ENUM('google', 'manual'),
    allowNull: false,
    defaultValue: 'google'
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  codigo_estudiante: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Para estudiantes'
  },
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Para asesores o carrera para estudiantes'
  },
  ciclo_actual: {  // 🔧 NUEVO CAMPO
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    comment: 'Ciclo académico actual del estudiante'
  },
  rol: {
    type: DataTypes.ENUM('estudiante', 'asesor', 'coordinador'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'activo'
  },
  primer_acceso: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Para redirigir a completar perfil'
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_modificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'usuario',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['correo_institucional']
    },
    {
      unique: true,
      fields: ['google_id']
    },
    {
      fields: ['rol']
    },
    {
      fields: ['estado']
    }
  ]
});

export default User;