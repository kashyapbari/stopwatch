import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from './components';
import { colors } from './styles';
import { QuickSetupScreen, AdvancedSetupScreen, WorkoutScreen, HistoryScreen } from './screens';
import { WorkoutConfig } from './types';

type ScreenName = 'quick-setup' | 'advanced-setup' | 'workout' | 'history';

interface AppState {
  currentScreen: ScreenName;
  workoutConfig?: WorkoutConfig;
}

/**
 * Root App component for the Advanced Stopwatch application
 * Manages screen navigation and state
 * Serves as the main entry point for the application
 * Platform agnostic - works on web, iOS, and Android
 */
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'quick-setup',
  });

  const handleStartWorkout = (config: WorkoutConfig) => {
    setAppState({
      currentScreen: 'workout',
      workoutConfig: config,
    });
  };

  const handleWorkoutComplete = () => {
    setAppState({
      currentScreen: 'quick-setup',
    });
  };

  const handleNavigateToAdvanced = () => {
    setAppState({
      currentScreen: 'advanced-setup',
    });
  };

  const handleNavigateToHistory = () => {
    setAppState({
      currentScreen: 'history',
    });
  };

  const handleNavigateBack = () => {
    setAppState({
      currentScreen: 'quick-setup',
    });
  };

  return (
    <Container style={styles.container}>
      {appState.currentScreen === 'quick-setup' && (
        <QuickSetupScreen
          onStartWorkout={handleStartWorkout}
          onNavigateToAdvanced={handleNavigateToAdvanced}
          onNavigateToHistory={handleNavigateToHistory}
        />
      )}

      {appState.currentScreen === 'advanced-setup' && (
        <AdvancedSetupScreen
          onStartWorkout={handleStartWorkout}
          onNavigateBack={handleNavigateBack}
        />
      )}

      {appState.currentScreen === 'workout' && appState.workoutConfig && (
        <WorkoutScreen
          config={appState.workoutConfig}
          onWorkoutComplete={handleWorkoutComplete}
          onNavigateBack={handleNavigateBack}
        />
      )}

      {appState.currentScreen === 'history' && (
        <HistoryScreen onNavigateBack={handleNavigateBack} />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
});

export default App;
