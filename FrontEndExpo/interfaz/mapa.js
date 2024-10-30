import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';


const userID = '10';  

const formatearFechaHora = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return { hora, fechaFormateada };
};

const Mapa = ({ eventos, navigation }) => {
  if (eventos.length === 0) {
    return <Text>No hay eventos disponibles.</Text>;
  }

  const unirseAEvento = (id) => {
    Alert.alert(
      '¿Quieres unirte al evento?',
      'Confirma para unirte al evento',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Unirse',
          onPress: () => inscribirseAEvento(id),
          style: 'default'
        },
      ],
      { cancelable: true }
    );
  };

  const inscribirseAEvento = async (eventID) => {
    try {
      const response = await fetch('https://croacky.onrender.com/evento/inscribir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventID, userID }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Te has unido al evento');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'No te pudiste unir al evento');
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error: ${error.message}`);
    }
  };

  const renderItem = ({ item }) => {
    const { hora, fechaFormateada } = formatearFechaHora(item.fecha);

    return (
      <View style={styles.eventCard}>
        <Image
          source={{ uri: item.foto || 'https://via.placeholder.com/150' }}
          style={styles.eventImage}
        />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.nombre}</Text>
          <View style={styles.infoRow}>
            <FontAwesome name="clock-o" size={20} color="gray" />
            <Text style={styles.eventTime}>{hora}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="date-range" size={20} color="gray" />
            <Text style={styles.eventDate}>{fechaFormateada}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="gray" />
            <Text style={styles.eventLocation}>{item.ubicacion}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="users" size={20} color="gray" />
            <Text style={styles.eventAforo}>{`${item.aforo}/25`}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => unirseAEvento(item.id)}
          >
            <MaterialIcons name="person-add" size={24} color="black" />
            <Text>Unirse</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={eventos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EAF2E6',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
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
  eventDate: {
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
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
});

export default Mapa;
