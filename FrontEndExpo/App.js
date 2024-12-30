import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from 'react-native-vector-icons';
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";
import InicioSesion from "./interfaz/InicioSesion";
import VerEvento from "./interfaz/VerEvento";
import Registro from "./interfaz/Registro";
import RegistroFoto from "./interfaz/RegistroFoto";
import Perfil from "./interfaz/perfil";
import MapaVisual from "./interfaz/mapita";
import Mapa from "./interfaz/mapa";
import Notificaciones from "./interfaz/notificaciones";
import DetalleEvento from "./interfaz/DetalleEvento";
import Logros from "./interfaz/Logros";
import * as Notifications from 'expo-notifications';
import { UserProvider, useUser } from "./context/UserProvider";
import PreguntasInicial from "./interfaz/PreguntasInicial";
import Preguntas1 from "./interfaz/Preguntas1";
import Preguntas2 from "./interfaz/Preguntas2";
import Preguntas3 from "./interfaz/Preguntas3";
import Preguntas4 from "./interfaz/Preguntas4";
import Preguntas5 from "./interfaz/Preguntas5";
import RanaAsignada from "./interfaz/RanaAsignada";

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
      <Stack.Screen name="DetalleEvento" component={DetalleEvento} options={{ title: 'Detalle del Evento' }} />
    </Stack.Navigator>
  );
}

function MapaStack({ eventos }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="verMapa"
        component={Mapa}
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
  const { isAuthenticated } = useUser();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const checkAuthentication = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setIsAuthenticated(true);
      }
    };
    checkAuthentication();
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
    {isAuthenticated ? (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        }}>
        <Tab.Screen 
          name="VerEvento"
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
          component={MapaVisual}
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
          component={PreguntasInicial}
          options={{
            title: 'Notificaciones',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="perfil"
          component={Perfil}
          options={{
            title: 'Tu perfil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    ) : (
      <Stack.Navigator>
  <Stack.Screen name="InicioSesion" options={{ headerShown: false }}>
    {props => <InicioSesion {...props} setIsAuthenticated={isAuthenticated} />}
  </Stack.Screen>
      <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro de usuario' }} />
      <Stack.Screen name="RegistroFoto" component={RegistroFoto} options={{ title: 'Registro de usuario' }}/>
      <Stack.Screen name="PreguntasInicial" component={PreguntasInicial} options={{ headerShown: false }} />
      <Stack.Screen name="Preguntas1" component={Preguntas1} options={{ headerShown: false }} />
      <Stack.Screen name="Preguntas2" component={Preguntas2} options={{ headerShown: false }} />
      <Stack.Screen name="Preguntas3" component={Preguntas3} options={{ headerShown: false }} />
      <Stack.Screen name="Preguntas4" component={Preguntas4} options={{ headerShown: false }} />
      <Stack.Screen name="Preguntas5" component={Preguntas5} options={{ headerShown: false }} />
      <Stack.Screen name="RanaAsignada" component={RanaAsignada} options={{ headerShown: false }} />
      <Stack.Screen name="VerEvento" options={{ headerShown: false }}>
         {() => <VerEventosStack eventos={eventos} setEventos={setEventos} fetchEventos={fetchEventos} />}
      </Stack.Screen>
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
