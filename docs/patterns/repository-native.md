# Native Repository Pattern

Native repositories (`repository.native.ts`) provide the same interface as server repositories but use HTTP calls instead of direct database access. This enables code sharing between server and React Native platforms.

## Core Pattern

```typescript
// repository.native.ts
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

// Import the static type from server repository for compile-time checking
import type { UserRepositoryType } from "./repository";

// Import endpoint definitions for type-safe HTTP calls
import { GET as getMeEndpoint } from "./private/me/definition";

/**
 * Native User Repository - Static class pattern
 */
export class UserRepository {
  static async getUserByAuth(
    // oxlint-disable-next-line no-unused-vars
    _options: UserFetchOptions,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<User>> {
    const response = await nativeEndpoint(getMeEndpoint, {}, logger, locale);
    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    }
    return response;
  }

  static async createUser(
    // oxlint-disable-next-line no-unused-vars
    _data: NewUser,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<User>> {
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
import { GET as getEndpoint } from "./definition";

static async get(
  id: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<DataType>> {
  const response = await nativeEndpoint(
    getEndpoint,
    { id },  // Request params inferred from endpoint definition
    logger,
    locale,
  );

  if (response.success) {
    return { success: true, data: response.data, message: response.message };
  }
  return response;
}
```

### 5. Not Implemented Methods

For methods that are not implemented on native, use plain `throw new Error()`:

```typescript
static async adminOnlyMethod(
  // oxlint-disable-next-line no-unused-vars
  _data: SomeType,
  // oxlint-disable-next-line no-unused-vars
  _logger: EndpointLogger,
): Promise<ResponseType<Data>> {
  // oxlint-disable-next-line restricted-syntax
  throw new Error("adminOnlyMethod is not implemented on native");
}
```

**Important:**
- Use `throw new Error("methodName is not implemented on native")` - NOT `fail()` or `throwErrorResponse`
- Add `// oxlint-disable-next-line restricted-syntax` before the throw statement
- Add `// oxlint-disable-next-line no-unused-vars` before each unused parameter
- Prefix unused parameters with `_` (e.g., `_data`, `_logger`)

### 6. Server-Only Methods (void return)

For server-only methods that return `void` (like webhook handlers), also use plain `throw new Error()`:

```typescript
static async handleWebhook(): Promise<void> {
  // oxlint-disable-next-line restricted-syntax
  throw new Error("handleWebhook is not implemented on native");
}
```

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
2. **Implement commonly used methods first** - Methods called from shared code (page.tsx, components)
3. **Leave admin/server-only methods as throw** - Use `throw new Error("methodName is not implemented on native")`
4. **Add compile-time check at bottom** - `const _typeCheck: XxxRepositoryType = XxxRepository;`
5. **Add oxlint disable comments** - Required for unused params and throw statements

## See Also

- [Repository Patterns](repository.md) - Server repository patterns
- [Route Patterns](route.md) - API route handlers
