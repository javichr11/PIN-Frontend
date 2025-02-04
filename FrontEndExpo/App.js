import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from 'react-native-vector-icons';
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";
import InicioSesion from "./interfaz/InicioSesion";
import VerEvento from "./interfaz/VerEventos";
import Registro from "./interfaz/Registro";
import RegistroFoto from "./interfaz/RegistroFoto";
import Perfil from "./interfaz/perfil";
import ListaEventos from "./interfaz/ListaEventos";
import Mapa from "./interfaz/mapa";
import Notificaciones from "./interfaz/notificaciones";
import DetalleEvento from "./interfaz/DetalleEvento";
import Logros from "./interfaz/Logros";
import { UserProvider, useUser } from "./context/UserProvider";
import PreguntasInicial from "./interfaz/PreguntasInicial";
import Preguntas1 from "./interfaz/Preguntas1";
import Preguntas2 from "./interfaz/Preguntas2";
import Preguntas3 from "./interfaz/Preguntas3";
import Preguntas4 from "./interfaz/Preguntas4";
import Preguntas5 from "./interfaz/Preguntas5";
import RanaAsignada from "./interfaz/RanaAsignada";
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
  
const loadFonts = async () => {
  await Font.loadAsync({
    'Satoshi-Regular': require('./assets/font/RedHatText-Medium.ttf'),
  });
};

function VerEventosStack({ eventos, setEventos, fetchEventos }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListaEventos"
        options={{ title: 'Lista de Eventos', headerShown: false }}
      >
        {props => <ListaEventos {...props} eventos={eventos} fetchEventos={fetchEventos} />}
      </Stack.Screen>
      <Stack.Screen 
        name="VerEvento" 
        options={{ headerShown: false }}
      >
        {props => <VerEvento {...props} eventos={eventos} fetchEventos={fetchEventos} />}
      </Stack.Screen>
      <Stack.Screen 
        name="CrearEvento"
        options={{ title: 'Nuevo Evento' }}
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
        eventos={eventos}
        options={{ headerShown: false }}
      />
        
      <Stack.Screen 
        name="DetalleEvento" 
        component={DetalleEvento} 
        options={{ title: 'Detalle del Evento' }} 
      />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator>

    <Stack.Screen 
        name="perfil"
        component={Perfil}
        options={{ headerShown: false }}
        />
      <Stack.Screen 
        name="DetalleEvento" 
        component={DetalleEvento} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Logros"
        component={Logros}    
        options={{ headerShown: false }}   
      />      
      <Stack.Screen
        name="VerEventos"
        component={VerEvento}
        options={{headerShown: false}}
      /> 
      <Stack.Screen
        name="CrearEventos"
        component={CrearEvento}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}


function AppContent() {
  const { isAuthenticated , setIsAuthenticated} = useUser();
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
          name="verMapa"
          options={{
            title: 'Eventos',
            tabBarIcon:({color, size}) => (
              <Ionicons name="list" color={color} size={size} />
            ),
          }}
        >
          {() => <MapaStack eventos={eventos} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Mapa"
          options={{
            title: 'Mapa',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
            ),
          }}
        >
          {props => <VerEventosStack {...props} eventos={eventos} setEventos={setEventos} fetchEventos={fetchEventos} />}
        </Tab.Screen>
        <Tab.Screen 
          name="notificaciones"
          component={Notificaciones}
          options={{
            title: 'Notificaciones',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="perfil"
          component={PerfilStack}
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    ) :(
      <Stack.Navigator>
        <Stack.Screen name="InicioSesion" options={{ headerShown: false }}>
          {props => <InicioSesion {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro de usuario' }} />
        <Stack.Screen name="RegistroFoto" options={{ title: 'Registro de usuario' }}>
          {props => <RegistroFoto {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="PreguntasInicial" options={{ headerShown: false }}>
          {props => <PreguntasInicial {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="Preguntas1" options={{ headerShown: false }}>
          {props => <Preguntas1 {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="Preguntas2" options={{ headerShown: false }}>
          {props => <Preguntas2 {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="Preguntas3" options={{ headerShown: false }}>
          {props => <Preguntas3 {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="Preguntas4" options={{ headerShown: false }}>
          {props => <Preguntas4 {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="Preguntas5" options={{ headerShown: false }}>
          {props => <Preguntas5 {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="RanaAsignada" options={{ headerShown: false }}>
          {props => <RanaAsignada {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
      </Stack.Navigator>
    )}
  </NavigationContainer>
);

}
export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#ffffff" />;
  }
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
