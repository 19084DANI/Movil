import DatabaseService from '../database/DatabaseService';

class PresupuestoModel {
  constructor() {
    this.tableName = 'presupuestos';
  }

  //Función para crear nueva (categoria) presupuesto
  async create(presupuestoData){
    try {
      const db = await DatabaseService.openDB();

      await db.runAsync(
        `INSERT INTO presupuestos (categoria, monto)
         VALUES (?, ?)`,
        [
          presupuestoData.categoria.trim(),
          parseFloat(presupuestoData.monto)
        ]
      );

      return {
        success: true,
        message: 'Presupuesto creado exitosamente'
      };

    } catch (error) {
      console.error('Error en PresupuestoModel.create:', error);
      return {
        success: false,
        error: error.message || 'Error al crear el presupuesto'
      };
    }

  }
  
// Obtener todos los presupuestos (todas las categorías)
  async getAll() {
    try {
      const db = await DatabaseService.openDB();

      const result = await db.getAllAsync(
        `SELECT id, categoria, monto, fecha_creacion
         FROM presupuestos
         ORDER BY id DESC`
      );

      return {
        success: true,
        data: result || []
      };

    } catch (error) {
      console.error('Error en PresupuestoModel.getAll:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener presupuestos',
        data: []
      };
    }
  }

}