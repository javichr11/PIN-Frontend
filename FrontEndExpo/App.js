import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";

const Stack = createStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name = "CreateEvent" component={CrearEvento} options={{ title: 'Nuevo evento' }} />

      </Stack.Navigator> 
    </NavigationContainer>
  )
}