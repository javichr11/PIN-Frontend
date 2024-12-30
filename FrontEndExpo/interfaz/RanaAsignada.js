import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { useUser } from '../context/UserProvider';

const RANA_TYPES = {
  PARTY: {
    image: require("../assets/ranaFestiva.png"),
    color: '#9B59B6',
    title: '¡Donde hay diversión, ahí estoy! ',
    subtitle: 'Rana Festiva, ama la música, la diversión y los ambientes sociales.'
  },
  WISE: {
    image: require("../assets/ranaSabia.png"),
    color: '#4A66E0',
    title: '¡La sabiduría salta contigo!',
    subtitle: 'Rana Sabia, está interesada en el arte, la cultura y el aprendizaje.'
  },
  ACTIVE: {
    image: require("../assets/ranaActiva.png"),
    color: '#27AE60',
    title: '¡Siempre en movimiento!',
    subtitle: 'Rana Activa, es deportiva y amantes de la naturaleza.'
  },
  HELPER: {
    image: require("../assets/ranaSolidaria.png"),
    color: '#E67E22',
    title: '¡Juntos hacemos el cambio! ',
    subtitle: 'Rana Solidaria, está interesada en ayudar, socializar y crear comunidad.'
  }
}; 

const RanaAsignada = ({ route, navigation }) => {
  const [ranaConfig, setRanaConfig] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const puntuacionAcumulada = route.params.puntuacionAcumulada;
  const { setIsAuthenticated } = useUser();

  const assignFrog = () => {
    let mayorPuntuacion = -1; 
    let tipoRanaConMayorPuntuacion = null;
    
    for (const categoria in puntuacionAcumulada) {
      if (puntuacionAcumulada.hasOwnProperty(categoria)) {
        const puntuacion = puntuacionAcumulada[categoria];
        if (puntuacion > mayorPuntuacion) {
          mayorPuntuacion = puntuacion;
          tipoRanaConMayorPuntuacion = categoria;
        }
      }
    }
    setRanaConfig(RANA_TYPES[tipoRanaConMayorPuntuacion]);
    setIsLoading(false);
  };

  React.useEffect(() => {
    assignFrog();
  }, [puntuacionAcumulada]);

  const [fontsLoaded] = useFonts({
    'System': require('expo-font')
  });

  const handleFinish = () => {
    setIsAuthenticated(true);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'VerEventos'
          }
        ],
      })
    );
  };

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

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A66E0" />
        <Text style={styles.loadingText}>Asignando tu rana...</Text>
      </View>
    );
  }

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
        onPress={() => handleFinish()}
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
    justifyContent: 'flex-start',
    paddingTop: 40, 
    paddingBottom: 20, 
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
  },
  frogsImage: {
    width: '80%',
    height: '150%', 
    resizeMode: 'contain',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10, 
    marginBottom: 50, 
  },
  progressDot: {
    width: 6, 
    height: 6, 
    borderRadius: 3,
    marginHorizontal: 3, 
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20, 
    paddingHorizontal: 20, 
  },
  title: {
    fontSize: 22, 
    color: 'white',
    textAlign: 'center',
    marginBottom: 8, 
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14, 
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25, 
    borderRadius: 25,
    width: '75%', 
    marginTop: 10, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RanaAsignada;