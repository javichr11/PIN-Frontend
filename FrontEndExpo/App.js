import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CrearEvento from "./interfaz/CrearEvento";
import VerEvento from "./interfaz/VerEvento"; // Asegúrate de importar correctamente

const Stack = createStackNavigator();

export default function App() {
  const [evento, setEvento] = useState({
    imagen: 'https://images.adsttc.com/media/images/5ca7/72d5/284d/d153/3000/01f3/newsletter/UC8A1834.jpg?1554477741',
    titulo: 'Un cafelito post trabajo',
    hora: '21:00',
    localizacion: 'Calle Mayor',
    aforo: 5,
  });

  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="VerEvento">
        {/* Pantalla VerEvento */}
        <Stack.Screen 
          name="VerEvento" 
          options={{ title: 'Mis eventos' }}
        >
          {props => <VerEvento {...props} evento={evento} />}
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
