# Route Handler Patterns

Route handlers (`route.ts`) are thin wrappers that connect HTTP endpoints to repository methods. They should contain **no business logic** and **no type definitions**.

## Core Principles

### 1. Routes Are Pass-Through Only

Routes should **only** call repository methods and return their results. No logic, no transformations, no type handling.

```typescript
// ✅ CORRECT - Non-async: Direct pass-through (no async/await)
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger }) =>
      ChatFavoritesRepository.getFavorites(user, logger),
  },
});
```

```typescript
// ✅ CORRECT - Async: Use async handler with await
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) =>
      await browserRepository.executeTool(data, logger),
  },
});
```

**Rule: Non-async repository methods use direct arrow functions without async/await. Async repository methods use async handlers with await.**

```typescript
// ❌ WRONG - Logic in route handler
export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user }) => {
      const userId = user.id;

      // ❌ Business logic doesn't belong here
      if (userId) {
        const characters = await repository.getAllCharacters(userId);
        return success({ characters });
      }

      const defaultCharacters = repository.getDefaultCharacters();
      return success({ characters: defaultCharacters });
    },
  },
});
```

### 2. No Type Imports

Routes should not import types from definition files. Types are handled by the repository.

```typescript
// ❌ WRONG - Importing types in route
import type { MyRequestOutput, MyResponseOutput } from "./definition";
```

```typescript
// ✅ CORRECT - No type imports, just pass data through
import definitions from "./definition";
import { MyRepository } from "./repository";

// ✅ CORRECT - For repository folder structure
import { MyRepository } from "./repository/index";
// or simply (index is resolved automatically)
import { MyRepository } from "./repository";
```

### 3. Pass Only What Repository Needs

Don't destructure and rebuild objects. Pass handler parameters directly.

```typescript
// ✅ CORRECT - Pass parameters directly
handler: ({ data, user, logger, urlPathParams }) =>
  MyRepository.update(data, urlPathParams, user, logger),

// ❌ WRONG - Unnecessary destructuring and rebuilding
handler: async ({ data, user, logger, urlPathParams }) => {
  const { id } = urlPathParams;
  const { name, email } = data;
  return MyRepository.update({ name, email }, id, user, logger);
},
```

### 4. No Response Building

Repositories return `ResponseType<T>`. Routes just pass it through.

```typescript
// ❌ WRONG - Building response in route
handler: async ({ data, user }) => {
  const result = await repository.create(data);
  return success({ id: result.id, message: "Created" });
},

// ✅ CORRECT - Repository handles response
handler: ({ data, user, logger }) =>
  MyRepository.create(data, user, logger),
```

## File Structure

```typescript
/**
 * [Feature Name] API Route Handler
 * Handles [HTTP methods] requests for [feature]
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { MyRepository } from "./repository";

export const { GET, POST, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger }) => MyRepository.list(user, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger }) =>
      MyRepository.create(data, user, logger),
  },
});
```

## Email Integration

Email rendering is configured in the route, but the repository handles the data flow.

```typescript
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: [
      {
        render: renderWelcomeMail,
        ignoreErrors: false,
      },
      {
        render: renderAdminNotificationMail,
        ignoreErrors: false,
      },
    ],
    handler: ({ data, user, logger }) =>
      MyRepository.submit(data, user, logger),
  },
});
```

## URL Path Parameters

Pass `urlPathParams` to repository when the endpoint has dynamic segments.

```typescript
// Path: /api/[locale]/items/[id]/route.ts
export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger, urlPathParams }) =>
      ItemRepository.getById(urlPathParams, user, logger),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, user, logger, urlPathParams }) =>
      ItemRepository.update(data, urlPathParams, user, logger),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, logger, urlPathParams }) =>
      ItemRepository.delete(urlPathParams, user, logger),
  },
});
```

## Handler Parameters

Available parameters from the endpoint handler:

| Parameter       | Description                                         |
| --------------- | --------------------------------------------------- |
| `data`          | Request body (POST/PUT/PATCH) or query params (GET) |
| `user`          | JWT payload (`JwtPayloadType`)                      |
| `logger`        | `EndpointLogger` instance                           |
| `urlPathParams` | URL path parameters (e.g., `{ id: "..." }`)         |
| `locale`        | User's locale (`CountryLanguage`)                   |
| `request`       | Next.js `NextRequest` object                        |
| `platform`      | Platform detection (`Platform`)                     |

## Common Violations

### Business Logic in Routes

```typescript
// ❌ WRONG
handler: async ({ user, data }) => {
  if (!user.id) {
    return fail({ message: "Unauthorized", errorType: ErrorResponseTypes.UNAUTHORIZED });
  }
  const task = categoryToTask(data.category);
  const result = await repository.create({ ...data, task });
  return success({ id: result.id });
},

// ✅ CORRECT - Move all logic to repository
handler: ({ data, user, logger }) =>
  MyRepository.create(data, user, logger),
```

### Conditional Repository Calls

```typescript
// ❌ WRONG
handler: async ({ user }) => {
  if (user.id) {
    return await repository.getForUser(user.id);
  }
  return await repository.getPublic();
},

// ✅ CORRECT - Single repository method handles the logic
handler: ({ user, logger }) =>
  MyRepository.get(user, logger),
```

### Importing Response Helpers

```typescript
// ❌ WRONG - Route shouldn't import response helpers
import { success, fail } from "next-vibe/shared/types/response.schema";

// ✅ CORRECT - Only import what's needed for routing
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
```

## Reference Examples

**Clean route files:**

- `src/app/api/[locale]/agent/chat/favorites/route.ts` - GET and POST
- `src/app/api/[locale]/agent/chat/favorites/[id]/route.ts` - GET, PATCH, DELETE with urlPathParams
- `src/app/api/[locale]/user/public/login/route.ts` - POST with multiple parameters

---

## See Also

- [Repository Patterns](repository.md) - Business logic implementation
- [Definition Patterns](definition.md) - Endpoint schema definitions
- [Email Patterns](email.md) - Email integration
