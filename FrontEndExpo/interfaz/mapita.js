import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps'; // Importa MapView y Marker
import { useRoute } from '@react-navigation/native'; // Importa useRoute

const Mapita = () => {
  const [eventos, setEventos] = useState([]);  // Accedemos a los eventos pasados como parámetros

  // Definimos un centro de mapa por defecto (puedes cambiar las coordenadas)
  const region = {
    latitude: 39.4699,  
    longitude: -0.3763,  
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  useEffect(() => {
    // Función para obtener los eventos desde el backend
    const obtenerEventos = async () => {
      try {
        const response = await axios.get('https://croacky.onrender.com/evento/obtener'); 
        if (response.data && response.data.data) {
          setEventos(response.data.data); // Asigna los eventos a tu estado
        }
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    obtenerEventos(); // Llama a la función al cargar el componente
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de tus eventos</Text>

      {/* Mapa de Google */}
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region} // Configura el centro y zoom inicial
        showsUserLocation={true} // Muestra la ubicación del usuario
        showsMyLocationButton={true}
      >
        {/* Añadir los marcadores para cada evento */}
        {eventos.map((evento, index) => (
          evento.sitio && evento.sitio.latitude && evento.sitio.longitude ? (
            <Marker
              key={index}
              coordinate={{
                latitude: evento.sitio.latitude, // Asegúrate de tener estos campos en los eventos
                longitude: evento.sitio.longitude,
              }}
              title={evento.nombre} // Usa el nombre del evento como título
              description={evento.descripcion} // Puedes mostrar una descripción del evento
            />
            ) : null
          ))}
        </MapView>

      {eventos.length === 0 ? (
        <Text>No hay eventos disponibles para mostrar en el mapa.</Text>
      ) : (
        <Text>{eventos.length} eventos encontrados</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '80%', // Toma la mayor parte de la pantalla
  },
});

export default Mapita;

