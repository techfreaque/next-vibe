# System Prompt Pattern

Guide to the modular system prompt fragment system — how modules contribute context to the AI's system prompt.

## Overview

The system prompt is assembled from **fragments** contributed by individual modules. Each module that wants to inject context (favorites, memories, skills, cron tasks) creates a `system-prompt/` folder with three files.

Fragments are **auto-indexed**: the generator scans all `system-prompt/prompt.ts` files and regenerates three output files under `system/generated/`. Never edit those files manually.

## Three-File Structure

```
<module>/system-prompt/
  prompt.ts   — Fragment definition + data interface (isomorphic, no server imports)
  server.ts   — Server-side data loader (import "server-only")
  client.ts   — Client-side React hook returning the same data shape
```

### Types

All fragment types come from `agent/ai-stream/repository/system-prompt/types.ts`:

```typescript
interface SystemPromptFragment<TData> {
  id: string;
  placement: "leading" | "trailing";
  priority: number;
  condition?: (data: TData) => boolean;
  build: (data: TData) => string | null;
}
```

| Field       | Purpose                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------- |
| `id`        | Unique string slug across all fragments                                                      |
| `placement` | `"leading"` = static system prompt (cached); `"trailing"` = injected before each turn        |
| `priority`  | Lower = earlier in the section. Built-ins use multiples of 100; modules use gaps (150, 250…) |
| `condition` | Optional — if it returns `false`, `build` is skipped. Check data availability here.          |
| `build`     | Pure function — returns the text block or `null` to skip. No async, no side effects.         |

## prompt.ts — Fragment Definition

```typescript
// agent/chat/favorites/system-prompt/prompt.ts

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

// 1. Define the data type this fragment needs
export interface FavoritesData {
  /** null = incognito/public context (fragment suppressed) */
  favorites: FavoriteSummaryItem[] | null;
}

// 2. Export the fragment
export const favoritesFragment: SystemPromptFragment<FavoritesData> = {
  id: "favorites",
  placement: "trailing",
  priority: 300,
  condition: (data) => data.favorites !== null,
  build: (data) => {
    const favorites = data.favorites ?? [];
    if (favorites.length === 0) {
      return "## Favorites — Not Set Up Yet\n...";
    }
    return `## Favorites (${favorites.length})\n...`;
  },
};
```

**Rules for `prompt.ts`:**

- No `import "server-only"` — this file runs on both server and client
- No async operations in `build` — data loading belongs in `server.ts`/`client.ts`
- The `TData` type exported here is the contract that both server and client must satisfy

## server.ts — Data Loader

```typescript
// agent/chat/favorites/system-prompt/server.ts

import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import type { FavoritesData } from "./prompt";

export async function loadFavoritesData(
  params: SystemPromptServerParams,
): Promise<FavoritesData> {
  // Return null to suppress fragment for incognito/public contexts
  if (params.isIncognito || params.isExposedFolder || !params.user) {
    return { favorites: null };
  }

  try {
    const { loadFavoritesItems } = await import("../repository");
    const items = await loadFavoritesItems(params.user.id);
    return { favorites: items };
  } catch (err) {
    params.logger.error("Failed to load favorites for system prompt", err);
    return { favorites: null };
  }
}
```

**Rules for `server.ts`:**

- Always `import "server-only"` as first line
- Function name: `load<ModuleName>Data(params: SystemPromptServerParams): Promise<TData>`
- Handle errors gracefully — return safe fallback (never throw)
- Use dynamic imports for expensive/optional dependencies

## client.ts — React Hook

```typescript
// agent/chat/favorites/system-prompt/client.ts

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { useChatFavorites } from "../hooks";
import type { FavoritesData } from "./prompt";

