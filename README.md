# Advanced Stopwatch - Unified React Native Platform

> **Note:** This project is undergoing a React Native migration to provide a unified codebase for Web, iOS, and Android. See documentation below for the React Native implementation details.

A lightweight, responsive workout timer application available on **Web (GitHub Pages)**, **iOS**, and **Android** with automated audio cues and preset management. Perfect for HIIT, CrossFit, strength training, yoga, breathing exercises, and any workout requiring specific intervals.

## Features

✨ **Core Features**

- **Quick Setup** - Start with sensible defaults in one click
- **Advanced Configuration** - Customize all 5 workout parameters
- **Audio Cues** - Distinct tones signal rep start, rep end, set end, and countdowns
- **Elapsed Time Display** - Large, easy-to-read timer in MM:SS format
- **Preset Management** - Save unlimited workout configurations with auto-generated names
- **Workout History** - Track last 10 completed workouts with duration and stats
- **Cookie Storage** - Multi-user support (each device/browser has separate presets)

🎯 **Workout Parameters**

Configure any combination of:
- **Work per Rep** - 1-300 seconds
- **Rest between Reps** - 0-300 seconds
- **Reps per Set** - 1-50
- **Number of Sets** - 1-50
- **Rest between Sets** - 0-600 seconds

🎨 **Design**

- Dark mode throughout for eye comfort during workouts
- Fully responsive (optimized for iPhone, iPad, and desktop)
- Touch-friendly buttons (44px+ minimum)
- Sober, clean interface with cyan accents
- No animations, pure focus on functionality

🔊 **Audio Notifications**

- **Countdown Tone** - 3 sequential beeps before workout/set starts
- **Start Tone** - 440Hz sine wave signals rep/phase beginning
- **Stop Tone** - 880Hz sine wave signals end of rep/phase
- All tones use Web Audio API (no external files)

💾 **Data Storage**

- Browser cookies store presets and history
- 30-day expiration (auto-extends on use)
- Each browser/device has separate storage
- No backend or cloud sync needed
- Works fully offline

## How to Use

### Quick Start (1 Click)

1. App loads with default workout (30s work / 15s rest / 5 reps / 3 sets / 60s set rest)
2. Click **Start Workout**
3. 3-second countdown plays
4. Follow audio cues to complete your workout
5. Workout auto-saves to history

### Custom Workout

1. Click **Advanced** to open detailed configuration
2. Adjust any of the 5 parameters
3. Click **Save as Preset** to store for later
4. Click **Start Workout**

### Load Previous Workout

1. Click **View History**
2. Click a past workout to reload that preset
3. Click **Start Workout**

### During Workout

- **Pause** - Pause/resume timer
- **Reset** - Reset to start (confirms before resetting)
- **Stop** - End workout early (auto-saves to history)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge (Chromium-based)
- iOS Safari 14+

Requires Web Audio API support (all modern browsers).

## Preset ID Format

Presets are automatically named based on configuration:

```
{work}s-{rest-reps}s-{reps}r-{sets}s-{rest-sets}rs

Examples:
30s-15s-5r-3s-60rs   (30 sec work, 15 sec rest, 5 reps, 3 sets, 60 sec set rest)
45s-20s-4r-4s-90rs   (45 sec work, 20 sec rest, 4 reps, 4 sets, 90 sec set rest)
10s-5s-10r-5s-120rs  (10 sec work, 5 sec rest, 10 reps, 5 sets, 120 sec set rest)
```

## Workout Timeline Example

With config: 30s work / 15s rest / 5 reps / 3 sets / 60s set rest

```
0:00   - 3-second countdown
0:03   - Start Tone, Rep 1 Work begins
0:33   - Stop Tone, Rep 1 Rest begins (15s)
0:48   - Start Tone, Rep 2 Work begins
... (repeat for reps 3-5)
3:33   - Stop Tone, Rep 5 Rest ends
3:48   - Stop Tone, Set 1 ends, Set Rest begins (60s)
4:48   - 3-second countdown before Set 2
4:51   - Start Tone, Set 2 begins
... (repeat pattern for Set 2 and Set 3)
12:30  - Workout Complete! Auto-saved to history
```

## Technical Details

### Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Dark mode, responsive, no frameworks
- **JavaScript (ES6+)** - Vanilla, no dependencies
- **Web Audio API** - Native browser audio synthesis
- **Browser Cookies** - Client-side persistent storage

### No External Dependencies

- ✅ No npm packages
- ✅ No build process
- ✅ No server required
- ✅ No external audio files
- ✅ ~2.5 KB gzipped total

### Code Structure

```
js/
├── storage.js    - Cookie management & PresetManager
├── audio.js      - Web Audio API tone generation
├── workout.js    - Workout engine & timer logic
├── ui.js         - View rendering & UI management
└── main.js       - App controller & event routing

css/
└── styles.css    - Dark mode theme & responsive design
```

## Troubleshooting

### Audio not playing

- Check browser permissions for audio
- Verify Web Audio API is supported (Chrome, Firefox, Safari all support it)
- Check device volume
- Try a different browser

### Presets not saving

- Check if browser allows cookies (private/incognito mode disables cookies)
- Verify cookies are enabled in browser settings
- GitHub Pages uses HTTPS (cookies require HTTPS on GitHub Pages)

### Timer not smooth

- Check system performance
- Close other browser tabs/applications
- Verify browser isn't throttling JavaScript
- Check DevTools for console errors

### Wrong preset loading

- Clear browser cookies and try again
- Check preset name format in browser storage
- Verify JSON in cookies (DevTools → Application → Cookies)

## Keyboard Shortcuts

(Future feature - not yet implemented)

```
Space   - Pause/Resume
R       - Reset
S       - Stop
A       - Advanced Setup
H       - History
```

## Known Limitations

- Audio requires user interaction to initialize (browser security)
- No sync across devices (each device has separate cookies)
- No export/import of presets (use preset names to recreate manually)
- No voice announcements (audio tones only)

## Future Enhancements

- [ ] Sound customization (choose tone types)
- [ ] Light mode toggle
- [ ] Vibration feedback on mobile
- [ ] Interval export (CSV/JSON)
- [ ] Multi-language support
- [ ] Voice announcements
- [ ] PWA (install as app)
- [ ] Workout analytics
- [ ] Social sharing
- [ ] Cloud sync

## License

MIT License - Free to use, modify, and distribute.

## React Native Migration Documentation

This project is being migrated to a **unified React Native codebase** supporting Web, iOS, and Android from a single codebase.

### 📚 Documentation Guide

- **`SETUP_QUICKSTART.md`** - Quick start guide and npm scripts reference
- **`RN_UNIFIED_MIGRATION_PLAN.md`** - Complete technical specification (all 9 phases)
- **`MIGRATION_COMPLETION_STATUS.md`** - Track progress through each phase
- **`PLAN.md`** - Original web app specification (for reference)

### 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start web development server
npm run start:web

# Run tests
npm run test

# Build for production
npm run build:web
```

### 📊 Project Status

- **Phase 1:** ✅ Complete - Project setup & foundation
- **Phases 2-9:** ⏳ Pending - Business logic through deployment
- **Overall:** 11% complete (1 of 9 phases)

See `MIGRATION_COMPLETION_STATUS.md` for detailed progress.

## Support

For bugs, feature requests, or questions:
- Open an issue on GitHub
- Check the migration documentation for implementation details

## Credits

Built with ❤️ for fitness enthusiasts who need to focus on their form, not their stopwatch.

---

**Happy Training! 💪**
