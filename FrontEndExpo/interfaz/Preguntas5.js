import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from "../context/UserProvider";

const Preguntas5 = ({ navigation , route}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const puntuacionAcumulada = route.params;
  const { saveUser, setIsAuthenticated } = useUser();
  const  user  = route.params;

  const options = [
    {text: "Aprender algo nuevo o reflexionar", puntos: { WISE: 3, ACTIVE: 2, PARTY: 0, HELPER: 1 }},
    {text: "Haber disfrutado con amigos",puntos: {WISE: 1, ACTIVE: 2, PARTY: 3, HELPER: 0}},
    {text: "Sentirme físicamente activo", puntos: {  WISE: 1, ACTIVE: 3, PARTY: 2, HELPER: 2 }},
    {text: "Haber ayudado o compartido con alguien",puntos: {  WISE: 1, ACTIVE: 2, PARTY: 0, HELPER: 3 }}
  ];

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const finalizarRegistro = async () => {
    const usuario = user;
    console.log(usuario);
    await saveUser(usuario); // Guarda el usuario en el contexto
    setIsAuthenticated(true); // Lo marca como autenticado
    navigation.reset({ index: 0, routes: [{ name: 'verMapa' }] }); // Redirige a la app
  };

  const handleNext = () => {
    if (selectedOption) {
      console.log(puntuacionAcumulada);
      console.log(selectedOption.WISE)
      
      const nuevaPuntuacion = {
        WISE: puntuacionAcumulada.puntuacionAcumulada.WISE + parseInt(selectedOption.puntos.WISE),
        ACTIVE: puntuacionAcumulada.puntuacionAcumulada.ACTIVE + parseInt(selectedOption.puntos.ACTIVE),
        PARTY: puntuacionAcumulada.puntuacionAcumulada.PARTY + parseInt(selectedOption.puntos.PARTY),
        HELPER: puntuacionAcumulada.puntuacionAcumulada.HELPER + parseInt(selectedOption.puntos.HELPER),
      };
      console.log("Navegando a RanaAsignada con opción:", nuevaPuntuacion);
      const usuario = user;
      console.log(usuario);
        navigation.navigate('RanaAsignada',  { puntuacionAcumulada: nuevaPuntuacion, user: usuario });
      }

      //finalizarRegistro();
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#4A66E0' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
      </View>

      {/* Question Text */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          ¿Qué te hace feliz al{'\n'}
          final del día?
        </Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.optionButtonSelected
            ]}
            onPress={() => handleSelect(option)}
          >
            <Text style={[
              styles.optionText,
              selectedOption === option && styles.optionTextSelected
            ]}>
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedOption ? styles.nextButtonActive : styles.nextButtonInactive
        ]}
        onPress={handleNext}
        disabled={!selectedOption}
      >
        <Text style={[
          styles.nextButtonText,
          selectedOption ? styles.nextButtonTextActive : styles.nextButtonTextInactive
        ]}>
          Siguiente
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  questionContainer: {
    marginBottom: 40,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'left',
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#4A66E0',
    borderColor: '#4A66E0',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  nextButton: {
    marginTop: 'auto',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: '#4A66E0',
  },
  nextButtonInactive: {
    backgroundColor: '#333333',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextActive: {
    color: '#FFFFFF',
  },
  nextButtonTextInactive: {
    color: '#666666',
  },
});

export default Preguntas5;