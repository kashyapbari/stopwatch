/**
 * Utility functions for workout configuration and formatting
 */

import { WorkoutConfig } from '../types/workout';

/**
 * Generate a preset ID from workout config
 * Format: {workSeconds}s-{restRepsSeconds}s-{reps}r-{sets}s-{restSetsSeconds}rs
 * Example: 30s-15s-5r-3s-60rs
 */
export function generatePresetId(config: WorkoutConfig): string {
  return `${config.secondsPerRep}s-${config.restBetweenReps}s-${config.repsPerSet}r-${config.numberOfSets}s-${config.restBetweenSets}rs`;
}

/**
 * Parse a preset ID back into configuration parameters
 * Returns null if ID format is invalid
 */
export function parsePresetId(presetId: string): Partial<WorkoutConfig> | null {
  try {
    const regex = /^(\d+)s-(\d+)s-(\d+)r-(\d+)s-(\d+)rs$/;
    const match = presetId.match(regex);

    if (!match) {
      return null;
    }

    return {
      secondsPerRep: parseInt(match[1], 10),
      restBetweenReps: parseInt(match[2], 10),
      repsPerSet: parseInt(match[3], 10),
      numberOfSets: parseInt(match[4], 10),
      restBetweenSets: parseInt(match[5], 10),
    };
  } catch (error) {
    console.error('Error parsing preset ID:', error);
    return null;
  }
}

/**
 * Format elapsed time from milliseconds to MM:SS
 * Example: 65000 ms => "01:05"
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format duration from milliseconds to MM:SS
 * Same as formatTime - alias for clarity
 */
export function formatDuration(milliseconds: number): string {
  return formatTime(milliseconds);
}

/**
 * Validate workout configuration
 * Returns validation errors, empty array if valid
 */
export function validateWorkoutConfig(config: Partial<WorkoutConfig>): string[] {
  const errors: string[] = [];

  if (
    config.secondsPerRep === undefined ||
    config.secondsPerRep < 1 ||
    config.secondsPerRep > 300
  ) {
    errors.push('Work per rep must be between 1-300 seconds');
  }

  if (
    config.restBetweenReps === undefined ||
    config.restBetweenReps < 0 ||
    config.restBetweenReps > 300
  ) {
    errors.push('Rest between reps must be between 0-300 seconds');
  }

  if (config.repsPerSet === undefined || config.repsPerSet < 1 || config.repsPerSet > 50) {
    errors.push('Reps per set must be between 1-50');
  }

  if (config.numberOfSets === undefined || config.numberOfSets < 1 || config.numberOfSets > 50) {
    errors.push('Number of sets must be between 1-50');
  }

  if (
    config.restBetweenSets === undefined ||
    config.restBetweenSets < 0 ||
    config.restBetweenSets > 600
  ) {
    errors.push('Rest between sets must be between 0-600 seconds');
  }

  return errors;
}

/**
 * Calculate total workout duration in milliseconds
 * Formula: (repsPerSet * secondsPerRep + (repsPerSet - 1) * restBetweenReps) * numberOfSets + (numberOfSets - 1) * restBetweenSets + 3 (countdown)
 */
export function calculateTotalDuration(config: WorkoutConfig): number {
  const setWork =
    config.repsPerSet * config.secondsPerRep + (config.repsPerSet - 1) * config.restBetweenReps;
  const totalSeconds =
    setWork * config.numberOfSets + (config.numberOfSets - 1) * config.restBetweenSets + 3; // +3 for countdown
  return totalSeconds * 1000; // Convert to milliseconds
}

/**
 * Format date from ISO string to readable format
 * "Today at 3:30 PM", "Yesterday at 5:15 AM", or "Mar 15"
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);

    // Check if date is invalid
    if (isNaN(date.getTime())) {
      return 'Unknown date';
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
}
