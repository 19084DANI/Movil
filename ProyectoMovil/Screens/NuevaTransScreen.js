import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Image, ImageBackground, Pressable } from "react-native";
import HomeScreen from './HomeScreen';
import TransaccionesScreen from './TransaccionesScreen';
import { TouchableOpacity } from 'react-native';
import TransaccionController from '../controllers/TransaccionController';
import PresupuestoController from '../controllers/PresupuestoController';
import { Ionicons } from '@expo/vector-icons';

const controller = TransaccionController;

export default function FormularioTransaccion() {
  const [screen, setScreen] = useState('default');
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [categoriasPresupuestos, setCategoriasPresupuestos] = useState([]);
  const [presupuestosInfo, setPresupuestosInfo] = useState({}); // Para mostrar límites disponibles
  const [categoriaMenuAbierto, setCategoriaMenuAbierto] = useState(false);

  // Fecha actual por defecto
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split("T")[0];
  });

  const cargarCategorias = useCallback(async () => {
    try {
      const presupuestos = await PresupuestoController.obtenerPresupuestos();
      // Obtener categorías únicas de presupuestos
      const categorias = presupuestos
        .map(p => p.categoria)
        .filter((cat, index, self) => self.indexOf(cat) === index);
      setCategoriasPresupuestos(categorias);
      
      // Guardar información de presupuestos para validaciones
      const info = {};
      presupuestos.forEach(p => {
        info[p.categoria] = {
          monto: parseFloat(p.monto) || 0,
          limite: parseFloat(p.limite) || 0
        };
      });
      setPresupuestosInfo(info);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      Alert.alert('Error', 'No se pudieron cargar las categorías de presupuestos');
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
    PresupuestoController.addListener(cargarCategorias);
    return () => {
      PresupuestoController.removeListener(cargarCategorias);
    };
  }, [cargarCategorias]);

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
          es_gasto: true, // Marcar como gasto
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

          <View style={styles.formContainer}>
            <View style={styles.formContainer2}>
              {/* Título estático */}
              <Text style={styles.titulo}>Nuevo Gasto</Text>

              {/* ScrollView solo para los campos */}
              <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
              >
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
                {categoriasPresupuestos.length === 0 ? (
                  <View style={styles.categoriaContainer}>
                    <Text style={styles.categoriaMensaje}>
                      No hay categorías disponibles. Crea un presupuesto primero.
                    </Text>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      style={styles.categoriaSelector}
                      onPress={() => setCategoriaMenuAbierto(!categoriaMenuAbierto)}
                    >
                      <Text style={[styles.categoriaSelectorText, !categoria && styles.categoriaSelectorPlaceholder]}>
                        {categoria || 'Selecciona una categoría'}
                      </Text>
                      <Ionicons 
                        name={categoriaMenuAbierto ? 'chevron-up' : 'chevron-down'} 
                        size={20} 
                        color="#001F3F" 
                      />
                    </TouchableOpacity>
                    
                    {categoriaMenuAbierto && (
                      <View style={styles.categoriaDropdown}>
                        <ScrollView 
                          style={styles.categoriaScrollView}
                          nestedScrollEnabled={true}
                          showsVerticalScrollIndicator={true}
                        >
                          {categoriasPresupuestos.map((opt) => {
                            const info = presupuestosInfo[opt];
                            const disponibleCat = info ? info.monto : 0;
                            const sinDisponible = disponibleCat <= 0;
                            
                            return (
                              <TouchableOpacity
                                key={opt}
                                style={[
                                  styles.categoriaOption,
                                  categoria === opt && styles.categoriaOptionSelected,
                                  sinDisponible && styles.categoriaOptionDisabled
                                ]}
                                onPress={() => {
                                  if (!sinDisponible) {
                                    setCategoria(opt);
                                    setCategoriaMenuAbierto(false);
                                  } else {
                                    Alert.alert(
                                      'Sin presupuesto disponible',
                                      `La categoría "${opt}" no tiene presupuesto disponible. Agrega un ingreso primero.`
                                    );
                                  }
                                }}
                                disabled={sinDisponible}
                              >
                                <Text
                                  style={[
                                    styles.categoriaOptionText,
                                    categoria === opt && styles.categoriaOptionTextSelected,
                                    sinDisponible && styles.categoriaOptionTextDisabled
                                  ]}
                                >
                                  {opt}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>
                    )}
                    
                    {presupuestosInfo[categoria] && (
                      <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                          Disponible: ${presupuestosInfo[categoria].monto.toFixed(2)} / ${presupuestosInfo[categoria].limite.toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {presupuestosInfo[categoria] && <View style={styles.spacer} />}

                <Text style={styles.texto}>Fecha</Text>
                <TextInput
                  style={styles.inputs}
                  value={fecha}
                  editable={false}
                  placeholderTextColor='#777'
                />

                <Text style={styles.texto}>Descripción</Text>
                <TextInput
                  style={[styles.inputDescripcion, { minHeight: 100 }]}
                  placeholder="Ej. Recibo de CFE"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  multiline={true}
                  textAlignVertical="top"
                  onContentSizeChange={(event) => {
                    // Permitir que crezca dinámicamente
                  }}
                />
              </ScrollView>

              {/* Botón estático */}
              <View style={styles.buttonContainer}>
                <Pressable
                  style={styles.Button}
                  onPress={mostrarAlerta}
                  disabled={guardando}
                >
                  <Text style={styles.textoBoton}>
                    {guardando ? "Guardando..." : "CREAR GASTO"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      );
  }
}


const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: '99%',
    backgroundColor: "#1a4050ff",
    borderRadius: 15,
    borderWidth:3,
    borderColor:'#2b5868ff',
    padding: 20,
    alignItems: "center",
    justifyContent:'center',
  },
  formContainer2: {
    flex: 1,
    width: '108%',
    backgroundColor: "#F5E6D3",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 10,
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
    padding: 8,
    backgroundColor: "#F7EFE6",
    marginBottom: 10,
    color: '#333',
    fontSize: 15,
    minHeight: 100,
  },
  spacer: {
    height: 15,
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
    backgroundColor: '#79B7B4',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#001F3F',
  },
  textoBoton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f5f6f8ff',
  }
  ,
  categoriaContainer: {
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
  },
  categoriaSelector: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F7EFE6',
    borderWidth: 2,
    borderColor: '#b0b0b0ff',
    borderRadius: 12,
    marginTop: 10,
  },
  categoriaSelectorText: {
    fontSize: 16,
    color: '#001F3F',
    fontWeight: '600',
  },
  categoriaSelectorPlaceholder: {
    color: '#999',
  },
  categoriaDropdown: {
    width: '80%',
    backgroundColor: '#F7EFE6',
    borderWidth: 2,
    borderColor: '#b0b0b0ff',
    borderRadius: 12,
    marginTop: 5,
    maxHeight: 200,
    overflow: 'hidden',
  },
  categoriaScrollView: {
    maxHeight: 200,
  },
  categoriaOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriaOptionSelected: {
    backgroundColor: '#79B7B4',
  },
  categoriaOptionDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  categoriaOptionText: {
    fontSize: 16,
    color: '#001F3F',
    fontWeight: '600',
  },
  categoriaOptionTextSelected: {
    color: '#fff',
  },
  categoriaOptionTextDisabled: {
    color: '#666',
  },

  categoriaMensaje: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
    fontStyle: 'italic',
  },

  categoriaBtnDisabled: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
    opacity: 0.6,
  },

  categoriaBtnTextDisabled: {
    color: '#666',
  },

  infoContainer: {
    width: '80%',
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },

  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },

  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
});
