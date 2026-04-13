/**
 * WorkoutConfigForm.tsx - Improved workout configuration input UI
 * Provides an intuitive layout for configuring workout parameters
 * Uses NumberInput component with layout:
 * Line 1: -[ ]+ Reps x -[ ]+ Sets
 * Line 2: -[ ]+ secs Work & -[ ]+ secs Rest
 * Line 3: -[ ]+ secs between Sets
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, NumberInput } from './index';
import { colors, spacing } from '../styles';

interface WorkoutConfigFormProps {
  secondsPerRep: string;
  restBetweenReps: string;
  repsPerSet: string;
  numberOfSets: string;
  restBetweenSets: string;
  onSecondsPerRepChange: (value: string) => void;
  onRestBetweenRepsChange: (value: string) => void;
  onRepsPerSetChange: (value: string) => void;
  onNumberOfSetsChange: (value: string) => void;
  onRestBetweenSetsChange: (value: string) => void;
}

export const WorkoutConfigForm: React.FC<WorkoutConfigFormProps> = ({
  secondsPerRep,
  restBetweenReps,
  repsPerSet,
  numberOfSets,
  restBetweenSets,
  onSecondsPerRepChange,
  onRestBetweenRepsChange,
  onRepsPerSetChange,
  onNumberOfSetsChange,
  onRestBetweenSetsChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Line 1: Reps x Sets */}
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <NumberInput
            label="Reps"
            value={repsPerSet}
            onChangeText={onRepsPerSetChange}
            min={1}
            max={100}
          />
        </View>

        <View style={styles.separator}>
          <Text size="lg" weight="bold" color="secondary">
            ×
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <NumberInput
            label="Sets"
            value={numberOfSets}
            onChangeText={onNumberOfSetsChange}
            min={1}
            max={100}
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Line 2: Work & Rest */}
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <NumberInput
            label="Work"
            value={secondsPerRep}
            onChangeText={onSecondsPerRepChange}
            min={1}
            max={300}
            suffix="s"
          />
        </View>

        <View style={styles.separator}>
          <Text size="lg" weight="bold" color="secondary">
            &
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <NumberInput
            label="Rest"
            value={restBetweenReps}
            onChangeText={onRestBetweenRepsChange}
            min={0}
            max={300}
            suffix="s"
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Line 3: Between Sets */}
      <View style={styles.row}>
        <View style={styles.fieldGroup}>
          <NumberInput
            label="Between Sets"
            value={restBetweenSets}
            onChangeText={onRestBetweenSetsChange}
            min={0}
            max={300}
            suffix="s"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },

  fieldGroup: {
    flex: 1,
  },

  separator: {
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: colors.bgSecondary,
  },
});
