# next-vibe-ui spec

## Vision

A single `widget.tsx` using `next-vibe-ui` components renders correctly on all surfaces:

- **Web** → HTML + Tailwind (Next.js prod)
- **TanStack** → SSR via Vite (dev default)
- **Native** → React Native views
- **CLI** → Ink terminal components
- **MCP / AI** → plain text, agent-parseable

App code is 100% platform-agnostic. All platform differences live inside `next-vibe-ui`. `.cli.tsx` sibling files are a legacy escape hatch, never the norm.

---

## Package Layout

```
next-vibe-ui/
  web/        Full component set: ui/, hooks/, lib/. The canonical implementation.
  tanstack/   Thin SSR overrides (~9 files: html, head, body, scripts, image,
              link, outlet, font). Everything else falls through to web/.
  cli/        Ink implementations: ui/, hooks/, lib/, utils/ (tailwind-to-ink).
  native/     React Native implementations: ui/, hooks/, lib/.
  unified/    Cross-platform widget library (form fields, display, interactive,
              containers) + _shared/ widget context. One widget.tsx per
              component handles every platform.
  i18n/       Package-level translations (en/de/pl). unified/i18n/ holds
              widget-scoped strings.
  globals.css Global stylesheet.
```

---

## Import Resolution

The same React component tree renders everywhere. Platform selection happens at the import level — app code always imports `next-vibe-ui/ui/X`:

| Platform      | Mechanism                                                                                                                                                  | Resolution order                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Web (Next.js) | `tsconfig.json` path alias                                                                                                                                 | `web/*`                                                                            |
| TanStack SSR  | Vite plugin `next-vibe-ui-ssr-resolver` (`enforce: "pre"`) in `src/app/api/[locale]/system/builder/repository/vite-compiler.ts` + `tsconfig.tanstack.json` | `tanstack/*` → `web/*`                                                             |
| CLI / MCP     | Bun plugin `cli-overrides` from `src/app/api/[locale]/system/unified-interface/cli/cli-widget-plugin-factory.ts`                                           | `cli/*` → `web/*`; also rewrites any import to a `*.cli.tsx` sibling if one exists |
| Native        | tsconfig `customConditions: ["react-native"]`                                                                                                              | `native/*`                                                                         |

`next-vibe-ui/unified/*` resolves directly to `unified/*` on all platforms — it is platform-agnostic by construction.

Almost everything just works — React, React Query, React Hook Form, Zustand are pure JS. The only seams are a handful of browser-specific APIs abstracted into targeted utils.

---

## Platform Utils (`<platform>/lib/`)

Each util has one implementation per platform that needs it; missing means "falls through to web/" (TanStack) or "not applicable".

| Util                         | Web                                | CLI                                         | Native          | TanStack                            |
| ---------------------------- | ---------------------------------- | ------------------------------------------- | --------------- | ----------------------------------- |
| `lib/storage`                | `localStorage`                     | file per key at `./.tmp/storage/<key>.json` | AsyncStorage    | —                                   |
| `lib/cookies`                | `document.cookie` / `next/headers` | file per key at `./.tmp/cookies/<key>.json` | token store     | —                                   |
| `lib/redirect`               | `next/navigation`                  | —                                           | RN navigation   | TanStack redirect                   |
| `lib/not-found`              | `notFound()`                       | —                                           | RN error screen | TanStack notFound                   |
| `lib/request`, `lib/headers` | Next request/headers               | —                                           | —               | TanStack request context            |
| `lib/server-only`            | (real `server-only`)               | —                                           | —               | shim checking `import.meta.env.SSR` |

