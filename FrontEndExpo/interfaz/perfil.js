import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../context/UserProvider';

const Perfil = () => {
  const { user, logout } = useUser();

    const fetchEventosInscrito = async () => {
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

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {/* Foto de perfil */}
          <View style={styles.profileSection}>
            <Image
              source={user.foto ? { uri: user.foto } : require('../assets/default-user.png')}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{user.nombre || 'Nombre de usuario'}</Text>
            <Text style={styles.userHandle}>@{user.nombre_usuario || 'handle'}</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Editar perfil</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.editProfileButton} onPress={logout}>
              <Text style={styles.editProfileText}>Cerrar Sesion</Text>
            </TouchableOpacity> */}
          </View>

          {/* Opciones del perfil */}
          <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Perfil</Text>
            <View style={styles.optionsSubsection}>
            <TouchableOpacity style={styles.alineadorFlecha}>
              <View style={styles.optionButton}>
                <Text style={styles.optionText}>Logros</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
              </View>
              <Image source={require('../assets/flecha_Derecha.png')} style={{width: 20, height: 20}}/>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={[styles.alineadorFlecha, { marginLeft: 15 }]}>
              <Text style={styles.optionText}>Mis eventos</Text>
              <Image source={require('../assets/flecha_Derecha.png')} style={{width: 20, height: 20}}/>
            </TouchableOpacity>
            </View>
          </View>

          {/* Eventos inscritos */}
          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>Eventos inscritos</Text>
            {/* Ejemplo de evento */}
            <View style={styles.eventCard}>
              <Text style={styles.eventDate}>vie. 06/12/2024 · 18:30</Text>
              <View style={styles.eventDetails}>
                <Text style={styles.eventParticipants}>7/19 participantes</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <Text>No hay usuario autenticado</Text>
      )}
      <TouchableOpacity style={styles.editProfileButton} onPress={logout}>
              <Text style={styles.optionText}>Cerrar Sesion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    padding: 10,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius:25,
  },
  alineadorFlecha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight:15,
    },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  optionText: {
    color: '#FFF',
    fontSize: 17,
  },
  badge: {
    backgroundColor: '#00F',
    borderRadius: 15,
    marginLeft: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 17,
  },
  separator: {
    height: 2,
    backgroundColor: '#444',
    marginVertical: 5,
    marginHorizontal: 15,
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
});

export default Perfil;
