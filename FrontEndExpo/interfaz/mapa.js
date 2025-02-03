import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, TextInput, ScrollView, } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import EventCard from "./Components/EventCard";
import { useUser } from "../context/UserProvider";
import { KeyboardAvoidingView, Platform } from "react-native";

const categories = ["Todos", "Musica", "Deporte", "Arte", "Voluntariado"];

const Mapa = ({ eventos, route }) => {
  const [searchText, setSearchText] = useState("");
  const [nuevosEventos, setEventos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { user, logout } = useUser();
  const userID = user.id;

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
          placeholder="Hoy me me apunto a..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Filter Icon */}
        <TouchableOpacity style={styles.filterIcon}>
          <MaterialIcons name="tune" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
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

      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
>
        {/* Events List */}
        <FlatList
          data={filteredEventos}
          renderItem={({ item }) => (
          <EventCard 
            evento={item}     
            onPress={() => navigation.navigate('DetalleEvento', { evento: item })} 
                  
        />
        )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0E0E", padding: 20 },
  greeting: { fontSize: 26, fontWeight: "bold", color: "white" },
  username: { color: "#63FF63" },
  
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",  // Fondo negro
    borderColor: "#808080",   // Gris claro (similar a la imagen)
    borderWidth: 1.5,
    borderRadius: 25,         // Bordes redondeados
    paddingHorizontal: 15,
    marginTop: 25,
    height: 45,               // Altura para que los iconos y el texto se alineen bien
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  filterIcon: {
    marginLeft: 10,
  },

  filterContainer: { 
    flexDirection: "row", 
    paddingBottom: 20,
    marginBottom: 15,
    maxHeight: 55},
  filterChip: { 
    padding: 10, 
    borderColor: "white",
    borderWidth: 0.6,
    borderRadius: 20,
    minHeight: 37, 
    marginRight: 10,
    paddingHorizontal:20,
   },
  selectedFilterChip: { backgroundColor: "#6F6F6F" },
  filterText: { 
    color: "white",    
    fontSize: 14,
    fontWeight: "300",
  },

  eventCard: { 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    backgroundColor: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  eventHeader: { flexDirection: "row", justifyContent: "space-between" },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 5 },
  eventDate: { fontSize: 14, color: "#B3B3B3" },
  locationTag: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  eventLocation: { fontSize: 14, color: "white", marginLeft: 5 },
  
  participants: { flexDirection: "row", alignItems: "center" },
  participantText: { marginLeft: 5, color: "white" },

  joinButton: { 
    backgroundColor: "#FFF", 
    paddingVertical: 8, 
    borderRadius: 5, 
    alignItems: "center" 
  },
  joinText: { fontWeight: "bold", color: "#000" },
});

export default Mapa;
