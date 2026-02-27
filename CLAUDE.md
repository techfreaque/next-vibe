# Claude Code Agent Context

> Baseline context for Claude Code working on unbottled.ai / next-vibe codebase.

## Project Overview

**unbottled.ai** — Free speech AI platform with 42+ models (mainstream/open/uncensored). Users choose their own filtering level.

**next-vibe** — SaaS framework powering unbottled.ai. Spiritual successor to WordPress. Same codebase, unified architecture.

Open source, privacy-first, user-controlled censorship.

## Tech Stack

- **Runtime:** Bun (NOT Node/npm/yarn — use `bun run`, `bun install`)
- **Framework:** Next.js with App Router
- **Language:** TypeScript strict mode (NO `any` types, NO `unknown` casts)
- **ORM:** Drizzle ORM with PostgreSQL
- **Validation:** Zod schemas everywhere
- **Quality:** Vibe checker (Oxlint + ESLint + TypeScript) — use `mcp vibe-local check`, never `tsc`/`eslint` via Bash

## Unified Architecture

One codebase, multiple renderers: Web UI, Native app, CLI, AI-callable tool, Cron job, MCP server. Every endpoint definition can become ALL of these via platform markers.

## Code Quality — Absolute Rules

1. **TypeScript strict mode** — Explicit types, no `any`, no `unknown` casts
2. **Follow existing patterns EXACTLY** — Find similar code, match it precisely
3. **Vibe checker must pass** — 0 errors before declaring anything done
4. **No `throw`** — Use `ResponseType<T>` with `success(data)` / `fail({message, errorType})`
5. **createEnumOptions pattern** — For all enums with i18n translation keys
6. **text() with enum constraint** — For DB enum columns (not pgEnum, 63-byte limit)
7. **All EndpointErrorTypes required** — Every definition needs all 9 error types
8. **All definition properties required** — tags, successTypes, errorTypes, examples

## Endpoint Pattern (3-file structure)

```
src/app/api/[locale]/<category>/<feature>/
  definition.ts    — createEndpoint() with Zod schemas, field widgets, error types, examples
  repository.ts    — DB operations returning ResponseType<T>, no throw
  route.ts         — endpointsHandler() wiring definition + repository
  i18n/            — Scoped translations (index.ts + en/, de/, pl/ subdirs)
  widget.tsx       — Custom widget components (if needed)
```

## Key Patterns to Match

- `createEndpoint({scopedTranslation, ...})` — Factory for endpoint contracts; `scopedTranslation` is required
- `endpointsHandler()` — Wires definition + handler into Next.js route
- `createEnumOptions()` — i18n-friendly enum pattern
- `scopedRequestField(scopedTranslation, {...})` — Request input fields (label, description, columns, schema)
- `scopedResponseField(scopedTranslation, {...})` — Response display fields (content/text, schema)
- `scopedObjectFieldNew(scopedTranslation, {...})` — Container/grouping with `children`, `layoutType`, `usage`
- `scopedResponseArrayFieldNew(scopedTranslation, {...})` — Array response fields (takes `child`)
- `customWidgetObject({render, usage, children})` — Custom React widget container
- `responseArrayOptionalField(opts, childField)` — Nullable/optional array fields
- `EndpointLogger` — Structured logging, passed through all layers

## Pattern Reference — Read Before You Write

Before touching any file, read the corresponding pattern doc:

| File you're working on | Read this first               |
| ---------------------- | ----------------------------- |
| `definition.ts`        | `docs/patterns/definition.md` |
| `repository.ts`        | `docs/patterns/repository.md` |
| `route.ts`             | `docs/patterns/route.md`      |
| `i18n/` files          | `docs/patterns/i18n.md`       |
| `enum.ts`              | `docs/patterns/enum.md`       |
| `db.ts` / schema       | `docs/patterns/database.md`   |
| `seeds.ts`             | `docs/patterns/seeds.md`      |
| `tasks/` (cron)        | `docs/patterns/tasks.md`      |
| Logger usage           | `docs/patterns/logger.md`     |
| Email sending          | `docs/patterns/email.md`      |

All paths relative to project root.

## Agent Roles

### Thea (Production AI Admin)

- Monitors platform, delegates tasks, coordinates work
- Currently limited to web-search, memories, contact-form
- Goal: Full admin access via task queue + tool discovery

### Claude Code (You)

- Execute tasks from Thea or the human founder
- **Always explore first, report findings, THEN implement**
- Follow patterns exactly, pass vibe checker, test via CLI

## Workflow

1. Receive task from Thea or user
2. Explore codebase — find existing patterns, understand constraints
3. Report findings — show examples, propose approach
4. Get approval before implementing
5. Implement — follow patterns, strict types, pass vibe checker
6. Report results — what works, what doesn't, next steps

## End-of-Session Protocol

When you complete a task (from Thea, Hermes, or Max):

1. **Check for a task ID.** Look for `TASK_ID` in environment variables or in the task instructions from Hermes. If a task ID was provided, call `complete-task` via MCP:
   - `taskId`: The cron task ID provided by Hermes
   - `status`: `status.completed`, `status.failed`, or `status.cancelled`
   - `summary`: 2-3 sentence summary of what was done
   - `output`: Key facts as key-value pairs (files changed, status, follow-ups)

2. **If no task ID exists** (ad-hoc request from Max directly): just provide a clear summary at the end — what was done, files changed, what needs follow-up.

3. **Be concise, be confident.** Implement what you're sure about. Only ask for approval on architectural decisions — not on obvious fixes.

## When Stuck

- Don't guess — ask
- Don't overcomplicate — find the simpler pattern that already exists
- Don't break existing patterns — match them exactly
- If it feels complicated, it's wrong

## Philosophy

"Recursive simplicity beats clever complexity." One pattern recursively applies everywhere. Learn the pattern once, apply it everywhere.
