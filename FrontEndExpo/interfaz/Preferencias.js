import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';


const Preferencias = () => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const handleSelect = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((item) => item !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const handleSavePreferences = async () => {
    if (selectedPreferences.length === 0) {
      Alert.alert("Aviso", "Por favor, selecciona al menos una preferencia.");
      return;
    }
  
    try {
      // Crear el objeto de preferencias en el formato esperado
      const preferences = {
        userID: '10', // Agregar el ID del usuario
        // Iterar sobre las preferencias seleccionadas y asignarles un valor de `true`
        ...selectedPreferences.reduce((acc, preference) => {
          acc[preference] = true; // Asignamos true a cada preferencia seleccionada
          return acc;
        }, {})
      };
      console.log(preferences);  // Ver el objeto antes de enviarlo
  
      // Realizar la solicitud al backend
      const response = await fetch("https://croacky.onrender.com/usuario/preferencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Enviar como JSON
        },
        body: JSON.stringify(preferences), // Enviar como JSON
      });
  
      if (response.ok) {
        const data = await response.json();
        Alert.alert("¡Éxito!", "Tus preferencias han sido guardadas en el servidor.");
        console.log("Respuesta del servidor:", data);
      } else {
        Alert.alert("Error", "No se pudo guardar tus preferencias. Inténtalo más tarde.");
        console.error("Error en la respuesta:", response.status);
      }
    } catch (error) {
      console.error("Error al enviar las preferencias:", error);
      Alert.alert("Error", "Hubo un problema al conectarse con el servidor.");
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tus preferencias</Text>

      {/* Tipos de eventos */}
      <Text style={styles.sectionTitle}>Tipos de eventos:</Text>
      <View style={styles.optionsContainer}>
        {['musica', 'arte', 'deporte'].map((event) => (
          <TouchableOpacity
            key={event}
            style={[
              styles.option,
              selectedPreferences.includes(event) && styles.selectedOption,
            ]}
            onPress={() => handleSelect(event)}
          >
            <Text style={styles.optionText}>{event}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Horarios */}
      <Text style={styles.sectionTitle}>Horarios:</Text>
      <View style={styles.optionsContainer}>
        {Array.from({ length: 24 }, (_, i) => `${i + 1}:00`).map((hour) => (
          <TouchableOpacity
            key={hour}
            style={[
              styles.option,
              selectedPreferences.includes(hour) && styles.selectedOption,
            ]}
            onPress={() => handleSelect(hour)}
          >
            <Text style={styles.optionText}>{hour}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Aforo */}
      <Text style={styles.sectionTitle}>Aforo:</Text>
      <View style={styles.optionsContainer}>
        {['-5', '-10', '-15', '-25'].map((capacity) => (
          <TouchableOpacity
            key={capacity}
            style={[
              styles.option,
              selectedPreferences.includes(capacity) && styles.selectedOption,
            ]}
            onPress={() => handleSelect(capacity)}
          >
            <Text style={styles.optionText}>{capacity}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Zonas */}
      <Text style={styles.sectionTitle}>Zonas:</Text>
      <View style={styles.optionsContainer}>
        {['Playa', 'Montaña', 'Bosque', 'Parque', 'Ciudad', 'Rural', 'Bar', 'Restaurante', 'Cafetería', 'Mercadillo', 'Teatro', 'Cine', 'Museo', 'Biblioteca', 'Discoteca', 'Gimnasio', 'Parque de atracciones', 'Centro comercial'].map((zone) => (
          <TouchableOpacity
            key={zone}
            style={[
              styles.option,
              selectedPreferences.includes(zone) && styles.selectedOption,
            ]}
            onPress={() => handleSelect(zone)}
          >
            <Text style={styles.optionText}>{zone}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón para guardar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
        <Text style={styles.saveButtonText}>Guardar preferencias</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7E4',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderColor: '#CCC',
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: '#C6EBC5',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Preferencias;
