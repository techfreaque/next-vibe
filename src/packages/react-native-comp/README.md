# React Native Setup - Universal Codebase

**Vision**: Share 100% of page code between Next.js and React Native with ZERO `.native.tsx` files.

**Status**: ✅ Metro running, bundle compiling (965 modules in 5.9s)

---

## Quick Start

**⚠️ IMPORTANT**: Expo Go is **NOT compatible** with React Native 0.82.1. Use native build instead.

```bash
cd src/packages/react-native-comp

# Start Metro bundler
bun run start

# Build and install native APK (Android)
bun run android

# The APK will be built and installed automatically
# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

**Why not Expo Go?**
- React Native 0.82.1 requires native builds
- Expo Go expects SDK-compatible versions
- Native builds provide full feature access

**Metro Commands:**
- `a` - Android
- `i` - iOS simulator
- `r` - Reload
- `c` - Clear cache

---

## Architecture

### Current State
```
Next.js:     src/app/[locale]/page.tsx → Next.js imports
React Native: src/app/[locale]/page.native.tsx → RN imports
```

### Target State (Zero .native.tsx)
```
Both Platforms: src/app/[locale]/page.tsx → @/ui/* imports

Resolution:
  Next.js:        @/ui/button → web/ui/button.tsx
  React Native:   @/ui/button → native/ui/.../button.tsx
```

### How It Works

**1. Platform-Specific File Resolution**
```
Metro checks in order:
1. page.native.tsx ← Use on React Native
2. page.tsx        ← Fallback (shared)
```

**2. Automatic UI Mapping**
```javascript
// You write once:
import { Button } from "@/packages/next-vibe-ui/web/ui/button";

// Metro automatically resolves:
// Web:    → web/ui/button.tsx
// Native: → native/ui/.../button.tsx
```

**3. Module Mocking**
```javascript
// Metro mocks Next.js imports:
import Link from "next/link"        → Expo Router Link
import Image from "next/image"       → React Native Image
import "server-only"                 → Empty module
```

---

## Configuration

### Metro Config (Critical)

**File**: `metro.config.cjs`

```javascript
// Extension priority (CRITICAL)
config.resolver.sourceExts = [
  'native.tsx',  // Highest priority
  'native.ts',
  'tsx',         // Shared files
  'ts',
];

// Custom resolver
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // 1. Auto-map UI components
  if (moduleName.startsWith('@/packages/next-vibe-ui/web/ui/')) {
    return /* native component path */;
  }

  // 2. Mock React Native internals
  if (moduleName.includes('../Utilities/')) {
    return { type: 'empty' };
  }

  // 3. Mock Next.js modules
  if (moduleName === 'next/link') {
    return { filePath: 'lib/module-mocks.tsx' };
  }

  // 4. Default resolution
  return context.resolveRequest(context, moduleName, platform);
};
```

**Critical Fix Applied** (Line 45):
```javascript
// ❌ BROKEN:
'next/link': path.resolve(projectRoot, 'lib/module-mocks.tsx'),

