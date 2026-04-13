import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Button, Text, Container, Section, Card } from '../components';
import { colors, spacing } from '../styles';
import { WorkoutHistoryEntry } from '../types';
import { storageService } from '../services/StorageService';
import { formatDate, formatDuration } from '../business-logic/utilities';

interface HistoryScreenProps {
  onNavigateBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onNavigateBack }) => {
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const entries = await storageService.getHistory();
      // Sort by date, most recent first
      const sorted = entries.sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
      setHistory(sorted);
      setError('');
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Failed to load workout history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (index: number) => {
    try {
      // Delete by clearing and re-saving
      await storageService.clearHistory();
      const newHistory = history.filter((_, i) => i !== index);
      // Re-save remaining entries using addToHistory
      for (const entry of newHistory) {
        await storageService.addToHistory(
          {
            secondsPerRep: entry.secondsPerRep,
            restBetweenReps: entry.restBetweenReps,
            repsPerSet: entry.repsPerSet,
            numberOfSets: entry.numberOfSets,
            restBetweenSets: entry.restBetweenSets,
          },
          entry.duration
        );
      }
      setHistory(newHistory);
    } catch (err) {
      console.error('Failed to delete entry:', err);
      setError('Failed to delete entry');
    }
  };

  const renderHistoryItem = ({ item, index }: { item: WorkoutHistoryEntry; index: number }) => {
    return (
      <Card style={styles.historyCard}>
        <Container style={styles.historyContent}>
          <Container style={styles.historyHeader}>
            <Text size="base" weight="semibold" color="primary">
              {formatDate(item.completedAt)}
            </Text>
            <Text size="sm" color="secondary">
              {formatDuration(item.duration)}
            </Text>
          </Container>

          <Container style={styles.configDetails}>
            <Text size="sm" color="secondary">
              {item.repsPerSet} reps × {item.numberOfSets} sets
            </Text>
            <Text size="xs" color="muted">
              {item.secondsPerRep}s work / {item.restBetweenReps}s rest
            </Text>
            <Text size="xs" color="muted">
              {item.restBetweenSets}s between sets
            </Text>
          </Container>

          <Button
            variant="danger"
            size="small"
            onPress={() => handleDeleteEntry(index)}
            label="Delete"
            style={styles.deleteButton}
          />
        </Container>
      </Card>
    );
  };

  return (
    <Container style={styles.screen}>
      <Section style={styles.header}>
        <Text size="4xl" weight="bold">
          Workout History
        </Text>
      </Section>

      {error && (
        <Section style={styles.errorSection}>
          <Text size="sm" color="danger">
            {error}
          </Text>
        </Section>
      )}

      {isLoading ? (
        <Section style={styles.centerSection}>
          <Text size="lg" color="secondary">
            Loading history...
          </Text>
        </Section>
      ) : history.length === 0 ? (
        <Section style={styles.emptySection}>
          <Text size="lg" color="secondary" style={styles.emptyText}>
            No workout history yet
          </Text>
          <Text size="sm" color="muted">
            Complete a workout to see it here
          </Text>
        </Section>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={true}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Button
        variant="secondary"
        size="medium"
        onPress={onNavigateBack}
        label="Back to Setup"
        fullWidth
        style={styles.backButton}
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
  errorSection: {
    marginBottom: spacing.md,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
  },
  list: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingHorizontal: 0,
  },
  historyCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  historyContent: {
    gap: spacing.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgSecondary,
  },
  configDetails: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  deleteButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  backButton: {
    marginTop: spacing.lg,
  },
});
