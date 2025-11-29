import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Image, ImageBackground, Pressable } from "react-native";
import HomeScreen from './HomeScreen';
import TransaccionesScreen from './TransaccionesScreen';
import { TouchableOpacity } from 'react-native';
import TransaccionController from '../controllers/TransaccionController';
import { Ionicons } from '@expo/vector-icons';

const controller = TransaccionController;

export default function FormularioTransaccion() {
  const [screen, setScreen] = useState('default');
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Fecha actual por defecto
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split("T")[0];
  });

  const mostrarAlerta = async () => {

    //  Corrección importante:
    
    if (!nombre && !monto && !categoria && !fecha && !descripcion) {
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
    } else {

      try {
        setGuardando(true);
 const res = await controller.crearTransaccion({
          nombre: nombre.trim(),
          monto: monto.trim(),
          categoria: categoria.trim(),
          fecha: fecha.trim(),
          descripcion: descripcion.trim(),
        });

        if (res.success) {
          Alert.alert(
            "Transacción creada",
            `Nombre: ${nombre}\nMonto: $${monto}\nCategoría: ${categoria}`,
            [{
              text: 'Aceptar',
              onPress: () => {
                setNombre('');
                setMonto('');
                setCategoria('');
                setDescripcion('');
            
                setScreen('Transacciones');
              }
            }]
          );
        } else {
          Alert.alert('Error', res.error || 'No se pudo crear la transacción');
        }

      } catch (error) {
        Alert.alert('Error', error.message || 'Error al crear la transacción');
      } finally {
        setGuardando(false);
      }
    }
  };

  switch (screen) {
    case 'homee':
      return <HomeScreen />;
    case 'Transacciones':
      return <TransaccionesScreen />;
    default:
      return (
        <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover' style={styles.backgrounds} >
          
          <View style={styles.encabezado}>
            <TouchableOpacity onPress={() => setScreen('homee')}>
              <Image style={styles.logo} source={require('../assets/Logo.jpeg')} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
              <View style={styles.formContainer2}>

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
                  value={fecha}
                  editable={false}
                  placeholderTextColor='#777'
                />

                <Text style={styles.texto}>Descripción</Text>
                <TextInput
                  style={styles.inputDescripcion}
                  placeholder="Ej. Recibo de CFE"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  multiline={true}
                />

                <View style={{ marginTop: 10 }}>
                  <Pressable
                    style={styles.Button}
                    onPress={mostrarAlerta}
                    disabled={guardando}
                  >
                    <Text style={styles.textoBoton}>
                      {guardando ? "Guardando..." : "CREAR TRANSACCIÓN"}
                    </Text>
                  </Pressable>
                </View>

              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      );
  }
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 45,
    borderColor: '#2d526eff',
    borderWidth: 3,
    position: 'absolute',
    left: -35,
    top: -10,
  },
  encabezado: {
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: '#e5e9dbff',
    padding: 10,
    width: '100%',
    height: '10%',
  },
  formContainer: {
    width: 450,
    height: 900,
    backgroundColor: "#182735ff",
    borderRadius: 40,
    padding: 20,
    alignItems: "center",
  },
  formContainer2: {
    width: '100%',
    height: '100%',
    backgroundColor: "#EEF5DB",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  titulo: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  texto: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  inputs: {
    width: "80%",
    borderColor: '#b0b0b0ff',
    borderWidth: 2,
    borderRadius: 17,
    padding: 8,
    backgroundColor: "#dde2ceff",
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
    fontSize: 15,
  },
  inputDescripcion: {
    width: "80%",
    borderColor: '#b0b0b0ff',
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 15,
    height: 150,
    padding: 8,
    backgroundColor: "#dde2ceff",
    marginBottom: 10,
    color: '#333',
    fontSize: 15,
  },
  backgrounds: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  Button: {
    width: 150,
    height: 45,
    backgroundColor: '#226485ff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  textoBoton: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  }
});
