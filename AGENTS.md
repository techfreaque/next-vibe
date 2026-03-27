# Project Overview

**unbottled.ai** - Free speech AI platform with 50+ models (mainstream/open/uncensored). Users choose their own filtering level. Open source, privacy-first, user-controlled censorship.

**next-vibe** - SaaS framework powering unbottled.ai. Spiritual successor to WordPress. Same codebase, unified architecture: Web UI, Native app, CLI, AI-callable tool, Cron job, MCP server - via platform markers.

## Tech Stack

- **Runtime:** Bun (use `bun install`)
- **Framework:** Next.js App Router (prod) / TanStack+Vite (dev default)
- **Language:** TypeScript ultra strict (NO `any`, NO `unknown`, NO `object`, NO `as X`) — types must align, 0 exceptions
- **ORM:** Drizzle ORM with PostgreSQL
- **Validation:** Zod schemas everywhere
- **Quality:** `mcp hermes-dev check` or fallback `vibe check path1 path2` — never `tsc`/`eslint` directly. Must end at 0 errors, even for out-of-scope issues unless told otherwise.
- **UI/Platform imports:** Always use `next-vibe-ui` — never import from `next/*`, `expo-router`, `react-native`, or `@tanstack/react-router` directly. See `docs/patterns/next-vibe-ui.md`.

## Dev & Build Commands

- **Check server:** `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/test/system/server/health` — `000` = not running, anything else = running
- **`vibe dev`** — dev server, default port 3000, auto-increments (3002, 3004…) if taken. One instance per project; re-running kills and replaces it. Default: TanStack/Vite. `--framework=next` for Next.js.
- **`vibe rebuild`** — zero-downtime production update (preferred over stop/start).
- **`vibe build && vibe start`** — only for fresh production start (no running instance).
- **Rule:** Never start/restart/rebuild unless explicitly asked. Just make the code changes.

## DB & Code Generation

- **Schema changes:** Edit schema → `vibe dgen` → review & improve generated migration → auto-runs on next `vibe dev`/`vibe start`, or `vibe migrate` manually.
- **New endpoints:** `vibe gen` after adding — regenerates MCP/CLI tool lists.
- **Seeds:** `vibe seed` manual, or automatic on `vibe dev` startup.
- **DB queries:** `vibe sql "SELECT ..."` or `vibe sql --queryFile=path`

## Code Quality - Absolute Rules

1. **Follow existing patterns EXACTLY** — find similar code, match it precisely
2. **No `throw`** — use `ResponseType<T>` with `success(data)` / `fail({message, errorType})`
3. **createEnumOptions pattern** — for all enums with i18n translation keys
4. **text() with enum constraint** — for DB enum columns (not pgEnum, 63-byte limit)
5. **All EndpointErrorTypes required** — every definition needs all 9 error types
6. **All definition properties required** — tags, successTypes, errorTypes, examples

## Unified Surface Principle

One `definition.ts` automatically becomes a **web UI, CLI command, MCP tool, Native screen, and AI-callable tool** — no extra code. Platform is detected at runtime via the `platform` parameter.

Design fields for all surfaces simultaneously: labels/descriptions must read well in CLI and MCP, not just web. Widget types, examples, and i18n keys all render across surfaces. Per-surface behavior goes in the repository via `platform` — not separate endpoints.

## Endpoint Pattern (3-file structure)

```
src/app/api/[locale]/<category>/<feature>/
  definition.ts    - createEndpoint() with Zod schemas, field widgets, error types, examples
  repository.ts    - DB operations returning ResponseType<T>, no throw
  route.ts         - endpointsHandler() wiring definition + repository
  i18n/            - Scoped translations (index.ts + en/, de/, pl/ subdirs)
  widget.tsx       - Custom widget — required for all non-trivial endpoints
  widget.cli.tsx   - CLI/MCP widget — required for all CLI-callable or data-returning endpoints
  hooks.ts         - useEndpoint wrapper (only if used cross-module) - OR hooks/ folder
```

