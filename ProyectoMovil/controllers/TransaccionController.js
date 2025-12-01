// controlador de Transacciones

import TransaccionModel from '../models/TransaccionModel';
import PresupuestoModel from '../models/PresupuestoModel';

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

    if (!data.categoria || !data.categoria.trim()) {
      return { valid: false, message: 'La categoría es obligatoria' };
    }
    if (!data.fecha || !data.fecha.trim()) {
      return { valid: false, message: 'La fecha es obligatoria' };
    }
    if (!data.descripcion || !data.descripcion.trim()) {
      return { valid: false, message: 'La descripción es obligatoria' };
    }
 //   if (!data.es_gasto || (data.es_gasto.toLowerCase() !== 'si' && data.es_gasto.toLowerCase() !== 'no')) {
   //   return { valid: false, message: 'Especifique si es gasto (Sí/No)' };
    //}
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

    // Validar presupuesto antes de crear la transacción
    const esGasto = transaccionData.es_gasto !== undefined ? transaccionData.es_gasto : true;
    const monto = parseFloat(transaccionData.monto);
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
    const montoActual = parseFloat(presupuesto.monto) || 0;
    const limite = parseFloat(presupuesto.limite) || 0;

    // Validaciones según el tipo de transacción
    if (esGasto) {
      // Si es gasto y el monto actual es 0 o menor, no permitir
      if (montoActual <= 0) {
        return {
          success: false,
          error: 'No puedes hacer gastos en esta categoría. El presupuesto está en 0. Agrega un ingreso primero.'
        };
      }
      // Si el gasto excede el monto disponible, no permitir
      if (monto > montoActual) {
        return {
          success: false,
          error: `El gasto excede el monto disponible ($${montoActual.toFixed(2)}).`
        };
      }
    } else {
      // Si es ingreso y el monto actual ya alcanzó el límite, no permitir
      if (montoActual >= limite) {
        return {
          success: false,
          error: `No puedes agregar más ingresos. El presupuesto ya alcanzó su límite ($${limite.toFixed(2)}).`
        };
      }
      // Si el ingreso haría que se exceda el límite, no permitir
      if (montoActual + monto > limite) {
        const maxPermitido = limite - montoActual;
        return {
          success: false,
          error: `El ingreso excede el límite disponible. Solo puedes agregar hasta $${maxPermitido.toFixed(2)}.`
        };
      }
    }

    // Crear la transacción
    const result = await TransaccionModel.create(transaccionData);
    if (result.success) {
      // Actualizar el presupuesto según el tipo de transacción
      let nuevoMonto;
      if (esGasto) {
        nuevoMonto = Math.max(0, montoActual - monto);
      } else {
        nuevoMonto = Math.min(limite, montoActual + monto);
      }

      // Actualizar el monto del presupuesto
      await PresupuestoModel.updateMonto(presupuesto.id, nuevoMonto);
      
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

    // Obtener la transacción anterior para revertir el cambio
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

    // Validar presupuesto para la nueva transacción
    const presupuestoResult = await PresupuestoModel.getByCategoria(categoriaNueva);
    if (!presupuestoResult.success || !presupuestoResult.data) {
      return {
        success: false,
        error: 'No se encontró un presupuesto para esta categoría'
      };
    }

    const presupuesto = presupuestoResult.data;
    let montoActual = parseFloat(presupuesto.monto) || 0;
    const limite = parseFloat(presupuesto.limite) || 0;

    // Revertir el cambio anterior
    if (esGastoAnterior) {
      montoActual = Math.min(limite, montoActual + montoAnterior);
    } else {
      montoActual = Math.max(0, montoActual - montoAnterior);
    }

    // Validar la nueva transacción
    if (esGastoNuevo) {
      if (montoActual <= 0) {
        return {
          success: false,
          error: 'No puedes hacer gastos en esta categoría. El presupuesto está en 0. Agrega un ingreso primero.'
        };
      }
      if (montoNuevo > montoActual) {
        return {
          success: false,
          error: `El gasto excede el monto disponible ($${montoActual.toFixed(2)}).`
        };
      }
    } else {
      if (montoActual >= limite) {
        return {
          success: false,
          error: `No puedes agregar más ingresos. El presupuesto ya alcanzó su límite ($${limite.toFixed(2)}).`
        };
      }
      if (montoActual + montoNuevo > limite) {
        const maxPermitido = limite - montoActual;
        return {
          success: false,
          error: `El ingreso excede el límite disponible. Solo puedes agregar hasta $${maxPermitido.toFixed(2)}.`
        };
      }
    }

    // Actualizar la transacción
    const result = await TransaccionModel.update(id, transaccionData);
    if (result.success) {
      // Aplicar el nuevo cambio en el presupuesto
      let nuevoMonto;
      if (esGastoNuevo) {
        nuevoMonto = Math.max(0, montoActual - montoNuevo);
      } else {
        nuevoMonto = Math.min(limite, montoActual + montoNuevo);
      }

      await PresupuestoModel.updateMonto(presupuesto.id, nuevoMonto);
      
      // Si cambió de categoría, también actualizar la categoría anterior
      if (categoriaAnterior !== categoriaNueva) {
        const presupuestoAnteriorResult = await PresupuestoModel.getByCategoria(categoriaAnterior);
        if (presupuestoAnteriorResult.success && presupuestoAnteriorResult.data) {
          const presupuestoAnterior = presupuestoAnteriorResult.data;
          const montoAnteriorCat = parseFloat(presupuestoAnterior.monto) || 0;
          const limiteAnterior = parseFloat(presupuestoAnterior.limite) || 0;

          let nuevoMontoAnterior;
          if (esGastoAnterior) {
            nuevoMontoAnterior = Math.min(limiteAnterior, montoAnteriorCat + montoAnterior);
          } else {
            nuevoMontoAnterior = Math.max(0, montoAnteriorCat - montoAnterior);
          }

          await PresupuestoModel.updateMonto(presupuestoAnterior.id, nuevoMontoAnterior);
        }
      }

      this.notifyListeners();
    }
    return result;
  }

  // Eliminar transacción
  async eliminarTransaccion(id) {
    // Obtener la transacción antes de eliminarla para revertir el cambio en presupuesto
    const transaccion = await this.obtenerTransaccionPorId(id);
    if (!transaccion) {
      return {
        success: false,
        error: 'No se encontró la transacción'
      };
    }

    const result = await TransaccionModel.delete(id);
    if (result.success) {
      // Revertir el cambio en el presupuesto
      const esGasto = transaccion.es_gasto === 1 || transaccion.es_gasto === true;
      const monto = parseFloat(transaccion.monto);
      const categoria = transaccion.categoria.trim();

      const presupuestoResult = await PresupuestoModel.getByCategoria(categoria);
      if (presupuestoResult.success && presupuestoResult.data) {
        const presupuesto = presupuestoResult.data;
        const montoActual = parseFloat(presupuesto.monto) || 0;
        const limite = parseFloat(presupuesto.limite) || 0;

        let nuevoMonto;
        if (esGasto) {
          // Si era un gasto, revertir sumando el monto
          nuevoMonto = Math.min(limite, montoActual + monto);
        } else {
          // Si era un ingreso, revertir restando el monto
          nuevoMonto = Math.max(0, montoActual - monto);
        }

        await PresupuestoModel.updateMonto(presupuesto.id, nuevoMonto);
      }

      this.notifyListeners();
    }
    return result;
  }

  // Obtener total de gastos
  async obtenerTotalGastos() {
    return await TransaccionModel.getTotalGastos();
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
