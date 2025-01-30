import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { formatearFecha, formatearHora} from '../context/dateFormatter';

const DetalleEvento = ({ route, navigation }) => {
  const { evento } = route.params;
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerTransparent: true,
      title: ''
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {/* Event Image Banner */}
      <Image 
        source={{ uri: evento.foto || 'https://via.placeholder.com/400x200' }} 
        style={styles.headerImage} 
      />
      
      {/* Event Info Section */}
      <View style={styles.contentContainer}>
        {/* Category and Like Button */}
        <View style={styles.categoryRow2}>
        <Text style={styles.title}>{evento.nombre}</Text>
        <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoryRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{evento.tematica}</Text>
        </View>
        <View style={styles.categoryPill2}>
         <View style={styles.userCount}>
          <Ionicons name="people-outline" size={16} color="white" />
          <Text style={styles.categoryText}>{evento.inscritos}/{evento.aforo}</Text>
          </View>
        </View>
        </View>
        

        {/* Availability Badge */}
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>¡Aún quedan plazas disponibles!</Text>
        </View>

        {/* About Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sobre el evento</Text>
          <Text style={styles.description}>{evento.descripcion}</Text>
        </View>

        {/* Date Section */}
        <View style={styles.infoSection}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Fecha</Text>
            <Text style={styles.infoValue}>{formatearFecha(evento.fecha)}</Text>
            <Text style={styles.infoTime}>{formatearHora(evento.fecha)}</Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.infoSection}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Ubicación</Text>
            <Text style={styles.infoValue}>Av. Don Víctor Ateneo, n°7, Ruzafa, Valencia</Text>
          </View>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            customMapStyle={darkMapStyle}
            initialRegion={{
              latitude: 39.4699,
              longitude: -0.3763,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: 39.4699,
                longitude: -0.3763,
              }}
            />
          </MapView>
        </View>
      </View>

      {/* Join Button */}
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Unirse al evento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }]
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  categoryRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryPill: {
    backgroundColor: '#3A39F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryPill2: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  userCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#B6FCBE',
    marginBottom: 10,
    fontFamily: 'Satoshi',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    color: '#666',
    marginLeft: 5,
    fontSize: 14,
  },
  availabilityContainer: {
    backgroundColor: 'rgba(58, 57, 245, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  availabilityText: {
    color: '#3A39F5',
    fontSize: 14,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D3B6FF',
    marginBottom: 10,
  },
  description: {
    color: '#fff',
    lineHeight: 22,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingVertical: 10,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    color: '#D3B6FF',
    fontSize: 14,
    marginBottom: 5,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  infoTime: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  mapContainer: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  joinButton: {
    backgroundColor: '#3A39F5',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Satoshi',
  },
  backButton: {
    marginLeft: 10,
  },
});

export default DetalleEvento;