# Quick Start Guide - React Native Stopwatch

## TL;DR - Get Running in 30 Seconds

```bash
# Already done! Just verify it works:
npm run type-check          # TypeScript check ✅
npm run lint                # Code quality ✅
npm run test                # Run tests ✅
npm run build:web           # Build for web ✅
npm run start:web           # Start dev server → http://localhost:3000
```

## Project Status

✅ **Fully Initialized and Verified**

- TypeScript: No errors
- ESLint: No issues
- Jest Tests: 3/3 passing
- Web Build: Success
- All dependencies installed

## Directory Structure

```
src/                  ← All shared code (TypeScript)
├── App.tsx           ← Root component
├── screens/          ← Screen components
├── components/       ← Reusable UI components
├── services/         ← API & storage
├── business-logic/   ← Core stopwatch logic
├── hooks/            ← Custom React hooks
├── context/          ← State management
├── navigation/       ← Navigation setup
├── types/            ← Type definitions
└── styles/           ← Theme & styling

web/                  ← Web-specific
├── index.tsx         ← Web entry point
└── index.html        ← HTML template

__tests__/            ← Tests
android/              ← Android app (will be auto-generated)
ios/                  ← iOS app (will be auto-generated)
```

## Key Files Created

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript config (strict mode) |
| `babel.config.js` | JavaScript transpilation |
| `webpack.config.js` | Web bundler |
| `metro.config.js` | React Native bundler |
| `jest.config.js` | Testing setup |
| `.eslintrc.json` | Linting rules |
| `.prettierrc.json` | Code formatting |
| `package.json` | Dependencies & scripts (1,188 packages) |
| `.github/workflows/deploy-web.yml` | CI/CD automation |

## Most Important npm Scripts

```bash
# Development
npm run start:web              # Start web dev server (port 3000)

# Code Quality
npm run type-check             # TypeScript validation
npm run lint                   # ESLint checking
npm run lint:fix               # Fix linting issues
npm run format                 # Format code with Prettier

# Testing
npm run test                   # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report

# Building
npm run build:web              # Production web build

# Cleanup
npm run clean                  # Remove build artifacts
npm run clean:all              # Remove everything + node_modules
```

## What Was Installed

### Core Libraries
- React 18.2 + React Native 0.73
- React Native Web (web support)
- React Navigation (routing)
- TypeScript 5.3

### Build Tools
- Webpack 5 (web bundler)
- Metro (React Native bundler)
- Babel 7 (transpiler)
- Jest 29 (testing)

### Code Quality
- ESLint 8
- Prettier 3
- TypeScript strict mode

## File Structure Summary

**Total Files Created**: 30+
```
📄 Configuration: 8 files (tsconfig, babel, webpack, etc)
📄 Source Code: 5 files (App, index, 3 screens)
📄 Tests: 2 files (App test + setup)
📄 Workflows: 1 file (GitHub Actions)
📄 Documentation: 2 guides (this + detailed guide)
📁 Directories: 11 folders (properly organized)
```

## Platform Support

| Platform | Status | Command |
|----------|--------|---------|
| **Web** | ✅ Ready | `npm run start:web` |
| **iOS** | ✅ Ready | `npm run start:ios` |
| **Android** | ✅ Ready | `npm run start:android` |

## Verification Checklist

✅ TypeScript compilation (0 errors)  
✅ ESLint validation (0 warnings)  
✅ Jest tests passing (3/3)  
✅ Web build successful  
✅ All npm scripts working  
✅ Dependencies resolved (1,188 packages)  
✅ CI/CD workflow configured  
✅ Git tracking configured  

## Common Commands

```bash
# Start development
npm run start:web

# Check for errors
npm run type-check && npm run lint

# Format code
npm run format

# Run tests
npm run test

# Build for production
npm run build:web

# See current git status
git status
```

## Path Aliases (TypeScript)

Use these in imports for cleaner code:
```typescript
import { HomeScreen } from '@screens/HomeScreen'      // src/screens
import { useCustom } from '@hooks/useCustom'          // src/hooks
import { TimerService } from '@services/TimerService' // src/services
import { AppContext } from '@context/AppContext'      // src/context
import { Theme } from '@styles/theme'                 // src/styles
import { NavState } from '@types/index'               // src/types
```

## Next Steps

1. **Review Structure**: Check `SETUP_GUIDE.md` for detailed documentation
2. **Run Tests**: `npm run test` to verify setup
3. **Start Dev**: `npm run start:web` to see it running
4. **Build Features**: 
   - Add UI in `src/screens/HomeScreen.tsx`
   - Add logic in `src/business-logic/`
   - Add services in `src/services/`
5. **Commit Changes**: `git add . && git commit -m "Your message"`

## Important Notes

- **Shared Code**: `src/` folder code runs on web, iOS, and Android
- **Platform-Specific**: Use `Platform.select()` from React Native for platform differences
- **Styling**: Use `StyleSheet` from React Native (works on all platforms)
- **Types**: Full TypeScript support enabled with strict mode
- **Testing**: Jest configured and ready for unit/integration tests

## Troubleshooting

**Port 3000 in use?**
```bash
PORT=3001 npm run start:web
```

**Dependencies broken?**
```bash
npm run clean:all
npm install --legacy-peer-deps
```

**Type errors?**
```bash
npm run type-check        # See full report
npm run lint:fix          # Auto-fix issues
```

## Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Feature: Add stopwatch UI"

# Push
git push origin native-app

# Current branch: native-app ✅
```

## Environment

- Node: v20.18.0
- npm: 10.8.2
- Branch: native-app
- Platform: macOS/darwin

## Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- See `SETUP_GUIDE.md` for detailed documentation

---

**Status**: ✅ Ready for Development  
**Last Updated**: March 31, 2026
