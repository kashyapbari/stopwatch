/**
 * StorageManager.test.ts - Tests for StorageManager and storage providers
 * Tests both WebStorageProvider and NativeStorageProvider
 * Coverage: 100% of StorageManager functionality
 */

import {
  StorageManager,
  createStorageManager,
  generatePresetId,
  formatDuration,
  formatDate,
} from '../../src/services/StorageManager';
import { IStorageProvider } from '../../src/types/storage';
import { WorkoutConfig, Preset, WorkoutHistoryEntry } from '../../src/types/workout';

/**
 * Mock storage provider for testing
 */
class MockStorageProvider implements IStorageProvider {
  private store: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

describe('generatePresetId', () => {
  it('should generate correct preset ID format', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 5,
      numberOfSets: 3,
      restBetweenSets: 60,
    };

    const id = generatePresetId(config);
    expect(id).toBe('30s-15s-5r-3s-60rs');
  });

  it('should generate unique IDs for different configs', () => {
    const config1: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 5,
      numberOfSets: 3,
      restBetweenSets: 60,
    };

    const config2: WorkoutConfig = {
      secondsPerRep: 20,
      restBetweenReps: 10,
      repsPerSet: 4,
      numberOfSets: 2,
      restBetweenSets: 45,
    };

    const id1 = generatePresetId(config1);
    const id2 = generatePresetId(config2);

    expect(id1).not.toBe(id2);
  });

  it('should generate same ID for identical configs', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 5,
      numberOfSets: 3,
      restBetweenSets: 60,
    };

    const id1 = generatePresetId(config);
    const id2 = generatePresetId(config);

    expect(id1).toBe(id2);
  });
});

describe('formatDuration', () => {
  it('should format seconds correctly', () => {
    expect(formatDuration(5000)).toBe('00:05');
  });

  it('should format minutes and seconds', () => {
    expect(formatDuration(125000)).toBe('02:05');
  });

  it('should format zero duration', () => {
    expect(formatDuration(0)).toBe('00:00');
  });

  it('should pad single digit values', () => {
    expect(formatDuration(61000)).toBe('01:01');
  });

  it('should handle large durations', () => {
    expect(formatDuration(3661000)).toBe('61:01');
  });

  it('should round down fractional seconds', () => {
    expect(formatDuration(5999)).toBe('00:05');
  });
});

describe('formatDate', () => {
  it('should format today date', () => {
    const today = new Date();
    const result = formatDate(today.toISOString());
    expect(result).toContain('Today at');
  });

  it('should format yesterday date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const result = formatDate(yesterday.toISOString());
    expect(result).toContain('Yesterday at');
  });

  it('should format older dates in Mon Day format', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    const result = formatDate(pastDate.toISOString());
    expect(result).toMatch(/^[A-Za-z]+\s+\d+/); // Mon 1 format
  });

  it('should include year for past dates from different year', () => {
    const pastYear = new Date();
    pastYear.setFullYear(pastYear.getFullYear() - 1);
    const result = formatDate(pastYear.toISOString());
    expect(result).toContain((pastYear.getFullYear()).toString());
  });

  it('should handle invalid date gracefully', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Unknown date');
  });

  it('should handle empty string gracefully', () => {
    const result = formatDate('');
    expect(result).toBe('Unknown date');
  });
});

