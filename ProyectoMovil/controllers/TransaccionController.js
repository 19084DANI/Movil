// controlador de Transacciones

import TransaccionModel from '../models/TransaccionModel';

class TransaccionController {
  constructor() {
    this.listeners = [];
    this.initialized = false;
  }

  // Inicializar controlador (prepare la tabla si es necesario)
  async initialize() {
    if (this.initialized) return;
    // La tabla se crea en DatabaseService.initialize()
    this.initialized = true;
  }

  // Validar datos de transacción
  validateTransaccion(data) {
    if (!data.nombre || !data.nombre.trim()) {
      return { valid: false, message: 'El nombre es obligatorio' };
    }
    if (!data.monto || isNaN(data.monto) || parseFloat(data.monto) <= 0) {
      return { valid: false, message: 'El monto debe ser un número positivo' };
    }
    if (!data.categoria || !data.categoria.trim()) {
      return { valid: false, message: 'La categoría es obligatoria' };
    }
    if (!data.fecha || !data.fecha.trim()) {
      return { valid: false, message: 'La fecha es obligatoria' };
    }
    if (!data.descripcion || !data.descripcion.trim()) {
      return { valid: false, message: 'La descripción es obligatoria' };
    }
    if (!data.es_gasto || (data.es_gasto.toLowerCase() !== 'si' && data.es_gasto.toLowerCase() !== 'no')) {
      return { valid: false, message: 'Especifique si es gasto (Sí/No)' };
    }
    return { valid: true, message: '' };
  }

  // Crear transacción
  async crearTransaccion(transaccionData) {
    const validation = this.validateTransaccion(transaccionData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.message
      };
    }

    const result = await TransaccionModel.create(transaccionData);
    if (result.success) {
      this.notifyListeners();
    }
    return result;
  }

  // Obtener todas las transacciones
  async obtenerTransacciones() {
    const result = await TransaccionModel.getAll();
    return result.data || [];
  }

  // Obtener transacción por ID
  async obtenerTransaccionPorId(id) {
    const result = await TransaccionModel.getById(id);
    return result.data;
  }

  // Actualizar transacción
  async editarTransaccion(id, transaccionData) {
    const validation = this.validateTransaccion(transaccionData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.message
      };
    }

    const result = await TransaccionModel.update(id, transaccionData);
    if (result.success) {
      this.notifyListeners();
    }
    return result;
  }

  // Eliminar transacción
  async eliminarTransaccion(id) {
    const result = await TransaccionModel.delete(id);
    if (result.success) {
      this.notifyListeners();
    }
    return result;
  }

  // Sistema de listeners para cambios en tiempo real
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
}

export default new TransaccionController();
