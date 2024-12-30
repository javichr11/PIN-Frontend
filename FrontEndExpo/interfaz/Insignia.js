import React, {useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Insignia = ({ nombre, descripcion, progreso, meta, desbloqueada, icono }) => {
  // Determina si se ha alcanzado la meta
  
  const haLlegadoALaMeta = progreso >= meta;

  return (
    <View style={styles.insigniaCard}>
      {/* Icono de la insignia */}
      <View style={[styles.iconContainer, haLlegadoALaMeta ? styles.completadaIcono : styles.pendienteIcono]}>
        <Image source={haLlegadoALaMeta ? require('../assets/white-ticket.png') : require('../assets/grey-ticket.png') } style={styles.icono} />
      </View>

      {/* Información de la insignia */}
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.descripcion}>{descripcion}</Text>

      {/* Progreso */}
      <View style={[styles.progreso, haLlegadoALaMeta ? styles.completadaProgreso : styles.pendienteProgreso]}>
        <Text style={styles.textoProgreso}>{`${progreso}/${meta}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  insigniaCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    padding: 20,
    width: 150,
    borderRadius: 20,
  },
  completada: {
  },
  pendiente: {
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  completadaIcono: {
    backgroundColor: '#DDA0DD', // Fondo lila para iconos completados
  },
  pendienteIcono: {
    backgroundColor: '#555', // Fondo gris para iconos pendientes
  },
  icono: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 5,
  },
  descripcion: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 10,
  },
  progreso: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completadaProgreso: {
    backgroundColor: '#0000FF', // Azul para progreso completado
  },
  pendienteProgreso: {
    backgroundColor: '#888', // Gris claro para progreso pendiente
  },
  textoProgreso: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Insignia;
