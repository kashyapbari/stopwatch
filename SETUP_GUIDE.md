# React Native Stopwatch - Project Setup Guide

This document describes the project structure and setup for the unified React Native stopwatch application that runs on web, iOS, and Android.

## Project Structure

```
stopwatch/
├── src/                          # Main source code (shared across platforms)
│   ├── App.tsx                   # Root component
│   ├── index.tsx                 # React Native entry point
│   ├── screens/                  # Screen components
│   │   ├── HomeScreen.tsx        # Main stopwatch screen
│   │   └── SettingsScreen.tsx    # Settings screen
│   ├── components/               # Reusable components
│   ├── services/                 # API and storage services
│   ├── business-logic/           # Core application logic
│   ├── hooks/                    # Custom React hooks
│   ├── context/                  # React Context providers
│   ├── navigation/               # Navigation configuration
│   │   └── RootNavigator.tsx     # Stack navigator setup
│   ├── types/                    # TypeScript type definitions
│   └── styles/                   # Theme and global styles
│
├── web/                          # Web-specific files
│   ├── index.html                # Web entry HTML file
│   ├── index.tsx                 # Web entry point
│   └── public/                   # Static assets
│
├── ios/                          # iOS-specific code (auto-generated)
├── android/                      # Android-specific code (auto-generated)
│
├── __tests__/                    # Test files
│   ├── App.test.tsx             # Component tests
│   └── setup.ts                 # Jest configuration
│
├── .github/
│   └── workflows/
│       └── deploy-web.yml       # CI/CD for web deployment
│
├── Configuration Files
├── babel.config.js              # Babel transpilation config
├── metro.config.js              # React Native Metro bundler config
├── webpack.config.js            # Webpack for web builds
├── tsconfig.json                # TypeScript configuration
├── jest.config.js               # Jest testing configuration
├── .eslintrc.json               # ESLint rules
└── .prettierrc.json             # Code formatting rules
```

## Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- For iOS development: macOS, Xcode
- For Android development: Android Studio, Android SDK

### Initial Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Verify TypeScript compilation
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test
```

## Available Scripts

### Development
```bash
# Start web dev server (http://localhost:3000)
npm run start:web

# Start iOS development
npm run start:ios

# Start Android development
npm run start:android

# Start Metro bundler for native development
npm start
```

### Building
```bash
# Build for web (production)
npm run build:web

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

### Code Quality
```bash
# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Watch mode for tests
npm run test:watch
```

### Cleanup
```bash
# Clean build artifacts
npm run clean

# Clean everything including node_modules
npm run clean:all
```

## Technology Stack

### Core
- **React Native 0.73** - Cross-platform mobile development
- **React 18.2** - UI library
- **TypeScript 5.3** - Type-safe JavaScript
- **react-native-web 0.19** - Web support for React Native

### Navigation
- **@react-navigation 6.1** - Cross-platform navigation
- **@react-navigation/stack** - Stack navigation
- **@react-navigation/bottom-tabs** - Tab navigation (optional)

### State Management & Storage
- **@react-native-async-storage** - Persistent local storage
- **React Context** - State management

### Native Features
- **react-native-screens** - Native screen management
- **react-native-gesture-handler** - Gesture handling
- **react-native-reanimated** - Animations
- **react-native-sound** - Audio playback

### Build Tools
- **Metro** - React Native module bundler
- **Webpack 5** - Web bundler
- **Babel** - JavaScript transpiler

### Testing & Quality
- **Jest 29** - Testing framework
- **@testing-library/react-native** - React Native testing utilities
- **ESLint 8** - Code linting
- **Prettier 3** - Code formatting

## Platform-Specific Notes

### Web
- Entry point: `web/index.tsx`
- HTML file: `web/index.html`
- Bundler: Webpack
- Dev server: http://localhost:3000
- Build output: `dist/web/`

### iOS
- Required: Xcode command line tools
- Setup: Run `cd ios && pod install` (first time)
- Entry point: `ios/Stopwatch/main.m`
- Build output: `ios/build/`

### Android
- Required: Android SDK and NDK
- Setup: Automatic via gradle
- Entry point: `android/app/src/main/java/com/stopwatch/MainActivity.kt`
- Build output: `android/app/build/`

## Git Workflow

This project uses the `native-app` branch for React Native development.

```bash
# Check current branch
git branch

# Make changes
git add .
git commit -m "Your commit message"

# Push changes
git push origin native-app
```

## Troubleshooting

### Dependency Issues
If you encounter dependency conflicts:
```bash
npm install --legacy-peer-deps
```

### Port Already in Use (Web)
If port 3000 is already in use:
```bash
# Change port in webpack.config.js or use:
PORT=3001 npm run start:web
```

### React Native Cache Issues
```bash
# Clear React Native cache
npm run clean:all
npm install --legacy-peer-deps
```

### Pod Issues (iOS)
```bash
cd ios
pod install --repo-update
cd ..
```

## Next Steps

1. **Implement Core Screens**: Build the stopwatch UI in `src/screens/`
2. **Add Services**: Create storage and audio services in `src/services/`
3. **Business Logic**: Implement timer logic in `src/business-logic/`
4. **Styling**: Add app theme in `src/styles/`
5. **Testing**: Write unit and integration tests in `__tests__/`
6. **Navigation**: Update navigation in `src/navigation/` as needed

## Migration from Old Code

The old web code (in `js/` and `css/` directories) is preserved for reference during migration. Once the React Native implementation is complete, these can be removed.

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Documentation](https://jestjs.io/)

## Project Configuration Details

### TypeScript Configuration (tsconfig.json)
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path aliases for easier imports (@screens, @components, etc)
- Type checking includes: react-native, jest

### Babel Configuration (babel.config.js)
- Uses @react-native/babel-preset
- Includes TypeScript plugin
- Optional chaining and nullish coalescing support
- React Native Paper theme plugin for production

### Metro Configuration (metro.config.js)
- Configured for TypeScript
- Supports both RN and web builds
- Custom source extensions: js, jsx, ts, tsx, json, mjs

### Webpack Configuration (webpack.config.js)
- Development: eval-source-map
- Production: source-map
- CSS extraction for production
- Asset bundling (PNG, JPG, SVG, WebP)
- Dev server on port 3000 with hot reload

## Environment

- Platform: macOS (darwin)
- Node: v20.18.0
- npm: 10.8.2
- Current Branch: native-app
