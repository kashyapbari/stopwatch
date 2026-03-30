# Quick Start Guide: React Native Migration Project

## 📋 Documents

### Primary Documentation
- **`RN_MIGRATION_PLAN.md`** (1939 lines, 61KB)
  - Complete technical specification for the entire migration
  - AI-agent friendly with clear sections and quick reference
  - All phases, decisions, and architectural details

### Original Web App
- **`PLAN.md`** - Original web app specifications (for reference)
- **`README.md`** - Web app user documentation
- **Web App Code:** `index.html`, `css/`, `js/`

---

## 🎯 Current Status

**Phase:** Planning Complete ✅  
**Ready for:** Phase 1 - Project Setup & Infrastructure  
**Timeline:** No deadline - quality focused  
**Approach:** Bare React Native (iOS 16+)

---

## 📍 Key Quick References

### Code Reuse Summary
- ✅ WorkoutEngine (100%) - Copy exact, add types
- ⚠️ StorageManager (90%) - Adapt to AsyncStorage
- ⚠️ AudioManager (60%) - Adapt to react-native-audio-toolkit
- ⚠️ UI components (20%) - Rebuild in React Native

### Critical Libraries
- `react-native` v0.73 - Bare RN for iOS 16+
- `react-native-audio-toolkit` - Audio playback with background support
- `react-native-keep-awake` - Keep screen on during workout
- `@react-native-async-storage/async-storage` - Local data persistence
- `@react-navigation/native` + bottom tabs - Navigation

### Native Modules Required
- `RCTKeepAwakeModule.m` - Prevent screen lock
- `RCTAudioSessionModule.m` - Configure audio session for background

### Important Constants
- Timer tick: 10ms interval (CRITICAL - do not change)
- Tone durations: 200ms each
- Frequencies: 440Hz (start), 880Hz (stop), 523/659/784Hz (countdown)
- Min iOS: 16.0
- Max history: 10 entries

---

## 📂 Directory Structure (When Ready)

```
stopwatch-rn/
├── src/
│   ├── business-logic/      ← From web app (WorkoutEngine, StorageManager)
│   ├── screens/             ← New (QuickSetup, Advanced, Workout, History)
│   ├── components/          ← New (Button, Input, Timer, etc)
│   ├── services/            ← New (Audio, Storage, KeepAwake)
│   ├── hooks/               ← New (useWorkout, useAudio, useStorage)
│   ├── native-modules/      ← New (KeepAwakeModule, AudioSessionModule)
│   ├── navigation/          ← New (React Navigation setup)
│   ├── styles/              ← New (Theme, responsive utilities)
│   └── context/             ← New (State management)
├── ios/                     ← Native iOS code (managed by Xcode)
│   ├── RCTKeepAwakeModule.m
│   └── RCTAudioSessionModule.m
└── __tests__/               ← Unit and integration tests
```

---

## 🚀 Phase 1: Getting Started

When ready to begin Phase 1 (Project Setup), follow these steps:

```bash
# 1. Create new project
npx react-native@latest init StopwatchApp --template typescript
cd StopwatchApp

# 2. Install key dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context \
  @react-native-async-storage/async-storage \
  react-native-audio-toolkit react-native-keep-awake

# 3. Install iOS pods
cd ios && pod install && cd ..

# 4. Create folder structure (see RN_MIGRATION_PLAN.md)

# 5. Test build
npm run ios
```

---

## 📚 How to Use This Plan

### For AI Agents:
1. Read `RN_MIGRATION_PLAN.md` sections:
   - [Project Structure](#project-structure) - Understand organization
   - [Code Reuse Mapping](#code-reuse-mapping) - Know what to copy/adapt
   - [8-Phase Implementation Roadmap](#8-phase-implementation-roadmap) - Follow tasks sequentially

2. Reference sections:
   - [Dependencies & Libraries](#dependencies--libraries) - What packages to install
   - [Native Module Architecture](#native-module-architecture) - How native code connects
   - [AsyncStorage Schema](#asyncstorage-schema) - Data structure and persistence

3. Verification:
   - Each phase has "Verification Checklist" - confirm completion
   - Risk Assessment - be aware of potential issues
   - Quick Reference for AI Agents - fast lookup

### For Humans:
1. Start with [Executive Summary](#executive-summary) - understand the goal
2. Review [Clarifications & Requirements](#clarifications--requirements) - confirm all decisions made
3. Skim [8-Phase Implementation Roadmap](#8-phase-implementation-roadmap) - understand timeline
4. Reference as needed during development

---

## ⚠️ Critical Reminders

1. **Don't change the 10ms timer interval** - Affects accuracy across entire app
2. **Keep tone frequencies exact** - 440Hz, 880Hz, 523Hz, 659Hz, 784Hz
3. **Background audio is critical** - Test extensively on real device, not just simulator
4. **Keep web app untouched** - React Native project is completely separate
5. **Bare React Native required** - Not Expo (needs native modules)
6. **Separate storage** - No sync with web app (per requirements)

---

## 🔗 Related Files

- `PLAN.md` - Original web app technical specification (reference)
- `README.md` - Web app user guide (reference)
- `js/workout.js` - Timer logic to reuse (100%)
- `js/audio.js` - Audio patterns to adapt (60%)
- `js/storage.js` - Storage logic to adapt (90%)

---

## ✅ Checklist Before Phase 1

- [ ] Read Executive Summary in `RN_MIGRATION_PLAN.md`
- [ ] Confirm all clarifications understood (iOS 16+, separate storage, etc)
- [ ] Have React Native experience or learning materials ready
- [ ] Have real iPhone available for testing (simulator has limitations)
- [ ] Understood code reuse strategy (100% WorkoutEngine, 60% AudioManager, etc)
- [ ] Understood native module architecture (keep-awake + background audio)
- [ ] Ready to begin Phase 1 with sequential phases

---

## 📞 Questions?

Refer to `RN_MIGRATION_PLAN.md`:
- Architecture questions → [Native Module Architecture](#native-module-architecture)
- Implementation questions → [8-Phase Implementation Roadmap](#8-phase-implementation-roadmap)
- Code reuse questions → [Code Reuse Mapping](#code-reuse-mapping)
- Decision rationale → [Key Decisions & Trade-offs](#key-decisions--trade-offs)

---

**Status:** Ready for Phase 1 Implementation  
**Last Updated:** March 30, 2026
