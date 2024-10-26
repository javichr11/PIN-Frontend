import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";
import VerEvento from "./interfaz/VerEvento";

const Stack = createStackNavigator();

export default function App() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://croacky.onrender.com/evento/obtener');
        const data = await response.json();
        console.log(data);
        setEventos(data.data || []);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setLoading(false);
      }
    };
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
      <Stack.Navigator initialRouteName="VerEvento">
        <Stack.Screen 
          name="VerEvento" 
          options={{ title: 'Mis eventos' }}
        >
          {props => <VerEvento {...props} eventos={eventos} />}
        </Stack.Screen> 
        <Stack.Screen 
          name="CrearEvento" 
          component={CrearEvento} 
          options={{ title: 'Modificar evento' }} 
        />
      </Stack.Navigator>
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
