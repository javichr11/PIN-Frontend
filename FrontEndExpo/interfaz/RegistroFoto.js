import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function RegistroFoto({ route, navigation }) {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [edad, setEdad] = useState(null);
  const [foto, setFoto] = useState(null);
  const { nombre, movil, password } = route.params;

  
  const seleccionarFoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Se requiere permiso para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    console.log('Enviando datos de registro...');

    if(edad === null){
      Alert.alert('Error', 'Por favor, ingresa tu edad.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('edad', parseInt(edad));
    formData.append('password', password);
    formData.append('nombre_usuario', nombreUsuario);
    formData.append('movil', parseInt(movil));
    if (foto) {
      formData.append('foto', {
        uri: foto,
        type: 'image/jpeg',
        name: 'usuario.jpg',
      });
    }
    try{
    const response = await fetch('https://croacky.onrender.com/usuario/registrar', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    });

    const responseData = await response.json();

    if(response.ok){
      Alert.alert('¡Éxito!', 'Usuario registrado satisfactoriamente');
      //Redirige a preferencias
      navigation.navigate('Preferencias', { nombreUsuario });
    }else {
      Alert.alert('Error', `No se pudo registrar el usuario: ${responseData.message}`);
    }

  }catch(error){
    Alert.alert('Error', `Ocurrió un error al registrar el usuario: ${error.message}`);
  }
  };

  handleReturn = () => {
    navigation.navigate('Registro',{nombre, movil, password});

  }


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
          value={nombreUsuario}
          onChangeText={setNombreUsuario}
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
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button,{backgroundColor:'orange'}]} onPress={handleReturn}>
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Completar</Text>
          </TouchableOpacity>
        </View>
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
  buttonContainer: {
    width: '100%',
    flexDirection:'row',
    justifyContent:'space-around',
    padding: 0,
    margin: 0,
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
    width: '40%',
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