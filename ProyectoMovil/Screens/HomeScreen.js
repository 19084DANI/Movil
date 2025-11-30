import { Text, StyleSheet, View, Image, ImageBackground, Button, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import TransaccionController from '../controllers/TransaccionController';
import PresupuestoController from '../controllers/PresupuestoController';
import { Ionicons } from '@expo/vector-icons';

const controller = TransaccionController;
export default function BotonesScreen() {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [gastosTotal, setGastosTotal] = useState(0);
  const [saldoDisponible, setSaldoDisponible] = useState(0);

  const cargarTransacciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await controller.obtenerTransacciones();
      setTransacciones(data);
      
      // Calcular total de gastos
      const totalGastos = data.reduce((sum, trans) => sum + (parseFloat(trans.monto) || 0), 0);
      setGastosTotal(totalGastos);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarPresupuesto = useCallback(async () => {
    try {
      const result = await PresupuestoController.obtenerTotalPresupuestos();
      if (result.success) {
        const total = result.data?.total || 0;
        setPresupuestoTotal(total);
      }
    } catch (error) {
      console.error('Error al cargar presupuesto:', error);
    }
  }, []);

  const calcularSaldo = useCallback(() => {
    const saldo = presupuestoTotal - gastosTotal;
    setSaldoDisponible(saldo >= 0 ? saldo : 0);
  }, [presupuestoTotal, gastosTotal]);

  useEffect(() => {
    const init = async () => {
      await controller.initialize();
      await cargarPresupuesto();
      await cargarTransacciones();
    };
    init();
    
    const actualizarDatos = () => {
      cargarTransacciones();
      cargarPresupuesto();
    };
    
    controller.addListener(actualizarDatos);
    PresupuestoController.addListener(actualizarDatos);

    return () => {
      controller.removeListener(actualizarDatos);
      PresupuestoController.removeListener(actualizarDatos);
    };
  }, [cargarTransacciones, cargarPresupuesto]);

  useEffect(() => {
    calcularSaldo();
  }, [calcularSaldo]);

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
      source={require('../assets/fondo2.jpg')}
      resizeMode='cover'
      style={styles.backgrounds}>

          <View style={styles.Container}>

            <View style={styles.elementos}>
              <Text style={styles.titulo}>¡Hola de Nuevo!</Text>

              <View style={styles.saldo}>
                <View>
                  <Text style={styles.textosaldo}>Saldo Disponible:</Text>
                  <Text style={styles.textsaldo2}>${saldoDisponible.toFixed(2)}</Text>
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
                  <Text style={styles.textoi}>Presupuestos:</Text>
                  <Text style={styles.num}>${presupuestoTotal.toFixed(2)}</Text>
                </View>

                <View style={styles.elementos22}>
                  <Text style={styles.textoi}>Gastos:</Text>
                  <Text style={styles.num}>${gastosTotal.toFixed(2)}</Text>
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
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    height: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#001F3F'
  },

  Container: {
    alignItems: 'center',
    width: "100%"
  },

  elementos: {
    width: '92%',
    backgroundColor: '#E8D9C8',
    padding: 16,
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
    backgroundColor: '#F7EFE6',
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
    backgroundColor: '#F7EFE6',
    borderRadius: 10,
    padding: 10,
  },

  elementos22: {
    width: '30%',
    backgroundColor: '#E8D9C8',
    borderRadius: 10,
    padding: 10,
  },

  textosaldo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001F3F',
  },

  textsaldo2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#001F3F',
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
    color: '#001F3F',
  },

  utransaccion: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },

  listaContenedor: {
    width: '100%',
    backgroundColor: '#F7EFE6',
    padding: 10,
    borderRadius: 15,
  },

  cardTransaccion: {
    backgroundColor: '#F5E6D3',
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
    color: '#001F3F'
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
    borderColor: '#001F3F'
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
    color: '#001F3F'
  },

  emptySubtext: {
    fontSize: 14,
    color: '#444'
  }
});
