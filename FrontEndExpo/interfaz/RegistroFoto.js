import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function RegistroFoto({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(null);
  const [foto, setFoto] = useState(null);

  // Función para abrir la galería o la cámara
  // Función para pedir permisos y abrir la galería
  const seleccionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso denegado", "Se requiere permiso para acceder a las fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    let uri = result.assets[0].uri
    if (!result.canceled) {
      console.log("URI de la imagen seleccionada:", uri);
      setFoto(uri); // Guarda la URI de la imagen seleccionada
    }
  };

  const handleSubmit = () => {
    if (nombre === '' || !foto) {
      Alert.alert('Error', 'Por favor ingresa un nombre y selecciona una foto.');
      return;
    }

    Alert.alert('Registro Completo', `Usuario ${nombre} registrado con foto.`);
    // Puedes continuar el flujo de la app, como navegar a otra pantalla o enviar los datos al backend.
  };

  return (
    <View style={styles.container}>
      {/* Imagen en la parte superior */}
      <Image
        source={require('../assets/frog.png')} // Cambia la URL por la de tu imagen
        style={styles.image}
      />
      <View style={styles.inputContainer}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />

    <Text style={styles.label}>Edad</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={edad}
        onChangeText={setEdad}
      />

      <Text style={styles.label}>Foto de Perfil</Text>
      <TouchableOpacity style={styles.fotoContainer} onPress={seleccionarFoto}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} />
        ) : (
          <Image
          source={require('../assets/default-user.png')} // Cambia la URL por la de tu imagen
          style={styles.foto}
        />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Completar Registro</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3E0D5',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 0,
  },
  image: {
    width: 175, 
    height: 175, 
    marginTop: 5,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF',
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
    marginLeft: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius: 50,
    marginBottom: 5,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#bed881',
    elevation: 2,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#61ba12', // Color más oscuro
    flexDirection:'column',
    alignItems: 'center',
    padding: 20,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginBottom: 0,
  },
  fotoContainer: {
    width: 130,
    height: 130,
    backgroundColor: '#EAF2E6',
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    overflow: 'hidden',
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  seleccionarFotoTexto: {
    color: 'gray',
  },
  button: {
    width: '70%',
    borderRadius: 50,
    borderColor: '#FFFFFF',
    borderWidth: 4,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
