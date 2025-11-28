import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MenuScreen from './Screens/MenuScreen';
import LoginScreen from './Screens/LoginScreen';
import { initDatabase } from './database/DatabaseService';

export default function App() {
  const [iniciarbd, setBD] = useState(false);

  useEffect(() => {
    const iniciarbd = async () => {
      const iniciar = await initDatabase();
      setBD(iniciar);
    };
    iniciarbd();
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
   <MenuScreen/>
  );
}
