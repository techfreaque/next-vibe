# Endpoint Anatomy

**What goes in each endpoint folder.**

---

## 📁 Standard Files

Every endpoint folder follows this structure:

```
my-endpoint/
├── definition.ts    # Required - API contract (type-safe)
├── repository.ts    # Required - Business logic
├── route.ts         # Required - Handler wiring
├── hooks.ts         # Optional - React/React Native hooks
├── components/      # Optional - UI components (planned)
│   ├── MyForm.web.tsx      # Web UI (shadcn/ui)
│   ├── MyForm.native.tsx   # Native UI (react-native-reusables)
│   └── MyForm.tsx          # Shared logic/interface
├── db.ts            # Optional - Database schema
├── enum.ts          # Optional - Enums
├── types.ts         # Optional - TypeScript types
├── seeds.ts         # Optional - Seed data
├── route.test.ts    # Optional - Tests
└── i18n/            # Optional - Translations (type-safe)
```

**Key Principle: Everything for one feature lives in one folder.**

This makes the codebase:

- **Human-friendly:** Easy to navigate and understand
- **AI-friendly:** AI can easily find all related code
- **Type-safe:** Full TypeScript inference everywhere
- **Maintainable:** Changes are localized to one folder

---

## 1. definition.ts (Required)

**The API contract.** Defines request/response schemas, validation, UI metadata, and examples.

```typescript
import { z } from "zod";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { Methods, WidgetType, FieldDataType, LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { objectField, requestDataField, responseField } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "public", "login"],
  title: "app.api.v1.core.user.public.login.title",
  description: "app.api.v1.core.user.public.login.description",
  allowedRoles: [UserRole.PUBLIC] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layout: { type: LayoutType.VERTICAL },
    },
    { request: "data", response: true },
    {
      // Request fields
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.v1.core.user.public.login.fields.email.label",
          required: true,
        },
        z.string().email().transform(val => val.toLowerCase().trim()),
      ),

      password: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.PASSWORD,
          label: "app.api.v1.core.user.public.login.fields.password.label",
          required: true,
        },
        z.string().min(1),
      ),

      // Response fields
      userId: responseField(
        { type: WidgetType.TEXT },
        z.uuid(),
      ),

      token: responseField(
        { type: WidgetType.TEXT },
        z.string(),
      ),
    },
  ),

  examples: {
    requests: {
      default: {
        email: "user@example.com",
        password: "password123",
      },
    },
    responses: {
      default: {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    },
  },
});

export default { POST };
```

**Key parts:**

- `method` - HTTP method (GET, POST, PUT, PATCH, DELETE)
- `path` - Array matching folder structure
- `allowedRoles` - Who can access this endpoint
- `fields` - Zod schemas + UI metadata
- `examples` - Request/response examples

---

## 2. repository.ts (Required)

**Business logic.** Pure functions that do the actual work.

```typescript
import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { createSuccessResponse, createErrorResponse, ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { verifyPassword } from "next-vibe/shared/utils/password";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import type { JWTPublicPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { createJWT } from "@/app/api/[locale]/v1/core/user/auth/jwt";

export class LoginRepository {
  async login(
    data: { email: string; password: string },
    user: JWTPublicPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ userId: string; token: string }>> {
    // Find user
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!dbUser) {
      return createErrorResponse(
        "app.api.v1.core.user.errors.invalid_credentials",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }

    // Verify password
    const isValid = await verifyPassword(data.password, dbUser.passwordHash);

    if (!isValid) {
      return createErrorResponse(
        "app.api.v1.core.user.errors.invalid_credentials",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }

    // Create JWT
    const token = await createJWT({ id: dbUser.id, isPublic: false, leadId: user.leadId });

    logger.info("User logged in", { userId: dbUser.id });

    return createSuccessResponse({
      userId: dbUser.id,
      token,
    });
  }
}

export const loginRepository = new LoginRepository();
```

**Key patterns:**

- Class-based or functional
- Pure business logic (no HTTP concerns)
- Returns `ResponseType<T>`
- Uses `createSuccessResponse` / `createErrorResponse`
- Logs important events

---

## 3. route.ts (Required)

**Handler wiring.** Connects the endpoint to the handler system.

```typescript
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { loginRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      loginRepository.login(data, user, locale, logger),
  },
});
```

**That's it.** The `endpointsHandler` generates:

- Next.js route handler
- tRPC procedure
- CLI command

---

## 4. hooks.ts (Optional)

**React/React Native hooks.** Client-side hooks for using the endpoint.

**These hooks work on both web and native - write once, use everywhere.**

```typescript
import { useMemo } from "react";
import { useTranslation } from "@/i18n/core/client";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import type { ApiFormReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/types";

import definitions from "./definition";

export function useLogin(): ApiFormReturn<
  { email: string; password: string },
  { userId: string; token: string },
  never
> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useApiForm(definitions.POST, logger, {
    defaultValues: {
      email: "",
      password: "",
    },
  });
}
```

**Usage (Web):**

```typescript
// LoginForm.web.tsx
const { form, submitForm, mutation } = useLogin();
```

**Usage (Native):**

```typescript
// LoginForm.native.tsx
const { form, submitForm, mutation } = useLogin(); // Same hook!
```

---

## 5. components/ (Optional - Planned)

**UI components.** Colocated with business logic.

**Status:** Planned for Milestone 4 (not yet implemented)

