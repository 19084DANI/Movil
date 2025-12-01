import UserModel from '../models/UserModel';
import EmailService from '../services/EmailService';
import RecuperarContrasenaModel from '../models/RecuperarContrasenaModel';

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

  //solisitar contraseña
  async requestPasswordReset(email) {
    try {
      // validar email
      if (!email) {
        return {
          success: false,
          error: 'Por favor ingrese su correo electrónico'
        };
      }

      if (!this.validateEmail(email)) {
        return {
          success: false,
          error: 'El correo electrónico no es válido'
        };
      }

      // verificar si el usuario existe
      const user = await UserModel.findByEmail(email);
      if (!user.success || !user.data) {
        return {
          success: false,
          error: 'No se encontró una cuenta con ese correo electrónico'
        };
      }

      //codigo de verificacion
      const verificationCode = EmailService.generateVerificationCode();

      // Guardar codigo en base de datos (expira en 15 minutos)
      const saveResult = await RecuperarContrasenaModel.saveVerificationCode(email, verificationCode, 15);
      
      if (!saveResult.success) {
        return {
          success: false,
          error: 'Error al generar el código de verificación'
        };
      }

      // Enviar codigo por email
      const emailResult = await EmailService.sendPasswordResetEmail(
        email, 
        verificationCode, 
        user.data.nombre || 'Usuario'
      );

      if (emailResult.success) {
        return {
          success: true,
          message: 'Se ha enviado un código de verificación a tu correo electrónico',
    
          // Solo para la prueba que funciona:
          debugCode: __DEV__ ? verificationCode : undefined
        };
      } else {
        // Si falla el envío, eliminar el código guardado
        await RecuperarContrasenaModel.deleteCodesByEmail(email);
        return {
          success: false,
          error: emailResult.error || 'Error al enviar el correo electrónico'
        };
      }

    } catch (error) {
      console.error('Error in requestPasswordReset:', error);
      return {
        success: false,
        error: error.message || 'Error al procesar la solicitud'
      };
    }
  }

  async resetPasswordWithCode(email, code, newPassword, confirmPassword) {
    try {
      // Validaciones
      if (!email || !code || !newPassword || !confirmPassword) {
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

      // Verificar código
      const verifyResult = await RecuperarContrasenaModel.verifyCode(email, code);
      
      if (!verifyResult.success) {
        return {
          success: false,
          error: verifyResult.error || 'Código inválido o expirado'
        };
      }

      // Actualizar contraseña
      const updateResult = await UserModel.updatePassword(email, newPassword);

      if (updateResult.success) {
        // Limpiar códigos usados
        await RecuperarContrasenaModel.deleteCodesByEmail(email);
        
        return {
          success: true,
          message: 'Contraseña actualizada exitosamente'
        };
      } else {
        return {
          success: false,
          error: updateResult.error || 'Error al actualizar la contraseña'
        };
      }

    } catch (error) {
      console.error('Error in resetPasswordWithCode:', error);
      return {
        success: false,
        error: error.message || 'Error al restablecer la contraseña'
      };
    }
  }
}

export default new AuthController();

