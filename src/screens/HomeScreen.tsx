import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Home Screen - Main stopwatch screen
 * TODO: Implement stopwatch UI and controls
 */
const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stopwatch Screen</Text>
      <Text style={styles.subtitle}>Screen content will be added here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
