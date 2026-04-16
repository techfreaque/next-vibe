# next-vibe-ui CLI Surface Spec

## Vision

A single `widget.tsx` using `next-vibe-ui` components renders correctly on all surfaces:

- **Web** → HTML + Tailwind
- **Native** → React Native views
- **CLI** → Ink terminal components
- **MCP** → plain text, AI-parseable

App code is 100% platform-agnostic. All platform differences live inside `next-vibe-ui`. `.cli.tsx` files are edge cases only, never the norm.

---

## How It Works

The same React component tree renders on all surfaces. Platform resolution happens at the import level:

```
next-vibe-ui/ui/X
  → cli/ui/X.tsx      (Bun plugin, CLI process)
  → tanstack/ui/X.tsx (Vite plugin, SSR)
  → web/ui/X.tsx      (tsconfig default, Next.js prod)
```

Almost everything just works — React, React Query, React Hook Form, Zustand, all pure JS. The only seams are a handful of browser-specific APIs abstracted into targeted utils.

---

## Platform Utils

Three utils in `next-vibe-ui/lib/`, each with a platform implementation:

### `next-vibe-ui/lib/storage`

Key-value persistence.

- Web: `localStorage`
- CLI: file-backed, one file per key at `./.tmp/storage/<key>.json`
- Native: AsyncStorage

### `next-vibe-ui/lib/fetch`

API call interceptor — the core seam between web and CLI.

- Web: normal `fetch("/api/...")`
- CLI local: calls repository function directly, user from CLI session
- CLI remote (`--remote`): `fetch("https://remote/api/...")` with leadId + session token as cookies

### `next-vibe-ui/lib/cookies`

Cookie read/write.

- Web: browser cookies via `document.cookie` / `next/headers`
- CLI: file-backed, one file per key at `./.tmp/cookies/<key>.json`

### `next-vibe-ui/lib/toast`

Fire-and-forget notifications.

- Web: sonner
- CLI: stdout passthrough
- Native: system alert

---

## API Call Architecture

`useEndpoint()` reads a mode flag injected by the CLI runner:

**Local mode (default):** No HTTP server needed. The query function calls the route handler's repository directly — same args, same `ResponseType<T>`. The CLI user object is passed directly into the repository call.

**Remote mode (`--remote`):** Normal HTTP fetch. Auth via stored leadId + session token injected as cookies, matching the user's saved remote connection.

React Query handles both identically — it awaits whatever the query function returns.

---

## Component Layer

### Resolution

Bun plugin (`cli-widget-plugin.ts`) intercepts `next-vibe-ui/*` → checks `cli/` first, falls back to `web/`.

### Error logging

No-op CLI components log once in dev: `[CLI] <ComponentName> not rendered`. Surfaces gaps without crashing. Muting is opt-in per component once confirmed intentional.

### Tier 1 — Core layout

`Div`, `Section`, `Main`, `Nav`, `Container`, `Span`, `Strong`, `P`, `H1-H4`, `Hr`, `Separator`, `Br`, `Badge`, `Button`, `Link`

### Tier 2 — Data display

`Card`, `Alert`, `Progress`, `Tabs`, `Accordion`, `Collapsible`, `Pagination`, `Breadcrumb`, `ol`, `ul`, `li`, `Table`, `tbody`, `tr`, `td`, `DataTable`

### Tier 3 — Forms

`Input`, `Textarea`, `Label`, `Checkbox`, `Select`, `Switch`, `Form`, `FormAlert`, `FormSection`, `EndpointFormField`

### Tier 4 — No-ops

Components with no meaningful CLI equivalent render their children or nothing:
`Dialog`, `Sheet`, `Drawer`, `Popover`, `HoverCard`, `Tooltip`, `AlertDialog`, `ContextMenu`, `DropdownMenu`, `Menubar`, `NavigationMenu`, `Carousel`, `Resizable`, `ScrollArea`, `Motion`, `Skeleton`, `ThemeProvider`, `Sonner`, `Toaster`, `Toast`, `Sidebar`, `PageLayout`, `Iframe`, `Audio`, `Video`, `Chart`, `AudioWaveform`

### Tier 5 — Icons

`cli/ui/icons/` — unicode/emoji symbol map. Common mappings: `✓ ✗ ★ ⚠ ℹ →`

---

## Tailwind → Ink Translation

`cli/utils/tailwind-to-ink.ts` — `parseClassesToInkProps(className)` maps Tailwind class strings to Ink `<Box>` and `<Text>` props. This is the foundation all CLI components build on.

---

## MCP Mode

MCP consumers are AI agents — output must be clean parseable plain text, no ANSI codes, no decoration.

Every CLI component checks `useIsMcp()` from `cli/hooks/use-cli-platform.ts` and strips decoration internally. App code never checks platform directly.

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
if (platform === Platform.CLI) { ... }

// ✓ Always
import { Div, Badge, H2 } from "next-vibe-ui/ui"
// next-vibe-ui handles the rest
```
