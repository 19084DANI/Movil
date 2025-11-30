import DatabaseService from "../database/DatabaseService";

class PresupuestoModel {
  constructor() {
    this.tableName = "presupuestos";
  }

  // Crear un nuevo presupuesto
  async create(data) {
    try {
      const db = await DatabaseService.openDB();

      await db.runAsync(
        `INSERT INTO presupuestos (nombre, categoria, monto)
         VALUES (?, ?, ?)`,
        [
          data.nombre.trim(),
          data.categoria.trim(),
          parseFloat(data.monto)
        ]
      );

      return { success: true };

    } catch (error) {
      console.error("Error en PresupuestoModel.create:", error);
      return { success: false, error: error.message };
    }
  }

  // Obtener todos los presupuestos
  async getAll() {
    try {
      const db = await DatabaseService.openDB();

      const result = await db.getAllAsync(
        `SELECT id, nombre, categoria, monto, fecha_creacion
         FROM presupuestos
         ORDER BY id DESC`
      );

      return { success: true, data: result || [] };

    } catch (error) {
      console.error("Error en PresupuestoModel.getAll:", error);
      return { success: false, data: [], error: error.message };
    }
  }

  // Obtener presupuesto por ID
  async getById(id) {
    try {
      const db = await DatabaseService.openDB();

      const result = await db.getFirstAsync(
        `SELECT id, nombre, categoria, monto, fecha_creacion
         FROM presupuestos
         WHERE id = ?`,
        [id]
      );

      return { success: true, data: result };

    } catch (error) {
      console.error("Error en PresupuestoModel.getById:", error);
      return { success: false, data: null, error: error.message };
    }
  }

  // SUMA TOTAL (esto SI lo pide tu controller)
  async getSumaPresupuestos() {
    try {
      const db = await DatabaseService.openDB();

      const result = await db.getFirstAsync(
        `SELECT SUM(monto) AS total FROM presupuestos`
      );

      return { success: true, data: result || { total: 0 } };

    } catch (error) {
      console.error("Error en PresupuestoModel.getSumaPresupuestos:", error);
      return { success: false, data: { total: 0 }, error: error.message };
    }
  }

  // Editar
  async update(id, data) {
    try {
      const db = await DatabaseService.openDB();

      await db.runAsync(
        `UPDATE presupuestos
         SET nombre = ?, categoria = ?, monto = ?
         WHERE id = ?`,
        [
          data.nombre.trim(),
          data.categoria.trim(),
          parseFloat(data.monto),
          id
        ]
      );

      return { success: true };

    } catch (error) {
      console.error("Error en PresupuestoModel.update:", error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar
  async delete(id) {
    try {
      const db = await DatabaseService.openDB();

      await db.runAsync(
        `DELETE FROM presupuestos WHERE id = ?`,
        [id]
      );

      return { success: true };

    } catch (error) {
      console.error("Error en PresupuestoModel.delete:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new PresupuestoModel();
