/**
 * Unit tests for utilities
 */

import {
  generatePresetId,
  parsePresetId,
  formatTime,
  formatDuration,
  validateWorkoutConfig,
  calculateTotalDuration,
  formatDate
} from '../../src/business-logic/utilities';
import { WorkoutConfig } from '../../src/types/workout';

describe('Utilities', () => {
  describe('generatePresetId', () => {
    it('should generate correct preset ID format', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 5,
        numberOfSets: 3,
        restBetweenSets: 60
      };

      const id = generatePresetId(config);
      expect(id).toBe('30s-15s-5r-3s-60rs');
    });

    it('should handle different configurations', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 45,
        restBetweenReps: 20,
        repsPerSet: 4,
        numberOfSets: 4,
        restBetweenSets: 90
      };

      const id = generatePresetId(config);
      expect(id).toBe('45s-20s-4r-4s-90rs');
    });

    it('should handle zero rest values', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 10,
        restBetweenReps: 0,
        repsPerSet: 1,
        numberOfSets: 1,
        restBetweenSets: 0
      };

      const id = generatePresetId(config);
      expect(id).toBe('10s-0s-1r-1s-0rs');
    });
  });

  describe('parsePresetId', () => {
    it('should parse valid preset IDs', () => {
      const parsed = parsePresetId('30s-15s-5r-3s-60rs');
      expect(parsed).toEqual({
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 5,
        numberOfSets: 3,
        restBetweenSets: 60
      });
    });

    it('should return null for invalid format', () => {
      const parsed = parsePresetId('invalid');
      expect(parsed).toBeNull();
    });

    it('should return null for incomplete preset ID', () => {
      const parsed = parsePresetId('30s-15s-5r-3s');
      expect(parsed).toBeNull();
    });

    it('should round-trip correctly', () => {
      const original: WorkoutConfig = {
        secondsPerRep: 45,
        restBetweenReps: 20,
        repsPerSet: 4,
        numberOfSets: 2,
        restBetweenSets: 90
      };

      const id = generatePresetId(original);
      const parsed = parsePresetId(id);

      expect(parsed).toEqual(original);
    });
  });

  describe('formatTime', () => {
    it('should format 0ms to 00:00', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('should format seconds correctly', () => {
      expect(formatTime(5000)).toBe('00:05');
      expect(formatTime(30000)).toBe('00:30');
      expect(formatTime(59000)).toBe('00:59');
    });

    it('should format minutes and seconds', () => {
      expect(formatTime(60000)).toBe('01:00');
      expect(formatTime(65000)).toBe('01:05');
      expect(formatTime(125000)).toBe('02:05');
    });

    it('should pad minutes with leading zero', () => {
      expect(formatTime(600000)).toBe('10:00');
    });

    it('should handle large durations', () => {
      expect(formatTime(3661000)).toBe('61:01');
    });
  });

  describe('formatDuration', () => {
    it('should be alias for formatTime', () => {
      expect(formatDuration(65000)).toBe(formatTime(65000));
      expect(formatDuration(125000)).toBe(formatTime(125000));
    });
  });

  describe('validateWorkoutConfig', () => {
    it('should accept valid configuration', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 5,
        numberOfSets: 3,
        restBetweenSets: 60
      };

      const errors = validateWorkoutConfig(config);
      expect(errors).toHaveLength(0);
    });

    it('should reject secondsPerRep < 1', () => {
      const config: Partial<WorkoutConfig> = {
        secondsPerRep: 0,
        restBetweenReps: 15,
        repsPerSet: 5,
        numberOfSets: 3,
        restBetweenSets: 60
      };

      const errors = validateWorkoutConfig(config);
      expect(errors).toContain('Work per rep must be between 1-300 seconds');
    });

    it('should reject secondsPerRep > 300', () => {
      const config: Partial<WorkoutConfig> = {
        secondsPerRep: 301,
        restBetweenReps: 15,
        repsPerSet: 5,
        numberOfSets: 3,
        restBetweenSets: 60
      };

      const errors = validateWorkoutConfig(config);
      expect(errors).toContain('Work per rep must be between 1-300 seconds');
    });

    it('should reject repsPerSet < 1', () => {
      const config: Partial<WorkoutConfig> = {
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 0,
        numberOfSets: 3,
        restBetweenSets: 60
      };

      const errors = validateWorkoutConfig(config);
      expect(errors).toContain('Reps per set must be between 1-50');
    });

    it('should reject repsPerSet > 50', () => {
      const config: Partial<WorkoutConfig> = {
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 51,
        numberOfSets: 3,
        restBetweenSets: 60
      };

      const errors = validateWorkoutConfig(config);
      expect(errors).toContain('Reps per set must be between 1-50');
    });

    it('should allow zero rest values', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 30,
        restBetweenReps: 0,
        repsPerSet: 5,
        numberOfSets: 3,
        restBetweenSets: 0
      };

      const errors = validateWorkoutConfig(config);
      expect(errors).toHaveLength(0);
    });

    it('should validate all fields independently', () => {
      const config: Partial<WorkoutConfig> = {
        secondsPerRep: 0,
        restBetweenReps: 301,
        repsPerSet: 0,
        numberOfSets: 51,
        restBetweenSets: 601
      };

      const errors = validateWorkoutConfig(config);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Work per rep must be between 1-300 seconds');
      expect(errors).toContain('Rest between reps must be between 0-300 seconds');
    });
  });

  describe('calculateTotalDuration', () => {
    it('should calculate duration for simple workout', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 1,
        numberOfSets: 1,
        restBetweenSets: 0
      };

      // 30 seconds work + 3 seconds countdown = 33 seconds = 33000 ms
      const duration = calculateTotalDuration(config);
      expect(duration).toBe(33000);
    });

    it('should calculate duration with multiple reps and rest', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 2,
        numberOfSets: 1,
        restBetweenSets: 0
      };

      // 30 + 15 + 30 = 75 seconds + 3 seconds countdown = 78 seconds = 78000 ms
      const duration = calculateTotalDuration(config);
      expect(duration).toBe(78000);
    });

    it('should calculate duration with multiple sets', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 2,
        numberOfSets: 2,
        restBetweenSets: 60
      };

      // Set 1: (30 + 15 + 30) * 2 = 75 seconds
      // Set rest: 60 seconds
      // Set 2: (30 + 15 + 30) * 2 = 75 seconds
      // Countdown: 3 seconds
      // Total: 75 + 60 + 75 + 3 = 213 seconds = 213000 ms
      const duration = calculateTotalDuration(config);
      expect(duration).toBe(213000);
    });

    it('should return 0 when config is not set', () => {
      // Note: calculateTotalDuration requires config, so it should return 3000 minimum
      const config: WorkoutConfig = {
        secondsPerRep: 0,
        restBetweenReps: 0,
        repsPerSet: 0,
        numberOfSets: 0,
        restBetweenSets: 0
      };

      const duration = calculateTotalDuration(config);
      expect(duration).toBe(3000); // Just the countdown
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock current time to get consistent results
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-04-05T15:30:00').getTime());
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format today\'s date', () => {
      const today = new Date();
      const result = formatDate(today.toISOString());
      expect(result).toContain('Today at');
    });

    it('should format yesterday\'s date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatDate(yesterday.toISOString());
      expect(result).toContain('Yesterday at');
    });

    it('should format older dates', () => {
      const pastDate = new Date('2026-03-15');
      const result = formatDate(pastDate.toISOString());
      expect(result).toContain('Mar');
      expect(result).toContain('15');
    });

    it('should handle invalid dates gracefully', () => {
      const result = formatDate('invalid');
      expect(result).toBe('Unknown date');
    });
  });
});
