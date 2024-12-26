import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // Estado del usuario
  const [isNewUser, seetIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar la información del usuario desde AsyncStorage al iniciar la app
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Si hay un usuario guardado, cargarlo
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      } finally {
        setLoading(false); // Marcar como cargado
      }
    };

    fetchUser();
  }, []);

  // Guardar la información del usuario en AsyncStorage
  const saveUser = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isNewUser, saveUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser debe usarse dentro de un UserProvider');
    }
    return context;
  };
