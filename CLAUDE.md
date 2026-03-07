# Claude Code Agent Context

> Baseline context for Claude Code working on unbottled.ai / next-vibe codebase.

## Project Overview

**unbottled.ai** — Free speech AI platform with 42+ models (mainstream/open/uncensored). Users choose their own filtering level. Open source, privacy-first, user-controlled censorship.

**next-vibe** — SaaS framework powering unbottled.ai. Spiritual successor to WordPress. Same codebase, unified architecture: Web UI, Native app, CLI, AI-callable tool, Cron job, MCP server — via platform markers.

## Tech Stack

- **Runtime:** Bun (NOT Node/npm/yarn — use `bun run`, `bun install`)
- **Framework:** Next.js with App Router
- **Language:** TypeScript strict mode (NO `any`, NO `unknown` casts)
- **ORM:** Drizzle ORM with PostgreSQL
- **Validation:** Zod schemas everywhere
- **Quality:** Vibe checker (Oxlint + ESLint + TypeScript) — use `mcp vibe-local check`, never `tsc`/`eslint` via Bash

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
  widget.tsx       — Custom widget (if needed) — OR widget/ folder for complex layouts
  hooks.ts         — useEndpoint wrapper (only if used cross-module) — OR hooks/ folder
```

**Widget rules (strict):** Widget is scoped to the deepest route, self-contained. Shared UI lives in the widget of its canonical owner endpoint; other endpoints may import from the owner, never the reverse. Embed other endpoints' UI via `EndpointsPage` (dialog) or `navigation.push()` — never by importing their internal components.

## Key Patterns

- `createEndpoint({scopedTranslation, ...})` — Factory for endpoint contracts; `scopedTranslation` required
- `endpointsHandler()` — Wires definition + handler into Next.js route
- `createEnumOptions(scopedTranslation, {...})` — i18n-friendly enum pattern
- `scopedRequestField(scopedTranslation, {...})` — Request input fields (label, description, columns, schema)
- `scopedResponseField(scopedTranslation, {...})` — Response display fields (content/text, schema)
- `scopedObjectFieldNew(scopedTranslation, {...})` — Container/grouping with `children`, `layoutType`, `usage`
- `scopedResponseArrayFieldNew(scopedTranslation, {...})` — Array response fields (takes `child`)
- `customWidgetObject({render, usage, children})` — Custom React widget container
- `responseArrayOptionalField(opts, childField)` — Nullable/optional array fields
- `EndpointLogger` — Structured logging, passed through all layers

## Pattern Reference — Read Before You Write

| File you're working on   | Read this first                      |
| ------------------------ | ------------------------------------ |
| `definition.ts`          | `docs/patterns/definition.md`        |
| `repository.ts`          | `docs/patterns/repository.md`        |
| `route.ts`               | `docs/patterns/route.md`             |
| `i18n/` files            | `docs/patterns/i18n.md`              |
| `enum.ts`                | `docs/patterns/enum.md`              |
| `db.ts` / schema         | `docs/patterns/database.md`          |
| `seeds.ts`               | `docs/patterns/seeds.md`             |
| `tasks/` (cron)          | `docs/patterns/tasks.md`             |
| Logger usage             | `docs/patterns/logger.md`            |
| Email sending            | `docs/patterns/email.md`             |
| `widget.tsx` / `widget/` | `docs/patterns/widget.md`            |
| `widget.cli.tsx`         | `docs/patterns/widget.cli.md`        |
| `hooks.ts` / `hooks/`    | `docs/patterns/hooks.md`             |
| `repository.native.ts`   | `docs/patterns/repository.native.md` |
| `repository-client.ts`   | `docs/patterns/repository.client.md` |
| `route-client.ts`        | `docs/patterns/repository.client.md` |

All paths relative to project root.

## Agent Roles

**Thea** — Production AI Admin. Monitors platform, delegates tasks. Goal: full admin access via task queue + tool discovery.

**Claude Code (You)** — Execute tasks from Thea or Max. Explore first, then implement. Follow patterns exactly, pass vibe checker, test via CLI.

## Workflow

1. Receive task → Explore (find patterns, constraints) → Implement → Report
2. Keep going until blocked by something only Max can decide
3. When genuinely blocked on an **architectural decision**: stop, present TLDR of options, ask

## When to Ask vs When to Just Do

**Just do it** — how something works, where files live, what pattern to follow, fallback behavior, whether an approach will work (try it).

**Stop and ask** — architectural choices with tradeoffs, irreversible/high-blast-radius actions, genuinely ambiguous requirements.

**Never ask** — "Should I check X?" (yes), "Would Y work?" (try it), "Is this the right file?" (read it).

## End-of-Session Protocol

When completing a task (from Thea, Hermes, or Max):

1. **If a TASK_ID was provided** → call `complete-task` via MCP with `taskId`, `status` (`status.completed`/`status.failed`/`status.cancelled`), `summary` (2-3 sentences), `output` (key-value pairs of facts).
2. **If no task ID** (ad-hoc from Max) → provide a clear summary: what was done, files changed, follow-ups.
3. Be concise and confident. Only ask approval for architectural decisions.

## When Stuck

Don't guess. Don't overcomplicate. Find the simpler pattern that already exists. If it feels complicated, it's wrong.

## Philosophy

"Recursive simplicity beats clever complexity." One pattern applies everywhere — learn it once, apply everywhere.
