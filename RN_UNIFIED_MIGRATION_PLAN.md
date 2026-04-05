# React Native Unified Platform Migration Plan: Advanced Stopwatch

**Status:** Planning Complete - Ready for Phase 1 Implementation  
**Last Updated:** March 31, 2026  
**Architecture:** Unified React Native (Web + iOS + Android from single codebase)  
**Code Reuse:** 95%+ across all platforms  
**Web Deployment:** GitHub Pages with automated build pipeline  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Clarifications & Requirements](#clarifications--requirements)
4. [Project Structure](#project-structure)
5. [Technology Stack](#technology-stack)
6. [Code Reuse Strategy](#code-reuse-strategy)
7. [Build & Deployment Pipeline](#build--deployment-pipeline)
8. [9-Phase Implementation Roadmap](#9-phase-implementation-roadmap)
9. [Storage Architecture](#storage-architecture)
10. [Testing Strategy](#testing-strategy)
11. [Risk Assessment](#risk-assessment)
12. [Key Decisions & Trade-offs](#key-decisions--trade-offs)

---

## Executive Summary

### Goal
Migrate the Advanced Stopwatch web app to a **unified React Native codebase** that runs on:
- ✅ **Web** (GitHub Pages) - React Native for Web
- ✅ **iOS** (App Store) - Native React Native
- ✅ **Android** (Play Store) - Native React Native

With **95%+ code sharing** and **zero duplication** of business logic.

### The Innovation: Single Codebase, Three Platforms

```
React Native Codebase (100% shared)
    ├─ Components, Screens, Services
    ├─ Business Logic, Hooks, Navigation
    └─ Tests, Utilities, Types
         ↙          ↓          ↘
      iOS       Web         Android
    (Native)  (GitHub)     (Native)
              (Pages)
```

**Result:**
- Fix a bug once → Fixed on all 3 platforms
- Add a feature → Available on all 3 platforms
- Update styling → Applies to all 3 platforms
- One git repository, one deployment pipeline

### Why This Approach

| Aspect | Traditional | **Unified RN** |
|--------|-----------|----------------|
| **Codebases** | 2-3 separate | 1 unified |
| **Code Duplication** | 50%+ | ~5% |
| **Bug Fix Time** | Fix 2-3 places | Fix once |
| **Feature Delivery** | Staggered | Simultaneous |
| **Testing** | Platform-by-platform | Once covers all |
| **Maintenance** | High burden | Low burden |

### Success Criteria

- ✅ Web app works identically to original (better styling)
- ✅ iOS app has keep-awake + background audio
- ✅ Android app fully supported
- ✅ Same business logic across all platforms
- ✅ Build pipelines automated (GitHub Actions)
- ✅ GitHub Pages auto-updates on merge
- ✅ iOS .ipa file ready for distribution
- ✅ 100% offline functionality
- ✅ Data persists via cookies (web) and AsyncStorage (native)

---

## Architecture Overview

### Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Native Codebase                        │
│               (100% shared across all platforms)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Screens      Components      Services        Business Logic    │
│  ├─ QuickSetup   ├─ Button      ├─ Audio       ├─ WorkoutEngine │
│  ├─ Advanced     ├─ Input       ├─ Storage     ├─ AudioManager  │
│  ├─ Workout      ├─ Timer       ├─ KeepAwake   └─ utilities     │
│  └─ History      └─ List        └─ Hooks                        │
│                                                                 │
│  (95% identical code runs on ALL platforms)                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  iOS Layer   │  │  Web Layer   │  │ Android Layer│
│              │  │              │  │              │
│ • RN-iOS     │  │ • RN-Web     │  │ • RN-Android │
│ • Keep-awake │  │ • Web Audio  │  │ • Keep-awake │
│ • Background │  │ • Cookies    │  │ • Background │
│   Audio      │  │ • IndexedDB  │  │   Audio      │
│ • AsyncStg.  │  │              │  │ • AsyncStg.  │
└──────────────┘  └──────────────┘  └──────────────┘
     ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ App Store    │  │ GitHub Pages │  │ Play Store   │
│              │  │              │  │              │
│ Signed .ipa  │  │ Static HTML  │  │ Signed .aab  │
│ Automatic    │  │ Auto-deploy  │  │ Auto-deploy  │
│ Updates      │  │ CI/CD on push│  │ CI/CD on push│
└──────────────┘  └──────────────┘  └──────────────┘
```

### What Gets Shared (95%)

```
✅ SHARED (identical code on all platforms):
├─ All 4 screens (QuickSetup, Advanced, Workout, History)
├─ All 6 reusable components (Button, Input, Timer, List, Modal, etc)
├─ WorkoutEngine (timer logic - 403 lines, 100% identical)
├─ AudioManager (tone patterns - 60-70% adapted)
├─ StorageManager (storage logic - 90% adapted)
├─ All utilities (formatting, ID generation, validation)
├─ All business logic and state management
├─ Navigation structure (React Navigation)
├─ Styling system (React Native StyleSheet)
├─ All hooks (useWorkout, useAudio, useStorage, etc)
├─ Type definitions (TypeScript interfaces)
└─ Tests (unit, integration, E2E)

⚠️ PLATFORM-SPECIFIC (5%, gracefully handled):
├─ KeepAwakeService → Native on iOS/Android, no-op on web
├─ BackgroundAudioService → Native AVAudioSession on iOS/Android
├─ StorageService → AsyncStorage on native, Cookies on web
├─ AudioService → Web Audio API on web, RN Audio on native
└─ Minimal platform-specific imports
```

### Repository Structure

```
stopwatch/
├── src/                                    # 100% SHARED React Native code
│   ├── screens/
│   │   ├── QuickSetupScreen.tsx           ✅ Works on web, iOS, Android
│   │   ├── AdvancedSetupScreen.tsx        ✅ Works on web, iOS, Android
│   │   ├── WorkoutScreen.tsx              ✅ Works on web, iOS, Android
│   │   └── HistoryScreen.tsx              ✅ Works on web, iOS, Android
│   │
│   ├── components/
│   │   ├── Button.tsx                     ✅ Works on all
│   │   ├── Input.tsx                      ✅ Works on all
│   │   ├── Timer.tsx                      ✅ Works on all
│   │   ├── WorkoutList.tsx                ✅ Works on all
│   │   ├── Modal.tsx                      ✅ Works on all
│   │   └── index.ts
│   │
│   ├── business-logic/
│   │   ├── WorkoutEngine.ts               ✅ 100% identical (from web app)
│   │   ├── AudioManager.ts                ✅ Adapted tone patterns
│   │   ├── StorageManager.ts              ✅ Adapted storage logic
│   │   └── utilities.ts                   ✅ Formatting, ID generation
│   │
│   ├── services/
│   │   ├── AudioService.ts                ✅ Platform-aware (Web Audio vs RN)
│   │   ├── StorageService.ts              ✅ Platform-aware (Cookies vs AsyncStg)
│   │   ├── KeepAwakeService.ts            ⚠️ Native only (graceful fail on web)
│   │   └── WorkoutService.ts              ✅ Orchestration logic
│   │
│   ├── hooks/
│   │   ├── useWorkout.ts                  ✅ Works on all
│   │   ├── useAudio.ts                    ✅ Works on all
│   │   ├── useStorage.ts                  ✅ Works on all
│   │   ├── useKeepAwake.ts                ⚠️ Native only (no-op on web)
│   │   └── index.ts
│   │
│   ├── context/
│   │   ├── WorkoutContext.tsx             ✅ State management for all
│   │   └── ThemeContext.tsx               ✅ Dark mode for all
│   │
│   ├── styles/
│   │   ├── theme.ts                       ✅ Colors, spacing, typography
│   │   ├── globalStyles.ts                ✅ Component base styles
│   │   └── responsive.ts                  ✅ Screen utilities
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx              ✅ React Navigation (works on web!)
│   │   ├── LinkingConfiguration.ts        ✅ Deep linking
│   │   └── types.ts
│   │
│   ├── types/
│   │   ├── workout.ts                     ✅ Shared TypeScript types
│   │   ├── storage.ts
│   │   ├── audio.ts
│   │   └── index.ts
│   │
│   ├── App.tsx                            ✅ Root component (all platforms)
│   └── index.tsx
│
├── ios/                                    # Platform-specific: iOS
│   ├── StopwatchApp.xcodeproj/
│   ├── StopwatchApp/
│   │   ├── Info.plist                     (Background modes config)
│   │   ├── RCTKeepAwakeModule.m           (Native module)
│   │   └── RCTAudioSessionModule.m        (Native module)
│   ├── Podfile                            (CocoaPods config)
│   └── Pods/                              (iOS dependencies)
│
├── android/                                # Platform-specific: Android
│   ├── app/
│   ├── build.gradle
│   └── ... (standard Android RN structure)
│
├── web/                                    # Platform-specific: Web
│   ├── index.html                         (Entry point)
│   ├── index.web.tsx                      (Web registration)
│   ├── public/
│   │   ├── manifest.json
│   │   └── favicon.ico
│   └── build/                             (Built output, deployed to GitHub Pages)
│
├── __tests__/                              # Tests (run on all platforms)
│   ├── business-logic/
│   ├── services/
│   ├── components/
│   └── screens/
│
├── .github/
│   └── workflows/
│       ├── deploy-web.yml                 (Auto-deploy to GitHub Pages on push)
│       └── build-ios.yml                  (Optional: Build iOS on push)
│
├── package.json                           # Single package.json for ALL platforms
├── tsconfig.json                          # TypeScript config
├── babel.config.js                        # Babel config (all platforms)
├── metro.config.js                        # Metro bundler (RN)
├── webpack.config.js                      # Webpack (Web builds)
│
├── RN_UNIFIED_MIGRATION_PLAN.md           # THIS PLAN
├── QUICKSTART.md                          # Quick reference
├── ARCHITECTURE.md                        # Architecture details (optional)
└── .git/                                  # Single git history for all platforms
```

---

## Clarifications & Requirements

### Final Confirmed Decisions

| Decision | Choice | Implementation |
|----------|--------|-----------------|
| **Architecture** | Unified RN for Web + Native | Single `src/` shared codebase |
| **Web Deployment** | GitHub Pages | GitHub Actions auto-deploy on push |
| **Old Code** | Remove completely | Delete `js/`, `css/`, `index.html` (keep git history) |
| **Storage (Web)** | Continue cookies | StorageService adapter uses cookies |
| **Storage (Native)** | AsyncStorage | StorageService adapter uses AsyncStorage |
| **Native Features on Web** | Graceful fail | try/catch, no-op implementations |
| **Styling** | React Native StyleSheet | Modern, intuitive, responsive design |
| **Build System** | Separate npm scripts | `npm run build:web`, `npm run build:ios`, `npm run build:android` |
| **TypeScript** | Full type safety | .ts and .tsx throughout |
| **Testing** | Jest + React Testing Library | Tests run on all platforms |
| **iOS Version** | iOS 16+ | Modern APIs |
| **Android Version** | Android 6+ (API 23+) | Wide compatibility |

### User Requirements Summary

✅ **Single Repo** - Web + iOS + Android from one codebase  
✅ **95%+ Code Sharing** - Same screens, components, logic on all platforms  
✅ **GitHub Pages for Web** - Auto-deployed on git push  
✅ **Clean Git History** - Old HTML/CSS code removed  
✅ **Cookie Storage** - User-side data persistence via cookies on web  
✅ **Graceful Degradation** - Native features fail gracefully on web  
✅ **Modern Styling** - React Native StyleSheet (no CSS files)  
✅ **Separate Builds** - Distinct build scripts for each platform  
✅ **No Breaking Changes** - Web app works exactly as before (enhanced styling)  

---

## Project Structure

### Before Migration (Current)

```
stopwatch/
├── index.html
├── css/styles.css
├── js/
│   ├── main.js
│   ├── ui.js
│   ├── workout.js
│   ├── audio.js
│   └── storage.js
├── PLAN.md
└── .git/
```

### After Migration (New Unified RN)

```
stopwatch/
├── src/                       # React Native code (shared by all platforms)
│   ├── screens/
│   ├── components/
│   ├── services/
│   ├── business-logic/
│   ├── hooks/
│   ├── context/
│   ├── styles/
│   ├── navigation/
│   ├── types/
│   └── App.tsx
│
├── ios/                       # iOS native code
│   ├── StopwatchApp.xcodeproj/
│   ├── StopwatchApp/
│   ├── Podfile
│   └── Pods/
│
├── android/                   # Android native code
│   ├── app/
│   └── build.gradle
│
├── web/                       # Web entry point
│   ├── index.html
│   ├── index.web.tsx
│   └── public/
│
├── __tests__/
├── .github/workflows/         # CI/CD for auto-deploy
│
├── package.json               # Single dependency file
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── webpack.config.js
│
├── RN_UNIFIED_MIGRATION_PLAN.md
├── QUICKSTART.md
└── .git/                      # One git history
```

**Removed (with git history preserved):**
- ❌ `index.html` (old HTML entry point)
- ❌ `css/styles.css` (CSS replaced with RN StyleSheet)
- ❌ `js/main.js` (logic moved to React components)
- ❌ `js/ui.js` (UI moved to React Native screens)
- ❌ `js/audio.js` (logic ported to AudioManager.ts)
- ❌ `js/storage.js` (logic ported to StorageManager.ts)
- ❌ `js/workout.js` (logic ported to WorkoutEngine.ts)

**Preserved:**
- ✅ Git history (all commits remain)
- ✅ PLAN.md (for reference)
- ✅ README.md (updated)

---

## Technology Stack

### Core Framework

```json
{
  "react": "^18.2.0",
  "react-native": "^0.73.0",
  "typescript": "^5.0.0"
}
```

**Why:**
- React Native 0.73 - Stable, mature, excellent TS support
- TypeScript 5 - Full type safety across all code
- React 18 - Concurrent features, automatic batching

### Platform Rendering

```json
{
  "react-native-web": "^0.19.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.7",
  "@react-navigation/web": "^1.0.0"
}
```

**Why:**
- react-native-web - Allows RN components to run in browser
- React Navigation - Navigation works on web + native
- Bottom tabs - Perfect for app layout on all platforms

### Audio System

```json
{
  "react-native-audio-toolkit": "^2.0.0"
}
```

**Implementation:**
- **Native (iOS/Android):** Uses native audio APIs via RN Audio Toolkit
- **Web:** Falls back to Web Audio API in AudioManager.ts
- Same interface, different implementations

### Storage

```json
{
  "@react-native-async-storage/async-storage": "^1.21.0"
}
```

**Implementation:**
- **Native (iOS/Android):** AsyncStorage (native persistence)
- **Web:** Cookies (user preference for data ownership)
- Same interface via StorageService.ts adapter pattern

### Development Tools

```json
{
  "jest": "^29.0.0",
  "@testing-library/react-native": "^12.0.0",
  "@testing-library/jest-native": "^5.4.0",
  "babel-jest": "^29.0.0",
  "@babel/core": "^7.23.0",
  "@babel/preset-typescript": "^7.23.0",
  "typescript": "^5.0.0",
  "@types/react": "^18.2.0",
  "@types/react-native": "^0.73.0",
  "prettier": "^3.0.0",
  "eslint": "^8.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0"
}
```

### Web-Specific Build Tools

```json
{
  "webpack": "^5.0.0",
  "webpack-cli": "^5.0.0",
  "webpack-dev-server": "^4.0.0",
  "@webpack-cli/serve": "^2.0.0",
  "html-webpack-plugin": "^5.0.0"
}
```

---

## Code Reuse Strategy

### 100% Shared (Identical Code)

#### WorkoutEngine.ts
- **From:** `js/workout.js` (403 lines)
- **Change:** Add TypeScript types only, zero logic changes
- **Usage:** Both web and native import and use identical class
- **Validation:** 10ms timer interval preserved exactly

#### utilities.ts
- **From:** Helper functions scattered in web app
- **Functions:**
  - `formatTime(ms)` - MM:SS format
  - `generatePresetId(config)` - Preset naming
  - `parsePresetId(id)` - Parse ID back to config
  - `validateConfig(config)` - Input validation
- **Change:** None, just extract and organize

#### Type Definitions
- **New:** `types/workout.ts`, `types/storage.ts`, `types/audio.ts`
- **Usage:** TypeScript interfaces used by all platforms

### 90% Shared (Logic Adapted)

#### StorageManager.ts
- **From:** `js/storage.js` (268 lines)
- **Reused Logic:**
  - Preset ID generation (exact same format)
  - Preset save/load/delete operations
  - History management logic
  - JSON serialization patterns
- **Adapted:** Replace cookie API with generic interface

#### AudioManager.ts
- **From:** `js/audio.js` (129 lines)
- **Reused Patterns:**
  - Tone frequencies (440Hz, 880Hz, 523/659/784Hz)
  - Durations (200ms)
  - Volume envelope
  - Countdown sequence
- **Adapted:** Replace Web Audio API with generic interface

### 95% Shared (Same Components)

#### All Screens & Components
- Same React Native code runs on all platforms
- Minimal styling adjustments for platform differences

### Platform-Specific (5%)

#### KeepAwakeService.ts, AudioService.ts, StorageService.ts
- Platform detection and graceful fallbacks
- Native-specific implementations

---

## Build & Deployment Pipeline

### Build Commands (3 Separate Builds)

```bash
# Web build (outputs static HTML/CSS/JS for GitHub Pages)
npm run build:web

# iOS build (outputs .ipa for distribution)
npm run build:ios

# Android build (outputs .aab for Play Store)
npm run build:android
```

### Web Deployment Pipeline (GitHub Actions)

**File:** `.github/workflows/deploy-web.yml`

```yaml
name: Deploy Web to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run build:web
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./web/build
```

**Workflow:**
1. Push to main branch
2. GitHub Actions automatically runs
3. Installs dependencies
4. Builds React Native app for web
5. Deploys to GitHub Pages
6. Live on https://kashyapbari.github.io/stopwatch/

### Local Development

```bash
# Install dependencies (one time)
npm install

# Web: Start dev server (localhost:8081)
npm run start:web

# iOS: Start simulator
npm run start:ios

# Android: Start emulator/device
npm run start:android
```

### Distribution

**Web:**
- Automatic via GitHub Actions
- No manual steps needed
- Updates live immediately on push

**iOS:**
- Manual build: `npm run build:ios`
- Outputs signed .ipa file
- Share via email, cloud storage, or internal distribution
- No App Store submission required (per your requirements)

**Android:**
- Manual build: `npm run build:android`
- Outputs signed .aab file
- Can submit to Play Store or distribute manually
- Future feature if needed

---

## 9-Phase Implementation Roadmap

### Phase 1: Project Setup & Foundation (Est. 2-3 days)

**Goal:** Set up React Native project structure, remove old code, configure for web + native

**Deliverables:**
- ✅ React Native project initialized with TypeScript
- ✅ All dependencies installed (npm and CocoaPods)
- ✅ Folder structure created per specification
- ✅ Old code (js/, css/, index.html) removed
- ✅ Navigation structure scaffolded (empty screens)
- ✅ Web build configured (webpack, babel)
- ✅ iOS build configured
- ✅ Web dev server runs (localhost:8081)
- ✅ iOS simulator build works

**Tasks:**

1. Create new bare RN project structure in existing stopwatch/ directory
2. Install all dependencies from package.json
3. Set up TypeScript (tsconfig.json, babel.config.js, metro.config.js)
4. Create src/ folder structure with empty screens
5. Configure webpack for web builds
6. Update package.json scripts:
   ```json
   {
     "scripts": {
       "start:web": "webpack serve --mode development",
       "build:web": "webpack --mode production",
       "start:ios": "react-native run-ios",
       "build:ios": "...",
       "start:android": "react-native run-android",
       "build:android": "..."
     }
   }
   ```
7. Set up GitHub Actions workflow (.github/workflows/deploy-web.yml)
8. Create web/ folder with index.html entry point
9. Initialize iOS configuration (Podfile, Info.plist)
10. Delete old code (js/, css/, old index.html)
11. Create initial git commit (after cleanup)

**Verification Checklist:**
- [ ] `npm run start:web` launches dev server (localhost:8081)
- [ ] Web renders empty app shell
- [ ] `npm run start:ios` launches simulator
- [ ] iOS renders empty app shell
- [ ] No TypeScript errors
- [ ] Old code completely removed
- [ ] Git history preserved (old files deleted but commits intact)
- [ ] Folder structure matches specification

---

### Phase 2: Business Logic Porting (Est. 2-3 days)

**Goal:** Port 100% of business logic from web app to TypeScript shared code

**Deliverables:**
- ✅ WorkoutEngine.ts fully ported (identical logic)
- ✅ utilities.ts with all helper functions
- ✅ TypeScript type definitions complete
- ✅ Unit tests for all business logic (85%+ coverage)

---

### Phase 3: Audio System Implementation (Est. 2 days)

**Goal:** Implement cross-platform audio (Web Audio API + react-native-audio-toolkit)

**Deliverables:**
- ✅ AudioManager implementations for web and native
- ✅ AudioService.ts high-level interface
- ✅ All tone patterns working on web
- ✅ All tone patterns working on iOS

---

### Phase 4: Storage System Implementation (Est. 1-2 days)

**Goal:** Implement cross-platform storage (Cookies + AsyncStorage)

**Deliverables:**
- ✅ StorageManager with preset/history logic
- ✅ WebStorageProvider (cookies)
- ✅ RNStorageProvider (AsyncStorage)
- ✅ StorageService.ts adapter
- ✅ useStorage hook

---

### Phase 5: React Native UI Components (Est. 2-3 days)

**Goal:** Build reusable UI components that work on web and native

**Deliverables:**
- ✅ Button, Input, Timer, WorkoutList, Modal components
- ✅ Theme system (colors, spacing, typography)
- ✅ All components responsive on web + native

---

### Phase 6: Screen Implementation (Est. 3-4 days)

**Goal:** Build all 4 screens with full functionality

**Deliverables:**
- ✅ QuickSetupScreen
- ✅ AdvancedSetupScreen
- ✅ WorkoutScreen
- ✅ HistoryScreen
- ✅ Navigation between screens working

---

### Phase 7: Integration & Platform Features (Est. 2-3 days)

**Goal:** Integrate all systems, add native features, graceful web fallbacks

**Deliverables:**
- ✅ KeepAwakeService working on iOS (graceful fail on web)
- ✅ BackgroundAudioService configured
- ✅ WorkoutService orchestrating all operations
- ✅ All systems talking to each other

---

### Phase 8: Testing & Optimization (Est. 2-3 days)

**Goal:** Comprehensive testing on web + iOS, performance optimization

**Deliverables:**
- ✅ Unit tests for all business logic (85%+ coverage)
- ✅ Component tests for all UI
- ✅ Integration tests for workflows
- ✅ E2E manual testing on real device (if available)
- ✅ Performance optimized (60+ FPS, smooth animations)

---

### Phase 9: Build & Deployment Setup (Est. 1-2 days)

**Goal:** Set up automated web deployment, prepare iOS distribution

**Deliverables:**
- ✅ GitHub Actions workflow for auto-deploy to Pages
- ✅ Web build working and deployed
- ✅ iOS .ipa file ready
- ✅ Distribution documentation

---

## Storage Architecture

### Web Storage (Cookies)

**Why Cookies:**
- User owns their data (not on cloud)
- Browser persistence across sessions
- No external dependencies
- Privacy-respecting

### Native Storage (AsyncStorage)

**Why AsyncStorage:**
- Purpose-built for React Native
- Persistent across app restarts
- Simpler than file system
- Automatic encryption on iOS

### Data Schema (Same for Web & Native)

```typescript
// Preset
Key: `stopwatch_preset_{presetId}`
Value: {
  id: string,
  secondsPerRep: number,
  restBetweenReps: number,
  repsPerSet: number,
  numberOfSets: number,
  restBetweenSets: number,
  createdAt: string,
  lastUsedAt: string
}

// History
Key: `stopwatch_history`
Value: {
  workouts: [
    {
      id: string,
      presetId: string,
      duration: number,
      completedAt: string,
      totalReps: number,
      totalSets: number
    }
  ]
}
```

---

## Testing Strategy

### Unit Testing (Jest)
- **Coverage:** 85%+ of business logic
- **Command:** `npm test`

### Component Testing (React Testing Library)
- **Coverage:** 75% of components
- **Command:** `npm test -- components/`

### Integration Testing
- Complete workflow testing
- Manual test checklist for all features

### Platform-Specific Testing
- **Web:** Test in Chrome, Firefox, Safari
- **iOS:** Test on real device, keep-awake, background audio

---

## Risk Assessment

### Critical Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Audio not working on web** | Can't hear tones | Thoroughly test Web Audio API |
| **Keep-awake fails on iOS** | App unusable | Extensive testing, graceful degradation |
| **RN-Web performance** | Slow, laggy UI | Profile and optimize |

### High-Priority Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Build pipeline breaks** | Can't deploy to Pages | Test CI/CD locally first |
| **Storage data loss** | Users lose presets | Error handling, edge case testing |
| **Responsive layout breaks** | Unusable on some sizes | Test all device sizes |

---

## Key Decisions & Trade-offs

### Decision 1: Unified React Native for All Platforms

**Selected:** Single RN codebase for web, iOS, Android

**Benefits:**
- ✅ 95%+ code reuse
- ✅ Single codebase to maintain
- ✅ Bug fixes apply to all platforms
- ✅ Consistent UX across platforms

**Trade-offs:**
- ⚠️ Learning curve for React Native
- ⚠️ Web performance slightly less than pure CSS
- ⚠️ Different debugging experience

### Decision 2: React Native for Web via react-native-web

**Selected:** Use react-native-web library for web rendering

**Benefits:**
- ✅ Same RN code runs on web
- ✅ No HTML/CSS duplication
- ✅ React Navigation has web support
- ✅ Responsive layout system

**Trade-offs:**
- ⚠️ Not optimized for SEO (not needed)
- ⚠️ Build step required

### Decision 3: Cookies on Web, AsyncStorage on Native

**Selected:** Platform-specific storage

**Benefits:**
- ✅ Users own their data on web
- ✅ Native app persists across uninstalls
- ✅ No cloud backend needed
- ✅ Privacy-respecting

**Trade-offs:**
- ⚠️ Data not synced between platforms

### Decision 4: Remove Old Code, Keep Git History

**Selected:** Delete js/, css/, index.html from codebase

**Benefits:**
- ✅ Clean, simple codebase
- ✅ No confusion with old code
- ✅ Single way to do things
- ✅ Git history preserved

**Trade-offs:**
- ⚠️ Can't easily revert to old approach

### Decision 5: Automated Web Deployment via GitHub Actions

**Selected:** CI/CD pipeline auto-deploys to GitHub Pages

**Benefits:**
- ✅ Zero manual steps
- ✅ Deployments on every push
- ✅ No manual mistakes
- ✅ Always live with latest code

**Trade-offs:**
- ⚠️ All changes deploy immediately (no staging)

### Decision 6: Native StyleSheet instead of CSS

**Selected:** React Native StyleSheet for all styling

**Benefits:**
- ✅ Type-safe styles
- ✅ No CSS files to maintain
- ✅ Consistent across platforms
- ✅ Dynamic styling easy
- ✅ More intuitive design system

**Trade-offs:**
- ⚠️ Different from traditional CSS
- ⚠️ Learning curve for CSS developers

---

## Quick Reference

### Key Constants

- **Timer tick:** 10ms (MUST NOT CHANGE)
- **Tone duration:** 200ms each
- **Start tone frequency:** 440 Hz
- **Stop tone frequency:** 880 Hz
- **Countdown frequencies:** 523, 659, 784 Hz
- **Max history:** 10 entries
- **Storage expiry (web):** 30 days
- **Preset ID format:** `{work}s-{restReps}s-{reps}r-{sets}s-{restSets}rs`

### Build Commands

```bash
npm run start:web          # Dev server
npm run build:web          # Production web build

npm run start:ios          # Launch simulator
npm run build:ios          # Build .ipa

npm run start:android      # Launch emulator
npm run build:android      # Build .aab

npm test                   # Run all tests
npm run lint               # Run ESLint
```

---

## Summary

### Single Repository, Three Platforms

This unified approach provides:

✅ **95%+ Code Sharing** - Same code on web, iOS, Android  
✅ **One Git Repo** - Single source of truth  
✅ **One Codebase** - No duplication or sync issues  
✅ **Automated Web Deployment** - GitHub Actions auto-deploy  
✅ **Modern Tech Stack** - React Native, TypeScript, modern patterns  
✅ **User Data Privacy** - Cookies on web, local storage on native  
✅ **Graceful Degradation** - Native features work on iOS/Android, gracefully fail on web  
✅ **Future-Proof** - Easy to add features for all platforms simultaneously  

### Implementation Timeline

- **Phase 1:** 2-3 days (Setup & cleanup)
- **Phase 2:** 2-3 days (Business logic)
- **Phase 3:** 2 days (Audio)
- **Phase 4:** 1-2 days (Storage)
- **Phase 5:** 2-3 days (Components)
- **Phase 6:** 3-4 days (Screens)
- **Phase 7:** 2-3 days (Integration)
- **Phase 8:** 2-3 days (Testing)
- **Phase 9:** 1-2 days (Deployment)

**Total: 18-27 days of focused work (no deadline pressure)**

---

## Next Steps

Ready to proceed with Phase 1 implementation!
