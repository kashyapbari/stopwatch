/**
 * ui.js - UI rendering and event handling
 * Manages all view rendering and user interactions
 */

class UIManager {
  constructor() {
    this.currentView = 'quick-setup';
    this.workoutUpdateInterval = null;
  }

  /**
   * Render Quick Setup View
   */
  renderQuickSetup() {
    const quickSetupEl = document.getElementById('quick-setup');
    if (!quickSetupEl) return;

    // Update input values with current config
    this.updateQuickInputs();

    // Render recent presets
    this.renderRecentPresets();

    this.currentView = 'quick-setup';
  }

  /**
   * Update quick setup inputs with current values
   */
  updateQuickInputs() {
    const inputs = document.querySelectorAll('.quick-input');
    inputs.forEach((input) => {
      const field = input.dataset.field;
      const value = appState.config[field];
      if (value !== undefined) {
        input.value = value;
      }
    });
  }

  /**
   * Render recent presets list
   */
  renderRecentPresets() {
    const presetsContainer = document.getElementById('recent-presets');
    const recentPresets = presetManager.getRecentPresets(5);

    if (recentPresets.length === 0) {
      presetsContainer.innerHTML = '<p class="text-muted">No saved presets yet</p>';
      return;
    }

    presetsContainer.innerHTML = recentPresets
      .map(
        (preset) => `
      <div class="preset-item" data-preset-id="${preset.id}">
        <span class="preset-item-name">${preset.id}</span>
      </div>
    `
      )
      .join('');

    // Add click handlers
    presetsContainer.querySelectorAll('.preset-item').forEach((item) => {
      item.addEventListener('click', () => {
        const presetId = item.dataset.presetId;
        this.selectPreset(presetId);
      });
    });
  }

  /**
   * Select and load a preset
   */
  selectPreset(presetId) {
    const preset = presetManager.loadPreset(presetId);
    if (preset) {
      appState.config = {
        repsPerSet: preset.repsPerSet,
        secondsPerRep: preset.secondsPerRep,
        restBetweenReps: preset.restBetweenReps,
        numberOfSets: preset.numberOfSets,
        restBetweenSets: preset.restBetweenSets
      };
      this.updateQuickInputs();
      this.showToast(`Loaded preset: ${presetId}`);
    }
  }

  /**
   * Render Advanced Setup View
   */
  renderAdvancedSetup() {
    const advancedSetupEl = document.getElementById('advanced-setup');
    if (!advancedSetupEl) return;

    this.updateAdvancedInputs();
    this.currentView = 'advanced-setup';
  }

  /**
   * Update advanced setup inputs
   */
  updateAdvancedInputs() {
    const inputs = document.querySelectorAll('.adv-input');
    inputs.forEach((input) => {
      const field = input.dataset.field;
      const value = appState.config[field];
      if (value !== undefined) {
        input.value = value;
      }
    });
  }

  /**
   * Render Active Workout View
   */
  renderWorkout() {
    const workoutEl = document.getElementById('workout');
    if (!workoutEl) return;

    this.currentView = 'workout';
    this.updateWorkoutDisplay();

    // Start update loop
    if (this.workoutUpdateInterval) {
      clearInterval(this.workoutUpdateInterval);
    }
    this.workoutUpdateInterval = setInterval(() => this.updateWorkoutDisplay(), 100);
  }

  /**
   * Update workout display during active workout
   */
  updateWorkoutDisplay() {
    const state = workoutEngine.getState();

    // Update rep/set counter
    const repSetEl = document.getElementById('rep-set-counter');
    if (repSetEl) {
      repSetEl.textContent = `Rep ${state.currentRep} / Set ${state.currentSet}`;
    }

    // Update phase status
    const statusEl = document.getElementById('phase-status');
    if (statusEl) {
      const status = workoutEngine.getStatus();
      statusEl.textContent = status;
      statusEl.className = 'phase-status';
      statusEl.classList.add(state.phase);
    }

    // Update elapsed time
    const timeEl = document.getElementById('elapsed-time');
    if (timeEl) {
      timeEl.textContent = workoutEngine.getElapsedTimeFormatted();
    }

    // Update next phase info
    const nextPhaseEl = document.getElementById('next-phase-text');
    if (nextPhaseEl) {
      nextPhaseEl.textContent = workoutEngine.getNextPhaseInfo();
    }

    // Check if workout is complete
    if (!state.isActive && state.phase === 'idle') {
      this.completeWorkout();
    }

    // Update pause button state
    const pauseBtn = document.getElementById('btn-pause-workout');
    if (pauseBtn) {
      if (state.isPaused) {
        pauseBtn.textContent = 'Resume';
      } else {
        pauseBtn.textContent = 'Pause';
      }
    }
  }

  /**
   * Handle workout completion
   */
  completeWorkout() {
    if (this.workoutUpdateInterval) {
      clearInterval(this.workoutUpdateInterval);
      this.workoutUpdateInterval = null;
    }

    // Save to history
    const duration = workoutEngine.state.elapsedTime;
    presetManager.addToHistory(appState.config, duration);

    // Show completion message
    this.showToast(
      `Workout complete! ${presetManager.formatDuration(duration)}`
    );

    // Return to quick setup after delay
    setTimeout(() => {
      this.switchView('quick-setup');
    }, 2000);
  }

