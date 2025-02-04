import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Image } from 'react-native';
import EventCard from "./Components/EventCard";


const Mapita = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  
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
     

      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        urlTemplate="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
          const isSelected = selectedMarker === evento
          ;
            return (
              <Marker
                key={evento.id}
                coordinate={{
                  latitude: evento.latitud,
                  longitude: evento.longitud
                }}
                title={evento.nombre}
                description={evento.ubicacion}
                anchor={{ x: 0.5, y: 1 }} // Evita que el marcador "salte"
                pinColor={evento.foto ? undefined : "pink"}  // Usa el color rosa solo si no hay imagen
                onPress={() => setSelectedMarker(isSelected ? null : evento)}
              >
                {evento.foto ? (
                    <View style={[styles.markerContainer, selectedMarker === evento.id && styles.markerSelected]}>
                    <View style={styles.markerBackground}>
                      <Image source={{ uri: evento.foto }} style={styles.markerImage} />
                    </View>
                    <View style={styles.triangle} />
                  </View>
                  ) : null}
              </Marker>
            );
        }
        return null;
      })}
      </MapView>
      {selectedMarker && (
        <TouchableOpacity 
          style={styles.cardOverlay} 
          activeOpacity={1} 
          onPress={() => setSelectedMarker(null)}
        >
          <EventCard evento={selectedMarker} showJoinButton={true} />
        </TouchableOpacity>
      )}



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
    height: '98%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 65,
    position: 'relative',
    marginBottom: 10,
    pointerEvents: 'none', // Permite que el Marker reciba el clic sin interferencias
  },
  markerBackground: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // Evita conflictos al tocar la imagen
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  markerSelected: {
    width: 60,  // Aumenta todo el marcador
    height: 75, 
    marginBottom: 15,
  },
  triangle: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#007AFF',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 80,  // Ajusta según necesidad
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  
});

export default Mapita;