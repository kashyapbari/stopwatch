/**
 * AudioService.test.ts - Unit tests for AudioService
 * Tests the high-level audio interface
 */

import { AudioService } from '../../src/services/AudioService';
import { IAudioManager } from '../../src/types/audio';

/**
 * Mock AudioManager for testing
 */
class MockAudioManager implements IAudioManager {
  playToneCalls: Array<{ frequency: number; duration: number; volume?: number }> = [];
  startToneCalls: number = 0;
  stopToneCalls: number = 0;
  setRestToneCalls: number = 0;
  countdownCalls: number = 0;
  countdownBeepCalls: number = 0;
  resumeContextCalls: number = 0;
  suspendCalls: number = 0;

  async playTone(frequency: number, duration: number, volume?: number): Promise<void> {
    this.playToneCalls.push({ frequency, duration, volume });
  }

  async playStartTone(): Promise<void> {
    this.startToneCalls++;
  }

  async playStopTone(): Promise<void> {
    this.stopToneCalls++;
  }

  async playSetRestTone(): Promise<void> {
    this.setRestToneCalls++;
  }

  async playCountdown(): Promise<void> {
    this.countdownCalls++;
  }

  async playCountdownBeep(): Promise<void> {
    this.countdownBeepCalls++;
  }

  async resumeContext(): Promise<void> {
    this.resumeContextCalls++;
  }

  async suspend(): Promise<void> {
    this.suspendCalls++;
  }

  reset(): void {
    this.playToneCalls = [];
    this.startToneCalls = 0;
    this.stopToneCalls = 0;
    this.setRestToneCalls = 0;
    this.countdownCalls = 0;
    this.countdownBeepCalls = 0;
    this.resumeContextCalls = 0;
    this.suspendCalls = 0;
  }
}

