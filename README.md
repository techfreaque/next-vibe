# NextVibe

**The AI-First Full-Stack Framework for Next.js**

NextVibe is the spiritual successor to WordPress for the AI coding age. A revolutionary Next.js framework that combines 100% type-safety, recursive API architecture, and first-class AI tooling to create the ultimate development experience for both humans and AI coding assistants.

[![License: GPL-3.0](https://img.shields.io/badge/Framework-GPL--3.0-blue.svg)](LICENSE)
[![License: MIT](https://img.shields.io/badge/App-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7_/_TSGO-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

> **Fork it. Own it. Extend it.** Like shadcn/ui but for your entire business logic + UI stack.

---

## 🎯 What is NextVibe?

NextVibe is not a package you install - it's a **pattern you adopt**. Fork this repository and migrate your code into a structure that:

- **Forces AI to do it one way** - Recursive folder patterns eliminate ambiguity
- **100% type-safe everything** - Even your translations, CLI, and error messages
- **Works across platforms** - Web (Next.js) + Mobile (React Native/Expo) from the same code
- **Generates everything** - One definition creates: API endpoint, tRPC procedure, CLI command, React hooks, and cron tasks
- **AI-optimized tooling** - `vibe check` combines lint + typecheck so AI can't ignore either

### Why Fork Instead of Install?

Like shadcn/ui, NextVibe gives you **full ownership**:

- ✅ Copy and modify any code
- ✅ No hidden black boxes
- ✅ Adapt patterns to your needs
- ✅ Share your modules with others
- ✅ Still just Next.js under the hood

---

## 🚀 Quick Start

### Prerequisites

```bash
- Bun 1.3.0+ (recommended) or Node.js 20+
- PostgreSQL 14+ (auto-managed in dev mode)
```

### 1. Fork & Clone

```bash
# Fork this repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Start Development

```bash
vibe dev
```

That's it! NextVibe automatically:

- ✅ Starts PostgreSQL (if not running)
- ✅ Runs migrations
- ✅ Seeds development data
- ✅ Starts Next.js dev server
- ✅ Starts cron task runner (development mode)

---

## 🌟 Revolutionary Features

### 1. **Recursive API Architecture**

Your folder structure **IS** your API. No routing configuration needed.

```
src/app/api/[locale]/v1/core/user/
├── public/
│   ├── login/
│   │   ├── definition.ts    → API contract
│   │   ├── repository.ts    → Business logic
│   │   ├── route.ts         → Handler (auto-generates 4 outputs)
│   │   ├── hooks.ts         → React/React Native hooks
│   │   └── task.ts          → Cron job (optional)
│   └── signup/
│       ├── definition.ts
│       ├── repository.ts
│       └── route.ts
└── private/
    └── me/
        ├── definition.ts
        ├── repository.ts
        └── route.ts
```

**Result:**

- 🌐 Next.js API: `POST /api/en-GLOBAL/v1/core/user/public/login`
- 🔌 tRPC: `trpc.user.public.login.mutate()`
- 💻 CLI: `vibe user:public:login --email=test@example.com`
- ⚛️ React Hook: `useLogin()`

**One definition. Four outputs. Zero duplication.**

### 2. **One Definition, Everything Generated**

Write your endpoint once, get everything:

```typescript
// definition.ts - The single source of truth
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  Methods,
  WidgetType,
  FieldDataType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "public", "login"],
  fields: objectField({
    /* ... */
  }),
});

// Automatically generates:
// ✅ Next.js route handler
// ✅ tRPC procedure
// ✅ CLI command with autocomplete
// ✅ React/React Native hooks
// ✅ TypeScript types
// ✅ Zod validation
```

### 3. **100% Type-Safe Translations**

**Even your translations are type-checked.** No more missing translation errors at runtime.

```typescript
// Auto-detected from folder path
t("app.api.v1.core.user.public.login.title"); // ✅ Valid
t("app.invalid.key"); // ❌ TypeScript error

// Works in:
// - React components
// - API responses
// - CLI output
// - Error messages
// - Email templates
```

**Enforced by ESLint:**

- All user-facing strings MUST use translation keys
- AI can't hardcode strings (eslint fails)
- Supports: English, German, Polish (add more easily)

### 4. **AI-Optimized `vibe check`**

Traditional approach (AI ignores one):

```bash
npm run lint   # AI might skip
npm run typecheck  # Or skip this
```

NextVibe approach (AI can't ignore):

```bash
vibe check
vibe check src/path/to/folder/or/file
# ✅ Runs BOTH lint + typecheck in one command
# ✅ Extensive ESLint rules force proper patterns
# ✅ Type-checks translations, schemas, everything
# ✅ Zero warnings tolerance = clean codebase
```

**Perfect for AI agents:**

- AI runs one command during development and before committing
- Catches all issues: types, lint, translations, patterns
- Forces AI to follow framework patterns
- No way to "half-fix" problems

### 5. **Instant CLI for Every Endpoint**

Test your APIs immediately without Postman:

```bash
# List all available commands
vibe --help

# Call any endpoint via CLI
vibe user:public:login \
  --email="test@example.com" \
  --password="secret123"

# Output is type-safe and formatted
✓ Login successful
{
  "userId": "abc-123",
  "token": "eyJhbG..."
}

# Works with complex data
vibe leads:create \
  --data='{"name":"John","email":"john@example.com"}' \
  --tags='["vip","newsletter"]'
```

**Why this is revolutionary:**

- AI can test endpoints **during development**
- No need to write curl commands
- Type-safe CLI arguments (validated by Zod)
- Same validation as API calls
- Instant feedback loop

### 6. **Colocated Database Schemas**

Database schemas live **next to the code that uses them**:

```
user/
├── public/
│   └── login/
│       ├── definition.ts
│       ├── repository.ts
│       └── route.ts
├── db.ts              ← User table schema (Drizzle ORM)
├── seeds.ts           ← Dev/test seed data
└── enum.ts            ← User-specific enums
```

**Benefits:**

- Everything for a feature in one place
- Easy to find related code
- Delete a folder = delete the feature
- AI can reason about the whole domain

**Drizzle Magic:**

```typescript
// db.ts
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  // ...
});

