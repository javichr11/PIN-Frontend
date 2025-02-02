import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  FlatList, Alert, TextInput, ScrollView, Modal 
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import EventCard from "./Components/EventCard";
import { useUser } from "../context/UserProvider";
import { KeyboardAvoidingView, Platform } from "react-native";

const categories = ["Todos", "Musica", "Deporte", "Arte", "Voluntariado"];

const Mapa = ({ eventos, route }) => {
  const [searchText, setSearchText] = useState("");
  const [nuevosEventos, setEventos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFilterVisible, setIsFilterVisible] = useState(false); // Estado para el modal de filtros
  const { user } = useUser();

  useEffect(() => {
    fetchEventos();
  }, [route.params, selectedCategory]);

  const fetchEventos = async () => {
    try {
      const response = await fetch("https://croacky.onrender.com/evento/obtener");
      const data = await response.json();
      if (response.ok) {
        setEventos(data.data);
      } else {
        Alert.alert("Error", `No se pudieron obtener los eventos: ${data.message}`);
      }
    } catch (error) {
      Alert.alert("Error", `Ocurrió un error al obtener eventos: ${error.message}`);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); 
    setIsFilterVisible(false); // Cierra el modal al seleccionar una categoría
  };

  const filteredEventos = nuevosEventos.filter(
    (evento) =>
      evento.nombre.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedCategory === "Todos" || evento.tematica.toLowerCase() === selectedCategory.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, <Text style={styles.username}>{user.nombre_usuario}!</Text></Text>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        {/* Search Icon */}
        <FontAwesome name="search" size={18} color="white" style={styles.searchIcon} />
        
        {/* Search Field */}
        <TextInput
          style={styles.searchBar}
          placeholder="Hoy me apunto a..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Filter Icon - Abre el modal */}
        <TouchableOpacity style={styles.filterIcon} onPress={() => setIsFilterVisible(true)}>
          <MaterialIcons name="tune" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, selectedCategory === cat && styles.selectedFilterChip]}
            onPress={() => handleCategoryChange(cat)}
          >
            <Text style={styles.filterText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* Lista de eventos */}
        <FlatList
          data={filteredEventos}
          renderItem={({ item }) => <EventCard evento={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      {/* Modal de Filtros */}
      <Modal animationType="slide" transparent={true} visible={isFilterVisible} onRequestClose={() => setIsFilterVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar Eventos</Text>

            {/* Opciones de filtro */}
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.modalFilterChip, selectedCategory === cat && styles.modalSelectedFilterChip]}
                onPress={() => handleCategoryChange(cat)}
              >
                <Text style={styles.modalFilterText}>{cat}</Text>
              </TouchableOpacity>
            ))}

            {/* Botón para cerrar el modal */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsFilterVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

/* 📌 ESTILOS */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0E0E", padding: 20 },
  greeting: { fontSize: 26, fontWeight: "bold", color: "white" },
  username: { color: "#63FF63" },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderColor: "#808080",
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginTop: 25,
    height: 45,
    marginBottom: 15,
  },
  searchIcon: { marginRight: 10 },
  searchBar: { flex: 1, color: "white", fontSize: 16 },
  filterIcon: { marginLeft: 10 },

  filterContainer: { flexDirection: "row", paddingBottom: 20, marginBottom: 15, maxHeight: 55 },
  filterChip: { padding: 10, borderColor: "white", borderWidth: 0.6, borderRadius: 20, minHeight: 37, marginRight: 10, paddingHorizontal: 20 },
  selectedFilterChip: { backgroundColor: "#6F6F6F" },
  filterText: { color: "white", fontSize: 14, fontWeight: "300" },

  flatList: { flex: 1 },

  /* MODAL DE FILTROS */
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#FFF", marginBottom: 15 },
  modalFilterChip: {
    padding: 10,
    borderColor: "#FFF",
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  modalSelectedFilterChip: { backgroundColor: "#6F6F6F" },
  modalFilterText: { color: "#FFF", fontSize: 16 },
  closeButton: { marginTop: 15, backgroundColor: "#3A39F5", padding: 10, borderRadius: 10, width: "100%", alignItems: "center" },
  closeButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default Mapa;
