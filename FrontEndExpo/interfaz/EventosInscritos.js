import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, ImageBackground, Image, Dimensions } from 'react-native';
import EventCard from "./Components/EventCard";


const SCREEN_WIDTH = Dimensions.get('window').width;


const EventosInscritos = ({ eventos }) => {
  const [paginaActual, setPaginaActual] = useState(0);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(contentOffsetX / SCREEN_WIDTH);
    setPaginaActual(newPage);
  };
  console.log(eventos);
  return (
    <View style={styles.eventsSection}>
      <Text style={styles.sectionTitle}>Eventos inscritos</Text>
      <View style={{ marginBottom: 10 }} />
      <FlatList
        data={eventos}
        renderItem={({ item }) => (
          <EventCard 
          evento={item}
          showJoinButton={false}       
        />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
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
        {eventos.length !== 0 ? (paginaActual + 1) : 0 }/{eventos.length}
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    fontFamily: 'Satoshi-Regular',
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
