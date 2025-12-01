// controlador de Transacciones

import TransaccionModel from '../models/TransaccionModel';
import PresupuestoModel from '../models/PresupuestoModel';
import DatabaseService from '../database/DatabaseService';

class TransaccionController {
  constructor() {
    this.listeners = [];
    this.initialized = false;
  }

  // Inicializar controlador
  async initialize() {
    if (this.initialized) return;
    try {
      await DatabaseService.init();
      this.initialized = true;
      console.log('TransaccionController initialized');
    } catch (error) {
      console.error('Error initializing TransaccionController:', error);
    }
  }

  // Validar datos de transacción
  validateTransaccion(data) {
    const montoNum = Number(data.monto);
    
    if (!data.nombre || !data.nombre.trim()) {
      return { valid: false, message: 'El nombre es obligatorio' };
    }
    if (data.monto === undefined || data.monto === null) {
      return { valid: false, message: 'El monto es obligatorio' };
    }
    if (isNaN(montoNum) || montoNum <= 0) {
      return { valid: false, message: 'El monto debe ser un número positivo' };
    }
    if (!data.fecha || !data.fecha.trim()) {
      return { valid: false, message: 'La fecha es obligatoria' };
    }
    if (!data.descripcion || !data.descripcion.trim()) {
      return { valid: false, message: 'La descripción es obligatoria' };
    }

    // Si es gasto, la categoría es obligatoria
    const esGasto = data.es_gasto !== undefined ? data.es_gasto : true;
    if (esGasto && (!data.categoria || !data.categoria.trim())) {
      return { valid: false, message: 'La categoría es obligatoria para gastos' };
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

    const esGasto = transaccionData.es_gasto !== undefined ? transaccionData.es_gasto : true;
    const monto = parseFloat(transaccionData.monto);
    
    // Si es GASTO, validar que haya presupuesto disponible en la categoría
    if (esGasto) {
      const categoria = transaccionData.categoria.trim();
      
      // Obtener presupuesto de la categoría
      const presupuestoResult = await PresupuestoModel.getByCategoria(categoria);
      if (!presupuestoResult.success || !presupuestoResult.data) {
        return {
          success: false,
          error: 'No se encontró un presupuesto para esta categoría'
        };
      }

      const presupuesto = presupuestoResult.data;
      const montoDisponible = parseFloat(presupuesto.monto) || 0;

      // Validar que el gasto no exceda el monto disponible en el presupuesto
      if (monto > montoDisponible) {
        return {
          success: false,
          error: `El gasto excede el monto disponible en esta categoría ($${montoDisponible.toFixed(2)}).`
        };
      }

      // Crear la transacción
      const result = await TransaccionModel.create(transaccionData);
      if (result.success) {
        // Restar el monto del presupuesto
        const nuevoMonto = Math.max(0, montoDisponible - monto);
        await PresupuestoModel.updateMonto(presupuesto.id, nuevoMonto);
        
        this.notifyListeners();
      }
      return result;
    } else {
      // Si es INGRESO, simplemente crear la transacción (sin afectar presupuestos)
      const result = await TransaccionModel.create({
        ...transaccionData,
        categoria: transaccionData.categoria || 'Ingreso' // Categoría por defecto
      });
      
      if (result.success) {
        this.notifyListeners();
      }
      return result;
    }
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

  // Obtener total de ingresos
  async obtenerTotalIngresos() {
    try {
      const transacciones = await this.obtenerTransacciones();
      const totalIngresos = transacciones
        .filter(t => !t.es_gasto || t.es_gasto === 0)
        .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);
      
      return {
        success: true,
        data: { total: totalIngresos }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: { total: 0 }
      };
    }
  }

  // Obtener total de gastos
  async obtenerTotalGastos() {
    try {
      const transacciones = await this.obtenerTransacciones();
      const totalGastos = transacciones
        .filter(t => t.es_gasto === 1 || t.es_gasto === true)
        .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);
      
      return {
        success: true,
        data: { total: totalGastos }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: { total: 0 }
      };
    }
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

    // Obtener la transacción anterior para revertir cambios
    const transaccionAnterior = await this.obtenerTransaccionPorId(id);
    if (!transaccionAnterior) {
      return {
        success: false,
        error: 'No se encontró la transacción a editar'
      };
    }

    const esGastoAnterior = transaccionAnterior.es_gasto === 1 || transaccionAnterior.es_gasto === true;
    const montoAnterior = parseFloat(transaccionAnterior.monto);
    const categoriaAnterior = transaccionAnterior.categoria.trim();

    const esGastoNuevo = transaccionData.es_gasto !== undefined ? transaccionData.es_gasto : esGastoAnterior;
    const montoNuevo = parseFloat(transaccionData.monto);
    const categoriaNueva = transaccionData.categoria.trim();

    // Solo afectar presupuestos si es/era gasto
    if (esGastoAnterior) {
      // Revertir el gasto anterior en el presupuesto
      const presupuestoAnteriorResult = await PresupuestoModel.getByCategoria(categoriaAnterior);
      if (presupuestoAnteriorResult.success && presupuestoAnteriorResult.data) {
        const presupuestoAnterior = presupuestoAnteriorResult.data;
        const montoAnteriorCat = parseFloat(presupuestoAnterior.monto) || 0;
        const limiteAnterior = parseFloat(presupuestoAnterior.limite) || 0;
        
        // Devolver el monto al presupuesto
        const montoRevertido = Math.min(limiteAnterior, montoAnteriorCat + montoAnterior);
        await PresupuestoModel.updateMonto(presupuestoAnterior.id, montoRevertido);
      }
    }

    // Si el nuevo es gasto, validar y aplicar
    if (esGastoNuevo) {
      const presupuestoNuevoResult = await PresupuestoModel.getByCategoria(categoriaNueva);
      if (!presupuestoNuevoResult.success || !presupuestoNuevoResult.data) {
        return {
          success: false,
          error: 'No se encontró un presupuesto para esta categoría'
        };
      }

      const presupuestoNuevo = presupuestoNuevoResult.data;
      const montoDisponible = parseFloat(presupuestoNuevo.monto) || 0;

      if (montoNuevo > montoDisponible) {
        // Revertir cambios
        if (esGastoAnterior) {
          const presupuestoAnteriorResult = await PresupuestoModel.getByCategoria(categoriaAnterior);
          if (presupuestoAnteriorResult.success && presupuestoAnteriorResult.data) {
            const presupuestoAnterior = presupuestoAnteriorResult.data;
            const montoAnteriorCat = parseFloat(presupuestoAnterior.monto) || 0;
            const limiteAnterior = parseFloat(presupuestoAnterior.limite) || 0;
            const montoRevertido = Math.max(0, montoAnteriorCat - montoAnterior);
            await PresupuestoModel.updateMonto(presupuestoAnterior.id, montoRevertido);
          }
        }
        
        return {
          success: false,
          error: `El gasto excede el monto disponible ($${montoDisponible.toFixed(2)}).`
        };
      }

      // Actualizar la transacción
      const result = await TransaccionModel.update(id, transaccionData);
      if (result.success) {
        // Restar el nuevo monto del presupuesto nuevo
        const nuevoMonto = Math.max(0, montoDisponible - montoNuevo);
        await PresupuestoModel.updateMonto(presupuestoNuevo.id, nuevoMonto);
        
        this.notifyListeners();
      }
      return result;
    } else {
      // Si es ingreso, solo actualizar
      const result = await TransaccionModel.update(id, transaccionData);
      if (result.success) {
        this.notifyListeners();
      }
      return result;
    }
  }

  // Eliminar transacción
  async eliminarTransaccion(id) {
    const transaccion = await this.obtenerTransaccionPorId(id);
    if (!transaccion) {
      return {
        success: false,
        error: 'No se encontró la transacción'
      };
    }

    const result = await TransaccionModel.delete(id);
    if (result.success) {
      // Si era un gasto, devolver el monto al presupuesto
      const esGasto = transaccion.es_gasto === 1 || transaccion.es_gasto === true;
      if (esGasto) {
        const monto = parseFloat(transaccion.monto);
        const categoria = transaccion.categoria.trim();

        const presupuestoResult = await PresupuestoModel.getByCategoria(categoria);
        if (presupuestoResult.success && presupuestoResult.data) {
          const presupuesto = presupuestoResult.data;
          const montoActual = parseFloat(presupuesto.monto) || 0;
          const limite = parseFloat(presupuesto.limite) || 0;

          // Devolver el monto al presupuesto
          const nuevoMonto = Math.min(limite, montoActual + monto);
          await PresupuestoModel.updateMonto(presupuesto.id, nuevoMonto);
        }
      }

      this.notifyListeners();
    }
    return result;
  }

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
