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
        if (!data.nombre || !data.nombre.trim()) {
            return { valid: false, message: "El nombre del presupuesto es obligatorio" };
        }
        if (!data.categoria || !data.categoria.trim()) {
            return { valid: false, message: "La categoría es obligatoria" };
        }
        if (!data.monto || isNaN(data.monto) || parseFloat(data.monto) <= 0){
            return { valid: false, message: "El monto debe ser un número positivo" };
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
    
}