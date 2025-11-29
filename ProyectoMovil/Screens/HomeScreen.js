import { Text, StyleSheet, View, Image, ImageBackground, Button, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import TransaccionController from '../controllers/TransaccionController';
import { Ionicons } from '@expo/vector-icons';

const controller = TransaccionController;
export default function BotonesScreen() {
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

  const recentTransacciones = [...transacciones]
    .sort((a, b) => {
      const da = new Date(a.fecha_creacion || a.fecha || 0).getTime();
      const db = new Date(b.fecha_creacion || b.fecha || 0).getTime();
      return db - da;
    })
    .slice(0, 3);

  const renderTransaccion = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <View style={styles.cardTransaccion}>
        <Text style={styles.cardMonto}>${item.monto.toFixed(2)}</Text>
        <Text style={styles.cardTitulo}>{item.nombre}</Text>
        <Text style={styles.cardCategoria}>{item.categoria}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDescripcion}>{item.descripcion}</Text>
          <Text style={styles.cardFecha}>{item.fecha}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/fondo1.jpg')}
      resizeMode='cover'
      style={styles.backgrounds}>

          <View style={styles.Container}>

            <View style={styles.elementos}>
              <Text style={styles.titulo}>¡Hola de Nuevo!</Text>

              <View style={styles.saldo}>
                <View>
                  <Text style={styles.textosaldo}>Saldo Disponible:</Text>
                  <Text style={styles.textsaldo2}>$2100.00</Text>
                </View>

                <View style={styles.botonPresupuesto}>
                  <Button
                    style={styles.btn}
                    color="#ADD6BC"
                    title='Presupuestos'
                  />
                </View>
              </View>

              <View style={styles.cuadros}>
                <View style={styles.elementos2}>
                  <Text style={styles.textoi}>Ingresos:</Text>
                  <Text style={styles.num}>$8000.00</Text>
                </View>

                <View style={styles.elementos22}>
                  <Text style={styles.textoi}>Gastos:</Text>
                  <Text style={styles.num}>$5900.00</Text>
                </View>

                <View style={styles.elementos2}>
                  <Text style={styles.textot}>Transacción</Text>
                  <TouchableOpacity>
                    <Image style={styles.mas} source={require('../assets/mas.png')} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.utransaccion}>Últimas Transacciones</Text>

              <View style={styles.listaContenedor}>
                <FlatList
                  data={recentTransacciones}
                  keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                  renderItem={renderTransaccion}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No hay transacciones</Text>
                      <Text style={styles.emptySubtext}>Crea la primera transacción</Text>
                    </View>
                  }
                />
              </View>

            </View>
          </View>

          <Image style={styles.ayuda} source={require('../assets/help.png')} />
        </ImageBackground>
      );
}

const styles = StyleSheet.create({
  encabezado: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: '#EEF5DB',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    height: 80
  },

  Container: {
    alignItems: 'center',
    width: "100%"
  },

  elementos: {
    width: '92%',
    backgroundColor: '#EEF5DB',
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15
  },

  saldo: {
    width: '100%',
    height: 100,
    backgroundColor: '#ADD6BC',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cuadros: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15
  },

  elementos2: {
    width: '30%',
    backgroundColor: '#ADD6BC',
    borderRadius: 10,
    padding: 10,
  },

  elementos22: {
    width: '30%',
    backgroundColor: '#F9D423',
    borderRadius: 10,
    padding: 10,
  },

  textosaldo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#476c57ff',
  },

  textsaldo2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  textoi: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  textot: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  num: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  utransaccion: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },

  listaContenedor: {
    width: '100%',
    backgroundColor: '#ADD6BC',
    padding: 10,
    borderRadius: 15,
  },

  cardTransaccion: {
    backgroundColor: '#EEF5DB',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },

  cardMonto: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: '600'
  },

  cardCategoria: {
    fontSize: 14,
    color: '#555'
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  cardDescripcion: {
    fontSize: 12
  },

  cardFecha: {
    fontSize: 12
  },

  logocontainer: {},

  logotext: {},

  backgrounds: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  menuhamburgesa: {
    width: 35,
    height: 35,
  },

  logo: {
    width: 90,
    height: 60,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#b7ba9bff'
  },

  mas: {
    width: 25,
    height: 25,
    marginTop: 5,
  },

  ayuda: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 45,
    height: 45
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  emptyText: {
    fontSize: 16,
    color: '#666'
  },

  emptySubtext: {
    fontSize: 14,
    color: '#999'
  }
});
