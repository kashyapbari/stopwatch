/**
 * Type definitions for the Stopwatch application
 */

export interface StopwatchState {
  isRunning: boolean;
  elapsedTime: number;
  laps: number[];
}

export interface TimerState {
  displayTime: string;
  isActive: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  vibrationsEnabled: boolean;
}
