import PresupuestoModel from "../models/PresupuestoModel";
import TransaccionController from "./TransaccionController";
import DatabaseService from '../database/DatabaseService';

class PresupuestoController {
    constructor() {
        this.listeners = [];
        this.initialized = false;
    }

    // Inicializar 
    async initialize() {
        if (this.initialized) return;
        try {
            await DatabaseService.init();
            this.initialized = true;
            console.log('PresupuestoController initialized');
        } catch (error) {
            console.error('Error initializing PresupuestoController:', error);
        }
    }

    // Obtener dinero disponible para asignar
    // Dinero disponible = Total Ingresos - Total Gastos - Total Presupuestos Asignados
    async obtenerDineroDisponible() {
        try {
            // Obtener total de ingresos
            const ingresosResult = await TransaccionController.obtenerTotalIngresos();
            const totalIngresos = ingresosResult.data?.total || 0;

            // Obtener total de gastos
            const gastosResult = await TransaccionController.obtenerTotalGastos();
            const totalGastos = gastosResult.data?.total || 0;

            // Obtener total de presupuestos asignados (suma de todos los montos)
            const presupuestos = await this.obtenerPresupuestos();
            const totalAsignado = presupuestos.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);

            // Dinero disponible = ingresos - gastos - presupuestos asignados
            const dineroDisponible = totalIngresos - totalGastos - totalAsignado;

            return {
                success: true,
                data: {
                    disponible: Math.max(0, dineroDisponible),
                    totalIngresos,
                    totalGastos,
                    totalAsignado
                }
            };
        } catch (error) {
            console.error('Error al calcular dinero disponible:', error);
            return {
                success: false,
                error: error.message,
                data: {
                    disponible: 0,
                    totalIngresos: 0,
                    totalGastos: 0,
                    totalAsignado: 0
                }
            };
        }
    }

    // Validar Presupuesto
    validatePresupuesto(data){
        if (!data.categoria || !data.categoria.trim()) {
            return { valid: false, message: "La categoría es obligatoria" };
        }
        
        // Validar limite (ahora es el monto asignado a esa categoría)
        if (data.limite === undefined || data.limite === null) {
            return { valid: false, message: "El monto a asignar es obligatorio" };
        }
        if (isNaN(data.limite) || parseFloat(data.limite) <= 0) {
            return { valid: false, message: "El monto debe ser mayor a 0" };
        }
        
        return{ valid: true, message: "" };    
    }

    // Crear un nuevo presupuesto
    async crearPresupuesto(data) {
        const validation = this.validatePresupuesto(data);
        if (!validation.valid){
            return { success: false, error: validation.message };
        }

        // Obtener dinero disponible
        const dineroDisponibleResult = await this.obtenerDineroDisponible();
        const disponible = dineroDisponibleResult.data?.disponible || 0;

        const montoAsignar = parseFloat(data.limite);

        // Validar que no exceda el dinero disponible
        if (montoAsignar > disponible) {
            return {
                success: false,
                error: `No tienes suficiente dinero disponible. Disponible: $${disponible.toFixed(2)}`
            };
        }

        // Crear presupuesto con el monto asignado
        const result = await PresupuestoModel.create({
            categoria: data.categoria,
            monto: montoAsignar,
            limite: montoAsignar
        });

        if (result.success) {
            this.notifyListeners();
        }
        return result;
    }

    // Obtener todos
    async obtenerPresupuestos(){
        const result = await PresupuestoModel.getAll();
        return result.data || [];
    }

    // Obtener por ID
    async obtenerPresupuestosPorId(id){
        const result = await PresupuestoModel.getById(id);
        return result.data;
    }

    // Editar Presupuesto (solo categoría y límite)
    async editarPresupuesto(id, data) {
        if (!data.categoria || !data.categoria.trim()) {
            return { success: false, error: "La categoría es obligatoria" };
        }
        if (data.monto === undefined || data.monto === null || isNaN(data.monto) || parseFloat(data.monto) <= 0) {
            return { success: false, error: "El monto asignado debe ser mayor a $0" };
        }

        // Obtener presupuesto actual
        const presupuestoActual = await PresupuestoModel.getById(id);
        if (!presupuestoActual.success || !presupuestoActual.data) {
            return { success: false, error: "Presupuesto no encontrado" };
        }

        const montoAnterior = parseFloat(presupuestoActual.data.monto || 0);
        const nuevoMonto = parseFloat(data.monto);
        const diferencia = nuevoMonto - montoAnterior;

        // Si se está aumentando el monto, verificar que haya dinero disponible
        if (diferencia > 0) {
            const dineroDisponibleResult = await this.obtenerDineroDisponible();
            // El dinero disponible ya no incluye este presupuesto, así que sumamos su monto actual
            const disponible = (dineroDisponibleResult.data?.disponible || 0) + montoAnterior;

            if (nuevoMonto > disponible) {
                return {
                    success: false,
                    error: `No tienes suficiente dinero disponible. Disponible: $${disponible.toFixed(2)}`
                };
            }
        }

        // Actualizar categoría y monto
        const result = await PresupuestoModel.updateCategoriaYLimite(id, data.categoria.trim(), nuevoMonto);

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

    // Total general de presupuestos asignados
    async obtenerTotalPresupuestos() {
        const presupuestos = await this.obtenerPresupuestos();
        const total = presupuestos.reduce((sum, p) => sum + parseFloat(p.limite || 0), 0);
        return {
            success: true,
            data: { total }
        };
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
