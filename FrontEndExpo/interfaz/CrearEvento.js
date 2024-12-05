import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

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
  const [duracion, setDuracion] = useState('1');
  const [mostrarDuracionPicker, setMostrarDuracionPicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const idObtenido = 10; // Simulación de usuario
    setUsuarioId(idObtenido);
  }, []);

  const combinarFechaHora = () => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(hora.getHours());
    nuevaFecha.setMinutes(hora.getMinutes());
    return nuevaFecha.toISOString();
  };

  const [eventos, setEventos] = useState([]); 

  const fetchEventos = async () => {
    try {
      const response = await fetch('https://croacky.onrender.com/evento/obtener'); 
      const data = await response.json();

      if (response.ok) {
        setEventos(data);
      } else {
        Alert.alert('Error', `No se pudieron obtener los eventos: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error al obtener eventos: ${error.message}`);
    }
  };

  const createEvent = async () =>{
      const formData = new FormData();
  
      formData.append('nombre', titulo);
      formData.append('descripcion', descripcion);
      formData.append('tematica', tematica);
      formData.append('aforo', aforo);
      formData.append('ubicacion', localizacion);
      formData.append('fecha', combinarFechaHora()); 
      formData.append('userID', usuario_id);
      formData.append('duracion', duracion);

      if (image) {
        formData.append('foto', {
          uri: image,
          type: 'image/jpeg',
          name: 'usuario.jpg',
        });
      }

      try {
      
        const response = await fetch('https://croacky.onrender.com/evento/crear', {
          method: 'POST',
          body: formData,
        });
    
        const data = await response.json();
    
        if (response.ok) {
          fetchEventos();
          Alert.alert('Éxito', 'El evento se ha creado correctamente.');


          navigation.navigate('VerEvento', { refresh: true });  
        }else{
          Alert.alert('Error', `No se pudo crear el evento: ${data.message}`);
        }
      } catch (error) {
        Alert.alert('Error', `Ocurrió un error al crear el evento: ${error.message}`);
      }
  };



  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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
      if (selectedDate && selectedDate.toDateString() !== new Date().toDateString()) {
        setHora(new Date(0, 0, 0, 0, 0));
      }
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

          <TouchableOpacity onPress={() => setMostrarDuracionPicker(true)} style={styles.botonDuracion}>
            <Text style={styles.botonTexto}>Duración del evento: {duracion} horas</Text>
          </TouchableOpacity>

          {mostrarDuracionPicker && (
            <View>
              <Picker
                selectedValue={duracion}
                onValueChange={(itemValue) => setDuracion(itemValue)}
                style={styles.picker}
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                  <Picker.Item key={hour} label={`${hour} horas`} value={hour} />
                ))}
              </Picker>
              <Button title="OK" onPress={() => setMostrarDuracionPicker(false)} color="#4CAF50" />
            </View>
          )}

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
              minimumDate={pickerMode === 'date' ? new Date() : (fecha.toDateString() === new Date().toDateString() ? new Date() : null)}
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

          <Button title="Crear Evento" onPress={createEvent} color="#4CAF50" />
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
  botonDuracion: {
    backgroundColor: '#BBDEFB',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },  
});

export default CrearEvento;
