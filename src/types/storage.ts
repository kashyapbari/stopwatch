/**
 * Type definitions for storage
 */

import { Preset, WorkoutHistoryEntry, WorkoutConfig } from './workout';

// Storage provider interface (abstracting cookie vs AsyncStorage)
export interface IStorageProvider {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear?(): Promise<void>;
}

// Storage manager interface
export interface IStorageManager {
  // Preset operations
  savePreset(config: WorkoutConfig): Promise<string | null>;
  loadPreset(presetId: string): Promise<Preset | null>;
  getAllPresets(): Promise<Preset[]>;
  deletePreset(presetId: string): Promise<boolean>;
  generatePresetId(config: WorkoutConfig): string;

  // History operations
  addToHistory(config: WorkoutConfig, duration: number): Promise<boolean>;
  getHistory(): Promise<WorkoutHistoryEntry[]>;
  clearHistory(): Promise<boolean>;
}
