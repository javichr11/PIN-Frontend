import React from 'react'; 
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

// Función para formatear la fecha y la hora
const formatearFechaHora = (fechaISO) => {
  const fecha = new Date(fechaISO);
  
  // Obtener la hora en formato HH:mm
  const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Obtener la fecha en formato dd-MM-yyyy
  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return { hora, fechaFormateada };
};

const VerEvento = ({ eventos, navigation }) => {

  if(eventos.length === 0){
    console.log('eventos.lenght === 0');
    return <Text>No hay eventos disponibles.</Text>;
  }

  const renderItem = ({ item }) => {
    // Formateamos la fecha y la hora
    const { hora, fechaFormateada } = formatearFechaHora(item.fecha);

    return (
      <TouchableOpacity onPress={() => navigation.navigate ('DetalleEvento', { evento: item})}>
        <View style={styles.eventCard}>
          <Image
            source={{ uri: item.foto || 'https://via.placeholder.com/150' }} 
            style={styles.eventImage}
          />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{item.nombre}</Text>

            {/* Mostrar la hora con el icono del reloj */}
            <View style={styles.infoRow}>
              <FontAwesome name="clock-o" size={20} color="gray" />
              <Text style={styles.eventTime}>{hora}</Text>
            </View>

            {/* Mostrar la fecha con el icono del calendario */}
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
          <View style={styles.infoRow}>
            <FontAwesome name="users" size={20} color="gray" />
            <Text style={styles.eventAforo}>{`0/${item.aforo}`}</Text>
          </View>
        </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => navigation.navigate('CrearEvento', { evento: item })}
            >
              <FontAwesome name="refresh" size={24} color="black" />
              <Text>Modificar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="delete" size={24} color="black" />
              <Text>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={eventos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
});

export default VerEvento;
