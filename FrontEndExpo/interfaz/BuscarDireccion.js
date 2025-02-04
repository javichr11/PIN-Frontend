import React, { useState } from 'react';
import { TextInput, FlatList, Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const BuscarDireccion = ({ onDireccionSeleccionada }) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const buscarDireccion = async (texto) => {
    setQuery(texto);
    if (texto.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&addressdetails=1`
        );

        // Verifica si la respuesta es correcta antes de procesarla
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Si la respuesta es vacía, mostramos un mensaje
        if (data.length === 0) {
          console.log("No se encontraron resultados.");
        }
        
        setResultados(data);
      } catch (error) {
        console.error('Error buscando direcciones:', error);
      }
    } else {
      setResultados([]);
    }
  };

  const handlePress = (item) => {
    // Actualiza la caja de texto con la dirección seleccionada
    setQuery(item.display_name);

    // Establece la ubicación seleccionada
    setSelectedLocation({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    });

    // Llama a la función callback con el item seleccionado
    onDireccionSeleccionada(item);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={buscarDireccion}
        placeholder="Buscar dirección"
      />
      <ScrollView style={{ maxHeight: 200 }}>
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <Text style={styles.resultado}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* Map View */}
      {selectedLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={selectedLocation} />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  resultado: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#FFF', // Cambio el color del texto a blanco
  },
  suggestionText: {
    color: '#555', // Cambia este color a cualquier valor que prefieras
    fontSize: 16, // Ajusta el tamaño si lo deseas
  },
});

export default BuscarDireccion;
