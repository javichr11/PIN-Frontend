import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView} from 'react-native';
import { useUser } from '../context/UserProvider';
import EventosInscritos from './EventosInscritos'; 
import Logros from './Logros';


const Perfil = () => {
  const { user, logout } = useUser();
  const [eventos, setEventos] = useState([]);
  const [mostrarLogros, setMostrarLogros] = useState(false); 
  const [numInsignias, setNumInsignias] = useState(0);

  const fetchEventosInscrito = async () => {
    try {
      const response = await fetch(`https://croacky.onrender.com/evento/obtener/inscrito/${user.id}`);
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

  const cuentaInsignias = async () => {
    try {
      const response = await fetch(`https://croacky.onrender.com/insignia/insigniasLogradas/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        console.log(data.logrosAdaptados.length);
        setNumInsignias(data.logrosAdaptados.length);
      } else {
        Alert.alert('Error', `No se pudieron obtener los eventos: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error al obtener eventos: ${error.message}`);
    }
  }

  useEffect(() => {
    if (user) {
      fetchEventosInscrito();
      cuentaInsignias();
    }
  }, [user]);

  return (
    
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Mostrar la ventana de logros si se activa */}
      {mostrarLogros ? (
        <Logros userID={user.id} onClose={() => setMostrarLogros(false)} />
      ) : (
      <View style={styles.container}>
        {user ? (
          <>
            {/* Foto de perfil */}
            <View style={styles.profileSection}>
              <Image
                source={user.foto ? { uri: user.foto } : require('../assets/default-user.png')}
                style={styles.profileImage}
              />
              <Text style={styles.username}>{user.nombre || 'Blackmamba23'}</Text>
              <Text style={styles.userHandle}>@{user.nombre_usuario || 'javichr_11'}</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Editar perfil</Text>
              </TouchableOpacity>
            </View>

            {/* Opciones del perfil */}
            <View style={styles.optionsSection}>
              <View style={styles.optionsSubsection}>
                <TouchableOpacity style={styles.optionButton} onPress={() => setMostrarLogros(true)}>
                  <View style={styles.optionRow}>
                    <Text style={styles.optionText}>⭐ Logros</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{numInsignias}</Text>
                    </View>
                  </View>
                  <Image
                    source={require('../assets/flecha_Derecha.png')}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.optionButton}>
                  <Text style={styles.optionText}>📅 Mis eventos</Text>
                  <Image
                    source={require('../assets/flecha_Derecha.png')}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Eventos inscritos */}
            <View style={styles.eventsSection}>
          
              <EventosInscritos eventos={eventos} />
            </View>

          </>
        ) : (
          <Text style={styles.noUserText}>No hay usuario autenticado</Text>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
      )}
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FF6600',
    marginBottom: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  userHandle: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: '#333',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  editProfileText: {
    color: '#FFF',
    fontSize: 14,
  },
  optionsSection: {
    marginBottom: 20,
  },
  optionsSubsection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 20,
    backgroundColor: '#111',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },  
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  optionText: {
    color: '#FFF',
    fontSize: 17,
  },
  badge: {
    backgroundColor: '#00F',
    borderRadius: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 5,
  },
  eventsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventDate: {
    color: '#FFF',
    fontSize: 14,
  },
  eventDetails: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventParticipants: {
    color: '#AAA',
    fontSize: 14,
  },
  eventCard: {
    width: '100%',
    aspectRatio: 16 / 9, // Proporción para mantener la tarjeta rectangular
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#222', // Color de fondo en caso de que no cargue la imagen
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  eventDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para contraste
    padding: 5,
    borderRadius: 5,
  },
  participantsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  participantIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  participantText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noEventsText: {
    color: '#AAA',
    fontSize: 14,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  logoutText: {
    color: '#FFF',
    textAlign: 'center',
  },
  noUserText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Perfil;
