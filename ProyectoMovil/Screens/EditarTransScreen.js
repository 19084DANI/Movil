import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import TransaccionController from '../controllers/TransaccionController';
import PresupuestoController from '../controllers/PresupuestoController';
import { Ionicons } from '@expo/vector-icons';

export default function EditarTransScreen({ id, volver, route, navigation }) {
  // Soportar ambos modos: con props directas o con navigation
  const transId = id || route?.params?.id;
  const handleBack = volver || (navigation?.goBack ? () => navigation.goBack() : null);
  
  const [trans, setTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [categoriasPresupuestos, setCategoriasPresupuestos] = useState([]);
  const [presupuestosInfo, setPresupuestosInfo] = useState({});
  const [categoriaMenuAbierto, setCategoriaMenuAbierto] = useState(false);

  const cargarCategorias = useCallback(async () => {
    try {
      const presupuestos = await PresupuestoController.obtenerPresupuestos();
      const categorias = presupuestos
        .map(p => p.categoria)
        .filter((cat, index, self) => self.indexOf(cat) === index);
      setCategoriasPresupuestos(categorias);
      
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
    }
  }, []);

  useEffect(() => {
    if (!transId) {
      Alert.alert("Error", "ID de transacción no encontrado");
      if (handleBack) {
        handleBack();
      }
      return;
    }

    (async () => {
      try {
        await cargarCategorias();
        const data = await TransaccionController.obtenerTransaccionPorId(transId);
        if (!data) {
          Alert.alert("Error", "No se pudo cargar la transacción");
          if (handleBack) {
            handleBack();
          }
          return;
        }
        setTrans(data);
      } catch (error) {
        Alert.alert("Error", "Error al cargar la transacción: " + (error.message || ''));
        if (handleBack) {
          handleBack();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [transId, cargarCategorias]);

  const guardarCambios = async () => {
    if (!trans.nombre || !trans.nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    if (!trans.monto || isNaN(trans.monto)) {
      Alert.alert("Error", "El monto debe ser un número válido");
      return;
    }
    if (!trans.categoria || !trans.categoria.trim()) {
      Alert.alert("Error", "La categoría es obligatoria");
      return;
    }
    if (!trans.descripcion || !trans.descripcion.trim()) {
      Alert.alert("Error", "La descripción es obligatoria");
      return;
    }

    setGuardando(true);
    const res = await TransaccionController.editarTransaccion(transId, trans);
    setGuardando(false);

    if (!res.success) {
      Alert.alert("Error", res.error);
      return;
    }
    Alert.alert("Éxito", "Transacción actualizada correctamente");
    if (handleBack) {
      handleBack();
    }
  };

  const handleGoBack = () => {
    if (handleBack) {
      handleBack();
    }
  };

  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/fondo2.jpg')}
        resizeMode='cover'
        style={styles.backgrounds}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0b7a89ff" />
          <Text style={styles.loadingText}>Cargando transacción...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!trans) return null;

  return (
    <ImageBackground
      source={require('../assets/fondo2.jpg')}
      resizeMode='cover'
      style={styles.backgrounds}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.backButton}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Editar {trans.es_gasto ? 'Gasto' : 'Ingreso'}</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.formulario}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={trans.nombre}
              onChangeText={(txt) => setTrans({ ...trans, nombre: txt })}
              placeholder="Ingrese el nombre"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              value={String(trans.monto)}
              onChangeText={(txt) => setTrans({ ...trans, monto: txt })}
              placeholder="$0.00"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Categoría</Text>
            {categoriasPresupuestos.length === 0 ? (
              <View style={styles.categoriaContainer}>
                <Text style={styles.categoriaMensaje}>
                  No hay categorías disponibles.
                </Text>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={styles.categoriaSelector}
                  onPress={() => setCategoriaMenuAbierto(!categoriaMenuAbierto)}
                >
                  <Text style={[styles.categoriaSelectorText, !trans.categoria && styles.categoriaSelectorPlaceholder]}>
                    {trans.categoria || 'Selecciona una categoría'}
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
                      {categoriasPresupuestos.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            styles.categoriaOption,
                            trans.categoria === opt && styles.categoriaOptionSelected
                          ]}
                          onPress={() => {
                            setTrans({ ...trans, categoria: opt });
                            setCategoriaMenuAbierto(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.categoriaOptionText,
                              trans.categoria === opt && styles.categoriaOptionTextSelected
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={trans.descripcion}
              onChangeText={(txt) => setTrans({ ...trans, descripcion: txt })}
              placeholder="Ingrese la descripción"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />

            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Fecha: <Text style={styles.infoValue}>{trans.fecha}</Text></Text>
              <Text style={styles.infoLabel}>Tipo: <Text style={styles.infoValue}>{trans.es_gasto ? 'Gasto' : 'Ingreso'}</Text></Text>
            </View>

            <View style={styles.botones}>
              <TouchableOpacity 
                style={styles.btnCancelar} 
                onPress={handleGoBack}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btnGuardar, guardando && styles.btnGuardarDisabled]} 
                onPress={guardarCambios}
                disabled={guardando}
              >
                <Text style={styles.btnGuardarTexto}>
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgrounds: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },

  scrollView: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },

  backButton: {
    fontSize: 16,
    color: '#0b7a89ff',
    fontWeight: 'bold',
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#001F3F',
  },

  formulario: {
    backgroundColor: '#E8D9C8',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1C6B5',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001F3F',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1C6B5',
    backgroundColor: '#F7EFE6',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#001F3F',
  },

  inputMultiline: {
    textAlignVertical: 'top',
    height: 80,
  },

  infoContainer: {
    backgroundColor: '#F7EFE6',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D1C6B5',
  },

  infoLabel: {
    fontSize: 14,
    color: '#001F3F',
    marginBottom: 6,
    fontWeight: '600',
  },

  infoValue: {
    fontWeight: 'bold',
    color: '#0b7a89ff',
  },

  botones: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },

  btnCancelar: {
    flex: 1,
    backgroundColor: '#999',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnCancelarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  btnGuardar: {
    flex: 1,
    backgroundColor: '#79B7B4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnGuardarDisabled: {
    opacity: 0.6,
  },

  btnGuardarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

  categoriaContainer: {
    marginTop: 10,
    marginBottom: 10,
  },

  categoriaSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F7EFE6',
    borderWidth: 1,
    borderColor: '#D1C6B5',
    borderRadius: 8,
    marginTop: 0,
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
    backgroundColor: '#F7EFE6',
    borderWidth: 1,
    borderColor: '#D1C6B5',
    borderRadius: 8,
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

  categoriaOptionText: {
    fontSize: 16,
    color: '#001F3F',
    fontWeight: '600',
  },

  categoriaOptionTextSelected: {
    color: '#fff',
  },

  categoriaMensaje: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
    fontStyle: 'italic',
  },
});