// Migrations are auto-generated
vibe migrate --generate
vibe migrate
```

### 7. **Auto-Managed Development Database**

**Zero database setup for developers:**

```bash
vibe dev
# ✅ Detects if PostgreSQL is running
# ✅ Starts it if not (via Docker)
# ✅ Creates database if missing
# ✅ Runs migrations automatically
# ✅ Seeds development data
# ✅ Starts Next.js dev server
```

**AI doesn't need to:**

- Install PostgreSQL
- Create databases
- Run migrations manually
- Remember to seed data
- Manage multiple terminals

**It just works.**

### 8. **Cron Tasks from Endpoints**

Add a `task.ts` file to any endpoint:

```typescript
// credits/expire/task.ts
export const creditExpirationTask: Task = {
  type: "cron",
  name: "credit-expiration",
  schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,

  run: async ({ logger }) => {
    const result = await creditRepository.expireCredits();
    logger.info("Expired credits", { count: result.data });
  },
};
```

**Automatically:**

- ✅ Registered with cron system
- ✅ Uses same repository/business logic
- ✅ Type-safe logging
- ✅ Error handling built-in
- ✅ Monitoring and alerts

**Same code, multiple triggers:**

- HTTP endpoint → Manual trigger
- CLI command → Admin operations
- Cron task → Scheduled execution
- React hook → UI interaction

### 9. **React + React Native (Same Code)**

**Write once, run everywhere** (Milestone 3 - Planned):

```typescript
// page.tsx - Works on Web AND Native
import { Button } from "next-vibe-ui/web/ui/button";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useLogin } from "@/app/api/[locale]/v1/core/user/public/login/hooks";
import { useTranslation } from "@/i18n/core/client";

