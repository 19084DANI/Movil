import databaseService from '../database/DatabaseService';

class UserModel {
  constructor() {
    this.tableName = 'usuarios';
  }

  
  async create(userData) {
    try {
      // Verificar si el correo ya existe
      const existingUser = await this.findByEmail(userData.correo);
      if (existingUser.success && existingUser.data) {
        return {
          success: false,
          error: 'El correo electrónico ya está registrado'
        };
      }

      // Insertar nuevo usuario
      const result = await databaseService.insert(this.tableName, {
        nombre: userData.nombre.trim(),
        correo: userData.correo.trim().toLowerCase(),
        telefono: userData.telefono.trim(),
        contrasena: userData.contrasena // produccion debería estar hasheada
      });

      if (result.success) {
        return {
          success: true,
          message: 'Usuario creado exitosamente',
          userId: result.insertId
        };
      } else {
        return {
          success: false,
          error: result.error || 'Error al crear el usuario'
        };
      }
    } catch (error) {
      console.error('Error in UserModel.create:', error);
      return {
        success: false,
        error: 'Error inesperado al crear el usuario'
      };
    }
  }


  async findByEmail(email) {
    try {
      const result = await databaseService.select(
        this.tableName,
        'correo = ?',
        [email.trim().toLowerCase()]
      );

      if (result.success && result.data && result.data.length > 0) {
        return {
          success: true,
          data: result.data[0]
        };
      }

      return {
        success: true,
        data: null
      };
    } catch (error) {
      console.error('Error in UserModel.findByEmail:', error);
      return {
        success: false,
        error: 'Error al buscar el usuario',
        data: null
      };
    }
  }

 
  async findById(id) {
    try {
      const result = await databaseService.select(
        this.tableName,
        'id = ?',
        [id]
      );

      if (result.success && result.data && result.data.length > 0) {
        return {
          success: true,
          data: result.data[0]
        };
      }

      return {
        success: true,
        data: null
      };
    } catch (error) {
      console.error('Error in UserModel.findById:', error);
      return {
        success: false,
        error: 'Error al buscar el usuario',
        data: null
      };
    }
  }

  
  async findByEmailAndPassword(email, password) {
    try {
      const result = await databaseService.select(
        this.tableName,
        'correo = ? AND contrasena = ?',
        [email.trim().toLowerCase(), password]
      );

      if (result.success && result.data && result.data.length > 0) {
        // no se muestra la contraseña 
        const user = { ...result.data[0] };
        delete user.contrasena;
        return {
          success: true,
          data: user
        };
      }

      return {
        success: true,
        data: null
      };
    } catch (error) {
      console.error('Error in UserModel.findByEmailAndPassword:', error);
      return {
        success: false,
        error: 'Error al buscar el usuario',
        data: null
      };
    }
  }

  //actualiza la contraseña
  async updatePassword(email, newPassword) {
    try {
      const result = await databaseService.update(
        this.tableName,
        { contrasena: newPassword },
        'correo = ?',
        [email.trim().toLowerCase()]
      );

      if (result.success && result.changes > 0) {
        return {
          success: true,
          message: 'Contraseña actualizada exitosamente'
        };
      } else {
        return {
          success: false,
          error: 'No se pudo actualizar la contraseña. Usuario no encontrado.'
        };
      }
    } catch (error) {
      console.error('Error in UserModel.updatePassword:', error);
      return {
        success: false,
        error: 'Error inesperado al actualizar la contraseña'
      };
    }
  }

  //verificar correo
  async emailExists(email) {
    try {
      const result = await this.findByEmail(email);
      return result.success && result.data !== null;
    } catch (error) {
      console.error('Error in UserModel.emailExists:', error);
      return false;
    }
  }
}

export default new UserModel();

