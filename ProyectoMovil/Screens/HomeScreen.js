import { Text, StyleSheet, View, Image, ImageBackground, ScrollView, Button, FlatList, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import PresupuestosScreen from './PresupuestosScreen';
import TransaccionesScreen from './TransaccionesScreen';
import NuevatransScreen from './NuevaTransScreen';
import Login from './LoginScreen';
import GraficaScreen from './GraficaScreen';
import TransaccionController from '../controllers/TransaccionController';
import { Ionicons } from  '@expo/vector-icons';

const controller = TransaccionController;
export default function BotonesScreen() {
    const [transacciones, setTransacciones] = useState([]);
    const [screen, setScreen]=useState('default');
      const [loading, setLoading] = useState(true);
    // cargar transacciones
      const cargarTransacciones = useCallback(async () => {
        try {
          setLoading(true);
          const data = await controller.obtenerTransacciones();
          setTransacciones(data);
          console.log(`${data.length} transacciones cargadas`);
        } catch (error) {
          Alert.alert('Error', error.message || 'Error al cargar transacciones');
        } finally {
          setLoading(false);
        }
      }, []);
    
      // useEffect para cargar transacciones al montar
      useEffect(() => {
        const init = async () => {
          await controller.initialize();
          await cargarTransacciones();
        };
        init();
        controller.addListener(cargarTransacciones);
    
        return () => {
          controller.removeListener(cargarTransacciones);
        };
      }, [cargarTransacciones]);
    const renderTransaccion = ({ item, index }) => (
        <View style={styles.elementos}>
          <View style={styles.headerTransaccion}>
            <Text style={styles.monto}>${item.monto.toFixed(2)}</Text>
          </View>
          <View style={styles.detalles}>
            <Text style={[styles.texto1, { fontSize: 16 }]}>{item.nombre}</Text>
            <Text style={[styles.texto1, { fontSize: 12 }]}>{item.categoria}</Text>
          </View>
          <View style={styles.fecha}>
            <Text style={[styles.texto1, { fontSize: 11 }]}>{item.descripcion}</Text>
            <Text style={[styles.texto1, { fontSize: 11 }]}>{item.fecha}</Text>
          </View>
        </View>
      );
    switch(screen){
      case 'presupuestos':
          return <PresupuestosScreen/>
        case 'transacciones':
          return <TransaccionesScreen/>
        case 'NuevaTransScreen':
            return <NuevatransScreen/>
        case 'login':
            return <Login/>
        case 'grafica':
            return <GraficaScreen/>
      default:
    
    return (
    <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
             style={styles.backgrounds} >
    <View style={styles.encabezado}>  
        <View style={{ flexDirection: 'row', width: 90, }}>
         <Image style={[styles.menuhamburgesa, { marginRight: 10 }]} source={require('../assets/menu.png')}></Image>
            <TouchableOpacity onPress={() => setScreen('login')}>
         <Image style={styles.menuhamburgesa} source={require('../assets/salir.png')}></Image>  
         </TouchableOpacity>
          </View>
         <Image style={styles.logo} source={require('../assets/logo.jpg')}></Image>  
    </View>
     <ScrollView contentContainerStyle={styles.Container} >
        <View style={styles.elementos}>
        <Text style={styles.titulo}>¡Hola de Nuevo!</Text>
        <View style={styles.saldo}>
        <View>
        <Text style={styles.textosaldo}>Saldo Disponible: </Text>
        <Text style={styles.textsaldo2}>$2100.00 </Text>
        </View>
        <View style={styles.botonPresupuesto}>
        <Button style={styles.btn}color="#ADD6BC" title='Presupuestos'
        onPress={() => setScreen('presupuestos')}></Button>
          </View>
        </View>
        <View  style={styles.cuadros}>
        <View style={styles.elementos2}>
        <Text style={styles.textoi}>Ingresos:</Text>
        <Text style={styles.num}>$8000.00 </Text>
        </View>
        <View style={styles.elementos22}>
        <Text style={styles.textoi}>Gastos:</Text>
        <Text  style={styles.num}>$5900.00 </Text>
        </View>
         <View style={styles.elementos2}>
        <Text style={styles.textot}>Transaccion</Text>   
        <TouchableOpacity onPress={() => setScreen('transacciones')}>
        <Image style={styles.mas} source={require('../assets/mas.png')}/>
        </TouchableOpacity>
        </View>
        </View>
        <View>
        <Text style={styles.utransaccion}>Ultimas Transacciones</Text>
          <View style={styles.contenido}>
              <FlatList style={styles.flatlista} data={transacciones.slice(0, 5)} keyExtractor={(item) => item.id.toString()}
              renderItem={renderTransaccion}
              scrollEnabled={false}
              ListEmptyComponent={ <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay transacciones</Text>
              <Text style={styles.emptySubtext}>Crea la primera transacción</Text>
             </View>
             }/>
    </View>
          
        </View>

        </View>
    </ScrollView>
        <Image style={styles.ayuda} source={require('../assets/help.png')}/>
    </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
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
Container:{
  alignItems: 'center',
  paddingBottom: 40, 
},
cuadros:{
    width:'100%',
    flexDirection:'row',
    marginRight:10,
    justifyContent:'space-between',
},
textotransacciones:{
  fontSize:25,
  fontWeight:'bold',
  color:'#fff'
},
fecha:{
    flexDirection:'row',
    justifyContent:'space-between',
},
titulo:{
fontSize:24,
fontWeight:'bold',
marginBottom:20,
textAlign:'center',
},

menuhamburgesa:{

width: 35,
height: 35,
},
utransaccion:{
justifyContent:'center',
fontSize: 24,
fontWeight: 'bold'

},
logo:{

width: 100,
height: 70,
borderRadius: 45,
borderColor: '#b7ba9bff',
borderWidth:5
},

backgrounds: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '100%',
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

elementos:{
 width: '90%',
 flexDirection: 'column',
    height: 750,
    backgroundColor: '#EEF5DB',
    justifyContent: 'flex-start',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},
elementos2:{
 width: '30%',
 flexDirection: 'column',
    height: '80%',
    backgroundColor: '#ADD6BC',
    justifyContent: 'flex-start',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},
elementos22:{
 width: '30%',
 flexDirection: 'column',
    height: '80%',
    backgroundColor: '#F9D423',
    justifyContent: 'flex-start',
    marginVertical: 10,
    borderRadius: 10,
    padding:15,
},
saldo:{
    width: '60%',
    height: 100,
    backgroundColor: '#ADD6BC',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexDirection:'row',
    borderRadius: 10,
    padding:15,
},

textosaldo:{
    fontSize:18,
    fontWeight:'bold',
    color:'#476c57ff',
},

textoi:{
    fontSize:15,
    fontWeight:'bold',
    color:'#000000ff',
},

textot:{
    fontSize:12,
    fontWeight:'bold',
    color:'#000000ff',
},

num:{
    fontSize:15,
    fontWeight:'bold',
    color:'#ffffffff',
},
textsaldo2:{
    fontSize:22,
    fontWeight:'bold',
    color:'#ffffffff',
},
elementostransacciones:{
 width: '100%',
    height: 100,
    backgroundColor: '#ADD6BC',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 20,
    padding:15,
},
ayuda:{
  position: 'absolute',
  bottom: 25,      
  right: 25,      
  width: 40,       
  height: 40,
  borderRadius: 20,
},
mas:{
  width: 25,      
  height: 25,
  marginTop: 5,   
  alignSelf: 'center', 
  resizeMode: 'contain', 
},
btn:{
  width:200,
  marginVertical:5,
  height:60,
  justifyContent:'center',
  alignItems:'center',
  zIndex:1,
  alignSelf:'center'
},
botonPresupuesto: {
  width: 120,
  height: 85,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
   marginLeft: 50,
},

flatlista:{
width: '100%',
    height: '40%',
    backgroundColor: '#ADD6BC',
    marginVertical: 5,
    borderRadius: 20,
    padding:5,
    paddingHorizontal:15,
    paddingVertical:5,

},
})
