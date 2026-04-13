/**
 * StorageManager.ts - Cross-platform storage system
 * Provides preset and history management with platform-specific implementations
 *
 * Web: Uses cookies for persistence
 * Native (iOS/Android): Uses AsyncStorage for persistence
 */

import { IStorageProvider, IStorageManager } from '../types/storage';
import { WorkoutConfig, Preset, WorkoutHistoryEntry } from '../types/workout';
import { Platform } from 'react-native';

/**
 * Generates a preset ID from workout configuration
 * Format: {secondsPerRep}s-{restBetweenReps}s-{repsPerSet}r-{numberOfSets}s-{restBetweenSets}rs
 * Example: 30s-15s-5r-3s-60rs
 */
export function generatePresetId(config: WorkoutConfig): string {
  return `${config.secondsPerRep}s-${config.restBetweenReps}s-${config.repsPerSet}r-${config.numberOfSets}s-${config.restBetweenSets}rs`;
}

/**
 * Formats duration from milliseconds to MM:SS format
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Formats an ISO date string for display
 * Returns "Today at HH:MM AM/PM", "Yesterday at HH:MM AM/PM", or "Mon Jan 1" format
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

/**
 * WebStorageProvider - localStorage-based storage for web platform
 * Uses modern browser localStorage API for reliable persistence
 */
class WebStorageProvider implements IStorageProvider {
  /**
   * Set an item in localStorage
   */
  private setLocalStorageItem(key: string, value: string): void {
    // Only execute in browser environment
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  }

