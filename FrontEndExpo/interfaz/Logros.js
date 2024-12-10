import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Alert, ActivityIndicator } from 'react-native';

const Logros = () => {
  const [logros, setLogros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogros = async () => {
    try {
      const response = await fetch('https://croacky.onrender.com/insignia/insigniasLogradas/10'); // Reemplaza '10' con el userID dinámico
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const logrosAdaptados = data.insignias.map((logro) => ({
          id: logro.id,
          nombre: logro.nombre || `Insignia ${logro.id}`,
          descripcion: logro.descripcion || 'Sin descripción',
          icono: logro.icono || 'https://via.placeholder.com/50', // Icono por defecto si no hay URL
          progreso: logro.criterioMin || 0, // Criterio mínimo para completar la insignia
          desbloqueado: true, // Todas las insignias en este endpoint están desbloqueadas
        }));
        setLogros(logrosAdaptados);
      } else {
        Alert.alert('Error', `No se pudieron obtener los logros: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error al obtener logros: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogros();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.logroCard, item.desbloqueado ? styles.desbloqueado : styles.bloqueado]}>
        <View style={styles.iconContainer}>
          <Image
            source={{ uri: item.icono }}
            style={styles.logroIcon}
          />
        </View>
        <View style={styles.logroInfo}>
          <Text style={styles.logroTitle}>{item.nombre}</Text>
          <Text style={styles.logroDescription}>{item.descripcion}</Text>
          <Text style={styles.logroProgress}>{`Criterio mínimo: ${item.progreso}`}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando logros...</Text>
      </View>
    );
  }

  if (logros.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noLogrosText}>No tienes logros desbloqueados todavía.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={logros}
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
    backgroundColor: '#121212', // Fondo oscuro
  },
  logroCard: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#121212', // Fondo oscuro para tarjetas
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
  },
  desbloqueado: {
    borderColor: '#4CAF50', // Verde para desbloqueados
    backgroundColor: '#212121',
  },
  bloqueado: {
    opacity: 0.6,
    borderColor: '#BDBDBD', // Gris para bloqueados
    backgroundColor: '#212121',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60, // Tamaño del círculo
    height: 60,
    borderRadius: 30,
    backgroundColor: '#212121',
    marginRight: 20,
    overflow: 'hidden', // Esto asegura que la imagen se recorte dentro del círculo
  },
  logroIcon: {
    width: '100%', // La imagen ocupará todo el ancho del contenedor
    height: '100%', // La imagen ocupará todo el alto del contenedor
    resizeMode: 'cover', // Ajusta la imagen para cubrir el contenedor
  },
  logroInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  logroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  logroDescription: {
    fontSize: 14,
    color: '#BDBDBD',
    marginBottom: 8,
  },
  logroProgress: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  noLogrosText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#BDBDBD',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center',
  },
});

export default Logros;
