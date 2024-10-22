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
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [usuario_id, setUsuarioId] = useState('');

  useEffect(() => {
    // Es provisional, simplemente para probar si funciona
    const idObtenido = 10;
    setUsuarioId(idObtenido);
  }, []);

  // Función para combinar fecha y hora en formato ISO (YYYY-MM-DDTHH:MM:SS)
  const combinarFechaHora = () => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(hora.getHours());
    nuevaFecha.setMinutes(hora.getMinutes());
    // Devuelve la fecha en formato ISO
    return nuevaFecha.toISOString(); // Formato compatible con la mayoría de bases de datos y APIs
  };

  // Función para crear evento
  const handleCrearEvento = async () => {
    const fechaISO = combinarFechaHora(); // Obtiene la fecha en formato ISO

    const formData = new FormData(); // Crear una instancia de FormData

    // Agregar los campos al FormData
    formData.append('usuario_id', usuario_id);
    formData.append('nombre', titulo);
    formData.append('descripcion', descripcion);
    formData.append('tematica', tematica);
    formData.append('ubicacion', localizacion);
    formData.append('aforo', parseInt(aforo));
    formData.append('fecha', fechaISO); // Enviar como ISO string
    formData.append('duracion', '2 hours');

    // Verificar si hay una imagen seleccionada
    if (image) {
      formData.append('foto', {
        uri: image, // URI de la imagen
        type: 'image/jpeg', // Tipo de archivo
        name: 'evento.jpg', // Nombre del archivo
      });
    }

    formData.append('creado_en', new Date().toISOString()); // Fecha actual en formato ISO

    try {
      const response = await fetch('https://croacky.onrender.com/evento/crear', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      // Captura la respuesta como texto
      const textResponse = await response.text();
      console.log('Texto de respuesta:', textResponse); // Muestra el contenido de la respuesta

      // Intenta parsear la respuesta como JSON
      const responseData = JSON.parse(textResponse);

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
      console.log('Error al crear evento:', error);
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

  const mostrarFechaPicker = () => {
    setPickerMode('date');
    setMostrarPicker(true);
  };

  const mostrarHoraPicker = () => {
    setPickerMode('time');
    setMostrarPicker(true);
  };

  const manejarFechaHoraCambio = (event, selectedDate) => {
    setMostrarPicker(false);
    if (pickerMode === 'date') {
      setFecha(selectedDate || fecha);
    } else {
      setHora(selectedDate || hora);
    }
  };

  const mostrarTematicaPickerHandler = () => {
    setMostrarTematicaPicker(!mostrarTematicaPicker);
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  descripcionInput: {
    height: 100,
  },
  botonFecha: {
    backgroundColor: '#BBDEFB',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFF',
    fontSize: 16,
  },
  fechaTexto: {
    marginBottom: 20,
    fontSize: 16,
  },
  pickerAndroid: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  pickerIOS: {
    height: 200,
    width: '100%',
  },
});

export default CrearEvento;
