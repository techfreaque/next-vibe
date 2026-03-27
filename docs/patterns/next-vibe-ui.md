# next-vibe-ui Pattern

`next-vibe-ui` is the platform abstraction layer for all UI and framework utilities. It wraps Next.js, TanStack/Vite, and React Native behind identical import paths so the same component or hook works across all three runtimes without conditionals.

**Rule: Never import directly from `next/*`, `expo-router`, `react-native`, or `@tanstack/react-router` in application code.** Always go through `next-vibe-ui`. The correct implementation resolves automatically based on the build target.

---

## What It Abstracts

### UI Components

Import from `next-vibe-ui/ui/*` — never from `next/image`, `next/link`, or framework-specific component libraries.

| Import | Web | Native | TanStack |
|--------|-----|--------|----------|
| `next-vibe-ui/ui/link` | `next/link` | `expo-router` Link | `@tanstack/react-router` Link |
| `next-vibe-ui/ui/image` | `next/image` (optimized) | React Native `Image` | plain `<img>` |
| `next-vibe-ui/ui/button` | shadcn/ui Button | rn-primitives Button | shadcn/ui Button |
| `next-vibe-ui/ui/head` | Next.js `<Head>` | N/A | TanStack head() |
| `next-vibe-ui/ui/body` | `<body>` | N/A | `<body>` |
| `next-vibe-ui/ui/outlet` | renders children | N/A | TanStack `<Outlet>` |
| `next-vibe-ui/ui/theme-provider` | next-themes | `Appearance` API | N/A |
| `next-vibe-ui/ui/div` | `<div>` | `<View>` | `<div>` |
| `next-vibe-ui/ui/span` | `<span>` | `<Text>` | `<span>` |
| All other `ui/*` | shadcn/ui | rn-primitives | shadcn/ui |

### Navigation & Routing

Import from `next-vibe-ui/hooks/*` — never from `next/navigation` directly.

| Import | Web | Native | TanStack |
|--------|-----|--------|----------|
| `next-vibe-ui/hooks/use-navigation` | `useRouter` (next/navigation) | `useExpoRouter` | `useNavigate` |
| `next-vibe-ui/hooks/use-pathname` | `usePathname` (next/navigation) | `useExpoPathname` | `useLocation().pathname` |

### Server Utilities

Import from `next-vibe-ui/lib/*` — never from `next/headers`, `next/navigation` (server), or `next/server` directly.

| Import | Web | TanStack | Native |
|--------|-----|----------|--------|
| `next-vibe-ui/lib/headers` | `next/headers` cookies/headers | TanStack SSR shim | N/A |
| `next-vibe-ui/lib/redirect` | `next/navigation` redirect | `@tanstack/react-router` redirect | expo-router replace |
| `next-vibe-ui/lib/not-found` | `next/navigation` notFound | TanStack notFound | throws Error |
| `next-vibe-ui/lib/request` | `NextRequest`/`NextResponse` from `next/server` | Custom compatible classes | N/A |
| `next-vibe-ui/lib/storage` | `localStorage` (async wrapper) | `AsyncStorage` | N/A |
| `next-vibe-ui/lib/cookies` (client) | `document.cookie` wrapper | `AsyncStorage` | N/A |

---

## Usage Examples

```typescript
// ✅ Always — platform-agnostic
import { Link } from "next-vibe-ui/ui/link";
import { Button } from "next-vibe-ui/ui/button";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { cookies, headers } from "next-vibe-ui/lib/headers";
import { redirect } from "next-vibe-ui/lib/redirect";
import { storage } from "next-vibe-ui/lib/storage";

// ❌ Never — framework-specific
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Link } from "expo-router";
import { Link } from "@tanstack/react-router";
```

---

## `server-only` Guard

Use `"server-only"` (not the bare string) to prevent server modules from leaking into client bundles. On TanStack, this is shimmed to check `import.meta.env.SSR`.

```typescript
import "server-only"; // ✅ — works on Next.js and TanStack
```

Never use:
```typescript
if (typeof window === "undefined") { ... } // ❌ — fragile, not tree-shakeable
```

---

## Theme

Use `next-vibe-ui/ui/theme-provider` for theme wrapping and `useThemeToggle()` for dark/light switching. On native it maps to `Appearance.setColorScheme()`. Never import `next-themes` directly.

---

## Tailwind & Styles

- Global CSS lives in `src/packages/next-vibe-ui/globals.css` (Tailwind v4 + custom theme tokens)
- Use `className` props for all styling — no inline `style` unless doing dynamic values
- `next-vibe-ui/ui/div` and `next-vibe-ui/ui/span` resolve to `<View>`/`<Text>` on native and accept `className` via NativeWind
- Never use `style={{ ... }}` for static styles — always Tailwind classes

---

## React Native Specifics

When writing `widget.tsx` components that render on native:

- Use `next-vibe-ui/ui/*` components — they resolve to the correct native primitives
- For native-only platform detection use `platform-helpers`:

```typescript
import { isNative, platformSelect } from "@/app/api/[locale]/system/unified-interface/react-native/platform-helpers";

const fontSize = platformSelect({ native: 16, web: 14 });
```

- Never import from `react-native` directly in shared widget code
- Touch targets: minimum 44×44pt, stacked layouts, no hover-only interactions

---

## Anti-Patterns

```typescript
// ❌ Direct Next.js imports in shared code
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

// ❌ Direct framework imports
import { Link } from "expo-router";
import { useNavigate } from "@tanstack/react-router";
import { Image } from "react-native";

// ❌ Inline styles for static values
<div style={{ display: "flex", gap: 16 }}>

// ❌ Direct next-themes
import { useTheme } from "next-themes";

// ✅ Correct
import { Image } from "next-vibe-ui/ui/image";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { cookies } from "next-vibe-ui/lib/headers";
import <div className="flex gap-4">
```
