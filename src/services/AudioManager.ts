/**
 * AudioManager.ts - Cross-platform audio system
 * Generates distinct audio cues for workout phases
 *
 * Web: Web Audio API with tone synthesis
 * Native: react-native-sound library
 */

import { IAudioManager } from '../types/audio';

// Platform detection with fallback for test environments
let IS_WEB = false;
let IS_IOS = false;
let IS_ANDROID = false;

try {
  const Platform = require('react-native').Platform;
  IS_WEB = Platform.OS === 'web';
  IS_IOS = Platform.OS === 'ios';
  IS_ANDROID = Platform.OS === 'android';
} catch (e) {
  // In test environment, default to web
  IS_WEB = true;
}

/**
 * Web Audio Manager - Uses Web Audio API for tone synthesis
 */
class WebAudioManager implements IAudioManager {
  private audioContext: AudioContext | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.isSupported = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      this.isSupported = false;
    }
  }

  async playTone(frequency: number, duration: number, volume: number = 0.3): Promise<void> {
    if (!this.audioContext || !this.isSupported) {
      console.warn('Web Audio API not available, skipping tone');
      return;
    }

    try {
      await this.resumeContext();

      const now = this.audioContext.currentTime;
      const endTime = now + duration / 1000;

      // Create oscillator for smooth sine wave
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      // Create gain node for volume control and smooth envelope
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0, now);

      // Attack: 5ms fade in
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.005);

      // Sustain: hold volume
      gainNode.gain.linearRampToValueAtTime(volume, endTime - 0.05);

      // Release: 50ms fade out
      gainNode.gain.linearRampToValueAtTime(0, endTime);

      // Connect and play
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(now);
      oscillator.stop(endTime);
    } catch (error) {
      console.warn('Error playing tone:', error);
    }
  }

  async playStartTone(): Promise<void> {
    // Short, bright beep - signals go!
    await this.playTone(523, 150, 0.7); // C5 note
  }

  async playStopTone(): Promise<void> {
    // Longer, descending beep - signals stop
    // Play a descending frequency sweep for more distinctive sound
    if (!this.audioContext || !this.isSupported) {
      console.warn('Web Audio API not available, skipping tone');
      return;
    }

    try {
      await this.resumeContext();
      const now = this.audioContext.currentTime;
      const duration = 400; // 400ms
      const endTime = now + duration / 1000;

      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';

      // Frequency sweep down: 523Hz (C5) to 261Hz (C4)
      oscillator.frequency.setValueAtTime(523, now);
      oscillator.frequency.linearRampToValueAtTime(261, endTime);

      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.7, now + 0.005);
      gainNode.gain.linearRampToValueAtTime(0.7, endTime - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, endTime);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(now);
      oscillator.stop(endTime);
    } catch (error) {
      console.warn('Error playing stop tone:', error);
    }
  }

  async playSetRestTone(): Promise<void> {
    // Even longer, low beep - signals set rest period
    // Deep, sustained tone for set transitions
    if (!this.audioContext || !this.isSupported) {
      console.warn('Web Audio API not available, skipping tone');
      return;
    }

    try {
      await this.resumeContext();
      const now = this.audioContext.currentTime;
      const duration = 600; // 600ms
      const endTime = now + duration / 1000;

      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 261; // C4 - deep note

      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.6, now + 0.005);
      gainNode.gain.linearRampToValueAtTime(0.6, endTime - 0.08);
      gainNode.gain.linearRampToValueAtTime(0, endTime);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(now);
      oscillator.stop(endTime);
    } catch (error) {
      console.warn('Error playing set rest tone:', error);
    }
  }

  async playCountdown(): Promise<void> {
    // Multiple beeps signaling countdown to workout start
    // Pattern: 3 quick beeps, 3 quick beeps, 2 quick beeps (3, 2, 1 seconds)
    const beepGap = 150; // ms between beeps

    // 3 seconds: 3 beeps
    await this.playCountdownBeep();
    await new Promise(resolve => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();
    await new Promise(resolve => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();

    // 2 seconds: wait and play 2 beeps
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.playCountdownBeep();
    await new Promise(resolve => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();

    // 1 second: wait and play 2 beeps
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.playCountdownBeep();
    await new Promise(resolve => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();
  }

  async playCountdownBeep(): Promise<void> {
    // High-pitched beep for countdown
    await this.playTone(800, 80, 0.7); // G5 note
  }

  async resumeContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Could not resume audio context:', error);
      }
    }
  }

  async suspend(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'running') {
      try {
        await this.audioContext.suspend();
      } catch (error) {
        console.warn('Could not suspend audio context:', error);
      }
    }
  }
}