export default function LoginPage() {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  const { form, submitForm, mutation } = useLogin({}, logger);

  return (
    <Div className="flex-1 items-center">
      <Input {...form.register("email")} />
      <Button onPress={submitForm} loading={mutation.isPending}>
        t("app.user.other.login.auth.login.signInButton")
      </Button>
    </Div>
  );
}
```

**On Web:**

- `next-vibe-ui/web/ui/button` → shadcn/ui
- `<Div>` → HTML div
- Tailwind CSS works

**On Native:**

- Framework automatically resolves to `next-vibe-ui/ui/...`
- `<Div>` → React Native View (via NativeWind)
- Same Tailwind classes work!

**Framework will handle all platform differences automatically once React Native support is complete (Milestone 3 - Planned).**

### 10. **Extensive ESLint Rules for AI**

Force AI to follow patterns:

```javascript
// eslint.i18n.config.mjs
"i18next/no-literal-string": "error"  // No hardcoded strings
```

**Catches:**

- ❌ Hardcoded user-facing strings
- ❌ Missing translation keys
- ❌ Console.log in production code
- ❌ Improper logger usage
- ❌ Type-unsafe patterns

**AI must:**

- ✅ Use translation keys everywhere
- ✅ Follow logger patterns
- ✅ Type-safe all the things
- ✅ Proper error handling

---

## 📚 Documentation

Comprehensive documentation in `./docs/`:

- **[Endpoint Anatomy](./docs/core-concepts/endpoint-anatomy.md)** - What goes in each endpoint folder
- **[Recursive API Folders](./docs/core-concepts/recursive-api-folders.md)** - How folder structure maps to routes
- **[Client Hooks](./docs/development/client-hooks.md)** - Using endpoints from React/React Native
- **[i18n Structure Rules](./docs/development/i18n-structure-rules.md)** - Type-safe translation system
- **[Logger Patterns](./docs/development/logger-patterns.md)** - Proper logging across the stack
- **[Testing Guide](./docs/development/testing-guide.md)** - Writing and running tests
- **[React Native Roadmap](./docs/roadmap/milestone-3-react-native.md)** - Cross-platform development

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**

- Next.js 15 (App Router)
- React 19
- TypeScript 7 / TSGO
- Tailwind CSS 4 / NativeWind 5
- shadcn/react-native-reusables UI components

**Backend:**

- Next.js API Routes
- tRPC 11 (auto-generated)
- PostgreSQL + Drizzle ORM
- Server Actions
- Zod validation

**Developer Experience:**

- Bun runtime
- Vibe CLI (custom tooling)
- ESLint with custom rules
- Automatic type generation
- Hot reload everything

**Cross-Platform (In Progress):**

- React Native / Expo
- NativeWind (Tailwind for Native)
- react-native-reusables (shadcn for Native)

### Core Packages

```
src/
├── app/
│   ├── [locale]/                   # Next.js pages (Web)
│   ├── api/[locale]/v1/core/       # API endpoints (recursive structure)
│   └── api/[locale]/v1/core/system # Core Framework and CLI tools
├── packages/
│   ├── next-vibe/                  # Deprecated: Core framework utilities
│   ├── next-vibe-ui/
│   │   ├── web/                    # Web UI (shadcn/ui)
│   │   └── native/                 # Native UI (react-native-reusables)
│   ├── react-native-comp/          # React Native / **Next**.JS compatibility layer
│   └── i18n/                       # Translations for UI components
├── config/                         # Environment and debug config
└── i18n/                           # Translation system
```

---

## 🎨 Example: Creating an Endpoint

### 1. Create Folder Structure

```bash
mkdir -p src/app/api/[locale]/v1/core/products/create
cd src/app/api/[locale]/v1/core/products/create
```

### 2. Define the API Contract

```typescript
// definition.ts
import { z } from "zod";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  Methods,
  WidgetType,
  FieldDataType,
  LayoutType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "products", "create"],
  title: "app.api.v1.core.products.create.title",
  description: "app.api.v1.core.products.create.description",
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    { type: WidgetType.CONTAINER, layout: { type: LayoutType.VERTICAL } },
    { request: "data", response: true },
    {
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.products.create.fields.name.label",
        },
        z.string().min(1).max(100),
      ),
      price: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.products.create.fields.price.label",
        },
        z.number().positive(),
      ),
      productId: responseField({ type: WidgetType.TEXT }, z.uuid()),
    },
  ),
});

