/**
 * Type definitions for audio
 */

// Audio manager interface
export interface IAudioManager {
  // Tone playback
  playTone(frequency: number, duration: number, volume?: number): Promise<void>;

  // Specific workout tones
  playStartTone(): Promise<void>;
  playStopTone(): Promise<void>;
  playSetRestTone(): Promise<void>;
  playCountdown(): Promise<void>;

  // Context management
  resumeContext(): Promise<void>;
  suspend?(): Promise<void>;
}

// Tone configuration
export interface ToneConfig {
  frequency: number; // Hz
  duration: number; // milliseconds
  volume: number; // 0-1
}

// Audio context for different platforms
export interface AudioContextType {
  currentTime: number;
  state: 'running' | 'suspended' | 'closed';
  resume(): Promise<void>;
}
