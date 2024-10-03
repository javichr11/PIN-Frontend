import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [nombre, setName] = useState('');
  const [edad, setEdad] = useState('');
  
  const handleSubmit = async () => {
    console.log('Enviando...');
    try {
      const response = await fetch('https://pin-backend-fe7p.onrender.com/usuario', { // Cambia esta URL por la de tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          edad,
        }),
      });

      const responseData = response.status;

      if (response.ok) {
        Alert.alert('Bien!', `Te has registrado satisfactoriamente. ${responseData}`);
        setName('');
        setEdad('');
      } else {
        Alert.alert('Error',` No te has podido registrar satisfactoriamente. ${responseData}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ha ocurrido un error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Croacky</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={nombre}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
      />

      <Button title="Enviar" onPress={handleSubmit} />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
});
