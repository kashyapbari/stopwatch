/**
 * main.js - Main application controller
 * Initializes the app and handles all event delegation
 */

// Global app state
const appState = {
  currentView: 'quick-setup',
  config: {
    repsPerSet: 5,
    secondsPerRep: 30,
    restBetweenReps: 15,
    numberOfSets: 3,
    restBetweenSets: 60
  },
  workout: {}
};

/**
 * Initialize the application
 */
function initApp() {
  // Render initial view
  uiManager.renderQuickSetup();

  // Attach event listeners
  attachEventListeners();

  console.log('Advanced Stopwatch App initialized');
}

/**
 * Attach all event listeners
 */
function attachEventListeners() {
  // Quick Setup buttons
  document.getElementById('btn-start-workout')?.addEventListener('click', onStartWorkout);
  document.getElementById('btn-advanced-setup')?.addEventListener('click', onAdvancedSetup);
  document.getElementById('btn-view-history')?.addEventListener('click', onViewHistory);

  // Quick setup input changes
  document.querySelectorAll('.quick-input').forEach((input) => {
    input.addEventListener('change', () => {
      uiManager.updateConfigFromQuickInputs();
    });
  });

  // Advanced Setup buttons
  document.getElementById('btn-back-to-quick')?.addEventListener('click', onBackToQuick);
  document.getElementById('btn-adv-start')?.addEventListener('click', onAdvancedStart);
  document.getElementById('btn-save-preset')?.addEventListener('click', onSavePreset);

  // Advanced setup input changes
  document.querySelectorAll('.adv-input').forEach((input) => {
    input.addEventListener('change', () => {
      uiManager.updateConfigFromAdvancedInputs();
    });
  });

  // Workout buttons
  document.getElementById('btn-pause-workout')?.addEventListener('click', onPauseWorkout);
  document.getElementById('btn-reset-workout')?.addEventListener('click', onResetWorkout);
  document.getElementById('btn-stop-workout')?.addEventListener('click', onStopWorkout);

  // History buttons
  document.getElementById('btn-back-to-setup')?.addEventListener('click', onBackToSetup);
}

// ============================================
// Event Handlers - Quick Setup
// ============================================

function onStartWorkout() {
  uiManager.updateConfigFromQuickInputs();

  if (!uiManager.validateConfig()) {
    return;
  }

  // Start workout engine
  workoutEngine.start(appState.config);

  // Switch to workout view
  uiManager.switchView('workout');
}

function onAdvancedSetup() {
  uiManager.updateConfigFromQuickInputs();
  uiManager.switchView('advanced-setup');
}

function onViewHistory() {
  uiManager.switchView('history');
}

// ============================================
// Event Handlers - Advanced Setup
// ============================================

function onBackToQuick() {
  uiManager.updateConfigFromAdvancedInputs();
  uiManager.switchView('quick-setup');
}

function onAdvancedStart() {
  uiManager.updateConfigFromAdvancedInputs();

  if (!uiManager.validateConfig()) {
    return;
  }

  // Start workout engine
  workoutEngine.start(appState.config);

  // Switch to workout view
  uiManager.switchView('workout');
}

function onSavePreset() {
  uiManager.updateConfigFromAdvancedInputs();

  if (!uiManager.validateConfig()) {
    return;
  }

  const presetId = presetManager.savePreset(appState.config);
  if (presetId) {
    uiManager.showToast(`Preset saved: ${presetId}`);
    // Refresh recent presets display
    uiManager.renderRecentPresets();
  } else {
    uiManager.showToast('Error saving preset');
  }
}

// ============================================
// Event Handlers - Workout
// ============================================

function onPauseWorkout() {
  if (workoutEngine.state.isPaused) {
    workoutEngine.resume();
  } else {
    workoutEngine.pause();
  }
  uiManager.updateWorkoutDisplay();
}

function onResetWorkout() {
  uiManager.showConfirmDialog('Reset Workout', 'Are you sure? All progress will be lost.', () => {
    workoutEngine.reset();
    uiManager.updateWorkoutDisplay();
    uiManager.switchView('quick-setup');
  });
}

function onStopWorkout() {
  uiManager.showConfirmDialog('Stop Workout', 'End the current workout?', () => {
    const duration = workoutEngine.state.elapsedTime;
    workoutEngine.stop();

    // Save to history
    presetManager.addToHistory(appState.config, duration);

    // Show completion
    uiManager.showToast(
      `Workout saved! Duration: ${presetManager.formatDuration(duration)}`
    );

    // Return to quick setup after delay
    setTimeout(() => {
      uiManager.switchView('quick-setup');
    }, 1500);
  });
}

// ============================================
// Event Handlers - History
// ============================================

function onBackToSetup() {
  uiManager.switchView('quick-setup');
}

// ============================================
// App Initialization
// ============================================

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Handle page visibility to pause/resume workout
document.addEventListener('visibilitychange', () => {
  if (document.hidden && workoutEngine.state.isActive && !workoutEngine.state.isPaused) {
    // Page is hidden, pause workout
    workoutEngine.pause();
  } else if (!document.hidden && workoutEngine.state.isPaused) {
    // Page is visible again, resume if it was paused by visibility
    // (This might not be necessary, but good practice)
  }
});

// Prevent accidental navigation away during workout
window.addEventListener('beforeunload', (e) => {
  if (workoutEngine.state.isActive) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
});
