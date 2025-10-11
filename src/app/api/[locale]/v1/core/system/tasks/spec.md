# Task System Specification

## Overview

Unified task management system supporting existing cron.ts patterns (renamed to task.ts):

1. **Cron Tasks** - Scheduled tasks using existing CronTaskDefinition pattern
2. **Side Tasks** - Long-running background processes
3. **Task Runner** - Single unified runner that executes both cron tasks and side tasks

## Architecture (MIGRATION_GUIDE.md Compliant)

```text
src/app/api/[locale]/v1/core/system/tasks/
├── enum.ts                    # Domain enums using createEnumOptions
├── db.ts                      # Shared database enums
└── {subdomain}/              # Each subdomain:
    ├── definition.ts         # API endpoints
    ├── repository.ts         # Business logic (MANDATORY)
    ├── route.ts              # Route handlers
    |── enums.ts              # Subdomain enums (if not shared)
    └── i18n/en/api.ts        # Translations

src/app/api/[locale]/v1/core/system/generated/
└── tasks-index.ts            # Auto-generated task registry

src/app/api/[locale]/v1/core/system/generators/
└── generate-all              # Task index generator
```

**Task Discovery**: Automatically discovers from:

- `task.ts` files (renamed from `cron.ts`) exporting `taskDefinition`, `execute`, `validate`, `rollback`
- Side tasks defined within the task system configuration
- Generated via `src/app/api/[locale]/v1/core/system/generators/generate-all`
- Maintains compatibility with existing CronTaskDefinition interface
- Single unified task runner manages execution of both task types

## Task Types

### 1. Cron Tasks (Existing Pattern)

**Supports existing CronTaskDefinition interface in task.ts files**:

```typescript
export const taskDefinition: CronTaskDefinition<ConfigType, ResultType> = {
  name: "task-name",
  description: "Task description",
  schedule: "*/5 * * * *",        // Cron expression string
  // OR
  schedule: async () => {         // Function returning ResponseType<boolean>
    return createSuccessResponse(shouldRunNow);
  },
  enabled: true,
  timeout: 300000,                // 5 minutes
  priority: CronTaskPriority.MEDIUM,
  defaultConfig: { /* config */ },
  configSchema: taskConfigSchema,
  resultSchema: taskResultSchema,
  tags: ["category"],
  dependencies: ["other-task"]
};

export async function execute(context: TaskExecutionContext<ConfigType>): Promise<ResponseType<ResultType>> {
  // Task implementation
}
```

### 2. Side Tasks

**Long-running background processes**:

```typescript
// Side tasks are configured within the task system
interface SideTask {
  type: "side";
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  priority: CronTaskPriorityType;
  run: (signal: AbortSignal) => Promise<void>;
  onError?: (error: Error) => Promise<void>;
  onShutdown?: () => Promise<void>;
}

// Example side task configuration
export const sideTaskConfigs: SideTask[] = [
  {
    type: "side",
    name: "file-watcher",
    description: "Watches for file changes",
    category: "monitoring",
    enabled: true,
    priority: "MEDIUM",
    run: async (signal: AbortSignal) => {
      while (!signal.aborted) {
        // File watching logic
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    },
    onShutdown: async () => {
      // Cleanup file watchers
    }
  }
];
```

### 3. Task Runner (Single Unified Runner)

**Single runner that executes both cron tasks and side tasks**:

- Manages scheduling and execution of cron tasks
- Handles long-running side tasks with AbortSignal support
- **Prevents task overlap**: Only one instance of each task type runs at a time
- **Task collision handling**: Skips execution if previous instance still running
- Provides unified monitoring and health checks
- Handles graceful shutdown for all task types

**Execution Flow**:

- **Development (`vibe dev`/`vibe start`)**: Task runner starts in parallel with Next.js server
- **Production (self-hosted)**: Task runner runs continuously alongside server
- **Serverless (Vercel)**: Pulse route triggers cron tasks only (no side tasks)

## Core Features

### Enums (MIGRATION_GUIDE.md Compliant)

```typescript
// Using createEnumOptions pattern
export const { enum: CronTaskPriority, options: CronTaskPriorityOptions } =
  createEnumOptions({
    CRITICAL: "tasks.priority.critical" as const,
    HIGH: "tasks.priority.high" as const,
    MEDIUM: "tasks.priority.medium" as const,
    LOW: "tasks.priority.low" as const,
    BACKGROUND: "tasks.priority.background" as const
  });

export const { enum: CronTaskStatus, options: CronTaskStatusOptions } =
  createEnumOptions({
    PENDING: "tasks.status.pending" as const,
    RUNNING: "tasks.status.running" as const,
    COMPLETED: "tasks.status.completed" as const,
    FAILED: "tasks.status.failed" as const,
    TIMEOUT: "tasks.status.timeout" as const,
    CANCELLED: "tasks.status.cancelled" as const,
    SKIPPED: "tasks.status.skipped" as const,      // Skipped due to overlap
    BLOCKED: "tasks.status.blocked" as const       // Blocked by running instance
    // ... other statuses
  });
```