// ✅ FIXED:
'next/link': path.resolve(projectRoot, 'lib/module-mocks'),
```
This single fix made all mocking work!

### Other Configs

**babel.config.cjs**
```javascript
module.exports = {
  presets: ['babel-preset-expo'],
};
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["../../*"],
      "next-vibe-ui/*": ["../next-vibe-ui/native/ui/packages/reusables/src/*"]
    }
  }
}
```

---

## File Structure

```
src/packages/react-native-comp/
├── app/                    # Expo Router structure
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Entry point
│   └── [locale]/
│       ├── _layout.tsx
│       ├── index.tsx      # Home page wrapper
│       └── help.tsx       # Help page wrapper
├── lib/
│   ├── module-mocks.tsx   # Next.js mocks
│   └── error-resilience.tsx  # Error boundaries
├── metro.config.cjs       # THE critical config
├── babel.config.cjs
├── tsconfig.json
├── app.json               # Expo metadata
└── package.json
```

---

## Debugging

### Device Debugging

**Check Metro Logs**
```bash
# All React Native errors show here
bun run start
# Look for: ERROR, LOG, WARN
```

**Open Dev Menu**

Android:
```bash
# Shake device OR
adb shell input keyevent 82
# Then select "Show Inspector"
```

iOS:
```bash
# Shake device OR Cmd+D in simulator
```

**Logcat (Android)**
```bash
adb logcat ReactNative:V ReactNativeJS:V *:S
```

### Common Issues

**"Something went wrong"**
- Check Metro terminal for actual error
- Open dev menu → Debug
- Check logcat/console

**"Unable to resolve module"**
- Check `metro.config.cjs` resolver
- Verify component exists in native UI
- Try `bun run reset`

**Metro won't start**
```bash
pkill -9 -f "expo start"
rm -rf .expo node_modules/.cache
bun run reset
```

**App crashes on load**
- Add error boundaries (see Phase 3 in PRODUCTION_PLAN.md)
- Check for Next.js-specific imports
- Create `.native.tsx` override temporarily

### Performance Debugging

**Measure bundle time**
```bash
time bun run start
# Should be < 10s
```

**Check bundle size**
```bash
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output bundle.js

ls -lh bundle.js
# Target: ~3MB production, ~5MB dev
```

---

## Development Workflow

### Creating Native Overrides (Temporary)

When a page needs React Native-specific code:

```bash
# 1. Identify the page
src/app/[locale]/profile/page.tsx

# 2. Create native version
touch src/app/[locale]/profile/page.native.tsx

# 3. Implement with RN components
```

```tsx
// page.native.tsx
import { View, Text } from 'react-native';

export default function ProfilePage() {
  return (
    <View className="p-4">
      <Text className="text-2xl">Profile</Text>
    </View>
  );
}
```

Metro automatically uses `.native.tsx` on mobile!

### Testing Both Platforms

```bash
# Test Next.js
bun run dev

# Test React Native
cd src/packages/react-native-comp
bun run start
```

Both can run simultaneously!

---

## Dependencies

```json
{
  "expo": "~52.0.25",
  "expo-router": "~4.0.16",
  "react-native": "0.82.1",
  "nativewind": "5.0.0-preview.2",
  "tailwindcss": "4.0.0",
  "react": "19.2.0"
}
```

**Known Issues:**
- Expo Go NOT compatible with RN 0.82.1 (use native builds)
- Use `bun run android` for Android development
- APK builds working: 105MB debug APK confirmed functional

---

## Key Concepts

### Extension Priority
Metro searches: `.native.tsx` → `.tsx` → error

### Path Aliases
- `@/` → `src/`
- `next-vibe-ui/web/ui` → auto-maps to native

### Module Mocking
- Next.js modules → Expo equivalents
- React Native internals → empty modules
- Missing components → logged warnings (not crashes)

---

## Current Status

**✅ Working:**
- Metro bundler (965 modules, 5.9s)
- Module resolution
- UI auto-mapping
- Next.js mocking
- Bundle compilation

**⏳ Next:**
- Device validation
- Error boundaries
- Universal components
- Page migration

See **PRODUCTION_PLAN.md** for roadmap.

---

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Metro Bundler](https://metrobundler.dev/)
- [NativeWind](https://www.nativewind.dev/)

---

## Troubleshooting Quick Reference

| Issue | Fix |
|-------|-----|
| Metro won't start | `pkill -9 -f expo && bun run reset` |
| Module not found | Check metro.config.cjs resolver |
| Component crashes | Wrap in ErrorBoundary |
| Import errors | Check path aliases |
| Expo Go fails | Use native build: `bun run android` |
| Build failures | Check Android SDK, run `npx expo prebuild` |
| Performance slow | Check bundle size, clear cache |

---

**Next Steps**: See PRODUCTION_PLAN.md for complete roadmap to production.
