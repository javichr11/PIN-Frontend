import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from 'react-native-vector-icons';
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";
import VerEvento from "./interfaz/VerEvento";
import perfil from "./interfaz/perfil";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  const [eventos, setEventos] = useState([]);

  // Función para obtener eventos desde la base de datos
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('https://croacky.onrender.com/evento/obtener');
        const data = await response.json();
        console.log(data);
        // Extraemos los eventos desde 'data.data'
        setEventos(data.data); 
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };
    fetchEventos();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOption={{
          tabBarActiveintColor: 'tomato',
          tabBarInactiveintColor: 'gray',
        }}>
        {/* Stack para la pantalla VerEvento */}
        <Tab.Screen name="VerEventos" options={{ title: 'Mis Eventos', tabBarIcon:({color, size}) => (
            <Ionicons name = "list" color={color} size={size} /> ), }}>
          {props => (
            <Stack.Navigator>
              <Stack.Screen 
                name="VerEvento" 
                options={{ headerShown: false }} // Oculta el header de esta pantalla
              >
                {props => <VerEvento {...props} eventos={eventos} />}
              </Stack.Screen>
              <Stack.Screen 
                name="CrearEvento" 
                component={CrearEvento} 
                options={{ title: 'Modificar Evento' }} 
              />
            </Stack.Navigator>
          )}
        </Tab.Screen>

        {/* Otra pestaña para la creación de eventos */}
        <Tab.Screen 
          name="perfil" component={perfil} options={{ 
            title: 'tu perfil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
              ),
            }} 
            />
      </Tab.Navigator>
    </NavigationContainer>
  );
}