describe('AudioService', () => {
  let audioService: AudioService;
  let mockAudioManager: MockAudioManager;

  beforeEach(() => {
    mockAudioManager = new MockAudioManager();
    audioService = new AudioService(mockAudioManager);
  });

  describe('Initialization', () => {
    it('should initialize with audio enabled by default', () => {
      expect(audioService.isAudioEnabled()).toBe(true);
    });

    it('should initialize with provided audio manager', () => {
      expect(audioService).toBeDefined();
    });
  });

  describe('Audio enable/disable', () => {
    it('should allow enabling audio', () => {
      audioService.setEnabled(true);
      expect(audioService.isAudioEnabled()).toBe(true);
    });

    it('should allow disabling audio', () => {
      audioService.setEnabled(false);
      expect(audioService.isAudioEnabled()).toBe(false);
    });

    it('should toggle audio state', () => {
      audioService.setEnabled(false);
      expect(audioService.isAudioEnabled()).toBe(false);

      audioService.setEnabled(true);
      expect(audioService.isAudioEnabled()).toBe(true);
    });
  });

  describe('Workout signals', () => {
    it('should signal workout start', async () => {
      await audioService.signalWorkoutStart();
      expect(mockAudioManager.startToneCalls).toBe(1);
    });

    it('should signal workout stop', async () => {
      await audioService.signalWorkoutStop();
      expect(mockAudioManager.stopToneCalls).toBe(1);
    });

    it('should signal set rest', async () => {
      await audioService.signalSetRest();
      expect(mockAudioManager.setRestToneCalls).toBe(1);
    });

    it('should play countdown', async () => {
      await audioService.playCountdown();
      expect(mockAudioManager.countdownCalls).toBe(1);
    });
  });

  describe('Audio disabled behavior', () => {
    beforeEach(() => {
      audioService.setEnabled(false);
    });

    it('should not play start tone when disabled', async () => {
      await audioService.signalWorkoutStart();
      expect(mockAudioManager.startToneCalls).toBe(0);
    });

    it('should not play stop tone when disabled', async () => {
      await audioService.signalWorkoutStop();
      expect(mockAudioManager.stopToneCalls).toBe(0);
    });

    it('should not signal set rest when disabled', async () => {
      await audioService.signalSetRest();
      expect(mockAudioManager.setRestToneCalls).toBe(0);
    });

    it('should not play countdown when disabled', async () => {
      await audioService.playCountdown();
      expect(mockAudioManager.countdownCalls).toBe(0);
    });

    it('should still allow initialization when disabled', async () => {
      await audioService.initialize();
      // Initialize should always work regardless of enabled state
      // But with our mock, we track resumeContext calls
      expect(mockAudioManager.resumeContextCalls).toBe(1);
    });
  });

  describe('Context management', () => {
    it('should initialize audio context', async () => {
      await audioService.initialize();
      expect(mockAudioManager.resumeContextCalls).toBe(1);
    });

    it('should cleanup audio resources', async () => {
      await audioService.cleanup();
      expect(mockAudioManager.suspendCalls).toBe(1);
    });

    it('should handle multiple initializations', async () => {
      await audioService.initialize();
      await audioService.initialize();
      expect(mockAudioManager.resumeContextCalls).toBe(2);
    });
  });

  describe('Error handling', () => {
    it('should gracefully handle errors in signalWorkoutStart', async () => {
      const errorManager = new (class implements IAudioManager {
        async playTone() {
          throw new Error('Audio failed');
        }
        async playStartTone() {
          throw new Error('Audio failed');
        }
        async playStopTone() {
          throw new Error('Audio failed');
        }
        async playSetRestTone() {
          throw new Error('Audio failed');
        }
        async playCountdown() {
          throw new Error('Audio failed');
        }
        async playCountdownBeep() {
          throw new Error('Audio failed');
        }
        async resumeContext() {
          throw new Error('Audio failed');
        }
        async suspend() {
          throw new Error('Audio failed');
        }
      })();

      const service = new AudioService(errorManager);
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Should not throw
      await service.signalWorkoutStart();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should gracefully handle errors in signalWorkoutStop', async () => {
      const errorManager = new (class implements IAudioManager {
        async playTone() {
          throw new Error('Audio failed');
        }
        async playStartTone() {
          throw new Error('Audio failed');
        }
        async playStopTone() {
          throw new Error('Audio failed');
        }
        async playSetRestTone() {
          throw new Error('Audio failed');
        }
        async playCountdown() {
          throw new Error('Audio failed');
        }
        async playCountdownBeep() {
          throw new Error('Audio failed');
        }
        async resumeContext() {
          throw new Error('Audio failed');
        }
        async suspend() {
          throw new Error('Audio failed');
        }
      })();

      const service = new AudioService(errorManager);
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Should not throw
      await service.signalWorkoutStop();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should gracefully handle errors in signalSetRest', async () => {
      const errorManager = new (class implements IAudioManager {
        async playTone() {
          throw new Error('Audio failed');
        }
        async playStartTone() {
          throw new Error('Audio failed');
        }
        async playStopTone() {
          throw new Error('Audio failed');
        }
        async playSetRestTone() {
          throw new Error('Audio failed');
        }
        async playCountdown() {
          throw new Error('Audio failed');
        }
        async playCountdownBeep() {
          throw new Error('Audio failed');
        }
        async resumeContext() {
          throw new Error('Audio failed');
        }
        async suspend() {
          throw new Error('Audio failed');
        }
      })();

      const service = new AudioService(errorManager);
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Should not throw
      await service.signalSetRest();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should gracefully handle errors in playCountdown', async () => {
      const errorManager = new (class implements IAudioManager {
        async playTone() {
          throw new Error('Audio failed');
        }
        async playStartTone() {
          throw new Error('Audio failed');
        }
        async playStopTone() {
          throw new Error('Audio failed');
        }
        async playSetRestTone() {
          throw new Error('Audio failed');
        }
        async playCountdown() {
          throw new Error('Audio failed');
        }
        async playCountdownBeep() {
          throw new Error('Audio failed');
        }
        async resumeContext() {
          throw new Error('Audio failed');
        }
        async suspend() {
          throw new Error('Audio failed');
        }
      })();

      const service = new AudioService(errorManager);
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Should not throw
      await service.playCountdown();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Multiple signal sequence', () => {
    it('should handle rapid signal sequence', async () => {
      await audioService.signalWorkoutStart();
      await audioService.playCountdown();
      await audioService.signalWorkoutStop();
      await audioService.signalSetRest();

      expect(mockAudioManager.startToneCalls).toBe(1);
      expect(mockAudioManager.countdownCalls).toBe(1);
      expect(mockAudioManager.stopToneCalls).toBe(1);
      expect(mockAudioManager.setRestToneCalls).toBe(1);
    });

    it('should handle concurrent audio signals', async () => {
      await Promise.all([
        audioService.signalWorkoutStart(),
        audioService.signalWorkoutStop(),
        audioService.signalSetRest(),
      ]);

      expect(mockAudioManager.startToneCalls).toBe(1);
      expect(mockAudioManager.stopToneCalls).toBe(1);
      expect(mockAudioManager.setRestToneCalls).toBe(1);
    });
  });
});
