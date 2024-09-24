// App.js
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GetDataComponent from './src/components/GetDataComponent';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Croacky</Text>
      </View>
      <GetDataComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f8f9fa', // Ajusta el color de fondo del encabezado si lo deseas
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
