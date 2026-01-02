# NextVibe

**The AI-First Full-Stack Framework for Next.js**

Build once, run everywhere. NextVibe is a revolutionary Next.js framework that uses a single route definition pattern to generate interfaces for **6 platforms**: Next.js API, React Hook + Cross-Platform UI (Web & React Native), CLI, tRPC, AI tools (function calling), and MCP tools.

[![License: GPL-3.0](https://img.shields.io/badge/Framework-GPL--3.0-blue.svg)](LICENSE)
[![License: MIT](https://img.shields.io/badge/App-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7_/_TSGO-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

> **Fork it. Own it. Extend it.** Like shadcn/ui but for your entire business logic + UI stack.

---

## 🎯 What is NextVibe?

NextVibe is **not a package you install** - it's a **pattern you adopt**. Fork this repository to build production-ready applications using a single Next.js-like codebase with recursive route definitions that automatically generate:

### One Definition → 6 Platforms

Write your endpoint once in `definition.ts`, and NextVibe automatically generates:

1. **🌐 Next.js API** - RESTful endpoint with full type safety
2. **⚛️ React Hook + Cross-Platform UI** - Type-safe hooks + data-driven UI for Web & React Native (iOS/Android)
3. **💻 CLI Tool** - Interactive command-line interface
4. **🔌 tRPC** - Type-safe client-server procedures
5. **🤖 AI Function Calling** - OpenAI/Anthropic compatible schema
6. **🔧 MCP Server** - Model Context Protocol for AI tools

**See it in action: [Unbottled.ai](#unbottledai-reference-application)** - A production AI chat platform built entirely with NextVibe.

---

## 🌟 Why NextVibe?

### Built for AI Collaboration

- **Forces One Way**: Recursive folder patterns eliminate ambiguity - AI can't deviate
- **vibe check** combines lint + typecheck - AI can't skip either
- **Instant CLI testing**: AI tests endpoints during development
- **100% type-safe**: Even translations, error messages, and CLI args

### Developer Experience

- **Fork, Don't Install**: Full code ownership, no black boxes
- **Auto-managed Database**: Docker + PostgreSQL + migrations handled automatically
- **One Command Setup**: `vibe dev` does everything
- **Cross-platform by Default**: Web + Mobile from the same code
- **Zero Configuration Routing**: Folder structure IS your API

---

## 🚀 Quick Start

### Prerequisites

```bash
- Bun 1.3.0+ (recommended) or Node.js 20+
- Docker (auto-managed in dev mode)
```

### Get Started in 3 Commands

```bash
# 1. Fork this repository on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe

# 2. Install dependencies
bun install

# 3. Start development (auto-manages everything)
vibe dev
```

That's it! NextVibe automatically:

- ✅ Starts PostgreSQL in Docker (if not running)
- ✅ Creates database and runs migrations
- ✅ Seeds development data
- ✅ Starts Next.js dev server on http://localhost:3000
- ✅ Starts cron task runner
- ✅ Watches for changes and regenerates types

**📚 [Full Quick Start Guide →](docs/guides/quickstart.md)**

---

## 🎨 The Definition Pattern

### Write Once, Run Everywhere

Here's a REAL example from the codebase - the login endpoint definition:

```typescript
// src/app/api/[locale]/user/public/login/definition.ts (simplified for clarity)
import { z } from "zod";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  Methods,
  WidgetType,
  FieldDataType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "public", "login"],
  title: "app.api.user.public.login.title",
  description: "app.api.user.public.login.description",

  fields: objectField(
    { type: WidgetType.CONTAINER },
    { request: "data", response: true },
    {
      // Request fields
      credentials: objectField(
        { type: WidgetType.CONTAINER },
        { request: "data" },
        {
          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.user.public.login.fields.email.label",
            },
            z.string().email(),
          ),
          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label: "app.api.user.public.login.fields.password.label",
            },
            z.string().min(1),
          ),
        },
      ),

      // Response fields
      success: responseField({ type: WidgetType.BADGE }, z.boolean()),
      message: responseField({ type: WidgetType.TEXT }, z.string()),
      user: objectField(
        { type: WidgetType.CONTAINER },
        { response: true },
        {
          id: responseField({ type: WidgetType.TEXT }, z.string()),
          email: responseField({ type: WidgetType.TEXT }, z.string()),
          privateName: responseField({ type: WidgetType.TEXT }, z.string()),
        },
      ),
    },
  ),
});

export default { POST };
```

### What This Automatically Generates

#### 1. 🌐 Next.js API Endpoint

```bash
POST /api/en-GLOBAL/user/public/login
```

#### 2. ⚛️ React Hook + Cross-Platform UI (Web & Mobile)

**REAL code from `src/app/api/[locale]/user/public/login/_components/login-form.tsx`:**

```typescript
"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointRenderer";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useLogin } from "@/app/api/[locale]/user/public/login/hooks";
import loginEndpoints from "@/app/api/[locale]/user/public/login/definition";

export function LoginForm({ locale }) {
  const logger = createEndpointLogger(false, Date.now(), locale);
  const loginResult = useLogin({
    allowPasswordAuth: true,
    allowSocialAuth: false,
  }, logger);

  const { form, onSubmit, isSubmitting } = loginResult.create || {};
  const { isAccountLocked, loginOptions, alert } = loginResult;

  return (
    <Card>
      <CardContent className="mt-6">
        {alert && <FormAlert alert={alert} className="mb-6" />}

        {/* Data-driven UI: Automatically renders ALL form fields */}
        <EndpointRenderer
          endpoint={loginEndpoints.POST}
          form={form}
          onSubmit={onSubmit}
          locale={locale}
          isSubmitting={isSubmitting || isAccountLocked || !loginOptions.allowPasswordAuth}
          submitButtonText="app.user.other.login.auth.login.signInButton"
        >
          <Div className="space-y-4">
            <Link href={`/${locale}/user/reset-password`}>
              {t("app.user.other.login.auth.login.forgotPassword")}
            </Link>
          </Div>
        </EndpointRenderer>
      </CardContent>
    </Card>
  );
}
```

**Key points:**

- `next-vibe-ui/ui/*` components work on **both Web (Next.js) and React Native**
- Platform resolution happens via TypeScript path mapping in `tsconfig.json`
- `EndpointRenderer` automatically generates the entire form from the definition
- Same JSX code runs on web and mobile with zero changes

#### 3. 💻 CLI Command

```bash
vibe user:public:login \
  --credentials.email="test@example.com" \
  --credentials.password="password123"

# Output:
# ✓ Login successful
# {
#   "success": true,
#   "message": "Welcome back!",
#   "user": { "id": "...", "email": "test@example.com", ... }
# }
```

#### 4. 🔌 tRPC Procedure

```typescript
// Automatic type-safe RPC
const result = await trpc.user.public.login.mutate({
  credentials: {
    email: "test@example.com",
    password: "password123",
  },
  options: {
    rememberMe: true,
  },
});
```

#### 5. 🤖 AI Tool (Function Calling)

```typescript
// Automatic AI tool schema for chat integration
{
  name: "user_public_login",
  description: "Authenticate user with email and password",
  parameters: {
    type: "object",
    properties: {
      credentials: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" }
        }
      }
    }
  }
}
```

#### 6. 🔧 MCP Tool

```typescript
// Model Context Protocol tool for AI development
{
  name: "mcp__vibe__user_public_login_POST",
  description: "User login endpoint",
  inputSchema: { /* Auto-generated from definition */ }
}
```

**One definition.ts file. Six complete implementations. Zero duplication.**

**📚 [Deep dive into definitions →](docs/patterns/definition.md)**

---

## 🏗️ Unbottled.ai: Reference Application

**Unbottled.ai** is a production AI chat platform built entirely with NextVibe, demonstrating every framework feature in a real commercial application.

### Live Features

🤖 **AI Chat Platform**

- Multi-model AI chat (Claude, GPT, Gemini, DeepSeek, and 30+ models)
- AI agent chat with function calling
- Branching conversations with message trees
- Persona system for customized AI behavior
- Speech-to-text and text-to-speech
- MCP (Model Context Protocol) tool integration

💼 **Lead Generation System**

- Automated email campaigns with journey-based workflows
- CSV import with batch processing
- Lead tracking and engagement analytics
- SMTP/IMAP email client integration
- SMS notifications via Twilio

👥 **User Management**

- Authentication with JWT + NextAuth
- Role-based access control (public, customer, admin)
- User profiles with avatar uploads
- Email verification workflows
- Password reset flows

💳 **Payment Processing**

- Subscription management with Stripe and NowPayments
- Credit system for AI usage
- Referral program with earnings tracking
- Invoice generation

📧 **Communication**

- React Email templates with tracking pixels
- SMTP client with multiple account support
- IMAP email reading and folder management
- Email campaign automation

🔧 **Admin Tools**

- Data-driven admin panels
- Database studio (Drizzle Studio integration)
- System health monitoring
- Cron task management
- Translation management

### Technical Implementation

**Generated Interfaces:**

- **200+ API endpoints** each generating 7+ platform interfaces
- **Web app** running on Next.js with full SSR
- **CLI tools** for database management, email sending, user creation
- **tRPC procedures** for type-safe client-server communication
- **React hooks** auto-generated for all endpoints
- **AI tools** with function calling for chat agents
- **MCP tools** for AI development workflow

**Database Architecture:**

- PostgreSQL with Drizzle ORM
- 50+ tables with proper relationships
- Automatic migrations from schema changes
- Seed data for development/testing

**Codebase Stats:**

- Single Next.js-like codebase
- Full type safety across 200,000+ lines
- Zero runtime type errors
- All translations type-checked (en, de, pl)

### Key Patterns Demonstrated

1. **Recursive API Architecture**: Folder structure defines the entire API
2. **Repository-First**: All business logic in type-safe repositories
3. **Email Integration**: React Email templates with translation support
4. **Task System**: Cron jobs and background processing
5. **Enum Patterns**: Database-safe enums with translations
6. **i18n**: Type-safe translations across 3 languages

**📚 [Explore Unbottled.ai architecture →](docs/examples/unbottled-ai/UNBOTTLED_AI.md)**

---

## 🛠️ Core Concepts

### 1. Recursive API Architecture

Your folder structure **IS** your API. No routing configuration needed.

```
src/app/api/[locale]/
├── user/
│   ├── public/
│   │   ├── login/
│   │   │   ├── definition.ts    # API contract
│   │   │   ├── repository.ts    # Business logic
│   │   │   ├── route.ts         # Auto-generates all interfaces
│   │   │   ├── hooks.ts         # React hooks (optional)
│   │   │   └── i18n/            # Translations
│   │   └── signup/
│   └── private/
│       └── me/
```

Delete a folder = delete the feature across ALL platforms.

### 2. Cross-Platform UI Components

**Platform-independent components via TypeScript path mapping:**

```typescript
// Import from next-vibe-ui/ui/* - works on Web AND React Native
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Card } from "next-vibe-ui/ui/card";
import { Link } from "next-vibe-ui/ui/link";

// tsconfig.json resolves to platform-specific implementation:
// - Web build: ./src/packages/next-vibe-ui/web/ui/*
// - Native build: ./src/packages/next-vibe-ui/native/ui/*
```

**The same JSX works everywhere:**

```typescript
// This exact code runs on Next.js AND React Native
export function MyComponent() {
  return (
    <Div className="flex-1 items-center">
      <Card>
        <Button onPress={() => console.log("works!")}>
          Click Me
        </Button>
      </Card>
    </Div>
  );
}
```

### 3. Type-Safe Everything

**Even your translations are type-checked:**

```typescript
t("app.api.user.public.login.title"); // ✅ Valid
t("app.invalid.key"); // ❌ TypeScript error at compile time
```

ESLint enforces translation usage - no hardcoded strings allowed.

**📚 [i18n patterns →](docs/patterns/i18n.md)**

### 4. Repository-First Architecture

All business logic lives in repositories with standard interfaces:

```typescript
// repository.ts - Real pattern from codebase
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

export class LoginRepository {
  async login(
    data: { credentials: { email: string; password: string } },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: string; user: User }>> {
    logger.info("Login attempt", { email: data.credentials.email });

    // Business logic here

    return success({
      success: true,
      message: "Welcome back!",
      user: {
        /* user data */
      },
    });
  }
}
```

**📚 [Database patterns →](docs/patterns/database.md)**

### 5. AI-Optimized Tooling

Traditional approach (AI might skip one):

```bash
npm run lint      # AI might skip
npm run typecheck # Or skip this
```

NextVibe approach (AI can't ignore):

```bash
vibe check
vibe check src/path/to/folder/or/file
# ✅ Runs BOTH lint + typecheck in one command
# ✅ Extensive ESLint rules enforce patterns
# ✅ Type-checks translations, schemas, everything
# ✅ Zero warnings tolerance
```

### 6. Auto-Managed Database

```bash
vibe dev
# ✅ Detects if PostgreSQL is running
# ✅ Starts it via Docker if not running
# ✅ Creates database if missing
# ✅ Runs all pending migrations
# ✅ Seeds development data
# ✅ Starts Next.js dev server
```

**📚 [Database patterns →](docs/patterns/database.md)**

---

## 💻 Vibe CLI

Your development Swiss Army knife:

```bash
# Development
vibe dev                    # Start dev server (auto-manages DB)
vibe check                  # Run lint + typecheck together
vibe check src/path         # Check specific folder

# Database
vibe migrate                # Run migrations
vibe migrate --generate     # Generate migration from schema changes
vibe seed                   # Seed database
vibe reset                  # Drop DB + migrate + seed
vibe studio                 # Open Drizzle Studio (DB GUI)
vibe ping                   # Check database connection

# Code Quality
vibe lint                   # Linting only
vibe lint --fix             # Fix auto-fixable issues
vibe typecheck              # Type checking only
vibe test                   # Run tests

# Testing Endpoints
vibe user:public:login \
  --credentials.email="test@example.com" \
  --credentials.password="password123"

# Payment Providers
vibe stripe check           # Check if Stripe CLI is installed
vibe stripe listen          # Start webhook forwarding
vibe nowpayments tunnel     # Start NowPayments tunnel

# Production
vibe build                  # Build for production
vibe start                  # Start production server
```

---

## 🏗️ Tech Stack

**Frontend:**

- Next.js 16 (App Router)
- React 19
- TypeScript 7 / TSGO
- Tailwind CSS 4 / NativeWind 5
- shadcn/ui + react-native-reusables

**Backend:**

- Next.js API Routes
- tRPC 11 (auto-generated)
- PostgreSQL + Drizzle ORM
- Zod validation

**Developer Experience:**

- Bun runtime
- Vibe CLI (custom tooling)
- ESLint with custom rules
- Automatic type generation

---

## 📚 Documentation

- **[Documentation Index](docs/README.md)** - Complete documentation guide
- **[Quick Start](docs/guides/quickstart.md)** - Get up and running
- **[Endpoint Definitions](docs/patterns/definition.md)** - Define your APIs
- **[Database Patterns](docs/patterns/database.md)** - Drizzle ORM and schemas
- **[i18n Patterns](docs/patterns/i18n.md)** - Type-safe translations
- **[Logger Patterns](docs/patterns/logger.md)** - Proper logging
- **[Unbottled.ai Example](docs/examples/unbottled-ai/UNBOTTLED_AI.md)** - Full commercial application

---

## 🗺️ Roadmap

### ✅ Milestone 1: Core Framework (Complete)

- ✅ Recursive API architecture
- ✅ Type-safe translations
- ✅ Vibe CLI tooling
- ✅ Auto-managed database

### 🔄 Milestone 2: Developer Experience (In Progress)

- ✅ Endpoint generators
- ✅ Migration helpers
- 🔄 Better error messages

### 📋 Milestone 3: React Native Support (In Progress)

- 🔄 Single codebase for Web + Native
- ✅ NativeWind integration
- ✅ Expo Router auto-generation
- 🔄 Full UI component parity

---

## 📄 License

**Dual License: GPL-3.0 + MIT**

### Framework Core (GPL-3.0)

`src/app/api/[locale]/` + `src/packages/` are GPL-3.0:

- ✅ Use freely in any project
- ✅ Fork and modify as needed
- ⚠️ Distribute modifications under GPL-3.0

### Everything Else (MIT)

All other code is MIT licensed:

- ✅ Full freedom - use commercially
- ✅ Modify without restrictions
- ✅ Keep changes private
- ✅ Build proprietary applications

See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `vibe check` (must pass with 0 errors, 0 warnings)
5. Submit a pull request

---

## 👥 Team

**Creator & Lead Developer:**
Marcus Brandstätter ([max@a42.ch](mailto:max@a42.ch))

**AI Development Contributors:**

- Augment
- Claude Code
- Cursor

---

## 📞 Support & Community

- **Documentation**: [./docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/techfreaque/next-vibe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/techfreaque/next-vibe/discussions)
- **Email**: <max@a42.ch>

---

## 🚀 Ready to Build?

```bash
# Fork this repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe
bun install
vibe dev
```

**Welcome to NextVibe. 🎵**
