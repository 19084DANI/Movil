import React, { useState } from "react";
import { View, Text, TextInput, Alert, Button, StyleSheet, ScrollView, Image, ImageBackground} from "react-native";
import HomeScreen from './HomeScreen';
import TransaccionesScreen from './TransaccionesScreen';
import { TouchableOpacity } from 'react-native';
export default function FormularioTransaccion() {
  const [screen, setScreen]=useState('default');
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
    } else if (gasto.toLowerCase() !== "si" && gasto.toLowerCase() !== "no") {
      Alert.alert("Gasto debe ser 'Si' o 'No'");
    } else {
      Alert.alert(
        "Transacción creada",
        `Nombre: ${nombre}\nMonto: ${monto}\nCategoría: ${categoria}\nFecha: ${fecha}\nDescripción: ${descripcion}\nGasto: ${gasto}`
      );
      setScreen('Transacciones');
    }
  };
     switch(screen){
          case 'homee':
              return <HomeScreen/>
          case 'Transacciones':
              return <TransaccionesScreen/>
          default:
  return (
    <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
                 style={styles.backgrounds} >
     <View style={styles.encabezado}>  
               <Image style={styles.menuhamburgesa} source={require('../assets/menu.png')}></Image>     
                  <TouchableOpacity onPress={() => setScreen('homee')}>
                           <Image
                            style={styles.logo}
                            source={require('../assets/logo.jpg')}
                           ></Image>  
                           </TouchableOpacity> 
     
               </View>
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
      <View style={styles.encabezado2}>
                            
                </View>
    </ImageBackground>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
   // backgroundColor: "#efe851ff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  encabezado2:{
  
alignItems: "center",
backgroundColor: '#EEF5DB',
padding: 10,
borderRadius:10,
marginBottom:0,
width: '100%',
height: '10%',
},
  menuhamburgesa:{
  width: 35,
  height: 35,
  },
  logo:{
  width: 130,
  height: 90,
  borderRadius: 45,
  borderColor: '#f4e45dff',
  borderWidth:5
  },
  encabezado:{
  justifyContent:'space-between',
  flexDirection: 'row',
  alignItems: "center",
  backgroundColor: '#EEF5DB',
  padding: 10,
  borderRadius:10,
  marginBottom:0,
  width: '100%',
  height: '10%',

},
  formContainer: {
    width: 350,
    height:700,
    backgroundColor: "#EEF5DB",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  titulo: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000ff",
  },
  texto: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  inputs: {
    width: "80%",
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    backgroundColor: "#dde2ceff",
    marginBottom: 10,
  },
  backgrounds: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '100%',
},
});