export default { POST };
```

### 3. Implement Business Logic

```typescript
// repository.ts
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JWTPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export class ProductRepository {
  async create(
    data: { name: string; price: number },
    user: JWTPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ productId: string }>> {
    logger.info("Creating product", { name: data.name });

    const product = await db
      .insert(products)
      .values({
        name: data.name,
        price: data.price,
        createdBy: user.id,
      })
      .returning();

    return success({ productId: product[0].id });
  }
}

export const productRepository = new ProductRepository();
```

### 4. Wire Up the Handler

```typescript
// route.ts
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import definitions from "./definition";
import { productRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      productRepository.create(data, user, locale, logger),
  },
});
```

### 5. Use Everywhere

**React Component:**

```typescript
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-api-mutation-form";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import definitions from "@/app/api/[locale]/v1/core/products/create/definition";
import { useTranslation } from "@/i18n/core/client";

function CreateProduct() {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  const { form, submitForm, mutation } = useApiForm(definitions.POST, logger);

  return (
    <Form form={form} onSubmit={submitForm}>
      <FormField name="name" />
      <FormField name="price" />
      <Button type="submit">Create Product</Button>
    </Form>
  );
}
```

**CLI:**

```bash
vibe products:create --name="Widget" --price=99.99
```

**tRPC:**

```typescript
const result = await trpc.products.create.mutate({
  name: "Widget",
  price: 99.99,
});
```

**Cron Task (optional):**

```typescript
// task.ts
export const syncProductsTask: Task = {
  type: "cron",
  schedule: CRON_SCHEDULES.HOURLY,
  run: async ({ logger }) => {
    await productRepository.syncFromExternal(logger);
  },
};
```

**One definition. Everywhere.**

---

## 🛠️ Vibe CLI

The `vibe` command is your Swiss Army knife:

### Development

```bash
vibe dev              # Start dev server (auto-manages DB)
vibe build            # Build for production
vibe start            # Start production server
```

### Database

```bash
vibe migrate --generate # Generate migration from schema changes
vibe migrate            # Run pending migrations
vibe migrate:prod       # Run migrations in production
vibe seed               # Seed database with dev data
vibe studio             # Open Drizzle Studio (DB GUI)
```

### Quality Checks

```bash
vibe check            # Run lint + typecheck (AI's best friend)
vibe lint             # Run ESLint
vibe typecheck        # Run TypeScript compiler
vibe test             # Run tests
```

### Endpoint Testing

```bash
# List all endpoints
vibe --help

# Call any endpoint
vibe user:public:login --email="test@example.com" --password="secret"

# Complex data via JSON
vibe leads:create --data='{"name":"John Doe","email":"john@example.com"}'

# Get help for specific endpoint
vibe user:public:login --help
```

---

## 🔒 Type Safety Everywhere

### 1. API Definitions

```typescript
// Types inferred from Zod schemas
const { POST } = createEndpoint({
  fields: objectField(
    {},
    { request: "data", response: true },
    {
      email: requestDataField({}, z.string().email()),
      userId: responseField({}, z.uuid()),
    },
  ),
});

// TypeScript knows:
type RequestData = { email: string };
type ResponseData = { userId: string };
```

### 2. React Hooks

```typescript
const { form, mutation } = useApiForm(definitions.POST, logger);

form.setValue("email", "test@example.com"); // ✅ Type-safe
form.setValue("email", 123); // ❌ Type error
form.setValue("invalid", "value"); // ❌ Property doesn't exist
```

### 3. Database Queries

```typescript
// Drizzle ORM = full type safety
const user = await db.query.users.findFirst({
  where: eq(users.email, email),
});

// TypeScript knows the exact shape of `user`
console.log(user.email); // ✅ string
console.log(user.invalid); // ❌ Property doesn't exist
```

### 4. Translations

```typescript
// Translation keys are validated at compile time
t("app.api.v1.core.user.public.login.title"); // ✅ Valid key
t("app.some.invalid.key"); // ❌ Type error

