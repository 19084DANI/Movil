import DatabaseService from '../database/DatabaseService';

class TransaccionModel {
  constructor() {
    this.tableName = 'transacciones';
  }

  // Crear una nueva transacción
  async create(transaccionData) {
    try {
      const db = await DatabaseService.openDB();
      
      await db.runAsync(
        `INSERT INTO transacciones (nombre, monto, categoria, fecha, descripcion) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          transaccionData.nombre.trim(),
          parseFloat(transaccionData.monto),
          transaccionData.categoria.trim(),
          transaccionData.fecha.trim(),
          transaccionData.descripcion.trim()
        ]
      );

      return {
        success: true,
        message: 'Transacción creada exitosamente'
      };
    } catch (error) {
      console.error('Error in TransaccionModel.create:', error);
      return {
        success: false,
        error: error.message || 'Error al crear la transacción'
      };
    }
  }

  // Obtener todas las transacciones
  async getAll() {
    try {
      const db = await DatabaseService.openDB();
      
      const result = await db.getAllAsync(
        `SELECT id, nombre, monto, categoria, fecha, descripcion, fecha_creacion
         FROM transacciones
         ORDER BY fecha DESC`
      );

      return {
        success: true,
        data: result || []
      };
    } catch (error) {
      console.error('Error in TransaccionModel.getAll:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener transacciones',
        data: []
      };
    }
  }

  // Obtener transacción por ID
  async getById(id) {
    try {
      const db = await DatabaseService.openDB();
      
      const result = await db.getFirstAsync(
        `SELECT id, nombre, monto, categoria, fecha, descripcion, fecha_creacion
         FROM transacciones
         WHERE id = ?`,
        [id]
      );

      return {
        success: true,
        data: result || null
      };
    } catch (error) {
      console.error('Error in TransaccionModel.getById:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener la transacción',
        data: null
      };
    }
  }

  // Actualizar una transacción
  async update(id, transaccionData) {
    try {
      const db = await DatabaseService.openDB();
      
      await db.runAsync(
        `UPDATE transacciones 
         SET nombre = ?, monto = ?, categoria = ?, fecha = ?, descripcion = ?
         WHERE id = ?`,
        [
          transaccionData.nombre.trim(),
          parseFloat(transaccionData.monto),
          transaccionData.categoria.trim(),
          transaccionData.fecha.trim(),
          transaccionData.descripcion.trim(),
          id
        ]
      );

      return {
        success: true,
        message: 'Transacción actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error in TransaccionModel.update:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar la transacción'
      };
    }
  }

  // Eliminar una transacción
  async delete(id) {
    try {
      const db = await DatabaseService.openDB();
      
      await db.runAsync(
        `DELETE FROM transacciones WHERE id = ?`,
        [id]
      );

      return {
        success: true,
        message: 'Transacción eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error in TransaccionModel.delete:', error);
      return {
        success: false,
        error: error.message || 'Error al eliminar la transacción'
      };
    }
  }

  // Obtener total de gastos (suma de todas las transacciones)
 async getTotalGastos() {
  try {
    const db = await DatabaseService.openDB();
    
    const result = await db.getFirstAsync(
      `SELECT SUM(monto) AS total FROM transacciones`
    );

    // Convertir a número seguro
    const total = result?.total ? Number(result.total) : 0;

    return {
      success: true,
      data: { total }
    };
  } catch (error) {
    console.error('Error in TransaccionModel.getTotalGastos:', error);
    return {
      success: false,
      error: error.message || 'Error al calcular total de gastos',
      data: { total: 0 }
    };
  }
 }
}

export default new TransaccionModel();
