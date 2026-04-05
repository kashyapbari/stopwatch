import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

/**
 * Root App component for the Stopwatch application
 * Serves as the main entry point for the application
 * Platform agnostic - works on web, iOS, and Android
 */
const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          {/* Navigation and screen components will be added here */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      web: {
        display: 'flex',
        flexDirection: 'column',
      },
    }),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
