import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, Container, Section, Card, WorkoutConfigForm } from '../components';
import { colors, spacing } from '../styles';
import { Preset, WorkoutConfig } from '../types';
import { storageService } from '../services/StorageService';

interface QuickSetupScreenProps {
  onStartWorkout: (config: WorkoutConfig) => void;
  onNavigateToAdvanced: () => void;
  onNavigateToHistory: () => void;
}

export const QuickSetupScreen: React.FC<QuickSetupScreenProps> = ({
  onStartWorkout,
  onNavigateToAdvanced,
  onNavigateToHistory,
}) => {
  const [secondsPerRep, setSecondsPerRep] = useState('45');
  const [restBetweenReps, setRestBetweenReps] = useState('15');
  const [repsPerSet, setRepsPerSet] = useState('10');
  const [numberOfSets, setNumberOfSets] = useState('3');
  const [restBetweenSets, setRestBetweenSets] = useState('60');
  const [recentPresets, setRecentPresets] = useState<Preset[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadRecentPresets();
  }, []);

  const loadRecentPresets = async () => {
    try {
      const presets = await storageService.getAllPresets();
      setRecentPresets(presets.slice(0, 5));
    } catch (err) {
      console.warn('Failed to load presets:', err);
    }
  };

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

  const handlePresetSelect = (preset: Preset) => {
    setSecondsPerRep(preset.secondsPerRep.toString());
    setRestBetweenReps(preset.restBetweenReps.toString());
    setRepsPerSet(preset.repsPerSet.toString());
    setNumberOfSets(preset.numberOfSets.toString());
    setRestBetweenSets(preset.restBetweenSets.toString());
    setError('');
  };

  return (
    <Container style={styles.screen}>
      <Section style={styles.header}>
        <Text size="4xl" weight="bold">
          Workout Timer
        </Text>
        <Text size="base" color="secondary" style={styles.subtitle}>
          Quick Setup
        </Text>
      </Section>

      <Section style={styles.inputSection}>
        <Text size="lg" weight="semibold" style={styles.sectionTitle}>
          Workout Configuration
        </Text>

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
          onPress={onNavigateToAdvanced}
          label="Advanced Setup"
          fullWidth
        />
      </Section>

      {recentPresets.length > 0 && (
        <Section style={styles.presetsSection}>
          <Text size="lg" weight="semibold" style={styles.sectionTitle}>
            Recent Presets
          </Text>

          {recentPresets.map((preset, index) => (
            <Card key={index} onPress={() => handlePresetSelect(preset)} style={styles.presetCard}>
              <Container style={styles.presetContent}>
                <Text size="base" weight="semibold">
                  {preset.repsPerSet} reps × {preset.numberOfSets} sets
                </Text>
                <Text size="sm" color="secondary">
                  {preset.secondsPerRep}s work / {preset.restBetweenReps}s rest
                </Text>
                <Text size="xs" color="muted">
                  {preset.restBetweenSets}s between sets
                </Text>
              </Container>
            </Card>
          ))}
        </Section>
      )}

      <Button
        variant="tertiary"
        size="medium"
        onPress={onNavigateToHistory}
        label="View History"
        fullWidth
        style={styles.historyButton}
      />
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
  subtitle: {
    marginTop: spacing.xs,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  error: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  buttonSection: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  presetsSection: {
    marginBottom: spacing.lg,
  },
  presetCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  presetContent: {
    gap: spacing.xs,
  },
  historyButton: {
    marginBottom: spacing.lg,
  },
});
