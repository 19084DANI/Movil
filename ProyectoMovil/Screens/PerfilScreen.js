import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('currentUser');
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserData(user);
          console.log('Datos del usuario cargados:', user);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };
    loadUserData();
  }, []);

  // Recargar datos cuando se monta el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('currentUser');
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserData(user);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      if (navigation) {
        navigation.navigate('IniciarSeScreen');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/fondo2.jpg')}
      resizeMode='cover'
      style={styles.profileBackground}
    >
      <ScrollView 
        contentContainerStyle={styles.profileContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Foto de perfil */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            {userData ? (
              <Image
                source={require('../assets/Logo.jpeg')}
                style={styles.profileImage}
                resizeMode='cover'
              />
            ) : (
              <Ionicons name="person" size={80} color="#001F3F" />
            )}
          </View>
        </View>

        {/* Nombre del usuario */}
        <View style={styles.profileInfoCard}>
          <Ionicons name="person-outline" size={24} color="#001F3F" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <Text style={styles.infoValue}>
              {userData?.nombre || 'Usuario'}
            </Text>
          </View>
        </View>

        {/* Correo */}
        <View style={styles.profileInfoCard}>
          <Ionicons name="mail-outline" size={24} color="#001F3F" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Correo</Text>
            <Text style={styles.infoValue}>
              {userData?.correo || 'correo@ejemplo.com'}
            </Text>
          </View>
        </View>

        {/* Frase inspiradora */}
        <View style={styles.quoteCard}>
          <Ionicons name="heart" size={28} color="#001F3F" style={styles.quoteIcon} />
          <Text style={styles.quoteText}>
            "Cada pequeño ahorro es un paso hacia tus sueños"
          </Text>
          <Ionicons name="heart" size={28} color="#001F3F" style={styles.quoteIcon} />
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  profileBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  profileContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  profileImageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8D9C8',
    borderWidth: 4,
    borderColor: '#001F3F',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfoCard: {
    width: '100%',
    backgroundColor: '#E8D9C8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#001F3F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#001F3F',
    fontWeight: '600',
    marginBottom: 5,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 18,
    color: '#001F3F',
    fontWeight: 'bold',
  },
  quoteCard: {
    width: '100%',
    backgroundColor: '#F5E6D3',
    borderRadius: 15,
    padding: 25,
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#001F3F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quoteIcon: {
    marginVertical: 5,
  },
  quoteText: {
    fontSize: 16,
    color: '#001F3F',
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#355559ff',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#001F3F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

