import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, ScrollView} from "react-native";
import React, { useState, useEffect } from "react";
import PresupuestoController from "../controllers/PresupuestoController";

export default function EditarPresuScreen({ navigation, onBack, presupuesto }) {
  const [nombre, setNombre] = useState("");
  const [montoAsignado, setMontoAsignado] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (presupuesto) {
      setNombre(presupuesto.categoria || "");
      setMontoAsignado(presupuesto.monto ? presupuesto.monto.toString() : "");
    }
  }, [presupuesto]);

  const handleGuardar = async () => {
    if (!nombre.trim() || !montoAsignado.trim()) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    const montoNum = parseFloat(montoAsignado);
    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert("Error", "El monto asignado debe ser mayor a $0");
      return;
    }

    // Verificar si hay cambios
    const hayCambios = 
      nombre.trim() !== (presupuesto?.categoria || "") || 
      montoNum !== (presupuesto?.monto || 0);

    if (!hayCambios) {
      Alert.alert("Información", "No se han realizado cambios");
      return;
    }

    // Mostrar confirmación
    Alert.alert(
      "Confirmar cambios",
      `¿Está seguro de que desea guardar estos cambios?\n\nCategoría: ${nombre.trim()}\nMonto asignado: $${montoNum.toLocaleString()}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            // Se queda en la pantalla de edición
          }
        },
        {
          text: "Guardar",
          onPress: async () => {
            await guardarCambios(nombre.trim(), montoNum);
          }
        }
      ]
    );
  };

  const guardarCambios = async (categoria, monto) => {
    if (!presupuesto || !presupuesto.id) {
      Alert.alert("Error", "No se pudo identificar el presupuesto a editar");
      return;
    }

    setLoading(true);
    try {
      const result = await PresupuestoController.editarPresupuesto(
        presupuesto.id,
        {
          categoria: categoria,
          monto: monto
        }
      );

      if (!result.success) {
        Alert.alert("Error", result.error || "Error al actualizar el presupuesto");
        setLoading(false);
        return;
      }

      // Notificar a los listeners
      PresupuestoController.notifyListeners();

      Alert.alert("Éxito", "Presupuesto actualizado correctamente", [
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
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.titulo}>Editar Presupuesto</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre de la categoría</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Alimentación, Transporte..."
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Monto asignado</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 5000"
                placeholderTextColor="#999"
                value={montoAsignado}
                onChangeText={setMontoAsignado}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.botonesContainer}>
              <TouchableOpacity 
                style={[styles.boton, styles.botonCancelar]} 
                onPress={handleCancelar}
                disabled={loading}
              >
                <Text style={styles.botonTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.boton, styles.botonGuardar, loading && styles.botonDisabled]} 
                onPress={handleGuardar}
                disabled={loading}
              >
                <Text style={styles.botonTexto}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
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
    backgroundColor: '#79B7B4',
    borderColor: '#001F3F',
  },
  botonDisabled: {
    opacity: 0.5,
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

