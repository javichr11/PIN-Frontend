import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const ListaEventos = () => {
  const [eventos, setEventos] = useState([]);

  // Región inicial (Valencia, España)
  const region = {
    latitude: 39.4699,
    longitude: -0.3763,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
        return;
      }

      // Intentar obtener la ubicación actual para centrar el mapa
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocalizacion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.log('Error obteniendo ubicación', error);
      }
    })();
    
    const obtenerEventos = async () => {
      try {
        const response = await axios.get('https://croacky.onrender.com/evento/obtener');
        
        console.log('Datos completos:', response.data);
        
        if (response.data && response.data.data) {
          console.log('Eventos recibidos:', response.data.data);
          // Verifica el formato de las coordenadas
          response.data.data.forEach((evento, index) => {
            console.log(`Evento ${index}:`, {
              latitud: evento.latitud,
              longitud: evento.longitud,
              tipo: {
                latitud: typeof evento.latitud,
                longitud: typeof evento.longitud
              }
            });
          });
          setEventos(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };
    obtenerEventos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de tus eventos</Text>

      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onLayout={() => console.log('Mapa renderizado')}
        onMapLoaded={() => {
          console.log('Mapa cargado completamente');
          console.log('Eventos disponibles:', eventos.length);
        }}
      >
        
          <Marker
            coordinate={{
              latitude: 39.4699,
              longitude: -0.3763,
            }}
            title="Marcador de prueba"
            description="Ubicado en Valencia"
          />
        
        

        {/* Revisamos si cada evento tiene 'latitud' y 'longitud'; hacemos logs por consola */}
      {eventos.map((evento, index) => {
        console.log(`Procesando evento ${index}:`, {
          id: evento.id,
          nombre: evento.nombre,
          latitud: parseFloat(evento.latitud),
          longitud: parseFloat(evento.longitud)
        });

        if (evento.latitud && evento.longitud) {
          return (
            <Marker
            key={evento.id}
              coordinate={{
                latitude: evento.latitud,
                longitude: evento.longitud
              }}
              title={evento.nombre}
              description={evento.ubicacion}
              pinColor="pink"  // Color diferente para mayor visibilidad
              onPress={() => console.log(`Marcador ${evento.nombre} presionado`)}
            />
          );
        }
        return null;
      })}
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
    marginVertical: 10,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '80%',
  },
});

export default ListaEventos;