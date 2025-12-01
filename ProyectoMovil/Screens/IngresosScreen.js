import { Text, StyleSheet, View, ImageBackground, Image, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { ScrollView } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import NuevaTransIngreScreen from './NuevaTransIngreScreen';
import TransaccionController from '../controllers/TransaccionController';
import PresupuestoController from '../controllers/PresupuestoController';
import EditarTransScreen from './EditarTransScreen';

const controller = TransaccionController;

export default function IngresosScreen({ onBack }) {
  const [screen, setScreen] = useState('default');
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState('fecha'); // 'fecha' o 'categoria'
  const [presupuestos, setPresupuestos] = useState([]);

  const cargarTransacciones = useCallback(async () => {
    try {
      const data = await controller.obtenerTransacciones();
      // Filtrar solo ingresos (es_gasto = 0 o false)
      const ingresos = data.filter(t => !t.es_gasto || t.es_gasto === 0);
      setTransacciones(ingresos);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al cargar ingresos');
    }
  }, []);

  const cargarPresupuestos = useCallback(async () => {
    try {
      const data = await PresupuestoController.obtenerPresupuestos();
      setPresupuestos(data || []);
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const startTime = Date.now();
      
      try {
        await controller.initialize();
        
        // Cargar en paralelo
        await Promise.all([
          cargarTransacciones(),
          cargarPresupuestos()
        ]);
      } catch (error) {
        console.error('Error en init:', error);
        // Aún así intentar cargar los datos
        try {
          await cargarTransacciones();
          await cargarPresupuestos();
        } catch (e) {
          console.error('Error al cargar datos:', e);
        }
      }
      
      // Asegurar que el loading dure máximo 3 segundos
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsed);
      
      if (remainingTime > 0) {
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      } else {
        setLoading(false);
      }
    };
    
    init();
    
    const actualizarTransacciones = () => {
      cargarTransacciones();
    };
    
    const actualizarPresupuestos = () => {
      cargarPresupuestos();
    };
    
    controller.addListener(actualizarTransacciones);
    PresupuestoController.addListener(actualizarPresupuestos);

    return () => {
      controller.removeListener(actualizarTransacciones);
      PresupuestoController.removeListener(actualizarPresupuestos);
    };
  }, [cargarTransacciones, cargarPresupuestos]);

  const handleEliminar = (transaccion) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Deseas eliminar el ingreso "${transaccion.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await controller.eliminarTransaccion(transaccion.id);
            if (res.success) {
              Alert.alert('Eliminado', `Ingreso "${transaccion.nombre}" eliminado.`);
            } else {
              Alert.alert('Error', res.error || 'No se pudo eliminar');
            }
          }
        }
      ]
    );
  };

  const renderTransaccion = ({ item }) => {
    const handleEdit = () => {
      if (!item.id) {
        Alert.alert("Error", "No se pudo obtener el ID del ingreso");
        return;
      }
      setEditId(item.id);
      setScreen('editarTrans');
    };

    return (
    <View style={styles.elementos}>
      <View style={styles.headerTransaccion}>
        <Text style={styles.monto}>${item.monto.toFixed(2)}</Text>
        <View style={styles.acciones}>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={handleEdit}
        >
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

      <Text style={styles.textTipo}>Ingreso</Text>
    </View>
    );
  };

  // Obtener categorías únicas de presupuestos
  const categoriasPresupuestos = presupuestos
    .map(p => p.categoria)
    .filter((cat, index, self) => self.indexOf(cat) === index);

  // Ordenar transacciones por fecha (más reciente primero)
  const transaccionesOrdenadasPorFecha = [...transacciones].sort((a, b) => {
    const fechaA = new Date(a.fecha_creacion || a.fecha || 0).getTime();
    const fechaB = new Date(b.fecha_creacion || b.fecha || 0).getTime();
    return fechaB - fechaA; // Más reciente primero
  });

  // Agrupar transacciones por categoría (solo categorías de presupuestos)
  const transaccionesPorCategoria = categoriasPresupuestos.map(categoria => {
    const transaccionesDeCategoria = transacciones
      .filter(t => t.categoria === categoria)
      .sort((a, b) => {
        const fechaA = new Date(a.fecha_creacion || a.fecha || 0).getTime();
        const fechaB = new Date(b.fecha_creacion || b.fecha || 0).getTime();
        return fechaB - fechaA; // Más reciente primero
      });
    return { categoria, transacciones: transaccionesDeCategoria };
  }).filter(grupo => grupo.transacciones.length > 0); // Solo mostrar categorías con transacciones

  // Renderizar vista por categoría
  const renderVistaPorCategoria = () => {
    if (transaccionesPorCategoria.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay ingresos por categoría</Text>
          <Text style={styles.emptySubtext}>Crea ingresos con categorías de presupuestos</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      >
        {transaccionesPorCategoria.map((grupo, index) => (
          <View key={index} style={styles.categoriaGrupo}>
            <View style={styles.categoriaHeader}>
              <Text style={styles.categoriaTitulo}>{grupo.categoria}</Text>
              <Text style={styles.categoriaCount}>({grupo.transacciones.length})</Text>
            </View>
            {grupo.transacciones.map((item) => (
              <View key={item.id} style={styles.elementos}>
                <View style={styles.headerTransaccion}>
                  <Text style={styles.monto}>${item.monto.toFixed(2)}</Text>
                  <View style={styles.acciones}>
                    <TouchableOpacity
                      style={styles.btnEditar}
                      onPress={() => {
                        if (navigation && navigation.navigate) {
                          navigation.navigate("EditarTransScreen", { id: item.id });
                        }
                      }}
                    >
                      <Text style={styles.btnTexto}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnEliminar} onPress={() => handleEliminar(item)}>
                      <Text style={styles.btnTexto}>X</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detalles}>
                  <Text style={styles.textoNombre}>{item.nombre}</Text>
                </View>

                <View style={styles.fecha}>
                  <Text style={styles.textoDescripcion}>{item.descripcion}</Text>
                  <Text style={styles.textoFecha}>{item.fecha}</Text>
                </View>

                <Text style={styles.textTipo}>Ingreso</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  switch (screen) {
    case 'nuevoIngreso':
      return <NuevaTransIngreScreen />;
    case 'editarTrans':
      return <EditarTransScreen id={editId} volver={() => setScreen('default')} />;

    default:
      return (
        <ImageBackground
          source={require('../assets/fondo2.jpg')}
          resizeMode='cover'
          style={styles.backgrounds}
        >

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              disabled={!onBack}
            >
              <Text style={styles.backIcon}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.texto2}>Ingresos</Text>
            <View style={{ width: 32 }} />
          </View>

          <View style={styles.botones}>
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
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0b7a89ff" />
              <Text style={styles.loadingText}>Cargando ingresos...</Text>
            </View>
          ) : (
            <View style={styles.contenido}>
              {viewMode === 'fecha' ? (
                <FlatList
                  data={transaccionesOrdenadasPorFecha}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderTransaccion}
                  contentContainerStyle={styles.lista}
                  style={{ width: '100%' }}

                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No hay ingresos</Text>
                      <Text style={styles.emptySubtext}>Crea el primer ingreso</Text>
                    </View>
                  }
                />
              ) : (
                renderVistaPorCategoria()
              )}

              <View style={styles.contenedorAgregar}>
                <TouchableOpacity onPress={() => setScreen('nuevoIngreso')}>
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

  header: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
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
  texto2: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#001F3F',
  },

  botones: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
    
  },

  botonVista: {
    width: 140,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F5E6D3',
    borderWidth: 2,
    borderColor: '#79B7B4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#001F3F',
  },

  botonVistaActivo: {
    backgroundColor: '#355559ff',
    borderColor: '#79B7B4',
    borderWidth: 2,
    borderColor: '#001F3F',
  },

  botonVistaTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001F3F',
    
  },

  botonVistaTextoActivo: {
    color: '#fff',
  },

  categoriaGrupo: {
    marginBottom: 20,
    width: '100%',

  },

  categoriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  categoriaTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#001F3F',
    marginRight: 8,
  },

  categoriaCount: {
    fontSize: 16,
    color: '#001F3F',
    fontWeight: '600',
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
    width:320,
    backgroundColor: '#E8D9C8',
    marginVertical: 14,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1C6B5',
    borderWidth: 2,
    borderColor: '#001F3F',
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

