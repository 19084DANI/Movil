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
  // Obtener presupuesto por ID
  async getById(id) {
    try {
      const db = await DatabaseService.openDB();

      const result = await db.getFirstAsync(
        `SELECT id, categoria, monto, fecha_creacion
         FROM presupuestos
         WHERE id = ?`,
        [id]
      );

      return {
        success: true,
        data: result || null
      };

    } catch (error) {
      console.error('Error en PresupuestoModel.getById:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener el presupuesto',
        data: null
      };
    }
  }

  // Actualizar monto de una categoría
  async updateMonto(id, montoNuevo) {
    try {
      const db = await DatabaseService.openDB();

      await db.runAsync(
        `UPDATE presupuestos
         SET monto = ?
         WHERE id = ?`,
        [
          parseFloat(montoNuevo),
          id
        ]
      );

      return {
        success: true,
        message: 'Monto actualizado exitosamente'
      };

    } catch (error) {
      console.error('Error en PresupuestoModel.updateMonto:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar el monto'
      };
    }
  }
 
  // Eliminar categoría si la quieren implementar
  async delete (id) {
    try {
        const db = await DatabaseService.openDB();

        await db.runAsync(
            `DELETE FROM presupuestos WHERE id = ?`,
            [id]
        );
        return {
            success: true,
            message: 'Presupuesto eliminado exitosamente'
        };  
    } catch (error) {
        console.error('Error en PresupuestoModel.delete:', error);
        return {
            success: false,
            error: error.message || 'Error al eliminar el presupuesto'
        };
    }
  }

  // Obtener total sumado del presupuesto general
  async getTotal(){
    try {
        const db = await DatabaseService.openDB();

        const result = await db.getFirstAsync(
            `SELECT SUM(monto) AS total FROM presupuestos`
        );

        return {
            success: true,
            total: result?.total ? parseFloat(result.total) : 0
        };

    }   catch (error) {
        console.error('Error en PresupuestoModel.getTotal:', error);
        return {
            success: false,
            error: error.message || 'Error al calcular total',
            total: 0
        };
    }
  }

  // Obtener suma de presupuestos (alias para getTotal)
  async getSumaPresupuestos() {
    const result = await this.getTotal();
    return {
      success: result.success,
      data: { total: result.total },
      error: result.error
    };
  }

  // Actualizar presupuesto completo
  async update(id, data) {
    try {
      const db = await DatabaseService.openDB();

      await db.runAsync(
        `UPDATE presupuestos
         SET categoria = ?, monto = ?
         WHERE id = ?`,
        [
          data.categoria.trim(),
          parseFloat(data.monto),
          id
        ]
      );

      return {
        success: true,
        message: 'Presupuesto actualizado exitosamente'
      };

    } catch (error) {
      console.error('Error en PresupuestoModel.update:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar el presupuesto'
      };
    }
  }
}
    export default new PresupuestoModel();