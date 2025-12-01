import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, Image, Button} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import HomeScreen from "./HomeScreen";
import NuevoPresupuestoScreen from "./NuevoPresupuestoScreen";
import EditarPresuScreen from "./EditarPresuScreen";
import { Ionicons } from "@expo/vector-icons";
import PresupuestoController from "../controllers/PresupuestoController";
import TransaccionController from "../controllers/TransaccionController";
import Slider from "@react-native-community/slider";


export default function PresupuestosScreen({ onBack }) {
  const [screen, setScreen]=useState('default');
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presupuestoAEditar, setPresupuestoAEditar] = useState(null);
  const [viewMode, setViewMode] = useState('categoria'); // 'categoria' o 'fecha'
  const [transacciones, setTransacciones] = useState([]);

  // Calcular total automáticamente desde los presupuestos actuales
  const calcularTotal = useCallback(() => {
    return presupuestos.reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0);
  }, [presupuestos]);
  const preciot = calcularTotal();

  // Cargar presupuestos existentes
  const cargarPresupuestos = useCallback(async () => {
    try {
      const presupuestosData = await PresupuestoController.obtenerPresupuestos();
      setPresupuestos(presupuestosData);
      
      // Verificar si hay presupuestos excedidos
      verificarPresupuestosExcedidos(presupuestosData);
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
    }
  }, []);

  const cargarTransacciones = useCallback(async () => {
    try {
      const data = await TransaccionController.obtenerTransacciones();
      const gastos = data.filter(t => t.es_gasto === 1 || t.es_gasto === true);
      setTransacciones(gastos);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    }
  }, []);

  const verificarPresupuestosExcedidos = (presupuestosData) => {
    const excedidos = presupuestosData.filter(p => {
      const gastoTotal = calcularGastosPorCategoria(p.categoria);
      return gastoTotal > parseFloat(p.monto);
    });

    if (excedidos.length > 0) {
      const categorias = excedidos.map(p => p.categoria).join(', ');
      Alert.alert(
        ' Presupuesto Excedido',
        `Has excedido el presupuesto en: ${categorias}`,
        [{ text: 'Entendido' }]
      );
    }
  };

  const calcularGastosPorCategoria = (categoria) => {
    return transacciones
      .filter(t => t.categoria === categoria)
      .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([cargarPresupuestos(), cargarTransacciones()]);
    };
    init();

    // Escuchar cambios en presupuestos y transacciones para actualizar automáticamente
    const actualizarDatos = () => {
      cargarPresupuestos();
      cargarTransacciones();
    };
    
    PresupuestoController.addListener(actualizarDatos);
    TransaccionController.addListener(actualizarDatos);

    return () => {
      PresupuestoController.removeListener(actualizarDatos);
      TransaccionController.removeListener(actualizarDatos);
    };
  }, [cargarPresupuestos, cargarTransacciones]);

  // Recargar cuando se regrese de NuevoPresupuestoScreen
  useEffect(() => {
    if (screen === 'default') {
      cargarPresupuestos();
    }
  }, [screen, cargarPresupuestos]);
  const eliminarPresupuesto = async (id) => {
  Alert.alert(
    "Eliminar Presupuesto",
    "¿Seguro que quieres eliminar este presupuesto?",
    [{ text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await PresupuestoController.eliminarPresupuesto(id);
            if (result.success) {
              await cargarPresupuestos();
              PresupuestoController.notifyListeners();
            } else {
              Alert.alert("Error", "No se pudo eliminar el presupuesto");
            }
          } catch (error) {
            Alert.alert("Error", "Hubo un problema al eliminar");
            }
          }
       }]);
};

  // Obtener el monto actual del presupuesto (se actualiza automáticamente con transacciones)
  const getMontoActual = (categoria) => {
    const presupuesto = presupuestos.find(p => p.categoria === categoria);
    return presupuesto ? (parseFloat(presupuesto.monto) || 0) : 0;
  };

  const getLimiteMaximo = (categoria) => {
    // Buscar el presupuesto para obtener su límite guardado
    const presupuesto = presupuestos.find(p => p.categoria === categoria);
    if (presupuesto && presupuesto.limite) {
      return parseFloat(presupuesto.limite);
    }
    // Si no tiene límite guardado, usar límite por defecto
    const valorActual = getMontoActual(categoria);
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

        {/* Encabezado con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            disabled={!onBack}
          >
            <Text style={styles.backIcon}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Presupuestos</Text>
          <View style={{ width: 32 }} />
        </View>
     <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.Titulo2}>
          <Text style={styles.Titulo}>         Mis {'\n'} Presupuestos{'\n'}</Text>
         
        </View>

        <View style={styles.botones}>
          <TouchableOpacity 
            style={[
              styles.botonVista,
              viewMode === 'categoria' && styles.botonVistaActivo
            ]}
            onPress={() => setViewMode('categoria')}
          >
            <Text style={[
              styles.botonVistaTexto,
              viewMode === 'categoria' && styles.botonVistaTextoActivo
            ]}>
              Categoría
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.botonVista,
              viewMode === 'fecha' && styles.botonVistaActivo
            ]}
            onPress={() => setViewMode('fecha')}
          >
            <Text style={[
              styles.botonVistaTexto,
              viewMode === 'fecha' && styles.botonVistaTextoActivo
            ]}>
              Fecha
            </Text>
          </TouchableOpacity>
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

        {viewMode === 'categoria' ? (
          /* Vista por categoría (actual) */
          presupuestos.map((presupuesto) => {
          const montoActual = getMontoActual(presupuesto.categoria);
          const maxValue = getLimiteMaximo(presupuesto.categoria);
          const minValue = getLimiteMinimo(presupuesto.categoria);
          
          // Asegurar que el valor esté dentro del rango del slider
          const valorSlider = Math.max(minValue, Math.min(maxValue, montoActual));
          
          return (
            <View key={presupuesto.id} style={styles.elementos}>
              <View style={styles.textoslide}>
                <Text style={styles.texto1}>{presupuesto.categoria}</Text>
                <Text style={[{fontSize:30}, styles.precio]} >$: {Math.floor(montoActual).toLocaleString()}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Slider 
                  style={[{width:300, height: 50}, styles.slider]} 
                  maximumValue={maxValue}
                  minimumValue={minValue} 
                  value={valorSlider}
                  disabled={true}
                  color='#79B7B4' 
                  thumbTintColor='#79B7B4' 
                  maximumTrackTintColor='rgba(255, 255, 255, 0.5)' 
                  minimumTrackTintColor='#79B7B4'
                />
                <Text style={styles.sliderInfo}>
                  ${montoActual.toFixed(2)} / ${maxValue.toFixed(2)}
                </Text>
              </View>
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
              <View style={styles.botonEliminarContainer}>
              <TouchableOpacity style={styles.botonEliminar}
                onPress={() => eliminarPresupuesto(presupuesto.id)}
              >
                <Text style={styles.botonEliminarTexto}>Eliminar</Text>
              </TouchableOpacity>
              </View>

            </View>
          );
        })
        ) : (
          /* Vista por fecha */
          [...presupuestos]
            .sort((a, b) => new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0))
            .map((presupuesto) => {
              const montoActual = getMontoActual(presupuesto.categoria);
              const maxValue = getLimiteMaximo(presupuesto.categoria);
              const minValue = getLimiteMinimo(presupuesto.categoria);
              const valorSlider = Math.max(minValue, Math.min(maxValue, montoActual));
              
              return (
                <View key={presupuesto.id} style={styles.elementos}>
                  <View style={styles.textoslide}>
                    <Text style={styles.texto1}>{presupuesto.categoria}</Text>
                    <Text style={[{fontSize:30}, styles.precio]}>$: {Math.floor(montoActual).toLocaleString()}</Text>
                  </View>
                  {presupuesto.fecha_creacion && (
                    <Text style={styles.fechaTexto}>
                      Creado: {new Date(presupuesto.fecha_creacion).toLocaleDateString()}
                    </Text>
                  )}
                  <View style={styles.sliderContainer}>
                    <Slider 
                      style={[{width:300, height: 50}, styles.slider]} 
                      maximumValue={maxValue}
                      minimumValue={minValue} 
                      value={valorSlider}
                      disabled={true}
                      color='#79B7B4' 
                      thumbTintColor='#79B7B4' 
                      maximumTrackTintColor='rgba(255, 255, 255, 0.5)' 
                      minimumTrackTintColor='#79B7B4'
                    />
                    <Text style={styles.sliderInfo}>
                      ${montoActual.toFixed(2)} / ${maxValue.toFixed(2)}
                    </Text>
                  </View>
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
                  <View style={styles.botonEliminarContainer}>
                    <TouchableOpacity style={styles.botonEliminar}
                      onPress={() => eliminarPresupuesto(presupuesto.id)}
                    >
                      <Text style={styles.botonEliminarTexto}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
        )}

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

botones: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: 15,
  gap: 10,
},

botonVista: {
  width: 140,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  backgroundColor: '#F5E6D3',
  borderWidth: 2,
  borderColor: '#001F3F',
  alignItems: 'center',
  justifyContent: 'center',
},

botonVistaActivo: {
  backgroundColor: '#355559ff',
  borderColor: '#79B7B4',
},

botonVistaTexto: {
  fontSize: 16,
  fontWeight: '600',
  color: '#001F3F',
},

botonVistaTextoActivo: {
  color: '#fff',
},

fechaTexto: {
  fontSize: 14,
  color: '#001F3F',
  marginTop: 5,
  paddingHorizontal: 10,
  fontStyle: 'italic',
},

contenido: {
  padding:30,
  paddingBottom:40,
},
header: {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 10,
},
backButton: {
  width: 32,
  height: 32,
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5E6D3',
  borderWidth: 1,
  borderColor: '#001F3F',
},
backIcon: {
  fontSize: 22,
  color: '#001F3F',
  fontWeight: 'bold',
},
headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#001F3F',
},

