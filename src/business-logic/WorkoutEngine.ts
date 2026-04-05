/**
 * WorkoutEngine.ts - Workout timer and state management
 * Manages the state machine for workout phases and precise 10ms timing
 *
 * Critical: Timer interval is exactly 10ms (do NOT change)
 */

import { WorkoutConfig, WorkoutState, WorkoutPhase } from '../types/workout';

// Callback types for event listeners
export type WorkoutCallback = (state: WorkoutState) => void;
export type PhaseChangeCallback = (phase: WorkoutPhase, state: WorkoutState) => void;

/**
 * WorkoutEngine - Controls all workout timing and state
 *
 * Key responsibilities:
 * - Maintain precise 10ms timer tick
 * - Track current phase (countdown, working, resting, set-rest)
 * - Calculate current rep and set
 * - Trigger tone events at phase boundaries
 * - Support pause/resume functionality
 */
export class WorkoutEngine {
  private config: WorkoutConfig | null = null;
  private state: WorkoutState = this.getInitialState();
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private onTick: WorkoutCallback[] = [];
  private onPhaseChange: PhaseChangeCallback[] = [];
  private onTone: Array<(toneName: string) => void> = [];

  constructor() {
    this.state = this.getInitialState();
  }

  /**
   * Get initial/default state
   */
  private getInitialState(): WorkoutState {
    return {
      isActive: false,
      isPaused: false,
      elapsedTime: 0,
      startTime: null,
      pausedTime: null,
      pausedDuration: 0,
      currentSet: 1,
      currentRep: 1,
      phase: 'idle',
      phaseStartTime: null,
      lastToneTime: 0,
    };
  }

  /**
   * Start a new workout with given configuration
   */
  start(config: WorkoutConfig): void {
    this.config = config;
    this.state = {
      isActive: true,
      isPaused: false,
      elapsedTime: 0,
      startTime: Date.now(),
      pausedTime: null,
      pausedDuration: 0,
      currentSet: 1,
      currentRep: 1,
      phase: 'countdown',
      phaseStartTime: Date.now(),
      lastToneTime: 0,
    };

    // Trigger countdown tone
    this.emitTone('countdown');

    // Start timer loop (10ms interval - CRITICAL)
    this.startTimer();
  }

