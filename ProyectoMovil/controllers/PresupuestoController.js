import PresupuestoModel from "../models/PresupuestoModel";

class PresupuestoController {
    constructor() {
        this.listeners = [];
        this.initialized = false;
        this.PRESUPUESTO_GENERAL_MAX = 15000; // limite general
    }
    // Inicializar 
    async initialized() {
        if (this.initialized) return;
        this.initialized = true;
    }

    // Validar Presupuesto
    validatePresupuesto(data){
        if (!data.categoria || !data.categoria.trim()) {
            return { valid: false, message: "La categoría es obligatoria" };
        }
        if (data.monto === undefined || data.monto === null || isNaN(data.monto) || parseFloat(data.monto) < 0){
            return { valid: false, message: "El monto debe ser un número válido" };
        }
        // Validar limite si está presente
        if (data.limite !== undefined && data.limite !== null) {
            if (isNaN(data.limite) || parseFloat(data.limite) <= 0) {
                return { valid: false, message: "El límite debe ser un número mayor a 0" };
            }
        }
        return{ valid: true, message: "" };    
    }

    //Crear un nuevo presupuesto
    async crearPresupuesto(data) {
        const validation = this.validatePresupuesto(data);
        if (!validation.valid){
            return { success: false, error: validation.message };
        }

        //Obtener total actual
        const totalResult = await PresupuestoModel.getSumaPresupuestos();
        const totalActual = totalResult.data?.total || 0;

        const nuevoTotal = totalActual + parseFloat(data.monto);

        //Validar límite
        if (nuevoTotal > this.PRESUPUESTO_GENERAL_MAX){
            return {
                success: false,
                error: `El presupuesto total excede el límite general de $${this.PRESUPUESTO_GENERAL_MAX}`
            };
        }

        //Crear en BD
        const result = await PresupuestoModel.create(data);

        if (result.success) {
            this.notifyListeners();
        }
        return result;
    }
    //Obtener todos
    async obtenerPresupuestos(){
        const result = await PresupuestoModel.getAll();
        return result.data || [];
    }
    //Obtener por ID
    async obtenerPresupuestosPorId(id){
        const result = await PresupuestoModel.getById(id);
        return result.data;
    }
    //Editar Presupuesto
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

    // Actualizar solo el monto (más eficiente para sliders)
    async actualizarMonto(id, montoNuevo) {
        if (montoNuevo === undefined || montoNuevo === null || isNaN(montoNuevo) || parseFloat(montoNuevo) < 0) {
            return { success: false, error: "El monto debe ser un número válido" };
        }

        const totalResult = await PresupuestoModel.getSumaPresupuestos();
        const totalActual = totalResult.data?.total || 0;

        // Obtener presupuesto previo para recalcular
        const viejo = await PresupuestoModel.getById(id);
        const montoViejo = viejo.data?.monto || 0;

        const totalSinViejo = totalActual - montoViejo;
        const nuevoTotal = totalSinViejo + parseFloat(montoNuevo);

        if (nuevoTotal > this.PRESUPUESTO_GENERAL_MAX) {
            return {
                success: false,
                error: `El presupuesto total excede el límite general de $${this.PRESUPUESTO_GENERAL_MAX}`
            };
        }

        const result = await PresupuestoModel.updateMonto(id, montoNuevo);

        if (result.success) {
            this.notifyListeners();
        }

        return result;
    }

    // Eliminar
    async eliminarPresupuesto(id){
        const result = await PresupuestoModel.delete(id);
        if (result.success) {
            this.notifyListeners();
        }
        return result;
    }

    //Total general
    async obtenerTotalPresupuestos() {
        return await PresupuestoModel.getSumaPresupuestos();
    }

    // Listeners
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