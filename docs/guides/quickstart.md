# Quick Start

Get up and running with NextVibe in 5 minutes.

---

## Prerequisites

Before you begin, ensure you have:

- **Bun** 1.3.0+ (recommended) or **Node.js** 20+
- **Docker** (optional, for auto-managed database)
- **Git** for version control

### Installing Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Docker (Optional but Recommended)

NextVibe can automatically manage PostgreSQL via Docker. If you prefer manual database setup, skip this step.

```bash
# macOS
brew install --cask docker

# Linux
sudo apt-get install docker.io docker-compose

# Windows
# Download from https://www.docker.com/products/docker-desktop
```

---

## Installation Steps

### 1. Fork and Clone

```bash
# Fork this repository on GitHub, then clone your fork:
git clone https://github.com/YOUR_USERNAME/next-vibe
cd next-vibe
```

### 2. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 3. First-Run Setup

**Option A - Web UI (recommended for new users):**

```bash
vibe dev
```

Start the dev server, then open http://localhost:3000 and log in with the default admin credentials (`admin@example.com` / `change-me-now`). You'll be redirected automatically to the Settings page where the setup wizard walks you through configuration step by step.

**Option B - CLI wizard:**

```bash
vibe init
```

Runs the interactive terminal wizard directly:

1. **Admin Account** - email + password
2. **Database** - PostgreSQL connection URL
3. **Security Keys** - JWT secret + cron secret (auto-generated, confirm or replace)
4. **AI Provider** - OpenRouter API key (get free at openrouter.ai/keys) and/or Claude Code (auto-detects if `claude` CLI is installed)

Sensitive values are encrypted at rest. After the wizard, `.env` is written and you're ready to go.

You can also edit `.env` directly - `.env.example` documents every variable. Use `vibe system-settings` to view the current config with health indicators.

### 4. Start Development Server

```bash
vibe dev                        # TanStack/Vite (default)
vibe dev --framework=next       # Next.js dev server
```

This single command will:

- ✅ Start PostgreSQL in Docker (if not running)
- ✅ Create database if missing
- ✅ Run migrations
- ✅ Seed development data
- ✅ Start dev server on http://localhost:3000
- ✅ Start cron task runner

---

## Common Commands

### Development

```bash
vibe dev                        # Start dev server - TanStack/Vite (default)
vibe dev --framework=next       # Start dev server - Next.js
vibe check                      # Run lint + typecheck (AI's best friend)
vibe check src/path             # Check specific folder
bun run dev                     # Alternative: Start Next.js only (manual DB)
```

### Database

```bash
vibe migrate --generate     # Generate migration from schema changes
vibe migrate                # Run pending migrations
vibe seed                   # Seed database with dev data
vibe reset                  # Drop DB + migrate + seed (fresh start)
vibe ping                   # Check database connection
vibe studio                 # Open Drizzle Studio (DB GUI)
```

### Code Quality

```bash
vibe check                  # Run lint + typecheck together
vibe lint                   # Linting only
vibe lint --fix             # Fix auto-fixable issues
vibe typecheck              # Type checking only
vibe test                   # Run tests
vibe test --watch           # Watch mode
```

### Configuration & Setup

```bash
vibe init                   # Run interactive setup wizard (wizard auto-starts if no .env)
vibe system-settings        # View all settings with health indicators (read-only)
```

### Production

```bash
vibe build                          # Build Next.js for production
vibe build --framework=tanstack     # Build TanStack/Vite (→ .dist-tanstack/)
vibe start                          # Start Next.js production server
vibe start --framework=tanstack     # Start TanStack production server
vibe rebuild                        # Rebuild & hot-restart (zero-downtime, Next.js only)
```

`vibe rebuild` regenerates code, builds Next.js, runs migrations, and hot-restarts the running `vibe start` process - zero downtime.

### React Native (Milestone 3 - In Progress)

```bash
bun native                  # Start Expo dev server
bun native:android          # Run on Android
bun native:ios              # Run on iOS (macOS only)
bun native:reset            # Clear cache and start
```

---

## Your First Endpoint

Let's create a simple endpoint to understand the pattern.

### 1. Create Folder Structure

```bash
mkdir -p src/app/api/[locale]/hello/world
cd src/app/api/[locale]/hello/world
```

### 2. Create `definition.ts`

```typescript
// src/app/api/[locale]/hello/world/definition.ts
import { z } from "zod";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  Methods,
  WidgetType,
  FieldDataType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["hello", "world"],
  title: "post.title",
  description: "post.description",

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { request: "data", response: true },
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label",
        schema: z.string().min(1),
        columns: 12,
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.message.content",
        schema: z.string(),
      }),
    },
  }),
});

export default { POST };
```

### 3. Create `repository.ts`

```typescript
// src/app/api/[locale]/hello/world/repository.ts
import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export class HelloRepository {
  static async sayHello(
    data: { name: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ message: string }>> {
    logger.info("Processing hello world request", {
      name: data.name,
      userId: user.id,
    });

    return success({
      message: `Hello, ${data.name}! Welcome to NextVibe.`,
    });
  }
}
```

### 4. Create `route.ts`

```typescript
// src/app/api/[locale]/hello/world/route.ts
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { HelloRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) =>
      await HelloRepository.sayHello(data, user, locale, logger),
  },
});
```

### 5. Add Translations

Create `i18n/en/index.ts` in the same folder:

```typescript
// src/app/api/[locale]/hello/world/i18n/en/index.ts
export const translations = {
  post: {
    title: "Say Hello",
    description: "A simple hello endpoint",
    name: {
      label: "Your Name",
    },
    message: {
      content: "Response message",
    },
  },
};
```

### 6. Test Your Endpoint

```bash
# Via CLI
vibe hello_world --name="John"

# Output:
# Hello, John! Welcome to NextVibe.
```

**That's it!** You now have:

- 🌐 API endpoint: `POST /api/en-GLOBAL/hello/world`
- 💻 CLI command: `vibe hello:world --name="John"`
- 🔌 tRPC procedure: `trpc.hello.world.mutate({ name: "John" })` _(opt-in - run the tRPC generator to enable)_
- ⚛️ React hook: `useEndpoint(definitions)`

---

## Next Steps

### Learn the Patterns

- **[Endpoint Definitions](../patterns/definition.md)** - Master the definition pattern
- **[Database Patterns](../patterns/database.md)** - Work with Drizzle ORM
- **[i18n Patterns](../patterns/i18n.md)** - Type-safe translations
- **[Logger Patterns](../patterns/logger.md)** - Proper logging

### Explore the Example

- **[Unbottled.ai](../examples/unbottled-ai/UNBOTTLED_AI.md)** - Full commercial application built with NextVibe

### Build Your Feature

1. Create folder structure for your domain
2. Define API contract in `definition.ts`
3. Implement business logic in `repository.ts`
4. Wire up handler in `route.ts`
5. Add translations
6. Run `vibe check`
7. Test via CLI
8. Use in React

---

## Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
vibe dev

# reset dev db with
vibe dev -r
```

### TypeScript Errors

```bash
vibe check
```

---

## Additional Resources

- **[Main README](../../README.md)** - Framework overview
- **[Documentation Index](../README.md)** - All documentation
- **[Debugging Guide](./debugging.md)** - Debug techniques
- **[Contributing](../../CONTRIBUTING.md)** - Contribution guidelines

---

**Ready to build?** Start creating your first feature!
