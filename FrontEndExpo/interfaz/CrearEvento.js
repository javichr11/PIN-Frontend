import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import BuscarDireccion from './BuscarDireccion';

// AforoInput Component
const AforoInput = ({ value, onChange }) => {
  const handleIncrement = () => {
    const newValue = parseInt(value || 0) + 1;
    onChange(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(0, parseInt(value || 0) - 1);
    onChange(newValue.toString());
  };

  return (
    <View style={styles.aforoContainer}>
      <Text style={styles.label}>Aforo</Text>
      <View style={styles.aforoInputContainer}>
        <TouchableOpacity 
          style={styles.aforoButton} 
          onPress={handleDecrement}
        >
          <Text style={styles.aforoButtonText}>−</Text>
        </TouchableOpacity>
        
        <View style={styles.aforoValueContainer}>
          <Text style={styles.aforoValue}>{value || '0'}</Text>
        </View>

        <TouchableOpacity 
          style={styles.aforoButton} 
          onPress={handleIncrement}
        >
          <Text style={styles.aforoButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CrearEvento = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tematica, setTematica] = useState('');
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

  

  const [eventos, setEventos] = useState([]); // Estado para almacenar la lista de eventos

const fetchEventos = async () => {
  try {
    const response = await fetch('https://croacky.onrender.com/evento/obtener'); // Cambia esto por tu endpoint real
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

const handleDireccionSeleccionada = (direccion) => {
  if (direccion && direccion.lat && direccion.lon) {
    setDireccion({
      //nombre: direccion.display_name,
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
    //formData.append('sitio', JSON.stringify(direccion));
    formData.append('latitud', direccion.latitud);
    formData.append('longitud', direccion.longitud);
    formData.append('fecha', combinarFechaHora()); 
    formData.append('userID', usuario_id);
    formData.append('duracion', duracion);
    console.log('Datos enviados:', {
      latitud: direccion.latitud,
  longitud: direccion.longitud,
  nombre: titulo,
  // Añade aquí más datos para depurar
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
    } else {
      setHora(selectedDate || hora);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView 
          contentContainerStyle={styles.container} 
          scrollEnabled={scrollEnabled}
        >
          {/* Image Upload Section */}
          <View style={styles.imageUploadSection}>
            <TouchableOpacity onPress={pickImage} style={styles.imageUploadButton}>
              {image ? (
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <View>
                  <Ionicons name="images-outline" size={30} color="#3A39F5" />
                  </View>
                  
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.fieldContainer}>
            <TextInput
                    style={styles.titleInput}
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Pulsa aquí para cambiar el título del evento..."
                    placeholderTextColor="#B6FCBE"
                    multiline={true}
                    numberOfLines={2}
                  />
            </View>
          
        
            {/* Aforo using new component */}
            <AforoInput value={aforo} onChange={setAforo} />

            {/* Temática */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Temática</Text>
              <View style={styles.tematicaContainer}>
                <TouchableOpacity 
                  style={[styles.tematicaButton, tematica === 'Voluntariado' && styles.tematicaButtonActive]}
                  onPress={() => setTematica('Voluntariado')}
                >
                  <Text style={[styles.tematicaText, tematica === 'Voluntariado' && styles.tematicaTextActive]}>
                    Voluntariado
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tematicaButton, tematica === 'Arte' && styles.tematicaButtonActive]}
                  onPress={() => setTematica('Arte')}
                >
                  <Text style={[styles.tematicaText, tematica === 'Arte' && styles.tematicaTextActive]}>
                    Arte
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tematicaButton, tematica === 'Deportes' && styles.tematicaButtonActive]}
                  onPress={() => setTematica('Deportes')}
                >
                  <Text style={[styles.tematicaText, tematica === 'Deportes' && styles.tematicaTextActive]}>
                    Deportes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tematicaButton, tematica === 'Música' && styles.tematicaButtonActive]}
                  onPress={() => setTematica('Música')}
                >
                  <Text style={[styles.tematicaText, tematica === 'Música' && styles.tematicaTextActive]}>
                    Música
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Descripción */}
            <View style={styles.sectionContainer}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.descripcionInput}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Da información para que las personas interesadas acudan a tu evento. Recuerda que debes ser lo más específicx posible."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Fecha y Hora */}
            <View style={styles.sectionContainer}>
              <View style={styles.dateTimeSection}>
                <View style={styles.dateTimeColumn}>
                  <Text style={styles.label}>Fecha</Text>
                  <TouchableOpacity style={styles.dateTimeInput} onPress={mostrarFechaPicker}>
                    <Text style={styles.dateTimeValue}>
                      {fecha.toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateTimeColumn}>
                  <Text style={styles.label}>Hora</Text>
                  <TouchableOpacity style={styles.dateTimeInput} onPress={mostrarHoraPicker}>
                    <Text style={styles.dateTimeValue}>
                      {hora.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Asegurar que el DateTimePicker se muestre cuando se toca Fecha/Hora */}
              {mostrarPicker && (
                <DateTimePicker
                value={pickerMode === 'date' ? fecha : hora}
                mode={pickerMode}
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                textColor="white" // Asegura que el texto sea visible en iOS
                themeVariant="dark" // Aplica modo oscuro en Android
                minimumDate={pickerMode === 'date' ? new Date() : null}
                onChange={manejarFechaHoraCambio}
                />
              )}
            </View>

            {/* Localización */}
            <View style={styles.sectionContainer}>
              <Text style={styles.label}>Ubicación</Text>
              <TextInput
            style={styles.input}
            value={localizacion}
            onChangeText={setLocalizacion}
            placeholder="Localización"
          />
               <BuscarDireccion style={styles.label} onDireccionSeleccionada={handleDireccionSeleccionada} />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={createEvent}
            >
              <Text style={styles.submitButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>

          <View>
            
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
  imageUploadSection: {
    marginBottom: 24,
  },
  suggestionItem: {
    padding: 12,
    backgroundColor: '#333333', // Fondo oscuro para contraste
    borderBottomWidth: 1,
    borderBottomColor: '#555555',
  },
  suggestionText: {
    color: '#FFFFFF', // Blanco para mejor visibilidad
    fontSize: 16,
  },
  imageUploadButton: {
    backgroundColor: '#FFFEF5',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  uploadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadIconText: {
    color: '#666',
    fontSize: 24,
    fontWeight: 'bold',
  },
  uploadText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: 'Satoshi-Regular'
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,           // Añade el borde
  borderColor: '#FFFFFF',
  },
  tematicaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tematicaButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    marginRight: 8,
  },
  tematicaButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  tematicaText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Satoshi-Regular'
  },
  tematicaTextActive: {
    color: '#000',
  },
  descripcionInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,           // Añade el borde
    borderColor: '#FFFFFF',   // Color blanco para el borde
    fontFamily: 'Satoshi-Regular'
  },
  dateTimeButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
  },
  dateTimeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3A39F5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 24, // Tamaño aumentado
    color: "#B6FCBE",
  },
  
  // New styles for AforoInput
  aforoContainer: {
    marginBottom: 20,
  },
  aforoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  aforoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3A39F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aforoButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
  },
  aforoValueContainer: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aforoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Satoshi-Regular'
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#18191A',
    borderRadius: 15,
    padding: 15,
  },
  dateTimeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  dateTimeColumn: {
    flex: 1,
  },
  dateTimeLabel: {
    color: '#FFFEF5',
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  dateTimeInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333333',
    borderWidth: 1,           // Añade el borde
    borderColor: '#FFFFFF',
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  dateTimeValue: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CrearEvento;