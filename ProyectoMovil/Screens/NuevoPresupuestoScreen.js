import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from "react-native";
import React, { useState } from "react";
import PresupuestoController from "../controllers/PresupuestoController";

export default function NuevoPresupuestoScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  
  }
