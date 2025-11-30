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
        return{
            valid: true, message: ""
        };
    }
}