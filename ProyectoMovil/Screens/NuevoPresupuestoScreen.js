import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from "react-native";
import React, { useState } from "react";
import PresupuestoController from "../controllers/PresupuestoController";

export default function NuevoPresupuestoScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const handleGuardar = async () => {
    const data = {
      nombre,
      categoria,
      monto
    };

    const result = await PresupuestoController.crearPresupuesto(data);

    if (!result.success){
        Alert.alert("Error", result.error);
        return;
    }
    Alert.alert("Éxito", "Presupuesto creado correctamente");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Nuevo Presupuesto</Text>

      <Text style={styles.label}>Nombre del presupuesto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Comida, Viajes..."
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Categoría</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Hogar, Transporte, Ocio..."
        value={categoria}
        onChangeText={setCategoria}
      />

      <Text style={styles.label}>Monto asignado</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 500"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.boton} onPress={handleGuardar}>
        <Text style={styles.botonTexto}>Guardar Presupuesto</Text>
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#333",
    textAlign: "center"
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    color: "#444",
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  boton: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
});
