import React, { useState } from 'react';
import { TextInput, FlatList, Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';

const BuscarDireccion = ({ onDireccionSeleccionada }) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);

  const buscarDireccion = async (texto) => {
    setQuery(texto);
    if (texto.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${texto}`
        );
        const data = await response.json();
        setResultados(data);
      } catch (error) {
        console.error('Error buscando direcciones:', error);
      }
    } else {
      setResultados([]);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={buscarDireccion}
        placeholder="Buscar dirección"
      />
      <ScrollView
        data={resultados}
        keyExtractor={(item) => item.place_id.toString()}
        keyboardShouldPersistTaps="handled" // Permite interactuar con la lista mientras el teclado está abierto
        style={{ maxHeight: 200 }} // Limita la altura del FlatList para evitar conflictos con el diseño
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <Text style={styles.resultado}>{item.display_name}</Text>
          </TouchableOpacity>
        )}
      />
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
  },
});

export default BuscarDireccion;
