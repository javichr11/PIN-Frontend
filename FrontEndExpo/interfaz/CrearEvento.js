import React, { useState } from 'react'; 
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const CrearEvento = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tematica, setTematica] = useState('');
  const [horario, setHorario] = useState('');
  const [aforo, setAforo] = useState('');
  const [localizacion, setLocalizacion] = useState('');
  const [image, setImage] = useState(null);
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const handleCrearEvento = () => {
    console.log('Evento creado:', { titulo, descripcion, tematica, horario, aforo, localizacion, image, fecha });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Se requiere permiso para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const mostrarFechaPicker = () => {
    setMostrarPicker(true);
  };

  const manejarFechaCambio = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setMostrarPicker(Platform.OS === 'ios'); // Cierra el picker solo en iOS
    setFecha(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      

      <TouchableOpacity style={styles.botonFoto} onPress={pickImage}>
        <Text style={styles.botonTexto}>+ FOTO</Text>
      </TouchableOpacity>

      {image ? (
        <View style={styles.imagenContainer}>
          <Image source={{ uri: image }} style={styles.imagenSeleccionada} />
        </View>
      ) : (
        <Text>No hay imagen seleccionada</Text>
      )}

      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título"
      />

      <TextInput
        style={[styles.input, styles.descripcionInput]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción"
        multiline
      />

      <Text style={styles.tematicaTexto}>Temática</Text>
      <Picker
        selectedValue={tematica}
        style={styles.selector}
        onValueChange={(itemValue) => setTematica(itemValue)}
      >
        <Picker.Item label="Seleccione una temática" value="" />
        <Picker.Item label="Música" value="musica" />
        <Picker.Item label="Arte" value="arte" />
        <Picker.Item label="Deportes" value="deportes" />
      </Picker>

      {/* Espaciado superior */}
      <View style={styles.spacing} />

      <TouchableOpacity style={styles.botonFecha} onPress={mostrarFechaPicker}>
        <Text style={styles.botonTexto}>Seleccionar Fecha</Text>
      </TouchableOpacity>

      

      {mostrarPicker && (
        <DateTimePicker
          value={fecha}
          mode={pickerMode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={manejarFechaCambio}
        />
      )}

      <Text style={styles.fechaTexto}>Fecha seleccionada: {fecha.toLocaleDateString()}</Text>

      <TextInput
        style={styles.input}
        value={horario}
        onChangeText={setHorario}
        placeholder="Horario"
      />

      <TextInput
        style={styles.input}
        value={aforo}
        onChangeText={setAforo}
        placeholder="Aforo"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={localizacion}
        onChangeText={setLocalizacion}
        placeholder="Localización"
      />

      <Button title="OK" onPress={handleCrearEvento} color="#4CAF50" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E3F6E6',
    padding: 16,
  },
  titulo: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  botonFoto: {
    backgroundColor: '#B2EBF2',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  imagenContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagenSeleccionada: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  input: {
    height: 50,
    borderColor: '#4CAF50',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  descripcionInput: {
    height: 100,
  },
  tematicaTexto: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  selector: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  botonFecha: {
    backgroundColor: '#B2EBF2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  botonTexto: {
    fontSize: 16,
    color: '#000',
  },
  fechaTexto: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  spacing: {
    height: 80, // Espaciado de 50px
  },
});

export default CrearEvento;
