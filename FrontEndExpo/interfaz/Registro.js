import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "react-native-vector-icons";
import { useUser } from "../context/UserProvider";

export default function Registro({ route, navigation }) {
  const [nombre, setNombre] = useState('');
  const [movil, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#000", "#3A39F5"]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text style={styles.title}>¡Bienvenid@,{'\n'}regístrate!</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              placeholder="Ingresa tu nombre completo"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Número de Móvil</Text>
            <TextInput
              placeholder="Ingresa tu número de móvil"
              value={movil}
              onChangeText={setPhone}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                style={styles.passwordInput}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={28}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
                style={styles.passwordInput}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <Ionicons
                  name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  size={28}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Siguiente</Text>
          </TouchableOpacity>

          <Text style={styles.loginText}>
            ¿Ya tienes una cuenta?{" "}
            <Text 
              style={styles.loginLink}
              onPress={() => navigation.navigate('InicioSesion')}
            >
              Inicia Sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
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
  },
  formContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
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
  passwordInput: {
    height: 60, // Aumentado la altura
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18, // Aumentado el tamaño de la fuente
    color: "#333",
    width: '100%',
  },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: "#3A39F5",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    fontFamily: "Satoshi-Regular",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
  loginLink: {
    color: "#1630BE",
    fontFamily: "Satoshi-Regular",
  },
});