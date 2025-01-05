import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "../context/UserProvider";
import React, { useEffect } from 'react';

const PreguntasInicial = ({ navigation }) => {
  const {user, setIsAuthenticated} = useUser();

  const startQuiz = () => {
    navigation.navigate('Preguntas1');
  };

  const skipQuiz = async () => {
    try {
      if (!user) {
        console.error('No se encontró información del usuario');
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error in skipQuizz:', error);
    }
  };


  useEffect(() => {
    if (!user) {
      console.log("N ha llegado el usuario correctamente");
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {/* Indicador de progreso */}
      <View style={styles.progressContainer}>
              <View style={[styles.progressDot, { backgroundColor: '#4A66E0' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
            </View>

      {/* Contenedor para la imagen */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/ranitas.png")}
          style={styles.frogsImage}
        />
      </View>

      {/* Texto de bienvenida */}
      <View style={styles.welcome}>
        <Text style={styles.title}>¡Bienvenid@!</Text>
        <Text style={styles.subtitle}>
          Responde estas preguntas rápidas para{'\n'}
          descubrir qué tipo de rana eres y{'\n'}
          personalizar tu experiencia en eventos.
        </Text>
      </View>

      {/* Botones */}
      <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
        <Text style={styles.buttonText}>¡Empezar!</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.skipButton} onPress={skipQuiz}>
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    paddingTop: 40,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  indicatorActive: {
    width: 8,
    height: 8,
    backgroundColor: "#4A66E0",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorInactive: {
    width: 8,
    height: 8,
    backgroundColor: "#444444",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  frogsImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
  welcome: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: "#4A66E0",
    paddingVertical: 15,
    width: '85%',
    borderRadius: 30,
    marginBottom: 15,
  },
  skipButton: {
    paddingVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  skipText: {
    color: "#666666",
    fontSize: 16,
  },
});

export default PreguntasInicial;