**Note:** This is separate from React Native support. Component colocation works on both web and native once React Native is done (Milestone 3).

**Structure:**

```
components/
└── LoginForm.tsx          # Single file, works on web and native
```

**Component:**

```typescript
// LoginForm.tsx
import { Form, FormField, Button } from "@/ui/form";
import { useLogin } from "../hooks";

export function LoginForm() {
  const { form, submitForm, mutation } = useLogin();

  return (
    <Form form={form} onSubmit={submitForm}>
      <FormField name="email" />
      <FormField name="password" />
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </Form>
  );
}
```

**This single file works on both web and native** because:

- `@/ui/form` resolves to web or native components (framework handles it)
- Same interface on both platforms
- NativeWind makes className work on native

**Optional platform-specific versions:**

```
components/
├── LoginForm.tsx          # Default, works everywhere
├── LoginForm.web.tsx      # Web-specific (optional)
└── LoginForm.native.tsx   # Native-specific (optional)
```

**Only use .web.tsx or .native.tsx when you need platform-specific code.**

**Page Structure (Composition Layer):**

```typescript
// src/app/[locale]/(auth)/login/page.tsx
import { LoginForm } from "@/app/api/[locale]/v1/core/user/public/login/components/LoginForm";

export default function LoginPage() {
  return <LoginForm />;
}
```

**This page.tsx works on both web and native.** Framework handles the mapping.

**Benefits:**

- **Colocation:** UI lives with business logic
- **Type-safe:** Components get types from definitions
- **Platform-specific:** Different UI, same logic
- **Thin pages:** Page structure is just composition

See **[React Native Roadmap](REACT_NATIVE_ROADMAP.md)** for implementation details.

---

## 6. db.ts (Optional)

**Database schema.** Drizzle ORM table definitions.

```typescript
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

---

## 7. enum.ts (Optional)

**Enums.** Domain-specific enumerations.

```typescript
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export const UserStatusValues = Object.values(UserStatus);
```

---

## 8. types.ts (Optional)

**TypeScript types.** Additional type definitions.

```typescript
import type { InferSelectModel } from "drizzle-orm";
import type { users } from "./db";

export type User = InferSelectModel<typeof users>;

export type UserWithoutPassword = Omit<User, "passwordHash">;
```

---

## 9. seeds.ts (Optional)

**Seed data.** For development and testing.

```typescript
import type { NewUser } from "./db";

export const userSeeds: NewUser[] = [
  {
    email: "admin@example.com",
    passwordHash: "$argon2id$...",
    name: "Admin User",
    isEmailVerified: true,
  },
  {
    email: "user@example.com",
    passwordHash: "$argon2id$...",
    name: "Test User",
    isEmailVerified: false,
  },
];
```

---

## 10. route.test.ts (Optional)

**Tests.** Endpoint tests.

```typescript
import { describe, it, expect } from "vitest";
import { loginRepository } from "./repository";

describe("Login endpoint", () => {
  it("should login successfully with valid credentials", async () => {
    const result = await loginRepository.login(
      { email: "user@example.com", password: "password123" },
      { isPublic: true, leadId: "test-lead-id" },
      "en-GLOBAL",
      mockLogger,
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.userId).toBeDefined();
      expect(result.data.token).toBeDefined();
    }
  });

  it("should fail with invalid credentials", async () => {
    const result = await loginRepository.login(
      { email: "user@example.com", password: "wrong" },
      { isPublic: true, leadId: "test-lead-id" },
      "en-GLOBAL",
      mockLogger,
    );

    expect(result.success).toBe(false);
  });
});
```

---

## 11. i18n/ (Optional)

**Translations.** Organized by language. **Type-safe translation keys.**

```
i18n/
├── en/
│   └── index.ts
├── de/
│   └── index.ts
└── pl/
    └── index.ts
```

**Example:**

```typescript
// i18n/en/index.ts
export default {
  "app.api.v1.core.user.public.login.title": "Login",
  "app.api.v1.core.user.public.login.description": "Sign in to your account",
  "app.api.v1.core.user.public.login.fields.email.label": "Email",
  "app.api.v1.core.user.public.login.fields.password.label": "Password",
};
```

**Type-safe usage:**

```typescript
t("app.api.v1.core.user.public.login.title"); // ✅ Valid key
t("app.invalid.key");                          // ❌ Type error
```

See **[I18n Structure](I18N_STRUCTURE_RULES.md)** for details.

---

## 🎯 Summary

**Standard structure:**

1. `definition.ts` - What (API contract, type-safe)
2. `repository.ts` - How (business logic)
3. `route.ts` - Where (handler wiring)

**Optional additions:**
4. `hooks.ts` - Client usage (React/React Native)
5. `components/` - UI components (planned, web + native)
6. `db.ts` - Database schema
7. `enum.ts` - Enumerations
8. `types.ts` - Type definitions
9. `seeds.ts` - Test data
10. `route.test.ts` - Tests
11. `i18n/` - Translations (type-safe)

**Everything related to the endpoint lives in one folder.**

**Benefits:**

- **Human-friendly:** Easy to navigate
- **AI-friendly:** AI can find all related code
- **Type-safe:** Full TypeScript inference
- **Platform-agnostic:** Same hooks work on web and native
- **Maintainable:** Changes are localized

---

Next: **[Client Hooks](CLIENT_HOOKS.md)** - Using endpoints from React/React Native