// Works in components, APIs, CLI, everywhere
```

---

## 🌍 Internationalization

### Structure

```
i18n/
├── en/index.ts    # English (base language)
├── de/index.ts    # German (typed from English)
└── pl/index.ts    # Polish (typed from English)
```

### Type-Safe Keys

Translation keys **automatically match your folder structure**:

```
File: src/app/api/[locale]/v1/core/user/public/login/i18n/en/index.ts
Key:  app.api.v1.core.user.public.login.{yourKey}
```

**The path IS the namespace. No configuration needed.**

### Usage

```typescript
// In React components
import { useTranslation } from "@/i18n/core/client";

function LoginForm() {
  const { t } = useTranslation();

  return <h1>{t("app.api.v1.core.user.public.login.title")}</h1>;
}

// In API responses
return fail({
  message: "app.api.v1.core.user.errors.invalid_credentials",
  errorType: ErrorResponseTypes.UNAUTHORIZED,
});

// In CLI output
logger.info("app.api.v1.core.user.public.login.success");
```

**ESLint enforces translation usage:**

```typescript
<h1>Login</h1>  // ❌ ESLint error: Use translation key
<h1>{t("app.api.v1.core.user.public.login.title")}</h1>  // ✅ Valid
```

---

## 🧪 Testing

### Built-in Testing Utilities

```typescript
// route.test.ts
import { describe, it, expect } from "vitest";
import { loginRepository } from "./repository";

describe("Login endpoint", () => {
  it("should login successfully", async () => {
    const result = await loginRepository.login(
      { email: "test@example.com", password: "password" },
      mockUser,
      "en-GLOBAL",
      mockLogger,
    );

    expect(result.success).toBe(true);
    expect(result.data.userId).toBeDefined();
  });
});
```

### CLI Testing

```bash
# AI can test endpoints immediately
vibe user:public:login \
  --email="test@example.com" \
  --password="password"

# Output shows success/failure
# Perfect for AI to verify implementations
```

### Run Tests

```bash
vibe test              # Run all tests
vibe test --watch      # Watch mode
vibe test user/        # Test specific domain
```

---

## 📦 Sharing & Reusability

### Like shadcn/ui for Business Logic

NextVibe enables **sharing full-stack modules** (planned feature):

```bash
# Share an entire feature (coming soon)
npx nextvibe add user-management
# Copies entire user management domain:
# - API endpoints
# - Database schemas
# - React components
# - Translations
# - Tests
```

### Creating Shareable Modules

```
user-management/
├── api/
│   ├── public/
│   │   ├── login/
│   │   └── signup/
│   └── private/
│       └── me/
├── components/
│   ├── LoginForm.tsx
│   └── UserProfile.tsx
├── db.ts
├── seeds.ts
└── README.md
```

**Package and share:**

- Upload to registry
- Others install with one command
- Full ownership (code is copied, not imported)
- Modify as needed

---

## 🎓 Learning Path

### 1. **Start with Examples**

Fork the repo and explore existing endpoints:

```bash
src/app/api/[locale]/v1/core/user/public/login/
```

### 2. **Copy-Paste-Modify**

```bash
# Copy existing endpoint
cp -r src/app/api/[locale]/v1/core/user/public/login \
      src/app/api/[locale]/v1/core/user/public/signin

