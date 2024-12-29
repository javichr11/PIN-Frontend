import React, {useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const userID = '33';

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

const Mapa = ({ eventos, route }) => {
  const [searchText, setSearchText] = useState('');
  const [nuevosEventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false); // Para alternar entre eventos filtrados y no filtrados


  const fetchEventos = async () => {
    try {
      const response = await fetch('https://croacky.onrender.com/evento/obtener'); 
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
  const fetchEventosFiltrados = async () => {
    try {
      const response = await fetch('https://croacky.onrender.com/evento/obtenerFiltrado/' + userID);
      const data = await response.json();
      if (response.ok) {
        setEventosFiltrados(data.eventos); // Cargar eventos filtrados
      } else {
        Alert.alert('Error', `No se pudieron obtener los eventos filtrados: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error al obtener eventos filtrados: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchEventos();

    if(route.params?.refresh){fetchEventos();}

  }, [route.params]);
  // if (nuevosEventos.length === 0) {
  //   return <Text>No hay eventos disponibles.</Text>;
  // };

  // Cuando se modifica la propiedad de filtro, carga los eventos filtrados si no están ya cargados
  useEffect(() => {
    if (isFiltered && eventosFiltrados.length == 0) {
      fetchEventosFiltrados(); 
    }
  }, [isFiltered]);
  

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
      
      console.log("Status Code:", response.status);
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      
      if (response.ok) {
        Alert.alert('Éxito', 'Te has unido al evento');
        fetchEventos();
      } else {
        Alert.alert('Error', responseData.message || 'No te pudiste unir al evento');
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

 

  const filteredEventos1 = isFiltered ? eventosFiltrados : nuevosEventos;
  const filteredEventos = filteredEventos1.filter(evento => evento.nombre.toLowerCase().includes(searchText.toLowerCase())); 


  return (
    <View style={styles.container}>
       {nuevosEventos.length === 0 ? (
        <Text>No hay eventos disponibles.</Text>
      ) : (
        <>
          <View style={styles.searchBarContainer}>
            <FontAwesome name="search" size={20} color="#8aba86" style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder="Buscar eventos..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsFiltered(!isFiltered)}
            style={styles.filterButton}
          >
            <Text style={styles.filterButtonText}>
              {isFiltered ? 'Ver todos los eventos' : 'Ver eventos filtrados'}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={filteredEventos}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text>No hay eventos disponibles.</Text>}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EAF2E6',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#8aba86',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: '#000000',
  },
  filterButton: {
    backgroundColor: '#8aba86',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
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