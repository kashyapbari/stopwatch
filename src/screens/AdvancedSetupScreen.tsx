import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, Container, Section, WorkoutConfigForm } from '../components';
import { colors, spacing } from '../styles';
import { WorkoutConfig, Preset } from '../types';
import { storageService } from '../services/StorageService';
import { generatePresetId } from '../business-logic/utilities';

interface AdvancedSetupScreenProps {
  onStartWorkout: (config: WorkoutConfig) => void;
  onNavigateBack: () => void;
}

export const AdvancedSetupScreen: React.FC<AdvancedSetupScreenProps> = ({
  onStartWorkout,
  onNavigateBack,
}) => {
  const [secondsPerRep, setSecondsPerRep] = useState('45');
  const [restBetweenReps, setRestBetweenReps] = useState('15');
  const [repsPerSet, setRepsPerSet] = useState('10');
  const [numberOfSets, setNumberOfSets] = useState('3');
  const [restBetweenSets, setRestBetweenSets] = useState('60');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const validateInputs = (): boolean => {
    const values = {
      secondsPerRep: parseInt(secondsPerRep, 10),
      restBetweenReps: parseInt(restBetweenReps, 10),
      repsPerSet: parseInt(repsPerSet, 10),
      numberOfSets: parseInt(numberOfSets, 10),
      restBetweenSets: parseInt(restBetweenSets, 10),
    };

    for (const [key, value] of Object.entries(values)) {
      if (isNaN(value) || value <= 0) {
        setError(`${key} must be a positive number`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleStartWorkout = () => {
    if (!validateInputs()) return;

    const config: WorkoutConfig = {
      secondsPerRep: parseInt(secondsPerRep, 10),
      restBetweenReps: parseInt(restBetweenReps, 10),
      repsPerSet: parseInt(repsPerSet, 10),
      numberOfSets: parseInt(numberOfSets, 10),
      restBetweenSets: parseInt(restBetweenSets, 10),
    };

    onStartWorkout(config);
  };

  const handleSavePreset = async () => {
    if (!validateInputs()) return;

    try {
      const config: WorkoutConfig = {
        secondsPerRep: parseInt(secondsPerRep, 10),
        restBetweenReps: parseInt(restBetweenReps, 10),
        repsPerSet: parseInt(repsPerSet, 10),
        numberOfSets: parseInt(numberOfSets, 10),
        restBetweenSets: parseInt(restBetweenSets, 10),
      };

      const preset: Preset = {
        id: generatePresetId(config),
        ...config,
        createdAt: Date.now(),
      };

      await storageService.savePreset(preset);
      const presetDescription = `${config.repsPerSet} × ${config.numberOfSets} @ ${config.secondsPerRep}s`;
      setSuccessMessage(`Preset saved: ${presetDescription}`);
      setError('');

      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setError('Failed to save preset');
      console.error(err);
    }
  };

  return (
    <Container style={styles.screen}>
      <Section style={styles.header}>
        <Text size="4xl" weight="bold">
          Advanced Setup
        </Text>
      </Section>

      <Section style={styles.inputSection}>
        <WorkoutConfigForm
          secondsPerRep={secondsPerRep}
          onSecondsPerRepChange={setSecondsPerRep}
          restBetweenReps={restBetweenReps}
          onRestBetweenRepsChange={setRestBetweenReps}
          repsPerSet={repsPerSet}
          onRepsPerSetChange={setRepsPerSet}
          numberOfSets={numberOfSets}
          onNumberOfSetsChange={setNumberOfSets}
          restBetweenSets={restBetweenSets}
          onRestBetweenSetsChange={setRestBetweenSets}
        />

        {error && (
          <Text size="sm" color="danger" style={styles.error}>
            {error}
          </Text>
        )}

        {successMessage && (
          <Text size="sm" color="success" style={styles.success}>
            {successMessage}
          </Text>
        )}
      </Section>

      <Section style={styles.buttonSection}>
        <Button
          variant="primary"
          size="large"
          onPress={handleStartWorkout}
          label="Start Workout"
          fullWidth
        />

        <Button
          variant="secondary"
          size="medium"
          onPress={handleSavePreset}
          label="Save as Preset"
          fullWidth
        />

        <Button variant="secondary" size="medium" onPress={onNavigateBack} label="Back" fullWidth />
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  error: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  success: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  buttonSection: {
    gap: spacing.md,
  },
});
