import axios from 'axios';

class EmailService {
  constructor() {
    // credencoales de EmailJS https://dashboard.emailjs.com/
    this.SERVICE_ID = 'service_6pnb3zl'; 
    this.TEMPLATE_ID = 'template_2s1ni7a';
    this.PUBLIC_KEY = 'pg8GDKZp7aHCFwJV3'; 
    this.PRIVATE_KEY = 'c_EghJH86JN66Brtru9hT'; 
    // endpoint form para aplicaciones móviles
    this.API_URL = 'https://api.emailjs.com/api/v1.0/email/send-form';
  }

  //generar codigo
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  //enviar el correo
  async sendPasswordResetEmail(email, verificationCode, userName = 'Usuario') {
    try {
      // Validar email
      if (!email || !this.validateEmail(email)) {
        return {
          success: false,
          error: 'El correo electrónico no es válido'
        };
      }

      // Validar configuración
      if (this.SERVICE_ID.startsWith('TU_') || 
          this.TEMPLATE_ID.startsWith('TU_') || 
          this.PUBLIC_KEY.startsWith('TU_')) {
        return {
          success: false,
          error: 'EmailJS no está configurado. Por favor configura SERVICE_ID, TEMPLATE_ID y PUBLIC_KEY en EmailService.js'
        };
      }

      // Preparar datos como FormData para React Native
      const formData = new FormData();
      formData.append('service_id', this.SERVICE_ID);
      formData.append('template_id', this.TEMPLATE_ID);
      formData.append('user_id', this.PUBLIC_KEY);
      formData.append('accessToken', this.PRIVATE_KEY); // Clave privada para móviles
      formData.append('to_email', email);
      formData.append('to_name', userName);
      formData.append('verification_code', verificationCode);
      formData.append('app_name', 'Mi App Financiera');
      formData.append('message', `Tu código de verificación para restablecer tu contraseña es: ${verificationCode}`);

      console.log('Enviando email a:', email);
      console.log('Con código:', verificationCode);

      // envia email usando EmailJS API con FormData
      const response = await axios.post(this.API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        return {
          success: true,
          message: 'Código de verificación enviado al correo electrónico'
        };
      } else {
        return {
          success: false,
          error: 'Error al enviar el correo'
        };
      }

    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.response?.data || error.message || 'Error al enviar el correo electrónico'
      };
    }
  }

  //validar email
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


}

export default new EmailService();
