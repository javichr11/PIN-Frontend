import React, { useState, useEffect } from 'react';  
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const CrearEvento = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tematica, setTematica] = useState('');
  const [mostrarTematicaPicker, setMostrarTematicaPicker] = useState(false);
  const [aforo, setAforo] = useState('');
  const [localizacion, setLocalizacion] = useState('');
  const [image, setImage] = useState(null);
  const [fecha, setFecha] = useState(new Date());  // Para la fecha
  const [hora, setHora] = useState(new Date());    // Para la hora
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [usuarioId, setUsuarioId] = useState('');

  useEffect(() => {
    //es provisional, simplemente para probar si funciona
    const idObtenido = 10;
    setUsuarioId(idObtenido);
  }, []);

  // Función para combinar fecha y hora
  const combinarFechaHora = () => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(hora.getHours());
    nuevaFecha.setMinutes(hora.getMinutes());
    return nuevaFecha;
  };

  // Función para crear evento
  const handleCrearEvento = async () => {
    const fechaCompleta = combinarFechaHora();  // Combina la fecha y la hora
    const fechaISO = fechaCompleta.toISOString();  // Convierte la fecha a formato ISO

    try {
      const response = await fetch('https://croacky.onrender.com/evento/crear', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuarioId: usuarioId,
          nombre: titulo,
          descripcion: descripcion,
          tematica: tematica,
          ubicacion: localizacion,
          aforo: parseInt(aforo),
          fecha: fechaISO,  // Enviar la fecha completa en formato ISO
          duracion: '2 hours',
          foto: image,
          creado_en: new Date().toISOString()
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('¡Éxito!', 'Evento creado satisfactoriamente.');
        // Resetea el formulario
        setUsuarioId('');
        setTitulo('');
        setDescripcion('');
        setTematica('');
        setLocalizacion('');
        setAforo('');
        setImage(null);
        setFecha(new Date());
        setHora(new Date());
      } else {
        Alert.alert('Error', `No se pudo crear el evento: ${responseData.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error al crear el evento: ${error.message}`);
    }
  };

  // Función para seleccionar imagen
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

  // Función para mostrar el picker de fecha
  const mostrarFechaPicker = () => {
    setPickerMode('date');
    setMostrarPicker(true);
  };

  // Función para mostrar el picker de hora
  const mostrarHoraPicker = () => {
    setPickerMode('time');
    setMostrarPicker(true);
  };

  // Manejar cambios en el picker de fecha/hora
  const manejarFechaHoraCambio = (event, selectedValue) => {
    setMostrarPicker(false);
    if (pickerMode === 'date') {
      setFecha(selectedValue || fecha);
    } else {
      setHora(selectedValue || hora);
    }
  };

  // Función para mostrar el picker de temática
  const mostrarTematicaPickerHandler = () => {
    setMostrarTematicaPicker(!mostrarTematicaPicker);
    setScrollEnabled(!mostrarTematicaPicker);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} scrollEnabled={scrollEnabled}>
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

          <TouchableOpacity style={styles.botonFecha} onPress={mostrarFechaPicker}>
            <Text style={styles.botonTexto}>Seleccionar Fecha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonFecha} onPress={mostrarHoraPicker}>
            <Text style={styles.botonTexto}>Seleccionar Hora</Text>
          </TouchableOpacity>

          {mostrarPicker && (
            <DateTimePicker
              value={pickerMode === 'date' ? fecha : hora}
              mode={pickerMode}
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={manejarFechaHoraCambio}
            />
          )}

          <Text style={styles.fechaTexto}>Fecha seleccionada: {fecha.toLocaleDateString()}</Text>
          <Text style={styles.fechaTexto}>Hora seleccionada: {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

          <TouchableOpacity style={styles.botonFecha} onPress={mostrarTematicaPickerHandler}>
            <Text style={styles.botonTexto}>Seleccionar Temática</Text>
          </TouchableOpacity>

          {mostrarTematicaPicker && (
            <View style={Platform.OS === 'android' ? styles.pickerAndroid : styles.pickerIOS}>
              <Picker
                selectedValue={tematica}
                onValueChange={(itemValue) => setTematica(itemValue)}
              >
                <Picker.Item label="Seleccione una temática" value="" />
                <Picker.Item label="Música" value="musica" />
                <Picker.Item label="Arte" value="arte" />
                <Picker.Item label="Deportes" value="deportes" />
              </Picker>
            </View>
          )}

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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E3F6E6',
    padding: 16,
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
  pickerAndroid: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  pickerIOS: {
    marginBottom: 20,
  },
  fechaTexto: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default CrearEvento;
