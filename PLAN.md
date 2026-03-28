# Advanced Stopwatch App - Complete Project Plan

**Last Updated:** March 28, 2024  
**Project Status:** Planning Complete - Ready for Implementation  
**Target Platform:** GitHub Pages  

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Feature Requirements](#feature-requirements)
3. [User Stories & Workflows](#user-stories--workflows)
4. [Technical Architecture](#technical-architecture)
5. [Project Structure](#project-structure)
6. [Storage Schema](#storage-schema)
7. [State Management](#state-management)
8. [UI Specifications](#ui-specifications)
9. [Workout Logic & Flow](#workout-logic--flow)
10. [Implementation Tasks](#implementation-tasks)
11. [Testing Checklist](#testing-checklist)
12. [Deployment Guide](#deployment-guide)

---

## Project Overview

### Purpose
An advanced stopwatch application designed for workout exercises requiring specific timing for reps, rest periods, and sets. Solves the problem of manually tracking complex workout intervals through automated audio cues and visual feedback.

### Target Users
- Athletes and fitness enthusiasts
- Personal trainers
- Anyone doing timed exercise routines (HIIT, CrossFit, strength training, yoga, breathing exercises)

### Primary Goal
Enable users to focus on their workout while the app automatically:
- Tracks elapsed time with clear visuals
- Announces transitions with distinct audio tones
- Remembers workout configurations for quick reuse
- Works offline without any server dependencies

### Key Differentiators
- ✓ Zero external dependencies (pure HTML/CSS/JS)
- ✓ Multi-user support via browser cookies
- ✓ Preset storage for quick workout reuse
- ✓ Fully responsive for mobile (iPhone optimized)
- ✓ Dark mode UI for eye comfort during workouts
- ✓ No build process - runs directly in browser

---

## Feature Requirements

### Core Features

#### 1. Quick Preset Setup
- **Default Values:**
  - Work per rep: 30 seconds
  - Rest between reps: 15 seconds
  - Reps per set: 5
  - Number of sets: 3
  - Rest between sets: 60 seconds

- **Functionality:**
  - Users can click [Start Workout] immediately with defaults
  - Quick adjust dropdowns for all 5 parameters
  - [Advanced] button to customize any parameter with full range
  - [Change] button to load from saved presets
  - [History] button to view and reload past workouts

#### 2. Advanced Configuration
- **Editable Fields:**
  - Seconds per rep (1-300 seconds)
  - Rest between reps (0-300 seconds)
  - Reps per set (1-50)
  - Number of sets (1-50)
  - Rest between sets (0-600 seconds)

- **Functionality:**
  - Full control over all workout parameters
  - [Save as Preset] button to store configuration with auto-generated name
  - [Back] button to return to quick setup
  - [Start Workout] to begin immediately

#### 3. Preset Management
- **Auto-Generated Preset ID Format:**
  ```
  {workSeconds}s-{restRepsSeconds}s-{reps}r-{sets}s-{restSetsSeconds}rs
  Examples: "30s-15s-5r-3s-60rs", "45s-20s-4r-4s-90rs"
  ```

- **Storage:**
  - Stored in browser cookies
  - One cookie per preset (name = stopwatch_preset_{id})
  - Each user/device has separate presets
  - Unlimited preset storage (practical limit ~50+ presets)

- **Operations:**
  - Save new preset
  - Load preset
  - List all presets
  - Delete preset
  - Quick access to 10 most recent presets

#### 4. Active Workout Interface
- **Display Elements:**
  - Large elapsed time counter (MM:SS format, 4rem font)
  - Current rep and set counter (e.g., "Rep 3 / Set 2")
  - Current phase status (WORKING / RESTING / SET REST)
  - Next phase countdown (e.g., "Next: Rest (12s)")
  - Pause/Resume/Reset/Stop buttons

- **Controls:**
  - [Pause] - Pause the timer
  - [Resume] - Resume from pause
  - [Reset] - Reset to start (with confirmation)
  - [Stop] - End workout and return to setup

#### 5. Audio Cues
- **Tone Types:**
  - **Start Tone:** 440Hz, 200ms (signal to begin rep)
  - **Stop Tone:** 880Hz, 200ms (signal end of rep/rest)
  - **Countdown Tone:** 3 sequential beeps (523Hz, 659Hz, 784Hz at 200ms each)

- **Trigger Points:**
  - 3-second countdown BEFORE workout starts
  - When rep time ends → Stop Tone → Rest phase begins
  - When rest time ends → Start Tone → Work phase begins
  - When set ends → Stop Tone → Set rest begins
  - 3-second countdown BEFORE new set begins
  - 3-second countdown BEFORE final rep of set

- **Implementation:**
  - Web Audio API (native browser audio)
  - No external audio files
  - Always plays (no mute toggle initially)

#### 6. Workout History
- **Storage:**
  - Last 10 completed workouts
  - Stored in single cookie: `stopwatch_history`

- **Data Per Workout:**
  ```javascript
  {
    id: timestamp,
    presetId: "30s-15s-5r-3s-60rs",
    duration: 1234000,  // milliseconds
    completedAt: "2024-03-28T10:30:00",
    totalReps: 15,      // reps × sets
    totalSets: 3
  }
  ```

- **Functionality:**
  - View last 10 workouts on History screen
  - Click to reload preset from history
  - Auto-saved on workout completion
  - Oldest entries removed when 11th added

#### 7. Responsive Design
- **Mobile First Approach:**
  - Primary target: iPhone 12/13/14/15 (375px - 430px width)
  - Secondary: iPad (768px+)
  - Tertiary: Desktop (1024px+)

- **Key Requirements:**
  - Touch-friendly buttons (44px+ minimum)
  - Readable fonts at all screen sizes
  - Portrait orientation optimized
  - Full-screen capable
  - No horizontal scrolling

#### 8. Data Persistence
- **Cookie-Based Storage:**
  - `stopwatch_preset_{id}` - Individual presets
  - `stopwatch_history` - Last 10 workouts
  - 30-day expiration (auto-extends on use)
  - Domain: Current GitHub Pages domain
  - No third-party cookies

- **Multi-User Support:**
  - Each browser/device has separate cookies
  - No user authentication needed
  - No backend required

---

## User Stories & Workflows

### Story 1: Quick Workout Start
```
As a returning user,
I want to start my usual workout with one click,
So I can focus on exercise instead of setup.

Acceptance Criteria:
✓ App opens to Quick Setup view
✓ Default values are pre-filled
✓ [Start Workout] button immediately begins with current values
✓ Elapsed time starts counting
✓ 3-second countdown tone plays before first rep
```

### Story 2: Custom Workout Configuration
```
As a new user,
I want to configure custom work/rest intervals,
So I can match my specific exercise routine.

Acceptance Criteria:
✓ Click [Advanced] from Quick Setup
✓ See form with all 5 editable fields
✓ Change any value (1-300 second range)
✓ Click [Save as Preset] to store for later
✓ Preset auto-generates descriptive name
✓ Click [Start Workout] to begin
```

### Story 3: Preset Reuse
```
As a regular user,
I want to load previously saved workouts,
So I don't re-enter the same settings.

Acceptance Criteria:
✓ Click [Change] from Quick Setup
✓ See list of saved presets
✓ Click preset to select it
✓ Values update in Quick Setup
✓ [Start Workout] uses selected preset
```

### Story 4: Workout History
```
As a user tracking progress,
I want to see my past workouts,
So I can monitor my exercise history.

Acceptance Criteria:
✓ Click [History] from Quick Setup
✓ See last 10 completed workouts
✓ Each shows: date, duration, preset name
✓ Click workout to reload that preset
✓ Oldest workouts removed after 10th entry
```

### Story 5: Active Workout
```
As an exercising user,
I want clear audio and visual cues,
So I can focus on form without watching the timer.

Acceptance Criteria:
✓ Elapsed time displays prominently (MM:SS)
✓ Current rep/set shows (e.g., "Rep 3 / Set 2")
✓ Phase status shows (WORKING / RESTING / SET REST)
✓ Distinct tone plays at phase transitions
✓ Can pause/resume/reset/stop workout
✓ Tone plays 3 seconds before each rep/set start
```

---

## Technical Architecture

### Technology Stack

| Category | Choice | Reason |
|----------|--------|--------|
| **Frontend** | Vanilla HTML5/CSS3/JavaScript (ES6+) | No build tools, lightweight, runs anywhere |
| **Audio** | Web Audio API (native) | No external files, pure browser API |
| **Storage** | Browser Cookies (document.cookie) | Multi-user support, simple, no backend needed |
| **Hosting** | GitHub Pages | Free, static, automatic deployment |
| **Browser Support** | Modern browsers only (last 2 years) | Chrome 90+, Firefox 88+, Safari 14+ |

### Architecture Diagram

```
┌─────────────────────────────────────────────┐
│          index.html (Entry Point)           │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │       UI Manager (ui.js)              │   │
│  │  ├─ renderQuickSetup()                │   │
│  │  ├─ renderAdvancedSetup()             │   │
│  │  ├─ renderWorkout()                   │   │
│  │  └─ updateDisplay()                   │   │
│  └──────────────────────────────────────┘   │
│                    ▲                         │
│                    │ calls                   │
│                    ▼                         │
│  ┌──────────────────────────────────────┐   │
│  │    Main Controller (main.js)          │   │
│  │  ├─ Route views                       │   │
│  │  ├─ Handle user events                │   │
│  │  └─ Coordinate modules                │   │
│  └──────────────────────────────────────┘   │
│     ▲          ▲          ▲          ▲       │
│     │ manages  │ manages  │ manages  │ uses  │
│     ▼          ▼          ▼          ▼       │
│  ┌──────┐ ┌──────────┐ ┌──────┐ ┌────────┐  │
│  │Workout│ │Storage   │ │Audio │ │Styles  │  │
│  │Engine │ │Manager   │ │Manager│└────────┘  │
│  │       │ │          │ │      │            │
│  │.tick()│ │.save()   │ │.play │            │
│  │.start()│ │.load()   │ │Tone()│            │
│  │.pause()│ │.delete() │ │     │            │
│  └──────┘ └──────────┘ └──────┘            │
│     ▲           ▲                            │
│     │ uses      │ uses                       │
│     ▼           ▼                            │
│  ┌──────────────────────────────────────┐   │
│  │  Browser APIs                         │   │
│  │  ├─ setInterval() [10ms timer]        │   │
│  │  ├─ document.cookie                   │   │
│  │  ├─ Web Audio API (AudioContext)      │   │
│  │  └─ localStorage (optional fallback)  │   │
│  └──────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Vanilla JS (No Framework)** | Eliminates ~30KB framework overhead, runs directly in browser, no build step required |
| **10ms Timer Loop** | Smooth visual updates while respecting performance, allows ~100 FPS display updates |
| **Web Audio API** | Native browser audio synthesis, no external files, no CDN dependencies |
| **Cookies for Storage** | Per-device/browser persistence, multi-user support without backend, simple JSON serialization |
| **Dark Mode Only** | Reduces CSS complexity by 40%, better for fitness context (eye comfort during workouts) |
| **One-File Modules** | No module bundler needed, all modules load in order via `<script>` tags |
| **No State Library** | Plain JavaScript objects for state, all mutations tracked manually, easier to debug |

---

## Project Structure

### Directory Layout

```
stopwatch-app/
├── index.html              # Main HTML entry point (250 lines)
├── css/
│   └── styles.css          # All CSS (dark mode, responsive) (600 lines)
├── js/
│   ├── main.js             # App initialization & routing (400 lines)
│   ├── ui.js               # UI rendering & event handling (550 lines)
│   ├── workout.js          # Workout state & timer logic (350 lines)
│   ├── audio.js            # Web Audio API tones (120 lines)
│   └── storage.js          # Cookie management (180 lines)
├── PLAN.md                 # This file - comprehensive project plan
├── README.md               # GitHub Pages documentation
├── .gitignore              # Git ignore file
└── LICENSE                 # MIT License

Total: ~2,400 lines of code (minified ~8KB, gzipped ~2.5KB)
```

### File Dependencies

```
index.html
  ├─ css/styles.css
  └─ js/main.js
      ├─ js/ui.js
      ├─ js/workout.js
      ├─ js/audio.js
      ├─ js/storage.js
```

**Load Order (in index.html):**
1. styles.css (in `<head>`)
2. main.js (end of `<body>`)
3. ui.js (via main.js)
4. workout.js (via main.js)
5. audio.js (via main.js)
6. storage.js (via main.js)

---

## Storage Schema

### Cookies Structure

#### 1. Preset Cookies
```javascript
// Cookie Name Pattern: stopwatch_preset_{presetId}
// Cookie Name Example: stopwatch_preset_30s-15s-5r-3s-60rs

Cookie Value (JSON):
{
  "id": "30s-15s-5r-3s-60rs",
  "repsPerSet": 5,
  "secondsPerRep": 30,
  "restBetweenReps": 15,
  "numberOfSets": 3,
  "restBetweenSets": 60,
  "createdAt": 1711612800000,  // timestamp
  "lastUsed": 1711616400000
}
```

**Cookie Settings:**
- Domain: Current site
- Path: /
- Expires: 30 days
- Secure: false (allowed over HTTP for GitHub Pages)
- SameSite: Lax

#### 2. History Cookie
```javascript
// Cookie Name: stopwatch_history
// Max 10 entries (oldest removed when 11th added)

Cookie Value (JSON Array):
[
  {
    "id": 1711616400000,        // timestamp as unique ID
    "presetId": "30s-15s-5r-3s-60rs",
    "repsPerSet": 5,
    "secondsPerRep": 30,
    "restBetweenReps": 15,
    "numberOfSets": 3,
    "restBetweenSets": 60,
    "duration": 1234000,         // milliseconds
    "completedAt": "2024-03-28T14:30:00Z",
    "totalReps": 15,             // reps × sets
    "totalSets": 3
  },
  // ... up to 10 entries
]
```

### Preset ID Generation Algorithm

```javascript
// Input: config object
// Output: preset ID string

function generatePresetId(config) {
  return `${config.secondsPerRep}s-${config.restBetweenReps}s-${config.repsPerSet}r-${config.numberOfSets}s-${config.restBetweenSets}rs`;
}

// Examples:
// 30s-15s-5r-3s-60rs
// 45s-20s-4r-4s-90rs
// 10s-5s-10r-5s-120rs
```

### Cookie Size Estimates

```
Per Preset Cookie:
  {config + timestamps} ≈ 200 bytes
  × 50 presets = 10KB (well under 4KB limit? → use indexed cookies)

History Cookie:
  10 workouts × 300 bytes = 3KB

Total: ~13KB (fine, browsers support 4-10MB per domain)
```

**Note:** If preset storage grows too large, implement preset pagination or split into multiple cookies.

---

## State Management

### Global App State

```javascript
// Main state object
const appState = {
  // Current view
  currentView: 'quick-setup', // 'quick-setup' | 'advanced-setup' | 'workout' | 'history'

  // Workout configuration
  config: {
    repsPerSet: 5,
    secondsPerRep: 30,
    restBetweenReps: 15,
    numberOfSets: 3,
    restBetweenSets: 60
  },

  // Active workout state
  workout: {
    isActive: false,
    isPaused: false,
    elapsedTime: 0,           // milliseconds
    startTime: null,          // timestamp when workout started
    pausedTime: null,         // timestamp when paused
    pausedDuration: 0,        // total pause duration

    // Current progress
    currentSet: 1,            // 1 to numberOfSets
    currentRep: 1,            // 1 to repsPerSet
    phase: 'countdown',       // 'countdown' | 'working' | 'resting' | 'set-rest'
    phaseStartTime: null,     // when current phase started

    // Scheduled events
    nextToneTime: null,       // milliseconds when next tone should play
    nextPhaseTime: null       // milliseconds when phase ends
  },

  // UI state
  ui: {
    selectedPresetId: null,   // currently selected preset
    showPresetList: false,
    showHistory: false
  }
};
```

### State Transitions Diagram

```
App Start
  ↓
┌─────────────────────┐
│  QUICK SETUP VIEW   │
│                     │
│ [Start] → Config    │
│ [Change] → Presets  │
│ [History] → History │
│ [Advanced] → Advanced
└─────────────────────┘
  ↓         ↓            ↓
Workout  Advanced    Presets
Loading  Setup       List
  ↓         ↓            ↓
  └─────────┴────────────┘
           ↓
    ┌─────────────────────┐
    │  WORKOUT RUNNING    │
    │                     │
    │ Phase: countdown    │
    │ Phase: working      │
    │ Phase: resting      │
    │ Phase: set-rest     │
    │                     │
    │ [Pause] [Reset]     │
    │ [Stop] → quick-setup
    └─────────────────────┘
           ↓
    ┌─────────────────────┐
    │  WORKOUT PAUSED     │
    │                     │
    │ [Resume] [Reset]    │
    │ [Stop] → quick-setup
    └─────────────────────┘
```

### State Update Patterns

```javascript
// View changes
appState.currentView = 'workout';

// Config updates (from user input)
appState.config = { ...appState.config, secondsPerRep: 45 };

// Workout state during runtime (called every 10ms)
appState.workout.elapsedTime = Date.now() - appState.workout.startTime;
appState.workout.currentRep = calculateCurrentRep(appState);
appState.workout.phase = calculateCurrentPhase(appState);
```

---

## UI Specifications

### Color Palette (Dark Mode)

```css
/* Primary Colors */
--bg-primary:       #0f172a;   /* Very dark blue - main background */
--bg-secondary:     #1e293b;   /* Dark slate - secondary background */
--bg-tertiary:      #334155;   /* Medium gray - hover states */

/* Text Colors */
--text-primary:     #f1f5f9;   /* Light gray - primary text */
--text-secondary:   #94a3b8;   /* Medium gray - secondary text */
--text-muted:       #64748b;   /* Darker gray - disabled text */

/* Accent Colors */
--accent-primary:   #0ea5e9;   /* Cyan/Sky blue - primary actions */
--accent-hover:     #0284c7;   /* Darker cyan - hover state */

/* Status Colors */
--status-working:   #10b981;   /* Emerald green - active rep */
--status-resting:   #f59e0b;   /* Amber - rest phase */
--status-countdown: #ec4899;   /* Pink - countdown phase */

/* Buttons & Interactive */
--button-bg:        #0ea5e9;
--button-hover:     #0284c7;
--button-active:    #0369a1;
--button-disabled:  #475569;
```

### Typography

```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;

/* Font Sizes */
--font-xs:    0.75rem;    /* 12px - small labels */
--font-sm:    0.875rem;   /* 14px - body text */
--font-base:  1rem;       /* 16px - default */
--font-lg:    1.125rem;   /* 18px - headings */
--font-xl:    1.5rem;     /* 24px - large headings */
--font-2xl:   2rem;       /* 32px - section headings */
--font-4xl:   4rem;       /* 64px - timer display */

/* Font Weights */
font-weight: 400;         /* Regular text */
font-weight: 500;         /* Labels, buttons */
font-weight: 600;         /* Headings */
font-weight: 700;         /* Bold headings */
```

### Responsive Breakpoints

```css
/* Mobile First */
$mobile:     360px;       /* Min width */
$mobile-lg:  430px;       /* iPhone 14/15 */
$tablet:     768px;       /* iPad */
$desktop:    1024px;      /* Large screens */

/* Media Queries */
@media (min-width: 768px) { /* Tablet and up */ }
@media (min-width: 1024px) { /* Desktop and up */ }
```

### View Layouts

#### View 1: Quick Setup

```
┌─────────────────────────────────┐
│ Advanced Stopwatch (header)     │
├─────────────────────────────────┤
│                                 │
│ Quick Preset Setup              │
│                                 │
│ Work per Rep:                   │
│ ┌─────────────────────────────┐ │
│ │ 30s              ▼          │ │ (dropdown/input)
│ └─────────────────────────────┘ │
│                                 │
│ Rest between Reps:              │
│ ┌─────────────────────────────┐ │
│ │ 15s              ▼          │ │
│ └─────────────────────────────┘ │
│                                 │
│ Reps per Set:                   │
│ ┌─────────────────────────────┐ │
│ │ 5                ▼          │ │
│ └─────────────────────────────┘ │
│                                 │
│ Number of Sets:                 │
│ ┌─────────────────────────────┐ │
│ │ 3                ▼          │ │
│ └─────────────────────────────┘ │
│                                 │
│ Rest between Sets:              │
│ ┌─────────────────────────────┐ │
│ │ 60s              ▼          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   START WORKOUT (primary)   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Advanced Setup (secondary)  │ │
│ └─────────────────────────────┘ │
│                                 │
│ Recent Presets:                 │
│ • 30s/15s/5r/3s/60rs           │
│ • 45s/20s/4r/4s/90rs           │
│ • 10s/5s/10r/5s/120rs          │
│                                 │
│ ┌─────────────────────────────┐ │
│ │      View History (link)    │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

#### View 2: Advanced Setup

```
┌─────────────────────────────────┐
│ Detailed Configuration (header) │
├─────────────────────────────────┤
│                                 │
│ Reps per Set:                   │
│ ┌─────────────────────────────┐ │
│ │ 5                           │ │ (number input)
│ └─────────────────────────────┘ │
│                                 │
│ Seconds per Rep:                │
│ ┌─────────────────────────────┐ │
│ │ 30                          │ │
│ └─────────────────────────────┘ │
│                                 │
│ Rest between Reps (sec):        │
│ ┌─────────────────────────────┐ │
│ │ 15                          │ │
│ └─────────────────────────────┘ │
│                                 │
│ Number of Sets:                 │
│ ┌─────────────────────────────┐ │
│ │ 3                           │ │
│ └─────────────────────────────┘ │
│                                 │
│ Rest between Sets (sec):        │
│ ┌─────────────────────────────┐ │
│ │ 60                          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌──────────────┬──────────────┐ │
│ │ Back         │ Start Workout│ │
│ └──────────────┴──────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   Save as Preset (link)     │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

#### View 3: Active Workout

```
┌─────────────────────────────────┐
│ Advanced Stopwatch (header)     │
├─────────────────────────────────┤
│                                 │
│ Rep 2 / Set 1                   │
│ Status: WORKING                 │ (color coded)
│                                 │
│ ╔═════════════════════════════╗ │
│ ║                             ║ │
│ ║        00:23                ║ │ (4rem font)
│ ║      [Elapsed Time]         ║ │
│ ║                             ║ │
│ ╚═════════════════════════════╝ │
│                                 │
│ Next: Rest (12 seconds)         │
│                                 │
│ ┌──────────────┬──────────────┐ │
│ │ Pause        │ Reset        │ │
│ └──────────────┴──────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │       Stop Workout          │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

#### View 4: Workout History

```
┌─────────────────────────────────┐
│ Workout History (header)        │
├─────────────────────────────────┤
│                                 │
│ Past Workouts (10 max):         │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 30s/15s/5r/3s/60rs          │ │
│ │ Today at 2:30 PM            │ │
│ │ Duration: 5:45              │ │
│ │ 15 total reps               │ │ (clickable)
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 45s/20s/4r/4s/90rs          │ │
│ │ Yesterday at 10:15 AM       │ │
│ │ Duration: 11:20             │ │
│ │ 16 total reps               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │       Back to Setup (link)  │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## Workout Logic & Flow

### Workout State Machine

```
┌──────────────────────────────────────────────────────────────┐
│                    WORKOUT STATES                             │
└──────────────────────────────────────────────────────────────┘

START BUTTON CLICKED
  ↓
┌─────────────────────┐
│ COUNTDOWN (3 sec)   │
│ ♪ Beep 1, Beep 2, 3│  
└─────────────────────┘
  ↓
┌─────────────────────┐
│ WORKING             │  ← Timer counting up
│ Rep 1 / Set 1       │
│ Work Time = 30s     │
│ ♪ Start Tone (440Hz)
└─────────────────────┘
  │ 30s elapsed
  ↓
┌─────────────────────┐
│ RESTING (Rep Rest)  │
│ Rep 1 complete      │  ← Timer counting down
│ Rest Time = 15s     │
│ ♪ Stop Tone (880Hz)
└─────────────────────┘
  │ 15s elapsed
  ↓
  ├─→ More reps in set? → Back to WORKING (Rep 2)
  │
  └─→ Last rep in set? → WORKING (final rep + tone)
       (Rep 5 / Set 1)
       │ 30s elapsed
       ↓
    ┌─────────────────────┐
    │ SET RESTING         │
    │ Set 1 complete      │
    │ Rest Time = 60s     │
    │ ♪ Stop Tone (880Hz)
    └─────────────────────┘
      │ 60s elapsed
      ↓
      ├─→ More sets? → 3-second COUNTDOWN (Set 2)
      │   ♪ Beep 1, Beep 2, Beep 3
      │   ↓
      │   Back to WORKING (Rep 1 / Set 2)
      │
      └─→ Last set? → FINISHED
          Show completion summary
          Save to history
          Return to quick-setup
```

### Timing Calculations

```javascript
// Given config:
// repsPerSet = 5
// secondsPerRep = 30
// restBetweenReps = 15
// numberOfSets = 3
// restBetweenSets = 60

// Single Rep Cycle
repCycleDuration = secondsPerRep + restBetweenReps
                 = 30 + 15 = 45 seconds

// Set Duration (reps only, not set rest)
setDuration = (repsPerSet * secondsPerRep) + ((repsPerSet - 1) * restBetweenReps)
            = (5 * 30) + (4 * 15)
            = 150 + 60 = 210 seconds (3.5 min)

// Total Workout Duration
totalDuration = (setDuration * numberOfSets) + ((numberOfSets - 1) * restBetweenSets) + 3
              = (210 * 3) + (2 * 60) + 3
              = 630 + 120 + 3 = 753 seconds (12.55 min)

// Event Timeline
0:00   - 3-second countdown starts
0:03   - Start Tone, Rep 1 work begins
0:33   - Stop Tone, Rep 1 rest begins (15s)
0:48   - Start Tone, Rep 2 work begins
1:18   - Stop Tone, Rep 2 rest begins
... (repeat for reps 3-5)
3:33   - Stop Tone, Rep 5 rest begins
3:48   - Stop Tone, Set 1 complete, Set rest begins (60s)
4:48   - 3-second countdown for Set 2
4:51   - Start Tone, Set 2, Rep 1 begins
... (repeat pattern for Set 2 and Set 3)
12:30  - Workout Complete!
```

### Phase Detection Algorithm

```javascript
function getCurrentPhase(elapsedTime, config) {
  // Countdown phase (first 3 seconds)
  if (elapsedTime < 3000) return 'countdown';

  // Adjust for countdown
  let workoutTime = elapsedTime - 3000;

  // Calculate which rep/set and what phase
  const cycleDuration = (config.secondsPerRep + config.restBetweenReps) * 1000;
  const setDuration = (config.repsPerSet * config.secondsPerRep + 
                       (config.repsPerSet - 1) * config.restBetweenReps) * 1000;
  const fullSetCycleDuration = setDuration + config.restBetweenSets * 1000;

  // Which set are we in?
  const currentSetCycle = workoutTime % fullSetCycleDuration;
  const currentSet = Math.floor(workoutTime / fullSetCycleDuration) + 1;

  // Within the set, which rep?
  if (currentSetCycle < setDuration) {
    // In active set
    const repCycle = currentSetCycle % cycleDuration;
    const workPhaseTime = config.secondsPerRep * 1000;
    
    if (repCycle < workPhaseTime) {
      return { phase: 'working', set: currentSet };
    } else {
      return { phase: 'resting', set: currentSet };
    }
  } else {
    // In set rest period
    return { phase: 'set-rest', set: currentSet };
  }
}
```

### Audio Trigger Points

| Event | Tone | When | How |
|-------|------|------|-----|
| **Countdown Start** | 3 beeps (523Hz, 659Hz, 784Hz) | T=0, T=1s, T=2s | Web Audio API |
| **Rep Start** | Start Tone (440Hz, 200ms) | When rest ends, rep begins | Scheduled in tick() |
| **Rep End** | Stop Tone (880Hz, 200ms) | When work time expires | Scheduled in tick() |
| **Set Rest Start** | Stop Tone (880Hz, 200ms) | After last rep in set | Scheduled in tick() |
| **Set Start Countdown** | 3 beeps | 3 seconds before set begins | Scheduled in tick() |

---

## Implementation Tasks

### Phase 1: Foundation & Structure
**Estimated: 2 hours**

- [ ] **1.1** Initialize Git repository
  - [ ] Create .gitignore (node_modules, .DS_Store, etc.)
  - [ ] Create initial commit with folder structure

- [ ] **1.2** Create HTML skeleton (index.html)
  - [ ] DOCTYPE, meta tags, responsive viewport
  - [ ] Theme color meta tags
  - [ ] Root div for app container
  - [ ] Script loading order (main.js last)
  - [ ] No inline styles, all in styles.css

- [ ] **1.3** Create base CSS (styles.css)
  - [ ] CSS variables (colors, fonts, spacing)
  - [ ] Reset/normalize (box-sizing, margins, padding)
  - [ ] Base typography (font-family, sizes, weights)
  - [ ] Dark mode color scheme
  - [ ] Responsive breakpoints (@media queries)
  - [ ] Utility classes (text-center, text-muted, etc.)
  - [ ] Button & input base styles

### Phase 2: Core State Management
**Estimated: 1.5 hours**

- [ ] **2.1** Implement storage.js (180 lines)
  - [ ] `PresetManager` class
  - [ ] `generatePresetId(config)` - format: "30s-15s-5r-3s-60rs"
  - [ ] `savePreset(config)` - cookie: stopwatch_preset_{id}
  - [ ] `loadPreset(id)` - retrieve from cookie
  - [ ] `getAllPresets()` - list all preset cookies
  - [ ] `deletePreset(id)` - remove cookie
  - [ ] `addToHistory(config, duration)` - update stopwatch_history cookie
  - [ ] `getHistory()` - retrieve last 10 workouts
  - [ ] Cookie expiration logic (30 days, auto-extend on use)

- [ ] **2.2** Initialize app state object in main.js
  - [ ] appState structure with currentView, config, workout, ui
  - [ ] Default config values
  - [ ] State validation functions

### Phase 3: Audio System
**Estimated: 1 hour**

- [ ] **3.1** Implement audio.js (120 lines)
  - [ ] `AudioManager` class
  - [ ] `playStartTone()` - 440Hz, 200ms sine wave
  - [ ] `playStopTone()` - 880Hz, 200ms sine wave
  - [ ] `playCountdownBeep(sequence)` - 523Hz, 659Hz, 784Hz
  - [ ] Error handling for Web Audio API
  - [ ] Tone generation using Oscillator nodes
  - [ ] Gain envelope (attack/release)

### Phase 4: Workout Engine
**Estimated: 2 hours**

- [ ] **4.1** Implement workout.js (350 lines)
  - [ ] `WorkoutEngine` class
  - [ ] `start(config)` - initialize workout state
  - [ ] `tick()` - called every 10ms, calculate current phase
  - [ ] `pause()` - pause timer
  - [ ] `resume()` - resume timer
  - [ ] `reset()` - reset to start
  - [ ] `stop()` - end workout
  - [ ] `getCurrentRep()` - calculate rep number
  - [ ] `getCurrentSet()` - calculate set number
  - [ ] `getCurrentPhase()` - 'countdown' | 'working' | 'resting' | 'set-rest'
  - [ ] `getTimeRemaining()` - seconds until phase end
  - [ ] `getElapsedTime()` - formatted MM:SS
  - [ ] Phase transition logic with audio cues
  - [ ] Countdown phase handling (3 beeps)

### Phase 5: UI Rendering & Interactivity
**Estimated: 3 hours**

- [ ] **5.1** Implement ui.js - Quick Setup (140 lines)
  - [ ] `renderQuickSetup()` - main view template
  - [ ] Input/dropdown for each of 5 parameters
  - [ ] [Start Workout] button handler
  - [ ] [Advanced] button → switch to advanced-setup view
  - [ ] Recent presets list (click to select)
  - [ ] [View History] link

- [ ] **5.2** Implement ui.js - Advanced Setup (120 lines)
  - [ ] `renderAdvancedSetup()` - detailed config view
  - [ ] Number inputs for all 5 parameters (with min/max validation)
  - [ ] [Back] button → return to quick-setup
  - [ ] [Start Workout] button → start with custom config
  - [ ] [Save as Preset] button → save with auto-generated name
  - [ ] Input validation (1-300 seconds, 1-50 reps/sets)

- [ ] **5.3** Implement ui.js - Workout View (200 lines)
  - [ ] `renderWorkout()` - active workout display
  - [ ] Large elapsed time counter (4rem font)
  - [ ] Rep/Set counter "Rep 2 / Set 1"
  - [ ] Phase status with color coding (WORKING=green, RESTING=amber)
  - [ ] Next phase countdown "Next: Rest (12s)"
  - [ ] [Pause] / [Resume] buttons (toggle on pause state)
  - [ ] [Reset] button with confirmation dialog
  - [ ] [Stop] button → save to history, return to quick-setup
  - [ ] `updateWorkoutDisplay(elapsedTime)` - live updates

- [ ] **5.4** Implement ui.js - History View (90 lines)
  - [ ] `renderHistory()` - past 10 workouts
  - [ ] Each workout shows: preset, date, duration, total reps
  - [ ] Click workout to load preset
  - [ ] [Back] button to quick-setup

- [ ] **5.5** Add responsive styles (css/styles.css)
  - [ ] Quick Setup view styles
  - [ ] Advanced Setup view styles
  - [ ] Workout view styles (responsive timer, large fonts)
  - [ ] History view styles
  - [ ] Button styles (primary, secondary, disabled states)
  - [ ] Input styles (focus, error states)
  - [ ] Mobile breakpoints (430px+)
  - [ ] Touch-friendly sizes (44px+ buttons)

### Phase 6: Main Application Controller
**Estimated: 1.5 hours**

- [ ] **6.1** Implement main.js (400 lines)
  - [ ] Module initialization (load all JS files)
  - [ ] `initApp()` - start app, render quick-setup
  - [ ] `switchView(viewName)` - router for views
  - [ ] Event delegation (global click handlers)
  - [ ] [Start Workout] click → start timer, switch to workout view
  - [ ] [Advanced] click → switch to advanced-setup view
  - [ ] [Change] click → show preset selector
  - [ ] [Save as Preset] click → save and notify user
  - [ ] [Pause] click → pause timer
  - [ ] [Resume] click → resume timer
  - [ ] [Reset] click → reset with confirmation
  - [ ] [Stop] click → stop timer, save to history, return to quick-setup
  - [ ] [Back] click → return to previous view
  - [ ] Timer loop management (setInterval 10ms)
  - [ ] Error handling & logging

- [ ] **6.2** Update HTML with view containers
  - [ ] `<div id="quick-setup">` container
  - [ ] `<div id="advanced-setup">` container
  - [ ] `<div id="workout">` container
  - [ ] `<div id="history">` container
  - [ ] Script loading in correct order

### Phase 7: Testing & Validation
**Estimated: 1.5 hours**

- [ ] **7.1** Manual functional testing
  - [ ] Quick setup loads with default values
  - [ ] Can start workout immediately
  - [ ] Timer counts up correctly
  - [ ] Audio tones play at correct times (use browser console)
  - [ ] Pause/resume works
  - [ ] Reset clears timer
  - [ ] Stop saves to history
  - [ ] Advanced setup accepts all inputs
  - [ ] Presets save and load correctly
  - [ ] Cookies persist across browser closes
  - [ ] History shows last 10 workouts

- [ ] **7.2** Mobile testing
  - [ ] Test on iPhone 12/13/14/15 (simulator or device)
  - [ ] Portrait orientation only
  - [ ] No horizontal scrolling
  - [ ] Buttons are touch-friendly (44px+)
  - [ ] Fonts are readable at all sizes
  - [ ] Colors meet contrast requirements (WCAG AA)

- [ ] **7.3** Browser compatibility
  - [ ] Chrome 90+ (latest)
  - [ ] Firefox 88+ (latest)
  - [ ] Safari 14+ (latest)
  - [ ] Edge (Chromium-based)
  - [ ] Mobile Safari on iOS

- [ ] **7.4** Performance testing
  - [ ] Page load < 1 second
  - [ ] Timer updates smooth (no jank)
  - [ ] No memory leaks on long workouts
  - [ ] Minified JS + CSS < 10KB total

### Phase 8: Documentation & Deployment
**Estimated: 1 hour**

- [ ] **8.1** Create README.md
  - [ ] Project overview & features
  - [ ] How to use (quick start)
  - [ ] Feature descriptions
  - [ ] Browser support
  - [ ] License info
  - [ ] Future improvements

- [ ] **8.2** GitHub Pages setup
  - [ ] Create repo: stopwatch-app
  - [ ] Enable GitHub Pages (Settings → Pages → main branch)
  - [ ] Add GitHub Actions for auto-deploy (optional)
  - [ ] Test live URL

- [ ] **8.3** Final checks
  - [ ] Remove console.log() statements
  - [ ] Minify CSS & JS (optional)
  - [ ] Optimize images (none currently)
  - [ ] Validate HTML
  - [ ] Create .gitignore

### Estimated Total Time: ~11 hours

---

## Testing Checklist

### Functional Tests

#### Quick Setup View
- [ ] App loads with Quick Setup view displayed
- [ ] Default values shown: 30s, 15s, 5, 3, 60s
- [ ] Can change each parameter (work, rest reps, reps, sets, rest sets)
- [ ] [Start Workout] starts timer immediately
- [ ] [Advanced] switches to advanced view
- [ ] [Change] shows preset selector
- [ ] Recent presets list displays (if any)
- [ ] [View History] shows past workouts

#### Advanced Setup View
- [ ] All 5 inputs accept numeric values
- [ ] Input validation works (1-300 for time, 1-50 for counts)
- [ ] [Back] returns to quick-setup without losing main state
- [ ] [Start Workout] begins timer with custom values
- [ ] [Save as Preset] creates preset with auto-generated name
- [ ] Preset name format correct: "30s-15s-5r-3s-60rs"

#### Active Workout View
- [ ] Timer displays correctly: MM:SS format
- [ ] Timer counts up continuously
- [ ] Rep/Set counter updates: "Rep 1 / Set 1" → "Rep 2 / Set 1", etc.
- [ ] Phase status shows and color codes correctly
  - [ ] WORKING = green text
  - [ ] RESTING = amber text
  - [ ] SET RESTING = orange text
  - [ ] COUNTDOWN = pink text
- [ ] Next phase shows correct countdown time
- [ ] [Pause] stops timer, button changes to [Resume]
- [ ] [Resume] continues from pause point
- [ ] [Reset] shows confirmation dialog, clears timer on confirm
- [ ] [Stop] saves workout to history, returns to quick-setup

#### Audio Cues
- [ ] 3-beep countdown plays at T=0, T=1s, T=2s
- [ ] Start Tone (440Hz) plays when rep begins
- [ ] Stop Tone (880Hz) plays when rep ends
- [ ] Start Tone plays when rest ends
- [ ] Stop Tone plays when set ends
- [ ] 3-beep countdown plays 3 seconds before next set starts
- [ ] All tones are distinct and audible

#### Preset Management
- [ ] New preset saves to cookie: `stopwatch_preset_{id}`
- [ ] Preset loads correctly from cookie
- [ ] Multiple presets can be saved
- [ ] Preset list shows correct presets
- [ ] Deleting preset removes cookie
- [ ] Preset name auto-generated correctly

#### Workout History
- [ ] Workout saves to `stopwatch_history` cookie
- [ ] History shows last 10 workouts
- [ ] Each history item shows: preset, date, duration
- [ ] Clicking history item loads that preset
- [ ] Oldest item removed when 11th added
- [ ] History persists across browser closes

#### Responsive Design
- [ ] Mobile (375px-430px): No horizontal scroll, readable fonts
- [ ] Tablet (768px+): Centered, larger fonts, good spacing
- [ ] Desktop (1024px+): Comfortable padding, optimal width
- [ ] Portrait orientation: Buttons 44px+ (touch-friendly)
- [ ] All text readable in dark mode
- [ ] Form inputs accessible and usable on mobile

#### Browser & Storage
- [ ] Works on Chrome 90+
- [ ] Works on Firefox 88+
- [ ] Works on Safari 14+
- [ ] Cookies persist across tab closes
- [ ] No console errors
- [ ] No memory leaks (DevTools check)

### Performance Tests

- [ ] Initial page load < 1 second
- [ ] Timer updates smooth (60 FPS, no jank)
- [ ] No lag during 30-minute workouts
- [ ] Total JS size < 15KB (minified, uncompressed)
- [ ] Total CSS size < 8KB (minified)

### Edge Cases

- [ ] 0 second rest between reps (skips rest phase)
- [ ] 1 rep, 1 set (minimal workout)
- [ ] 50 reps, 50 sets (long workout, timer accuracy)
- [ ] Pause during countdown phase
- [ ] Resume after pause
- [ ] Reset mid-workout
- [ ] Multiple rapid button clicks (debounce if needed)
- [ ] Browser refresh during workout (state recovery)

---

## Deployment Guide

### Prerequisites
- GitHub account
- Git installed locally
- Node.js (optional, for minification)

### Step 1: Create Repository

```bash
# Create new repo on GitHub
# Name: stopwatch-app
# Description: Advanced stopwatch for timed workouts
# Public (to enable GitHub Pages)
# No template

# Clone locally
git clone https://github.com/{username}/stopwatch-app.git
cd stopwatch-app
```

### Step 2: Initialize Project Structure

```bash
# Create directories
mkdir css js

# Files to create:
# - index.html
# - css/styles.css
# - js/main.js, ui.js, workout.js, audio.js, storage.js
# - README.md
# - .gitignore

# Create .gitignore
echo "
.DS_Store
node_modules/
*.log
.env
dist/
.vscode/
" > .gitignore
```

### Step 3: Enable GitHub Pages

1. Push to main branch:
```bash
git add .
git commit -m "Initial project structure"
git push -u origin main
```

2. Go to GitHub repo Settings → Pages
3. Source: main branch, root directory
4. Save

### Step 4: Verify Deployment

- Wait 1-2 minutes
- Check: https://`{username}`.github.io/stopwatch-app/
- Should see Quick Setup view

### Step 5: Enable Auto-Deploy (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Minify CSS
        run: |
          npm install -g cssnano-cli
          cssnano css/styles.css -o css/styles.min.css
      - name: Minify JS
        run: |
          npm install -g terser
          terser js/*.js -o js/app.min.js -c -m
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

### Step 6: Future Updates

```bash
# Make changes locally
git add .
git commit -m "Feature: Add preset deletion"
git push origin main

# Changes auto-deploy to GitHub Pages
```

---

## Appendices

### A. Keyboard Shortcuts (Optional Future Feature)

```
Space: Pause/Resume
R: Reset
S: Stop
A: Advanced Setup
H: History
```

### B. Future Enhancements

1. **Sound Customization** - Choose tone types (beep, musical notes, voice)
2. **Dark/Light Theme Toggle** - Add light mode option
3. **Vibration Feedback** - Haptic feedback on mobile
4. **Interval Export** - Download workout as CSV
5. **Multi-language Support** - i18n for different languages
6. **Accessibility** - Voice announcements, keyboard navigation
7. **PWA Support** - Install as app on home screen
8. **Analytics** - Track weekly/monthly stats
9. **Social Sharing** - Share workouts with friends
10. **Sync** - Cloud storage across devices (Firebase?)

### C. Troubleshooting Guide

**Problem: Audio not playing**
- Check browser permissions for audio
- Verify Web Audio API support (all modern browsers)
- Check volume on device
- Test in different browser

**Problem: Cookies not persisting**
- Check if browser allows cookies (private/incognito mode?)
- Check cookie settings in browser preferences
- Cookies require HTTPS on some browsers (GitHub Pages = HTTPS ✓)

**Problem: Timer not counting up smoothly**
- Check system performance (too many background apps)
- Verify browser isn't throttling JS execution
- Check DevTools for errors

**Problem: Wrong preset loaded**
- Clear browser cookies and try again
- Check preset name format in storage
- Verify JSON serialization in cookie

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-03-28 | Initial complete plan document |

---

**This plan is the single source of truth for the Advanced Stopwatch App project. Refer to this document whenever you need clarification on features, tech stack, or implementation tasks.**

