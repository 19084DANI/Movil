import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert} from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreen from "./HomeScreen";
import NuevoPresupuestoScreen from "./NuevoPresupuestoScreen";
import { Ionicons } from "@expo/vector-icons";
import PresupuestoController from "../controllers/PresupuestoController";

export default function PresupuestosScreen() {
  const [screen, setScreen] = useState("default");
  const [presupuestos, setPresupuestos] = useState([]);
  const [presupuestoGeneral, setPresupuestoGeneral] = useState(15000);
  const [totalUsado, setTotalUsado] = useState(0);

  // Cargar información al iniciar
  const cargarPresupuestos = async () => {
    const lista = await PresupuestoController.obtenerPresupuestos();
    setPresupuestos(lista);

    // Calcular total usado
    const total = lista.reduce((acc, p) => acc + parseFloat(p.monto), 0);
    setTotalUsado(total);
  };
  
}