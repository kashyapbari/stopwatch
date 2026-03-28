/**
 * audio.js - Web Audio API for generating tones
 * Creates distinct audio cues for workout phases
 */

class AudioManager {
  constructor() {
    // Try to get existing context or create new one
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    try {
      this.audioContext = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      this.audioContext = null;
    }
  }

  /**
   * Play a tone with given frequency and duration
   * @param {number} frequency - Hz (e.g., 440 = A note)
   * @param {number} duration - milliseconds
   * @param {number} volume - 0 to 1
   */
  playTone(frequency, duration, volume = 0.3) {
    if (!this.audioContext) {
      console.warn('Web Audio API not available');
      return;
    }

    try {
      const now = this.audioContext.currentTime;
      const endTime = now + duration / 1000;

      // Create oscillator
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      // Create gain node for volume and envelope
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(volume, now);

      // Attack: 10ms
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);

      // Release: last 50ms fade out
      gainNode.gain.linearRampToValueAtTime(0, endTime);

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Play
      oscillator.start(now);
      oscillator.stop(endTime);
    } catch (error) {
      console.error('Error playing tone:', error);
    }
  }

  /**
   * Play start tone (440Hz, 200ms)
   * Signals the beginning of a rep or phase
   */
  playStartTone() {
    this.playTone(440, 200, 0.3);
  }

  /**
   * Play stop tone (880Hz, 200ms)
   * Signals the end of a rep or phase
   */
  playStopTone() {
    this.playTone(880, 200, 0.3);
  }

  /**
   * Play countdown beeps (3 tones)
   * Used for 3-second countdown before workout/set starts
   */
  playCountdown() {
    const frequencies = [523, 659, 784]; // C, E, G notes
    const interval = 200; // 200ms between beeps

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 150, 0.3);
      }, index * interval);
    });
  }

  /**
   * Resume audio context if suspended (required for user interaction)
   */
  resumeContext() {
    if (
      this.audioContext &&
      this.audioContext.state === 'suspended'
    ) {
      this.audioContext.resume().catch((error) => {
        console.warn('Could not resume audio context:', error);
      });
    }
  }
}

// Create global instance
const audioManager = new AudioManager();
