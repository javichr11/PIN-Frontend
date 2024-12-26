import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from 'react-native-vector-icons'; 
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";
import VerEvento from "./interfaz/VerEvento";
import registro from "./interfaz/Registro";
import registroFoto from "./interfaz/RegistroFoto";
import perfil from "./interfaz/perfil";
import mapita from "./interfaz/mapita";
import Mapa from "./interfaz/mapa";
import notificaciones from "./interfaz/notificaciones";
import DetalleEvento from "./interfaz/DetalleEvento";
import Logros from "./interfaz/Logros";
import Preferencias from "./interfaz/Preferencias";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import InicioSesion from "./interfaz/InicioSesion";
import Perfil from "./interfaz/perfil";
import Registro from "./interfaz/Registro";
import RegistroFoto from "./interfaz/RegistroFoto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider, useUser } from "./context/UserProvider";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



function VerEventosStack({ eventos, setEventos, fetchEventos }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="VerEvento" 
        options={{ headerShown: false }}
      >
        {props => <VerEvento {...props} eventos={eventos} fetchEventos={fetchEventos} />}
      </Stack.Screen>
      <Stack.Screen 
        name="CrearEvento"
        options={{ title: 'Modificar Evento' }}
      >
        {props => <CrearEvento {...props} setEventos={setEventos} fetchEventos={fetchEventos} />}
      </Stack.Screen>
      <Stack.Screen 
        name="DetalleEvento"
        component={DetalleEvento} 
        options={{ title: 'Detalle del Evento' }} 
      />
      <Stack.Screen name="Registro"  component={registro} />
      <Stack.Screen name="RegistroFoto" options={{  headerShown: false }} component={registroFoto} />
      <Stack.Screen 
        name="Preferencias" 
        component={Preferencias}  
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );
}


function MapaStack({ eventos }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="verMapa"
        options={{ headerShown: false }}
      >
        {props => <Mapa {...props} eventos={eventos} />}
      </Stack.Screen>
      <Stack.Screen 
        name="DetalleEvento" 
        component={DetalleEvento} 
        options={{ title: 'Detalle del Evento' }} 
      />

      
    </Stack.Navigator>
  );
}

function AppContent() {
  const { user } = useUser();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  const fetchEventos = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://croacky.onrender.com/evento/obtener');
      const data = await response.json();
      setEventos(data.data || []);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchEventos();
  }, []);
 
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
 
  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          }}>
          <Tab.Screen 
            name="VerEventos"
            options={{
              title: 'Mis Eventos', 
              tabBarIcon:({color, size}) => (
                <Ionicons name="list" color={color} size={size} />
              ),
            }}
          >
            {() => <VerEventosStack eventos={eventos} setEventos={setEventos} fetchEventos={fetchEventos} />}
          </Tab.Screen>
          <Tab.Screen 
            name="mapita"
            component={mapita}
            options={{
              title: 'Mapa',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="folder" color={color} size={size} />
              ),
            }}
            initialParams={{ eventos }}
          />
          <Tab.Screen
            name="Logros"
            component={Logros}
            options={{
              title: 'Tus logros',
            }}
            initialParams={{ eventos }}
          />
          <Tab.Screen 
            name="verMapa"
            options={{
              title: 'Mapa',
              tabBarIcon:({color, size}) => (
                <Ionicons name="map" color={color} size={size} />
              ),
            }}
          >
            {() => <MapaStack eventos={eventos} />}
          </Tab.Screen>
          <Tab.Screen 
            name="notificaciones"
            component={notificaciones}
            options={{
              title: 'Notificaciones',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="notifications" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="perfil"
            component={perfil}
            options={{
              title: 'Tu perfil',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="registro"
            component={registro}
            options={{
              title: 'Registro',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Inicio Sesión" options={{ headerShown: false }}>
            {props => <InicioSesion {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Registro" component={registro} options={{ title: 'Registro' }} />
          <Stack.Screen name="RegistroFoto" component={RegistroFoto} />
          <Stack.Screen 
            name="Preferencias"
            component={Preferencias}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
 }
 
 export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
 }
 
 const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 }); 