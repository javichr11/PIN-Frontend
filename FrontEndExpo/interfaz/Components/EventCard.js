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
    case "deporte": return ["#D9D9D900", "#B6FCBE", "#B6FCBE"]; //Verde
    case "musica": return ["#D9D9D900", "#FA6A44", "#FA6A44"]; // Naranja
    case "arte": return ["#D9D9D900", "#D199FA", "#D199FA"]; // Morado
    case "voluntariado": return ["transparent", "rgba(30, 144, 255, 0.9)", "rgba(30, 144, 255, 1)"]; // Azul
    default: return ["transparent", "rgba(192, 192, 192, 0.9)", "rgba(192, 192, 192, 1)"]; // Gris por defecto
  }
};


const EventCard = ({ evento, showJoinButton=true }) => {
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

              {/* Ubicación y Categoría */}
              <View style={styles.tagContainer}>
                <View style={styles.tag}>
                  <MaterialIcons name="location-on" size={16} color="white" />
                  <Text style={styles.tagText}>{ubicacion}</Text>
                </View>
                <View style={styles.tag}>
                  <MaterialIcons name="category" size={16} color="white" />
                  <Text style={styles.tagText}>{tematica}</Text>
                </View>
              </View>
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
    fontSize: 15,
    fontFamily: 'Satoshi-Regular',
  },
  aforoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 0.7,
  },
  aforoText: {
    marginLeft: 5,
    color: "black",
    fontWeight: "300",
    fontFamily: 'Satoshi-Regular',
  },
  eventTitle: {
    fontSize: 21,
    fontWeight: "500",
    color: "black",
    marginBottom: 10,
    maxWidth: "50%", 
    flexWrap: "wrap", 
    lineHeight: 22,
    fontFamily: 'Satoshi-Regular',
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A39F5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  tagText: {
    color: "white",
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Satoshi-Regular',
  },

});

export default EventCard;
