# React Native Migration Plan: Advanced Stopwatch to iOS

**Status:** Planning Complete - Ready for Phase 1 Implementation  
**Last Updated:** March 30, 2026  
**Target Platform:** iOS 16+  
**Development Approach:** Bare React Native (not Expo)  
**Code Reuse:** 65-70% of existing business logic

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Clarifications & Requirements](#clarifications--requirements)
3. [Project Structure](#project-structure)
4. [Code Reuse Mapping](#code-reuse-mapping)
5. [Dependencies & Libraries](#dependencies--libraries)
6. [Native Module Architecture](#native-module-architecture)
7. [8-Phase Implementation Roadmap](#8-phase-implementation-roadmap)
8. [AsyncStorage Schema](#asyncstorage-schema)
9. [Testing Strategy](#testing-strategy)
10. [Risk Assessment](#risk-assessment)
11. [Key Decisions & Trade-offs](#key-decisions--trade-offs)

---

## Executive Summary

### Goal
Convert the production-ready Advanced Stopwatch web app into a native iOS React Native app with full feature parity, keep-awake functionality, and background audio playback.

### Why React Native?
- **Keep-awake requirement** → Need native control (critical feature)
- **Background audio** → Requires iOS AVAudioSession configuration
- **100% offline** → No network needed (AsyncStorage for local data)
- **Code reuse** → 65-70% of business logic ports directly
- **Bare RN chosen** → Better native control than Expo

### Approach
1. **Reuse 100%** of `WorkoutEngine`, `StorageManager`, utilities
2. **Adapt 70%** of `AudioManager` (Web Audio API → react-native-audio-toolkit)
3. **Rebuild 50%** of UI (HTML/CSS → React Native components)
4. **Integrate native** modules for keep-awake and background audio
5. **Maintain web version** completely untouched on GitHub Pages

### Success Criteria
- ✅ All web app features present in native version
- ✅ Keep-awake working (screen stays on during workout)
- ✅ Background audio working (tones continue when phone locked)
- ✅ 100% offline functionality
- ✅ Full feature parity with web app
- ✅ Separate storage (no sync with web version)
- ✅ Distribution via signed .ipa file

---

## Clarifications & Requirements

### Confirmed Decisions

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| **RN Type** | Bare React Native | Native module control essential |
| **iOS Version** | iOS 16+ | Modern features, simpler APIs |
| **Storage** | Separate | Independent from web app |
| **Features** | 100% parity | All web features present |
| **Background Audio** | Continuous tones | No pause when locked |
| **Notifications** | None required | Just audio tones needed |
| **Timeline** | No deadline | Quality over speed |
| **Distribution** | .ipa file sharing | Direct distribution |

### Core Requirements

**Functional Requirements:**
- Quick Setup screen with preset defaults
- Advanced Setup for custom configuration
- Active Workout with timer, phase tracking, pause/resume/stop
- Audio cues (start tone, stop tone, countdown pattern)
- Preset management (save, load, delete, list)
- Workout history (last 10 completed workouts)
- Responsive mobile UI with dark mode

**Non-Functional Requirements:**
- Keep screen awake during active workout
- Continue audio playback when phone is locked
- 100% offline operation
- Persistent local storage (AsyncStorage)
- Performance: 10ms timer tick (60+ FPS UI)
- Battery efficient (minimize CPU usage at rest)
- iOS 16+ compatibility

---

## Project Structure

### Directory Layout

```
stopwatch-rn/                                    # Root React Native project
├── ios/                                         # Native iOS code (managed by Xcode)
│   ├── StopwatchApp.xcodeproj/                 # Xcode project
│   ├── StopwatchApp/                           # iOS app bundle
│   │   ├── Info.plist                          # App configuration
│   │   ├── AppDelegate.mm                      # Entry point (modified)
│   │   ├── RCTKeepAwakeModule.m                # Keep-awake native module
│   │   └── RCTAudioSessionModule.m             # Audio session native module
│   ├── Podfile                                 # CocoaPods configuration
│   └── Pods/                                   # CocoaPods dependencies
│
├── src/                                         # JavaScript application source
│   ├── business-logic/                         # Core logic (100% reusable from web)
│   │   ├── WorkoutEngine.ts                    # Timer engine (from workout.js)
│   │   ├── AudioManager.ts                     # Audio adapter (from audio.js)
│   │   ├── StorageManager.ts                   # Storage adapter (from storage.js)
│   │   └── utilities.ts                        # Helper functions
│   │
│   ├── native-modules/                         # Native bridge modules
│   │   ├── KeepAwakeModule.ts                  # Keep-awake JS bridge
│   │   ├── AudioSessionModule.ts               # Audio session JS bridge
│   │   └── index.ts                            # Module exports
│   │
│   ├── navigation/                             # React Navigation
│   │   ├── RootNavigator.tsx                   # Navigation structure
│   │   ├── types.ts                            # Route types
│   │   └── LinkingConfiguration.ts             # Deep linking config
│   │
│   ├── screens/                                # Screen components (rebuilt from web)
│   │   ├── QuickSetupScreen.tsx                # Quick preset setup
│   │   ├── AdvancedSetupScreen.tsx             # Advanced configuration
│   │   ├── WorkoutScreen.tsx                   # Active workout display
│   │   ├── HistoryScreen.tsx                   # Workout history
│   │   └── index.ts                            # Exports
│   │
│   ├── components/                             # Reusable UI components
│   │   ├── Button.tsx                          # Button variants
│   │   ├── Input.tsx                           # Text input
│   │   ├── Timer.tsx                           # Large timer display
│   │   ├── WorkoutList.tsx                     # List component
│   │   ├── Modal.tsx                           # Confirmation dialogs
│   │   └── index.ts                            # Exports
│   │
│   ├── styles/                                 # Theme and styles
│   │   ├── theme.ts                            # Color, spacing, typography
│   │   ├── globalStyles.ts                     # Global StyleSheets
│   │   └── responsive.ts                       # Screen size utilities
│   │
│   ├── hooks/                                  # Custom React hooks
│   │   ├── useWorkout.ts                       # Workout logic hook
│   │   ├── useAudio.ts                         # Audio system hook
│   │   ├── useStorage.ts                       # AsyncStorage hook
│   │   ├── useKeepAwake.ts                     # Keep-awake hook
│   │   └── useBackgroundAudio.ts               # Background audio hook
│   │
│   ├── services/                               # Business logic services
│   │   ├── WorkoutService.ts                   # Workout orchestration
│   │   ├── AudioService.ts                     # Audio management
│   │   ├── StorageService.ts                   # AsyncStorage operations
│   │   ├── KeepAwakeService.ts                 # Keep-awake control
│   │   └── NativeModulesService.ts             # Native module init
│   │
│   ├── types/                                  # TypeScript definitions
│   │   ├── workout.ts                          # Workout types
│   │   ├── audio.ts                            # Audio types
│   │   ├── storage.ts                          # Storage types
│   │   └── navigation.ts                       # Navigation types
│   │
│   ├── context/                                # React Context
│   │   ├── WorkoutContext.tsx                  # Workout state
│   │   └── ThemeContext.tsx                    # Dark mode theme
│   │
│   ├── App.tsx                                 # Root component
│   └── index.tsx                               # Entry point
│
├── __tests__/                                  # Test files
│   ├── business-logic/                         # Logic tests
│   ├── services/                               # Service tests
│   └── components/                             # Component tests
│
├── .env.example                                # Environment template
├── .gitignore                                  # Git ignore rules
├── app.json                                    # RN app config
├── babel.config.js                             # Babel configuration
├── metro.config.js                             # Metro bundler config
├── package.json                                # Dependencies
├── tsconfig.json                               # TypeScript config
├── README.md                                   # Project documentation
├── RN_MIGRATION_PLAN.md                        # This plan document
└── .git/                                       # Separate git repo from web app
```

### Key Organizational Principles

- **Separation of Concerns:** Business logic, UI, services, and native modules are clearly separated
- **AI-Agent Friendly:** Each folder has a single responsibility; files are small and focused
- **TypeScript Throughout:** Full type safety for better IDE support and fewer runtime errors
- **Hook-Based Architecture:** React hooks for cleaner state management and reusability
- **Service Layer:** High-level interfaces between UI and business logic

---

## Code Reuse Mapping

### Category 1: 100% Reusable (Copy & Adapt Types)

#### WorkoutEngine (src/business-logic/WorkoutEngine.ts)
**Source:** `js/workout.js` (~403 lines)  
**Reusability:** 100% (zero logic changes)  
**What's Reused:**
- `WorkoutEngine` class and all methods
- `start()`, `pause()`, `resume()`, `stop()` methods
- `tick()` - 10ms update loop (CRITICAL: must match exactly)
- `updatePhase()` - phase calculation logic
- `checkAndTriggerTones()` - tone trigger detection
- `getState()`, `getPhaseInfo()` accessors
- All timing calculations

**Adaptation:**
- Add TypeScript interfaces for config and state
- Keep all logic identical
- Handle `audioManager.playTone()` calls via injected dependency
- No business logic changes

**Example Port:**
```typescript
// From web app (js/workout.js)
tick() {
  if (!this.state.isActive || this.state.isPaused) return;
  this.state.elapsedTime = Date.now() - this.state.startTime - this.state.pausedDuration;
  this.updatePhase();
  this.checkAndTriggerTones();
}

// Copy to RN with same logic (src/business-logic/WorkoutEngine.ts)
tick(): void {
  if (!this.state.isActive || this.state.isPaused) return;
  this.state.elapsedTime = Date.now() - this.state.startTime - this.state.pausedDuration;
  this.updatePhase();
  this.checkAndTriggerTones();
}
```

#### Utilities (src/business-logic/utilities.ts)
**Source:** Helper functions from `js/main.js`, `js/storage.js`  
**Reusability:** 100%  
**What's Reused:**
- `formatTime(milliseconds)` - MM:SS format
- `formatDate(iso)` - Date formatting
- `generatePresetId(config)` - ID generation pattern
- `parsePresetId(id)` - Reverse parsing
- `validateConfig(config)` - Config validation

---

### Category 2: 90% Reusable (Logic Adapted to New API)

#### StorageManager (src/business-logic/StorageManager.ts)
**Source:** `js/storage.js` (~268 lines)  
**Reusability:** 90% (logic same, API different)  
**What's Reused:**
- `PresetManager` class structure
- `generatePresetId()` logic (exactly same format)
- `savePreset()` logic (operation same)
- `loadPreset()` logic (operation same)
- `deletePreset()` logic (operation same)
- `getAllPresets()` logic (operation same)
- `saveHistory()` logic (same structure)
- `getHistory()` logic (same structure)
- Data structure and serialization patterns

**What Changes:**
- Replace `document.cookie` with AsyncStorage API
- Convert to async/await (was sync)
- Remove `setCookie()`, `getCookie()`, `deleteCookie()` helpers
- Use AsyncStorage methods directly
- Add error handling for async operations
- Add retry logic for storage operations

**Example Port:**
```javascript
// From web app (sync)
savePreset(config) {
  const id = this.generatePresetId(config);
  const value = JSON.stringify(config);
  this.setCookie(this.PRESET_PREFIX + id, value);
  return id;
}

// To RN (async)
async savePreset(config: WorkoutConfig): Promise<string> {
  const id = this.generatePresetId(config);
  const value = JSON.stringify(config);
  try {
    await AsyncStorage.setItem(this.PRESET_PREFIX + id, value);
    return id;
  } catch (error) {
    console.error('Failed to save preset:', error);
    throw error;
  }
}
```

---

### Category 3: 60% Reusable (Patterns Adapted, APIs Changed)

#### AudioManager (src/business-logic/AudioManager.ts)
**Source:** `js/audio.js` (~129 lines)  
**Reusability:** 60% (tone patterns reused, audio API replaced)  
**What's Reused:**
- Tone frequency constants (440Hz, 880Hz, 523Hz, 659Hz, 784Hz)
- Duration values (200ms for tones)
- Volume envelope patterns
- Countdown sequence logic (3 tones at 200ms each)
- Multiple tone playback patterns (e.g., start and stop consecutive)

**What Changes:**
- Replace Web Audio API with `react-native-audio-toolkit`
- Instead of creating oscillators, use library tone generation
- Instead of manual gain/envelope, use library features
- Add iOS audio session management
- Handle background audio differently

**Structure Remains:**
- `playStartTone()` - still exists, same trigger logic
- `playStopTone()` - still exists, same trigger logic
- `playCountdown()` - still exists, same sequence
- Method signatures very similar

**Example Port:**
```javascript
// From web app (Web Audio API)
playTone(frequency, duration, volume = 0.3) {
  if (!this.audioContext) return;
  const now = this.audioContext.currentTime;
  const endTime = now + duration / 1000;
  
  const oscillator = this.audioContext.createOscillator();
  oscillator.frequency.value = frequency;
  const gainNode = this.audioContext.createGain();
  gainNode.gain.setValueAtTime(volume, now);
  gainNode.gain.linearRampToValueAtTime(0, endTime);
  
  oscillator.connect(gainNode);
  gainNode.connect(this.audioContext.destination);
  oscillator.start(now);
  oscillator.stop(endTime);
}

// To RN (using library)
async playTone(frequency: number, duration: number, volume: number = 0.3): Promise<void> {
  try {
    const sound = new Sound();
    // react-native-audio-toolkit generates tone from frequency/duration
    await sound.play(frequency, duration, volume);
  } catch (error) {
    console.error('Tone playback failed:', error);
  }
}
```

---

### Category 4: 50% Reusable (Event Patterns to React Patterns)

#### Main Controller Logic (js/main.js)
**Source:** `js/main.js` (~212 lines)  
**Reusability:** 50% (patterns reused, implementation different)  
**What's Reused:**
- Event flow and state transitions
- User interaction sequences
- View switching logic → Navigation patterns
- Preset loading/saving workflows
- Workout start/pause/resume/stop sequences

**What Rebuilt:**
- DOM event listeners → React event handlers
- Manual view rendering → React component rendering
- CSS selectors → React state and props
- Event delegation patterns → React composition
- Manual DOM updates → useState/useContext

**Maps To:**
- `src/screens/QuickSetupScreen.tsx` - event handlers for setup
- `src/screens/WorkoutScreen.tsx` - event handlers for active workout
- `src/hooks/useWorkout.ts` - workout state management
- `src/services/WorkoutService.ts` - high-level orchestration

---

### Category 5: 20% Reusable (Design Values Only)

#### UI & Styling (css/styles.css + index.html)
**Source:** `css/styles.css` (~805 lines) + `index.html` (~277 lines)  
**Reusability:** 20% (colors/spacing, layout structure)  
**What's Reused:**
- Color palette (#1a1a1a, #333, #fff, etc.)
- Dark mode values
- Typography sizes (4rem for timer)
- Spacing values (padding, margins)
- Border radius values
- Shadow patterns

**What Rebuilt:**
- HTML structure → React Native components
- CSS classes → StyleSheet.create()
- Flexbox → React Native Flexbox
- CSS grid → React Native layout
- Media queries → Responsive utilities
- Animations → React Native Animated API

**Maps To:**
- `src/styles/theme.ts` - color and spacing constants (reused)
- `src/styles/globalStyles.ts` - component styles (rebuilt)
- `src/components/*.tsx` - all UI components (rebuilt)
- `src/screens/*.tsx` - screen layouts (rebuilt)

---

## Dependencies & Libraries

### Core Dependencies

```json
{
  "react": "^18.2.0",
  "react-native": "^0.73.0"
}
```

**Why Bare RN 0.73:**
- iOS 16+ support
- Modern JavaScript features
- Good TypeScript support
- Active maintenance

### Navigation

```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.7",
  "react-native-screens": "^3.26.0",
  "react-native-safe-area-context": "^4.7.2"
}
```

**Why React Navigation:**
- Industry standard
- Excellent iOS support
- Tab-based navigation perfect for app layout
- Good TypeScript support

### Audio System (CRITICAL)

```json
{
  "react-native-audio-toolkit": "^2.0.0"
}
```

**Why audio-toolkit over react-native-sound:**
- Better background audio session management
- Proper iOS AVAudioSession handling
- Recent active development
- Supports playback in background

### Keep-Awake (CRITICAL)

```json
{
  "react-native-keep-awake": "^4.0.0"
}
```

**Provides:**
- Prevents screen lock during workout
- Native iOS implementation
- Zero configuration needed

### Storage

```json
{
  "@react-native-async-storage/async-storage": "^1.21.0"
}
```

**Why AsyncStorage:**
- Purpose-built for React Native
- Simple key-value API
- Persistent across app restarts
- Works 100% offline

### TypeScript

```json
{
  "typescript": "^5.0.0",
  "@types/react": "^18.2.0",
  "@types/react-native": "^0.73.0"
}
```

### Testing

```json
{
  "jest": "^29.0.0",
  "@testing-library/react-native": "^12.0.0",
  "@testing-library/jest-native": "^5.4.0"
}
```

### Development Tools

```json
{
  "babel-jest": "^29.0.0",
  "@babel/core": "^7.23.0",
  "@babel/preset-typescript": "^7.23.0",
  "prettier": "^3.0.0",
  "eslint": "^8.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0"
}
```

### iOS CocoaPods (auto-installed)

Dependencies are automatically managed by CocoaPods when running `pod install`:
- `react-native-audio-toolkit` iOS implementation
- `react-native-keep-awake` iOS implementation
- React Native core dependencies

---

## Native Module Architecture

### Problem Statement

Web Audio API works great for web browsers, but React Native needs a different approach:
1. **Web Audio API not available** in React Native
2. **Background audio requires** proper iOS AVAudioSession configuration
3. **Keep-awake needs** native iOS API access
4. **Screen lock interruptions** must be handled by native code

### Solution: Native Modules Bridge

Bridge pattern: JavaScript → Native Module → iOS API

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Native JavaScript                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  WorkoutScreen                                           │   │
│  │  ├─ await AudioService.playTone(frequency, duration)   │   │
│  │  ├─ await KeepAwakeService.activate()                  │   │
│  │  └─ await BackgroundAudioService.configure()           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                                       │
│                          │                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services (src/services/)                                │   │
│  │  ├─ AudioService.ts → calls AudioManager                │   │
│  │  ├─ KeepAwakeService.ts → calls KeepAwakeModule        │   │
│  │  └─ BackgroundAudioService.ts → calls AudioSessionMod. │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                                       │
│                          │ (Module imports)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Native Modules (src/native-modules/)                    │   │
│  │  ├─ KeepAwakeModule.ts (JS bridge)                       │   │
│  │  ├─ AudioSessionModule.ts (JS bridge)                    │   │
│  │  └─ AudioManager.ts (RN Audio Toolkit adapter)           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                                       │
│                          │ (via NativeModules)                   │
│                          ▼                                       │
├──────────────────────────────────────────────────────────────────┤
│              Native Objective-C/Swift (iOS/)                     │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  RCTKeepAwakeModule.m                                    │   │
│  │  ├─ NSUInteger idleTimerDisabled property                │   │
│  │  ├─ dispatch_async for thread safety                     │   │
│  │  └─ Return success/failure status                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  RCTAudioSessionModule.m                                 │   │
│  │  ├─ [AVAudioSession sharedInstance]                      │   │
│  │  ├─ setCategory:AVAudioSessionCategoryPlayAndRecord      │   │
│  │  ├─ setActive:YES withOptions:AVAudioSessionSetActive..  │   │
│  │  └─ Handle interruptions (calls, alarms)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  iOS System Services                                     │   │
│  │  ├─ AVAudioSession (audio routing + interruptions)       │   │
│  │  ├─ AVAudioEngine (audio playback)                       │   │
│  │  └─ UIApplication (screen state control)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Info.plist Configuration (Critical)

**File:** `ios/StopwatchApp/Info.plist`

Add these keys:

```xml
<!-- Background Modes: Allow audio playback in background -->
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>

<!-- Microphone usage (for audio session) -->
<key>NSMicrophoneUsageDescription</key>
<string>Microphone may be used by background audio session for workout tones</string>

<!-- App display name -->
<key>CFBundleDisplayName</key>
<string>Stopwatch</string>
```

### Native Module 1: KeepAwakeModule

**Purpose:** Prevent screen lock during active workout

**File:** `ios/StopwatchApp/RCTKeepAwakeModule.m`

```objective-c
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(KeepAwakeModule, NSObject)

RCT_EXTERN_METHOD(activate:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deactivate:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
```

**Usage from JavaScript:**
```typescript
// src/native-modules/KeepAwakeModule.ts
import { NativeModules } from 'react-native';

export const KeepAwakeModule = NativeModules.KeepAwakeModule;

// Usage in KeepAwakeService
async function activate() {
  await KeepAwakeModule.activate();
}

async function deactivate() {
  await KeepAwakeModule.deactivate();
}
```

### Native Module 2: AudioSessionModule

**Purpose:** Configure iOS audio session for background playback

**File:** `ios/StopwatchApp/RCTAudioSessionModule.m`

```objective-c
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AudioSessionModule, NSObject)

RCT_EXTERN_METHOD(configureForBackground:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(reset:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
```

**Usage from JavaScript:**
```typescript
// src/native-modules/AudioSessionModule.ts
import { NativeModules } from 'react-native';

export const AudioSessionModule = NativeModules.AudioSessionModule;

// Usage in BackgroundAudioService
async function configure() {
  await AudioSessionModule.configureForBackground();
}

async function reset() {
  await AudioSessionModule.reset();
}
```

### How It Works During Workout

**Startup Sequence (WorkoutScreen mount):**
1. User taps "Start Workout"
2. `KeepAwakeService.activate()` called
   - JavaScript calls → NativeModules.KeepAwakeModule.activate()
   - Native code sets UIApplication.idleTimerDisabled = true
   - Result: Screen won't lock
3. `BackgroundAudioService.configure()` called
   - JavaScript calls → NativeModules.AudioSessionModule.configureForBackground()
   - Native code creates AVAudioSession
   - Sets category: AVAudioSessionCategoryPlayAndRecord
   - Sets options: defaultToSpeaker, duckOthers
   - Result: Audio can play in background
4. `WorkoutEngine.start()` begins
5. Tones play via `react-native-audio-toolkit` using configured session

**During Locked Phone:**
- iPhone is locked (screen off)
- Audio session is active (from Step 3)
- Tones continue playing to speaker
- WorkoutEngine continues ticking every 10ms
- No visual updates (screen off)

**On Unlock:**
- Phone unlocks
- UI immediately responsive
- Workout continues from exact same state

**On Workout Stop:**
1. `KeepAwakeService.deactivate()` called
   - Native code sets UIApplication.idleTimerDisabled = false
   - Screen returns to normal timeout behavior
2. `BackgroundAudioService.reset()` called
   - Native code resets AVAudioSession
   - Audio stops being privileged for background

---

## 8-Phase Implementation Roadmap

### Phase 1: Project Setup & Infrastructure (Est. 2-3 days)

**Goal:** Get bare React Native project initialized, configured, and building for iOS

**Deliverables:**
- ✅ Bare React Native project created with TypeScript
- ✅ All dependencies installed (npm and CocoaPods)
- ✅ Folder structure created per spec
- ✅ iOS build runs successfully on simulator
- ✅ Navigation structure in place (empty screens)
- ✅ Git repository initialized (separate from web app)

**Tasks:**

1. **Create new RN project**
   ```bash
   npx react-native@latest init StopwatchApp --template typescript
   cd StopwatchApp
   ```

2. **Install key dependencies**
   ```bash
   npm install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage react-native-audio-toolkit react-native-keep-awake
   npm install --save-dev typescript @types/react @types/react-native @react-native-community/cli @react-native-community/cli-platform-ios jest @testing-library/react-native prettier eslint
   ```

3. **Configure TypeScript**
   - Create/update `tsconfig.json`
   - Configure paths for imports
   - Enable strict mode

4. **Set up folder structure**
   ```bash
   mkdir -p src/{business-logic,native-modules,navigation,screens,components,styles,hooks,services,types,context}
   mkdir -p __tests__/{business-logic,services,components}
   ```

5. **Configure iOS project**
   - Update `ios/StopwatchApp/Info.plist` with background modes
   - Set minimum iOS version to 16.0 in Podfile
   - Run `cd ios && pod install`

6. **Create basic navigation structure**
   - `src/navigation/RootNavigator.tsx` (empty routes)
   - Bottom tab navigator for: Setup, History
   - Stack navigator for: QuickSetup, AdvancedSetup, Workout

7. **Create App.tsx entry point**
   - Provider setup
   - Navigation container
   - Theme context initialization

8. **Test iOS build**
   ```bash
   npm run ios
   ```
   Should launch app on simulator with empty screens

9. **Initialize git**
   ```bash
   git init
   git add .
   git commit -m "Initial: Create bare React Native project with TypeScript and navigation"
   ```

**Verification Checklist:**
- [ ] `npm run ios` launches without errors
- [ ] App displays on iOS simulator
- [ ] Navigation structure present (can navigate between empty screens)
- [ ] No TypeScript errors
- [ ] Metro bundler runs smoothly
- [ ] Git repository initialized and first commit done

---

### Phase 2: Business Logic Porting (Est. 2-3 days)

**Goal:** Port 100% of business logic from web app with full TypeScript types and tests

**Deliverables:**
- ✅ WorkoutEngine.ts fully ported and tested
- ✅ StorageManager.ts ported with AsyncStorage adaptation
- ✅ utilities.ts with all helpers
- ✅ All TypeScript interfaces defined
- ✅ 85%+ unit test coverage for business logic

**Tasks:**

1. **Create TypeScript interfaces** (`src/types/`)
   ```typescript
   // src/types/workout.ts
   interface WorkoutConfig {
     secondsPerRep: number;
     restBetweenReps: number;
     repsPerSet: number;
     numberOfSets: number;
     restBetweenSets: number;
   }
   
   interface WorkoutState {
     isActive: boolean;
     isPaused: boolean;
     elapsedTime: number; // ms
     currentSet: number;
     currentRep: number;
     phase: 'idle' | 'countdown' | 'working' | 'resting' | 'set-rest';
   }
   ```

2. **Port WorkoutEngine** (`src/business-logic/WorkoutEngine.ts`)
   - Copy logic from `js/workout.js` exactly
   - Add TypeScript types to class and methods
   - No logic changes, only type additions
   - Keep 10ms timer interval exact
   - Add JSDoc comments for clarity

3. **Port StorageManager** (`src/business-logic/StorageManager.ts`)
   - Port logic from `js/storage.js`
   - Replace document.cookie with AsyncStorage
   - Convert all methods to async/await
   - Add error handling and retry logic
   - Keep preset ID format exactly same

4. **Create utilities** (`src/business-logic/utilities.ts`)
   - Time formatting (MM:SS)
   - Date formatting (for history)
   - Preset ID generation
   - Preset ID parsing
   - Config validation

5. **Write unit tests** (`__tests__/business-logic/`)
   ```typescript
   // __tests__/business-logic/WorkoutEngine.test.ts
   describe('WorkoutEngine', () => {
     test('initializes with correct state', () => {});
     test('tick() updates elapsed time', () => {});
     test('updatePhase() transitions correctly', () => {});
     test('checkAndTriggerTones() detects tone points', () => {});
     // ... more tests
   });
   ```

6. **Test AsyncStorage integration**
   - Mock AsyncStorage in tests
   - Test save/load preset operations
   - Test history management
   - Test edge cases (storage full, corrupted data)

**Verification Checklist:**
- [ ] No compilation errors
- [ ] All unit tests pass (85%+ coverage)
- [ ] WorkoutEngine logic identical to web version
- [ ] AsyncStorage operations work correctly
- [ ] Time formatting matches web app exactly
- [ ] Preset ID format unchanged

---

### Phase 3: Audio System Implementation (Est. 2-3 days)

**Goal:** Implement audio tone generation and background playback

**Deliverables:**
- ✅ AudioManager.ts with react-native-audio-toolkit
- ✅ All 5 tone types playing correctly
- ✅ Audio session configured for background
- ✅ Tones play when phone locked
- ✅ AudioService.ts high-level interface

**Tasks:**

1. **Verify react-native-audio-toolkit installation**
   ```bash
   npm ls react-native-audio-toolkit
   cd ios && pod install
   ```

2. **Create AudioManager adapter** (`src/business-logic/AudioManager.ts`)
   - Reuse tone patterns from web app:
     - 440Hz = Start tone
     - 880Hz = Stop tone
     - 523Hz, 659Hz, 784Hz = Countdown pattern
   - Implement using react-native-audio-toolkit
   - Methods:
     - `playStartTone()` - 440Hz 200ms
     - `playStopTone()` - 880Hz 200ms
     - `playCountdown()` - 3-tone pattern
     - `playTone(frequency, duration, volume)`

3. **Create native modules** (Objective-C)
   - `ios/StopwatchApp/RCTKeepAwakeModule.m`
   - `ios/StopwatchApp/RCTAudioSessionModule.m`
   - Implement both as per architecture doc

4. **Update Info.plist**
   - Add UIBackgroundModes with "audio"
   - Add NSMicrophoneUsageDescription

5. **Create AudioService** (`src/services/AudioService.ts`)
   ```typescript
   export class AudioService {
     async playStartTone() { }
     async playStopTone() { }
     async playCountdown() { }
     async initialize() { }
     async cleanup() { }
   }
   ```

6. **Create useAudio hook** (`src/hooks/useAudio.ts`)
   - Initialize audio on mount
   - Provide methods to play tones
   - Cleanup on unmount

7. **Integration with WorkoutEngine**
   - WorkoutEngine calls audioManager.playTone() on tone triggers
   - Service layer abstracts audio implementation
   - Dependency injection pattern for testing

8. **Test on real device**
   - Build to real iPhone
   - Start workout
   - Verify all tones play
   - Lock phone, verify tones continue
   - Unlock, verify tones still playing

**Verification Checklist:**
- [ ] All tone types play correctly on simulator
- [ ] Audio plays on real device
- [ ] Tones play when phone locked
- [ ] Audio session configured (no crashes)
- [ ] Volume is appropriate
- [ ] No audio dropouts during long workouts
- [ ] No compilation errors (native code)

---

### Phase 4: React Native UI Components & Screens (Est. 3-4 days)

**Goal:** Build all UI screens with React Native components, matching web app functionality

**Deliverables:**
- ✅ All 4 screens fully functional
- ✅ Navigation working between screens
- ✅ Dark mode theme applied
- ✅ Responsive for all iPhone sizes
- ✅ Touch-friendly UI

**Screens:**

#### QuickSetupScreen.tsx
- Display default preset values
- Buttons: [Advanced], [Change Preset], [History], [Start Workout]
- Dropdowns for quick adjustments (optional)
- Shows current selected preset info

#### AdvancedSetupScreen.tsx
- 5 input fields (secondsPerRep, restBetweenReps, repsPerSet, numberOfSets, restBetweenSets)
- [Save as Preset] button (stores with auto-generated name)
- [Back] button
- [Start Workout] button
- Input validation

#### WorkoutScreen.tsx
- Large timer display (MM:SS)
- Rep/Set counter ("Rep 3 / Set 2")
- Phase status ("WORKING" / "RESTING" / "SET REST")
- Progress bar or visual indicator
- Control buttons: [Pause], [Resume], [Reset], [Stop]
- Integrate with WorkoutEngine
- Call KeepAwakeService.activate() on mount
- Call KeepAwakeService.deactivate() on unmount

#### HistoryScreen.tsx
- List of last 10 workouts
- Each item shows: date, duration, preset name
- Tap to reload that preset → navigate to QuickSetup
- Delete button on swipe (optional)
- Empty state message if no history

**Components:**

- `Button.tsx` - Primary and secondary variants
- `Input.tsx` - Text/number input with validation
- `Timer.tsx` - Large centered timer (4rem font)
- `WorkoutList.tsx` - List component for presets/history
- `Modal.tsx` - Confirmation dialogs

**Styling:**

- `theme.ts` - Colors, spacing, typography
- `globalStyles.ts` - Component base styles
- `responsive.ts` - Screen size utilities

**Tasks:**

1. **Create theme** (`src/styles/theme.ts`)
   - Extract colors from web app
   - Define spacing (8px base unit)
   - Define typography (fontSize, fontWeight)
   - Define shadow values

2. **Create reusable components** (`src/components/`)
   - Build in isolation with Storybook (optional)
   - Test on multiple screen sizes

3. **Create screens** (`src/screens/`)
   - QuickSetupScreen
   - AdvancedSetupScreen
   - WorkoutScreen
   - HistoryScreen

4. **Set up navigation** (`src/navigation/RootNavigator.tsx`)
   - Bottom tab navigation (Setup / History)
   - Stack navigation within Setup tab
   - Pass params between screens

5. **Create context for state** (`src/context/`)
   - WorkoutContext for current config
   - ThemeContext for dark mode

6. **Connect to business logic**
   - Screens dispatch actions to context
   - Context calls services
   - Services call business logic

7. **Test on simulator**
   - Verify all screens render
   - Test navigation
   - Test touch interactions
   - Verify responsive on different sizes

**Verification Checklist:**
- [ ] All 4 screens render without errors
- [ ] Navigation works (can switch between screens)
- [ ] Touch interactions feel responsive
- [ ] UI responsive on iPhone 12, 13, 14, 15 sizes
- [ ] Dark mode looks good
- [ ] No TypeScript errors
- [ ] No console warnings/errors

---

### Phase 5: Keep-Awake Integration (Est. 1-2 days)

**Goal:** Ensure screen stays awake during workouts

**Deliverables:**
- ✅ KeepAwakeService.ts fully functional
- ✅ useKeepAwake hook for components
- ✅ Integration in WorkoutScreen
- ✅ Tests for keep-awake behavior

**Tasks:**

1. **Verify react-native-keep-awake installation**
   ```bash
   npm ls react-native-keep-awake
   cd ios && pod install
   ```

2. **Create KeepAwakeService** (`src/services/KeepAwakeService.ts`)
   ```typescript
   export class KeepAwakeService {
     async activate(): Promise<void> {
       // Call native module
     }
     
     async deactivate(): Promise<void> {
       // Call native module
     }
   }
   ```

3. **Create useKeepAwake hook** (`src/hooks/useKeepAwake.ts`)
   ```typescript
   export function useKeepAwake(active: boolean) {
     useEffect(() => {
       if (active) {
         KeepAwakeService.activate();
       } else {
         KeepAwakeService.deactivate();
       }
     }, [active]);
   }
   ```

4. **Integrate into WorkoutScreen**
   - Call `useKeepAwake(workoutActive)` on mount
   - Pass `workoutActive` state from context
   - Deactivates automatically on screen unmount

5. **Test on real device**
   - Start workout
   - Wait 30 seconds without touching screen
   - Verify screen stays on (normally would timeout in ~1 min)
   - Stop workout
   - Verify screen returns to normal timeout

**Verification Checklist:**
- [ ] Screen stays awake during workout
- [ ] Screen locks normally after workout
- [ ] No console errors
- [ ] Works on iOS 16+
- [ ] Handles backgrounding correctly

---

### Phase 6: Storage & Persistence (Est. 1-2 days)

**Goal:** Fully integrate AsyncStorage for presets and history

**Deliverables:**
- ✅ StorageService.ts with async operations
- ✅ useStorage hook for components
- ✅ Data persists across app restarts
- ✅ Error handling and edge cases

**Tasks:**

1. **Create StorageService** (`src/services/StorageService.ts`)
   ```typescript
   export class StorageService {
     async savePreset(config: WorkoutConfig): Promise<string>
     async loadPreset(presetId: string): Promise<WorkoutConfig>
     async deletePreset(presetId: string): Promise<void>
     async getAllPresets(): Promise<WorkoutConfig[]>
     async saveHistory(workout: WorkoutHistory): Promise<void>
     async getHistory(): Promise<WorkoutHistory[]>
   }
   ```

2. **Create useStorage hook** (`src/hooks/useStorage.ts`)
   - Wrap async operations
   - Provide loading/error states
   - Handle state updates

3. **Integrate with screens**
   - QuickSetup: Load/save presets
   - AdvancedSetup: Save custom config
   - History: Display and reload

4. **Test data persistence**
   - Create preset, close app, reopen → preset still there
   - Complete workout, close app, reopen → history still there
   - Delete preset → removed from storage

5. **Test edge cases**
   - AsyncStorage quota exceeded → graceful error
   - Corrupted data → fallback to defaults
   - Concurrent operations → no race conditions

**Verification Checklist:**
- [ ] Presets persist across app restarts
- [ ] History persists across app restarts
- [ ] Can save, load, delete presets
- [ ] Can view and reload from history
- [ ] Error handling works
- [ ] No data loss

---

### Phase 7: Integration Testing & Optimization (Est. 2-3 days)

**Goal:** Full end-to-end testing on real device, performance optimization

**Deliverables:**
- ✅ Complete workout flow tested on real device
- ✅ All features working together
- ✅ Performance optimized
- ✅ No crashes or memory leaks

**Test Scenarios:**

**Workout Flow:**
1. Start app
2. Go to Quick Setup
3. Tap [Advanced]
4. Enter custom values
5. Save as preset
6. Back to Quick Setup
7. Tap [Start Workout]
8. Verify timer runs
9. Verify tones play at correct times
10. Pause/Resume several times
11. Lock phone → tones continue
12. Unlock phone → workout continues
13. Tap [Stop]
14. Verify workout added to history
15. Go to History
16. Tap workout → loads preset
17. Start again to verify

**Preset Management:**
1. Create 5+ presets with different names
2. Load each one
3. Verify values match
4. Delete some
5. Verify deleted ones gone

**Edge Cases:**
1. App backgrounded during workout → reopen → continues
2. Phone call interrupt → audio pauses → resumes after call
3. Low battery mode → app continues functioning
4. Device rotation → app handles gracefully
5. Very long workout (30+ minutes) → accuracy maintained

**Performance Testing:**

Use Xcode Instruments:
```
Product → Profile → Xcode Instruments
Instruments → Memory, Energy Impact, CPU
```

- Monitor memory usage during workout
- Verify no memory leaks
- Check battery drain
- Profile CPU usage
- Ensure 60+ FPS in UI

**Tasks:**

1. **Build for real device**
   ```bash
   npm run ios -- --device "iPhone Name"
   ```

2. **Test complete workout flow**
   - Manual step-through of all scenarios above
   - Note any issues
   - Fix and retest

3. **Test on multiple devices** (if available)
   - iPhone 12, 13, 14, 15
   - Different iOS versions (iOS 16, 17, 18)

4. **Profile with Instruments**
   - Memory profiling
   - CPU profiling
   - Energy impact
   - Disk I/O

5. **Optimize based on findings**
   - Reduce re-renders (memoization)
   - Optimize images (if any)
   - Clean up event listeners
   - Optimize WorkoutEngine tick interval

6. **Battery testing**
   - Run workout on low power mode
   - Verify still works
   - Measure battery drain

**Verification Checklist:**
- [ ] Complete workout flow works
- [ ] All features integrated and working
- [ ] Audio quality good
- [ ] No crashes observed
- [ ] Smooth animations (60+ FPS)
- [ ] Memory stable
- [ ] Battery drain acceptable (~1% per 10 min workout)
- [ ] All edge cases handled

---

### Phase 8: Build & Distribution (Est. 1-2 days)

**Goal:** Create signed .ipa file ready for distribution

**Deliverables:**
- ✅ Signed .ipa file
- ✅ Installation instructions
- ✅ App version and build numbers set
- ✅ User guide created

**Tasks:**

1. **Configure version numbers**
   - Edit `ios/StopwatchApp/Info.plist`:
     ```xml
     <key>CFBundleShortVersionString</key>
     <string>1.0.0</string>
     <key>CFBundleVersion</key>
     <string>1</string>
     ```

2. **Set up signing**
   - Open Xcode: `ios/StopwatchApp.xcodeproj`
   - Select project → StopwatchApp target
   - Signing & Capabilities tab
   - Select team (or create account)
   - Set bundle identifier: `com.yourname.stopwatch`
   - Enable automatic signing (or manual if preferred)

3. **Create release scheme** (optional, for clarity)
   - Product → Scheme → New Scheme
   - Name: "Release"
   - Set build configuration to Release

4. **Build for release**
   - Xcode: Product → Build for → Generic iOS Device
   - Or via command:
     ```bash
     xcodebuild -project ios/StopwatchApp.xcodeproj \
       -scheme StopwatchApp \
       -configuration Release \
       -derivedDataPath build
     ```

5. **Create .ipa file**
   - Either via Xcode: Window → Organizer → Archives
   - Or via command:
     ```bash
     xcodebuild -exportArchive \
       -archivePath build/StopwatchApp.xcarchive \
       -exportOptionsPlist ExportOptions.plist \
       -exportPath build/
     ```

6. **Create installation instructions** (`INSTALLATION.md`)
   ```markdown
   # Installation Instructions
   
   ## Method 1: Xcode (Recommended)
   1. Download StopwatchApp.ipa file
   2. Open Xcode
   3. Window → Devices and Simulators
   4. Select your iPhone
   5. Drag StopwatchApp.ipa into the apps list
   
   ## Method 2: File Sharing
   1. Email the .ipa file
   2. Tap in Mail on iPhone
   3. Tap "Open in Stopwatch"
   
   ## Method 3: MacOS Catalina+
   1. Open Finder
   2. Drag and drop .ipa to your iPhone in Finder
   ```

7. **Create user guide** (`USER_GUIDE.md`)
   - Overview of app features
   - How to create custom workout
   - How to save and load presets
   - How to view history
   - Tips for background audio
   - Troubleshooting

8. **Test installation from .ipa**
   - Delete app from test device
   - Install from .ipa
   - Verify all features work
   - Verify data persists

9. **Create release notes** (`RELEASE_NOTES.md`)
   ```markdown
   # Stopwatch v1.0.0 Release Notes
   
   ## Features
   - Quick and advanced workout setup
   - Real-time audio cues
   - Background audio playback
   - Keep-awake (screen stays on)
   - Preset management
   - Workout history
   - 100% offline
   
   ## System Requirements
   - iOS 16.0 or later
   - iPhone (iPad not tested)
   
   ## Known Limitations
   - None
   
   ## Feedback
   Please report issues to [email/contact]
   ```

**Verification Checklist:**
- [ ] .ipa file builds without errors
- [ ] File size reasonable (~50-100 MB)
- [ ] Installation instructions clear
- [ ] App installs from .ipa
- [ ] All features work in installed app
- [ ] Version numbers correct
- [ ] User guide complete
- [ ] Release notes written

---

## AsyncStorage Schema

### Storage Keys & Data Structure

**Principle:** Complete separation from web app storage (separate device/app)

#### Preset Storage

**Key Format:** `stopwatch_preset_{presetId}`  
**Example:** `stopwatch_preset_30s-15s-5r-3s-60rs`

**Value:**
```typescript
interface StoredPreset {
  id: string;                    // "30s-15s-5r-3s-60rs"
  secondsPerRep: number;         // 1-300
  restBetweenReps: number;       // 0-300
  repsPerSet: number;            // 1-50
  numberOfSets: number;          // 1-50
  restBetweenSets: number;       // 0-600
  createdAt: string;             // ISO 8601 timestamp
  lastUsedAt: string;            // ISO 8601 timestamp
}
```

#### Presets Index

**Key:** `stopwatch_presets_index`

**Value:**
```typescript
interface PresetsIndex {
  presetIds: string[];  // Sorted by lastUsedAt (newest first)
}
```

**Why:** Fast lookup of all presets without iterating all keys

#### Workout History

**Key:** `stopwatch_history`

**Value:**
```typescript
interface WorkoutHistory {
  workouts: Array<{
    id: string;              // Timestamp (e.g., "1704067200000")
    presetId: string;        // Reference to preset ID used
    duration: number;        // Total duration in milliseconds
    completedAt: string;     // ISO 8601 timestamp
    totalReps: number;       // repsPerSet × numberOfSets
    totalSets: number;       // numberOfSets
  }>;
}
```

**Limit:** Max 10 entries (oldest removed when 11th added)

#### App Settings

**Key:** `stopwatch_settings`

**Value:**
```typescript
interface AppSettings {
  darkMode: boolean;         // Always true (for future toggle)
  version: string;           // "1.0.0" (for migrations)
  lastOpenedAt: string;      // ISO timestamp
}
```

#### Recovery State (for crash/interrupt recovery)

**Key:** `stopwatch_recovery_state`

**Value:**
```typescript
interface RecoveryState {
  inProgress: boolean;              // Is workout in progress?
  lastWorkoutConfig?: WorkoutConfig; // Config if interrupted
  elapsedTime?: number;             // Elapsed at interruption
  phase?: 'working' | 'resting' | 'set-rest';
  currentRep?: number;
  currentSet?: number;
  savedAt: string;                  // When recovered
}
```

**Note:** Used only if app crashes mid-workout to allow resume

### Migration Strategy

**From Web to Native:**
- Users start fresh on native app
- No automatic sync from web
- Separate presets and history per platform
- Future enhancement: optional cloud sync

**Within Native:**
- No schema migrations needed for v1.0
- Storage format frozen for release
- If schema changes in future: version field enables detection

**Storage Quota:**
- AsyncStorage: 10MB available on iOS
- Presets: ~0.5KB each → supports 100+ presets easily
- History: 10 entries × ~0.2KB = 2KB
- Total usage: <100KB (plenty of headroom)

---

## Testing Strategy

### Unit Testing

**Framework:** Jest + @testing-library/react-native

**Coverage Target:** 85% of business logic

**Files to Test:**

1. **WorkoutEngine.ts**
   - State initialization
   - Phase transitions
   - Tone trigger detection
   - Pause/resume/stop logic
   - Elapsed time calculations

2. **StorageManager.ts**
   - Preset save/load/delete
   - History management
   - ID generation
   - JSON serialization

3. **utilities.ts**
   - Time formatting (MM:SS)
   - Date formatting
   - Preset ID parsing

4. **AudioManager.ts**
   - Tone playback
   - Frequency accuracy
   - Duration accuracy

**Example Test:**
```typescript
describe('WorkoutEngine', () => {
  let engine: WorkoutEngine;
  
  beforeEach(() => {
    engine = new WorkoutEngine();
  });
  
  test('starts workout with correct config', () => {
    const config: WorkoutConfig = {
      secondsPerRep: 30,
      restBetweenReps: 15,
      repsPerSet: 5,
      numberOfSets: 3,
      restBetweenSets: 60
    };
    
    engine.start(config);
    
    expect(engine.state.isActive).toBe(true);
    expect(engine.state.phase).toBe('countdown');
    expect(engine.state.currentRep).toBe(1);
    expect(engine.state.currentSet).toBe(1);
  });
  
  test('tick() increments elapsed time', () => {
    const config = { /* ... */ };
    engine.start(config);
    
    const before = engine.state.elapsedTime;
    // Simulate 10ms passing
    jest.advanceTimersByTime(10);
    engine.tick();
    const after = engine.state.elapsedTime;
    
    expect(after).toBeGreaterThan(before);
  });
});
```

### Integration Testing

**Framework:** React Native Testing Library

**Coverage Target:** 75% of screens and services

**Scenarios to Test:**

1. **Preset Management Flow**
   - Create preset → Save → Load → Delete
   - Verify values persist

2. **Workout Execution**
   - Start workout → Pause → Resume → Stop
   - Verify timer accuracy

3. **Audio Playback**
   - Verify tones play at correct times
   - Verify no missed tones

4. **Storage Operations**
   - AsyncStorage operations work
   - Data persists across app restart

### E2E Testing (Manual on Real Device)

**Test Checklist:**

- [ ] **Initialization**
  - [ ] App launches successfully
  - [ ] Quick Setup screen shows
  - [ ] Default values displayed

- [ ] **Quick Workout**
  - [ ] [Start Workout] with defaults
  - [ ] Timer counts up correctly
  - [ ] Tones play at right times

- [ ] **Advanced Setup**
  - [ ] [Advanced] button takes to config screen
  - [ ] Can enter custom values
  - [ ] Input validation works
  - [ ] [Save as Preset] saves correctly
  - [ ] Preset appears in list after saving

- [ ] **Preset Loading**
  - [ ] [Change] shows saved presets
  - [ ] Click preset loads values
  - [ ] [Start Workout] with loaded preset

- [ ] **Active Workout**
  - [ ] Timer display is large and clear
  - [ ] Rep/set counter updates
  - [ ] Phase status correct
  - [ ] All tones play at right times
  - [ ] [Pause] pauses timer
  - [ ] [Resume] continues from pause
  - [ ] [Reset] clears and returns to start
  - [ ] [Stop] ends workout and returns to setup

- [ ] **Background Audio**
  - [ ] Lock phone mid-workout
  - [ ] Tones continue playing
  - [ ] Unlock phone
  - [ ] Workout continues
  - [ ] UI responsive after unlock

- [ ] **Keep-Awake**
  - [ ] Start workout
  - [ ] Wait 1+ minute without touching
  - [ ] Screen stays on
  - [ ] Stop workout
  - [ ] Wait ~1 minute
  - [ ] Screen locks normally

- [ ] **History**
  - [ ] Complete a workout
  - [ ] Go to History
  - [ ] Workout appears in list
  - [ ] Can click to reload

- [ ] **Persistence**
  - [ ] Create preset
  - [ ] Close app
  - [ ] Reopen app
  - [ ] Preset still there
  - [ ] History still there

- [ ] **Edge Cases**
  - [ ] App backgrounded during workout → resume works
  - [ ] Incoming call → audio pauses then resumes
  - [ ] Device rotation → app handles
  - [ ] Low battery mode → app works

### Performance Benchmarks

**Targets:**
- Timer tick: <1ms per tick (10ms interval)
- Memory: <50MB during active workout
- Battery drain: <1% per 10-minute workout
- UI frame rate: 60+ FPS consistently

---

## Risk Assessment

### Critical Risks

| Risk | Impact | Severity | Mitigation |
|------|--------|----------|-----------|
| Background audio fails | App unusable for main feature | Critical | Extensive real device testing; use proven library |
| Keep-awake not reliable | Requires manual handling | Critical | Test on multiple iOS versions; verify Info.plist |
| Audio synchronization drift | Timer becomes inaccurate | High | Profile with Instruments; use system clock |
| AsyncStorage quota exceeded | Data loss | Medium | Limit history to 10 items; implement quota check |

### High-Priority Risks

| Risk | Impact | Severity | Mitigation |
|------|--------|----------|-----------|
| Performance degradation | Poor user experience | High | Profile regularly; optimize renders; lazy load |
| Memory leak | App crashes on long workout | High | Test with Instruments; validate event cleanup |
| Audio session interruptions | Tones cut off unexpectedly | Medium | Handle audio session delegates properly |

### Medium-Priority Risks

| Risk | Impact | Severity | Mitigation |
|------|--------|----------|-----------|
| Compatibility with older iOS 16 devices | Limited market | Medium | Test on iOS 16.0 simulator; verify APIs |
| Device orientation changes | UI layout issues | Low | Test landscape mode; lock to portrait if needed |
| International character support | Preset name display issues | Low | Use Unicode strings; validate in tests |

---

## Key Decisions & Trade-offs

### Decision 1: Bare React Native vs Expo

**Selected:** Bare React Native

**Reasoning:**
- ✅ Full native module control (essential for keep-awake and audio)
- ✅ Better AVAudioSession configuration
- ✅ Lower-level iOS API access
- ⚠️ Higher complexity in setup
- ⚠️ More manual dependency management

**Alternative Considered:** Expo
- ✅ Simpler setup
- ✅ No native code knowledge needed
- ❌ Limited background audio support
- ❌ Can't customize audio session properly
- ❌ Would require ejecting (defeats purpose)

### Decision 2: TypeScript

**Selected:** TypeScript throughout

**Reasoning:**
- ✅ Type safety prevents runtime errors
- ✅ Better IDE autocomplete and refactoring
- ✅ Self-documenting code
- ✅ Easier maintenance long-term
- ⚠️ Longer initial setup
- ⚠️ Steeper learning curve

**Alternative Considered:** JavaScript
- ✅ Faster initial development
- ✅ Simpler syntax
- ❌ Runtime errors harder to catch
- ❌ Less IDE support

### Decision 3: Audio Library Selection

**Selected:** react-native-audio-toolkit

**Reasoning:**
- ✅ Better background audio session management
- ✅ Proper iOS AVAudioSession integration
- ✅ More recent updates
- ✅ Supports tone generation
- ⚠️ Fewer examples than alternatives
- ⚠️ Smaller community

**Alternative Considered:** react-native-sound
- ✅ More examples and tutorials
- ✅ Simpler API
- ✅ Larger community
- ❌ Less background audio support
- ❌ Older codebase

### Decision 4: Storage Approach

**Selected:** Separate AsyncStorage (no sync with web)

**Reasoning:**
- ✅ Simpler implementation
- ✅ No data conflicts
- ✅ No backend needed
- ✅ Users have separate presets per platform
- ⚠️ Must recreate presets on native
- ⚠️ No history sync

**Alternative Considered:** Synced Cloud Storage
- ✅ Seamless experience across platforms
- ✅ Backup and recovery
- ❌ Requires backend implementation
- ❌ Data sync complexity
- ❌ Privacy considerations

### Decision 5: Navigation Library

**Selected:** React Navigation with Bottom Tab Navigation

**Reasoning:**
- ✅ Industry standard for React Native
- ✅ Excellent iOS support
- ✅ Flexible routing
- ✅ Good TypeScript support
- ✅ Bottom tabs match native iOS patterns

**Alternative Considered:** React Native Navigation (Wix)
- ✅ Higher performance
- ✅ More native feel
- ❌ Steeper learning curve
- ❌ Less TypeScript support

---

## Quick Reference for AI Agents

### Key File Locations

| File | Purpose |
|------|---------|
| `src/business-logic/WorkoutEngine.ts` | Timer logic (100% from web) |
| `src/business-logic/StorageManager.ts` | Data persistence (90% adapted) |
| `src/business-logic/AudioManager.ts` | Audio tone generation (60% adapted) |
| `src/services/AudioService.ts` | High-level audio interface |
| `src/services/KeepAwakeService.ts` | Keep-awake control |
| `src/services/StorageService.ts` | AsyncStorage wrapper |
| `src/screens/WorkoutScreen.tsx` | Active workout UI |
| `src/hooks/useWorkout.ts` | Workout state hook |
| `ios/StopwatchApp/RCTKeepAwakeModule.m` | Native keep-awake module |
| `ios/StopwatchApp/RCTAudioSessionModule.m` | Native audio session module |

### Important Constants

- **Timer tick interval:** 10ms (MUST NOT CHANGE)
- **Tone durations:** 200ms each
- **Start tone frequency:** 440 Hz
- **Stop tone frequency:** 880 Hz
- **Countdown tones:** 523 Hz, 659 Hz, 784 Hz
- **History limit:** 10 entries max
- **Preset ID format:** `{work}s-{restReps}s-{reps}r-{sets}s-{restSets}rs`
- **Minimum iOS:** 16.0
- **Target iPhones:** 12, 13, 14, 15

### Phase Dependencies

```
Phase 1 (Setup) 
    ↓
Phase 2 (Business Logic) 
    ↓
Phase 3 (Audio)
    ↓
Phase 4 (UI)
    ↓
Phase 5 (Keep-Awake)
    ↓
Phase 6 (Storage)
    ↓
Phase 7 (Testing)
    ↓
Phase 8 (Distribution)
```

Each phase depends on successful completion of all previous phases.

---

## Appendix: Web App Reference

### Original Web App Files

**Location:** `/Users/kashyapbari/Engineering/Experiments/stopwatch/`

| File | Lines | Purpose | RN Status |
|------|-------|---------|-----------|
| `js/workout.js` | 403 | Timer engine | ✅ Copy exact (100%) |
| `js/audio.js` | 129 | Audio tones | ⚠️ Adapt to RN (60%) |
| `js/storage.js` | 268 | Data storage | ⚠️ Adapt to AsyncStorage (90%) |
| `js/main.js` | 212 | App controller | ⚠️ Convert to React (50%) |
| `css/styles.css` | 805 | Styling | ⚠️ Convert to RN (20%) |
| `index.html` | 277 | HTML structure | ⚠️ Rebuild as components (20%) |

### Feature Checklist (for RN Implementation)

- [ ] Quick Setup with defaults
- [ ] Advanced Setup with custom values
- [ ] Audio cues (start, stop, countdown)
- [ ] Preset management (save, load, delete)
- [ ] Workout history (last 10)
- [ ] Pause/Resume/Reset/Stop controls
- [ ] Keep-awake (screen stays on)
- [ ] Background audio (phone locked)
- [ ] 100% offline operation
- [ ] Dark mode UI
- [ ] Responsive for all iPhone sizes

---

## Document Metadata

**Format:** Markdown (GitHub Flavored)  
**Target Audience:** AI Agents + Human Developers  
**Last Updated:** March 30, 2026  
**Status:** Ready for Phase 1 Implementation  
**Questions:** Refer to [Executive Summary](#executive-summary)  
**Next Action:** Begin Phase 1 (Project Setup)