# Modify definition.ts, repository.ts, route.ts
# That's it!
```

### 3. **Read the Docs**

- [Endpoint Anatomy](./docs/core-concepts/endpoint-anatomy.md) - Start here
- [Recursive API Folders](./docs/core-concepts/recursive-api-folders.md) - Understand the structure
- [Client Hooks](./docs/development/client-hooks.md) - Use in React

### 4. **Run Vibe Check**

```bash
vibe check
# Fix all errors
# Learn the patterns
```

### 5. **Build Your Feature**

Follow the pattern:

1. Create folder structure
2. Write definition.ts (API contract)
3. Implement repository.ts (business logic)
4. Wire up route.ts (handler)
5. Add translations
6. Run `vibe check`
7. Test via CLI
8. Use in React

**The framework guides you. AI guides you. You can't go wrong.**

---

## 🤖 AI-First Development

### Why NextVibe is Perfect for AI Coding

1. **One Way to Do Things**
   - Recursive folder structure eliminates ambiguity
   - AI can't deviate from patterns
   - Consistent naming enforced by tooling

2. **Instant Validation**
   - `vibe check` catches everything
   - AI runs before every commit
   - Zero tolerance for warnings

3. **Self-Documenting**
   - Folder structure shows API structure
   - Translation keys map to paths
   - Types inferred from definitions

4. **Immediate Testing**
   - CLI commands for every endpoint
   - AI can verify implementations instantly
   - No need for complex test setups

5. **Error Messages Guide Fixes**
   - TypeScript errors show exact issue
   - ESLint errors suggest solutions
   - Translation errors point to missing keys

### Example AI Workflow

```bash
# 1. AI creates endpoint
AI: Creates user/admin/suspend/ folder with 3 files

# 2. AI runs validation
AI: vibe check
Output: 5 type errors, 3 lint errors

# 3. AI fixes errors
AI: Adds missing translation keys
AI: Fixes type annotations
AI: Uses proper logger pattern

# 4. AI validates again
AI: vibe check
Output: ✓ All checks passed

# 5. AI tests via CLI
AI: vibe user:admin:suspend --userId="abc-123"
Output: ✓ User suspended successfully

