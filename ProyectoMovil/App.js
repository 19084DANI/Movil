import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { initDatabase } from './database/DatabaseService';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import NuevaTransScreen from './Screens/NuevaTransScreen';

const Tab = createBottomTabNavigator();

export default function App() {

  const [iniciarbd, setBD] = useState(false);

  useEffect(() => {
    const iniciarBD = async () => {
      const iniciar = await initDatabase();
      setBD(iniciar);
    };
    iniciarBD();
  }, []);

  if (!iniciarbd) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#93A392' }}>
        <ActivityIndicator size="large" color="#517f7dff" />
        <Text style={{ marginTop: 10, color: '#517f7dff' }}>Inicializando base de datos...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') iconName = 'home-outline';
            if (route.name === 'Login') iconName = 'person-outline';
            if (route.name === 'NuevaTrans') iconName = 'add-circle-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { paddingBottom: 5, height: 60 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="NuevaTrans" component={NuevaTransScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
