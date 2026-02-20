# Task System Spec

## Core Model: Tasks as Routes

A cron task is a scheduled invocation of a route handler. The DB row stores:

- **which route** to call (`routeId` — replaces `name`)
- **with what config** (`defaultConfig` JSONB — validated by that route's Zod schema)
- **when** (cron schedule)
- **as whom** (`userId` — constructs the JWT for permission checks)

The route's own `definition.ts` + `widget.tsx` describe and render the config. No separate task-specific form code needed. Adding a new task type = adding a new route.

### Do we need `task.name`?

Renamed to **`routeId`**. It serves one purpose: tells the executor which registered handler to call. It's not a human label — that's `displayName`. For user-created dynamic tasks, `routeId` is always `"cron-steps"`; the UUID is the unique instance identifier.

### `routeId` Resolution

`routeId` is resolved through two registries in order:

1. **`aliasToPathMap`** (in `system/generated/endpoint.ts`) — resolves any endpoint alias or full path key (e.g. `"cron:stats"` → `"system_unified-interface_tasks_cron_stats_GET"`, or the full key verbatim). Use `getFullPath(routeId)` — if non-null, this is an API endpoint call.

2. **`taskRegistry.tasksByName`** (in `system/generated/tasks-index.ts`) — resolves registered cron task handler names (e.g. `"lead-email-campaigns"`, `"imap-sync"`). If found here, call the task's `run()` directly.

3. **`"cron-steps"`** — reserved literal for the dynamic steps executor. No lookup needed.

If `routeId` resolves in neither registry: execution fails with `INVALID_ROUTE_ID` error, execution record status set to `ERROR`.

```typescript
function resolveRouteId(
  routeId: string,
):
  | { kind: "endpoint"; path: EndpointPath }
  | { kind: "task"; task: CronTask }
  | { kind: "steps" }
  | { kind: "unknown" };
```

This means `routeId` accepts: short aliases (`"cron:stats"`), full endpoint paths (`"system_unified-interface_tasks_cron_stats_GET"`), task names (`"lead-email-campaigns"`), or `"cron-steps"`. One field, consistent resolution.

---

## Two Tiers

|                        | System tasks                | User tasks             |
| ---------------------- | --------------------------- | ---------------------- |
| `userId`               | `null`                      | `<uuid>`               |
| Created by             | code (`task.ts` + registry) | user or AI agent       |
| Runs as                | `CRON_SYSTEM_USER` (ADMIN)  | owner's JWT            |
| Editable by            | ADMIN only                  | owner + ADMIN          |
| Auto-pruned on startup | yes, if `routeId` removed   | never (flagged ERROR)  |
| Multiple instances     | one per routeId by default  | N per routeId per user |

**Startup sync**: seed missing system task DB rows from registry; prune rows whose `routeId` no longer exists and `userId IS NULL`.

---

## Route Types

### System task routes (existing `task.ts` files — refactored)

Each `task.ts` file exports a `CronTask` with a `name` (e.g. `"lead-email-campaigns"`). That name becomes the `routeId` in DB. Each task additionally gets:

- a `configSchema` (Zod) describing its `defaultConfig` shape — already partially present in some tasks
- a `widget.tsx` rendering a settings form from that schema — new, auto-generated from the schema

The executor calls `tasksByName[routeId].run()` directly. No HTTP. No legacy wrapper.

### `cron-steps` route (new, user-facing)

Path: `src/app/api/[locale]/system/unified-interface/tasks/cron/steps/`

`routeId = "cron-steps"` for all user-created dynamic tasks. `defaultConfig = { steps: Step[] }`. Its widget is the steps builder. The executor handles this case specially — no `run()` function, just step dispatch.

---

## Steps (for `cron-steps` tasks)

Three types, chainable in order. Output of step N available as `"$step_N_result"` in subsequent steps.

`route_call` and `tool_call` are unified into a single step type — both resolve via `resolveRouteId()`. The distinction is semantic (calling a task handler vs. an API endpoint) but the resolution mechanism is identical.

```typescript
type CallStep = {
  type: "call";
  routeId: string; // alias, full endpoint path, or task name — resolved via resolveRouteId()
  args: Record<string, unknown>; // validated against the resolved route's/task's input schema
  parallel?: boolean;
};

type AiAgentStep = {
  type: "ai_agent";
  model: ModelId;
  character: string;
  prompt: string;
  preSeededToolCalls?: Array<{
    toolId: string;
    args: Record<string, unknown>;
    result: unknown; // static or "$step_N_result" template
  }>;
  availableTools?: string[]; // optional whitelist; defaults to all owner-accessible tools
  maxTurns?: number; // default 10
  threadMode: "none" | "new" | "append";
  threadId?: string; // for "append" mode
  folderId?: string; // for "new" mode
  autoAppendAfterFirst?: boolean; // "new" → stores threadId → switches to "append" after first run
};
```

**Thread modes:**

- `"none"` — ephemeral (incognito), results only in `cronTaskExecutions`. Good for fire-and-forget.
- `"new"` — fresh thread per run, visible in owner's chat history. Good for periodic reports.
- `"append"` — continues the same thread every run; auto-compacting handles growth. Good for living logs, agents with memory across runs. Falls back to `"new"` if thread deleted, then updates config.

**Tool scope:** owner's role → `filterEndpointsByPermissions` → optional `availableTools` intersection. `requiresConfirmation` always `false` (no human in the loop).

---

## Execution Flow

```
Pulse tick → isCronTaskDue(task)?
  └─ executeCronTask(task)
       ├─ ownerJwt = task.userId ? buildJwt(user) : CRON_SYSTEM_USER
       ├─ Create cronTaskExecution (RUNNING)
       ├─ resolved = resolveRouteId(task.routeId)
       │    ├─ "endpoint" → getFullPath(routeId) → call endpoint handler(defaultConfig, ownerJwt)
       │    ├─ "task"     → tasksByName[routeId].run({ logger, locale, cronUser: ownerJwt })
       │    ├─ "steps"    → execute steps[] (see below)
       │    └─ "unknown"  → fail(INVALID_ROUTE_ID)
       │
       └─ steps execution:
            ├─ type: "call"
            │    ├─ resolveRouteId(step.routeId) → "endpoint" | "task"
            │    ├─ validate step.args against resolved schema
            │    └─ call handler → result stored as $step_N_result
            └─ type: "ai_agent"
                 ├─ substitute $step_N_result refs in preSeededToolCalls
                 ├─ threadMode "none"   → ephemeral
                 ├─ threadMode "new"    → ensureThread() [autoAppend: write threadId back to config]
                 ├─ threadMode "append" → load thread [fallback to "new" if deleted]
                 └─ setupAiStream → run to completion → store (threadId, finishReason, tokenCount)

       └─ Update cronTaskExecution (COMPLETED | FAILED, stepResults, durationMs)
```

All calls are direct (no HTTP). Handlers called via repository pattern, `run()` called directly.

---

## Database

### `cronTasks` — field changes

| Field                 | Change                                                             |
| --------------------- | ------------------------------------------------------------------ |
| `name`                | renamed to `routeId` (which handler to call)                       |
| `displayName`         | new — human label for the instance                                 |
| `outputMode`          | new — `"store_only" \| "notify_on_failure" \| "notify_always"`     |
| `notificationTargets` | new — `Array<{ type: "email"\|"sms"\|"webhook", target: string }>` |

Uniqueness: drop current unique on `name`. Add partial unique index `(routeId) WHERE userId IS NULL` for system tasks. No constraint for user tasks (N instances per user per routeId fine).

`defaultConfig` is unchanged — it just now carries the route's config, or `{ steps: [...] }` for `cron-steps`.

### `cronTaskExecutions` — new fields

| Field         | Type          | Description                        |
| ------------- | ------------- | ---------------------------------- |
| `stepResults` | jsonb         | Per-step results array             |
| `threadId`    | uuid nullable | Thread from an ai_agent step       |
| `tokenCount`  | int nullable  | Total tokens across ai_agent steps |

---

## UI

### List widget

Rows gain: `displayName` (primary label), `routeId` badge, owner chip (system / user avatar). Actions unchanged: View · Edit · Delete.

### Edit page (full page, all task types)

```
┌─ Shared shell ─────────────────────────────┐
│ displayName, schedule, enabled, priority,  │
│ timeout, retries, outputMode               │
├─ Route config (renders routeId's widget) ──┤
│ • system route → its own settings form     │
│ • cron-steps   → steps builder (below)     │
└────────────────────────────────────────────┘
```

No special-casing per task type in the shell. The inner section is just `<RouteWidget routeId={task.routeId} config={task.defaultConfig} />`.

### Steps builder (cron-steps widget)

- Add Step picker: `Call | AI Agent`
- Ordered cards, drag/up-down to reorder, collapsible

**Call card:** single searchable selector covering both registered task names (`tasksByName`) and endpoint aliases/paths (`aliasToPathMap`) — all resolved via `resolveRouteId()`. Once selected, arg editor auto-rendered from the resolved schema. Parallel toggle.

**AI Agent card:** model, character, prompt, pre-seeded calls (each: `routeId` + args + optional `$step_N_result` ref), tools whitelist, max turns, thread mode picker

Thread mode picker:

- `None` — no fields
- `New each run` — folder selector + auto-append toggle
- `Append to existing` — thread picker (or "set after first run" hint if empty)

---

## Permissions

```
task.userId → buildJwt(user) → filterEndpointsByPermissions → tool set
```

Same path as a real user login. Role downgrade takes effect on next run automatically. ADMIN sees and edits all tasks; users see only their own.

AI agents creating/editing tasks use the calling user's JWT — `task.userId` is always set to the caller. Ownership check on update/delete: `task.userId === caller.id` OR caller is ADMIN.

---

## Notifications

On execution end, if `outputMode` is not `"store_only"`:

- Collect: task displayName, execution id, status, duration, error, thread link
- Send to each `notificationTarget` (email / sms / webhook)

---

## Migration (no legacy — full refactor)

1. **DB** — rename `name→routeId`, add `displayName`, `outputMode`, `notificationTargets`; fix uniqueness index.
2. **All `task.ts` files** — add `configSchema` (Zod) + `widget.tsx` to each. Remove `loadConfig()` boilerplate from task bodies — executor handles config loading and validation centrally.
3. **Executor** — replace old `run()` dispatch with `resolveRouteId()` → unified dispatch. Remove any special-casing.
4. **`cron-steps`** — new route + steps builder widget.
5. **List widget** — add `displayName`, `routeId` badge.
6. **Edit page** — shared shell + `<RouteWidget routeId={task.routeId} config={task.defaultConfig} />`.

---

## Deferred

- **Parallel fan-out/join** — `parallel: true` steps run concurrently. Needs lightweight join. v2.
- **Step conditionals** — `runIf: "$step_0.result.count > 0"`. v2.
- **Token budget** — per-task `maxTokens` guard on ai_agent steps.
- **Live stream view** — watch a running ai_agent step's output in admin UI.
- **`CRON` default folder** — reserved `DefaultFolderId` for threads created by cron tasks.
