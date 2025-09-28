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
  'codigo_estudiante' | 'especialidad' | 'fecha_ultimo_acceso' | 
  'fecha_creacion' | 'fecha_modificacion'> {}

// 🔧 MODELO SIN PUBLIC CLASS FIELDS (evitar warnings)
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  // 🚫 REMOVER declaraciones public - dejar que Sequelize las maneje
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
  declare rol: 'estudiante' | 'asesor' | 'coordinador';
  declare estado: 'activo' | 'inactivo';
  declare primer_acceso: boolean;
  declare fecha_registro: Date;
  declare fecha_ultimo_acceso?: Date;
  declare fecha_creacion: Date;
  declare fecha_modificacion: Date;

  // Método para obtener datos para JWT (formato compatible con frontend)
  public toJWT(): any {
    return {
      email: this.correo_institucional,
      name: `${this.nombre} ${this.apellido}`,
      picture: this.avatar_url,
      role: this.rol,
      isVerified: this.estado === 'activo',
      profileCompleted: !this.primer_acceso, // Si NO es primer acceso = perfil completo
      carrera: this.especialidad, // Para asesores será su especialidad
      ciclo: this.codigo_estudiante ? this.extractCicloFromCode(this.codigo_estudiante) : undefined
    };
  }

  // Extraer ciclo del código de estudiante (lógica personalizable)
  private extractCicloFromCode(codigo: string): number {
    // Por ejemplo, si el código tiene info del ciclo, sino defaultear a 1
    // Esto lo puedes personalizar según tu lógica de códigos
    return 1; // Default por ahora
  }

  // 🔧 MÉTODO MEJORADO: Buscar o crear usuario con Google (con mejor manejo de errores)
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
        // Actualizar email si es necesario
        user.correo_institucional = googleData.email;
        user.fecha_modificacion = new Date();
        await user.save();
        return { user, created: false };
      }

      // Crear nuevo usuario
      console.log('➕ Creando nuevo usuario...');
      
      const nameParts = googleData.name.split(' ');
      const nombre = nameParts[0] || '';
      const apellido = nameParts.slice(1).join(' ') || '';

      const newUser = await User.create({
        nombre,
        apellido,
        correo_institucional: googleData.email,
        google_id: googleData.googleId,
        avatar_url: googleData.picture,
        provider: 'google',
        rol: User.determineRole(googleData.email),
        estado: 'activo',
        primer_acceso: true, // TRUE = necesita completar perfil
        fecha_registro: new Date(),
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      });

      console.log('✅ Nuevo usuario creado exitosamente:', {
        id: newUser.id_usuario,
        email: newUser.correo_institucional,
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

  // Método para actualizar perfil después del primer login
  async updateProfile(profileData: {
    carrera?: string;
    ciclo?: number;
    telefono?: string;
  }) {
    try {
      // Para estudiantes, actualizar código y especialidad como carrera
      if (this.rol === 'estudiante') {
        this.codigo_estudiante = this.codigo_estudiante || `EST${new Date().getFullYear()}${String(this.id_usuario).padStart(3, '0')}`;
        // La especialidad puede representar la carrera del estudiante
        this.especialidad = profileData.carrera;
      }

      this.telefono = profileData.telefono || this.telefono;
      this.primer_acceso = false; // Ya no es primer acceso
      this.fecha_ultimo_acceso = new Date();
      this.fecha_modificacion = new Date();

      await this.save();
      
      console.log('✅ Perfil actualizado en BD:', {
        id: this.id_usuario,
        especialidad: this.especialidad,
        primer_acceso: this.primer_acceso
      });
      
      return this;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    }
  }
}

// Definir el modelo en Sequelize usando tu estructura existente
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
    comment: 'URL de foto de perfil'
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
  tableName: 'usuario', // 👈 Usar tu tabla existente
  timestamps: false, // 👈 Manejar timestamps manualmente
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