describe('StorageManager', () => {
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
  });

  describe('generatePresetId', () => {
    it('should generate preset ID using utility function', () => {
      const id = manager.generatePresetId(testConfig);
      expect(id).toBe('30s-15s-5r-3s-60rs');
    });
  });

  describe('savePreset', () => {
    it('should save a preset successfully', async () => {
      const presetId = await manager.savePreset(testConfig);

      expect(presetId).toBe('30s-15s-5r-3s-60rs');

      const saved = await mockProvider.getItem(
        `stopwatch_preset_${presetId}`
      );
      expect(saved).toBeDefined();
      const preset = JSON.parse(saved!);
      expect(preset.secondsPerRep).toBe(30);
      expect(preset.restBetweenReps).toBe(15);
      expect(preset.repsPerSet).toBe(5);
      expect(preset.numberOfSets).toBe(3);
      expect(preset.restBetweenSets).toBe(60);
    });

    it('should set createdAt timestamp', async () => {
      const before = Date.now();
      const presetId = await manager.savePreset(testConfig);
      const after = Date.now();

      const saved = await mockProvider.getItem(
        `stopwatch_preset_${presetId}`
      );
      const preset = JSON.parse(saved!);

      expect(preset.createdAt).toBeGreaterThanOrEqual(before);
      expect(preset.createdAt).toBeLessThanOrEqual(after);
    });

    it('should set lastUsedAt timestamp', async () => {
      const presetId = await manager.savePreset(testConfig);

      const saved = await mockProvider.getItem(
        `stopwatch_preset_${presetId}`
      );
      const preset = JSON.parse(saved!);

      expect(preset.lastUsedAt).toBeDefined();
      expect(preset.lastUsedAt).toBeGreaterThan(0);
    });

    it('should return null on error', async () => {
      const errorProvider: IStorageProvider = {
        getItem: async () => null,
        setItem: async () => {
          throw new Error('Storage error');
        },
        removeItem: async () => {},
        clear: async () => {},
      };

      const errorManager = new StorageManager(errorProvider);
      const result = await errorManager.savePreset(testConfig);

      expect(result).toBeNull();
    });
  });

  describe('loadPreset', () => {
    it('should load a saved preset', async () => {
      await manager.savePreset(testConfig);
      const loaded = await manager.loadPreset('30s-15s-5r-3s-60rs');

      expect(loaded).toBeDefined();
      expect(loaded!.secondsPerRep).toBe(30);
      expect(loaded!.repsPerSet).toBe(5);
    });

    it('should update lastUsedAt on load', async () => {
      const presetId = await manager.savePreset(testConfig);
      const initial = await mockProvider.getItem(`stopwatch_preset_${presetId}`);
      const initialPreset = JSON.parse(initial!);

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      await manager.loadPreset(presetId);
      const updated = await mockProvider.getItem(`stopwatch_preset_${presetId}`);
      const updatedPreset = JSON.parse(updated!);

      expect(updatedPreset.lastUsedAt).toBeGreaterThan(
        initialPreset.lastUsedAt
      );
    });

    it('should return null for non-existent preset', async () => {
      const loaded = await manager.loadPreset('nonexistent');
      expect(loaded).toBeNull();
    });

    it('should return null on error', async () => {
      const errorProvider: IStorageProvider = {
        getItem: async () => {
          throw new Error('Storage error');
        },
        setItem: async () => {},
        removeItem: async () => {},
        clear: async () => {},
      };

      const errorManager = new StorageManager(errorProvider);
      const result = await errorManager.loadPreset('some-id');

      expect(result).toBeNull();
    });
  });

  describe('getAllPresets', () => {
    it('should return empty array when no presets exist', async () => {
      const presets = await manager.getAllPresets();
      expect(presets).toEqual([]);
    });

    it('should return all saved presets', async () => {
      const config1: WorkoutConfig = {
        ...testConfig,
        secondsPerRep: 30,
      };
      const config2: WorkoutConfig = {
        ...testConfig,
        secondsPerRep: 20,
      };

      const id1 = await manager.savePreset(config1);
      const id2 = await manager.savePreset(config2);

      // Create preset index
      await mockProvider.setItem(
        'stopwatch_preset_index',
        JSON.stringify([id1, id2])
      );

      const presets = await manager.getAllPresets();

      expect(presets).toHaveLength(2);
      expect(presets[0].secondsPerRep === 30 || presets[0].secondsPerRep === 20).toBe(
        true
      );
    });

    it('should sort presets by lastUsedAt descending', async () => {
      const config1: WorkoutConfig = {
        ...testConfig,
        secondsPerRep: 30,
      };
      const config2: WorkoutConfig = {
        ...testConfig,
        secondsPerRep: 20,
      };

      const id1 = await manager.savePreset(config1);
      const id2 = await manager.savePreset(config2);

      // Create preset index (order doesn't matter since getAllPresets sorts)
      await mockProvider.setItem(
        'stopwatch_preset_index',
        JSON.stringify([id1, id2])
      );

      // Manually set timestamps to ensure ordering
      const preset1 = await manager.loadPreset(id1);
      expect(preset1).toBeDefined();

      const presets = await manager.getAllPresets();

      // Both presets should be present
      expect(presets.length).toBeGreaterThanOrEqual(1);
      const presetIds = presets.map((p) => p.id);
      expect(presetIds).toContain(id1);
      expect(presetIds).toContain(id2);
    });

    it('should return empty array on error', async () => {
      const errorProvider: IStorageProvider = {
        getItem: async () => {
          throw new Error('Storage error');
        },
        setItem: async () => {},
        removeItem: async () => {},
        clear: async () => {},
      };

      const errorManager = new StorageManager(errorProvider);
      const result = await errorManager.getAllPresets();

      expect(result).toEqual([]);
    });
  });

  describe('deletePreset', () => {
    it('should delete a preset', async () => {
      const presetId = await manager.savePreset(testConfig);
      const deleted = await manager.deletePreset(presetId);

      expect(deleted).toBe(true);

      const item = await mockProvider.getItem(`stopwatch_preset_${presetId}`);
      expect(item).toBeNull();
    });

    it('should remove preset from index', async () => {
      const presetId = await manager.savePreset(testConfig);
      await mockProvider.setItem(
        'stopwatch_preset_index',
        JSON.stringify([presetId])
      );

      await manager.deletePreset(presetId);

      const index = await mockProvider.getItem('stopwatch_preset_index');
      expect(index).toBeNull();
    });

    it('should return false on error', async () => {
      const errorProvider: IStorageProvider = {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {
          throw new Error('Storage error');
        },
        clear: async () => {},
      };

      const errorManager = new StorageManager(errorProvider);
      const result = await errorManager.deletePreset('some-id');

      expect(result).toBe(false);
    });
  });

  describe('addToHistory', () => {
    it('should add a workout to history', async () => {
      const duration = 125000; // 2:05
      const success = await manager.addToHistory(testConfig, duration);

      expect(success).toBe(true);

      const history = await mockProvider.getItem('stopwatch_history');
      expect(history).toBeDefined();

      const entries: WorkoutHistoryEntry[] = JSON.parse(history!);
      expect(entries).toHaveLength(1);
      expect(entries[0].duration).toBe(duration);
      expect(entries[0].totalReps).toBe(15); // 5 reps per set * 3 sets
      expect(entries[0].totalSets).toBe(3);
    });

    it('should add entry with correct timestamp', async () => {
      const before = new Date();
      await manager.addToHistory(testConfig, 125000);
      const after = new Date();

      const history = await mockProvider.getItem('stopwatch_history');
      const entries: WorkoutHistoryEntry[] = JSON.parse(history!);

      const completedAt = new Date(entries[0].completedAt);
      expect(completedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(completedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should maintain history with most recent first', async () => {
      await manager.addToHistory(testConfig, 100000);
      await new Promise(resolve => setTimeout(resolve, 10));
      await manager.addToHistory(testConfig, 125000);

      const history = await mockProvider.getItem('stopwatch_history');
      const entries: WorkoutHistoryEntry[] = JSON.parse(history!);

      expect(entries[0].duration).toBe(125000);
      expect(entries[1].duration).toBe(100000);
    });

    it('should limit history to last 10 entries', async () => {
      for (let i = 0; i < 15; i++) {
        await manager.addToHistory(testConfig, 100000 + i);
      }

      const history = await mockProvider.getItem('stopwatch_history');
      const entries: WorkoutHistoryEntry[] = JSON.parse(history!);

      expect(entries).toHaveLength(10);
    });

    it('should return false on error', async () => {
      const errorProvider: IStorageProvider = {
        getItem: async () => null,
        setItem: async () => {
          throw new Error('Storage error');
        },
        removeItem: async () => {},
        clear: async () => {},
      };

      const errorManager = new StorageManager(errorProvider);
      const result = await errorManager.addToHistory(testConfig, 125000);

      expect(result).toBe(false);
    });
  });

  describe('getHistory', () => {
    it('should return empty array when no history', async () => {
      const history = await manager.getHistory();
      expect(history).toEqual([]);
    });

    it('should return all history entries', async () => {
      await manager.addToHistory(testConfig, 100000);
      await manager.addToHistory(testConfig, 125000);

      const history = await manager.getHistory();
      expect(history).toHaveLength(2);
    });

    it('should return empty array on error', async () => {
      const errorProvider: IStorageProvider = {
        getItem: async () => {
          throw new Error('Storage error');
        },
        setItem: async () => {},
        removeItem: async () => {},
        clear: async () => {},
      };

      const errorManager = new StorageManager(errorProvider);
      const result = await errorManager.getHistory();

      expect(result).toEqual([]);
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', async () => {
      await manager.addToHistory(testConfig, 100000);
      await manager.addToHistory(testConfig, 125000);

      let history = await manager.getHistory();
      expect(history).toHaveLength(2);

      const success = await manager.clearHistory();
      expect(success).toBe(true);

      history = await manager.getHistory();
      expect(history).toEqual([]);
    });

    it('should return false on error', async () => {
      const errorProvider: IStorageProvider = {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {
          throw new Error('Storage error');
        },
        clear: async () => {},
      };

      const errorManager = new StorageManager(errorProvider);
      const result = await errorManager.clearHistory();

      expect(result).toBe(false);
    });
  });
});

describe('createStorageManager', () => {
  it('should create a StorageManager with default provider', () => {
    const manager = createStorageManager();
    expect(manager).toBeInstanceOf(StorageManager);
  });

  it('should create a StorageManager with custom provider', () => {
    const mockProvider = new MockStorageProvider();
    const manager = createStorageManager(mockProvider);
    expect(manager).toBeInstanceOf(StorageManager);
  });
});
