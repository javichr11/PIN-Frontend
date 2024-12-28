import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from "react-native";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isNewUser, setIsNewUser] = useState(false);

  // Cargar la información del usuario desde AsyncStorage al iniciar la app
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          return true;
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Guardar la información del usuario en AsyncStorage
  const saveUser = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      return false;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsNewUser(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        logout();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isNewUser, 
      setIsNewUser,
      saveUser, 
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};

export default UserProvider;