  /**
   * Start the 10ms timer loop
   * CRITICAL: Interval must remain exactly 10ms
   */
  private startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => this.tick(), 10);
  }

  /**
   * Stop the timer loop
   */
  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Called every 10ms - main update loop
   * This is the heartbeat of the workout
   */
  private tick(): void {
    if (!this.state.isActive || this.state.isPaused) {
      return;
    }

    // Update elapsed time
    this.state.elapsedTime = Date.now() - (this.state.startTime || 0) - this.state.pausedDuration;

    // Update current phase and rep/set
    this.updatePhase();

    // Check and trigger tones at phase boundaries
    this.checkAndTriggerTones();

    // Emit tick event for UI updates
    this.emitTick();
  }

  /**
   * Pause the current workout
   */
  pause(): void {
    if (this.state.isActive && !this.state.isPaused) {
      this.state.isPaused = true;
      this.state.pausedTime = Date.now();
      this.stopTimer();
    }
  }

  /**
   * Resume from pause
   */
  resume(): void {
    if (this.state.isActive && this.state.isPaused) {
      this.state.isPaused = false;
      const pausedDuration = Date.now() - (this.state.pausedTime || 0);
      this.state.pausedDuration += pausedDuration;
      this.state.pausedTime = null;
      this.startTimer();
    }
  }

  /**
   * Reset workout to initial state
   */
  reset(): void {
    this.stopTimer();
    this.state = this.getInitialState();
  }

  /**
   * Stop the workout completely
   */
  stop(): void {
    this.stopTimer();
    this.state.isActive = false;
    this.state.phase = 'idle';
  }

  /**
   * Update phase based on elapsed time
   * Calculates current phase, rep, and set
   */
  private updatePhase(): void {
    if (!this.config) return;

    const elapsedMs = this.state.elapsedTime;

    // First 3 seconds is countdown
    if (elapsedMs < 3000) {
      this.setPhase('countdown');
      return;
    }

    // Workout time (after 3s countdown)
    const workoutTime = elapsedMs - 3000;

    const repsPerSet = this.config.repsPerSet;
    const secondsPerRep = this.config.secondsPerRep;
    const restBetweenReps = this.config.restBetweenReps;
    const numberOfSets = this.config.numberOfSets;
    const restBetweenSets = this.config.restBetweenSets;

    // Durations in milliseconds
    const workPhaseMs = secondsPerRep * 1000;
    const restPhaseMs = restBetweenReps * 1000;
    const repCycleMs = workPhaseMs + restPhaseMs;
    const setWorkMs = repsPerSet * secondsPerRep * 1000 + (repsPerSet - 1) * restBetweenReps * 1000;
    const setRestMs = restBetweenSets * 1000;
    const fullSetCycleMs = setWorkMs + setRestMs;

    // Which full set cycle are we in?
    const setNumber = Math.floor(workoutTime / fullSetCycleMs) + 1;
    const timeInSetCycle = workoutTime % fullSetCycleMs;

    this.state.currentSet = Math.min(setNumber, numberOfSets);

    // Within the set, are we in work phase or rest phase?
    if (timeInSetCycle < setWorkMs) {
      // In set work phase
      const repCycle = timeInSetCycle % repCycleMs;
      const repNumber = Math.floor(timeInSetCycle / repCycleMs) + 1;
      this.state.currentRep = Math.min(repNumber, repsPerSet);

      if (repCycle < workPhaseMs) {
        this.setPhase('working');
      } else {
        this.setPhase('resting');
      }
    } else {
      // In set rest phase
      this.setPhase('set-rest');
    }

    // Clamp set number to max and mark complete
    if (this.state.currentSet > numberOfSets) {
      this.setPhase('idle');
      this.state.isActive = false;
      this.stopTimer();
    }
  }

  /**
   * Set phase with change detection
   */
  private setPhase(newPhase: WorkoutPhase): void {
    if (this.state.phase !== newPhase) {
      this.state.phase = newPhase;
      this.emitPhaseChange(newPhase);
    }
  }

  /**
   * Check if we should trigger a tone and play it
   * Tones trigger at phase boundaries
   */
  private checkAndTriggerTones(): void {
    if (!this.config) return;

    const elapsedMs = this.state.elapsedTime;
    const phase = this.state.phase;

    // Avoid duplicate tones within 100ms
    if (elapsedMs - this.state.lastToneTime < 100) {
      return;
    }

    const repsPerSet = this.config.repsPerSet;
    const secondsPerRep = this.config.secondsPerRep;
    const restBetweenReps = this.config.restBetweenReps;
    const numberOfSets = this.config.numberOfSets;
    const restBetweenSets = this.config.restBetweenSets;

    const workPhaseMs = secondsPerRep * 1000;
    const restPhaseMs = restBetweenReps * 1000;
    const repCycleMs = workPhaseMs + restPhaseMs;
    const setWorkMs = repsPerSet * secondsPerRep * 1000 + (repsPerSet - 1) * restBetweenReps * 1000;
    const setRestMs = restBetweenSets * 1000;
    const fullSetCycleMs = setWorkMs + setRestMs;

    const workoutTime = elapsedMs - 3000;

    // Phase transitions where we need tones
    const tolerance = 50; // ms tolerance for detecting phase boundaries

    // Get the set cycle info
    const setNumber = Math.floor(workoutTime / fullSetCycleMs) + 1;
    const timeInSetCycle = workoutTime % fullSetCycleMs;

    // Check if we're at phase boundaries
    if (timeInSetCycle < setWorkMs) {
      // In set work phase
      const repCycle = timeInSetCycle % repCycleMs;
      const atWorkStart = repCycle < tolerance;
      const atWorkEnd = Math.abs(repCycle - workPhaseMs) < tolerance;

      if (atWorkStart && phase === 'working') {
        // Start of work phase - play start tone
        this.emitTone('start');
        this.state.lastToneTime = elapsedMs;
      } else if (atWorkEnd && phase === 'resting') {
        // End of work phase (start of rest) - play stop tone
        this.emitTone('stop');
        this.state.lastToneTime = elapsedMs;
      }
    } else {
      // In set rest phase
      const timeInSetRest = timeInSetCycle - setWorkMs;
      const atSetRestStart = timeInSetRest < tolerance && phase === 'set-rest';

      if (atSetRestStart) {
        // Start of set rest - play set rest tone
        this.emitTone('set-rest');
        this.state.lastToneTime = elapsedMs;
      }

      // Check for countdown before next set (3 seconds before set rest ends)
      if (setNumber < numberOfSets) {
        const timeBeforeNextSet = setRestMs - timeInSetRest;
        if (timeBeforeNextSet > 0 && timeBeforeNextSet <= 3100 && timeBeforeNextSet > 3000) {
          // About to countdown to next set
          if (elapsedMs - this.state.lastToneTime > 3100) {
            this.emitTone('countdown');
            this.state.lastToneTime = elapsedMs;
          }
        }
      }
    }
  }

  /**
   * Get formatted elapsed time (MM:SS)
   */
  getElapsedTimeFormatted(): string {
    const totalSeconds = Math.floor(this.state.elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * Get time remaining in current phase (in seconds, rounded up)
   */
  getTimeRemainingInPhase(): number {
    if (!this.config) return 0;

    const elapsedMs = this.state.elapsedTime;
    const phase = this.state.phase;

    if (phase === 'countdown') {
      const remaining = Math.max(0, 3000 - elapsedMs);
      return Math.ceil(remaining / 1000);
    }

    const workoutTime = elapsedMs - 3000;
    if (workoutTime < 0) return 3;

    const repsPerSet = this.config.repsPerSet;
    const secondsPerRep = this.config.secondsPerRep;
    const restBetweenReps = this.config.restBetweenReps;
    const restBetweenSets = this.config.restBetweenSets;

    const workPhaseMs = secondsPerRep * 1000;
    const restPhaseMs = restBetweenReps * 1000;
    const repCycleMs = workPhaseMs + restPhaseMs;
    const setWorkMs = repsPerSet * secondsPerRep * 1000 + (repsPerSet - 1) * restBetweenReps * 1000;
    const setRestMs = restBetweenSets * 1000;
    const fullSetCycleMs = setWorkMs + setRestMs;

    const timeInSetCycle = workoutTime % fullSetCycleMs;

    if (timeInSetCycle < setWorkMs) {
      const repCycle = timeInSetCycle % repCycleMs;
      if (repCycle < workPhaseMs) {
        // In work phase
        const remaining = workPhaseMs - repCycle;
        return Math.ceil(remaining / 1000);
      } else {
        // In rest phase
        const remaining = repCycleMs - repCycle;
        return Math.ceil(remaining / 1000);
      }
    } else {
      // In set rest phase
      const remaining = fullSetCycleMs - timeInSetCycle;
      return Math.ceil(remaining / 1000);
    }
  }

  /**
   * Get next phase description
   */
  getNextPhaseInfo(): string {
    const phase = this.state.phase;
    const nextTime = this.getTimeRemainingInPhase();

    if (phase === 'countdown') {
      return `Starting in ${nextTime}s`;
    } else if (phase === 'working') {
      return `Rest (${nextTime}s)`;
    } else if (phase === 'resting') {
      return `Work (${nextTime}s)`;
    } else if (phase === 'set-rest') {
      return `Next Set (${nextTime}s)`;
    }
    return 'Complete!';
  }

  /**
   * Get current status as human-readable string
   */
  getStatus(): string {
    const phase = this.state.phase;
    if (phase === 'countdown') return 'STARTING';
    if (phase === 'working') return 'WORKING';
    if (phase === 'resting') return 'RESTING';
    if (phase === 'set-rest') return 'SET REST';
    return 'COMPLETE';
  }

  /**
   * Get copy of current state
   */
  getState(): WorkoutState {
    return { ...this.state };
  }

  /**
   * Check if workout is complete
   */
  isComplete(): boolean {
    return !this.state.isActive && this.state.phase === 'idle';
  }

  /**
   * Get total workout duration estimate (in milliseconds)
   */
  getTotalDurationEstimate(): number {
    if (!this.config) return 0;

    const repsPerSet = this.config.repsPerSet;
    const secondsPerRep = this.config.secondsPerRep;
    const restBetweenReps = this.config.restBetweenReps;
    const numberOfSets = this.config.numberOfSets;
    const restBetweenSets = this.config.restBetweenSets;

    const setWork = repsPerSet * secondsPerRep + (repsPerSet - 1) * restBetweenReps;
    const totalSeconds = setWork * numberOfSets + (numberOfSets - 1) * restBetweenSets + 3; // +3 for countdown
    return totalSeconds * 1000; // Convert to milliseconds
  }

  /**
   * Register callback for tick events
   */
  onTickListener(callback: WorkoutCallback): () => void {
    this.onTick.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.onTick.indexOf(callback);
      if (index > -1) {
        this.onTick.splice(index, 1);
      }
    };
  }

  /**
   * Register callback for phase change events
   */
  onPhaseChangeListener(callback: PhaseChangeCallback): () => void {
    this.onPhaseChange.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.onPhaseChange.indexOf(callback);
      if (index > -1) {
        this.onPhaseChange.splice(index, 1);
      }
    };
  }

  /**
   * Register callback for tone events
   */
  onToneListener(callback: (toneName: string) => void): () => void {
    this.onTone.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.onTone.indexOf(callback);
      if (index > -1) {
        this.onTone.splice(index, 1);
      }
    };
  }

  /**
   * Emit tick event
   */
  private emitTick(): void {
    this.onTick.forEach((callback) => callback(this.getState()));
  }

  /**
   * Emit phase change event
   */
  private emitPhaseChange(phase: WorkoutPhase): void {
    this.onPhaseChange.forEach((callback) => callback(phase, this.getState()));
  }

  /**
   * Emit tone event
   */
  private emitTone(toneName: string): void {
    this.onTone.forEach((callback) => callback(toneName));
  }
}

// Create and export singleton instance
export const workoutEngine = new WorkoutEngine();
