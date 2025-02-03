import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import Insignia from './Insignia';
import { useNavigation } from '@react-navigation/native';


const Logros = ({ route }) => {
  const [insignias, setInsignias] = useState([]);
  const { userID } = route.params || {};
  const navigation = useNavigation();
  // Llamada a la API para obtener las insignias
  const fetchInsignias = async () => {
    try {
      const response = await fetch(`https://croacky.onrender.com/insignia/insigniasLogradas/${userID}`);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setInsignias(data.logrosAdaptados); // Asegúrate de que la API devuelve "insignias"
      } else {
        Alert.alert('Error', `No se pudieron cargar las insignias: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error al cargar insignias: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchInsignias();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logros</Text>
      <FlatList
      data={insignias}
      renderItem={({ item }) => (
        <Insignia
          nombre={item.nombre}
          descripcion={item.descripcion}
          progreso={item.progreso}
          meta={item.meta}
          desbloqueada={item.desbloqueada}
          icono={item.icono}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2} 
      columnWrapperStyle={styles.row} 
      
    />
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('perfil')}>
        <Text style={styles.closeButtonText}>Cerrar</Text>
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
  title: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  insigniaContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  insigniaIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  insigniaLograda: {
    backgroundColor: '#8e44ad', // Fondo morado para logros completados
  },
  iconImage: {
    width: 40,
    height: 40,
    tintColor: '#FFF',
  },
  insigniaTitle: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  insigniaDescription: {
    fontSize: 12,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 5,
  },
  progress: {
    backgroundColor: '#444',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  progressCompleted: {
    backgroundColor: '#3498db', // Fondo azul para progreso completado
  },
  progressText: {
    color: '#FFF',
    fontSize: 12,
  },
  closeButton: {
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default Logros;
