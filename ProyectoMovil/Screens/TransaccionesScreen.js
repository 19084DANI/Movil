import { Text, StyleSheet, View, ImageBackground, Image, Button, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { ScrollView } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import HomeScreen from './HomeScreen';
import NuevaTransScreen from './NuevaTransScreen';
import TransaccionController from '../controllers/TransaccionController';

const controller = TransaccionController;

export default function TransaccionesScreen() {
  const [screen, setScreen] = useState('default');
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarTransacciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await controller.obtenerTransacciones();
      setTransacciones(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  }, []);

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
            const res = await controller.eliminarTransaccion(transaccion.id);
            if (res.success) {
              Alert.alert('Eliminado', `Transacción "${transaccion.nombre}" eliminada.`);
            } else {
              Alert.alert('Error', res.error || 'No se pudo eliminar');
            }
          }
        }
      ]
    );
  };

  const renderTransaccion = ({ item }) => (
    <View style={styles.elementos}>
      <View style={styles.headerTransaccion}>
        <Text style={styles.monto}>${item.monto.toFixed(2)}</Text>
        <View style={styles.acciones}>
          <TouchableOpacity style={styles.btnEditar}>
            <Text style={styles.btnTexto}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnEliminar} onPress={() => handleEliminar(item)}>
            <Text style={styles.btnTexto}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detalles}>
        <Text style={styles.textoNombre}>{item.nombre}</Text>
        <Text style={styles.textoCategoria}>{item.categoria}</Text>
      </View>

      <View style={styles.fecha}>
        <Text style={styles.textoDescripcion}>{item.descripcion}</Text>
        <Text style={styles.textoFecha}>{item.fecha}</Text>
      </View>

      <Text style={styles.textTipo}>{item.es_gasto ? 'Gasto' : 'Ingreso'}</Text>
    </View>
  );

  switch (screen) {
    case 'homeee':
      return <HomeScreen />;
    case 'nuevaTrans':
      return <NuevaTransScreen />;
    default:
      return (
        <ImageBackground
          source={require('../assets/fondo2.jpg')}
          resizeMode='cover'
          style={styles.backgrounds}
        >

          <View style={styles.Titulo}>
            <Text style={styles.texto2}>Transacciones</Text>
          </View>

          <View style={styles.botones}>
            <View style={{ width: 140, marginRight: 10 }}>
              <Button color='#79B7B4' title='Fecha' />
            </View>
            <View style={{ width: 140 }}>
              <Button color='#79B7B4' title='Categoria' />
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
                contentContainerStyle={styles.lista}
                style={{ width: '100%' }}

                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay transacciones</Text>
                    <Text style={styles.emptySubtext}>Crea la primera transacción</Text>
                  </View>
                }
              />

              <View style={styles.contenedorAgregar}>
                <TouchableOpacity onPress={() => setScreen('nuevaTrans')}>
                  <Image style={styles.agregar} source={require('../assets/plus.png')} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          
        </ImageBackground>
      );
  }
}

const styles = StyleSheet.create({

  backgrounds: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5E6D3',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    height: '10%',
    borderBottomWidth: 1,
    borderBottomColor: '#001F3F',
  },

  encabezado2: {
    backgroundColor: '#F5E6D3',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    height: '10%',
    borderTopWidth: 1,
    borderTopColor: '#001F3F',
  },

  menuhamburgesa: {
    width: 40,
    height: 40,
  },

  logo: {
    width: 110,
    height: 80,
    borderRadius: 45,
    borderColor: '#f4e45dff',
    borderWidth: 5,
  },

  Titulo: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },

  texto2: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#001F3F',
  },

  botones: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  contenido: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },

  lista: {
    paddingBottom: 200,
    paddingHorizontal: 25,
    alignItems: 'center',
  },

  elementos: {
    width: '90%',
    backgroundColor: '#E8D9C8',
    marginVertical: 14,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1C6B5',
  },

  headerTransaccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  monto: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#001F3F',
  },

  acciones: {
    flexDirection: 'row',
    gap: 10,
  },

  btnEditar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7EFE6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1C6B5',
  },

  btnEliminar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d32f2f',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnTexto: {
    color: '#001F3F',
    fontSize: 16,
    fontWeight: 'bold',
  },

  detalles: {
    marginBottom: 10,
  },

  textoNombre: {
    fontSize: 20,
    color: '#001F3F',
    fontWeight: 'bold',
  },

  textoCategoria: {
    fontSize: 16,
    color: '#001F3F',
  },

  fecha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textoDescripcion: {
    fontSize: 16,
    color: '#001F3F',
  },

  textoFecha: {
    fontSize: 14,
    color: '#001F3F',
  },

  textTipo: {
    fontSize: 14,
    marginTop: 10,
    color: '#001F3F',
  },

  contenedorAgregar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 25,
    paddingTop: 10,
    paddingBottom: 20,
  },

  agregar: {
    width: 55,
    height: 55,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#001F3F',
    fontSize: 16,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 18,
    color: '#001F3F',
  },

  emptySubtext: {
    fontSize: 14,
    color: '#444',
  },
});
