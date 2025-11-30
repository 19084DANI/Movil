import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import TransaccionController from '../controllers/TransaccionController';

export default function EditarTransScreen({ route, navigation }) {
  const id = route?.params?.id;
  const [trans, setTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "ID de transacción no encontrado");
      if (navigation && navigation.goBack) {
        navigation.goBack();
      }
      return;
    }

    (async () => {
      try {
        const data = await TransaccionController.obtenerTransaccionPorId(id);
        if (!data) {
          Alert.alert("Error", "No se pudo cargar la transacción");
          if (navigation && navigation.goBack) {
            navigation.goBack();
          }
          return;
        }
        setTrans(data);
      } catch (error) {
        Alert.alert("Error", "Error al cargar la transacción");
        if (navigation && navigation.goBack) {
          navigation.goBack();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigation]);

  const guardarCambios = async () => {
    if (!trans.nombre || !trans.nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    if (!trans.descripcion || !trans.descripcion.trim()) {
      Alert.alert("Error", "La descripción es obligatoria");
      return;
    }

    setGuardando(true);
    const res = await TransaccionController.editarTransaccion(id, trans);
    setGuardando(false);

    if (!res.success) {
      Alert.alert("Error", res.error);
      return;
    }
    Alert.alert("Éxito", "Transacción actualizada correctamente");
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleGoBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
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
          <Text style={styles.titulo}>Editar Transacción</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.formulario}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={trans.nombre}
            onChangeText={(txt) => setTrans({ ...trans, nombre: txt })}
            placeholder="Ingrese el nombre"
            placeholderTextColor="#999"
          />

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
            <Text style={styles.infoLabel}>Monto: <Text style={styles.infoValue}>${trans.monto.toFixed(2)}</Text></Text>
            <Text style={styles.infoLabel}>Categoría: <Text style={styles.infoValue}>{trans.categoria}</Text></Text>
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
});
