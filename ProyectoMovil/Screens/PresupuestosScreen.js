import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, Image, Button} from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreen from "./HomeScreen";
import NuevoPresupuestoScreen from "./NuevoPresupuestoScreen";
import EditarPresuScreen from "./EditarPresuScreen";
import { Ionicons } from "@expo/vector-icons";
import PresupuestoController from "../controllers/PresupuestoController";
import Slider from "@react-native-community/slider";


export default function PresupuestosScreen() {
  const [screen, setScreen]=useState('default');
  const [presupuestos, setPresupuestos] = useState([]);
  const [valoresTemporales, setValoresTemporales] = useState({});
  const [loading, setLoading] = useState(false);
  const [presupuestoAEditar, setPresupuestoAEditar] = useState(null);

  // Calcular total automáticamente desde valores temporales o guardados
  const calcularTotal = () => {
    const valores = Object.values(valoresTemporales);
    return valores.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };
  const preciot = calcularTotal();

  // Cargar presupuestos existentes
  const cargarPresupuestos = async () => {
    try {
      const presupuestosData = await PresupuestoController.obtenerPresupuestos();
      setPresupuestos(presupuestosData);
      
      // Inicializar valores temporales con los valores guardados de la BD
      // Esto asegura que la barra muestre la posición correcta basada en monto/limite
      const valoresIniciales = {};
      presupuestosData.forEach(p => {
        // Usar el monto guardado, asegurándose de que sea un número
        valoresIniciales[p.categoria] = parseFloat(p.monto) || 0;
      });
      setValoresTemporales(valoresIniciales);
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
    }
  };

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  // Recargar cuando se regrese de NuevoPresupuestoScreen
  useEffect(() => {
    if (screen === 'default') {
      cargarPresupuestos();
    }
  }, [screen]);

  const handleGuardar = async () => {
    setLoading(true);
    try {
      // Función auxiliar para actualizar o crear presupuesto
      const actualizarOCrear = async (categoria, monto) => {
        try {
          const existente = presupuestos.find(p => p.categoria === categoria);
          if (existente) {
            // Actualizar existente usando el método más eficiente
            const result = await PresupuestoController.actualizarMonto(existente.id, parseFloat(monto));
            if (!result.success) {
              console.error(`Error al actualizar ${categoria}:`, result.error);
              throw new Error(result.error || `Error al actualizar ${categoria}`);
            }
          } else {
            // Crear nuevo
            const result = await PresupuestoController.crearPresupuesto({
              categoria,
              monto: parseFloat(monto),
              limite: parseFloat(monto) * 1.5 // Límite por defecto
            });
            if (!result.success) {
              console.error(`Error al crear ${categoria}:`, result.error);
              throw new Error(result.error || `Error al crear ${categoria}`);
            }
          }
        } catch (error) {
          console.error(`Error en actualizarOCrear para ${categoria}:`, error);
          throw error;
        }
      };

      // Actualizar o crear cada presupuesto con los valores temporales
      // Guardar todos los valores, incluyendo 0
      for (const [categoria, monto] of Object.entries(valoresTemporales)) {
        // Guardar cualquier valor válido (>= 0), incluyendo 0
        if (monto !== undefined && monto !== null && !isNaN(monto) && parseFloat(monto) >= 0) {
          await actualizarOCrear(categoria, monto);
        }
      }

      // Notificar a los listeners para que HomeScreen se actualice
      PresupuestoController.notifyListeners();

      // Recargar los datos desde la BD (esto mantendrá los valores guardados)
      await cargarPresupuestos();

      Alert.alert('Éxito', 'Presupuestos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar presupuestos:', error);
      Alert.alert('Error', error.message || 'No se pudieron guardar los presupuestos');
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (categoria, value) => {
    // Solo actualizar el valor temporal en la UI, sin guardar en BD
    setValoresTemporales(prev => ({
      ...prev,
      [categoria]: value
    }));
  };

  const getValorTemporal = (categoria) => {
    // Si hay un valor temporal, usarlo (cambios no guardados)
    if (valoresTemporales[categoria] !== undefined) {
      return valoresTemporales[categoria];
    }
    // Si no, usar el monto guardado del presupuesto
    const presupuesto = presupuestos.find(p => p.categoria === categoria);
    return presupuesto ? (presupuesto.monto || 0) : 0;
  };

  const getLimiteMaximo = (categoria) => {
    // Buscar el presupuesto para obtener su límite guardado
    const presupuesto = presupuestos.find(p => p.categoria === categoria);
    if (presupuesto && presupuesto.limite) {
      return parseFloat(presupuesto.limite);
    }
    // Si no tiene límite guardado, usar límite por defecto
    const valorActual = getValorTemporal(categoria);
    const limitesPorDefecto = {
      'Alimentación': 5000,
      'Transporte': 5000,
      'Entretenimiento': 3000
    };
    const limiteDefecto = limitesPorDefecto[categoria] || 10000;
    return Math.max(limiteDefecto, valorActual * 1.5);
  };

  const getLimiteMinimo = (categoria) => {
    return 0;
  };
   switch(screen){
        case 'home':
            return <HomeScreen/>
        case 'nuevop':
          return <NuevoPresupuestoScreen onBack={() => setScreen('default')} />
        case 'editar':
          return (
            <EditarPresuScreen 
              onBack={async () => {
                setScreen('default');
                setPresupuestoAEditar(null);
                await cargarPresupuestos(); // Recargar para mostrar cambios
              }} 
              presupuesto={presupuestoAEditar}
            />
          )

        default:
    return (
      
      <ImageBackground source={require('../assets/fondo2.jpg')} resizeMode='cover'
        style={styles.backgrounds} >

          
          <View style={styles.contenido}>
     <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.Titulo2}>
          <Text style={styles.Titulo}>         Mis {'\n'} Presupuestos{'\n'}</Text>
         
        </View>

        <View style={styles.elementos}>
          <View style={styles.textoslide}>
          <Text style={styles.texto1}>Presupuesto{'\n'}Total:</Text>
           
            <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(preciot).toLocaleString()}</Text>
             </View>
           <View style={styles.totalInfo}>
             <Text style={styles.totalText}>
               Total calculado automáticamente
             </Text>
           </View>
        </View>

        {/* Renderizar dinámicamente todos los presupuestos */}
        {presupuestos.map((presupuesto) => {
          const valorActual = getValorTemporal(presupuesto.categoria);
          const maxValue = getLimiteMaximo(presupuesto.categoria);
          const minValue = getLimiteMinimo(presupuesto.categoria);
          
          // Asegurar que el valor esté dentro del rango del slider
          const valorSlider = Math.max(minValue, Math.min(maxValue, parseFloat(valorActual) || 0));
          
          return (
            <View key={presupuesto.id} style={styles.elementos}>
              <View style={styles.textoslide}>
                <Text style={styles.texto1}>{presupuesto.categoria}</Text>
                <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(valorActual).toLocaleString()}</Text>
              </View>
              <Slider 
                style={[{width:300, height: 50}, styles.slider]} 
                maximumValue={maxValue}
                minimumValue={minValue} 
                value={valorSlider}
                color='#5030efff' 
                onValueChange={(value) => handleSliderChange(presupuesto.categoria, value)}
                thumbTintColor='#3700ffff' 
                maximumTrackTintColor='#fff' 
                minimumTrackTintColor='#3f1ae2ff'
              />
              <View style={styles.botonEditarContainer}>
                <TouchableOpacity 
                  style={styles.botonEditar}
                  onPress={() => {
                    setPresupuestoAEditar(presupuesto);
                    setScreen('editar');
                  }}
                >
                  <Text style={styles.botonEditarTexto}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        <View style={{width:120}}>
          <Button 
            color='#79B7B4' 
            title={loading ? 'Guardando...' : 'Guardar'}
            onPress={handleGuardar}
            disabled={loading}
          />
        </View>

        <View style={{width:'100%', flexDirection:'row' ,justifyContent:'flex-end', padding:20}}>
          <TouchableOpacity onPress={() => setScreen('nuevop')}>
          <Image
              style={styles.agregar}
              source={require('../assets/plus.png')}
             ></Image>
              </TouchableOpacity>
        </View>
      </ScrollView>
        </View>
          <View style={styles.encabezado2}>
          
          </View>

      </ImageBackground>
      
    )
  }
  
    
}
const styles = StyleSheet.create({
precio:{
  color:'#000',
  fontWeight:'bold'
},

contenido: {
  padding:30,
  paddingBottom:40,
},

textoslide:{
justifyContent:'space-between',
flexDirection:'row',
paddingHorizontal:10
},
texto1:{
  fontSize:27,
  fontWeight:'bold',
  color:'#fff'
},

slider:{
paddingHorizontal: 12,

},
backgrounds: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '100%',
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
agregar:{

width: 45,
height: 45,
},


logo:{

width: 100,
height: 70,
borderRadius: 45,
borderColor: '#f4e45dff',
borderWidth:5
},

Titulo:{
justifyContent:'center',
fontSize: 30,
fontWeight: 'bold'

},
Titulo2:{
justifyContent:'center',
alignItems:'center',
fontSize: 20,
fontWeight: 'bold'

},

elementos:{
  
 width: 350,
    height: 180,
    backgroundColor: '#a5c3a7',
    justifyContent: 'space-between',
    //alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},

totalInfo: {
  marginTop: 10,
  padding: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 8,
},

totalText: {
  fontSize: 12,
  color: '#fff',
  textAlign: 'center',
  fontStyle: 'italic',
},

botonEditarContainer: {
  marginTop: 10,
  alignItems: 'flex-end',
},

botonEditar: {
  backgroundColor: '#79B7B4',
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#001F3F',
},

botonEditarTexto: {
  color: '#001F3F',
  fontSize: 16,
  fontWeight: 'bold',
},

})

