import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";
import VerEvento from "./interfaz/VerEvento";

const Stack = createStackNavigator();

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
       <Stack.Navigator initialRouteName="VerEvento">
        {/* Pantalla VerEvento */}
        <Stack.Screen 
          name="VerEvento" 
          options={{ title: 'Mis eventos' }}
        >
          {props => <VerEvento {...props} eventos={eventos} />}
        </Stack.Screen> 
        
        {/* Pantalla CrearEvento */}
        <Stack.Screen 
          name="CrearEvento" 
          component={CrearEvento} 
          options={{ title: 'Modificar evento' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
