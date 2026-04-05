# Setup & Quick Start Guide

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- For iOS development: macOS with Xcode 14+
- For Android development: Android Studio & Android SDK

## 🚀 Quick Start (30 seconds)

```bash
# Install dependencies (if not already done)
npm install --legacy-peer-deps

# Verify everything is working
npm run type-check        # ✅ TypeScript check (0 errors expected)
npm run lint              # ✅ Code quality check
npm run test              # ✅ Run tests
npm run build:web         # ✅ Build for web

# Start development
npm run start:web         # Visit http://localhost:3000
```

## 📁 Project Structure Overview

```
stopwatch/
├── src/                              # 100% SHARED React Native code
│   ├── screens/                      # Screen components (QuickSetup, Advanced, Workout, History)
│   ├── components/                   # Reusable UI components (Button, Input, Timer, etc)
│   ├── services/                     # Business services (Audio, Storage, KeepAwake)
│   ├── business-logic/               # Core logic (WorkoutEngine, AudioManager, StorageManager)
│   ├── hooks/                        # Custom React hooks (useWorkout, useAudio, useStorage)
│   ├── context/                      # React Context providers (WorkoutContext, ThemeContext)
│   ├── styles/                       # Theme system (colors, spacing, responsive utilities)
│   ├── navigation/                   # Navigation setup (React Navigation)
│   ├── types/                        # TypeScript type definitions
│   ├── App.tsx                       # Root component
│   └── index.tsx                     # React Native entry point
│
├── web/                              # Web-specific entry point
│   ├── index.html                    # HTML template
│   ├── index.tsx                     # Web registration
│   └── public/                       # Static assets
│
├── ios/                              # iOS native code (auto-generated)
├── android/                          # Android native code (auto-generated)
│
├── __tests__/                        # Test files
├── .github/workflows/                # CI/CD automation
│
└── Configuration Files:
    ├── package.json                  # Dependencies & npm scripts
    ├── tsconfig.json                 # TypeScript configuration
    ├── babel.config.js               # Babel transpilation
    ├── webpack.config.js             # Web bundler
    ├── metro.config.js               # React Native bundler
    ├── jest.config.js                # Testing framework
    ├── .eslintrc.json                # Code linting
    └── .prettierrc.json              # Code formatting
```

## 📚 All Available npm Scripts

### Development Commands

```bash
# Web development server (localhost:3000)
npm run start:web

# iOS simulator
npm run start:ios

# Android emulator/device
npm run start:android

# React Native Metro bundler (if needed)
npm start
```

### Code Quality

```bash
# TypeScript validation
npm run type-check

# ESLint checking
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is formatted
npm run format:check
```

### Testing

```bash
# Run all tests
npm run test

# Watch mode (re-run tests on file changes)
npm run test:watch

# Test coverage report
npm run test:coverage
```

### Building

```bash
# Web production build (outputs to dist/)
npm run build:web

# iOS production build (outputs .ipa)
npm run build:ios

# Android production build (outputs .aab)
npm run build:android
```

### Cleanup

```bash
# Remove build artifacts
npm run clean

# Deep clean (includes node_modules)
npm run clean:deep
```

## ✅ Verification Checklist

Run these commands to verify the project is properly set up:

```bash
# 1. Check TypeScript compilation
npm run type-check
# Expected: 0 errors

# 2. Check code quality
npm run lint
# Expected: 0 errors

# 3. Run tests
npm run test
# Expected: All tests passing

# 4. Build for web
npm run build:web
# Expected: Build succeeds, output in dist/
```

**All-in-one verification:**

```bash
npm run type-check && npm run lint && npm run test && npm run build:web && echo "✅ All checks passed!"
```

## 🎯 Current Status

- ✅ React Native project initialized with TypeScript
- ✅ All 1,188 dependencies installed
- ✅ Full project structure created
- ✅ Web build configured and working
- ✅ iOS/Android structure ready
- ✅ GitHub Actions CI/CD configured
- ✅ ESLint & Prettier configured
- ✅ Jest testing framework ready

## 📖 Documentation

- **`RN_UNIFIED_MIGRATION_PLAN.md`** - Complete technical specification with all 9 phases
- **`MIGRATION_COMPLETION_STATUS.md`** - Track progress through each phase
- **`PLAN.md`** - Original web app specification (for reference)
- **`README.md`** - Project overview

## 🔧 Configuration Files Explained

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts |
| `tsconfig.json` | TypeScript strict mode configuration |
| `babel.config.js` | JavaScript transpilation |
| `webpack.config.js` | Web bundler configuration |
| `metro.config.js` | React Native Metro bundler |
| `jest.config.js` | Test framework configuration |
| `.eslintrc.json` | Linting rules |
| `.prettierrc.json` | Code formatting rules |

## 🐛 Troubleshooting

### Dependencies not installed?
```bash
npm install --legacy-peer-deps
```

### Port 3000 already in use?
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (on macOS)
kill -9 <PID>
```

### TypeScript errors?
```bash
npm run type-check      # See detailed errors
npm run lint:fix        # Try to auto-fix
```

### Tests failing?
```bash
npm run test -- --verbose    # Get detailed output
npm run test:watch           # Interactive mode
```

### Web build failing?
```bash
npm run clean:deep      # Remove everything
npm install             # Fresh install
npm run build:web       # Try again
```

## 🚀 Next Steps

After verifying everything works:

1. Read `RN_UNIFIED_MIGRATION_PLAN.md` for the complete technical specification
2. Check `MIGRATION_COMPLETION_STATUS.md` to track progress
3. Start Phase 2 (Business Logic Porting) when ready

---

**Architecture:** Unified React Native (Web + iOS + Android)  
**Code Reuse:** 95%+ across all platforms  
**Build Status:** ✅ All configured and working
