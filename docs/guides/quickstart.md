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

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration, the '.env.example' file contains all the environment variables you need to and what they are used for.

### 4. Start Development Server

```bash
vibe dev
```

This single command will:

- ✅ Start PostgreSQL in Docker (if not running)
- ✅ Create database if missing
- ✅ Run migrations
- ✅ Seed development data
- ✅ Start Next.js dev server on http://localhost:3000
- ✅ Start cron task runner

---

## Common Commands

### Development

```bash
vibe dev                    # Start dev server (auto-manages everything)
vibe check                  # Run lint + typecheck (AI's best friend)
vibe check src/path         # Check specific folder
bun run dev                 # Alternative: Start Next.js only (manual DB)
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

### Production

```bash
vibe build                  # Build for production
vibe start                  # Start production server
```

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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  Methods,
  WidgetType,
  FieldDataType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["hello", "world"],
  title: "app.api.hello.world.post.title",
  description: "app.api.hello.world.post.description",

  fields: objectField(
    { type: WidgetType.CONTAINER },
    { request: "data", response: true },
    {
      name: requestField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.hello.world.post.name.label",
        },
        z.string().min(1),
      ),
      message: responseField({ type: WidgetType.TEXT }, z.string()),
    },
  ),
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
- 🔌 tRPC procedure: `trpc.hello.world.mutate({ name: "John" })`
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

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000    # Windows (find PID, then taskkill)
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
