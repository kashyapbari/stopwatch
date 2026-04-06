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
 * WebStorageProvider - Cookie-based storage for web platform
 * Handles all cookie operations with encoding/decoding
 */
class WebStorageProvider implements IStorageProvider {
  private COOKIE_EXPIRY_DAYS = 30;

  /**
   * Set a cookie with expiration date (web only)
   */
  private setCookie(name: string, value: string, expiryDays = this.COOKIE_EXPIRY_DAYS): void {
    // Only execute in browser environment
    if (typeof document === 'undefined') return;

    const date = new Date();
    date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const path = 'path=/';
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; ${path}`;
  }

  /**
   * Get a cookie value by name (web only)
   */
  private getCookie(name: string): string | null {
    // Only execute in browser environment
    if (typeof document === 'undefined') return null;

    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Delete a cookie by name (web only)
   */
  private deleteCookie(name: string): void {
    // Only execute in browser environment
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return this.getCookie(key);
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.setCookie(key, value);
    } catch (error) {
      console.error(`Error setting item in storage: ${key}`, error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.deleteCookie(key);
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      // Only execute in browser environment
      if (typeof document === 'undefined') return;

      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        const name = cookie.split('=')[0];
        this.deleteCookie(name);
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
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
      // Since we can't enumerate cookies/storage items in a portable way,
      // we need to maintain a separate index of preset IDs
      // For now, this is a limitation - we'll need UI to manually track presets
      // or use a separate index key
      const indexData = await this.provider.getItem('stopwatch_preset_index');
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
      const indexData = await this.provider.getItem('stopwatch_preset_index');
      if (indexData) {
        let presetIds: string[] = JSON.parse(indexData);
        presetIds = presetIds.filter((id) => id !== presetId);
        if (presetIds.length > 0) {
          await this.provider.setItem('stopwatch_preset_index', JSON.stringify(presetIds));
        } else {
          await this.provider.removeItem('stopwatch_preset_index');
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
