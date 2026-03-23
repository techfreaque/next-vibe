# Native Repository Pattern

Native repositories (`repository.native.ts`) provide the same interface as server repositories but use HTTP calls instead of direct database access. This enables code sharing between server and React Native platforms.

## The Core Decision: Implement or Throw

**The only question when writing a native repository method:**

> Is this method called from a `page.tsx` or server component?

- **Yes** → Implement it using `nativeEndpoint()` to fetch the data via HTTP
- **No** → `throw new Error("X is not implemented on native")` - loud failure is intentional

Do NOT return `fail()` for unimplemented methods. Throwing causes the app to crash immediately and visibly, making missing implementations obvious during development.

## Core Pattern

```typescript
// repository.native.ts
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UserRepositoryType } from "./repository";
import userEndpoints, {
  type UserGetResponseOutput,
} from "./private/me/definition";

/**
 * Native User Repository - Static class pattern
 */
export class UserRepository {
  // ✅ IMPLEMENT: called from page.tsx to load initial user data
  static async getUserByAuth(
    // oxlint-disable-next-line no-unused-vars
    _options: UserFetchOptions,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserGetResponseOutput>> {
    const response = await nativeEndpoint(
      userEndpoints.GET,
      {},
      logger,
      locale,
    );
    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    }
    return {
      success: false,
      errorType: response.errorType,
      message: response.message,
      messageParams: response.messageParams,
    };
  }

  // ❌ NOT IMPLEMENTED: only called server-side in admin flows, not used in page.tsx
  static async createUser(
    // oxlint-disable-next-line no-unused-vars
    _data: NewUser,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<UserGetResponseOutput>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("createUser is not implemented on native");
  }
}

// Compile-time type check
const _typeCheck: UserRepositoryType = UserRepository;
void _typeCheck;
```

## Key Principles

### 1. Export Type from Server Repository

**IMPORTANT: Only export the type when a corresponding `repository.native.ts` file exists. If there is no native implementation, do NOT export the type.**

```typescript
// repository.ts (server)
export class UserRepository {
  private static async internalHelper(...) { ... }  // Private methods OK
  static async getUserById(...): Promise<ResponseType<User>> { ... }
  static async getUserByAuth(...): Promise<ResponseType<User>> { ... }
}

// Pick + keyof excludes private members automatically
// This allows server to have private helpers without requiring them in native
// ⚠️ ONLY ADD THIS IF repository.native.ts EXISTS
export type UserRepositoryType = Pick<typeof UserRepository, keyof typeof UserRepository>;
```

### 2. Compile-Time Type Check in Native

```typescript
// repository.native.ts
import type { UserRepositoryType } from "./repository";

export class UserRepository {
  // ... same static methods
}

// This assignment will fail at compile time if:
// - Any method is missing
// - Any method has wrong parameter types
// - Any method has wrong return type
const _typeCheck: UserRepositoryType = UserRepository;
void _typeCheck;
```

### 3. Same Class Name

Both files export the same class name. The bundler resolves which to use based on platform:

- Server/Web: Uses `repository.ts` (direct DB access)
- React Native: Uses `repository.native.ts` (HTTP calls)

### 4. Use nativeEndpoint for Type-Safe HTTP

```typescript
import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import definitions from "./definition";

static async get(
  id: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<DataType>> {
  const response = await nativeEndpoint(
    definitions.GET,
    {
      data: { someRequestField: id }, // ← request body fields go under "data" key
      urlPathParams: { id },          // ← URL path params go under "urlPathParams" key
    },
    logger,
    locale,
  );

  if (response.success) {
    return { success: true, data: response.data, message: response.message };
  }
  return {
    success: false,
    errorType: response.errorType,
    message: response.message,
    messageParams: response.messageParams,
  };
}
```

**Important:** `nativeEndpoint` uses `data` (not `requestData`) for request body fields. Both keys are optional - omit `data` if the endpoint has no request body fields, omit `urlPathParams` if there are no path params.

```typescript
// GET with no params
await nativeEndpoint(endpoint, {}, logger, locale);

// GET with only urlPathParams (no request body fields)
await nativeEndpoint(endpoint, { urlPathParams: { threadId } }, logger, locale);

// GET with both request body and urlPathParams
await nativeEndpoint(
  endpoint,
  { data: {}, urlPathParams: { threadId } },
  logger,
  locale,
);

// POST with only request body (no path params)
await nativeEndpoint(endpoint, { data: { name, description } }, logger, locale);
```

### 5. Not Implemented Methods - Throw Loudly

For methods not used in `page.tsx` or server components, always throw:

```typescript
static async adminOnlyMethod(
  // oxlint-disable-next-line no-unused-vars
  _data: SomeType,
  // oxlint-disable-next-line no-unused-vars
  _logger: EndpointLogger,
  // oxlint-disable-next-line no-unused-vars
  _locale: CountryLanguage,
): Promise<ResponseType<Data>> {
  // oxlint-disable-next-line restricted-syntax
  throw new Error("adminOnlyMethod is not implemented on native");
}
```

**Rules:**

- Prefix ALL unused parameters with `_` and add `// oxlint-disable-next-line no-unused-vars` before each
- Add `// oxlint-disable-next-line restricted-syntax` before the throw
- Do NOT return `fail()` - the throw is intentional to surface missing implementations loudly

## File Naming

```
feature/
├── repository.ts        # Server implementation (direct DB)
├── repository.native.ts # Native implementation (HTTP calls)
├── definition.ts        # Endpoint definitions (shared)
├── db.ts               # Database schema (server only)
└── route.ts            # API handlers (server only)
```

## Implementation Strategy

1. **Export type from server repository** - Add `export type XxxRepositoryType = Pick<typeof XxxRepository, keyof typeof XxxRepository>;`
2. **Find which methods are called from `page.tsx` or server components** - Only those need HTTP implementations
3. **Implement needed methods** - Use `nativeEndpoint()` with the appropriate endpoint definition
4. **Stub all other methods** - Use `throw new Error("X is not implemented on native")` with `// oxlint-disable-next-line restricted-syntax`
5. **Add compile-time check at bottom** - `const _typeCheck: XxxRepositoryType = XxxRepository;`
6. **Add oxlint disable comments** - Required for unused params (`no-unused-vars`) and throw statements (`restricted-syntax`)

## Real Examples

- `src/app/api/[locale]/user/repository.native.ts` - `getUserByAuth()` implemented, rest throw
- `src/app/api/[locale]/subscription/repository.native.ts` - `getSubscription()` implemented, rest throw
- `src/app/api/[locale]/credits/repository.native.ts` - `getCreditBalanceForUser()` implemented, rest throw
- `src/app/api/[locale]/agent/chat/folders/[id]/repository.native.ts` - `getFolder()` with `urlPathParams`

## See Also

- [Repository Patterns](repository.md) - Server repository patterns
- [Route Patterns](route.md) - API route handlers
