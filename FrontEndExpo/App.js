import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [nombre, setName] = useState('');
  const [edad, setEdad] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería.');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Verificar si se seleccionó una imagen
    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0]; // Acceder al primer asset
      setImage(selectedImage.uri); // Guardar la URI de la imagen seleccionada
      console.log('URI de la imagen:', selectedImage.uri); // Mostrar la URI en la consola
    }
  };

  const handleSubmit = async () => {
    console.log('Enviando...');
    let formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('edad', edad);

    if (image) {
      const fileName = image.split('/').pop();
      const fileType = fileName.split('.').pop();

      formData.append('foto', {
        uri: image,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await fetch('https://pin-backend-fe7p.onrender.com/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseData = response.status;

      if (response.ok) {
        Alert.alert('Bien!', `Te has registrado satisfactoriamente. ${responseData}`);
        setName('');
        setEdad('');
        setImage(null);
      } else {
        Alert.alert('Error', `No te has podido registrar satisfactoriamente. ${responseData}`);
      }
    } catch (error) {
      Alert.alert('Error', `Ha ocurrido un error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Croacky</Text>
      
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
        keyboardType='numeric'
      />

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {/* Mostrar vista previa de la imagen seleccionada */}
      {image ? (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      ) : (
        <Text>No hay imagen seleccionada.</Text>
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
      
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
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#0cb927',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 3,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
  },
});
