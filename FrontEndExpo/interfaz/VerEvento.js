import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const VerEvento = ({ evento, navigation }) => {
  // Verifica si el evento existe
  if (!evento) {
    return <Text>Cargando evento...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.eventCard}>
        {/* Verifica si la imagen existe; de lo contrario, usa una imagen predeterminada */}
        <Image
          source={{ uri: evento.imagen }}
          style={styles.eventImage}
        />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{evento.titulo}</Text>
          <View style={styles.infoRow}>
            <FontAwesome name="clock-o" size={20} color="gray" />
            <Text style={styles.eventTime}>{evento.hora}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="gray" />
            <Text style={styles.eventLocation}>{evento.localizacion}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="users" size={20} color="gray" />
            <Text style={styles.eventAforo}>{`${evento.aforo}/10`}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}  onPress={() => navigation.navigate('CrearEvento', { evento })}>
            <FontAwesome name="refresh" size={24} color="black" />
            <Text>Modificar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="delete" size={24} color="black" />
            <Text>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EAF2E6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  eventInfo: {
    marginTop: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventTime: {
    marginLeft: 5,
    fontSize: 16,
    color: '#555',
  },
  eventLocation: {
    marginLeft: 5,
    fontSize: 16,
    color: '#555',
  },
  eventAforo: {
    marginLeft: 5,
    fontSize: 16,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
});

export default VerEvento;
