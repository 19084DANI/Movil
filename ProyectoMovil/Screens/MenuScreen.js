import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';

import Transacciones from './TransaccionesScreen';
import PresupuestosScreen from './PresupuestosScreen';
import Home from './HomeScreen';
import NuevaTransScreen from './NuevaTransScreen';
import GraficaScreen from './GraficaScreen';

export default function MenuScreen () {

  const [screen, setScreen] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current;

  // Opciones del menú
  const menuOptions = [
    { name: 'Menú', icon: 'home-outline', screen: 'home' },
    { name: 'Gastos', icon: 'wallet-outline', screen: 'gastos' },
    { name: 'Transacciones', icon: 'swap-horizontal-outline', screen: 'transacciones' },
    { name: 'Gráficas', icon: 'bar-chart-outline', screen: 'grafica' },
    { name: 'Presupuesto', icon: 'calculator-outline', screen: 'presupuesto' },
    { name: 'Perfil', icon: 'person-outline', screen: 'perfil' },
  ];

  useEffect(() => {
    // Animar el menú
    Animated.timing(slideAnim, {
      toValue: menuOpen ? 0 : -280,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [menuOpen, slideAnim]);

  const handleScreenChange = (screenName) => {
    setScreen(screenName);
    setMenuOpen(false);
  };

  const handleBackToMenu = () => {
    setScreen('home');
  };

  // Renderizar contenido según la pantalla seleccionada
  const renderScreen = () => {
    switch(screen){
      case 'presupuesto':
        return <PresupuestosScreen/>
      case 'transacciones':
        return <Transacciones/>
      case 'gastos':
        return <NuevaTransScreen/>
      case 'grafica':
        return <GraficaScreen/>
      case 'perfil':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Perfil</Text>
            <Text>Aquí va la pantalla de perfil</Text>
          </View>
        )
      case 'home':
      default:
        return <Home/>
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con botón hamburguesa y logo */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.hamburger}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Ionicons name={menuOpen ? 'close' : 'menu'} size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ahorra+</Text>
        <TouchableOpacity 
          style={styles.logoButton}
          onPress={handleBackToMenu}
        >
          <Ionicons name="home" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Overlay oscuro cuando el menú está abierto */}
      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMenuOpen(false)}
          activeOpacity={0.3}
        />
      )}

      {/* Contenido principal */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Menú lateral izquierdo desplegable */}
      <Animated.View style={[styles.menu, { left: slideAnim }]}>
        <ScrollView>
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                screen === option.screen && styles.menuItemActive
              ]}
              onPress={() => handleScreenChange(option.screen)}
            >
              <Ionicons name={option.icon} size={24} color="#001F3F" style={styles.menuIcon} />
              <Text style={styles.menuText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#001F3F',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 15,
    zIndex: 10,
    minHeight: 100,
  },
  hamburger: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#F5E6D3',
    borderRightWidth: 2,
    borderRightColor: '#001F3F',
    zIndex: 2,
    paddingTop: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D4C4',
  },
  menuItemActive: {
    backgroundColor: '#E8D9C8',
    borderLeftWidth: 4,
    borderLeftColor: '#001F3F',
    paddingLeft: 16,
  },
  menuIcon: {
    marginRight: 16,
    color: '#001F3F',
  },
  menuText: {
    fontSize: 16,
    color: '#001F3F',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    zIndex: 0,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5E6D3',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001F3F',
    marginBottom: 20,
  },
});