Platform-specific extras: `cli/lib/focus-manager.tsx` (`useCliFieldFocus` wrapping Ink's `useFocus`), `native/lib/keyboard.tsx`, `native/lib/useColorScheme.tsx`.

**Toast is a hook, not a lib:** `hooks/use-toast` — sonner on web, stdout on CLI, system alert on native.

**Navigation/pathname:** `hooks/use-navigation` + `hooks/use-pathname` per platform. TanStack's `use-pathname` re-exports from its `use-navigation` (the web one returns null in TanStack SSR).

---

## API Call Architecture

There is no `lib/fetch` module. The seam is `callApi()` in `src/app/api/[locale]/system/unified-interface/react/hooks/api-utils.ts`, used by `useEndpoint()` through the query executor. Three modes, selected at runtime:

**In-process (CLI local, default):** When `typeof window === "undefined"` and not React Native, no HTTP server is needed. The call goes straight to `RouteExecuteRepository.runInProcessTyped()` — same args, same `ResponseType<T>`, with the CLI session user, locale, and `Platform.CLI` passed in directly.

**HTTP (browser, and CLI remote via `--thea`):** Normal `fetch(endpointUrl, { credentials: "include" })`. Auth rides on session cookies; remote mode is just a remote base URL from the saved remote connection.

**Native:** HTTP with an `Authorization: Bearer <jwt>####<leadId>` header instead of cookies (token from `authClientRepository`).

Endpoints that allow client-side execution (`useClientRoute` / `allowedClientRoles`) route to a generated `route-client.ts` handler instead. React Query treats all modes identically — it awaits whatever the query function returns.

---

## Unified Widget Library (`unified/`)

The widget system endpoints build on. Each component is a single `widget.tsx` rendering through platform-resolved `next-vibe-ui/ui/*` primitives.

- **`form-fields/`** — 35+ field widgets (text, email, password, number, int, select, multiselect, checkbox, boolean, date, date-range, datetime, time, timezone, country/currency/language selects, color, file, uuid, url, json, tags, slider, icon, entity-picker, markdown-editor, signals, time-series, …) plus `_shared/` validation, prefill, and styling helpers.
- **`display-only/`** — badge, alert, avatar, chart, code, description, empty-state, icon, key-value, link, markdown, metadata, separator, stat, status-indicator, text, title, …
- **`interactive/`** — button, submit-button, navigate-button, search-bar, form-alert.
- **`containers/`** — container, pagination, code-output, custom.
- **`_shared/`** — the widget runtime:
  - `lazy-widget.ts` — `lazyWidget()` wraps `React.lazy()` with `preload()` (CLI resolves synchronously, no Suspense) and HMR support (`lazy-widget-hmr.tsx`).
  - `use-widget-context.ts` — `useWidgetPlatform()`, `useCliPlatform()`, `useIsMcp()`, `useWidgetForm()`, `useWidgetValue()`, picker context.
  - `widget-context-store.ts` — Zustand store the renderer fills with platform, form, and navigation state.

**definition.ts rule:** never import a widget directly — always `lazyWidget(() => import("./widget").then(...))` wired via `customWidgetObject({ render, ... })`. Direct imports pull React/JSX into route bundles and break the build. Authoring patterns: `docs/patterns/widget.md`.

---

## Platform Detection at Runtime

`Platform` enum (`src/app/api/[locale]/system/unified-interface/shared/types/platform.ts`): `cli`, `cli-package`, `ai`, `mcp`, `remote-skill`, `trpc`, `next-page`, `next-api`, `cron`, `electron`, `frame`.

Widgets never branch on platform directly — they read context hooks:

- `useWidgetPlatform()` → the raw enum value
- `useIsMcp()` → true for agent platforms (`mcp`, `ai`, `cron`)
- `useCliPlatform()` → `"cli"` | `"mcp"` on terminal surfaces

Static app-level detection uses the `platform` object from `src/config/env-client.ts` (`isServer`, `isBrowser`, `isReactNative`).

---

## CLI Component Layer

### Real implementations

Most of the web surface has a genuine Ink counterpart, including interactive ones: layout primitives (`Div`, `Section`, `Container`, `Span`, `P`, `H1-H4`, `Hr`, `Br`, …), forms (`Input`, `Textarea`, `Checkbox`, `Select`, `Toggle`, `NumberInput`, `MultiSelect`, `AutocompleteField`, `Form`, `FormSection`, `FormAlert`, `EndpointFormField` — focus via `useCliFieldFocus`), containers (`Card`, `Tabs`, `Accordion`, `Collapsible`, `Dialog`/`Sheet`/`Drawer` with focus trapping, `Popover`, `DropdownMenu`), data display (`Table`, `DataTable`, `Pagination`, `Breadcrumb`, `Badge`, `Alert`, `Progress`, `StatusPill`, `Markdown`, `MetricCard`, `ResultBanner`, `LoadingBlock`, `EmptyBlock`).

### No-ops

Components with no terminal equivalent render children or nothing: `Carousel`, `Chart`, `Audio`, `AudioWaveform`, `Video`, `Iframe`, `Image`, `Skeleton`, `ContextMenu`, `Menubar`, `NavigationMenu`, `HoverCard`, `AlertDialog`, `ScrollArea`, `Resizable`, `Motion`, `Sonner`, `AspectRatio`, `KeyboardAvoidingView`, `Scripts`. No-op components log once in dev (`[CLI] <ComponentName> not rendered`) so gaps surface without crashing; muting is opt-in per component once confirmed intentional.

### Icons

`cli/ui/icons/` — unicode/emoji symbol map mirroring web icon names: `✓ ✗ ★ ⚠ ℹ →`

### Tailwind → Ink

`cli/utils/tailwind-to-ink.ts` is the foundation all CLI components build on:

- `parseClassesToInkProps(className)` → `{ text, box, hidden }`
- `parseClassesToTextProps` / `parseClassesToBoxProps` / `mergeTextProps`

Mapping strategy: Tailwind colors + semantic tokens (`primary`, `destructive`, …) → ANSI colors; spacing units → character widths; full flexbox mapping; `text-xs/sm` → `dimColor`, `text-lg+` → `bold`; `rounded` + background → bordered box. Purely decorative classes (`shadow`, `ring`, `transition-*`, `animate-*`, …) are silently dropped.

---

## MCP Mode

MCP consumers are AI agents — output must be clean parseable plain text: no ANSI codes, no decoration, no interactivity.

CLI components check `useIsMcp()` (from `unified/_shared/use-widget-context.ts`) internally and strip decoration themselves. App code never checks platform.

**MCP output principles:**

- `Badge` → plain text value, no brackets
- `Hr`/`Separator` → omitted
- `Table` → pipe-separated values
- `H1/H2` → plain text, no decoration
- `Button` → omitted
- `Link` → plain URL

---

## Anti-patterns

```ts
// ✗ Never in widget.tsx
import { Box } from "ink"
import chalk from "chalk"
import Link from "next/link"            // only web/ui/link.tsx may
if (platform === Platform.CLI) { ... }  // use context hooks instead

// ✗ Never in definition.ts
import { MyWidget } from "./widget"     // use lazyWidget()

// ✓ Always
import { Div, Badge, H2 } from "next-vibe-ui/ui"
// next-vibe-ui handles the rest
```
