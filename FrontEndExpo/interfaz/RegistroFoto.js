import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from "../context/UserProvider";
import PreguntasInicial from './PreguntasInicial';
import { LinearGradient } from "expo-linear-gradient";

export default function RegistroFoto({ route, navigation }) {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [edad, setEdad] = useState(' ');
  const [foto, setFoto] = useState(null);
  const { nombre, movil, password } = route.params;
  const { saveUser, setIsNewUser } = useUser();
  
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

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    if(response.ok){

      Alert.alert('Éxito!', data.message);
      
      try{
        await saveUser(data.user);
        setIsNewUser(true);

        handleSendToPreferencias();
      }catch(error){
        console.error('Error:', error);
      }

    } else {
      Alert.alert('Error', `No se pudo registrar el usuario: ${data.message}`);
    }

  }catch(error){
    Alert.alert('Error', `Ocurrió un error al registrar el usuario: ${error.message}`);
  }
};

  handleReturn = () => {
    navigation.navigate("Registro",{nombre, movil, password});
  }

  handleSendToPreferencias = () => {
    try {
      navigation.navigate('PreguntasInicial');
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#000", "#3A39F5"]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text style={styles.title}>¡Completa tu{'\n'}perfil!</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.fotoContainer} onPress={seleccionarFoto}>
              {foto ? (
                <Image source={{ uri: foto }} style={styles.foto} />
              ) : (
                <Image
                  source={require('../assets/default-user.png')}
                  style={styles.foto}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.photoText}>Toca para seleccionar foto</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              placeholder="Ingresa tu nombre de usuario"
              value={nombreUsuario}
              onChangeText={setNombreUsuario}
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Edad</Text>
            <TextInput
              placeholder="Ingresa tu edad"
              keyboardType="numeric"
              value={edad}
              onChangeText={setEdad}
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.returnButton]} 
              onPress={handleReturn}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.nextButton]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Completar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  gradient: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoText: {
    color: "#666",
    marginTop: 10,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  fotoContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: "#3A39F5",
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '45%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  returnButton: {
    backgroundColor: "#FFA500",
  },
  nextButton: {
    backgroundColor: "#3A39F5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});