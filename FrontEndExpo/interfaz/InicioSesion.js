import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function InicioSesion() {
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if ((userInput === "admin" || userInput === "1234567890") && password === "1234") {
      alert("Inicio de sesión exitoso. ¡Bienvenido!");
    } else {
      alert("Error: Usuario o contraseña incorrectos.");
    }
  };

  const handleForgotPassword = () => {
    alert("Redirigir a recuperar contraseña.");
  };

  const handleRegister = () => {
    alert("Redirigir a pantalla de registro.");
  };

  return (
    <View style={styles.container}>
      {/* Degradado */}
      <LinearGradient
        colors={["#000", "#3A39F5"]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Text style={styles.title}>¡Bienvenid@ de nuevo!</Text>
      </LinearGradient>

      {/* Campo de usuario o teléfono */}
      <View style={styles.container1}>
      <TextInput
        placeholder="usuario o teléfono"
        value={userInput}
        onChangeText={setUserInput}
        mode="outlined"
        style={styles.input}
      />

      {/* Campo de contraseña */}
      <TextInput
        placeholder="contraseña"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      {/* Enlace de contraseña olvidada */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>
      </TouchableOpacity>

      {/* Botón de inicio de sesión */}
      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        Finalizar
      </Button>

      {/* Enlace de registro */}
      <Text style={styles.register}>
        ¿No tienes una cuenta?{" "}
        <Text style={styles.registerLink} onPress={handleRegister}>
          Regístrate
        </Text>
      </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container1:{
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop : 60,
  },
  gradient: {
    width: '100%', // Esto asegura que ocupe todo el ancho de la pantalla
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  forgotPassword: {
    color: "#1630BE",
    textAlign: "right",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#3A39F5",
    paddingVertical: 10,
    borderRadius: 5,
  },
  register: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  registerLink: {
    color: "#1630BE",
    fontWeight: "bold",
  },
});