# 6. AI commits
AI: git add . && git commit -m "Add user suspension endpoint"
```

**The framework won't let AI make mistakes.**

---

## 🗺️ Roadmap

### ✅ Milestone 1: Core Framework (Complete)

- ✅ Recursive API architecture
- ✅ Type-safe translations
- ✅ Vibe CLI tooling
- ✅ Auto-managed database
- ✅ Comprehensive ESLint rules
- ✅ Drizzle ORM integration

### 🔄 Milestone 2: Developer Experience (In Progress)

- ✅ Endpoint generators
- ✅ Migration helpers
- 🔄 Better error messages
- 🔄 More examples
- 🔄 Interactive tutorials

### 📋 Milestone 3: React Native Support (in Progress)

- 🔄 Single codebase for Web + Native
- ✅ NativeWind integration
- ✅ Expo Router auto-generation
- 🔄 Platform-specific overrides
- 🔄 Full UI component parity

### 📋 Milestone 4: Component Colocation (Planned)

- 📋 UI components in API folders
- 📋 Auto-generated forms from definitions
- 📋 Page composition layer
- 📋 Shareable full-stack modules

### 📋 Milestone 5: Enhanced Sharing (Planned)

- 📋 Public module registry
- 📋 `npx nextvibe add [module]`
- 📋 Module versioning
- 📋 Dependency resolution

---

## 🤝 Contributing

We welcome contributions! NextVibe is built to be forked and extended.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Run `vibe check`** (must pass)
5. **Test via CLI**
6. **Submit a pull request**

### Contribution Guidelines

- Follow existing patterns (the framework enforces this)
- Add translations for all user-facing strings
- Write tests for new features
- Update documentation
- Run `vibe check` before committing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for detailed guidelines.

---

## 📄 License

**Dual License: GPL-3.0 + MIT**

NextVibe uses a dual licensing model to balance open-source contribution with flexibility:

### Framework Core (GPL-3.0-only)

**Only these directories** are licensed under **GPL-3.0-only**:

- `src/app/api/[locale]/v1/core/` - Framework core system
- `src/packages/` - Framework packages

**This means:**

- ✅ Use freely in any project (commercial or not)
- ✅ Fork and modify as needed
- ⚠️ If you distribute modifications to the core, they must be GPL-3.0
- ✅ Your application code is NOT affected by GPL

### Everything Else (MIT)

**All code outside `core/`** is licensed under **MIT**:

- `src/app/api/[locale]/v1/` (outside `core/`) - All API endpoints and logic
- `src/app/[locale]/` - All pages, layouts, UI assembly
- All components, hooks, utilities (stored in API folders)
- Database schemas, seeds, migrations
- **All Unbottled.ai code and features**

**This means:**

- ✅ Full freedom - use commercially
- ✅ Modify without restrictions
- ✅ Keep changes private
- ✅ No copyleft requirements
- ✅ Build proprietary applications

**Proprietary (Not in Code Repository):**

- ❌ Unbottled.ai logo and branding assets (not included)
- ❌ Unbottled.ai name and trademarks (proprietary)
- **Everything else in the code is MIT**

**Architecture Note:**
All logic (client and server) lives in `src/app/api/` subfolders. The `src/app/[locale]/` pages just import and assemble components from API folders. This keeps related code together and licensing clear.

### Why This Model?

- **Framework stays open** - Core improvements benefit everyone
- **Your app is yours** - Build proprietary products freely (like Unbottled.ai)
- **Best of both worlds** - Community-driven core, flexible applications
- **Sustainable development** - Commercial apps can finance open-source framework

### Example: Unbottled.ai

**Unbottled.ai is built in this same repository.** It's a commercial AI chat platform that demonstrates:

- You CAN build proprietary applications with GPL-3.0 framework core
- All Unbottled.ai code (outside `core/`) is MIT licensed
- When you fork this repo, you get both the framework AND Unbottled.ai's code
- You can study, modify, or replace Unbottled.ai's features for your own app

**What's proprietary:**

- Only Unbottled.ai logo and name (not in code repository)
- Everything else in the code is MIT

**Simple rule:** Only `core/` folder is GPL-3.0. Everything else is MIT (except logo/name).

See [LICENSE](LICENSE) for MIT license details and [src/packages/LICENSE](src/packages/LICENSE) for GPL-3.0 details.

---

## 👥 Team

**Creator & Lead Developer:**
Marcus Brandstätter ([max@a42.ch](mailto:max@a42.ch))

**AI Development Contributors:**

- Augment
- Claude Code
- Cursor

---

## 🙏 Acknowledgments

NextVibe stands on the shoulders of giants:

- **Next.js** - The best React framework
- **Drizzle ORM** - Type-safe database queries
- **tRPC** - End-to-end type safety
- **shadcn/ui** - Copy-paste component philosophy
- **Zod** - Runtime type validation
- **Bun** - Blazing fast JavaScript runtime

**Special thanks to the open-source community.**

---

## 📞 Support & Community

- **Documentation**: [./docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/techfreaque/next-vibe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/techfreaque/next-vibe/discussions)
- **Email**: <max@a42.ch>

---

## 🎯 Philosophy

**NextVibe is built on three core principles:**

1. **Ownership Over Abstraction**
   - Fork it, own it, modify it
   - No black boxes, no magic
   - You control everything

2. **AI-First, Human-Friendly**
   - One way to do things (AI can't get confused)
   - Self-documenting patterns (humans can understand)
   - Instant validation (both benefit)

3. **Type-Safety Everywhere**
   - API definitions → Types
   - Database schemas → Types
   - Translations → Types
   - CLI arguments → Types
   - Zero runtime surprises

---

**NextVibe: The AI-First Full-Stack Framework**

Fork it. Build with it. Share your creations.

---

## 🚀 Quick Links

- [Getting Started](#-quick-start)
- [Revolutionary Features](#-revolutionary-features)
- [Documentation](./docs/)
- [Vibe CLI](#%EF%B8%8F-vibe-cli)
- [Contributing](#-contributing)
- [License](#-license)

---

**Ready to build the future?**

```bash
# Fork this repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe
bun install
vibe dev
```

**Welcome to NextVibe. 🎵**

---

## About

**NextVibe** is an open-source full-stack framework (GPL-3.0) for building modern web and mobile applications with 100% type-safety.

**Unbottled.ai** is a commercial AI chat platform built with NextVibe that finances the framework's open-source development.

**Built with ❤️ by Marcus Brandstätter (Max B)**
