# Debugging Guide

> **Part of NextVibe Framework** (GPL-3.0)

---

## Type & Lint Errors

Run `vibe check`. Fix everything it reports - no workarounds, no type assertions.

```bash
vibe check                    # entire codebase
vibe check src/path/to/file   # specific file or folder
```

`check` and `c` are aliases - `vibe check src/` is equivalent to `vibe c src/`.

For MCP usage, the same endpoint is available as the `check` tool. See [vibe check docs](../patterns/definition.md) and the MCP server setup.

---

## i18n Errors

See [i18n Patterns](../patterns/i18n.md) for the complete system.

The short version: translation keys map exactly to folder paths. `vibe check` catches missing or wrong keys - **but only if `translationsKeyTypesafety` is enabled**.

In `src/config/debug.ts`:

```typescript
// Speeds up the typecheck by 100x but disables translation typesafety
export const translationsKeyTypesafety = false;
```

When this is `false` (the default), `vibe check` runs fast but won't catch invalid translation keys. Set it to `true` before checking i18n, then set it back - leaving it on makes typecheck extremely slow.

---

## Debug Logging

By default only `info`, `warn`, and `error` are logged. `debug()` calls are silent unless you enable debug mode.

**Enable for a single CLI run:**

```bash
vibe <command> -v
vibe <command> --verbose
```

**Enable permanently in development** - edit `src/config/debug.ts`:

```typescript
export let enableDebugLogger = false; // change to true
export let debugMiddleware = false; // change to true for middleware logs
```

Set these back to `false` before committing. The `-v` flag sets them at runtime via `enableDebug()`.

There is also `translationsKeyMode` in that file - set it to `true` to show raw translation keys in the UI instead of translated strings, useful when tracking down which key is used where.

---

## Endpoint Debugging

### Finding the CLI command for a route

Every `route.ts` maps to a CLI command. The command key is the `path` array from `definition.ts` joined with underscores, plus the HTTP method:

```
path: ["user", "public", "login"]  +  method: POST
→  vibe user_public_login_POST
```

To see all available commands:

```bash
vibe list           # all commands
vibe list --format=tree
vibe help <command> # details for one command
```

If the endpoint has `aliases` defined in its `definition.ts`, use those instead - they're shorter:

```typescript
// definition.ts
aliases: ["check", "c"],
```

```bash
vibe check          # alias
vibe c              # shorter alias
vibe system_check_vibe-check_POST  # full key, same endpoint
```

### Passing data to a command

**Three ways to pass request data:**

**1. Named flags with dot-notation for nested fields:**

```bash
vibe user_public_login_POST --email="test@example.com" --password="secret"
vibe agent_chat_settings_POST --"config.theme"=dark --"config.language"=en
```

Kebab-case flags are automatically converted to camelCase: `--user-name` → `userName`.

**2. Raw JSON via `-d`:**

```bash
vibe user_public_login_POST -d '{"email":"test@example.com","password":"secret"}'
```

**3. First positional argument** (when the endpoint defines `firstCliArgKey`):

Some endpoints define a shorthand for the most common parameter. For example `vibe check` has `firstCliArgKey: "paths"`, so:

```bash
vibe check src/components       # equivalent to --paths="src/components"
vibe check src/ src/components  # passes array
```

Check the endpoint's `definition.ts` `cli.firstCliArgKey` field to know if this applies.

### Verbose output

Every command supports `-v` / `--verbose`:

```bash
vibe user_public_login_POST --email="test@example.com" --password="secret" -v
```

This enables debug logging and prints full request/response details.

### Authentication

The CLI user is determined in this order:

1. **Saved session** - from a previous `vibe user_public_login_POST` call (stored in `.vibe.session`)
2. **`VIBE_ADMIN_USER_EMAIL` env variable** - set in `.env`, authenticated from the DB automatically
3. **Public/anonymous user** - if neither is set

To log in and save a session:

```bash
vibe user_public_login_POST --email="you@example.com" --password="yourpassword"
```

### Verifying an endpoint works end-to-end

1. Find the command key from `definition.ts` path array or `vibe list`
2. Run with `-v` to see full debug output
3. Check server terminal for `logger.debug()` output (needs debug mode enabled)
4. If getting 401/403: check `allowedRoles` in `definition.ts` and your user's role
5. If getting validation errors: check the Zod schemas in `definition.ts` fields

---

## Tool Discovery

The platform exposes 180+ AI-callable tools. The `tool-help` endpoint (alias for `system_unified-interface_ai_tools_GET`) lets both humans and AI discover them efficiently.

### CLI usage

```bash
vibe tool-help                        # overview: category summary
vibe tool-help search                 # search by keyword (first arg = query)
vibe tool-help --category=chat        # browse tools in a category
vibe tool-help --tool-name=tool-help  # full detail + parameter schema
```

### How AI discovers tools

`tool-help` is one of the default active tools (always visible to the AI). The AI calls it to discover what tools are available before using them.

The endpoint has three response modes to minimize context usage:

1. **Overview** (no params): Returns category names and counts only. No tool data.
2. **Search/category** (query or category): Returns compact list (toolName + description + aliases), capped at 25 results.
3. **Detail** (toolName): Returns full metadata including parameter JSON schema for a single tool.

### Two-tier tool system

- **Active tools**: Visible to the AI in its tool list. Default: 8 core tools.
- **Enabled tools**: Allowed to run when called. Default: all tools enabled.

The AI sees only active tools, but can discover and request activation of enabled tools via `tool-help`. Users configure both tiers in the tools modal (chat settings).

---

## Database

### Migrations

Schema changes in `src/app/api/[locale]/system/db/db.ts` require generating and running a migration:

```bash
npx drizzle-kit generate   # generate migration files from schema changes
npx drizzle-kit migrate    # apply pending migrations
```

`vibe dev` and `vibe start` run migrations automatically on startup, so in normal development you don't need to run and generate them manually.

### SQL access

Use `vibe sql` (alias for `system_db_sql_POST`) to run SQL directly:

```bash
vibe sql "SELECT * FROM users LIMIT 10"
vibe sql --queryFile="./queries/report.sql"
vibe sql "UPDATE users SET name='test' WHERE id=1" --dryRun=true
```

The `sql` and `db:sql` aliases both work. The first positional argument maps to `query`. Use `--queryFile` to pass a path to a `.sql` file instead. Add `--dryRun=true` to preview without applying changes.

Requires an authenticated admin user (session or `VIBE_ADMIN_USER_EMAIL`).
