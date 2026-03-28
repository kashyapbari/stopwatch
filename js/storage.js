/**
 * storage.js - Cookie-based storage for presets and history
 * Handles PresetManager for managing workout presets and history
 */

class PresetManager {
  constructor() {
    this.PRESET_PREFIX = 'stopwatch_preset_';
    this.HISTORY_KEY = 'stopwatch_history';
    this.COOKIE_EXPIRY_DAYS = 30;
  }

  /**
   * Generate a preset ID from config
   * Format: {workSeconds}s-{restRepsSeconds}s-{reps}r-{sets}s-{restSetsSeconds}rs
   * Example: 30s-15s-5r-3s-60rs
   */
  generatePresetId(config) {
    return `${config.secondsPerRep}s-${config.restBetweenReps}s-${config.repsPerSet}r-${config.numberOfSets}s-${config.restBetweenSets}rs`;
  }

  /**
   * Set a cookie with expiration date
   */
  setCookie(name, value, expiryDays = this.COOKIE_EXPIRY_DAYS) {
    const date = new Date();
    date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const path = 'path=/';
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; ${path}`;
  }

  /**
   * Get a cookie value by name
   */
  getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Delete a cookie by name
   */
  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  /**
   * Save a preset to cookie
   */
  savePreset(config) {
    try {
      const presetId = this.generatePresetId(config);
      const presetData = {
        id: presetId,
        repsPerSet: config.repsPerSet,
        secondsPerRep: config.secondsPerRep,
        restBetweenReps: config.restBetweenReps,
        numberOfSets: config.numberOfSets,
        restBetweenSets: config.restBetweenSets,
        createdAt: Date.now(),
        lastUsed: Date.now()
      };
      const cookieName = this.PRESET_PREFIX + presetId;
      this.setCookie(cookieName, JSON.stringify(presetData));
      return presetId;
    } catch (error) {
      console.error('Error saving preset:', error);
      return null;
    }
  }

  /**
   * Load a preset from cookie
   */
  loadPreset(presetId) {
    try {
      const cookieName = this.PRESET_PREFIX + presetId;
      const cookieData = this.getCookie(cookieName);
      if (cookieData) {
        const preset = JSON.parse(cookieData);
        // Update lastUsed timestamp
        preset.lastUsed = Date.now();
        this.setCookie(cookieName, JSON.stringify(preset));
        return preset;
      }
      return null;
    } catch (error) {
      console.error('Error loading preset:', error);
      return null;
    }
  }

  /**
   * Get all presets
   */
  getAllPresets() {
    try {
      const presets = [];
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(this.PRESET_PREFIX)) {
          const nameEQ = this.PRESET_PREFIX;
          const cookieValue = decodeURIComponent(
            cookie.substring(cookie.indexOf('=') + 1)
          );
          const preset = JSON.parse(cookieValue);
          presets.push(preset);
        }
      }
      // Sort by lastUsed (most recent first)
      presets.sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));
      return presets;
    } catch (error) {
      console.error('Error getting all presets:', error);
      return [];
    }
  }

  /**
   * Get recent presets (last 10)
   */
  getRecentPresets(limit = 10) {
    const allPresets = this.getAllPresets();
    return allPresets.slice(0, limit);
  }

  /**
   * Delete a preset
   */
  deletePreset(presetId) {
    try {
      const cookieName = this.PRESET_PREFIX + presetId;
      this.deleteCookie(cookieName);
      return true;
    } catch (error) {
      console.error('Error deleting preset:', error);
      return false;
    }
  }

  /**
   * Add a completed workout to history
   */
  addToHistory(config, duration) {
    try {
      const presetId = this.generatePresetId(config);
      const history = this.getHistory();

      const workoutEntry = {
        id: Date.now(),
        presetId: presetId,
        repsPerSet: config.repsPerSet,
        secondsPerRep: config.secondsPerRep,
        restBetweenReps: config.restBetweenReps,
        numberOfSets: config.numberOfSets,
        restBetweenSets: config.restBetweenSets,
        duration: duration, // milliseconds
        completedAt: new Date().toISOString(),
        totalReps: config.repsPerSet * config.numberOfSets,
        totalSets: config.numberOfSets
      };

      // Add new entry at the beginning
      history.unshift(workoutEntry);

      // Keep only last 10 entries
      if (history.length > 10) {
        history.pop();
      }

      this.setCookie(this.HISTORY_KEY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Error adding to history:', error);
      return false;
    }
  }

  /**
   * Get workout history
   */
  getHistory() {
    try {
      const historyData = this.getCookie(this.HISTORY_KEY);
      if (historyData) {
        return JSON.parse(historyData);
      }
      return [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  /**
   * Clear all history
   */
  clearHistory() {
    try {
      this.deleteCookie(this.HISTORY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }

  /**
   * Format duration from milliseconds to MM:SS
   */
  formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  /**
   * Format date for display
   */
  formatDate(isoString) {
    try {
      const date = new Date(isoString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return `Today at ${date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })}`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year:
            date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  }
}

// Create global instance
const presetManager = new PresetManager();