**Widget rules:** Every endpoint gets a widget — the auto-renderer is a last resort for trivial internal tooling only. `widget.tsx` handles web + native (use `useWidgetPlatform()` to branch). `widget.cli.tsx` handles CLI + MCP (use `useInkWidgetPlatform()` to branch — chalk+colors for CLI, plain compact text for MCP, detail threshold for lists). Widgets are scoped to deepest route, self-contained. Shared UI lives in the canonical owner's widget; others import from owner, never reverse. Embed foreign UI via `EndpointsPage` (dialog) or `navigation.push()` — never import internal components.

## Pattern Reference - Read Before You Write

| File you're working on      | Read this first                          |
| --------------------------- | ---------------------------------------- |
| `definition.ts`             | `docs/patterns/definition.md`            |
| `repository.ts`             | `docs/patterns/repository.md`            |
| `route.ts`                  | `docs/patterns/route.md`                 |
| `i18n/` files               | `docs/patterns/i18n.md`                  |
| `enum.ts`                   | `docs/patterns/enum.md`                  |
| `db.ts` / schema            | `docs/patterns/database.md`              |
| `seeds.ts`                  | `docs/patterns/seeds.md`                 |
| `tasks/` (cron)             | `docs/patterns/tasks.md`                 |
| Logger usage                | `docs/patterns/logger.md`                |
| Email sending               | `docs/patterns/email.md`                 |
| `widget.tsx` / `widget/`    | `docs/patterns/widget.md`                |
| `widget.cli.tsx`            | `docs/patterns/widget.cli.md`            |
| `hooks.ts` / `hooks/`       | `docs/patterns/hooks.md`                 |
| `repository.native.ts`      | `docs/patterns/repository.native.md`     |
| `repository-client.ts`      | `docs/patterns/repository.client.md`     |
| `route-client.ts`           | `docs/patterns/repository.client.md`     |
| `skill.ts` (default-skills) | `docs/patterns/skill.md`                 |
| `system-prompt/` folder     | `docs/patterns/system-prompt.md`         |
| Vibe Sense data source      | `docs/patterns/vibe-sense-datasource.md` |
| `next-vibe-ui` imports      | `docs/patterns/next-vibe-ui.md`          |

## Agent Roles

**Thea** — Cloud AI (prod/VPS). Monitors platform, delegates to Hermes or Coding Agent.

**Hermes** — Local AI (dev/localhost). Executes tasks, calls tools. MCP servers: `hermes` (prod), `hermes-dev` (local).

**Coding Agent (You)** — Execution agent for Thea, Hermes, or Max. Explore → implement → test → report.

## Workflow

1. Receive task → explore (patterns, constraints) → implement → test → report
2. Keep going until blocked by something only Max can decide
3. **Architectural decision blocked?** Stop, present TLDR of options, ask. Otherwise just do it.
4. Simpler is always right. If it feels complicated, find the existing pattern.

**Ask vs Do:** Stop for architectural tradeoffs, irreversible/high-blast-radius actions, genuinely ambiguous requirements. Never ask "Should I check X?", "Would Y work?", "Is this the right file?" — just do it.

**Proactive by default:** If you encounter anything that smells wrong — type errors, inconsistent patterns, broken imports, dead code, misnamed files, half-implemented features — add it to the task list and fix it. Don't wait to be asked. The only exception is large architectural changes or out-of-scope refactors that could break things; those get flagged, not silently done.

## Testing

- **Lint/types:** `mcp hermes-dev check` (0 errors required before done)
- **CLI:** `vibe <tool>` during development for endpoint smoke tests
- **Browser E2E (required for all user-facing changes):** Use `browser_*` MCP tools (Chrome DevTools). If unavailable, `vibe help browser`. CLI alone is not sufficient — browser verification is the final step.

## End-of-Session Protocol

1. **TASK_ID provided** → `complete-task` via MCP: `taskId`, `status` (`status.completed`/`status.failed`/`status.cancelled`), `summary` (2-3 sentences), `output` (key-value facts).
2. **No task ID** → summary: what was done, files changed, follow-ups.
3. Concise and confident. Only ask approval for architectural decisions.
