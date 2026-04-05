/**
 * Unit tests for WorkoutEngine
 */

import { WorkoutEngine, workoutEngine } from '../../src/business-logic/WorkoutEngine';
import { WorkoutConfig } from '../../src/types/workout';

describe('WorkoutEngine', () => {
  let engine: WorkoutEngine;

  beforeEach(() => {
    // Create fresh engine for each test
    engine = new WorkoutEngine();
    jest.useFakeTimers();
  });

  afterEach(() => {
    engine.stop();
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with idle state', () => {
      const state = engine.getState();
      expect(state.isActive).toBe(false);
      expect(state.phase).toBe('idle');
      expect(state.elapsedTime).toBe(0);
    });

    it('should start as incomplete', () => {
      expect(engine.isComplete()).toBe(true);
    });
  });

  describe('start workout', () => {
    const defaultConfig: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 2,
      numberOfSets: 1,
      restBetweenSets: 0
    };

    it('should initialize state correctly on start', () => {
      engine.start(defaultConfig);
      const state = engine.getState();

      expect(state.isActive).toBe(true);
      expect(state.isPaused).toBe(false);
      expect(state.phase).toBe('countdown');
      expect(state.currentSet).toBe(1);
      expect(state.currentRep).toBe(1);
      expect(state.elapsedTime).toBe(0);
    });

    it('should not be complete when active', () => {
      engine.start(defaultConfig);
      expect(engine.isComplete()).toBe(false);
    });

    it('should trigger countdown tone on start', () => {
      const toneSpy = jest.fn();
      engine.onToneListener(toneSpy);

      engine.start(defaultConfig);
      expect(toneSpy).toHaveBeenCalledWith('countdown');
    });
  });

  describe('timer tick', () => {
    const defaultConfig: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 2,
      numberOfSets: 1,
      restBetweenSets: 0
    };

    it('should update elapsed time on tick', () => {
      engine.start(defaultConfig);

      jest.advanceTimersByTime(10);
      let state = engine.getState();
      expect(state.elapsedTime).toBeGreaterThan(0);

      jest.advanceTimersByTime(100);
      state = engine.getState();
      expect(state.elapsedTime).toBeGreaterThan(100);
    });

    it('should emit tick event on each update', () => {
      const tickSpy = jest.fn();
      engine.onTickListener(tickSpy);

      engine.start(defaultConfig);

      jest.advanceTimersByTime(30);
      expect(tickSpy).toHaveBeenCalled();
    });

    it('should not update when paused', () => {
      engine.start(defaultConfig);

      jest.advanceTimersByTime(100);
      const pausedState = engine.getState();
      const pausedElapsedTime = pausedState.elapsedTime;

      engine.pause();
      jest.advanceTimersByTime(100);

      const stillPausedState = engine.getState();
      expect(stillPausedState.elapsedTime).toBe(pausedElapsedTime);
    });
  });

  describe('phase transitions', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 1, // 1 second work for faster testing
      restBetweenReps: 1, // 1 second rest
      repsPerSet: 1,
      numberOfSets: 1,
      restBetweenSets: 0
    };

    it('should start in countdown phase', () => {
      engine.start(config);
      expect(engine.getState().phase).toBe('countdown');
    });

    it('should transition from countdown to working', () => {
      engine.start(config);

      // After 3 seconds, should be in working phase
      jest.advanceTimersByTime(3100);
      expect(engine.getState().phase).toBe('working');
    });

    it('should emit phase change event', () => {
      const phaseChangeSpy = jest.fn();
      engine.onPhaseChangeListener(phaseChangeSpy);

      engine.start(config);
      jest.advanceTimersByTime(3100);

      expect(phaseChangeSpy).toHaveBeenCalledWith('working', expect.any(Object));
    });

    it('should not emit same phase twice', () => {
      const phaseChangeSpy = jest.fn();
      engine.onPhaseChangeListener(phaseChangeSpy);

      engine.start(config);
      jest.advanceTimersByTime(3100);
      const firstCallCount = phaseChangeSpy.mock.calls.length;

      // Advance time more but stay in working phase
      jest.advanceTimersByTime(200);
      const secondCallCount = phaseChangeSpy.mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount); // No new phase change
    });
  });

  describe('pause and resume', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 1,
      numberOfSets: 1,
      restBetweenSets: 0
    };

    it('should pause the workout', () => {
      engine.start(config);
      jest.advanceTimersByTime(1000);

      engine.pause();
      const pausedState = engine.getState();

      expect(pausedState.isPaused).toBe(true);
    });

    it('should not update time while paused', () => {
      engine.start(config);
      jest.advanceTimersByTime(1000);

      engine.pause();
      const pausedElapsedTime = engine.getState().elapsedTime;

      jest.advanceTimersByTime(1000);
      const stillPausedElapsedTime = engine.getState().elapsedTime;

      expect(stillPausedElapsedTime).toBe(pausedElapsedTime);
    });

    it('should resume from pause', () => {
      engine.start(config);
      jest.advanceTimersByTime(1000);

      engine.pause();
      const pausedElapsedTime = engine.getState().elapsedTime;

      engine.resume();
      jest.advanceTimersByTime(500);

      const resumedElapsedTime = engine.getState().elapsedTime;
      expect(resumedElapsedTime).toBeGreaterThan(pausedElapsedTime);
    });

    it('should accumulate pause time correctly', () => {
      engine.start(config);
      jest.advanceTimersByTime(1000);

      engine.pause();
      jest.advanceTimersByTime(500); // Time while paused

      engine.resume();
      jest.advanceTimersByTime(500);

      // Total elapsed should be ~2000 (1000 + 500), not 2000
      const state = engine.getState();
      expect(state.elapsedTime).toBeGreaterThan(1400);
      expect(state.elapsedTime).toBeLessThan(1700);
    });
  });

  describe('reset', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 1,
      numberOfSets: 1,
      restBetweenSets: 0
    };

    it('should reset to initial state', () => {
      engine.start(config);
      jest.advanceTimersByTime(1000);

      engine.reset();

      const state = engine.getState();
      expect(state.isActive).toBe(false);
      expect(state.elapsedTime).toBe(0);
      expect(state.phase).toBe('idle');
    });

    it('should not emit events after reset', () => {
      engine.start(config);
      jest.advanceTimersByTime(100);

      engine.reset();

      const tickSpy = jest.fn();
      engine.onTickListener(tickSpy);

      jest.advanceTimersByTime(100);
      expect(tickSpy).not.toHaveBeenCalled();
    });
  });

  describe('formatting', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 1,
      numberOfSets: 1,
      restBetweenSets: 0
    };

    it('should format elapsed time correctly', () => {
      engine.start(config);

      jest.advanceTimersByTime(3500);
      expect(engine.getElapsedTimeFormatted()).toBe('00:03');

      jest.advanceTimersByTime(60000);
      expect(engine.getElapsedTimeFormatted()).toBe('01:03');
    });

    it('should return status string', () => {
      engine.start(config);

      expect(engine.getStatus()).toBe('STARTING');

      jest.advanceTimersByTime(3500);
      expect(engine.getStatus()).toBe('WORKING');
    });

    it('should return next phase info', () => {
      engine.start(config);

      const nextInfo = engine.getNextPhaseInfo();
      expect(nextInfo).toContain('Starting in');
    });
  });

  describe('tone triggering', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 1, // Short durations for testing
      restBetweenReps: 1,
      repsPerSet: 1,
      numberOfSets: 1,
      restBetweenSets: 0
    };

    it('should trigger start tone at work phase start', () => {
      const toneSpy = jest.fn();
      engine.onToneListener(toneSpy);

      engine.start(config);
      jest.advanceTimersByTime(3100);

      expect(toneSpy).toHaveBeenCalledWith('start');
    });

    it('should not trigger duplicate tones within 100ms', () => {
      const toneSpy = jest.fn();
      engine.onToneListener(toneSpy);

      engine.start(config);
      jest.advanceTimersByTime(3100);

      // Clear spy to check for additional calls
      toneSpy.mockClear();

      jest.advanceTimersByTime(50);
      expect(toneSpy).not.toHaveBeenCalled();
    });
  });

  describe('duration calculation', () => {
    it('should calculate duration for simple config', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 1,
        numberOfSets: 1,
        restBetweenSets: 0
      };

      engine.start(config);
      const duration = engine.getTotalDurationEstimate();

      // 30 seconds work + 3 seconds countdown = 33000 ms
      expect(duration).toBe(33000);
    });

    it('should calculate duration with multiple reps', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 10,
        restBetweenReps: 5,
        repsPerSet: 3,
        numberOfSets: 1,
        restBetweenSets: 0
      };

      engine.start(config);
      const duration = engine.getTotalDurationEstimate();

      // (10 + 5 + 10 + 5 + 10) + 3 = 43 seconds = 43000 ms
      expect(duration).toBe(43000);
    });

    it('should calculate duration with multiple sets', () => {
      const config: WorkoutConfig = {
        secondsPerRep: 10,
        restBetweenReps: 5,
        repsPerSet: 2,
        numberOfSets: 2,
        restBetweenSets: 30
      };

      engine.start(config);
      const duration = engine.getTotalDurationEstimate();

      // Set 1: (10 + 5 + 10) = 25
      // Set rest: 30
      // Set 2: (10 + 5 + 10) = 25
      // Countdown: 3
      // Total: 25 + 30 + 25 + 3 = 83 seconds = 83000 ms
      expect(duration).toBe(83000);
    });
  });

  describe('time remaining', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 3,
      restBetweenReps: 2,
      repsPerSet: 1,
      numberOfSets: 1,
      restBetweenSets: 0
    };

    it('should return time remaining in countdown', () => {
      engine.start(config);

      const remaining = engine.getTimeRemainingInPhase();
      expect(remaining).toBeLessThanOrEqual(3);
      expect(remaining).toBeGreaterThan(0);
    });

    it('should return time remaining in working phase', () => {
      engine.start(config);
      jest.advanceTimersByTime(3100); // After countdown

      const remaining = engine.getTimeRemainingInPhase();
      expect(remaining).toBeLessThanOrEqual(3);
      expect(remaining).toBeGreaterThan(0);
    });
  });

  describe('event listeners', () => {
    it('should support multiple listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      engine.onTickListener(listener1);
      engine.onTickListener(listener2);

      engine.start({
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 1,
        numberOfSets: 1,
        restBetweenSets: 0
      });

      jest.advanceTimersByTime(50);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should support unsubscribing', () => {
      const listener = jest.fn();
      const unsubscribe = engine.onTickListener(listener);

      engine.start({
        secondsPerRep: 30,
        restBetweenReps: 15,
        repsPerSet: 1,
        numberOfSets: 1,
        restBetweenSets: 0
      });

      jest.advanceTimersByTime(50);
      const firstCallCount = listener.mock.calls.length;

      unsubscribe();
      jest.advanceTimersByTime(50);

      expect(listener.mock.calls.length).toBe(firstCallCount);
    });
  });

  describe('singleton instance', () => {
    it('should export singleton instance', () => {
      expect(workoutEngine).toBeInstanceOf(WorkoutEngine);
    });
  });
});
