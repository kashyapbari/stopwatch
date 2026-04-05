# Testing & Command Examples

## Verification Commands

Run these to verify the initialization:

```bash
# Check TypeScript (0 errors expected)
npm run type-check

# Check code quality (0 errors expected)
npm run lint

# Run tests (3/3 passing expected)
npm run test

# Build for web (should succeed)
npm run build:web
```

## All-in-One Verification

```bash
# Run all checks together
npm run type-check && npm run lint && npm run test && npm run build:web && echo "✅ All checks passed!"
```

## Development Commands

```bash
# Start web development server
npm run start:web
# Visit http://localhost:3000

# Watch mode for tests
npm run test:watch

# Format code
npm run format

# Check formatting
npm run format:check

# Auto-fix linting issues
npm run lint:fix

# Get test coverage
npm run test:coverage
```

## Building Commands

```bash
# Web production build
npm run build:web
# Output in: dist/web/

# iOS development
npm run start:ios

# iOS production build
npm run build:ios

# Android development
npm run start:android

# Android production build
npm run build:android

# React Native metro bundler
npm start
```

## Cleanup Commands

```bash
# Remove build artifacts
npm run clean

# Remove everything including node_modules
npm run clean:all
```

## Git Commands

```bash
# Check current status
git status

# Stage all changes
git add .

# Create commit
git commit -m "Your message"

# Push to remote
git push origin native-app

# View recent commits
git log --oneline -5

# View current branch
git branch
```

## Directory Information

```bash
# List source files
ls -la src/

# List test files
ls -la __tests__/

# View project structure (requires tree)
tree -L 2 -I 'node_modules'

# See dist folder (after build)
ls -la dist/web/
```

## Troubleshooting Commands

```bash
# Clear npm cache
npm cache clean --force

# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Verify all node_modules installed
npm list --depth=0

# Check Node version
node --version

# Check npm version
npm --version
```

## Expected Test Output

```
PASS __tests__/App.test.tsx
  App Component
    ✓ should have proper test structure (1 ms)
    ✓ should have React available
    ✓ should import without errors (291 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.813 s
```

## Expected Build Output

```
asset bundle.js 3.45 MiB [emitted] [minimized] [big] (name: main)
asset index.html 988 bytes [emitted]
orphan modules 743 KiB [orphan] 224 modules
runtime modules 1.19 KiB 5 modules
cacheable modules 1.29 MiB

webpack 5.105.4 compiled with 7 warnings in 1406 ms
```

## Expected Linting Output

```
> stopwatch-app@1.0.0 lint
> eslint src --ext .ts,.tsx

(no output = success, 0 errors)
```

## Expected Type Check Output

```
> stopwatch-app@1.0.0 type-check
> tsc --noEmit

(no output = success, 0 errors)
```

## Port Configuration

If port 3000 is already in use:

```bash
# Use different port
PORT=3001 npm run start:web
# Visit http://localhost:3001
```

## Environment Check

```bash
# Verify your environment
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
echo "Branch: $(git branch --show-current)"
echo "Directory: $(pwd)"
```

## Full Setup Verification Script

Save this as `verify.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Verifying React Native Stopwatch Setup..."
echo ""

echo "1️⃣  Checking Node.js..."
node --version

echo ""
echo "2️⃣  Checking npm..."
npm --version

echo ""
echo "3️⃣  Checking TypeScript..."
npm run type-check

echo ""
echo "4️⃣  Checking code quality..."
npm run lint

echo ""
echo "5️⃣  Running tests..."
npm run test

echo ""
echo "6️⃣  Building for web..."
npm run build:web

echo ""
echo "✅ All verification checks passed!"
echo ""
echo "Next steps:"
echo "  - npm run start:web     (start development server)"
echo "  - npm run lint:fix      (auto-fix linting issues)"
echo "  - npm run format        (format code)"
echo ""
```

Run with: `bash verify.sh`

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run start:web` | Start dev server |
| `npm run build:web` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run type-check` | TypeScript validation |
| `npm run format` | Auto-format code |
| `git status` | Check git status |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Create commit |
| `git push origin native-app` | Push changes |

## Common Issues & Solutions

### Port Already in Use
```bash
PORT=3001 npm run start:web
```

### Dependencies Issue
```bash
npm install --legacy-peer-deps
```

### Cache Issues
```bash
npm cache clean --force && npm install --legacy-peer-deps
```

### Build Failed
```bash
npm run clean && npm install --legacy-peer-deps && npm run build:web
```

### Test Issues
```bash
npm run clean && npm install --legacy-peer-deps && npm run test
```

---

For more detailed information, see:
- `QUICKSTART_RN.md` - Quick reference guide
- `SETUP_GUIDE.md` - Detailed setup documentation
- `INIT_SUMMARY.md` - Initialization summary
