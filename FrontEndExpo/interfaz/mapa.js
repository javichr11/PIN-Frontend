import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Alert, TextInput, ScrollView, Modal
} from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons"; // Añadimos Ionicons para más iconos
import EventCard from "./Components/EventCard";
import { useUser } from "../context/UserProvider";
import { KeyboardAvoidingView, Platform } from "react-native";

const categories = ["Todos", "Musica", "Deporte", "Arte", "Voluntariado"];

const Mapa = ({ eventos, route }) => {
  const [searchText, setSearchText] = useState("");
  const [nuevosEventos, setEventos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState(null);
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
    setIsFilterVisible(false);
  };

  const filteredEventos = nuevosEventos.filter((evento) => {
    const matchesSearch = evento.nombre.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || evento.tematica.toLowerCase() === selectedCategory.toLowerCase();

    // Filtro por duración
    const durationInMinutes = parseInt(evento.duracion.split(':')[0]) * 60 + parseInt(evento.duracion.split(':')[1]);
    let matchesDuration = true;
    if (selectedDuration === "0-30") {
      matchesDuration = durationInMinutes <= 30;
    } else if (selectedDuration === "30-60") {
      matchesDuration = durationInMinutes > 30 && durationInMinutes <= 60;
    } else if (selectedDuration === ">60") {
      matchesDuration = durationInMinutes > 60;
    }

    // Filtro por momento del día
    const eventHour = new Date(evento.fecha).getHours();
    let matchesTimeOfDay = true;
    if (selectedTimeOfDay === "Mañana") {
      matchesTimeOfDay = eventHour >= 6 && eventHour < 12;
    } else if (selectedTimeOfDay === "Tarde") {
      matchesTimeOfDay = eventHour >= 12 && eventHour < 18;
    } else if (selectedTimeOfDay === "Noche") {
      matchesTimeOfDay = eventHour >= 18 || eventHour < 6;
    }

    return matchesSearch && matchesCategory && matchesDuration && matchesTimeOfDay;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, <Text style={styles.username}>{user.nombre_usuario}!</Text></Text>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <FontAwesome name="search" size={18} color="white" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Hoy me apunto a..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
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

      {/* Modal de Filtros */}
      <Modal animationType="slide" transparent={true} visible={isFilterVisible} onRequestClose={() => setIsFilterVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar Eventos</Text>

            {/* Filtro por duración */}
            <Text style={styles.modalSubtitle}>Duración</Text>
            <View style={styles.filterRow}>
              {["0-30", "30-60", ">60"].map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[styles.modalFilterChip, selectedDuration === duration && styles.modalSelectedFilterChip]}
                  onPress={() => setSelectedDuration(selectedDuration === duration ? null : duration)}
                >
                  <Ionicons
                    name={duration === "0-30" ? "time-outline" : duration === "30-60" ? "time" : "time-sharp"}
                    size={20}
                    color={selectedDuration === duration ? "#FFF" : "#6F6F6F"}
                  />
                  <Text style={[styles.modalFilterText, selectedDuration === duration && styles.modalSelectedFilterText]}>
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Filtro por momento del día */}
            <Text style={styles.modalSubtitle}>Momento del día</Text>
            <View style={styles.filterRow}>
              {["Mañana", "Tarde", "Noche"].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.modalFilterChip, selectedTimeOfDay === time && styles.modalSelectedFilterChip]}
                  onPress={() => setSelectedTimeOfDay(selectedTimeOfDay === time ? null : time)}
                >
                  <Ionicons
                    name={time === "Mañana" ? "sunny-outline" : time === "Tarde" ? "partly-sunny-outline" : "moon-outline"}
                    size={20}
                    color={selectedTimeOfDay === time ? "#FFF" : "#6F6F6F"}
                  />
                  <Text style={[styles.modalFilterText, selectedTimeOfDay === time && styles.modalSelectedFilterText]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0E0E", padding: 20 },
  greeting: { fontSize: 26, fontWeight: "bold", color: "white" , fontFamily: 'Satoshi-Regular',},
  username: { color: "#B6FCBE" },
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
  searchBar: { flex: 1, color: "white", fontSize: 16, fontFamily: 'Satoshi-Regular', },
  filterIcon: { marginLeft: 10 },
  filterContainer: { flexDirection: "row", paddingBottom: 20, marginBottom: 15, maxHeight: 55 },
  filterChip: { padding: 10, borderColor: "white", borderWidth: 0.6, borderRadius: 20, minHeight: 37, marginRight: 10, paddingHorizontal: 20 },
  selectedFilterChip: { backgroundColor: "#6F6F6F" },
  filterText: { color: "white", fontSize: 14, fontWeight: "300", fontFamily: 'Satoshi-Regular', },
  flatList: { flex: 1 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#FFF", marginBottom: 20},
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'Satoshi-Regular',
    color: "#FFF",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  modalFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderColor: "#6F6F6F",
    borderWidth: 1,
    borderRadius: 15,
    width: "30%",
    justifyContent: "center",
  },
  modalSelectedFilterChip: {
    backgroundColor: "#3A39F5",
    borderColor: "#3A39F5",
  },
  modalFilterText: {
    color: "#6F6F6F",
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Satoshi-Regular',
  },
  modalSelectedFilterText: {
    color: "#FFF",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#3A39F5",
    padding: 12,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    
  },
});

export default Mapa;