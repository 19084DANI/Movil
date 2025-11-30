import PresupuestoModel from "../models/PresupuestoModel";

class PresupuestoController {
    constructor() {
        this.listeners = [];
        this.initialized = false;
        this.PRESUPUESTO_GENERAL_MAX = 15000; // limite general
    }
}