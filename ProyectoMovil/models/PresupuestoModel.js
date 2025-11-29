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
}