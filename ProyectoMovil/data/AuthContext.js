import React, { createContext, useState, useEffect } from 'react';
import databaseService from '../database/DatabaseService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);

  useEffect(() => {
    // Inicializar contexto de autenticación
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Aquí puedes verificar si hay un usuario guardado
      // Por ahora solo marcamos como listo
      setIsLoading(false);
    } catch (e) {
      console.error('Error al restaurar sesión:', e);
      setIsLoading(false);
    }
  };

  const authContext = {
    signIn: async (email, password) => {
      try {
        // Buscar usuario en la base de datos
        const result = await databaseService.select(
          'usuarios',
          'correo = ?',
          [email]
        );

        if (result.success && result.data.length > 0) {
          const usuario = result.data[0];
          // Aquí deberías verificar la contraseña (preferiblemente hasheada)
          if (usuario.contrasena === password) {
            setUser(usuario);
            setIsSignout(false);
            return { success: true, user: usuario };
          } else {
            return { success: false, message: 'Contraseña incorrecta' };
          }
        } else {
          return { success: false, message: 'Usuario no encontrado' };
        }
      } catch (error) {
        console.error('Error en signIn:', error);
        return { success: false, message: error.message };
      }
    },

    signUp: async (nombre, email, telefono, password) => {
      try {
        const result = await databaseService.insert('usuarios', {
          nombre,
          correo: email,
          telefono,
          contrasena: password,
        });

        if (result.success) {
          const newUser = { id: result.insertId, nombre, correo: email, telefono };
          setUser(newUser);
          setIsSignout(false);
          return { success: true, user: newUser };
        } else {
          return { success: false, message: result.error };
        }
      } catch (error) {
        console.error('Error en signUp:', error);
        return { success: false, message: error.message };
      }
    },

    signOut: async () => {
      try {
        setUser(null);
        setIsSignout(true);
        return { success: true };
      } catch (error) {
        console.error('Error en signOut:', error);
        return { success: false, message: error.message };
      }
    },

    signUp: async (nombre, email, telefono, password) => {
      try {
        const result = await databaseService.insert('usuarios', {
          nombre,
          correo: email,
          telefono,
          contrasena: password,
        });

        if (result.success) {
          const newUser = { id: result.insertId, nombre, correo: email, telefono };
          setUser(newUser);
          setIsSignout(false);
          return { success: true, user: newUser };
        } else {
          return { success: false, message: result.error };
        }
      } catch (error) {
        console.error('Error en signUp:', error);
        return { success: false, message: error.message };
      }
    },

    getUser: () => user,
  };

  return (
    <AuthContext.Provider value={{ ...authContext, user, isLoading, isSignout }}>
      {children}
    </AuthContext.Provider>
  );
};
