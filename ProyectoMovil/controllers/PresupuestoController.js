// Controlador de Presupuestos

import PresupuestoModel from "../models/PresupuestoModel";

class PresupuestoController {
  constructor() {
    this.listeners = [];
    this.initialized = false;
    this.PRESUPUESTO_GENERAL_MAX = 15000; // límite general
  }

  // Inicializar
  async initialize() {
    if (this.initialized) return;
    this.initialized = true;
  }

  // Validar presupuesto
  validatePresupuesto(data) {
    if (!data.nombre || !data.nombre.trim()) {
      return { valid: false, message: "El nombre del presupuesto es obligatorio" };
    }
    if (!data.categoria || !data.categoria.trim()) {
      return { valid: false, message: "La categoría es obligatoria" };
    }
    if (!data.monto || isNaN(data.monto) || parseFloat(data.monto) <= 0) {
      return { valid: false, message: "El monto debe ser un número positivo" };
    }
    return { valid: true, message: "" };
  }

  // Crear un nuevo presupuesto
  async crearPresupuesto(data) {
    const validation = this.validatePresupuesto(data);
    if (!validation.valid) {
      return { success: false, error: validation.message };
    }

    // Obtener total actual
    const totalResult = await PresupuestoModel.getSumaPresupuestos();
    const totalActual = totalResult.data?.total || 0;

    const nuevoTotal = totalActual + parseFloat(data.monto);

    // Validar límite
    if (nuevoTotal > this.PRESUPUESTO_GENERAL_MAX) {
      return {
        success: false,
        error: `El presupuesto total excede el límite general de $${this.PRESUPUESTO_GENERAL_MAX}`
      };
    }

    // Crear en DB
    const result = await PresupuestoModel.create(data);

    if (result.success) {
      this.notifyListeners();
    }

    return result;
  }

  // Obtener todos
  async obtenerPresupuestos() {
    const result = await PresupuestoModel.getAll();
    return result.data || [];
  }

  // Obtener por ID
  async obtenerPresupuestoPorId(id) {
    const result = await PresupuestoModel.getById(id);
    return result.data;
  }

  // Editar un presupuesto
  async editarPresupuesto(id, data) {
    const validation = this.validatePresupuesto(data);
    if (!validation.valid) {
      return { success: false, error: validation.message };
    }

    const totalResult = await PresupuestoModel.getSumaPresupuestos();
    const totalActual = totalResult.data?.total || 0;

    // Obtener presupuesto previo para recalcular
    const viejo = await PresupuestoModel.getById(id);
    const montoViejo = viejo.data?.monto || 0;

    const totalSinViejo = totalActual - montoViejo;
    const nuevoTotal = totalSinViejo + parseFloat(data.monto);

    if (nuevoTotal > this.PRESUPUESTO_GENERAL_MAX) {
      return {
        success: false,
        error: `El presupuesto total excede el límite general de $${this.PRESUPUESTO_GENERAL_MAX}`
      };
    }

    const result = await PresupuestoModel.update(id, data);

    if (result.success) {
      this.notifyListeners();
    }

    return result;
  }

  // Eliminar
  async eliminarPresupuesto(id) {
    const result = await PresupuestoModel.delete(id);
    if (result.success) {
      this.notifyListeners();
    }
    return result;
  }

  // Total general
  async obtenerTotalPresupuestos() {
    return await PresupuestoModel.getSumaPresupuestos();
  }

  // LISTENERS (igual que Transacciones)
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((l) => l !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => {
      if (typeof callback === "function") {
        callback();
      }
    });
  }
}

export default new PresupuestoController();
