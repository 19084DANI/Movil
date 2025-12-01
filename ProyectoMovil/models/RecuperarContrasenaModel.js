import DatabaseService from '../database/DatabaseService';


class RecuperarContrasenaModel {
  
  async saveVerificationCode(email, code, expiresInMinutes = 15) {
    try {
      const db = await DatabaseService.openDB();
      
      // crea la tabla si no existe
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS password_resets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          code TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          created_at INTEGER DEFAULT (strftime('%s', 'now')),
          used INTEGER DEFAULT 0
        );
      `);

      // calcula el tiempo de expiración 
      const expiresAt = Math.floor(Date.now() / 1000) + (expiresInMinutes * 60);

      // eliminar códigos anteriores del mismo email
      await db.runAsync('DELETE FROM password_resets WHERE email = ?', [email]);

      // nuevo código
      const result = await db.runAsync(
        'INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, ?)',
        [email, code, expiresAt]
      );

      return {
        success: true,
        message: 'Código guardado exitosamente',
        id: result.lastInsertRowId
      };
    } catch (error) {
      console.error('Error saving verification code:', error);
      return {
        success: false,
        error: error.message || 'Error al guardar el código de verificación'
      };
    }
  }

  

  async verifyCode(email, code) {
    try {
      const db = await DatabaseService.openDB();
      const currentTime = Math.floor(Date.now() / 1000);

      // buscar código válido (que nno este usado y no haya expirado)
      const result = await db.getFirstAsync(
        `SELECT * FROM password_resets 
         WHERE email = ? AND code = ? AND used = 0 AND expires_at > ?`,
        [email, code, currentTime]
      );

      if (!result) {
        return {
          success: false,
          error: 'Código inválido o expirado'
        };
      }

      // poner el código como usado
      await db.runAsync(
        'UPDATE password_resets SET used = 1 WHERE id = ?',
        [result.id]
      );

      return {
        success: true,
        message: 'Código verificado exitosamente'
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        error: error.message || 'Error al verificar el código'
      };
    }
  }

  //  Codigos expirados
  async cleanExpiredCodes() {
    try {
      const db = await DatabaseService.openDB();
      const currentTime = Math.floor(Date.now() / 1000);

      await db.runAsync('DELETE FROM password_resets WHERE expires_at < ?', [currentTime]);

      return { success: true };
    } catch (error) {
      console.error('Error cleaning expired codes:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar todos los códigos de un email

  async deleteCodesByEmail(email) {
    try {
      const db = await DatabaseService.openDB();
      await db.runAsync('DELETE FROM password_resets WHERE email = ?', [email]);
      return { success: true };
    } catch (error) {
      console.error('Error deleting codes:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new RecuperarContrasenaModel();
