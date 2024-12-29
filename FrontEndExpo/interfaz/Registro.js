import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Registro({ route, navigation }) {
  const [nombre, setNombre] = useState('');
  const [movil, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      if (route.params) {
        const { nombre: savedNombre, movil: savedPhone, password: savedPassword } = route.params;
        if (savedNombre) setNombre(savedNombre);
        if (savedPhone) setPhone(savedPhone);
        if (savedPassword) setPassword(savedPassword);
      }
    }, [route.params])
  );

  const handleNext = () => {
    if (!nombre.trim() || nombre.split(" ").length < 2) {
      Alert.alert("Error", "Por favor, ingresa tu nombre completo (nombre y apellido).");
      return;
    }

    const phoneRegex = /^[0-9]{9,12}$/;
    if (!phoneRegex.test(movil)) {
      Alert.alert("Error", "Por favor, ingresa un número de móvil válido.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    navigation.navigate('RegistroFoto', { nombre, movil, password });
  };

  return (
    <View style={styles.container}>
      {/* Imagen en la parte superior */}
      <Image
        source={require('../assets/frog.png')} 
        style={styles.image}
      />

    <View style={styles.inputContainer}>
      <Text style={styles.title}>Bienvenido a Croacky</Text>

      <Text style={styles.label}>Nombre Completo</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Número de Móvil</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={movil}
        onChangeText={setPhone}
      />    

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />   

    <Text style={styles.label}>Confirma Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      /> 

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
      </View>

      
      <StatusBar style="auto" />
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
  image: {
    width: 175, 
    height: 175, 
    marginTop: 5,
    borderRadius: 75,
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