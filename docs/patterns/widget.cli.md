# CLI Widget Pattern (`widget.cli.tsx`)

CLI widgets are **Ink-based React components** that override the default definition-driven rendering when an endpoint is invoked via the CLI or MCP. The web widget (`widget.tsx`) renders on the browser; the CLI widget (`widget.cli.tsx`) renders in the terminal.

---

## When to Write a CLI Widget

**Every endpoint that returns non-trivial data or is callable from CLI/MCP gets a `widget.cli.tsx`.** The default field-driven CLI renderer outputs a raw dump of field values - acceptable only for the simplest internal tooling.

Write a `widget.cli.tsx` for any endpoint that:

- Returns a list, table, or structured result a human or AI will read
- Is exposed as a vibe CLI command or MCP tool
- Benefits from MCP vs CLI divergence (different formatting for AI agents vs humans)
- Has response data that should be scannable, colored, or grouped

Skip it only for purely internal endpoints with one or two trivially obvious output fields (e.g. a success boolean) where the raw dump is genuinely sufficient.

---

## File Naming and Location

```
src/app/api/[locale]/<category>/<feature>/
  definition.ts        - endpoint definition (references widget.tsx)
  widget.tsx           - React (web) widget
  widget.cli.tsx       - Ink (CLI/MCP) override  ← this file
```

The CLI Bun plugin automatically substitutes `widget.cli.tsx` for `widget.tsx` when running in the CLI process. **No import change needed in `definition.ts`** - it always imports `widget.tsx` via `lazyCliWidget`; the plugin intercepts the resolution.

If no `widget.cli.tsx` exists, the plugin stubs out `widget.tsx` with a no-op so React imports don't crash in the CLI context.

**Export name must match `widget.tsx` exactly.** The plugin resolves by the name passed to `lazyCliWidget` - `m.MyWidget` must exist as a named export in both files. Use a re-export alias if the internal name differs:

```ts
// widget.tsx
export function MyWidget(...) { ... }

// widget.cli.tsx
export function MyWidget(...) { ... }      // ← same name
// OR:
export { MyCliWidget as MyWidget };        // ← alias is fine too
```

---

## Minimal Pattern

```tsx
// widget.cli.tsx
import { Box, Text } from "ink";

interface CliWidgetProps {
  field: {
    value: MyResponseOutput | null | undefined;
  };
  fieldName: string;
}

export function MyResponseWidget({ field }: CliWidgetProps): React.JSX.Element {
  const value = field.value;
  if (!value) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text color="green">{value.message}</Text>
    </Box>
  );
}

// REQUIRED - marks this as a CLI widget, disables stub fallback
MyResponseWidget.cliWidget = true as const;
```

**Rules:**

- Props are always `{ field: { value: T | null | undefined }, fieldName: string }` - no other props
- Export the component as a **named export** (not default)
- Always set `ComponentName.cliWidget = true as const` on the export - the renderer checks this flag
- Return `<Box />` (not `null`) for empty state

---

## Hooks Available in CLI Widgets

CLI widgets use **Ink context hooks**, not the React `useWidget*` hooks from `widget.tsx`.

```typescript
import {
  useInkWidgetLocale, // CountryLanguage
  useInkWidgetPlatform, // Platform enum
  useInkWidgetUser, // JwtPayloadType
  useInkWidgetLogger, // EndpointLogger
  useInkWidgetForm, // form state (interactive mode)
  useInkWidgetResponse, // full response object
  useInkWidgetResponseOnly, // boolean - response-only mode
  useInkWidgetTranslation, // scoped t() function
  useInkWidgetShowLabels, // false for MCP (suppress labels)
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
```

Never use React `useWidgetForm`, `useWidgetData`, etc. - those are web-only.

---

## MCP vs CLI Divergence

MCP consumers are AI agents reading plain text. CLI consumers are humans reading a terminal. They need fundamentally different output. **Always handle both.**

Use `useInkWidgetPlatform()` to branch:

```tsx
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useInkWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

export function MyWidget({ field }: CliWidgetProps): React.JSX.Element {
  const platform = useInkWidgetPlatform();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!value) return <Box />;

  if (isMcp) {
    // Plain text, no chalk, no terminal-links
    return (
      <Box flexDirection="column">
        <Text>{value.summary}</Text>
      </Box>
    );
  }

  // CLI: colored, formatted, human-readable
  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        {value.summary}
      </Text>
    </Box>
  );
}

MyWidget.cliWidget = true as const;
```

### MCP rules (strict)

- **No `chalk`** - ANSI codes are noise to AI agents
- **No `terminalLink`** - hyperlinks don't render in AI context
- **No decorative borders or padding** - wastes token budget
- **One meaningful line per item** - AI reads line-by-line
- **Include pagination hints as plain text** - `Page 1/3 - use page=2 for next`
- **Use `<Text wrap="end">` for multi-line blocks**

### CLI rules

- **Use `chalk`** for color, `bold`, `dim`, `underline`
- **Align columns** with `padEnd()` for scannable lists
- **Group items** under section headers
- **Show pagination** as a dim hint: `vibe skills --page=2`
- **Use `terminalLink`** for file paths, guarded by `process.stdout.isTTY`

