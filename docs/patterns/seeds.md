# Seeds Patterns

Database seeding patterns and best practices for the NextVibe framework.

**Seed development, test, and production data consistently.**

---

## IMPORTANT: Seeds are Optional

**Seeds.ts files are OPTIONAL** - most endpoints don't need them. Only create seeds when you have a specific need to populate test/development data for an endpoint.

**DO NOT:**

- ❌ Create empty seeds.ts files
- ❌ Create seeds.ts "just in case"
- ❌ Auto-generate seeds for all endpoints
- ❌ Copy seed templates without actual seed data

**ONLY create seeds.ts when:**

- ✅ You have real test data to populate
- ✅ The endpoint requires specific initial data
- ✅ You're building example/demo data for development
- ✅ Integration tests need consistent data

---

## Table of Contents

1. [Seeds System Overview](#seeds-system-overview)
2. [File Structure](#file-structure)
3. [Function Signatures](#function-signatures)
4. [Logger Usage](#logger-usage)
5. [Priority System](#priority-system)
6. [Common Patterns](#common-patterns)

---

## Seeds System Overview

NextVibe uses an **optional** hierarchical seed system where:

- Seed files are **optionally** located at `src/app/api/[locale]/v1/{domain}/{subdomain}/seeds.ts`
- Each file exports `dev`, `test`, and `prod` functions with proper signatures
- All functions must use `EndpointLogger` only - no other logger types allowed
- Seeds are registered using `registerSeed(name, {dev, test, prod}, priority)`
- Priority determines execution order (higher numbers run first)
- Logger parameters are passed to all seed functions

---

## File Structure

### Location Pattern

```
src/app/api/[locale]/v1/
├── core/
│   ├── user/
│   │   └── seeds.ts          # User seeds (priority: 100)
│   ├── consultation/
│   │   └── seeds.ts          # Consultation seeds (priority: 50)
```

### Basic Seeds File Template

```typescript
/**
 * {Module} Seeds
 * Provides seed data for {module}-related tables
 */

import { registerSeed } from "next-vibe/server/db/seed-manager";
import type { EndpointLogger } from "../system/unified-interface/shared/logger/endpoint";

import type { NewEntity } from "./db";
import { entityRepository } from "./repository";

/**
 * Development seed function
 * Seeds comprehensive test data for local development
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding {module} data for development environment");

  try {
    // Seed logic here
    const result = await entityRepository.create(data, logger);
    if (result.success) {
      logger.debug("✅ Created development {module} data");
    } else {
      logger.error("Failed to create {module} data:", result.message);
    }
  } catch (error) {
    logger.error("Error seeding {module} data:", error);
  }
}

/**
 * Test seed function
 * Seeds minimal data needed for automated tests
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding {module} data for test environment");

  try {
    // Minimal test data
  } catch (error) {
    logger.error("Error seeding test {module} data:", error);
  }
}

/**
 * Production seed function
 * Seeds essential data for production initialization
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding {module} data for production environment");

  try {
    // Essential production data only
  } catch (error) {
    logger.error("Error seeding production {module} data:", error);
  }
}

// Register seeds with appropriate priority
registerSeed(
  "{module}",
  {
    dev,
    test,
    prod,
  },
  50, // Adjust priority based on dependencies
);
```

---

## Function Signatures

### Correct Signatures

```typescript
// Basic signature (most common)
export async function dev(logger: EndpointLogger): Promise<void>;
export async function test(logger: EndpointLogger): Promise<void>;
export async function prod(logger: EndpointLogger): Promise<void>;

// With locale parameter (only if actually used in function body)
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void>;
```

### When to Include Locale

**Only include `locale` parameter if:**

- You need to seed locale-specific data
- You're calling repository methods that require locale
- You're creating translations or localized content

**Don't include `locale` if:**

- Seeding universal data (UUIDs, enums, etc.)
- Repository methods don't need locale
- No locale-specific logic in seed function

---

## Logger Usage

### EndpointLogger Only

**CRITICAL**: Only `EndpointLogger` is allowed in seed files.

```typescript
// ✅ CORRECT - EndpointLogger
import type { EndpointLogger } from "../system/unified-interface/shared/logger/endpoint";

export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("Starting seed operation");
  logger.error("Operation failed:", error);
  logger.info("Seed completed");
}

// ❌ WRONG - Forbidden loggers
console.log("This is not allowed");
console.error("This is not allowed");
```

### Logger Methods

```typescript
// Debug messages (most common)
logger.debug("🌱 Seeding user data");
logger.debug("✅ Created 5 users");

// Error messages
logger.error("Failed to create user:", error);
logger.error("Database connection failed:", result.message);

// Info messages
logger.info("Seed operation completed");
```

### Error Handling Pattern

```typescript
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Starting seed operation");

  try {
    // Seed operations
    const result = await repository.create(data, logger);

    if (result.success) {
      logger.debug("✅ Successfully created data");
    } else {
      logger.error("Failed to create data:", result.message);
    }
  } catch (error) {
    logger.error("Error during seed operation:", error);
    // Don't throw - let other seeds continue
  }
}
```

---

## Priority System

### Priority Levels

Seeds execute in priority order (highest first):

```typescript
// User data (must exist first)
registerSeed("user", { dev, test, prod }, 100);

// Core system data
registerSeed("roles", { dev, test, prod }, 90);
registerSeed("permissions", { dev, test, prod }, 85);

// Business data (depends on users)
registerSeed("consultation", { dev, test, prod }, 50);
registerSeed("profile", { dev, test, prod }, 40);
registerSeed("audience", { dev, test, prod }, 30);

// Optional/supplementary data
registerSeed("analytics", { dev, test, prod }, 10);
registerSeed("cache", { dev, test, prod }, 5);
```

### Priority Guidelines

**100-90: Foundation Data**

- User accounts
- Authentication data
- System roles
- Must run first

**80-60: Core Data**

- Core business entities
- Primary relationships
- Essential configurations

**50-30: Feature Data**

- Feature-specific data
- Secondary relationships
- Business logic data

**20-1: Optional Data**

- Analytics
- Cache data
- Sample/demo data
- Performance data

---

## Common Patterns

### Checking Existing Data

```typescript
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding user data");

  try {
    // Check if data already exists
    const existing = await userRepository.findByEmail(
      "admin@example.com",
      logger,
    );

    if (existing.success && existing.data) {
      logger.debug("✅ Admin user already exists, skipping");
      return;
    }

    // Create new data
    const result = await userRepository.create(adminData, logger);
    if (result.success) {
      logger.debug("✅ Created admin user");
    }
  } catch (error) {
    logger.error("Error seeding user data:", error);
  }
}
```

### Seeding Multiple Records

```typescript
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding multiple users");

  const users = [
    { email: "user1@example.com", name: "User 1" },
    { email: "user2@example.com", name: "User 2" },
    { email: "user3@example.com", name: "User 3" },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const userData of users) {
    try {
      const result = await userRepository.create(userData, logger);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
        logger.error(
          `Failed to create user ${userData.email}:`,
          result.message,
        );
      }
    } catch (error) {
      failCount++;
      logger.error(`Error creating user ${userData.email}:`, error);
    }
  }

  logger.debug(`✅ Created ${successCount} users, ${failCount} failed`);
}
```

### Environment-Specific Data

```typescript
export async function dev(logger: EndpointLogger): Promise<void> {
  // Comprehensive test data for development
  logger.debug("🌱 Seeding comprehensive dev data");

  const devUsers = [
    // Many test users with various scenarios
    { email: "admin@example.com", role: "admin" },
    { email: "user@example.com", role: "user" },
    { email: "moderator@example.com", role: "moderator" },
    // ... more test scenarios
  ];

  // Seed all dev data
}

export async function test(logger: EndpointLogger): Promise<void> {
  // Minimal data for automated tests
  logger.debug("🌱 Seeding minimal test data");

  const testUsers = [
    // Only essential test data
    { email: "test@example.com", role: "user" },
  ];

  // Seed minimal test data
}

export async function prod(logger: EndpointLogger): Promise<void> {
  // Essential production data only
  logger.debug("🌱 Seeding essential production data");

  // Only seed critical data that MUST exist in production
  // Examples: default admin, system accounts, required configs
}
```

### Using Locale Parameter

```typescript
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  logger.debug(`🌱 Seeding localized data for ${locale}`);

  try {
    // Create locale-specific content
    const result = await contentRepository.create(
      {
        title: getLocalizedTitle(locale),
        content: getLocalizedContent(locale),
      },
      logger,
      locale,
    );

    if (result.success) {
      logger.debug(`✅ Created localized content for ${locale}`);
    }
  } catch (error) {
    logger.error(`Error seeding localized data for ${locale}:`, error);
  }
}
```

### Seeding with Dependencies

```typescript
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding consultation data (depends on users)");

  try {
    // First, get required user
    const userResult = await userRepository.findByEmail(
      "admin@example.com",
      logger,
    );

    if (!userResult.success || !userResult.data) {
      logger.error("Required user not found, skipping consultation seed");
      return;
    }

    // Now create consultation
    const consultation = {
      userId: userResult.data.id,
      title: "Sample Consultation",
      date: new Date().toISOString(),
    };

    const result = await consultationRepository.create(consultation, logger);
    if (result.success) {
      logger.debug("✅ Created consultation");
    }
  } catch (error) {
    logger.error("Error seeding consultation:", error);
  }
}
```

---

## Anti-Patterns

### ❌ Don't Use Forbidden Loggers

```typescript
// ❌ WRONG - Forbidden loggers
export async function dev(logger: EndpointLogger): Promise<void> {
  console.log("Don't use this"); // ❌ NO!
  console.error("Don't use this"); // ❌ NO!
}

// ✅ CORRECT - EndpointLogger only
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("Use this");
  logger.error("Use this");
}
```

### ❌ Don't Include Unused Parameters

```typescript
// ❌ WRONG - Locale parameter not used
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  logger.debug("Seeding data");
  // Locale is never used
}

// ✅ CORRECT - No unused parameters
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("Seeding data");
}
```

### ❌ Don't Throw Errors

```typescript
// ❌ WRONG - Throwing errors stops other seeds
export async function dev(logger: EndpointLogger): Promise<void> {
  const result = await repository.create(data, logger);
  if (!result.success) {
    throw new Error("Seed failed"); // Don't do this
  }
}

// ✅ CORRECT - Log errors and continue
export async function dev(logger: EndpointLogger): Promise<void> {
  try {
    const result = await repository.create(data, logger);
    if (!result.success) {
      logger.error("Seed failed:", result.message);
      // Continue, don't throw
    }
  } catch (error) {
    logger.error("Error during seed:", error);
    // Continue, don't throw
  }
}
```

### ❌ Don't Seed Too Much in Production

```typescript
// ❌ WRONG - Too much production data
export async function prod(logger: EndpointLogger): Promise<void> {
  // Creating 1000 test users in production
  for (let i = 0; i < 1000; i++) {
    await userRepository.create(testUser, logger);
  }
}

// ✅ CORRECT - Only essential production data
export async function prod(logger: EndpointLogger): Promise<void> {
  // Only create required system admin
  const admin = await userRepository.findByEmail("admin@company.com", logger);
  if (!admin.success) {
    await userRepository.create(adminData, logger);
  }
}
```

---

## Running Seeds

```bash
# Run all seeds for development
vibe db:seed

# Run seeds for specific environment
vibe db:seed --env=test
vibe db:seed --env=prod

# Run seeds with verbose logging
vibe db:seed --verbose
```

---

## Quick Checklist

- [ ] File located at correct path: `{subdomain}/seeds.ts`
- [ ] All three functions exported: `dev`, `test`, `prod`
- [ ] All functions use `EndpointLogger` only
- [ ] No forbidden loggers (`libDebugLogger`, `errorLogger`, etc.)
- [ ] Proper error handling with try-catch
- [ ] Logger used for all messages
- [ ] Priority set appropriately based on dependencies
- [ ] `registerSeed()` called at bottom of file
- [ ] Locale parameter only included if actually used
- [ ] No unused parameters in function signatures
- [ ] Production seeds minimal and essential only

---

## See Also

- [Repository Patterns](repository.md) - Using repositories in seeds
- [Logger Patterns](logger.md) - Logger usage
