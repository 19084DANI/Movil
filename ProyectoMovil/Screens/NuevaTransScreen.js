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
        <ImageBackground source={require('../assets/fondo2.jpg')} resizeMode='cover' style={styles.backgrounds} >
          
          <View style={styles.encabezado}>
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
                <View style={styles.categoriaContainer}>
                  {['Oficio', 'Personal', 'Fijo'].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.categoriaBtn,
                        categoria === opt && styles.categoriaBtnSelected,
                      ]}
                      onPress={() => setCategoria(opt)}
                    >
                      <Text
                        style={[
                          styles.categoriaBtnText,
                          categoria === opt && styles.categoriaBtnTextSelected,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

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
    width: 90,
    height: 90,
    borderRadius: 60,
    borderColor: '#001F3F',
    borderWidth: 3,
    position: 'absolute',
    left: -35,
    top: -70,
  },

  formContainer: {
    width: '99%',
    height: 850,
    backgroundColor: "#1a4050ff",
    borderRadius: 15,
    borderWidth:3,
    borderColor:'#2b5868ff',
    padding: 20,
    alignItems: "center",
    justifyContent:'center',
  },
  formContainer2: {
    width: '108%',
    height: '103%',
    backgroundColor: "#F5E6D3",
    borderRadius: 15,
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
    backgroundColor: "#F7EFE6",
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
    textAlign:'left',
    textAlignVertical:'top',   
    height: 150,
    padding: 8,
    backgroundColor: "#F7EFE6",
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
    backgroundColor: '#164b46ff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#265d63ff',
  },
  textoBoton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f5f6f8ff',
  }
  ,
  categoriaContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  categoriaBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F7EFE6',
    borderWidth: 2,
    borderColor: '#b0b0b0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriaBtnSelected: {
    backgroundColor: '#79B7B4',
    borderColor: '#79B7B4',
  },
  categoriaBtnText: {
    color: '#001F3F',
    fontWeight: '600',
  },
  categoriaBtnTextSelected: {
    color: '#fff',
  },
});
