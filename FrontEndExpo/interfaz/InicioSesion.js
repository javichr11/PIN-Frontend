import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "react-native-vector-icons"; 
import { useUser } from "../context/UserProvider";

export default function InicioSesion({ navigation}) { 
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const { saveUser } = useUser();


  const handleLogin = async () => {
    if (!userInput || !password) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await fetch("https://croacky.onrender.com/usuario/iniciarSesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: userInput,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Inicio de sesión exitoso", `¡Bienvenid@, ${data.user.nombre}!`);

        console.log(data.user);

        saveUser(data.user);

        navigation.replace('verMapa');
      } else {
        Alert.alert("Error", data.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert("Error", "Ocurrió un problema al conectar con el servidor.");
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Redirigir", "Redirigir a recuperar contraseña.");
  };

  const handleRegister = () => {
    navigation.navigate("Registro"); 
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
          label="Usuario o teléfono"
          value={userInput}
          onChangeText={setUserInput}
          mode="outlined"
          style={styles.input}
        />

        {/* Campo de contraseña */}
        <View style={styles.passwordContainer}>
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!isPasswordVisible} // Dependiendo del estado, ocultar o mostrar la contraseña
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Cambiar visibilidad
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Enlace de contraseña olvidada */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>

        {/* Botón de inicio de sesión */}
        <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
          Iniciar Sesión
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
  container1: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  gradient: {
    width: "100%", // Esto asegura que ocupe todo el ancho de la pantalla
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 50,
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
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
    paddingBlockStart: 10
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
