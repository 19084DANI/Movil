import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import IniciarSeScreen from '../Screens/IniciarSeScreen';
import RegistroScreen from '../Screens/RegistroScreen';
import RecuperarContrasena from '../Screens/RecuperarContrasena';
import HomeScreen from '../Screens/HomeScreen';
import MenuScreen from '../Screens/MenuScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="IniciarSeScreen" component={IniciarSeScreen} />
        <Stack.Screen name="RegistroScreen" component={RegistroScreen} />
        <Stack.Screen name="RecuperarContrasena" component={RecuperarContrasena} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