export function useFavoritesData(
  params: SystemPromptClientParams,
): FavoritesData {
  const { data } = useChatFavorites({
    enabled: params.enabledPrivate,
  });

  if (!params.enabledPrivate) {
    return { favorites: null };
  }

  return {
    favorites:
      data?.favorites?.map((f) => ({
        id: f.id,
        name: f.name,
        // ... transform API response to FavoritesData shape
      })) ?? null,
  };
}
```

**Rules for `client.ts`:**

- Function name: `use<ModuleName>Data(params: SystemPromptClientParams): TData`
- Must return exactly the same `TData` shape as `server.ts`
- Always call hooks unconditionally (React rules) — gate with params instead
- No async/await — hooks only

## Standard Params

Both server and client receive standard param shapes. All loaders accept the **full superset** and ignore fields they don't need.

```typescript
// Server params
interface SystemPromptServerParams {
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  skillId: string | null | undefined;
  isIncognito: boolean;
  isExposedFolder: boolean;
  excludeMemories?: boolean;
  headless?: boolean;
  callMode?: boolean;
  extraInstructions?: string;
  memoryLimit?: number | null;
}

// Client params
interface SystemPromptClientParams {
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  enabled: boolean;
  enabledPrivate: boolean;
  skillId?: string | null;
  rootFolderId: DefaultFolderId;
  subFolderId?: string | null;
  callMode?: boolean;
  extraInstructions?: string;
  headless?: boolean;
}
```

## Priority Guidelines

| Range   | Who uses it                                                    |
| ------- | -------------------------------------------------------------- |
| 10–90   | Core identity fragments (built-in, `ai-stream/system-prompt/`) |
| 100–200 | Platform context (language, folder type, headless mode)        |
| 250–400 | User-specific context (favorites, memories, skills)            |
| 500–700 | Operational context (tasks, remote instances)                  |

Use a gap (e.g. 250, 350) so new fragments can be inserted between without renumbering.

## Placement

- **`"leading"`** — Goes into the static `system` parameter. Sent once per session start. Cached by the model provider. Use for stable identity/context.
- **`"trailing"`** — Injected as a system message immediately before `[Context:]` each turn. Use for dynamic data (favorites, memories, live task state).

## Adding a New Module Fragment

1. Create `<module>/system-prompt/prompt.ts` — define `TData` interface and export fragment
2. Create `<module>/system-prompt/server.ts` — export `load<Module>Data(params)`
3. Create `<module>/system-prompt/client.ts` — export `use<Module>Data(params)` hook
4. Run the fragment generator: `vibe generate-prompt-fragments` (or `vibe generate-all`)
5. The fragment appears in the three generated index files automatically

## Auto-generated Indices

Three files in `system/generated/` are auto-generated — **never edit them manually**:

### `prompt-fragments.ts` (isomorphic)

Maps fragment IDs for dynamic import. Used for lazy-loading specific fragments.

### `prompt-fragments-server.ts` (server-only)

```typescript
// GENERATED
export async function loadAllPromptFragments(
  params: SystemPromptServerParams,
): Promise<{ leading: string; trailing: string; byId: Map<string, string> }> {
  // Loads all data sources in parallel, builds all fragments, sorts by priority
}
```

### `prompt-fragments-client.ts` (client-only)

```typescript
// GENERATED
export function useAllPromptFragments(params: SystemPromptClientParams): {
  leading: string;
  trailing: string;
  byId: Map<string, string>;
} {
  // Calls all data hooks unconditionally (React rules), builds fragments
}
```

Trigger regeneration: `vibe generate-prompt-fragments` or `vibe generate-all`.

## Existing Module Fragments

| Module                         | ID                                                | Placement | Priority | Purpose                               |
| ------------------------------ | ------------------------------------------------- | --------- | -------- | ------------------------------------- |
| `ai-stream/system-prompt`      | `identity`, `platform-overview`, `language`, etc. | leading   | 10–200   | Core AI identity and platform context |
| `chat/favorites/system-prompt` | `favorites`                                       | trailing  | 300      | User's saved favorites                |
| `chat/memories/system-prompt`  | `memories`                                        | trailing  | 350      | User memories                         |
| `chat/skills/system-prompt`    | `skills`                                          | leading   | 250      | Available skills context              |
| `tasks/cron/system-prompt`     | `cron-tasks`                                      | trailing  | 500      | Active task queue state               |