  /**
   * Render History View
   */
  renderHistory() {
    const historyEl = document.getElementById('history');
    if (!historyEl) return;

    this.renderHistoryList();
    this.currentView = 'history';
  }

  /**
   * Render history list
   */
  renderHistoryList() {
    const historyContainer = document.getElementById('history-list');
    const history = presetManager.getHistory();

    if (history.length === 0) {
      historyContainer.innerHTML = '<p class="text-muted">No workout history yet</p>';
      return;
    }

    historyContainer.innerHTML = history
      .map(
        (workout) => `
      <div class="history-item" data-workout-id="${workout.id}">
        <div class="history-item-preset">${workout.presetId}</div>
        <div class="history-item-date">${presetManager.formatDate(
          workout.completedAt
        )}</div>
        <div class="history-item-stats">
          <div class="history-stat">
            <div class="history-stat-label">Duration</div>
            <div class="history-stat-value">${presetManager.formatDuration(
              workout.duration
            )}</div>
          </div>
          <div class="history-stat">
            <div class="history-stat-label">Total Reps</div>
            <div class="history-stat-value">${workout.totalReps}</div>
          </div>
          <div class="history-stat">
            <div class="history-stat-label">Sets</div>
            <div class="history-stat-value">${workout.totalSets}</div>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    // Add click handlers to load preset
    historyContainer.querySelectorAll('.history-item').forEach((item) => {
      item.addEventListener('click', () => {
        const presetId = item.querySelector('.history-item-preset').textContent;
        this.selectPreset(presetId);
        this.switchView('quick-setup');
      });
    });
  }

  /**
   * Switch between views
   */
  switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach((view) => {
      view.classList.add('hidden');
    });

    // Show selected view
    const viewEl = document.getElementById(viewName);
    if (viewEl) {
      viewEl.classList.remove('hidden');
    }

    // Render view
    if (viewName === 'quick-setup') {
      this.renderQuickSetup();
    } else if (viewName === 'advanced-setup') {
      this.renderAdvancedSetup();
    } else if (viewName === 'workout') {
      this.renderWorkout();
    } else if (viewName === 'history') {
      this.renderHistory();
    }

    this.currentView = viewName;
  }

  /**
   * Show confirmation dialog
   */
  showConfirmDialog(title, message, onConfirm) {
    const dialog = document.getElementById('confirm-dialog');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;

    const confirmBtn = document.getElementById('btn-confirm-yes');
    const cancelBtn = document.getElementById('btn-confirm-cancel');

    // Remove old listeners
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;

    confirmBtn.onclick = () => {
      dialog.classList.add('hidden');
      onConfirm();
    };

    cancelBtn.onclick = () => {
      dialog.classList.add('hidden');
    };

    dialog.classList.remove('hidden');
  }

  /**
   * Show preset selector dialog
   */
  showPresetSelector(onSelect) {
    const dialog = document.getElementById('preset-dialog');
    const selectorEl = document.getElementById('preset-selector');
    const allPresets = presetManager.getAllPresets();

    if (allPresets.length === 0) {
      this.showToast('No saved presets yet');
      return;
    }

    selectorEl.innerHTML = allPresets
      .map(
        (preset) => `
      <div class="preset-selector-item" data-preset-id="${preset.id}">
        ${preset.id}
      </div>
    `
      )
      .join('');

    selectorEl.querySelectorAll('.preset-selector-item').forEach((item) => {
      item.addEventListener('click', () => {
        const presetId = item.dataset.presetId;
        dialog.classList.add('hidden');
        onSelect(presetId);
      });
    });

    document.getElementById('btn-preset-cancel').onclick = () => {
      dialog.classList.add('hidden');
    };

    dialog.classList.remove('hidden');
  }

  /**
   * Show toast notification
   */
  showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, duration);
  }

  /**
   * Update config from inputs
   */
  updateConfigFromQuickInputs() {
    const inputs = document.querySelectorAll('.quick-input');
    inputs.forEach((input) => {
      const field = input.dataset.field;
      const value = parseInt(input.value, 10);
      if (!isNaN(value) && value > 0) {
        appState.config[field] = value;
      }
    });
  }

  /**
   * Update config from advanced inputs
   */
  updateConfigFromAdvancedInputs() {
    const inputs = document.querySelectorAll('.adv-input');
    inputs.forEach((input) => {
      const field = input.dataset.field;
      const value = parseInt(input.value, 10);
      if (!isNaN(value) && value >= 0) {
        appState.config[field] = value;
      }
    });
  }

  /**
   * Validate config
   */
  validateConfig() {
    const config = appState.config;
    const errors = [];

    if (config.repsPerSet < 1 || config.repsPerSet > 50) {
      errors.push('Reps per set must be between 1 and 50');
    }
    if (config.secondsPerRep < 1 || config.secondsPerRep > 300) {
      errors.push('Seconds per rep must be between 1 and 300');
    }
    if (config.restBetweenReps < 0 || config.restBetweenReps > 300) {
      errors.push('Rest between reps must be between 0 and 300');
    }
    if (config.numberOfSets < 1 || config.numberOfSets > 50) {
      errors.push('Number of sets must be between 1 and 50');
    }
    if (config.restBetweenSets < 0 || config.restBetweenSets > 600) {
      errors.push('Rest between sets must be between 0 and 600');
    }

    if (errors.length > 0) {
      this.showToast(errors[0]);
      return false;
    }

    return true;
  }
}

// Create global instance
const uiManager = new UIManager();
