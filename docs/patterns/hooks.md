# Hooks Pattern

Comprehensive guide to writing `hooks.ts` files and `hooks/` folders for endpoint-level React hooks.

## Overview

Most endpoints don't need a `hooks.ts` file at all. The primary pattern for data access is:

1. **Widget** — use `useEndpoint()` directly inside `EndpointsPage` (via `endpointOptions` prop)
2. **Dialog wrapper** — pass `endpointOptions` to `EndpointsPage`
3. **Cross-module use** — only then write a `hooks.ts`

A `hooks.ts` file (or `hooks/` folder) is justified when:

- A hook must be **called from multiple different places** (cross-module use)
- The data access logic is complex enough to warrant isolation
- The return type needs to be shared and reused

## File Structure

### Simple: `hooks.ts` (single file)

```
src/app/api/[locale]/agent/chat/characters/[id]/
├── definition.ts
├── repository.ts
├── route.ts
├── i18n/
├── widget.tsx
└── hooks.ts          ← single hook, exported by name
```

### Complex: `hooks/` folder

```
src/app/api/[locale]/agent/chat/threads/[threadId]/messages/
├── definition.ts
├── repository.ts
├── route.ts
├── i18n/
├── widget/
└── hooks/
    ├── use-operations.ts           ← main hook with exported interface
    ├── event-handlers.ts           ← standalone event handler setup
    ├── use-collapse-state.ts       ← small focused state hook
    ├── use-delete-dialog-store.ts  ← dialog state
    ├── use-message-editor.ts       ← message editing
    ├── use-message-editor-store.ts ← editor state
    ├── use-message-delete-actions.ts
    ├── use-messages-subscription.ts
    ├── use-messages-ws.ts
    └── operations/                 ← pure functions called by hooks
        ├── send-message.ts
        ├── retry-message.ts
        ├── branch-message.ts
        ├── answer-as-ai.ts
        └── shared.ts
```

Use a folder when the file would exceed ~200 lines or when there are clearly separable concerns.

## The `useEndpoint` Pattern

`useEndpoint()` is the foundation. All endpoint hooks wrap it.

```typescript
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
```

### Minimal hook

```typescript
// hooks.ts
"use client";

import { useMemo } from "react";
import type { EndpointReturn } from "@/app/api/.../react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/.../react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/.../shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/.../user/auth/types";

import type { CharacterGetResponseOutput } from "./definition";
import definitions from "./definition";

export function useCharacter(
  characterId: string | undefined,
  user: JwtPayloadType,
  logger: EndpointLogger,
  initialData?: CharacterGetResponseOutput | null,
): CharacterEndpointReturn {
  const options = useMemo(
    () => ({
      read: {
        queryOptions: {
          enabled: !!characterId,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
        },
        ...(characterId ? { urlPathParams: { id: characterId } } : {}),
        initialData: initialData ?? undefined,
      },
    }),
    [characterId, initialData],
  );
  return useEndpoint(definitions, options, logger, user);
}

// Export the return type — consumers import this for typing
export type CharacterEndpointReturn = EndpointReturn<typeof definitions>;
```

### Key rules

- Always `useMemo()` the options object — prevents unnecessary re-renders
- `enabled: !!dependency` — don't query before required params are available
- `staleTime` — set based on how frequently this data changes (list: 30s–60s, detail: 5min)
- `initialData` — for SSR prefetching, pass server-fetched data to skip initial fetch
- Export the `ReturnType` alias so callers are typed without re-deriving it

## Hook That Wraps Mutation

When a mutation needs to be triggered from outside the widget (e.g., from a button in a different component), wrap it:

```typescript
// favorites/create/hooks.ts
"use client";

import { useCallback } from "react";
import { useEndpoint } from "@/app/api/.../react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/.../shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/.../user/auth/types";

import favoritesDefinition from "./definition";
import type { FavoriteCreateRequestOutput } from "./definition";

export interface UseAddToFavoritesReturn {
  isLoading: boolean;
  addFavorite: (data: FavoriteCreateRequestOutput) => Promise<string | null>;
}

export function useAddToFavorites({
  logger,
  user,
}: {
  logger: EndpointLogger;
  user: JwtPayloadType;
}): UseAddToFavoritesReturn {
  const endpoint = useEndpoint(favoritesDefinition, undefined, logger, user);

  const addFavorite = useCallback(
    async (data: FavoriteCreateRequestOutput): Promise<string | null> => {
      endpoint.create.form.reset(data);
      return new Promise<string | null>((resolve, reject) => {
        endpoint.create.submitForm({
          onSuccess: ({ responseData }) => resolve(responseData.id),
          onError: ({ error }) => reject(error),
        });
      });
    },
    [endpoint.create],
  );

  return {
    isLoading: endpoint.create.isSubmitting,
    addFavorite,
  };
}
```

Pattern notes:

- Return a **simple custom interface**, not the raw endpoint state
- Wrap mutation in `Promise` for async/await usability
- `form.reset(data)` before `submitForm()` populates the form with caller-provided data
- `useCallback` on the returned function to prevent referential instability

