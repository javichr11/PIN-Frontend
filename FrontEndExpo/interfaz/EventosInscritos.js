import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, ImageBackground, Image, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);

  // Opciones para formatear la fecha
  const opciones = {
    weekday: 'short', // día de la semana abreviado (ej. "sáb.")
    day: '2-digit', // día del mes con dos dígitos
    month: '2-digit', // mes abreviado
    year: 'numeric', // año completo
    hour: '2-digit', // hora en formato 24h
    minute: '2-digit', // minutos
  };

  // Convertir la fecha al idioma deseado (ej. español)
  return fecha.toLocaleDateString('es-ES', opciones).replace(',', ' ·');
};


const EventosInscritos = ({ eventos }) => {
  const [paginaActual, setPaginaActual] = useState(0);

  const renderItem = ({ item }) => (
    <ImageBackground
      source={{ uri: item.foto || 'https://via.placeholder.com/300x150' }}
      style={styles.eventCard}
      imageStyle={{ borderRadius: 15 }}
    >
      {/* Encabezado de la tarjeta */}
      <View style={styles.eventHeader}>
        <Text style={styles.eventDate}>{formatearFecha(item.fecha)}</Text>
        <View style={styles.participantsBadge}>
          <Image
            source={require('../assets/white-default-user.png')}
            style={styles.participantIcon}
          />
          <Text style={styles.participantText}>
            {item.inscritos}/{item.aforo}
          </Text>
        </View>
      </View>

      {/* Capa semitransparente */}
      <View style={styles.overlay}>
        <Text style={styles.eventTitle}>{item.nombre || 'Título no disponible'}</Text>
        <View style={styles.eventDetails}>
          <View style={styles.detailTag}>
            <Image source={require('../assets/ubicacion.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.ubicacion || 'Ubicación no disponible'}</Text>
          </View>
          <View style={styles.detailTag}>
            <Image source={require('../assets/categorias.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.tematica || 'Categoría'}</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(contentOffsetX / SCREEN_WIDTH);
    setPaginaActual(newPage);
  };

  return (
    <View style={styles.eventsSection}>
      <Text style={styles.sectionTitle}>Eventos inscritos</Text>
      <FlatList
        data={eventos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
        nestedScrollEnabled={true}  // ✅ Agregar esto

      />
      {/* Indicador de paginación */}
      <View style={styles.pagination}>
        {eventos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              paginaActual === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
      {/* Contador de página */}
      <Text style={styles.pageCounter}>
        {paginaActual + 1}/{eventos.length}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  eventsSection: {
    flex: 1,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  eventCard: {
    width: SCREEN_WIDTH * 0.9, // Ajustar al 90% del ancho de la pantalla
    aspectRatio: 16 / 9,
    marginHorizontal: SCREEN_WIDTH * 0.05, // Centrar la tarjeta horizontalmente
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  eventDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  participantsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  overlay: {
    padding: 15,
  },
  eventTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  
  },
  detailTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a39f5',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  detailIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  detailText: {
    color: '#FFF',
    fontSize: 15,
  },
  participantImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  flatList: {
    flexGrow: 0,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FFF',
  },
  inactiveDot: {
    backgroundColor: '#444',
  },
  pageCounter: {
    textAlign: 'right',
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
    marginRight: 15,
  },
});

export default EventosInscritos;
