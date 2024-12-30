import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Preguntas5 = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    "Aprender algo nuevo o reflexionar",
    "Haber disfrutado con amigos",
    "Sentirme físicamente activo",
    "Haber ayudado o compartido con alguien"
  ];

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
        // Store the selected option if needed
        navigation.navigate('Preguntas2');
      }
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
              {option}
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