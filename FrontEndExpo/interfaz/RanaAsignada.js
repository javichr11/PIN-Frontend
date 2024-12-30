import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { useFonts } from 'expo-font';

const RANA_TYPES = {
  WISE: {
    image: require("../assets/ranaFestiva.png"),
    color: '#9B59B6',
    title: '¡Donde hay diversión, ahí estoy! ',
    subtitle: 'Rana Festiva ama la música, la diversión y los ambientes sociales.'
  },
  PARTY: {
    image: require("../assets/ranaSabia.png"),
    color: '#4A66E0',
    title: '¡La sabiduría salta contigo!',
    subtitle: 'Rana Sabia está interesada en el arte, la cultura y el aprendizaje.'
  },
  ACTIVE: {
    image: require("../assets/ranaActiva.png"),
    color: '#27AE60',
    title: '¡Siempre en movimiento!',
    subtitle: 'Rana Activa es deportiva y amantes de la naturaleza.'
  },
  HELPER: {
    image: require("../assets/ranaSolidaria.png"),
    color: '#E67E22',
    title: '¡Juntos hacemos el cambio! ',
    subtitle: 'Rana Solidaria está interesada en ayudar, socializar y crear comunidad.'
  }
};

const RanaAsignada = ({ route, navigation }) => {
  const { ranaType } = route.params;
  const ranaConfig = RANA_TYPES[ranaType];

  const [fontsLoaded] = useFonts({
    'System': require('expo-font')
  });

  const dotOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#444444' }]} />
        <View style={[styles.progressDot, { backgroundColor: '#4A66E0' }]} />
        </View>

      <View style={styles.imageContainer}>
        <Image
          source={ranaConfig.image}
          style={styles.frogsImage}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{ranaConfig.title}</Text>
        <Text style={styles.subtitle}>{ranaConfig.subtitle}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: ranaConfig.color }]}
        onPress={() => navigation.navigate('InicioSesion')}
      >
        <Text style={styles.buttonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  frogsImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RanaAsignada;