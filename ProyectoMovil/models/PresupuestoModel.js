import DatabaseService from '../database/DatabaseService';

class PresupuestoModel {
  constructor() {
    this.tableName = 'presupuestos';
  }

  //Función para crear nueva (categoria) presupuesto
  async create(presupuestoData){
    try {
      const db = await DatabaseService.openDB();

      db.runSync(
        `INSERT INTO presupuestos (categoria, monto, limite)
         VALUES (?, ?, ?)`,
        [
          presupuestoData.categoria.trim(),
          parseFloat(presupuestoData.monto || 0), // Valor actual, inicializado en 0
          parseFloat(presupuestoData.limite) // Límite máximo
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

      const result = db.getAllSync(
        `SELECT id, categoria, monto, limite, fecha_creacion
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

      const result = db.getFirstSync(
        `SELECT id, categoria, monto, limite, fecha_creacion
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

  // Obtener presupuesto por categoría
  async getByCategoria(categoria) {
    try {
      const db = await DatabaseService.openDB();

      const result = db.getFirstSync(
        `SELECT id, categoria, monto, limite, fecha_creacion
         FROM presupuestos
         WHERE categoria = ?`,
        [categoria.trim()]
      );

      return {
        success: true,
        data: result || null
      };

    } catch (error) {
      console.error('Error en PresupuestoModel.getByCategoria:', error);
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

      db.runSync(
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

        db.runSync(
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

        const result = db.getFirstSync(
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

      db.runSync(
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

  // Actualizar categoría y límite (sin cambiar monto)
  async updateCategoriaYLimite(id, categoria, limite) {
    try {
      const db = await DatabaseService.openDB();

      db.runSync(
        `UPDATE presupuestos
         SET categoria = ?, limite = ?
         WHERE id = ?`,
        [
          categoria.trim(),
          parseFloat(limite),
          id
        ]
      );

      return {
        success: true,
        message: 'Categoría y límite actualizados exitosamente'
      };

    } catch (error) {
      console.error('Error en PresupuestoModel.updateCategoriaYLimite:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar la categoría y límite'
      };
    }
  }
}
    export default new PresupuestoModel();