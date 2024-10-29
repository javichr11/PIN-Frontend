import React from 'react'; 
import { View, Text, StyleSheet, Image } from 'react-native';

const DetalleEvento = ({route}) => {
    const {evento} = route.params;

return(
    <View style={styles.container}>
      <Image source={{ uri: evento.foto || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.title}>{evento.nombre}</Text>
      <Text style={styles.info}>Descripción: {evento.descripcion}</Text>
      <Text style={styles.info}>Fecha: {evento.fecha}</Text>
      <Text style={styles.info}>Ubicación: {evento.ubicacion}</Text>
      <Text style={styles.info}>Aforo: {evento.aforo}</Text>
      <Text style={styles.info}>Temática: {evento.tematica}</Text>
      <Text style={styles.info}>Duración: {evento.duracion}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    info: {
      fontSize: 16,
      marginBottom: 5,
    },
  });
  
  export default DetalleEvento;