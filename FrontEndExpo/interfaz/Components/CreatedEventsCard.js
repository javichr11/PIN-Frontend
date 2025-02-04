import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";



const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);

  // Opciones para formatear la fecha
  const opciones = {
    weekday: 'short', // día de la semana abreviado (ej. "sáb.")
    day: '2-digit', // día del mes con dos dígitos
    month: '2-digit', // mes abreviado
    year: 'numeric', // año completo
    hour: '2-digit', // hora en formato 24h
    minute: '2-digit', // minutos
  };

  return fecha.toLocaleDateString('es-ES', opciones).replace(',', ' ·');
};

const getGradientColors = (categoria) => {
  switch (categoria) {
    case "deporte": return ["transparent", "rgba(255, 254, 245, 0.9)", "rgba(255, 254, 245, 1)"]; // Amarillo
    case "musica": return ["transparent", "rgba(250, 106, 68, 0.9)", "rgba(250, 106, 68, 1)"]; // Naranja
    case "arte": return ["transparent", "rgba(211, 182, 255, 0.9)", "rgba(211, 182, 255, 1)"]; // Morado
    case "voluntariado": return ["transparent", "rgba(182, 252, 190, 0.9)", "rgba(182, 252, 190, 1)"]; // Verde
    default: return ["transparent", "rgba(192, 192, 192, 0.9)", "rgba(192, 192, 192, 1)"]; // Gris por defecto
  }
};


const CreatedEventsCard = ({ evento, showJoinButton=true }) => {
  const { nombre, ubicacion, tematica, fecha, inscritos, aforo, foto } = evento;
  const gradientColors = getGradientColors(tematica.toLowerCase());
  const navigation = useNavigation();
  const onPress = () => navigation.navigate("DetalleEvento", { evento, showJoinButton })
  return (
    <TouchableOpacity onPress={onPress} >
      <View style={styles.cardContainer}>
        {/* Imagen con superposición de degradado */}
        <ImageBackground source={{ uri: foto }} style={styles.eventImage} >
          {/* Degradado para mejorar legibilidad */}
          <LinearGradient
            colors={gradientColors} // Verde claro en la parte inferior
            style={styles.gradientOverlay}
          />
          {/* Contenedor de contenido encima de la imagen */}
          <View style={styles.content}>

            {/* Fecha y aforo */}
            <View style={styles.header}>
              <Text style={styles.dateText}>{formatearFecha(fecha)}</Text>
              <View style={styles.aforoContainer}>
                <FontAwesome name="users" size={16} color="black" />
                <Text style={styles.aforoText}>{`${inscritos}/${aforo}`}</Text>
              </View>
            </View>

            <View style={styles.body}>
              {/* Título */}
              <Text style={styles.eventTitle} numberOfLines={2}>
                {nombre}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    height: 250,
    width: 350,
  },
  eventImage: {
    width: "100%",
    height: 180, // Asegura espacio suficiente
    justifyContent: "flex-end", // Para que el contenido quede alineado abajo
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: "70%", // Cubre solo la parte inferior
    top: "30%",
  },
  content: {
    padding: 15,
    flexDirection: "column",
    width: "100%",
    flex: 1,
    justifyContent: "space-between",

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  body: {
  },
  dateText: {
    color: "white",
    fontSize: 14,
  },
  aforoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 0.7,
  },
  aforoText: {
    marginLeft: 5,
    color: "black",
    fontWeight: "300",
  },
  eventTitle: {
    fontSize: 21,
    fontWeight: "500",
    color: "black",
    marginBottom: 10,
    maxWidth: "50%", 
    flexWrap: "wrap", 
    lineHeight: 22,
  },
  container: {
    flexDirection: 'row',
    gap: 10, // Espaciado entre los botones
  },
  editarButton: {
    backgroundColor: '#0D0C44', // Azul oscuro
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, // Bordes redondeados
  },
  editarText: {
    color: '#4A448C', // Azul oscuro más claro para simular opacidad
    fontSize: 16,
    fontWeight: 'bold',
  },
  eliminarButton: {
    borderWidth: 1,
    borderColor: '#4A448C', // Borde grisáceo oscuro
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  eliminarText: {
    color: '#4A448C', // Color del texto en eliminar
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatedEventsCard;
