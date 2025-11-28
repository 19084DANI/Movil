import UserModel from '../models/UserModel';

class AuthController {
  
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


  validatePhone(phone) {
    return /^\d+$/.test(phone) && phone.length >= 10;
  }


  validatePassword(password) {
    if (!password || password.length < 6) {
      return {
        valid: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      };
    }
    return { valid: true, message: '' };
  }


  async register(userData) {
    // Validaciones
    if (!userData.nombre || !userData.correo || !userData.telefono || !userData.contrasena) {
      return {
        success: false,
        error: 'Todos los campos son obligatorios'
      };
    }

    if (!this.validateEmail(userData.correo)) {
      return {
        success: false,
        error: 'El correo electrónico no es válido'
      };
    }

    if (!this.validatePhone(userData.telefono)) {
      return {
        success: false,
        error: 'El teléfono debe contener al menos 10 dígitos numéricos'
      };
    }

    const passwordValidation = this.validatePassword(userData.contrasena);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.message
      };
    }

    // Crear usuario en la base de datos
    const result = await UserModel.create(userData);

    if (result.success) {
      return {
        success: true,
        message: 'Cuenta creada exitosamente',
        userId: result.userId
      };
    } else {
      return {
        success: false,
        error: result.error || 'Error al crear la cuenta'
      };
    }
  }

  
  async login(email, password) {
    // Validaciones básicas
    if (!email || !password) {
      return {
        success: false,
        error: 'Por favor complete todos los campos'
      };
    }

    if (!this.validateEmail(email)) {
      return {
        success: false,
        error: 'El correo electrónico no es válido'
      };
    }

    // Buscar usuario en la base de datos
    const result = await UserModel.findByEmailAndPassword(email, password);

    if (result.success && result.data) {
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: result.data
      };
    } else {
      return {
        success: false,
        error: 'Credenciales incorrectas. Verifique su correo y contraseña.'
      };
    }
  }

  
  async recoverPassword(email, newPassword, confirmPassword) {
    // validaciones
    if (!email || !newPassword || !confirmPassword) {
      return {
        success: false,
        error: 'Todos los campos son obligatorios'
      };
    }

    if (!this.validateEmail(email)) {
      return {
        success: false,
        error: 'El correo electrónico no es válido'
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: 'Las contraseñas no coinciden'
      };
    }

    const passwordValidation = this.validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.message
      };
    }

    // verificar si el usuarioxiste
    const userExists = await UserModel.emailExists(email);
    if (!userExists) {
      return {
        success: false,
        error: 'No se encontró una cuenta con ese correo electrónico'
      };
    }

    // actualizar contraseña
    const result = await UserModel.updatePassword(email, newPassword);

    if (result.success) {
      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };
    } else {
      return {
        success: false,
        error: result.error || 'Error al actualizar la contraseña'
      };
    }
  }
}

export default new AuthController();