### Task Registry & Discovery

Auto-generated at `src/app/api/[locale]/v1/core/system/generated/tasks-index.ts` from discovered task.ts files:

```typescript
export const taskRegistry: TaskRegistry = {
  cronTasks: CronTask[],
  sideTasks: SideTask[],
  allTasks: Task[],
  tasksByCategory: Record<string, Task[]>,
  tasksByName: Record<string, Task>,
  taskRunner: TaskRunner  // Single unified runner
};
```

**Generation Process**:

- Run via `src/app/api/[locale]/v1/core/system/generators/generate-all`
- Scans for task.ts files across the codebase
- Discovers side task configurations
- Validates task definitions for type safety
- Generates consolidated registry with single unified task runner
- Ensures proper TypeScript types throughout

### Error Handling & Monitoring

- **Retry Logic**: Configurable attempts (default: 3) with exponential backoff
- **Health Monitoring**: Pulse system tracks success rates, execution times, failures
- **Error Types**: Timeout, execution, system, dependency, configuration errors
- **Recovery**: Automatic retry for transient failures, manual retry capabilities
- **Overlap Prevention**: Tasks skipped if previous instance still running
- **Execution Tracking**: Maintains running task registry to prevent collisions
- **Dependency Management**: Tasks can depend on other tasks completing successfully
- **Graceful Shutdown**: Proper cleanup of running tasks and side tasks on system shutdown

## API Endpoints

### CLI Commands (MIGRATION_GUIDE.md Compliant)

```bash
# Cron tasks
vibe core:system:tasks:cron:tasks           # List cron tasks
vibe core:system:tasks:cron:history         # View execution history
vibe core:system:tasks:cron:stats           # View statistics

# Pulse system (serverless execution)
vibe core:system:tasks:pulse:execute        # Execute pulse (cron tasks only)
vibe core:system:tasks:pulse:status         # Check pulse status

# Unified runner (development/production)
vibe core:system:tasks:unified-runner       # Manage task runner

# Task types
vibe core:system:tasks:types                # View type definitions
```

**Execution Environments**:

- **Development**: `vibe dev` starts task runner + Next.js server in parallel
- **Production**: `vibe start` starts task runner + Next.js server in parallel
- **Serverless**: Pulse route executes cron tasks only (no continuous side tasks)

**CLI Testing Requirements**:

- ✅ **EVERY route MUST be tested via CLI** before considered complete
- ✅ **CLI must execute successfully** with proper response
- ✅ **Use interactive mode** when no arguments provided

## Database Schema

**Core Tables**: `cron_tasks`, `cron_task_executions`, `side_tasks`, `task_runner_state`

