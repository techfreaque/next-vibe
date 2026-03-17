# Client Repository Pattern (`repository-client.ts`)

`repository-client.ts` is a **static utility class that runs in the browser**. It serves three distinct purposes, all sharing the same static class shape and `ResponseType<T>` convention:

1. **Route mirror** — localStorage/IndexedDB implementation of a server repository, transparently swapped in by `route-client.ts` via `useClientRoute` / `allowedClientRoles`
2. **Client-side utilities** — pure computation helpers (model filtering, scoring, display logic) imported directly by widgets and hooks
3. **Storage abstraction** — platform-agnostic persistence (localStorage on web, AsyncStorage on React Native) used directly without a server round-trip

The naming convention is the signal: if business logic or storage belongs to the client and is reusable across hooks/widgets, it goes in `repository-client.ts`.

---

## Use Case 1: Route Mirror (incognito / unauthenticated)

When a feature needs to work without a server — incognito mode, unauthenticated users, offline — the client repository mirrors the server repository exactly. A `route-client.ts` wires it into the endpoint system so the same `useEndpoint()` hook works transparently.

### Definition: declare when to use the client route

Two options — pick one:

**`allowedClientRoles`** — always use client for these roles:

```typescript
// definition.ts
const { GET } = createEndpoint({
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
  allowedClientRoles: [UserRole.PUBLIC] as const, // PUBLIC always → route-client.ts
  // ...
});
```

Use this when an entire user role always reads/writes locally (e.g. unauthenticated favorites stored in localStorage).

**`useClientRoute`** — conditionally route based on request data:

```typescript
// definition.ts
const { GET } = createEndpoint({
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,
  // ...
});
```

Use this when the same authenticated user sometimes hits the server and sometimes the client depending on what they're accessing (e.g. incognito threads vs normal threads).

### `route-client.ts` — mirrors `route.ts`

```typescript
import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { MyRepositoryClient } from "./repository-client";

export const { GET, POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, logger, locale }) =>
      MyRepositoryClient.getItems(data, logger, locale),
  },
  [Methods.POST]: {
    handler: ({ data, logger, locale }) =>
      MyRepositoryClient.createItem(data, logger, locale),
  },
});
```

Handler receives `{ data, logger, locale }` — no `user` or `request` (no server context on the client).

### `repository-client.ts` — mirrors `repository.ts`

```typescript
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { parseError } from "../../../shared/utils";
import type { MyGetRequestOutput, MyGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class MyRepositoryClient {
  static async getItems(
    data: MyGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MyGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items = stored ? JSON.parse(stored) : [];
      logger.debug("Client: loaded items", { count: items.length });
      return success({ items });
    } catch (error) {
      logger.error("Failed to load items", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
```

**Response types must be imported from `definition.ts`** — identical to server types, same shape, same fields. The hook consumer cannot tell which path was taken.

For incognito mode, localStorage operations often go through a dedicated `incognito/storage.ts` module (e.g. `createIncognitoThread`, `getThreadsForFolder`) rather than raw `localStorage` calls — this centralizes the incognito storage schema.

---

## Use Case 2: Client-Side Utilities (pure helpers)

When widgets or hooks need shared computation that has no server equivalent — model scoring, display formatting, filtering logic — it lives in `repository-client.ts` as a static class and is **imported directly**, not via the route system.

```typescript
// skills/repository-client.ts
export class SkillsRepositoryClient {
  /**
   * Get the single best model for a favorite given user permissions
   */
  static getBestModelForFavorite(
    favoriteSelection: FavoriteGetModelSelection | null,
    skillSelection: FiltersModelSelection | ManualModelSelection | undefined,
    user: JwtPayloadType,
  ): ModelOption | null {
    // pure computation — no storage, no HTTP
    const models = this.getFilteredModels(favoriteSelection ?? skillSelection);
    return models[0] ?? null;
  }

  /**
   * Format credit cost for display
   */
  static formatCreditCost(cost: number, t: ChatT): string {
    if (cost === 0) return t("selector.free");
    return t("components.credits.credits", { count: cost });
  }
}
```

Imported directly in widgets and hooks:

```typescript
// favorites/repository-client.ts (uses it)
import { SkillsRepositoryClient } from "../skills/repository-client";

const bestModel = SkillsRepositoryClient.getBestModelForFavorite(
  stored.modelSelection,
  skill?.modelSelection,
  user,
);
```

No `route-client.ts` counterpart, no `useClientRoute` in the definition. Just a static class with pure functions.

---

## Use Case 3: Storage Abstraction

When a feature needs platform-agnostic persistence — works on web (localStorage) and React Native (AsyncStorage) — the client repository wraps the storage layer.

```typescript
// auth/repository-client.ts
import { storage } from "next-vibe-ui/lib/storage"; // platform-agnostic

export class AuthRepositoryClient {
  static async setAuthToken(
    token: string,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<void>> {
    try {
      await storage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      return success();
    } catch (error) {
      logger.error("Failed to store auth token", parseError(error));
      return fail({
        message: t("errors.storage.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
```

Used directly by hooks — not via `route-client.ts`.

---

## Rules (all three use cases)

- **Static class, no instances** — `MyRepositoryClient.method()`, never `new MyRepositoryClient()`
- **`ResponseType<T>` everywhere** — never throw, always `success()` / `fail()`
- **Logger received as parameter** — never created inside
- **SSR guard on all browser APIs** — `typeof window === "undefined"` before any `localStorage` call
- **Types from `definition.ts`** — for route mirrors; types must match the server exactly
- **No React imports** — `repository-client.ts` is framework-agnostic; hooks and widgets import it, not the reverse

```typescript
// SSR guard
private static loadFromStorage(): Item[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(KEY);
  return stored ? JSON.parse(stored) : [];
}
```

---

## File Structure Summary

```
feature/
  definition.ts          — declares useClientRoute / allowedClientRoles (use case 1 only)
  repository.ts          — server implementation
  repository-client.ts   — client implementation (any/all use cases)
  route.ts               — server route handler
  route-client.ts        — client route handler (use case 1 only)
```

Use cases 2 and 3 only need `repository-client.ts` — no `route-client.ts`, no definition changes.

---

## When to Create `repository-client.ts`

| Situation                                                   | Create?                        |
| ----------------------------------------------------------- | ------------------------------ |
| Feature works without a server (incognito, unauthenticated) | Yes — use case 1               |
| Shared computation used by 2+ widgets/hooks                 | Yes — use case 2               |
| Platform-agnostic storage (web + native)                    | Yes — use case 3               |
| Simple one-off helper used in one place                     | No — inline it                 |
| Logic that could run server-side                            | No — put it in `repository.ts` |

---

## Checklist (use case 1 — route mirror)

- [ ] `repository-client.ts` is a sibling of `repository.ts`
- [ ] `route-client.ts` is a sibling of `route.ts`, uses `clientEndpointsHandler`
- [ ] Response types imported from `definition.ts` — identical shape to server
- [ ] `definition.ts` declares `allowedClientRoles` or `useClientRoute`
- [ ] Static class, no instances, `ResponseType<T>` everywhere
- [ ] Logger received as parameter
- [ ] `typeof window === "undefined"` guard on all browser APIs

---

## Related

- [Repository Patterns](repository.md) — Server-side repository
- [Definition Files](definition.md) — `allowedClientRoles` and `useClientRoute`
- [Hooks Patterns](hooks.md) — `useEndpoint()` transparently handles both paths
- [React Native](repository.native.md) — `.native.ts` override pattern
