import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Preguntas3 = ({ navigation , route}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const puntuacionAcumulada = route.params;
  const user = route.params.user;

  const options = [
    {text: "Curioso/a y reflexivo/a",puntos: { WISE: 3, ACTIVE: 2, PARTY: 0, HELPER: 1 }},
    {text: "Divertido/a y extrovertido/a", puntos: { WISE: 1, ACTIVE: 2, PARTY: 3, HELPER: 0 }},
    {text: "Enérgico/a y competitivo/a", puntos: {  WISE: 1, ACTIVE: 3, PARTY: 2, HELPER: 2 }},
    {text: "Amable y generoso/a", puntos: {  WISE: 1, ACTIVE: 2, PARTY: 0, HELPER: 3  }}
  ];

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) { 
      const nuevaPuntuacion = {
        WISE: puntuacionAcumulada.puntuacionAcumulada.WISE + parseInt(selectedOption.puntos.WISE),
        ACTIVE: puntuacionAcumulada.puntuacionAcumulada.ACTIVE + parseInt(selectedOption.puntos.ACTIVE),
        PARTY: puntuacionAcumulada.puntuacionAcumulada.PARTY + parseInt(selectedOption.puntos.PARTY),
        HELPER: puntuacionAcumulada.puntuacionAcumulada.HELPER + parseInt(selectedOption.puntos.HELPER),
      };
      const usuario = user;
      console.log("Navegando a Preguntas4 con opción:", nuevaPuntuacion);
      console.log(usuario);
        navigation.navigate('Preguntas4',  { puntuacionAcumulada: nuevaPuntuacion, user: usuario });
      }
  };

  return (
    <View style={styles.container}>
      {/* Indicadores de progreso */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#4A66E0' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
              <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
            </View>
      
      {/* Texto de la pregunta */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          ¿Cómo te describirían{'\n'}tus amigos?
        </Text>
      </View>

      {/* Opciones */}
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

      {/* Botón siguiente */}
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
    textAlign: 'center',
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

export default Preguntas3;
