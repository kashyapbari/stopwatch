/**
 * StorageService.ts - High-level storage interface
 * Provides a singleton instance for preset and history management
 * Handles graceful errors so failures don't crash the app
 */

import {
  StorageManager,
  createStorageManager,
  generatePresetId,
  formatDuration,
  formatDate,
} from './StorageManager';
import { WorkoutConfig, Preset, WorkoutHistoryEntry } from '../types/workout';

/**
 * StorageService - Singleton for storage operations
 * Wraps StorageManager with error handling and convenient methods
 */
class StorageService {
  private manager: StorageManager;

  constructor(manager?: StorageManager) {
    this.manager = manager || createStorageManager();
  }

  /**
   * Save a workout configuration as a preset
   * Returns the preset ID on success, null on failure
   */
  async savePreset(config: WorkoutConfig): Promise<string | null> {
    try {
      return await this.manager.savePreset(config);
    } catch (error) {
      console.error('StorageService: Failed to save preset', error);
      return null;
    }
  }

  /**
   * Load a preset by ID
   * Returns the preset on success, null on failure
   */
  async loadPreset(presetId: string): Promise<Preset | null> {
    try {
      return await this.manager.loadPreset(presetId);
    } catch (error) {
      console.error('StorageService: Failed to load preset', error);
      return null;
    }
  }

  /**
   * Get all saved presets, sorted by most recently used
   */
  async getAllPresets(): Promise<Preset[]> {
    try {
      return await this.manager.getAllPresets();
    } catch (error) {
      console.error('StorageService: Failed to get all presets', error);
      return [];
    }
  }

  /**
   * Delete a preset by ID
   */
  async deletePreset(presetId: string): Promise<boolean> {
    try {
      return await this.manager.deletePreset(presetId);
    } catch (error) {
      console.error('StorageService: Failed to delete preset', error);
      return false;
    }
  }

  /**
   * Add a completed workout to history
   */
  async addToHistory(config: WorkoutConfig, duration: number): Promise<boolean> {
    try {
      return await this.manager.addToHistory(config, duration);
    } catch (error) {
      console.error('StorageService: Failed to add to history', error);
      return false;
    }
  }

  /**
   * Get workout history
   */
  async getHistory(): Promise<WorkoutHistoryEntry[]> {
    try {
      return await this.manager.getHistory();
    } catch (error) {
      console.error('StorageService: Failed to get history', error);
      return [];
    }
  }

  /**
   * Clear all workout history
   */
  async clearHistory(): Promise<boolean> {
    try {
      return await this.manager.clearHistory();
    } catch (error) {
      console.error('StorageService: Failed to clear history', error);
      return false;
    }
  }

  /**
   * Generate a preset ID from config (utility method)
   */
  generatePresetId(config: WorkoutConfig): string {
    return generatePresetId(config);
  }

  /**
   * Format duration in milliseconds to MM:SS (utility method)
   */
  formatDuration(milliseconds: number): string {
    return formatDuration(milliseconds);
  }

  /**
   * Format ISO date string for display (utility method)
   */
  formatDate(isoString: string): string {
    return formatDate(isoString);
  }
}

// Create singleton instance
export const storageService = new StorageService();

// Export for testing/dependency injection
export { StorageService };
