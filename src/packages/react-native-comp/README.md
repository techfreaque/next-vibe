# React Native Expo Router Package

This package provides seamless integration between Next.js Server Components and Expo Router for cross-platform development.

## Structure

```
src/packages/react-native-comp/
├── app/[locale]/              # Auto-generated Expo Router pages
│   ├── index.tsx              # Generated wrappers
│   ├── _layout.tsx           # Generated layout wrappers
│   └── chat/
│       ├── index.tsx          # Custom wrapper (marked with custom-index)
│       └── page.tsx           # Local implementation
│
├── i18n/                      # Translations for wrapper utilities
│   ├── en/index.ts
│   ├── de/index.ts
│   └── pl/index.ts
│
├── scripts/                   # Build scripts (excluded from linting)
│   └── generate-expo-indexes.ts
│
└── utils/                     # Wrapper utilities
    ├── nextjs-compat-wrapper.tsx  # Core wrapper functions
    ├── platform-helpers.ts         # Platform detection
    ├── index.ts                    # Main exports
    └── README.md                   # Detailed documentation
```

## Features

### ✅ Automatic Code Generation
- Scans `src/app/[locale]` for `page.tsx` and `layout.tsx` files
- Generates corresponding Expo Router wrappers automatically
- Runs before every native start command

### ✅ Type-Safe Wrappers
- Handles various Next.js component signatures:
  - Async Server Components (Next.js 15)
  - Sync components
  - Components that redirect (return `never`)
  - Legacy sync params
- Full TypeScript support with proper generics
- No `ts-expect-error` directives needed

### ✅ Flexible API
- `createPageWrapper()` - Standard pages with loading/error UI
- `createLayoutWrapper()` - Layouts with Slot
- `createPageWrapperWithOptions()` - Advanced customization

### ✅ Custom Overrides
- Add `custom-index` directive to prevent auto-generation
- Manual wrappers won't be overwritten

## Quick Start

### Running Native Apps

```bash
# Start Expo dev server (auto-generates wrappers)
bun run native

# Run on specific platforms
bun run native:android
bun run native:ios
bun run native:web
```

### Manual Generation

```bash
# Regenerate all wrappers
bun run generate:expo-indexes
```

## Creating Pages

### 1. Write Next.js Component

```tsx
// src/app/[locale]/profile/page.tsx
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}) {
  const { locale } = await params;
  return <div>Profile</div>;
}
```

### 2. Generate Wrapper (Automatic)

When you run `bun run native`, this is auto-generated:

```tsx
// src/packages/react-native-comp/app/[locale]/profile/index.tsx
import PageComponent from "@/app/[locale]/profile/page";
import { createPageWrapper } from "@/packages/react-native-comp/utils";

export default createPageWrapper(PageComponent);
```

### 3. Done!

Your page now works in both Next.js web and Expo native apps.

## Custom Wrappers

For pages needing special handling:

```tsx
/**
 * custom-index
 *
 * NOTE: This wrapper uses local page.tsx implementation
 */

import { createPageWrapperWithOptions } from "@/packages/react-native-comp/utils";
import PageComponent from "./page"; // Local file

export default createPageWrapperWithOptions(PageComponent, {
  loadingComponent: <CustomLoader />,
  additionalParams: { source: "mobile" },
});
```

The `custom-index` directive prevents auto-generation from overwriting this file.

## Type Safety

The wrappers handle all Next.js component signatures:

```typescript
type AnyNextPageComponent =
  // Standard async page
  | ((props: NextPageProps) => Promise<JSX.Element>)
  // Sync page
  | ((props: NextPageProps) => JSX.Element)
  // Page that redirects
  | ((props: NextPageProps) => never)
  // Legacy sync params
  | ((props: { params: ExpoRouterParams }) => Promise<JSX.Element>)
  // Any other shape
  | ((props: any) => Promise<JSX.Element> | JSX.Element);
```

No type errors, no `ts-expect-error` directives needed!

## Scripts

### generate-expo-indexes.ts

Located in `src/packages/react-native-comp/scripts/`, this script:

- Scans for all `page.tsx` and `layout.tsx` files
- Generates Expo Router compatible wrappers
- Respects `custom-index` directives
- Reports statistics with colored output
- Excluded from ESLint checks (uses Bun-specific APIs)

## Translations

Wrapper utilities use these translation keys:

```typescript
packages.reactNativeComp.utils.nextjs-compat-wrapper.failedToLoadPage
```

Available in English, German, and Polish.

## Vibe Check Status

✅ **All checks passing** (only 1 warning about ignore pattern)

- No type errors
- No linting errors
- All imports properly sorted
- Prettier formatted
- i18n validated

## Documentation

- `utils/README.md` - Detailed wrapper documentation
- `EXPO_ROUTER_SETUP.md` - Complete integration guide (project root)

## Maintenance

The package is fully automated:

1. Add/modify pages in `src/app/[locale]`
2. Run `bun run native`
3. Wrappers generate automatically
4. Everything just works!

For edge cases, use `custom-index` directive and manual wrappers.