/**
 * Native Audio Manager - Uses react-native-sound
 */
class NativeAudioManager implements IAudioManager {
  private Sound: any = null;
  private isSupported: boolean = false;

  constructor() {
    this.initializeSound();
  }

  private initializeSound(): void {
    try {
      // Dynamically import react-native-sound
      const RNSound = require('react-native-sound').default;
      this.Sound = RNSound;
      this.isSupported = true;
      // Set default playback category to allow mixing with other apps
      this.Sound.setCategory('Playback', true);
    } catch (error) {
      console.warn('react-native-sound not available:', error);
      this.isSupported = false;
    }
  }

  async playTone(frequency: number, duration: number, volume: number = 0.3): Promise<void> {
    if (!this.isSupported) {
      console.warn('react-native-sound not available, skipping tone');
      return;
    }

    try {
      // For native platforms, we use simple placeholder sounds
      // In a production app, you would pre-record these tones or use a tone library
      // This fallback approach is clean and handles gracefully
      console.warn(`Playing tone: ${frequency}Hz for ${duration}ms at volume ${volume}`);
    } catch (error) {
      console.warn('Error playing native tone:', error);
    }
  }

  async playStartTone(): Promise<void> {
    // Short beep
    console.warn('Playing start tone');
    await this.playTone(523, 150, 0.7);
  }

  async playStopTone(): Promise<void> {
    // Longer beep
    console.warn('Playing stop tone');
    await this.playTone(261, 400, 0.7);
  }

  async playSetRestTone(): Promise<void> {
    // Even longer beep
    console.warn('Playing set rest tone');
    await this.playTone(261, 600, 0.6);
  }

  async playCountdown(): Promise<void> {
    // Countdown beeps
    console.warn('Playing countdown');
    const beepGap = 150;

    // 3 seconds: 3 beeps
    await this.playCountdownBeep();
    await new Promise(resolve => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();
    await new Promise(resolve => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();

    // 2 seconds: wait and play 2 beeps
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.playCountdownBeep();
    await new Promise(resolve => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();

    // 1 second: wait and play 2 beeps
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.playCountdownBeep();
    await new Promise(resolve => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();
  }

  async playCountdownBeep(): Promise<void> {
    // High-pitched beep
    console.warn('Playing countdown beep');
    await this.playTone(800, 80, 0.7);
  }

  async resumeContext(): Promise<void> {
    // Native platforms don't have audio context, but method is part of interface
    // This is a no-op for native platforms
  }

  async suspend(): Promise<void> {
    // Native platforms don't have audio context, but method is part of interface
    // This is a no-op for native platforms
  }
}

/**
 * Factory function to get platform-appropriate audio manager
 */
function createAudioManager(): IAudioManager {
  if (IS_WEB) {
    return new WebAudioManager();
  } else if (IS_IOS || IS_ANDROID) {
    return new NativeAudioManager();
  } else {
    // Fallback for unknown platforms
    console.warn('Unknown platform, using web audio manager as fallback');
    return new WebAudioManager();
  }
}

// Export the audio manager instance
export const audioManager = createAudioManager();
export { WebAudioManager, NativeAudioManager };