### List size divergence

For endpoints returning lists, apply a detail threshold:

```tsx
const DETAIL_THRESHOLD = 5;

// ≤5 items → full detail block (name, description, metadata)
// >5 items → compact one-line-per-item list with pagination hint

const count = value.items.length;
const output =
  count <= DETAIL_THRESHOLD
    ? isMcp
      ? renderDetailMcp(value.items)
      : renderDetailCli(value.items)
    : isMcp
      ? renderListMcp(value)
      : renderListCli(value);
```

**MCP list format** - one line per item, pipe-separated fields:

```
SkillName - tagline • modelInfo • provider
Page 1/3 - use page=2 for next
```

**CLI list format** - aligned columns, chalk colors, grouped by section:

```
  Skills
    name           tagline truncated to 50 chars   model
    another-skill  tagline here                     gpt-4o

Page 1/3 - vibe skills --page=2
```

### Real-world reference

See `src/app/api/[locale]/agent/chat/skills/widget.cli.tsx` - the canonical example of detail/list threshold, full MCP/CLI divergence, and pagination hints.

---

## Chalk + Terminal Links (CLI only)

For CLI-specific formatting, build a string with `chalk` and render with `<Text wrap="end">`:

```tsx
import chalk from "chalk";
import terminalLink from "terminal-link";
import { Box, Text } from "ink";

export function IssueListWidget({ field }: CliWidgetProps): React.JSX.Element {
  const value = field.value;
  if (!value?.items?.length) return <Box />;

  const lines = value.items.map((item) => {
    const link = process.stdout.isTTY
      ? terminalLink(
          `${item.file}:${item.line}`,
          `vscode://file/${item.file}:${item.line}`,
        )
      : `${item.file}:${item.line}`;
    return `  ${chalk.blue(link)} ${chalk.red(item.message)}`;
  });

  return (
    <Box flexDirection="column">
      <Text wrap="end">{lines.join("\n")}</Text>
    </Box>
  );
}

IssueListWidget.cliWidget = true as const;
```

Always guard `terminalLink` with `process.stdout.isTTY` - non-TTY contexts (pipes, CI) don't support hyperlinks.

---

## Shared CLI Components (Canonical Owner Pattern)

When multiple endpoints share CLI display logic, create shared components in the **canonical owner's** route folder using the `.cli.tsx` naming convention:

```
src/app/api/[locale]/system/check/
  _shared/
    widget-components.cli.tsx   ← shared Ink components (owned by check domain)
  lint/
    widget.cli.tsx              ← imports from _shared
  oxlint/
    widget.cli.tsx              ← imports from _shared
  vibe-check/
    widget.cli.tsx              ← imports from _shared
```

The shared file is a regular `.cli.tsx` file (not a `widget.cli.tsx` override). Name it `widget-components.cli.tsx` or similar to signal CLI-only usage. Import flows inward only - shared components never import from individual widget files.

---

## Connection to `definition.ts`

The CLI widget is connected to the definition the same way as the web widget - via `customWidgetObject` with `render:` pointing to the component from `widget.tsx`:

```typescript
// definition.ts - unchanged, always imports widget.tsx
import { CheckResultWidget } from "./widget";  // plugin redirects to widget.cli.tsx in CLI

fields: customWidgetObject({
  render: CheckResultWidget,
  usage: { request: "data", response: true } as const,
  children: { ... },
}),
```

The `definition.ts` never imports `widget.cli.tsx` directly. The Bun plugin handles the substitution transparently.

---

## Anti-Patterns

```tsx
// ❌ Default export
export default function MyWidget(...) {}

// ❌ Missing cliWidget flag - renderer treats it as a stub
export function MyWidget(...) {}
// (no MyWidget.cliWidget = true)

// ❌ React web hooks in CLI widget
import { useWidgetForm } from "...";  // web-only, crashes in CLI

// ❌ chalk in MCP mode
const isMcp = platform === Platform.MCP;
// then using chalk.red(...) regardless of isMcp

// ❌ Returning null - use <Box /> for empty state
if (!value) return null;  // ❌
if (!value) return <Box />;  // ✅
```

---

## Checklist

- [ ] File is named `widget.cli.tsx` (sibling of `widget.tsx`)
- [ ] Named export (not default)
- [ ] `ComponentName.cliWidget = true as const` on the export
- [ ] Props: `{ field: { value: T | null | undefined }, fieldName: string }`
- [ ] Empty state returns `<Box />` not `null`
- [ ] MCP vs CLI divergence handled via `useInkWidgetPlatform()`
- [ ] No chalk/terminal-links in MCP path
- [ ] List endpoints: detail threshold applied (≤5 full detail, >5 compact list)
- [ ] Pagination hints present for both MCP (plain text) and CLI (dim hint with command)
- [ ] `definition.ts` uses `lazyCliWidget` (not static import) - plugin routes to `widget.cli.tsx` automatically
- [ ] Export name matches `widget.tsx` exactly (Bun swaps by name - mismatch = silent CLI failure)
- [ ] Shared components use `.cli.tsx` suffix and canonical owner folder

---

## Related

- [widget.md](widget.md) - React web widget pattern
- [definition.md](definition.md) - `customWidgetObject` connection
