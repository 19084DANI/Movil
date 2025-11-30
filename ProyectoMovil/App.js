import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { AuthProvider } from './data/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { initDatabase } from './data/database';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Inicializar base de datos cuando se carga la app
    (async () => {
      try {
        await initDatabase();
        setReady(true);
      } catch (error) {
        console.error('Error inicializando app:', error);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5E6D3' }}>
        <Text style={{ color: '#003f30ff' }}>Inicializando...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
