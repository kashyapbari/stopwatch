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
 * Configuration for tone parameters
 */
interface ToneDefinition {
  frequency: number;
  duration: number;
  volume: number;
  frequencyEnd?: number; // Optional end frequency for sweeps
}

/**
 * Web Audio Manager - Uses Web Audio API for tone synthesis
 * Clean implementation with DRY principles and ADSR envelope abstraction
 */
class WebAudioManager implements IAudioManager {
  private audioContext: AudioContext | null = null;
  private isSupported: boolean = false;

  // Tone definitions - centralized configuration
  private readonly TONE_DEFINITIONS: Record<string, ToneDefinition> = {
    start: { frequency: 523, duration: 150, volume: 0.7 }, // C5 note
    stop: { frequency: 523, duration: 400, volume: 0.7, frequencyEnd: 261 }, // C5->C4 sweep
    setRest: { frequency: 261, duration: 600, volume: 0.6 }, // C4 - deep note
    countdown: { frequency: 800, duration: 80, volume: 0.7 }, // G5 note
  };

  // ADSR envelope parameters (in seconds)
  private readonly ENVELOPE = {
    attack: 0.005, // 5ms
    decay: 0.05, // 50ms
    sustain: 1, // Full volume
    release: 0.05, // 50ms
  };

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

  /**
   * Check if audio is available and log warning if not
   */
  private checkAudioAvailable(): boolean {
    if (!this.audioContext || !this.isSupported) {
      console.warn('Web Audio API not available, skipping tone');
      return false;
    }
    return true;
  }

  /**
   * Create and configure an ADSR gain envelope
   * @param duration Total tone duration in seconds
   * @returns Configured gain node ready for connection
   */
  private createADSREnvelope(duration: number): GainNode {
    const gainNode = this.audioContext!.createGain();
    const now = this.audioContext!.currentTime;
    const endTime = now + duration;

    // Attack phase - fade in
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.ENVELOPE.sustain, now + this.ENVELOPE.attack);

    // Decay to sustain level (optional, for longer tones)
    if (duration > this.ENVELOPE.attack + this.ENVELOPE.decay) {
      gainNode.gain.linearRampToValueAtTime(
        this.ENVELOPE.sustain,
        now + this.ENVELOPE.attack + this.ENVELOPE.decay
      );
    }

    // Release phase - fade out
    gainNode.gain.linearRampToValueAtTime(0, endTime);

    return gainNode;
  }

  /**
   * Create and configure an oscillator for a single tone
   * Handles frequency sweeps if endFrequency is specified
   * @param frequency Start frequency in Hz
   * @param duration Duration in seconds
   * @param frequencyEnd Optional end frequency for sweep
   * @returns Configured oscillator ready for playback
   */
  private createOscillator(
    frequency: number,
    duration: number,
    frequencyEnd?: number
  ): OscillatorNode {
    const oscillator = this.audioContext!.createOscillator();
    oscillator.type = 'sine';

    const now = this.audioContext!.currentTime;
    const endTime = now + duration;

    // Set frequency (or sweep if endFrequency provided)
    oscillator.frequency.setValueAtTime(frequency, now);
    if (frequencyEnd) {
      oscillator.frequency.linearRampToValueAtTime(frequencyEnd, endTime);
    }

    return oscillator;
  }

  /**
   * Play a tone with specified parameters
   * Encapsulates the Web Audio API complexity in a clean interface
   * @param frequency Start frequency in Hz
   * @param duration Duration in milliseconds
   * @param volume Volume level 0-1
   * @param frequencyEnd Optional end frequency for sweep effects
   */
  private async playToneInternal(
    frequency: number,
    duration: number,
    volume: number,
    frequencyEnd?: number
  ): Promise<void> {
    if (!this.checkAudioAvailable()) {
      return;
    }

    try {
      await this.resumeContext();

      const durationSeconds = duration / 1000;
      const oscillator = this.createOscillator(frequency, durationSeconds, frequencyEnd);
      const gainNode = this.createADSREnvelope(durationSeconds);

      // Apply volume scaling
      gainNode.gain.value = volume;

      // Connect and play
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      const now = this.audioContext!.currentTime;
      oscillator.start(now);
      oscillator.stop(now + durationSeconds);
    } catch (error) {
      console.warn('Error playing tone:', error);
    }
  }

  async playTone(frequency: number, duration: number, volume: number = 0.3): Promise<void> {
    await this.playToneInternal(frequency, duration, volume);
  }

  async playStartTone(): Promise<void> {
    const tone = this.TONE_DEFINITIONS.start;
    await this.playToneInternal(tone.frequency, tone.duration, tone.volume);
  }

  async playStopTone(): Promise<void> {
    const tone = this.TONE_DEFINITIONS.stop;
    await this.playToneInternal(tone.frequency, tone.duration, tone.volume, tone.frequencyEnd);
  }

  async playSetRestTone(): Promise<void> {
    const tone = this.TONE_DEFINITIONS.setRest;
    await this.playToneInternal(tone.frequency, tone.duration, tone.volume);
  }

  async playCountdown(): Promise<void> {
    // Multiple beeps signaling countdown to workout start
    // Pattern: 3 quick beeps, 3 quick beeps, 2 quick beeps (3, 2, 1 seconds)
    const beepGap = 150; // ms between beeps

    // 3 seconds: 3 beeps
    await this.playCountdownBeep();
    await new Promise((resolve) => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();
    await new Promise((resolve) => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();

    // 2 seconds: wait and play 2 beeps
    await new Promise((resolve) => setTimeout(resolve, 500));
    await this.playCountdownBeep();
    await new Promise((resolve) => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();

    // 1 second: wait and play 2 beeps
    await new Promise((resolve) => setTimeout(resolve, 500));
    await this.playCountdownBeep();
    await new Promise((resolve) => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();
  }

  async playCountdownBeep(): Promise<void> {
    // High-pitched beep for countdown
    const tone = this.TONE_DEFINITIONS.countdown;
    await this.playToneInternal(tone.frequency, tone.duration, tone.volume);
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
 * Placeholder for iOS/Android implementation
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
    await new Promise((resolve) => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();
    await new Promise((resolve) => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();

    // 2 seconds: wait and play 2 beeps
    await new Promise((resolve) => setTimeout(resolve, 500));
    await this.playCountdownBeep();
    await new Promise((resolve) => setTimeout(resolve, beepGap));
    await this.playCountdownBeep();

    // 1 second: wait and play 2 beeps
    await new Promise((resolve) => setTimeout(resolve, 500));
    await this.playCountdownBeep();
    await new Promise((resolve) => setTimeout(resolve, beepGap));
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
