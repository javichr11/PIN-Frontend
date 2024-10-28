import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from 'react-native-vector-icons';
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";
import VerEvento from "./interfaz/VerEvento";
import perfil from "./interfaz/perfil";
import Archivos from "./interfaz/Archivos";
import mapa from "./interfaz/mapa";
import notificaciones from "./interfaz/notificaciones";
import DetalleEvento from "./interfaz/DetalleEvento";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function VerEventosStack({ eventos }) {
  return(
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
      <Stack.Screen 
        name="DetalleEvento" 
        component={DetalleEvento} 
        options={{ title: 'Detalle del Evento' }} 
      />
      
    </Stack.Navigator>
  );
}

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
        screenOptions={{
          tabBarActiveTintColor: 'tomato',
          tabBarTinactiveintColor: 'gray',
        }}>
        {/* Stack para la pantalla VerEvento */}
        <Tab.Screen 
          name="VerEventos" options={{ title: 'Mis Eventos', tabBarIcon:({color, size}) => (
            <Ionicons name = "list" color={color} size={size} /> ), }}
        >
          {() => <VerEventosStack eventos={eventos} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Archivos" component={Archivos} options={{ 
            title: 'Tus archivos',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="folder" color={color} size={size} />
              ),
            }} 
          />
        <Tab.Screen 
          name="Mapa" component={mapa} options={{ 
            title: 'Mapa',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
              ),
            }} 
          />
        <Tab.Screen 
          name="notificaciones" component={notificaciones} options={{ 
            title: 'Notificaciones',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications" color={color} size={size} />
              ),
            }} 
          />
          
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
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});