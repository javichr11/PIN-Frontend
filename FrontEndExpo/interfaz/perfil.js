import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../context/UserProvider';

const Perfil = () => {
  const { user, logout } = useUser();

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>Bienvenido, {user.nombre}</Text>
          <Text style={styles.infoText}>ID: {user.id}</Text>
          <Text style={styles.infoText}>Edad: {user.edad}</Text> {/* Mostrar edad */}
          <Text style={styles.infoText}>Móvil: {user.movil}</Text> {/* Mostrar edad */}
          {/* Mostrar foto de perfil si existe */}
          {user.foto ? (
            <Image source={{ uri: user.foto }} style={styles.profileImage} />
          ) : (
            <Image
              source={require('../assets/default-user.png')} // Imagen por defecto
              style={styles.profileImage}
            />
          )}

          <Button mode="contained" onPress={logout} style={styles.logoutButton}>
            Cerrar sesión
          </Button>
        </>
      ) : (
        <Text>No hay usuario autenticado</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default Perfil;
