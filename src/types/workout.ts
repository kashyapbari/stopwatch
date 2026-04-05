/**
 * Type definitions for the workout application
 */

// Workout configuration parameters
export interface WorkoutConfig {
  secondsPerRep: number; // 1-300 seconds of work per rep
  restBetweenReps: number; // 0-300 seconds of rest between reps
  repsPerSet: number; // 1-50 reps per set
  numberOfSets: number; // 1-50 total sets
  restBetweenSets: number; // 0-600 seconds of rest between sets
}

// Workout state during active workout
export interface WorkoutState {
  isActive: boolean;
  isPaused: boolean;
  elapsedTime: number; // milliseconds since workout start
  startTime: number | null; // timestamp when workout started
  pausedTime: number | null; // timestamp when paused
  pausedDuration: number; // total milliseconds paused
  currentSet: number; // 1-based set index
  currentRep: number; // 1-based rep index
  phase: WorkoutPhase;
  phaseStartTime: number | null; // timestamp when phase started
  lastToneTime: number; // last time a tone was played (ms elapsed)
}

// Workout phase types
export type WorkoutPhase = 'idle' | 'countdown' | 'working' | 'resting' | 'set-rest';

// Preset (saved workout configuration)
export interface Preset {
  id: string; // Format: "30s-15s-5r-3s-60rs"
  secondsPerRep: number;
  restBetweenReps: number;
  repsPerSet: number;
  numberOfSets: number;
  restBetweenSets: number;
  createdAt: number; // timestamp
  lastUsedAt?: number; // timestamp
}

// Workout history entry
export interface WorkoutHistoryEntry {
  id: number; // timestamp
  presetId: string;
  secondsPerRep: number;
  restBetweenReps: number;
  repsPerSet: number;
  numberOfSets: number;
  restBetweenSets: number;
  duration: number; // milliseconds
  completedAt: string; // ISO string
  totalReps: number;
  totalSets: number;
}
