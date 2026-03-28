/**
 * workout.js - Workout engine and timer logic
 * Manages the state machine for workout phases and timing
 */

class WorkoutEngine {
  constructor() {
    this.config = null;
    this.state = {
      isActive: false,
      isPaused: false,
      elapsedTime: 0, // milliseconds
      startTime: null,
      pausedTime: null,
      pausedDuration: 0,
      currentSet: 1,
      currentRep: 1,
      phase: 'idle', // 'idle', 'countdown', 'working', 'resting', 'set-rest'
      phaseStartTime: null,
      lastToneTime: 0 // Track last tone to avoid duplicates
    };
    this.timerInterval = null;
  }

  /**
   * Start a new workout with given config
   */
  start(config) {
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
      lastToneTime: 0
    };

    // Start countdown immediately
    audioManager.resumeContext();
    audioManager.playCountdown();

    // Start timer loop
    this.startTimer();
  }

  /**
   * Start the 10ms timer loop
   */
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 10);
  }

  /**
   * Stop the timer loop
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Called every 10ms - main update loop
   */
  tick() {
    if (!this.state.isActive || this.state.isPaused) return;

    // Update elapsed time
    this.state.elapsedTime = Date.now() - this.state.startTime - this.state.pausedDuration;

    // Update current phase and rep/set
    this.updatePhase();

    // Check and trigger tones
    this.checkAndTriggerTones();
  }

  /**
   * Pause the workout
   */
  pause() {
    if (this.state.isActive && !this.state.isPaused) {
      this.state.isPaused = true;
      this.state.pausedTime = Date.now();
      this.stopTimer();
    }
  }

  /**
   * Resume from pause
   */
  resume() {
    if (this.state.isActive && this.state.isPaused) {
      this.state.isPaused = false;
      const pausedDuration = Date.now() - this.state.pausedTime;
      this.state.pausedDuration += pausedDuration;
      this.state.pausedTime = null;
      this.startTimer();
    }
  }

  /**
   * Reset the workout
   */
  reset() {
    this.stopTimer();
    this.state = {
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
      lastToneTime: 0
    };
  }

  /**
   * Stop the workout completely
   */
  stop() {
    this.stopTimer();
    this.state.isActive = false;
  }

  /**
   * Calculate current phase based on elapsed time
   */
  updatePhase() {
    const elapsedMs = this.state.elapsedTime;

    // First 3 seconds is countdown
    if (elapsedMs < 3000) {
      this.state.phase = 'countdown';
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
        this.state.phase = 'working';
      } else {
        this.state.phase = 'resting';
      }
    } else {
      // In set rest phase
      this.state.phase = 'set-rest';
      // Rep counter doesn't change in set rest
    }

    // Clamp set number to max
    if (this.state.currentSet > numberOfSets) {
      this.state.phase = 'idle';
      this.state.isActive = false;
      this.stopTimer();
    }
  }

  /**
   * Check if we should trigger a tone and play it
   */
  checkAndTriggerTones() {
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
        audioManager.playStartTone();
        this.state.lastToneTime = elapsedMs;
      } else if (atWorkEnd && phase === 'resting') {
        // End of work phase (start of rest) - play stop tone
        audioManager.playStopTone();
        this.state.lastToneTime = elapsedMs;
      }
    } else {
      // In set rest phase
      const timeInSetRest = timeInSetCycle - setWorkMs;
      const atSetRestStart = timeInSetRest < tolerance && phase === 'set-rest';

      if (atSetRestStart) {
        // Start of set rest - play stop tone
        audioManager.playSetRestTone();
        this.state.lastToneTime = elapsedMs;
      }

      // Check for countdown before next set (3 seconds before set rest ends)
      if (setNumber < numberOfSets) {
        const timeBeforeNextSet = setRestMs - timeInSetRest;
        if (
          timeBeforeNextSet > 0 &&
          timeBeforeNextSet <= 3100 &&
          timeBeforeNextSet > 3000
        ) {
          // About to countdown to next set
          if (elapsedMs - this.state.lastToneTime > 3100) {
            audioManager.playCountdown();
            this.state.lastToneTime = elapsedMs;
          }
        }
      }
    }
  }

  /**
   * Get formatted elapsed time (MM:SS)
   */
  getElapsedTimeFormatted() {
    const totalSeconds = Math.floor(this.state.elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  /**
   * Get time remaining in current phase
   */
  getTimeRemainingInPhase() {
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
    const numberOfSets = this.config.numberOfSets;
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
   * Get next phase info
   */
  getNextPhaseInfo() {
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
   * Get current status string
   */
  getStatus() {
    const phase = this.state.phase;
    if (phase === 'countdown') return 'STARTING';
    if (phase === 'working') return 'WORKING';
    if (phase === 'resting') return 'RESTING';
    if (phase === 'set-rest') return 'SET REST';
    return 'COMPLETE';
  }

  /**
   * Get state object for UI
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Check if workout is complete
   */
  isComplete() {
    return !this.state.isActive && this.state.phase === 'idle';
  }

  /**
   * Get total workout duration estimate
   */
  getTotalDurationEstimate() {
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
}

// Create global instance
const workoutEngine = new WorkoutEngine();
