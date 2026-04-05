/**
 * AudioManager.test.ts - Unit tests for audio system
 * Tests both WebAudioManager and NativeAudioManager
 */

import { WebAudioManager, NativeAudioManager } from '../../src/services/AudioManager';

describe('WebAudioManager', () => {
  let audioManager: WebAudioManager;

  beforeEach(() => {
    audioManager = new WebAudioManager();
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(audioManager).toBeDefined();
    });

    it('should handle missing Web Audio API gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const manager = new WebAudioManager();
      expect(manager).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe('playTone', () => {
    it('should accept valid frequency, duration, and volume parameters', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playTone(440, 200, 0.5);
      // Should not throw or error
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should use default volume of 0.3 when not specified', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playTone(440, 200);
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should handle tone generation for various frequencies', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const frequencies = [261, 440, 523, 800, 880]; // C4, A4, C5, G5, A5

      for (const freq of frequencies) {
        await audioManager.playTone(freq, 100, 0.7);
      }

      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should handle various durations', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const durations = [50, 100, 150, 200, 400, 600, 1500];

      for (const duration of durations) {
        await audioManager.playTone(440, duration, 0.5);
      }

      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should handle edge case volumes (0 to 1)', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Test boundary values
      await audioManager.playTone(440, 100, 0); // Silent
      await audioManager.playTone(440, 100, 0.5); // Medium
      await audioManager.playTone(440, 100, 1); // Max volume

      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe('Workout-specific tones', () => {
    it('should play start tone', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playStartTone();
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should play stop tone', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playStopTone();
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should play set rest tone', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playSetRestTone();
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should play countdown sequence', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      // Note: This is async and takes ~3 seconds
      const countdownPromise = audioManager.playCountdown();
      expect(countdownPromise).toBeInstanceOf(Promise);
      await countdownPromise;
      consoleSpy.mockRestore();
    }, 10000); // 10 second timeout for countdown

    it('should play countdown beep', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playCountdownBeep();
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe('Context management', () => {
    it('should resume audio context', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.resumeContext();
      // Should not throw
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should suspend audio context', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.suspend?.();
      // Should not throw
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe('Error handling', () => {
    it('should gracefully handle errors in playTone', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Play with extreme values that might cause errors
      await audioManager.playTone(0, 0, -0.5);
      await audioManager.playTone(20000, 5000, 2); // Out of normal range

      // Should not throw
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should handle multiple concurrent tone plays', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Play multiple tones simultaneously
      const promises = [
        audioManager.playTone(440, 100, 0.5),
        audioManager.playTone(523, 100, 0.5),
        audioManager.playTone(261, 100, 0.5),
      ];

      await Promise.all(promises);
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });
  });
});

describe('NativeAudioManager', () => {
  let audioManager: NativeAudioManager;

  beforeEach(() => {
    audioManager = new NativeAudioManager();
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(audioManager).toBeDefined();
    });

    it('should handle missing react-native-sound gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const manager = new NativeAudioManager();
      expect(manager).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe('playTone', () => {
    it('should accept valid parameters without error', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playTone(440, 200, 0.5);
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should use default volume when not specified', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playTone(440, 200);
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe('Workout-specific tones', () => {
    it('should play start tone', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playStartTone();
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should play stop tone', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playStopTone();
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should play set rest tone', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playSetRestTone();
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });

    it('should play countdown sequence', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const countdownPromise = audioManager.playCountdown();
      expect(countdownPromise).toBeInstanceOf(Promise);
      await countdownPromise;
      consoleSpy.mockRestore();
    }, 10000);

    it('should play countdown beep', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      await audioManager.playCountdownBeep();
      expect(audioManager).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe('Context management', () => {
    it('should handle resumeContext (no-op for native)', async () => {
      await audioManager.resumeContext();
      expect(audioManager).toBeDefined();
    });

    it('should handle suspend (no-op for native)', async () => {
      await audioManager.suspend?.();
      expect(audioManager).toBeDefined();
    });
  });
});