textoslide:{
justifyContent:'space-between',
flexDirection:'row',
paddingHorizontal:10
},
texto1:{
  fontSize:27,
  fontWeight:'bold',
  color:'#07082bff'
},

sliderContainer: {
  width: '100%',
  alignItems: 'center',
  marginVertical: 10,
  
},
slider:{
  paddingHorizontal: 12,
  width: '100%',
  
},
sliderInfo: {
  fontSize: 12,
  color: '#07082bff',
  marginTop: 5,
  textAlign: 'center',
  
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
  
    width:'100%',
    height: 200,
    backgroundColor: '#F5E6D3',
    justifyContent: 'space-between',
    //alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
    borderWidth: 2,
    borderColor: '#001F3F',
},

totalInfo: {
  marginTop: 10,
  padding: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 8,
},

totalText: {
  fontSize: 12,
  color: '#000000ff',
  textAlign: 'center',
  fontStyle: 'italic',
},

botonEditarContainer: {
  marginTop: 10,
  alignItems: 'flex-end',
  
},

botonEditar: {
  backgroundColor: '#355559ff',
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderRadius: 8,
  overflow:'hidden',
  position:'absolute',
  top:-3,
  
  borderWidth: 2,
    borderColor: '#001F3F',
},

botonEditarTexto: {
  color: '#ecf1f5ff',
  
  fontWeight: 'bold',
},

botonEliminarContainer: {
  marginTop: -10,
},
botonEliminar: {
  backgroundColor: "#d9534f",
  padding: 4,
  borderRadius: 8,
  paddingHorizontal: 20,
  paddingVertical: 8,
  
  

  width:'35%',
  borderWidth: 2,
    borderColor: '#001F3F',
},
botonEliminarTexto: {
  color: '#ecf1f5ff',
  textAlign: "center",
  fontWeight: "bold",
  
},


})

