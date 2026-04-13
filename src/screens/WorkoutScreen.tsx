import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text, Container, Section } from '../components';
import { colors, spacing } from '../styles';
import { WorkoutConfig, WorkoutState } from '../types';
import { WorkoutEngine } from '../business-logic/WorkoutEngine';
import { audioService } from '../services/AudioService';
import { storageService } from '../services/StorageService';
import { formatTime } from '../business-logic/utilities';

interface WorkoutScreenProps {
  config: WorkoutConfig;
  onWorkoutComplete: () => void;
  onNavigateBack: () => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ config, onWorkoutComplete }) => {
  const [workoutState, setWorkoutState] = useState<WorkoutState | null>(null);
  const [displayTime, setDisplayTime] = useState('00:00');
  const [countdownTime, setCountdownTime] = useState('--:--');
  const [isLoading, setIsLoading] = useState(true);
  const engineRef = useRef<WorkoutEngine | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const tonUnsubscribeRef = useRef<(() => void) | null>(null);

  const initializeWorkout = useCallback(async () => {
    try {
      await audioService.initialize();
      const engine = new WorkoutEngine();

      // Subscribe to tick updates
      const unsubscribe = engine.onTickListener((state: WorkoutState) => {
        setWorkoutState(state);
        
        if (state.phase === 'countdown' || state.phase === 'idle') {
          setDisplayTime('--:--');
          setCountdownTime('--:--');
        } else {
          const remainingSeconds = engine.getTimeRemainingInPhase();
          setDisplayTime(formatTime(state.elapsedTime - 3000));
          setCountdownTime(formatTime(remainingSeconds * 1000));
        }
      });

      // Subscribe to tone events
      const toneUnsubscribe = engine.onToneListener(async (toneName: string) => {
        switch (toneName) {
          case 'countdown':
            await audioService.playCountdown();
            break;
          case 'start':
            await audioService.signalWorkoutStart();
            break;
          case 'stop':
            await audioService.signalWorkoutStop();
            break;
          case 'set-rest':
            await audioService.signalSetRest();
            break;
          default:
            console.warn(`[WorkoutScreen] Unknown tone: ${toneName}`);
        }
      });

      unsubscribeRef.current = unsubscribe;
      tonUnsubscribeRef.current = toneUnsubscribe;
      engineRef.current = engine;

      // Set initial state
      const initialState = engine.getState();
      setWorkoutState(initialState);
      setDisplayTime(formatTime(initialState.elapsedTime));
      setCountdownTime('--:--');
      setIsLoading(false);

      // Auto-start workout with config
      engine.start(config);
    } catch (err) {
      console.error('Failed to initialize workout:', err);
      setIsLoading(false);
    }
  }, [config]);

  useEffect(() => {
    initializeWorkout();
    return () => {
      if (engineRef.current) {
        engineRef.current.reset();
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (tonUnsubscribeRef.current) {
        tonUnsubscribeRef.current();
      }
    };
  }, [initializeWorkout]);

  const handlePause = () => {
    if (engineRef.current) {
      if (workoutState?.isPaused) {
        engineRef.current.resume();
        // Update state to show resume happened
        setWorkoutState((prev) => (prev ? { ...prev, isPaused: false } : null));
      } else {
        engineRef.current.pause();
        // Update state to show pause happened
        setWorkoutState((prev) => (prev ? { ...prev, isPaused: true } : null));
      }
    }
  };

  const handleStop = async () => {
    if (engineRef.current && workoutState) {
      engineRef.current.reset();
      // Record the workout in history
      await storageService.addToHistory(config, workoutState.elapsedTime);
    }
    onWorkoutComplete();
  };

  if (isLoading || !workoutState) {
    return (
      <Container style={styles.centerScreen}>
        <Section style={styles.centerSection}>
          <ActivityIndicator size="large" color={colors.accentPrimary} style={styles.loader} />
          <Text size="lg" color="secondary">
            Initializing workout...
          </Text>
        </Section>
      </Container>
    );
  }

  return (
    <Container style={styles.screen}>
      <Section style={styles.timerSection}>
        <Text size="2xl" style={styles.timer}>
          {displayTime}
        </Text>
      </Section>

      {/* Countdown timer - most prominent section */}
      <Section style={styles.countdownSection}>
        <Text size="4xl" weight="bold" style={styles.countdown}>
          {countdownTime}
        </Text>
      </Section>

      <Section style={styles.infoSection}>
        <Container style={styles.phaseContainer}>
          <Text size="xl" weight="semibold" color="primary">
            {workoutState.phase === 'working'
              ? 'Work It'
              : workoutState.phase === 'resting'
                ? 'Rest'
                : workoutState.phase === 'set-rest'
                  ? 'Set Rest'
                  : workoutState.phase === 'countdown'
                    ? 'Get Ready'
                    : 'Idle'}
          </Text>
        </Container>

        <Container style={styles.counterContainer}>
          <Container style={styles.counterItem}>
            <Text size="base" color="secondary">
              Rep
            </Text>
            <Container style={styles.counterValue}>
              <Text size="2xl" weight="bold" color="primary">
              {workoutState.currentRep}
              </Text>
              <Text size="sm" color="secondary">
                / {config.repsPerSet}
              </Text>
            </Container>
          </Container>

          <Container style={styles.counterItem}>
            <Text size="base" color="secondary">
              Set
            </Text>
            <Container style={styles.counterValue}>
              <Text size="2xl" weight="bold" color="primary">
                {workoutState.currentSet}
              </Text>
              <Text size="sm" color="secondary">
                / {config.numberOfSets}
              </Text>
            </Container>
          </Container>
        </Container>
      </Section>

      <Section style={styles.buttonSection}>
        <Button
          variant={workoutState.isPaused ? 'primary' : 'secondary'}
          size="large"
          onPress={handlePause}
          label={workoutState.isPaused ? 'Resume' : 'Pause'}
          fullWidth
        />

        <Button variant="danger" size="large" onPress={handleStop} label="Stop Workout" fullWidth />
      </Section>

    </Container>
  );
};

const styles = StyleSheet.create({
  centerScreen: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginBottom: spacing.lg,
  },
  timerSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  timer: {
    textAlign: 'right',
    color: colors.accentPrimary,
  },
  countdownSection: {
    marginBottom: spacing.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdown: {
    textAlign: 'center',
    color: colors.accentPrimary,
  },
  infoSection: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  phaseContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.bgSecondary,
    borderRadius: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  counterItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  counterValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  buttonSection: {
    gap: spacing.md,
  },
  pausedIndicator: {
    paddingVertical: spacing.md,
    backgroundColor: colors.bgSecondary,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
