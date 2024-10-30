import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

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

const VerEvento = ({ navigation }) => {
  const [eventos, setEventos] = useState([]);

  const fetchEventos = async () => {
    try {
      const response = await fetch('https://croacky.onrender.com/evento/obtener'); // Cambia esto por tu endpoint real
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setEventos(data.data);
      } else {
        Alert.alert('Error', `No se pudieron obtener los eventos: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error al obtener eventos: ${error.message}`);
    }
  };
  useEffect(() => {
    fetchEventos();
  }, []);
  if (eventos.length === 0) {
    return <Text>No hay eventos disponibles.</Text>;
  }

  const confirmarEliminar = (id) => {
    console.log('El id del evento es: ', id)
    Alert.alert(
      '¿Estás seguro?',
      '¿Estás seguro de que deseas eliminar el evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar evento',
          onPress: () => eliminarEvento(id),
          style: 'destructive'
        },
      ],
      { cancelable: true }
    );
  };

  const eliminarEvento = async (id) => {
    try {
        const response = await fetch(`https://croacky.onrender.com/evento/eliminar/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            Alert.alert('Éxito', 'El evento ha sido eliminado correctamente');
            await fetchEventos();
        } else {
            const errorData = await response.json(); // Obtén detalles del error
            Alert.alert('Error', errorData.message);
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
            <Text style={styles.eventAforo}>{`${item.inscritos}/${item.aforo}`}</Text>
          </View>
        </View>

        {/* Botones dentro de la tarjeta */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('CrearEvento', { evento: item })}
          >
            <FontAwesome name="refresh" size={24} color="black" />
            <Text>Modificar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => confirmarEliminar(item.id)}
          >
            <MaterialIcons name="delete" size={24} color="black" />
            <Text>Eliminar</Text>
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

export default VerEvento;
