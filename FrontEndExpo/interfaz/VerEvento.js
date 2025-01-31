import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 


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

const getCardColor = (tematica) => {
  switch (tematica?.toUpperCase()) {
    case 'ECO':
      return 'rgba(182, 252, 190, 0.5)';
    case 'DEPORTE': 
      return 'rgba(255, 254, 245, 0.5)';
    case 'ARTE':
      return 'rgba(211, 182, 255, 0.5)';
    case 'MUSICA':
      return 'rgba(250, 106, 68, 0.5)';
    default:
      return 'rgba(255, 255, 255, 0.5)';
  }
};

const VerEvento = ({ navigation, route }) => {
  const [eventos, setEventos] = useState([]);

  const fetchEventos = async () => {
    try {
      const response = await fetch('https://croacky.onrender.com/evento/obtener');
      const data = await response.json();
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
    if(route.params?.refresh) {
      fetchEventos();
    }
  }, [route.params]);

  const renderItem = ({ item }) => {

    const { hora, fechaFormateada } = formatearFechaHora(item.fecha);
    const overlayColor = getCardColor(item.tematica);

    return (
      <TouchableOpacity 
        style={styles.cardContainer}
        onPress={() => navigation.navigate('DetalleEvento', {evento: item})}
      >
        <View style={styles.eventCard}>
          <Image
            source={{ uri: item.foto || 'https://via.placeholder.com/150' }}
            style={styles.eventImage}
          />
          <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
            <View style={styles.dateTimeContainer}>
            <Text style={styles.eventDate}>{`${fechaFormateada} • ${hora}`}</Text>
            </View>
            <Text style={styles.eventTitle}>{item.nombre}</Text>
          </View>

          <View style={styles.inscritosAforoContainer}>
            <Icon name="people" size={14} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.inscritosAforoText}>
              {item.inscritos}/{item.aforo}
            </Text>
          </View>
          
          <View style={styles.actions}>
          <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('CrearEvento', { evento: item });
              }}
            >
              <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>    
          <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={(e) => {
                e.stopPropagation();
                confirmarEliminar(item.id);
              }}
            >
              <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const confirmarEliminar = (id) => {
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
        const errorData = await response.json();
        Alert.alert('Error', errorData.message);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error: ${error.message}`);
    }
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
    backgroundColor: '#000000',
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
    height: 200,
  },
  eventCard: {
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    padding: 16,
    justifyContent: 'space-between',
  },
  dateTimeContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',  
    justifyContent: 'flex-start',
  },
  eventDate: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingVertical: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#000000', 
    borderRadius: 25,
    marginHorizontal: 5,
  },

  editButton: {
    backgroundColor: '#3A39F5', 
  },
  
  deleteButton: {
    backgroundColor: '#000000', 
    borderWidth: 1, 
    borderColor: '#FFFFFF', 
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  inscritosAforoContainer: {
    position: 'absolute',
    top: 16, // Esto puede ajustarse a tu preferencia
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    paddingVertical: 6, 
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center', 
  },
  icon: {
    marginRight: 8, 
  },
  inscritosAforoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default VerEvento;