## Hook With Custom Return Shape

When a hook returns more than just `useEndpoint` output (computed values, auth checks, local state):

```typescript
// favorites/hooks/hooks.ts
"use client";

import { useMemo } from "react";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useEndpoint } from "@/app/api/.../react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/.../shared/logger/endpoint";
import type { UseEndpointOptions } from "@/app/api/.../react/hooks/endpoint-types";

import favoritesDefinition, { type FavoriteCard } from "../definition";

export interface UseChatFavoritesReturn {
  favorites: FavoriteCard[];
  activeFavoriteId: string | null;
  isInitialLoading: boolean;
  isAuthenticated: boolean;
  endpoint: ReturnType<typeof useEndpoint<typeof favoritesDefinition>>;
}

export function useChatFavorites(
  logger: EndpointLogger,
  overrides: { activeFavoriteId: string | null },
): UseChatFavoritesReturn {
  const { user } = useChatBootContext();

  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  const endpointOptions: UseEndpointOptions<typeof favoritesDefinition> =
    useMemo(
      () => ({
        read: {
          queryOptions: {
            enabled: user !== undefined,
            refetchOnWindowFocus: true,
            staleTime: 60 * 1000,
          },
        },
      }),
      [user],
    );

  const endpoint = useEndpoint(
    favoritesDefinition,
    endpointOptions,
    logger,
    user,
  );

  const favorites = useMemo(
    () => endpoint.read?.data?.favorites ?? [],
    [endpoint.read?.data],
  );

  return {
    favorites,
    activeFavoriteId: overrides.activeFavoriteId ?? null,
    isInitialLoading: !endpoint.read?.data,
    isAuthenticated,
    endpoint,
  };
}
```

Pattern notes:

- Explicit `interface` for return type — not inferred
- `useMemo` for every derived value
- Expose `endpoint` in return if callers need raw access
- Use `satisfies UseEndpointOptions<typeof def>` to enforce type without losing inference

## Complex Hooks Folder — Main Hook Pattern

When there are many related hooks, create a `hooks/` folder with a main hook that composes others:

```typescript
// hooks/use-operations.ts — main hook file

export interface MessageOperations {
  sendMessage: (content: string, attachments: Attachment[]) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  branchMessage: (messageId: string, content: string) => Promise<void>;
  answerAsAI: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  stopGeneration: () => void;
}

interface MessageOperationsDeps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  aiStream: UseAIStreamReturn;
  activeThreadId: string | null;
  // ... other deps
}

export function useMessageOperations(
  deps: MessageOperationsDeps,
): MessageOperations {
  const sendMessage = useCallback(
    async (content, attachments) => {
      await sendMessageOp({ content, attachments, ...deps });
    },
    [deps],
  );

  const retryMessage = useCallback(
    async (messageId) => {
      await retryMessageOp({ messageId, ...deps });
    },
    [deps],
  );

  return { sendMessage, retryMessage /* ... */ };
}
```

And in `operations/send-message.ts`:

```typescript
// operations/send-message.ts — pure async function (not a hook)
export async function sendMessageOp(
  params: SendMessageParams,
  deps: SendMessageDeps,
): Promise<void> {
  // implementation
}
```

Pattern notes:

- Main hook exports a clean `interface` as its contract
- Dependencies passed as a single `deps` object
- Operation functions in `operations/` are plain async functions (not hooks) — imported by the main hook and wrapped in `useCallback`
- Small single-purpose hooks (`use-collapse-state.ts`, `use-delete-dialog-store.ts`) are separate files

## What Hooks Must NOT Do

```typescript
// ❌ Import from another endpoint's hooks file
import { useSidebarFolders } from "../../folders/widget/widget";

// ❌ Fetch data without useEndpoint
const data = await fetch("/api/...");

// ❌ Accept UI callbacks as props (use endpointOptions.mutationOptions instead)
export function useMyHook(onSuccess: () => void) { // ← anti-pattern

// ❌ Manage form state manually (useEndpoint handles this)
const [formData, setFormData] = useState({});

// ❌ Skip useMemo on options (causes infinite re-render)
return useEndpoint(definitions, {
  read: { queryOptions: { enabled: true } }  // ← new object every render
}, logger, user);
```

## Summary

```
When to write hooks.ts:
  ✅ Hook used in multiple modules
  ✅ Complex query config (conditional enabled, staleTime, initialData)
  ✅ Mutation needs to be called from outside the widget
  ✅ Derived values need to be computed from endpoint data

When NOT to write hooks.ts:
  ❌ Simple GET request (let EndpointsPage handle it via internal useEndpoint)
  ❌ One-time mutation (use navigation stack or direct useEndpoint)

Hook rules:
  - Always wrap useEndpoint()
  - Always useMemo() the options
  - Always export a typed return interface
  - Always accept logger + user as parameters
  - Never import from another endpoint's hooks or widget

Client-side utilities:
  - Pure computation / localStorage / shared logic → repository-client.ts (static class)
  - Hooks import from repository-client.ts directly — not via useEndpoint()
  - See: Client Repository pattern (repository.client.md)
```
