import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, ScrollView} from "react-native";
import React, { useState } from "react";
import PresupuestoController from "../controllers/PresupuestoController";

export default function NuevoPresupuestoScreen({ navigation, onBack }) {
  const [nombre, setNombre] = useState("");
  const [limite, setLimite] = useState("");

  const handleGuardar = async () => {
    if (!nombre.trim() || !limite.trim()) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    const limiteNum = parseFloat(limite);
    if (isNaN(limiteNum) || limiteNum <= 0) {
      Alert.alert("Error", "El límite debe ser un número mayor a 0");
      return;
    }

    const data = {
      categoria: nombre.trim(), // Usamos categoria como nombre del presupuesto
      monto: 0, // Valor inicial en 0
      limite: limiteNum // Límite máximo
    };

    const result = await PresupuestoController.crearPresupuesto(data);

    if (!result.success){
        Alert.alert("Error", result.error);
        return;
    }
    
    // Notificar a los listeners
    PresupuestoController.notifyListeners();
    
    Alert.alert("Éxito", "Presupuesto creado correctamente", [
      {
        text: "OK",
        onPress: () => {
          if (onBack) {
            onBack();
          } else if (navigation) {
            navigation.goBack();
          }
        }
      }
    ]);
  };

  const handleCancelar = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/fondo2.jpg')} 
      resizeMode='cover'
      style={styles.backgrounds}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contenido}>
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Nuevo Presupuesto</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre del presupuesto</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Alimentación, Transporte..."
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Límite (Monto máximo)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 5000"
                placeholderTextColor="#999"
                value={limite}
                onChangeText={setLimite}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.botonesContainer}>
              <TouchableOpacity 
                style={[styles.boton, styles.botonCancelar]} 
                onPress={handleCancelar}
              >
                <Text style={styles.botonTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.boton, styles.botonGuardar]} 
                onPress={handleGuardar}
              >
                <Text style={styles.botonTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgrounds: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  contenido: {
    flex: 1,
    paddingTop: 30,
  },
  tituloContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#001F3F',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#E8D9C8',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#001F3F',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001F3F',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7EFE6',
    borderWidth: 2,
    borderColor: '#001F3F',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#001F3F',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  boton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
  },
  botonCancelar: {
    backgroundColor: '#F5E6D3',
    borderColor: '#001F3F',
  },
  botonGuardar: {
    backgroundColor: '#001F3F',
    borderColor: '#001F3F',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonTextoCancelar: {
    color: '#001F3F',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
