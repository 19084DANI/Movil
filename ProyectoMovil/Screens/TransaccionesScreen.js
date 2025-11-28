import { Text, StyleSheet, View, ImageBackground, Image, Button, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { ScrollView } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import HomeScreen from './HomeScreen';
import NuevaTransScreen from './NuevaTransScreen';
import TransaccionController from '../controllers/TransaccionController';

//transaccionController para cargar y gestionar transacciones
const controller = TransaccionController;

export default function TransaccionesScreen() {
  const [screen, setScreen] = useState('default');
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

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

  // Eliminar transacción con confirmación
  const handleEliminar = (transaccion) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Deseas eliminar la transacción "${transaccion.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await controller.eliminarTransaccion(transaccion.id);
              if (res.success) {
                Alert.alert('Eliminado', `Transacción "${transaccion.nombre}" eliminada.`);
              } else {
                Alert.alert('Error', res.error || 'No se pudo eliminar');
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  // Renderizar item de transacción
  const renderTransaccion = ({ item, index }) => (
    <View style={styles.elementos}>
      <View style={styles.headerTransaccion}>
        <Text style={styles.monto}>${item.monto.toFixed(2)}</Text>
        <View style={styles.acciones}>
          <TouchableOpacity style={styles.btnEditar} onPress={() => {}}>
            <Text style={styles.btnTexto}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnEliminar} onPress={() => handleEliminar(item)}>
            <Text style={styles.btnTexto}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detalles}>
        <Text style={[styles.texto1, { fontSize: 18 }]}>{item.nombre}</Text>
        <Text style={[styles.texto1, { fontSize: 14 }]}>{item.categoria}</Text>
      </View>
      <View style={styles.fecha}>
        <Text style={[styles.texto1, { fontSize: 12 }]}>{item.descripcion}</Text>
        <Text style={[styles.texto1, { fontSize: 12 }]}>{item.fecha}</Text>
      </View>
      <Text style={[styles.texto1, { fontSize: 10, marginTop: 5 }]}>
        {item.es_gasto ? 'Gasto' : 'Ingreso'}
      </Text>
    </View>
  );

  switch(screen) {
    case 'homeee':
      return <HomeScreen/>;
    case 'nuevaTrans':
      return <NuevaTransScreen/>;
    default:
      return (
        <ImageBackground source={require('../assets/fondo1.jpg')} resizeMode='cover'
               style={styles.backgrounds} >

           <View style={styles.encabezado}>  
            <Image style={styles.menuhamburgesa} source={require('../assets/menu.png')}></Image>     
           <TouchableOpacity onPress={() => setScreen('homeee')}>
    <Image
      style={styles.logo}
      source={require('../assets/logo.jpg')}
    />
  </TouchableOpacity> 

            </View>
            
            <View style={styles.Titulo}>
              <Text style={styles.texto2}>Transacciones</Text>
            </View>

            <View style={styles.botones}>
              <View style={{width:120,  marginRight: 10} }  >
                      <Button color='#79B7B4' title='Fecha'></Button>
              </View>
              <View style={{width:120,  marginRight: 10}}>
                      <Button color='#79B7B4' title='Categoria'></Button>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0b7a89ff" />
                <Text style={styles.loadingText}>Cargando transacciones...</Text>
              </View>
            ) : (
              <View style={styles.contenido}>
                <FlatList
                  data={transacciones}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderTransaccion}
                  scrollEnabled={false}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No hay transacciones</Text>
                      <Text style={styles.emptySubtext}>Crea la primera transacción</Text>
                    </View>
                  }
                />

                <View style={{width:'100%', flexDirection:'row' ,justifyContent:'flex-end', padding:20}}>
                  <TouchableOpacity onPress={() => setScreen('nuevaTrans')}>
                    <Image
                        style={styles.agregar}
                        source={require('../assets/plus.png')}
                       ></Image> 
                  </TouchableOpacity>
                </View>
              </View>
            )}

           <View style={styles.encabezado2}>
                      
          </View>
        </ImageBackground>
      );
   }
  
}const styles = StyleSheet.create({

contenido: {
  flex: 1,
  padding:15,
  paddingBottom:10,
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
texto1:{
  fontSize:30,
  fontWeight:'bold',
  color:'#fff'
},

texto2:{
  fontSize:40,
  fontWeight:'bold',
  color:'#070707ff'
},

logo:{

width: 100,
height: 70,
borderRadius: 45,
borderColor: '#f4e45dff',
borderWidth:5
},
elementos:{
 width: '100%',
    backgroundColor: '#a5c3a7',
    justifyContent: 'space-between',
    marginVertical: 8,
    borderRadius: 10,
    padding:15,
},

Titulo:{
justifyContent:'center',
alignItems:'center',
fontSize: 20,
fontWeight: 'bold',
marginVertical: 10,
width:'100%'
},

fecha:{
  flexDirection:'row',
  justifyContent:'space-between'
},

botones:{
  flexDirection:'row',
  paddingHorizontal: 15,
  marginBottom: 10,
},

loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},

loadingText: {
  marginTop: 10,
  color: '#666',
  fontSize: 14,
},

emptyContainer: {
  alignItems: 'center',
  paddingVertical: 40,
},

emptyText: {
  fontSize: 18,
  color: '#999',
  marginBottom: 8,
},

emptySubtext: {
  fontSize: 14,
  color: '#bbb',
},

headerTransaccion: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},

monto: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
},

acciones: {
  flexDirection: 'row',
  gap: 8,
},

btnEditar: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: '#5ba3a1',
  justifyContent: 'center',
  alignItems: 'center',
},

btnEliminar: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: '#d32f2f',
  justifyContent: 'center',
  alignItems: 'center',
},

btnTexto: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

detalles: {
  marginBottom: 8,
},

})

