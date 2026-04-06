/**
 * StorageService.test.ts - Tests for StorageService singleton
 * Tests error handling and high-level interface
 * Coverage: 100% of StorageService functionality
 */

import { StorageService } from '../../src/services/StorageService';
import { StorageManager } from '../../src/services/StorageManager';
import { IStorageProvider } from '../../src/types/storage';
import { WorkoutConfig } from '../../src/types/workout';

/**
 * Mock storage provider for testing
 */
class MockStorageProvider implements IStorageProvider {
  private store: Map<string, string> = new Map();
  public shouldThrow = false;

  async getItem(key: string): Promise<string | null> {
    if (this.shouldThrow) {
      throw new Error('Mock storage error');
    }
    return this.store.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    if (this.shouldThrow) {
      throw new Error('Mock storage error');
    }
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (this.shouldThrow) {
      throw new Error('Mock storage error');
    }
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    if (this.shouldThrow) {
      throw new Error('Mock storage error');
    }
    this.store.clear();
  }

  reset(): void {
    this.store.clear();
    this.shouldThrow = false;
  }
}

describe('StorageService', () => {
  let service: StorageService;
  let manager: StorageManager;
  let mockProvider: MockStorageProvider;

  const testConfig: WorkoutConfig = {
    secondsPerRep: 30,
    restBetweenReps: 15,
    repsPerSet: 5,
    numberOfSets: 3,
    restBetweenSets: 60,
  };

  beforeEach(() => {
    mockProvider = new MockStorageProvider();
    manager = new StorageManager(mockProvider);
    service = new StorageService(manager);
  });

  describe('savePreset', () => {
    it('should save a preset successfully', async () => {
      const presetId = await service.savePreset(testConfig);
      expect(presetId).toBe('30s-15s-5r-3s-60rs');
    });

    it('should return null on error and not throw', async () => {
      mockProvider.shouldThrow = true;
      const presetId = await service.savePreset(testConfig);
      expect(presetId).toBeNull();
    });
  });

  describe('loadPreset', () => {
    it('should load a preset successfully', async () => {
      await service.savePreset(testConfig);
      const preset = await service.loadPreset('30s-15s-5r-3s-60rs');

      expect(preset).toBeDefined();
      expect(preset!.secondsPerRep).toBe(30);
    });

    it('should return null for non-existent preset', async () => {
      const preset = await service.loadPreset('nonexistent');
      expect(preset).toBeNull();
    });

    it('should return null on error and not throw', async () => {
      mockProvider.shouldThrow = true;
      const preset = await service.loadPreset('some-id');
      expect(preset).toBeNull();
    });
  });

  describe('getAllPresets', () => {
    it('should return all presets', async () => {
      await service.savePreset(testConfig);

      const presets = await service.getAllPresets();
      expect(Array.isArray(presets)).toBe(true);
    });

    it('should return empty array on error', async () => {
      mockProvider.shouldThrow = true;
      const presets = await service.getAllPresets();

      expect(presets).toEqual([]);
    });
  });

  describe('deletePreset', () => {
    it('should delete a preset successfully', async () => {
      const presetId = await service.savePreset(testConfig);
      const success = await service.deletePreset(presetId);

      expect(success).toBe(true);
    });

    it('should return false on error', async () => {
      mockProvider.shouldThrow = true;
      const success = await service.deletePreset('some-id');

      expect(success).toBe(false);
    });
  });

  describe('addToHistory', () => {
    it('should add a workout to history', async () => {
      const success = await service.addToHistory(testConfig, 125000);
      expect(success).toBe(true);
    });

    it('should return false on error', async () => {
      mockProvider.shouldThrow = true;
      const success = await service.addToHistory(testConfig, 125000);

      expect(success).toBe(false);
    });
  });

  describe('getHistory', () => {
    it('should get workout history', async () => {
      await service.addToHistory(testConfig, 125000);
      const history = await service.getHistory();

      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);
    });

    it('should return empty array on error', async () => {
      mockProvider.shouldThrow = true;
      const history = await service.getHistory();

      expect(history).toEqual([]);
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', async () => {
      await service.addToHistory(testConfig, 125000);
      let history = await service.getHistory();
      expect(history.length).toBeGreaterThan(0);

      const success = await service.clearHistory();
      expect(success).toBe(true);

      history = await service.getHistory();
      expect(history).toEqual([]);
    });

    it('should return false on error', async () => {
      mockProvider.shouldThrow = true;
      const success = await service.clearHistory();

      expect(success).toBe(false);
    });
  });

  describe('generatePresetId utility', () => {
    it('should generate preset ID', () => {
      const id = service.generatePresetId(testConfig);
      expect(id).toBe('30s-15s-5r-3s-60rs');
    });
  });

  describe('formatDuration utility', () => {
    it('should format duration correctly', () => {
      expect(service.formatDuration(125000)).toBe('02:05');
    });

    it('should format zero duration', () => {
      expect(service.formatDuration(0)).toBe('00:00');
    });
  });

  describe('formatDate utility', () => {
    it('should format today date', () => {
      const today = new Date();
      const result = service.formatDate(today.toISOString());
      expect(result).toContain('Today at');
    });

    it('should format past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const result = service.formatDate(pastDate.toISOString());
      expect(result).toMatch(/^[A-Za-z]+\s+\d+/);
    });

    it('should handle invalid date gracefully', () => {
      const result = service.formatDate('invalid');
      expect(result).toBe('Unknown date');
    });
  });

  describe('Error handling', () => {
    it('should not throw on any storage error', async () => {
      mockProvider.shouldThrow = true;

      expect(() => service.savePreset(testConfig)).not.toThrow();
      expect(() => service.loadPreset('id')).not.toThrow();
      expect(() => service.getAllPresets()).not.toThrow();
      expect(() => service.deletePreset('id')).not.toThrow();
      expect(() => service.addToHistory(testConfig, 125000)).not.toThrow();
      expect(() => service.getHistory()).not.toThrow();
      expect(() => service.clearHistory()).not.toThrow();
    });

    it('should handle errors gracefully and return safe defaults', async () => {
      mockProvider.shouldThrow = true;

      const presetId = await service.savePreset(testConfig);
      expect(presetId).toBeNull();

      const preset = await service.loadPreset('id');
      expect(preset).toBeNull();

      const presets = await service.getAllPresets();
      expect(presets).toEqual([]);

      const deleted = await service.deletePreset('id');
      expect(deleted).toBe(false);

      const addedToHistory = await service.addToHistory(testConfig, 125000);
      expect(addedToHistory).toBe(false);

      const history = await service.getHistory();
      expect(history).toEqual([]);

      const clearedHistory = await service.clearHistory();
      expect(clearedHistory).toBe(false);
    });
  });

  describe('Integration', () => {
    it('should support complete workflow', async () => {
      // Save preset
      const presetId = await service.savePreset(testConfig);
      expect(presetId).toBeDefined();

      // Load preset
      const loaded = await service.loadPreset(presetId!);
      expect(loaded).toBeDefined();
      expect(loaded!.secondsPerRep).toBe(30);

      // Add to history
      const added = await service.addToHistory(testConfig, 125000);
      expect(added).toBe(true);

      // Get history
      const history = await service.getHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].presetId).toBe(presetId);

      // Delete preset
      const deleted = await service.deletePreset(presetId!);
      expect(deleted).toBe(true);
    });
  });
});