```sql
-- Task priority and status enums
CREATE TYPE task_priority AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'BACKGROUND');
CREATE TYPE task_status AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'TIMEOUT', 'CANCELLED', 'SKIPPED', 'BLOCKED');

-- Main cron tasks table with execution tracking and statistics
CREATE TABLE cron_tasks (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  schedule TEXT,                 -- Cron expression string (nullable for function-based schedules)
  schedule_function TEXT,        -- Function name for dynamic scheduling
  enabled BOOLEAN DEFAULT true,
  priority task_priority NOT NULL,
  timeout INTEGER DEFAULT 300000,
  retries INTEGER DEFAULT 3,
  -- Execution tracking, statistics, metadata columns...
);

-- Individual execution records
CREATE TABLE cron_task_executions (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES cron_tasks(id),
  status task_status NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  config JSONB NOT NULL,
  result JSONB,
  error JSONB,
  skipped_reason TEXT,           -- Reason if skipped (e.g., "previous_instance_running")
  execution_environment TEXT    -- "development", "production", "serverless"
);

-- Side tasks table
CREATE TABLE side_tasks (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  priority task_priority NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Task runner state tracking
CREATE TABLE task_runner_state (
  id UUID PRIMARY KEY,
  task_name TEXT NOT NULL,
  task_type TEXT NOT NULL,        -- "cron" or "side"
  status task_status NOT NULL,
  started_at TIMESTAMP NOT NULL,
  environment TEXT NOT NULL,
  runner_instance_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## Implementation Requirements (MIGRATION_GUIDE.md Compliance)

### File Structure Standards

- **Task files**: `task.ts` (renamed from `cron.ts`) - no separate task-runner.ts files needed
- **Subdomain structure**: Each has `definition.ts`, `repository.ts`, `route.ts`, `i18n/en/api.ts`
- **Business logic**: ALL in `repository.ts` files (MANDATORY)
- **Enums**: Use `createEnumOptions` pattern with translation keys
- **Field definitions**: Use field utilities with proper enum handling (`z.nativeEnum(EnumName)`)
- **Type Safety**: Everything must be fully type-safe with proper TypeScript types
- **Task Index**: Generated at `src/app/api/[locale]/v1/core/system/generated/tasks-index.ts`
- **Single Runner**: One unified task runner handles both cron tasks and side tasks

### Quality Requirements

- ✅ **EVERY route MUST be tested via CLI** before considered complete
- ✅ **ZERO errors allowed** - both ESLint and TypeScript must pass completely
- ✅ **Run `vibe check src/app/api/[locale]/v1/core/system/tasks/{subdomain}`** for each subdomain
- ✅ **ALL user-facing strings MUST use t() function** with proper locale parameter

### Configuration Management

**Environment Variables**:

```typescript
// Task system configuration
interface TaskSystemConfig {
  TASK_RUNNER_ENABLED: boolean;           // Enable/disable task runner
  TASK_RUNNER_ENVIRONMENT: "development" | "production" | "serverless";
  TASK_DEFAULT_TIMEOUT: number;           // Default task timeout (ms)
  TASK_DEFAULT_RETRIES: number;           // Default retry attempts
  TASK_OVERLAP_PREVENTION: boolean;       // Enable overlap prevention
  PULSE_INTERVAL: number;                 // Pulse execution interval (ms)
  SIDE_TASKS_ENABLED: boolean;            // Enable side tasks (false for serverless)
}
```

**Runtime Configuration**:

- Tasks can be enabled/disabled without code changes
- Timeout and retry settings configurable per environment
- Overlap prevention can be toggled for testing
- Side tasks automatically disabled in serverless environments

### Task Interface Support

**Existing CronTaskDefinition pattern** (in task.ts files):

```typescript
export const taskDefinition: CronTaskDefinition<ConfigType, ResultType> = {
  name: "task-name",
  schedule: "*/5 * * * *",        // Cron expression string
  // OR
  schedule: async (): Promise<ResponseType<boolean>> => {
    // Dynamic scheduling logic
    return createSuccessResponse(shouldRunNow);
  },
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  // ... other properties (all type-safe)
};

export async function execute(context: TaskExecutionContext<ConfigType>): Promise<ResponseType<ResultType>> {
  // Type-safe implementation
}
```

**Single Task Runner** (unified system runner):

```typescript
// Single unified task runner that handles both cron tasks and side tasks
interface TaskRunner {
  name: "unified-task-runner";
  description: "Executes cron tasks and manages side tasks";

  // Task execution with overlap prevention
  executeCronTask: (task: CronTask) => Promise<ResponseType<any>>;
  startSideTask: (task: SideTask, signal: AbortSignal) => Promise<void>;
  stopSideTask: (taskName: string) => Promise<void>;

  // Task state management
  getTaskStatus: (taskName: string) => TaskStatus;
  isTaskRunning: (taskName: string) => boolean;
  getRunningTasks: () => string[];

  // Environment-specific behavior
  environment: "development" | "production" | "serverless";
  supportsSideTasks: boolean; // false for serverless
}
```

### Task Overlap Prevention

**Problem**: Task scheduled every 1 minute but takes 5 minutes to complete.

**Solution**: Only one instance of each task type runs at a time.

```typescript
// Example overlap prevention logic
async function executeCronTask(task: CronTask): Promise<ResponseType<any>> {
  const taskName = task.name;

  // Check if task is already running
  if (this.isTaskRunning(taskName)) {
    return createSuccessResponse({
      status: "SKIPPED",
      reason: "previous_instance_running",
      message: `Task ${taskName} skipped - previous instance still running`
    });
  }

  // Mark task as running
  this.markTaskAsRunning(taskName);

  try {
    // Execute task
    const result = await task.execute();
    this.markTaskAsCompleted(taskName);
    return result;
  } catch (error) {
    this.markTaskAsFailed(taskName, error);
    throw error;
  }
}
```

## Conclusion

This specification defines a production-ready task management system that:

- **Supports existing patterns**: Maintains compatibility with current cron.ts files (renamed to task.ts)
- **Follows MIGRATION_GUIDE.md**: Uses proper subdomain architecture, enum patterns, CLI integration
- **Enterprise features**: Monitoring, health checks, retry logic, graceful shutdown
- **Quality standards**: Mandatory vibe checks, CLI testing, proper translations
- **Scalable architecture**: Auto-discovery, unified registry, comprehensive API endpoints

The system provides a unified interface for cron tasks and side tasks through a single task runner, while maintaining backward compatibility and following established architectural patterns.
