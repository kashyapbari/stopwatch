/**
 * Central export for business logic
 */

export { WorkoutEngine, workoutEngine } from './WorkoutEngine';
export type { WorkoutCallback, PhaseChangeCallback } from './WorkoutEngine';

export {
  generatePresetId,
  parsePresetId,
  formatTime,
  formatDuration,
  validateWorkoutConfig,
  calculateTotalDuration,
  formatDate,
} from './utilities';
