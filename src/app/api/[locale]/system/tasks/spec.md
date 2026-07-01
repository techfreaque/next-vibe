# Task System

Unified scheduling, execution, and async-completion infrastructure for the platform. All background work — cron jobs, system maintenance, AI tool callbacks — runs through this module.

## Concepts

### Task

A task is a registered unit of work with a stable identity (`id`), a cron schedule, and a `routeId` pointing to any endpoint on the platform. Multiple task records can share the same `routeId` — different schedules, different inputs, same handler.

**System tasks** are seeded at startup with `userId = null`. They are always present, never owned by a user. **User tasks** carry a `userId` and are created dynamically.

Tasks are stored in `cronTasks`. A complementary `cronTaskExecutions` table holds history: one row per run, with full timing, status, and output.

### Pulse

The heartbeat executor. On every tick (default: 1 minute), the pulse discovers all enabled tasks whose `nextExecutionAt` is due, executes them in priority order, and records the outcome. Priority order: CRITICAL > HIGH > MEDIUM > LOW > BACKGROUND.

The pulse computes `nextExecutionAt` from each task's cron expression and timezone after execution. Health is tracked separately in `pulseHealth` and `pulseExecutions` tables.

Pulse runs as a task-runner process, not as a cron task itself. It is started by the server on boot and polls on a fixed interval.

### Async Completion

Some tasks are not self-contained — they dispatch work to a coding agent and wait for a reply. The flow:

1. AI calls `execute` or `await-task` (under `execute-tool/`) with a task ID.
2. The task enters RUNNING state; the AI stream pauses (TOOL_WAITING).
3. When the coding agent finishes, it calls `complete-task` with the task ID and result payload.
4. `task-completion-handler` (canonical in `execute-tool/handlers/`) backfills the result into the original tool message, emits a TASK_COMPLETED WebSocket event, and schedules a one-shot `resume-stream` cron task.
5. The AI stream resumes with the result inline — no polling, no re-prompt.

## Module Layout

```
tasks/
  cron/            # Database schema, core repository, and CRUD endpoints for task records
  execute/         # Trigger any task by ID (synchronous, admin-only)
  complete-task/   # Coding agent callback: mark task done and deliver result
  pulse/           # Heartbeat executor: db schema, runner, status/history endpoints
  unified-runner/  # Start/stop/status for runner processes
  dev-watcher/     # Dev-only: file watcher that triggers generators on change
  seeds.ts         # Upsert all system task definitions into the DB on startup
  constants.ts     # Cron schedule patterns, timeouts, priority weights
  enum.ts          # All task enums (status, priority, category, output mode…)
  cron-formatter.ts          # Cron expression → human-readable string, next execution
  i18n-utils.ts    # Resolve task display names that may be i18n keys
  i18n/            # Module-level translations (status, priority, category labels)
```

The AI-callable wait endpoint and the shared async-completion callback both live
under `execute-tool/`, not here: `execute-tool/await-task/` (pause stream until a
background task completes) and `execute-tool/handlers/task-completion-handler.ts`
(canonical completion logic, shared by the pulse, `complete-task`, and remote `/report`).

Other modules **register** a system task here but are owned by their own module —
the task system only schedules and runs them, it does not document or own them:
`system/db/health/` (DB/memory/disk health check) and
[`system/logger/`](../../logger/spec.md) (error capture plus daily cleanup).

## Database Schema

### `cronTasks`

| Column                | Type      | Purpose                                                       |
| --------------------- | --------- | ------------------------------------------------------------- |
| `id`                  | text PK   | Stable identity (e.g. `"db-health"`, `"credits-expire"`)      |
| `shortId`             | text      | Short display ID; mirrors `id` for system tasks               |
| `routeId`             | text      | Endpoint alias or path to invoke at execution                 |
| `displayName`         | text      | Human label                                                   |
| `schedule`            | text      | Cron expression                                               |
| `timezone`            | text      | Execution timezone (default UTC)                              |
| `enabled`             | boolean   | Enabled/disabled toggle                                       |
| `hidden`              | boolean   | Excluded from AI system prompt and default lists              |
| `priority`            | enum      | CRITICAL / HIGH / MEDIUM / LOW / BACKGROUND                   |
| `timeout`             | integer   | Max execution time (ms)                                       |
| `retries`             | integer   | Max retry attempts                                            |
| `taskInput`           | jsonb     | Flat input merged from body + path params; split at execution |
| `runOnce`             | boolean   | Disable after first successful execution                      |
| `outputMode`          | enum      | STORE_ONLY / NOTIFY_ON_FAILURE / NOTIFY_ALWAYS                |
| `historyInterval`     | integer?  | Throttle successful history writes; null = every run          |
| `targetInstance`      | text?     | Restrict execution to a named instance (e.g. `"hermes"`)      |
| `wakeUp*`             | various   | Revival context for async stream completion callbacks         |
| `lastExecutedAt`      | timestamp | Last run                                                      |
| `nextExecutionAt`     | timestamp | Predicted next run                                            |
| `executionCount`      | integer   | Total runs                                                    |
| `consecutiveFailures` | integer   | Current failure streak; resets on success                     |
| `userId`              | uuid?     | Owner (null = system task)                                    |

### `cronTaskExecutions`

One row per execution. Stores config snapshot, result, error, timing, retry chain linkage, and instance metadata (`executedByInstance`, `serverTimezone`).

### `pulseHealth`

Tracks the health of the pulse executor itself: status (HEALTHY / WARNING / CRITICAL / UNKNOWN), success rate (basis points), consecutive failures, maintenance mode flag.

### `pulseExecutions`

One row per pulse tick. Counts tasks discovered, due, executed, succeeded, failed, skipped per tick.

## Ownership Model

```typescript
type TaskOwner = { type: "system" } | { type: "user"; userId: string };
```

Helper constants and functions: `SYSTEM_OWNER`, `userOwner(id)`, `dbUserIdToOwner(id)`, `toDbUserId(owner)`.

## Execution Flow

```
Pulse tick
  → discover enabled tasks where nextExecutionAt <= now
  → sort by priority weight
  → for each task: invoke routeId endpoint via execute/repository
      → call endpoint handler with taskInput
      → on success: update task stats, write execution record
      → on async (TOOL_WAITING): leave status RUNNING; coding agent calls complete-task later
  → update pulseHealth
  → emit WS events
```

## Cron Schedules

Common patterns are available as constants in `constants.ts` (`CRON_SCHEDULES.*`). `cron-formatter.ts` converts any expression to a human-readable string in the current locale, computes next execution, and validates expressions.

## Error Handling

All repository functions return `ResponseType<T>` — no throws. Failures surface through `fail({ message, errorType })`. Execution errors are stored in the history record and increment `consecutiveFailures`. Pulse health is recorded per tick: HEALTHY on a clean tick, WARNING on a tick with failures.

## System Tasks

| ID                   | Location                               | Schedule       | Priority |
| -------------------- | -------------------------------------- | -------------- | -------- |
| `db-health`          | `system/db/health/`                    | Every minute   | LOW      |
| `error-logs-cleanup` | `system/logger/error-monitor/cleanup/` | Daily midnight | LOW      |

Both are hidden from AI system prompts and task lists by default. They are seeded
here but owned by `system/db/` and `system/logger/` respectively — see those
modules for what the tasks actually do.
