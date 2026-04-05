/**
 * AudioService.ts - High-level audio interface for the application
 * Provides convenient methods for workout-related audio cues
 * Integrates with WorkoutEngine to provide audio feedback
 */

import { audioManager } from './AudioManager';
import { IAudioManager } from '../types/audio';

/**
 * AudioService provides a clean API for the app to trigger audio events
 * It wraps the platform-specific AudioManager and handles error cases gracefully
 */
class AudioService {
  private audioManager: IAudioManager;
  private isEnabled: boolean = true;

  constructor(manager: IAudioManager = audioManager) {
    this.audioManager = manager;
  }

  /**
   * Enable or disable audio globally
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Check if audio is enabled
   */
  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Signal workout start - short, bright beep
   * Called when user presses "Start" button or countdown completes
   */
  async signalWorkoutStart(): Promise<void> {
    if (!this.isEnabled) return;
    try {
      await this.audioManager.playStartTone();
    } catch (error) {
      console.warn('Failed to play start tone:', error);
      // Silently continue - audio failure should not block workout
    }
  }

  /**
   * Signal workout stop - longer, descending beep
   * Called when a rep or working period ends
   */
  async signalWorkoutStop(): Promise<void> {
    if (!this.isEnabled) return;
    try {
      await this.audioManager.playStopTone();
    } catch (error) {
      console.warn('Failed to play stop tone:', error);
    }
  }

  /**
   * Signal set rest period - deep, sustained beep
   * Called when entering the rest period between sets
   */
  async signalSetRest(): Promise<void> {
    if (!this.isEnabled) return;
    try {
      await this.audioManager.playSetRestTone();
    } catch (error) {
      console.warn('Failed to play set rest tone:', error);
    }
  }

  /**
   * Play countdown sequence - multiple beeps
   * Called when entering countdown phase (e.g., 3-2-1 before workout)
   * Pattern: 3 beeps for 3s, 2 beeps for 2s, 2 beeps for 1s
   */
  async playCountdown(): Promise<void> {
    if (!this.isEnabled) return;
    try {
      await this.audioManager.playCountdown();
    } catch (error) {
      console.warn('Failed to play countdown:', error);
    }
  }

  /**
   * Initialize audio context (web only)
   * Call this after user interaction to enable audio playback
   */
  async initialize(): Promise<void> {
    try {
      await this.audioManager.resumeContext();
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
    }
  }

  /**
   * Cleanup audio resources
   */
  async cleanup(): Promise<void> {
    try {
      await this.audioManager.suspend?.();
    } catch (error) {
      console.warn('Failed to cleanup audio:', error);
    }
  }
}

// Create and export singleton instance
export const audioService = new AudioService();

export { AudioService };