  /**
   * Get an item from localStorage
   */
  private getLocalStorageItem(key: string): string | null {
    // Only execute in browser environment
    if (typeof localStorage === 'undefined') return null;

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   */
  private removeLocalStorageItem(key: string): void {
    // Only execute in browser environment
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  private clearLocalStorage(): void {
    // Only execute in browser environment
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  async getItem(key: string): Promise<string | null> {
    return this.getLocalStorageItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    this.setLocalStorageItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.removeLocalStorageItem(key);
  }

  async clear(): Promise<void> {
    this.clearLocalStorage();
  }
}

/**
 * NativeStorageProvider - AsyncStorage-based storage for React Native
 * Handles storage operations using React Native AsyncStorage
 */
class NativeStorageProvider implements IStorageProvider {
  private asyncStorage: any = null;

  constructor() {
    // Lazy-load AsyncStorage to avoid import errors on web
    if (Platform.OS !== 'web') {
      try {
        // Dynamic import to avoid bundling on web
        this.asyncStorage = require('@react-native-async-storage/async-storage').default;
      } catch (error) {
        console.warn('AsyncStorage not available, using in-memory storage');
      }
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (!this.asyncStorage) {
        return null;
      }
      return await this.asyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item from native storage: ${key}`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (!this.asyncStorage) {
        return;
      }
      await this.asyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item in native storage: ${key}`, error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (!this.asyncStorage) {
        return;
      }
      await this.asyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from native storage: ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (!this.asyncStorage) {
        return;
      }
      await this.asyncStorage.clear();
    } catch (error) {
      console.error('Error clearing native storage:', error);
    }
  }
}

/**
 * StorageManager - High-level storage operations
 * Implements preset and history management using a storage provider
 */
export class StorageManager implements IStorageManager {
  private provider: IStorageProvider;
  private readonly PRESET_PREFIX = 'stopwatch_preset_';
  private readonly PRESET_INDEX_KEY = 'stopwatch_preset_index';
  private readonly HISTORY_KEY = 'stopwatch_history';
  private readonly RECENT_PRESETS_LIMIT = 10;

  constructor(provider?: IStorageProvider) {
    // Use provided provider or instantiate platform-specific provider
    if (provider) {
      this.provider = provider;
    } else {
      // Determine platform and create appropriate provider
      const isWeb = Platform.OS === 'web' || typeof document !== 'undefined';
      this.provider = isWeb ? new WebStorageProvider() : new NativeStorageProvider();
    }
  }

  generatePresetId(config: WorkoutConfig): string {
    return generatePresetId(config);
  }

  async savePreset(config: WorkoutConfig): Promise<string | null> {
    try {
      const presetId = this.generatePresetId(config);
      const presetData: Preset = {
        id: presetId,
        secondsPerRep: config.secondsPerRep,
        restBetweenReps: config.restBetweenReps,
        repsPerSet: config.repsPerSet,
        numberOfSets: config.numberOfSets,
        restBetweenSets: config.restBetweenSets,
        createdAt: Date.now(),
        lastUsedAt: Date.now(),
      };

      const cookieName = this.PRESET_PREFIX + presetId;
      await this.provider.setItem(cookieName, JSON.stringify(presetData));

      // Update the preset index to include this preset ID
      const indexData = await this.provider.getItem(this.PRESET_INDEX_KEY);
      let presetIds: string[] = indexData ? JSON.parse(indexData) : [];

      // Add preset ID to index if not already present
      if (!presetIds.includes(presetId)) {
        presetIds.unshift(presetId); // Add to front for most recent
        // Keep only last 10 presets
        if (presetIds.length > this.RECENT_PRESETS_LIMIT) {
          presetIds = presetIds.slice(0, this.RECENT_PRESETS_LIMIT);
        }
        await this.provider.setItem(this.PRESET_INDEX_KEY, JSON.stringify(presetIds));
      } else {
        // Move to front if already exists (most recent)
        presetIds = presetIds.filter((id) => id !== presetId);
        presetIds.unshift(presetId);
        await this.provider.setItem(this.PRESET_INDEX_KEY, JSON.stringify(presetIds));
      }

      return presetId;
    } catch (error) {
      console.error('Error saving preset:', error);
      return null;
    }
  }

  async loadPreset(presetId: string): Promise<Preset | null> {
    try {
      const cookieName = this.PRESET_PREFIX + presetId;
      const cookieData = await this.provider.getItem(cookieName);

      if (cookieData) {
        const preset: Preset = JSON.parse(cookieData);
        // Update lastUsedAt timestamp
        preset.lastUsedAt = Date.now();
        await this.provider.setItem(cookieName, JSON.stringify(preset));
        return preset;
      }
      return null;
    } catch (error) {
      console.error('Error loading preset:', error);
      return null;
    }
  }

  async getAllPresets(): Promise<Preset[]> {
    try {
      // Retrieve the index of preset IDs
      const indexData = await this.provider.getItem(this.PRESET_INDEX_KEY);
      if (!indexData) {
        return [];
      }

      const presetIds: string[] = JSON.parse(indexData);
      const presets: Preset[] = [];

      for (const presetId of presetIds) {
        const preset = await this.loadPreset(presetId);
        if (preset) {
          presets.push(preset);
        }
      }

      // Sort by lastUsedAt (most recent first)
      presets.sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0));
      return presets;
    } catch (error) {
      console.error('Error getting all presets:', error);
      return [];
    }
  }

  async deletePreset(presetId: string): Promise<boolean> {
    try {
      const cookieName = this.PRESET_PREFIX + presetId;
      await this.provider.removeItem(cookieName);

      // Update preset index
      const indexData = await this.provider.getItem(this.PRESET_INDEX_KEY);
      if (indexData) {
        let presetIds: string[] = JSON.parse(indexData);
        presetIds = presetIds.filter((id) => id !== presetId);
        if (presetIds.length > 0) {
          await this.provider.setItem(this.PRESET_INDEX_KEY, JSON.stringify(presetIds));
        } else {
          await this.provider.removeItem(this.PRESET_INDEX_KEY);
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting preset:', error);
      return false;
    }
  }

  async addToHistory(config: WorkoutConfig, duration: number): Promise<boolean> {
    try {
      const presetId = this.generatePresetId(config);
      const history = await this.getHistory();

      const workoutEntry: WorkoutHistoryEntry = {
        id: Date.now(),
        presetId: presetId,
        secondsPerRep: config.secondsPerRep,
        restBetweenReps: config.restBetweenReps,
        repsPerSet: config.repsPerSet,
        numberOfSets: config.numberOfSets,
        restBetweenSets: config.restBetweenSets,
        duration: duration, // milliseconds
        completedAt: new Date().toISOString(),
        totalReps: config.repsPerSet * config.numberOfSets,
        totalSets: config.numberOfSets,
      };

      // Add new entry at the beginning
      history.unshift(workoutEntry);

      // Keep only last 10 entries
      if (history.length > this.RECENT_PRESETS_LIMIT) {
        history.pop();
      }

      await this.provider.setItem(this.HISTORY_KEY, JSON.stringify(history));

      // Also update preset's lastUsedAt
      const preset = await this.loadPreset(presetId);
      if (preset) {
        await this.savePreset(config);
      }

      return true;
    } catch (error) {
      console.error('Error adding to history:', error);
      return false;
    }
  }

  async getHistory(): Promise<WorkoutHistoryEntry[]> {
    try {
      const historyData = await this.provider.getItem(this.HISTORY_KEY);
      if (historyData) {
        return JSON.parse(historyData);
      }
      return [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  async clearHistory(): Promise<boolean> {
    try {
      await this.provider.removeItem(this.HISTORY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }
}

/**
 * Create a platform-aware storage manager instance
 */
export function createStorageManager(provider?: IStorageProvider): StorageManager {
  return new StorageManager(provider);
}
