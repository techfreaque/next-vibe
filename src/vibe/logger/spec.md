# Logger

One logging surface for the whole platform — the same `EndpointLogger` API on server and
client, with console output everywhere plus optional file and DB sinks. Privacy-first: only
errors/warnings reach the DB, and they are truncated and deduplicated.

---

## The Logger

`EndpointLogger` is the single interface everything uses: `info`, `warn`, `error`, `vibe`
(special-formatted info), `debug` (only when the debug flag is on), and `isDebugEnabled`. All
methods take a message plus structured `LoggerMetadata` (strings, numbers, `Error`, nested
records — the one shape that flows through formatting and persistence).

`create-logger.ts` holds the shared core: formatting + console output, with file logging and DB
persistence **injected as callbacks** so the core carries no `node:fs` or server-only imports and
stays safe to bundle on the client. Two wrappers build on it:

- **`server.ts` → `createEndpointLogger`** — server code (repositories, routes, cron). Injects
  the file sink + DB persist.
- **`client.ts` → `createClientLogger`** — `"use client"` code. POSTs errors/warnings to the
  server (`error-monitor/client-log/`) for DB persistence; coerces metadata to schema-safe primitives.

`env-logger.ts` is a tiny standalone logger for environment validation that runs before the real
logger exists (browser + server safe).

---

## Sinks & Config

Console is always on (unless `mcpSilentMode`, set by the MCP server to silence stdout). The extra
sinks are env-driven (`debug.ts` reads them; all overridable in `.env`):

- `VIBE_LOG_TARGET` — `file | db | none`
- `VIBE_LOG_PATH` / `VIBE_LOG_FILE` / `VIBE_LOG_TIMESTAMP` (`elapsed | iso`) — file sink location/format
- Debug: `NEXT_PUBLIC_VIBE_DEBUG=true` or `vibe dev -v`

**File sink** (`file.ts`, lazy-imported to stay out of the static graph): writes to
`.tmp/.<name>.log`, one file per server mode; also owns log truncation and the
`--- server offline ---` hint. **Formatting** (`formatters.ts`, `colors.ts`): consistent
icon/ANSI styling (`formatStartup/Success/Error/…`), colors auto-disabled when not a TTY.

---

## DB Persistence — Error Monitor

Only `error`/`warn` persist, fire-and-forget and **never throwing** (best-effort; failures are
swallowed to avoid cascading). `db-persist.ts → persistErrorLog` writes to `error_logs`
(`error-monitor/db.ts`), deduplicated by **fingerprint** (sha256 of `level:errorType:message:meta`):
first sighting inserts; repeats upsert the same row, incrementing `occurrences` and bumping the
last-seen `createdAt`. Message/stack are truncated on write (`MAX_MESSAGE_LENGTH = 500`,
`MAX_STACK_LENGTH = 1000`) — no raw payloads or full traces persisted.

### `error_logs` schema

| Column        | Type        | Notes                                 |
| ------------- | ----------- | ------------------------------------- |
| `id`          | uuid PK     |                                       |
| `message`     | text        | Truncated to 500                      |
| `errorType`   | text\|null  |                                       |
| `stackTrace`  | text\|null  | Truncated to 1000                     |
| `metadata`    | jsonb       | `LoggerMetadata[]`, default `[]`      |
| `fingerprint` | text UNIQUE | Dedup key                             |
| `occurrences` | integer     | Incremented on repeat; default 1      |
| `resolved`    | boolean     | Admin-toggled; default false          |
| `level`       | enum        | `error \| warn`; default `error`      |
| `firstSeen`   | timestamp   |                                       |
| `createdAt`   | timestamp   | Last-seen (bumped on each occurrence) |

### Error-monitor endpoints (`error-monitor/`)

- **`client-log/`** — browser error-capture sink the client logger POSTs to.
- **`logs/`** — admin viewer (`widget.tsx`), filter by level / error type / resolved.
- **`cleanup/`** — daily cron task (`task.ts`, registered with the
  [task system](../unified-interface/tasks/spec.md)). Two-stage prune: delete rows older than
  `RETENTION_DAYS` (180), then if the table still exceeds `MAX_ROWS` (100K), delete the oldest excess.
- **`data-sources/`** — `error-logs-total` / `error-logs-errors` / `error-logs-warnings` counts.
