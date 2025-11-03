import React, { useState } from "react";
import { View, Text, TextInput, Alert, Button, StyleSheet, ScrollView } from "react-native";

export default function FormularioTransaccion() {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [gasto, setGasto] = useState("");

  const mostrarAlerta = () => {
    if (!nombre && !monto && !categoria && !fecha && !descripcion && !gasto) {
      Alert.alert("Todos los campos están vacíos");
    } else if (!nombre.trim()) {
      Alert.alert("Nombre no puede estar vacío");
    } else if (!monto.trim()) {
      Alert.alert("Monto no puede estar vacío");
    } else if (isNaN(monto)) {
      Alert.alert("Monto debe ser numérico");
    } else if (!categoria.trim()) {
      Alert.alert("Categoría no puede estar vacía");
    } else if (!fecha.trim()) {
      Alert.alert("Fecha no puede estar vacía");
    } else if (!descripcion.trim()) {
      Alert.alert("Descripción no puede estar vacía");
    } else if (!gasto.trim()) {
      Alert.alert("Gasto no puede estar vacío");
    } else if (gasto.toLowerCase() !== "sí" && gasto.toLowerCase() !== "no") {
      Alert.alert("Gasto debe ser 'Sí' o 'No'");
    } else {
      Alert.alert(
        "Transacción creada",
        `Nombre: ${nombre}\nMonto: ${monto}\nCategoría: ${categoria}\nFecha: ${fecha}\nDescripción: ${descripcion}\nGasto: ${gasto}`
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Nueva Transacción</Text>

        <Text style={styles.texto}>Nombre</Text>
        <TextInput
          style={styles.inputs}
          placeholder="Ej. Pago de luz"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.texto}>Monto</Text>
        <TextInput
          style={styles.inputs}
          placeholder="$0.00"
          keyboardType="numeric"
          value={monto}
          onChangeText={setMonto}
        />

        <Text style={styles.texto}>Categoría</Text>
        <TextInput
          style={styles.inputs}
          placeholder="Ej. Servicios"
          value={categoria}
          onChangeText={setCategoria}
        />

        <Text style={styles.texto}>Fecha</Text>
        <TextInput
          style={styles.inputs}
          placeholder="DD/MM/AAAA"
          value={fecha}
          onChangeText={setFecha}
        />

        <Text style={styles.texto}>Descripción</Text>
        <TextInput
          style={styles.inputs}
          placeholder="Ej. Recibo de CFE"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <Text style={styles.texto}>Gasto</Text>
        <TextInput
          style={styles.inputs}
          placeholder="Sí/No"
          value={gasto}
          onChangeText={setGasto}
        />

        <View style={{ marginTop: 10 }}>
          <Button title="Crear Transacción" color="#0b7a89ff" onPress={mostrarAlerta} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#efe851ff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  formContainer: {
    width: "80%",
    backgroundColor: "#c2fc87ff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000ff",
  },
  texto: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  inputs: {
    width: "80%",
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
});