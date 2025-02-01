import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import BuscarDireccion from './BuscarDireccion';
import { useUser } from '../context/UserProvider';

const CrearEvento = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tematica, setTematica] = useState('');
  const [mostrarTematicaPicker, setMostrarTematicaPicker] = useState(false);
  const [aforo, setAforo] = useState('');
  const [localizacion, setLocalizacion] = useState('');
  const [direccion, setDireccion] = useState('');
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
  const {user} = useUser();


  useEffect(() => {
    const idObtenido = user.id;
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
        Alert.alert('Error',`No se pudieron obtener los eventos: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('Error',` Ocurrió un error al obtener eventos: ${error.message}`);
    }
  };

  const handleDireccionSeleccionada = (direccion) => {
    if (direccion && direccion.lat && direccion.lon) {
      setDireccion({
        latitud: parseFloat(direccion.lat),
        longitud: parseFloat(direccion.lon),
        
      });
      
    } else {
      Alert.alert('Error', 'La dirección seleccionada no tiene coordenadas válidas.');
    }
  };


  const createEvent = async () =>{
      const formData = new FormData();
      if (!direccion|| !direccion.latitud || !direccion.longitud) {
        Alert.alert('Error', 'Selecciona una dirección antes de crear el evento.');
        return;
      }
  
      formData.append('nombre', titulo);
      formData.append('descripcion', descripcion);
      formData.append('tematica', tematica);
      formData.append('aforo', aforo);
      formData.append('ubicacion', localizacion);
      formData.append('latitud', direccion.latitud);
      formData.append('longitud', direccion.longitud);
      formData.append('fecha', combinarFechaHora()); 
      formData.append('userID', usuario_id);
      formData.append('duracion', duracion);
      console.log('Datos enviados:', {
  latitud: direccion.latitud,
  longitud: direccion.longitud,
  nombre: titulo,
});

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
        <ScrollView 
          contentContainerStyle={styles.container} 
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.botonFoto} 
              onPress={pickImage}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.imagenSeleccionada} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>+ AÑADIR FOTO</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Título del evento"
              placeholderTextColor="#666"
            />

            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setMostrarDuracionPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                Duración: {duracion} horas
              </Text>
            </TouchableOpacity>

            {mostrarDuracionPicker && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={duracion}
                  onValueChange={(itemValue) => setDuracion(itemValue)}
                  style={styles.picker}
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                    <Picker.Item 
                      key={hour} 
                      label={`${hour} horas`} 
                      value={hour}
                      color="#333"
                    />
                  ))}
                </Picker>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={() => setMostrarDuracionPicker(false)}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TextInput
              style={[styles.input, styles.descripcionInput]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción del evento"
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
            />

            <View style={styles.dateTimeSection}>
              <TouchableOpacity 
                style={styles.dateTimeButton} 
                onPress={mostrarFechaPicker}
              >
                <Text style={styles.dateTimeButtonText}>
                  {fecha.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.dateTimeButton} 
                onPress={mostrarHoraPicker}
              >
                <Text style={styles.dateTimeButtonText}>
                  {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>

            {mostrarPicker && (
              <DateTimePicker
                value={pickerMode === 'date' ? fecha : hora}
                mode={pickerMode}
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={pickerMode === 'date' ? new Date() : null}
                onChange={manejarFechaHoraCambio}
              />
            )}

            <TouchableOpacity 
              style={styles.categoryButton}
              onPress={mostrarTematicaPickerHandler}
            >
              <Text style={styles.categoryButtonText}>
                {tematica || 'Seleccionar categoría'}
              </Text>
            </TouchableOpacity>

            {mostrarTematicaPicker && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tematica}
                  onValueChange={(itemValue) => setTematica(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccione una temática" value="" />
                  <Picker.Item label="Música" value="musica" />
                  <Picker.Item label="Arte" value="arte" />
                  <Picker.Item label="Deporte" value="deporte" />
                </Picker>
              </View>
            )}

            <TextInput
              style={styles.input}
              value={aforo}
              onChangeText={setAforo}
              placeholder="Aforo máximo"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              value={localizacion}
              onChangeText={setLocalizacion}
              placeholder="Nombre del lugar"
              placeholderTextColor="#666"
            />

            <BuscarDireccion onDireccionSeleccionada={handleDireccionSeleccionada} />

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={createEvent}
            >
              <Text style={styles.submitButtonText}>Crear Evento</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  botonFoto: {
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    height: 200,
    width: '100%',
  },
  imagenContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  imagenSeleccionada: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  input: {
    height: 50,
    borderColor: '#2C2C2E',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
  },
  descripcionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  botonFecha: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  fechaTexto: {
    marginBottom: 20,
    fontSize: 16,
    color: '#FFFFFF',
  },
  pickerAndroid: {
    height: 50,
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    borderRadius: 10,
    color: '#FFFFFF',
  },
  pickerIOS: {
    height: 200,
    width: '100%',
    backgroundColor: '#1C1C1E',
  },
  botonDuracion: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  picker: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
  },
  // Estilos adicionales para que coincida con la imagen
  placeholderText: {
    color: '#8E8E93',
  },
  botonCrear: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default CrearEvento;