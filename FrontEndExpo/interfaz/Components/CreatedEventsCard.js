import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { FontAwesome} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useUser } from '../../context/UserProvider';
import { useEffect } from "react";

const fetchEventos = async () => {
  
  try {
    const response = await fetch(`https://croacky.onrender.com/evento/obtener/${user.id}`);
    const data = await response.json();
    if (response.ok) {

      const eventosOrdenados = data.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setEventos(eventosOrdenados);
    } else {
      Alert.alert('Error', `No se pudieron obtener los eventos: ${data.message}`);
    }
  } catch (error) {
    Alert.alert('Error', `Ocurrió un error al obtener eventos: ${error.message}`);
  }
}; 

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

const confirmarEliminar = (id, userID) => {
    Alert.alert(
      '¿Estás seguro?',
      '¿Estás seguro de que deseas eliminar el evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar evento',
          onPress: () => eliminarEvento(id, userID),
          style: 'destructive'
        },
      ],
      { cancelable: true }
    );
  };

  const eliminarEvento = async (id, userID) => {
    try {
      const response = await fetch(`https://croacky.onrender.com/evento/eliminar/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Éxito', 'El evento ha sido eliminado correctamente');
        //await fetchEventos(userID);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message);
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error: ${error.message}`);
    }
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
  const { user } = useUser();

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
                <FontAwesome name="users" size={16} color="white" />
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
        {/* Botones de Editar y Eliminar */}
        <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editarButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit(evento);
                }}
              >
                <Text style={styles.editarText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.eliminarButton}
                onPress={(e) => {
                  e.stopPropagation();
                  confirmarEliminar(evento.id, user.id);
                }}
              >
                <Text style={styles.eliminarText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    height: 250,
    width: 350,
    backgroundColor: '#18191A',
  },
  eventImage: {
    width: "100%",
    height: 180, 
    justifyContent: "flex-end", 
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: "70%", 
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
    borderColor: '#FFF'
  },
  aforoText: {
    marginLeft: 5,
    color: "white",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },
  editarButton: {
    backgroundColor: '#3A39F5', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, 
    height: 40,
    width: 120,
    alignItems: 'center',
  },
  editarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eliminarButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    height: 40,
    width: 120,
    alignItems: 'center',
  },
  eliminarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Satoshi-Regular',
  },
});

export default CreatedEventsCard;
