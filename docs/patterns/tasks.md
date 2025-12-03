# Task System Patterns

> **Part of NextVibe Framework** (GPL-3.0) - Background task processing patterns

**Implement reliable background tasks with proper concurrency control and error handling.**

---

## Table of Contents

1. [Overview](#overview)
2. [Task File Structure](#task-file-structure)
3. [Task.ts Implementation](#taskts-implementation)
4. [Side-Task.ts Implementation](#side-taskts-implementation)
5. [Task Repository Patterns](#task-repository-patterns)
6. [Task System Integration](#task-system-integration)
7. [Quality Checks](#quality-checks)
8. [Common Issues](#common-issues)

---

## Overview

NextVibe supports two types of background tasks:

**Main Tasks (task.ts)**:

- Run via pulse route in production or task runner
- Run via task runner in development
- Scheduled with cron expressions
- For batch processing, cleanup, integrations

**Side Tasks (side-task.ts)**:

- Run parallel to main server
- Continuous background operations
- For monitoring, real-time processing

**All tasks follow repository-first architecture** - see [Repository Patterns](repository.md).

---

## Task File Structure

### Standard Task Patterns

```bash
# Pattern 1: Main task (pulse route execution)
{subdomain}/
├── definition.ts          # ✅ Required - task configuration types
├── repository.ts          # ✅ Required - task business logic (see Repository Patterns)
├── task.ts               # ✅ Main task - runs via pulse route
└── route.ts              # ✅ Optional - HTTP endpoint for manual trigger

# Pattern 2: Side task (background execution)
{subdomain}/
├── definition.ts          # ✅ Required - task configuration types
├── repository.ts          # ✅ Required - task business logic (see Repository Patterns)
├── side-task.ts          # ✅ Side task - runs parallel to server
└── route.ts              # ✅ Optional - HTTP endpoint for manual trigger
```

**Cross-References**:

- See [Definition Patterns](definition.md) for type definitions
- See [Repository Patterns](repository.md) for business logic implementation
- See [Logger Patterns](logger.md) for EndpointLogger usage
- See [i18n Patterns](i18n.md) for translation keys

---

## Task.ts Implementation

### Proper task.ts Structure

```typescript
// ✅ CORRECT - Main task pattern
import "server-only";

import {
  fail,
  success,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/types/repository";

import { taskRepository } from "./repository";
import type { TaskResponseOutput } from "./types";

/**
 * Main task execution
 * runs via pulse route or task runner in production
 * Runs via task runner in development
 */
export async function executeTask(
  logger: EndpointLogger,
): Promise<ResponseType<TaskResponseOutput>> {
  logger.debug("Starting task execution");

  // Call repository for business logic (repository-first pattern)
  return await taskRepository.executeTask({}, {}, locale, logger);
}

/**
 * Task configuration
 */
export const taskConfig = {
  name: "domain-subdomain-task",
  schedule: CRON_SCHEDULES.DAILY_6AM, // Daily at 6 AM
  enabled: true,
  maxConcurrent: 1, // CRITICAL: Only one instance running
  timeout: TASK_TIMEOUTS.MEDIUM, // 5 minutes
};

/**
 * Unified Task Format
 */
const myTask: Task = {
  type: "cron",
  name: "domain-subdomain-task",
  description: "app.api.domain.subdomain.task.description",
  schedule: CRON_SCHEDULES.DAILY_6AM,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.MEDIUM,

  run: async ({ logger }) => {
    return await myTaskRepository.executeTask(logger);
  },

  onError: ({ error, logger }) => {
    logger.error("Task failed", parseError(error));
  },
};

export const tasks: Task[] = [myTask];
export default tasks;
```

**Key Points**:

- ✅ **Repository-first** - All logic in repository.ts ([Repository Patterns](repository.md))
- ✅ **EndpointLogger** - Proper logging ([Logger Patterns](logger.md))
- ✅ **Translation keys** - All text localized ([i18n Patterns](i18n.md))
- ✅ **ResponseType** - Proper error handling ([Testing Patterns](testing.md))
- ✅ **Type safety** - Types from definition.ts ([Definition Patterns](definition.md))

---

## Side-Task.ts Implementation

### Proper side-task.ts Structure

```typescript
// ✅ CORRECT - Side task pattern
import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { sideTaskRepository } from "./repository";
import type { SideTaskResponseOutput } from "./types";

/**
 * Side task execution - runs parallel to main server
 * Does not block main server operations
 */
export async function executeSideTask(
  logger: EndpointLogger,
): Promise<ResponseType<SideTaskResponseOutput>> {
  logger.info("Starting side task execution");

  // Call repository for business logic
  return await sideTaskRepository.executeSideTask({}, {}, locale, logger);
}

/**
 * Side task configuration
 */
export const sideTaskConfig = {
  name: "domain-subdomain-side-task",
  interval: 30000, // 30 seconds
  enabled: true,
  maxConcurrent: 1, // Only one instance running
  autoStart: true, // Start with server
};
```

---

## Task Repository Patterns

### Repository Pattern for Tasks

Follow [Repository Patterns](repository.md) with task-specific considerations:

```typescript
// ✅ CORRECT - Task repository pattern
import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { JwtPayloadType } from "../../../user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TaskRequestOutput, TaskResponseOutput } from "./types";

/**
 * Task Repository Interface
 */
export interface TaskRepository {
  executeTask(
    data: TaskRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<TaskResponseOutput>>;
}

/**
 * Task Repository Implementation
 */
export class TaskRepositoryImpl implements TaskRepository {
  async executeTask(
    data: TaskRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<TaskResponseOutput>> {
    try {
      logger.info("Executing task business logic");

      // Task business logic here
      const result = await this.performTaskWork(logger);

      return success({
        success: true,
        message: "Task completed successfully",
        processedItems: result.count,
      });
    } catch (error) {
      logger.error("Task execution failed", error);
      return fail({
        message: "app.api.tasks.execution.errors.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private async performTaskWork(
    logger: EndpointLogger,
  ): Promise<{ count: number }> {
    // Actual task work implementation
    logger.debug("Performing task work");
    return { count: 42 };
  }
}

export const taskRepository = new TaskRepositoryImpl();
```

**See Also**: [Repository Patterns](repository.md) for complete repository implementation guide.

---

## Task System Integration

### Environment-Specific Execution

```typescript
// ✅ CORRECT - Environment handling
// Development: Task runner executes tasks parallel to server
// Production: Pulse route executes tasks via cron

export const taskConfig = {
  name: "data-processing-task",
  schedule: CRON_SCHEDULES.HOURLY, // Every hour
  enabled:
    process.env.NODE_ENV === "production" ||
    process.env.ENABLE_TASKS === "true",
  maxConcurrent: 1,
  timeout: TASK_TIMEOUTS.LONG, // 10 minutes
};
```

### Concurrency Control

```typescript
// ✅ CORRECT - Concurrency limits
export const taskConfig = {
  name: "email-processing-task",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  enabled: true,
  maxConcurrent: 1, // CRITICAL: Only one instance
  timeout: TASK_TIMEOUTS.SHORT,
};

// ✅ CORRECT - Side task concurrency
export const sideTaskConfig = {
  name: "background-cleanup-task",
  interval: 60000, // 1 minute
  enabled: true,
  maxConcurrent: 1, // CRITICAL: Only one instance
  autoStart: true,
};
```

---

## Quality Checks

### Task Implementation Checklist

- [ ] All tasks have proper repository implementations ([Repository Patterns](repository.md))
- [ ] Task configurations include `maxConcurrent: 1`
- [ ] Proper error handling with ResponseType
- [ ] EndpointLogger usage for all logging ([Logger Patterns](logger.md))
- [ ] Environment-specific enablement
- [ ] Proper timeout configurations
- [ ] Repository interfaces and implementations
- [ ] Type imports from definition.ts ([Definition Patterns](definition.md))
- [ ] Translation keys follow path-to-key formula ([i18n Patterns](i18n.md))
- [ ] Tests use testEndpoint() pattern ([Testing Patterns](testing.md))

---

## Common Issues

### Issue 1: Translation Key Path Errors

```typescript
// ❌ WRONG - Incorrect path pattern (missing path segments)
"app.api.consultation.admin.new.errors.email_send_failed.title";

// ✅ CORRECT - Proper path pattern matching file structure
"app.api.consultation.admin.consultation.new.post.errors.email_send_failed.title";
```

**Path Structure Mapping Rules** (from [i18n Patterns](i18n.md)):

- File path: `admin/consultation/new/`
- Translation key: `admin.consultation.new.`
- NOT: `admin.new.` (missing middle path segment)

### Issue 2: Property Name Mismatches

```typescript
// ❌ WRONG - Using non-existent property
const consultationId = result.data.consultationId; // Property doesn't exist

// ✅ CORRECT - Using actual property from response type
const consultationId = result.data.id; // Property exists in response type
```

**Solution**: Verify types in [Definition Patterns](definition.md).

### Issue 3: Missing Concurrency Control

```typescript
// ❌ WRONG - No concurrency limit
export const taskConfig = {
  name: "my-task",
  schedule: "0 * * * * *",
  enabled: true,
  // Missing maxConcurrent!
};

// ✅ CORRECT - Proper concurrency control
export const taskConfig = {
  name: "my-task",
  schedule: "0 * * * * *",
  enabled: true,
  maxConcurrent: 1, // CRITICAL
  timeout: 120000,
};
```

### Issue 4: Logic in Task File (Anti-Pattern)

```typescript
// ❌ WRONG - Business logic in task.ts
export async function executeTask(logger: EndpointLogger) {
  // Don't put logic here!
  const users = await db.select().from(usersTable);
  const results = users.map((u) => processUser(u));
  return success({ processed: results.length });
}

// ✅ CORRECT - Call repository
export async function executeTask(logger: EndpointLogger) {
  // Thin wrapper - call repository
  return await taskRepository.processUsers(logger);
}
```

**See**: [Repository Patterns](repository.md) for repository-first architecture.

---

## Task vs Side-Task Decision Guide

### Use task.ts for

- ✅ **Scheduled operations** - Run at specific times/intervals
- ✅ **Data processing** - Batch processing, cleanup, reports
- ✅ **External integrations** - API syncing, data imports
- ✅ **Production cron jobs** - Must run via pulse route

### Use side-task.ts for

- ✅ **Background monitoring** - Health checks, status updates
- ✅ **Real-time processing** - Continuous background work
- ✅ **Development helpers** - File watching, auto-refresh
- ✅ **Parallel operations** - Don't block main server

---

## Critical Implementation Rules

1. **Only one instance per task type** - Always set `maxConcurrent: 1`
2. **Repository-first architecture** - All logic in repository.ts ([Repository Patterns](repository.md))
3. **Proper error handling** - Use ResponseType format
4. **Environment awareness** - Handle dev vs production differences
5. **Timeout configuration** - Prevent hanging tasks
6. **Proper logging** - Use EndpointLogger for all operations ([Logger Patterns](logger.md))
7. **Type safety** - Import types from definition.ts ([Definition Patterns](definition.md))
8. **Translation keys** - Follow path-to-key formula ([i18n Patterns](i18n.md))

---

## Quick Reference

### Task Configuration Properties

| Property          | Required           | Type    | Description               |
| ----------------- | ------------------ | ------- | ------------------------- |
| **name**          | Yes                | string  | Unique task identifier    |
| **schedule**      | Yes (task.ts)      | string  | Cron expression           |
| **interval**      | Yes (side-task.ts) | number  | Milliseconds between runs |
| **enabled**       | Yes                | boolean | Enable/disable task       |
| **maxConcurrent** | Yes                | number  | Always set to 1           |
| **timeout**       | Yes                | number  | Max execution time (ms)   |
| **autoStart**     | No (side-task.ts)  | boolean | Start with server         |

### Common Cron Schedules

```typescript
CRON_SCHEDULES.EVERY_MINUTE; // "0 * * * * *"
CRON_SCHEDULES.HOURLY; // "0 0 * * * *"
CRON_SCHEDULES.DAILY_6AM; // "0 0 6 * * *"
CRON_SCHEDULES.WEEKLY_MONDAY; // "0 0 0 * * 1"
```

### Common Timeouts

```typescript
TASK_TIMEOUTS.SHORT; // 2 minutes
TASK_TIMEOUTS.MEDIUM; // 5 minutes
TASK_TIMEOUTS.LONG; // 10 minutes
```

---

## See Also

- [Repository Patterns](repository.md) - Repository-first architecture (CRITICAL)
- [Definition Patterns](definition.md) - Type definitions and exports
- [Logger Patterns](logger.md) - EndpointLogger usage
- [i18n Patterns](i18n.md) - Translation key patterns
- [Testing Patterns](testing.md) - Testing tasks with testEndpoint()
- [Database Patterns](database.md) - Database operations in tasks
- [Vibe Check Patterns](vibe-check.md) - Quality validation
