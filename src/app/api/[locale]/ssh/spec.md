# Machine Access — Specification

> Gives the AI agent and admin users terminal access to Linux machines.
>
> Two backends, same tool surface:
>
> - **Local** (`LOCAL_MODE=true`) — `child_process` on the host machine, running as the current OS user the app process runs as. Zero config. Default for self-hosted VPS.
> - **SSH** — connects to remote machines via ssh2. For multi-server setups.
>
> `connectionId` absent → local. `connectionId` present → SSH.

---

## Motivation

Machine access extends the AI chat to real server ops: deploy code, tail logs, manage services, edit configs — all from a chat conversation.

In LOCAL_MODE the app already runs as a real Linux user (whoever launched it). No separate agent user, no sudo wrangling, no key management. The AI just runs commands as that same user. Simple.

For admins who want to give the AI access to other machines, SSH connections work as before.

All endpoints are definition-driven → automatically become AI tools via the existing tools-loader. All endpoints get `widget.tsx` files → accessible from the admin UI.

---

## Core concepts

**Current process user (LOCAL_MODE)** — the OS user running the Next.js process (e.g. `max`, `deploy`, `www-data`). The app uses `child_process.exec` with no user-switching. What the process user can do, the AI can do. Admins control permissions at the OS level by choosing which user to run the app as.

**SSH connection** — a stored SSH config (host, port, user, auth). Persists in DB. One or many per admin user. Used for remote machines.

**Session (SSH only)** — live `ssh2.Client` instance, kept in memory, keyed by `connectionId + threadId`. 5 min idle TTL. Reused across calls in the same chat thread.

**PTY session (SSH only)** — pseudo-terminal for interactive/long-running processes (REPLs, `top`, `tail -f`). AI writes input, reads buffered output.

**Linux OS user management** — admin-only endpoints to create/list/delete/lock Linux accounts on the host. Only for LOCAL_MODE. Uses `useradd`, `userdel`, `usermod`, `passwd` via child_process.

---

## Module structure

```
src/app/api/[locale]/ssh/
├── spec.md                          ← this file
├── enum.ts                          ← SshAuthType, SshSessionStatus, SshCommandStatus, ExecBackend
├── db.ts                            ← Drizzle: ssh_connections table
├── repository.ts                    ← connection CRUD, SSH session pool
│
├── exec/
│   ├── definition.ts                ← POST: run command (local or SSH)
│   ├── repository.ts
│   ├── route.ts
│   ├── widget.tsx                   ← command runner UI with output display
│   └── i18n/{de,en,pl}/index.ts
│
├── connections/
│   ├── list/
│   │   ├── definition.ts
│   │   ├── repository.ts
│   │   ├── route.ts
│   │   ├── widget.tsx               ← connection list + create button
│   │   └── i18n/{de,en,pl}/index.ts
│   ├── create/
│   │   ├── definition.ts
│   │   ├── repository.ts
│   │   ├── route.ts
│   │   ├── widget.tsx               ← create form
│   │   └── i18n/{de,en,pl}/index.ts
│   ├── [id]/
│   │   ├── definition.ts            ← GET, PATCH, DELETE
│   │   ├── repository.ts
│   │   ├── route.ts
│   │   ├── widget.tsx               ← detail + edit + delete
│   │   └── i18n/{de,en,pl}/index.ts
│   └── test/
│       ├── definition.ts
│       ├── repository.ts
│       ├── route.ts
│       ├── widget.tsx               ← connectivity test result card
│       └── i18n/{de,en,pl}/index.ts
│
├── session/                         ← SSH PTY only (no widget needed — terminal widget covers this)
│   ├── open/
│   │   ├── definition.ts
│   │   ├── repository.ts
│   │   └── route.ts
│   ├── close/
│   │   ├── definition.ts
│   │   ├── repository.ts
│   │   └── route.ts
│   ├── write/
│   │   ├── definition.ts
│   │   ├── repository.ts
│   │   └── route.ts
│   └── read/
│       ├── definition.ts
│       ├── repository.ts
│       └── route.ts
│
├── terminal/
│   ├── definition.ts                ← GET: terminal session page (no server logic, just renders widget)
│   ├── repository.ts
│   ├── route.ts
│   ├── widget.tsx                   ← full PTY terminal UI (xterm.js in browser)
│   └── i18n/{de,en,pl}/index.ts
│
├── files/
│   ├── list/
│   │   ├── definition.ts
│   │   ├── repository.ts
│   │   ├── route.ts
│   │   ├── widget.tsx               ← file browser (tree + list)
│   │   └── i18n/{de,en,pl}/index.ts
│   ├── read/
│   │   ├── definition.ts
│   │   ├── repository.ts
│   │   ├── route.ts
│   │   ├── widget.tsx               ← file content viewer with syntax highlight
│   │   └── i18n/{de,en,pl}/index.ts
│   └── write/
│       ├── definition.ts
│       ├── repository.ts
│       ├── route.ts
│       ├── widget.tsx               ← file editor (textarea + save)
│       └── i18n/{de,en,pl}/index.ts
│
├── linux/
│   └── users/
│       ├── list/
│       │   ├── definition.ts
│       │   ├── repository.ts
│       │   ├── route.ts
│       │   ├── widget.tsx           ← OS user list with lock/unlock/delete actions
│       │   └── i18n/{de,en,pl}/index.ts
│       ├── create/
│       │   ├── definition.ts
│       │   ├── repository.ts
│       │   ├── route.ts
│       │   ├── widget.tsx           ← create OS user form
│       │   └── i18n/{de,en,pl}/index.ts
│       └── [username]/
│           ├── definition.ts        ← DELETE, POST lock, POST unlock
│           ├── repository.ts
│           ├── route.ts
│           └── i18n/{de,en,pl}/index.ts
│
└── i18n/
    ├── de/index.ts
    ├── en/index.ts
    └── pl/index.ts
```

### Admin pages

```
src/app/[locale]/admin/ssh/
├── layout.tsx                       ← SSH admin section layout with nav tabs
├── page.tsx + page-client.tsx       ← redirects to /ssh/terminal (local) or /ssh/connections
├── terminal/
│   └── page.tsx + page-client.tsx   ← full-page terminal (EndpointsPage + terminal/definition)
├── connections/
│   ├── page.tsx + page-client.tsx   ← connection list
│   └── [id]/
│       └── page.tsx + page-client.tsx  ← connection detail/edit
├── files/
│   └── page.tsx + page-client.tsx   ← file browser (local or SSH)
└── users/
    └── page.tsx + page-client.tsx   ← OS user management (LOCAL_MODE only)
```

---

## Enums (`enum.ts`)

```typescript
export enum SshAuthType {
  PASSWORD = "PASSWORD",
  PRIVATE_KEY = "PRIVATE_KEY",
  KEY_AGENT = "KEY_AGENT",
}

export enum SshSessionStatus {
  IDLE = "IDLE",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  ERROR = "ERROR",
}

export enum SshCommandStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  TIMEOUT = "TIMEOUT",
}

export enum ExecBackend {
  LOCAL = "LOCAL", // child_process as current process user
  SSH = "SSH", // ssh2 to remote machine
}
```

---

## Database schema (`db.ts`)

### `ssh_connections` — SSH mode only

| Column          | Type    | Notes                                          |
| --------------- | ------- | ---------------------------------------------- |
| id              | uuid PK |                                                |
| userId          | uuid FK | owning admin user                              |
| label           | text    | e.g. "prod-web-01"                             |
| host            | text    |                                                |
| port            | int     | default 22                                     |
| username        | text    |                                                |
| authType        | text    | SshAuthType enum                               |
| encryptedSecret | text    | AES-256-GCM encrypted password or PEM key      |
| passphrase      | text    | optional encrypted passphrase for PEM key      |
| fingerprint     | text    | stored on first connect, checked on reconnect  |
| isDefault       | bool    | default connection for this user's AI sessions |
| notes           | text    |                                                |
| createdAt       | ts      |                                                |
| updatedAt       | ts      |                                                |

Secrets encrypted with `AES-256-GCM` using `SSH_SECRET_KEY` env var. Never returned by any API.

### In-memory SSH session pool (NOT persisted)

```typescript
interface SshSessionEntry {
  sessionId: string;
  connectionId: string;
  threadId: string | null;
  client: ssh2.Client;
  ptyStream: ssh2.ClientChannel | null;
  outputBuffer: string; // ring buffer, max 64 KB
  status: SshSessionStatus;
  idleTimer: NodeJS.Timeout;
  openedAt: Date;
  lastActivityAt: Date;
}
// Map<sessionId, SshSessionEntry>
```

Sessions are lost on process restart. The AI reopens them transparently on next call.

---

## Endpoints

### `POST /ssh/exec` — **tool: `ssh_exec_POST`** ← PRIMARY AI TOOL

Run a single shell command. Backend selected by presence of `connectionId`.

**Request:**

```
connectionId?  — omit → LOCAL backend; provide → SSH backend
command        — shell command string
timeoutMs?     — default 30 000, max 300 000
workingDir?    — cd to this path before running
env?           — { KEY: "value" } extra env vars merged with process env
```

**Response:**

```
stdout         — string, capped at max output bytes
stderr         — string, capped at max output bytes
exitCode       — number
status         — SUCCESS | ERROR | TIMEOUT
durationMs     — number
backend        — LOCAL | SSH
sessionId?     — SSH only: session used (created or reused)
truncated?     — true if output was capped
```

**Local behaviour:** `child_process.exec(command, { cwd, env })` as the current process user. No user switching. `workingDir` validated as absolute path, no `..` traversal.

**SSH behaviour:** opens/reuses a persistent session keyed by `connectionId + threadId`. Shell state (cwd, env) persists within a thread session when `keepSession: true` (default).

**Output truncation:** stdout and stderr capped at `LOCAL_MAX_OUTPUT_BYTES` / `SSH_MAX_OUTPUT_BYTES` (default 32 KB each). If truncated, `truncated: true` and last line is `[output truncated — use ssh_files_read_GET to retrieve full output]`.

---

### `GET /ssh/connections/list` — **tool: `ssh_connections_list_GET`**

All SSH connections for the requesting user. No secret fields returned.

**Response:** `[{ id, label, host, port, username, authType, isDefault, fingerprint, notes, createdAt }]`

---

### `POST /ssh/connections/create` — **tool: `ssh_connections_create_POST`**

Save a new SSH connection.

**Request:**

```
label, host, port (default 22), username, authType,
secret         — password or PEM private key (encrypted immediately on arrival)
passphrase?    — PEM passphrase (encrypted)
isDefault?     — bool
notes?
```

**Response:** connection record (no secret fields).

---

### `GET /PATCH /DELETE /ssh/connections/[id]` — **tools: `ssh_connections_id_GET/PATCH/DELETE`**

- **GET**: connection detail (no secrets).
- **PATCH**: update any field. If `secret` provided, re-encrypt and store.
- **DELETE**: remove connection, close any open sessions using it.

---

### `POST /ssh/connections/test` — **tool: `ssh_connections_test_POST`**

Connect and immediately disconnect. Updates `fingerprint` on success.

**Request:** `{ connectionId, acknowledgeNewFingerprint?: boolean }`

**Response:** `{ success, latencyMs, serverFingerprint, error? }`

Fails with `FINGERPRINT_CHANGED` error type if stored fingerprint no longer matches unless `acknowledgeNewFingerprint: true`.

---

### `POST /ssh/session/open` — **tool: `ssh_session_open_POST`**

Open a PTY session for interactive use. SSH only.

**Request:** `{ connectionId, name?, cols? (default 220), rows? (default 50) }`

**Response:** `{ sessionId, status, shell }`

---

### `POST /ssh/session/write` — **tool: `ssh_session_write_POST`**

Send input to an open PTY session.

**Request:** `{ sessionId, input, raw? (default false — appends newline) }`

**Response:** `{ ok }`

---

### `GET /ssh/session/read` — **tool: `ssh_session_read_GET`**

Drain buffered PTY output.

**Request:** `{ sessionId, waitMs? (default 500, max 5000), maxBytes? (default 16 KB) }`

**Response:** `{ output, eof, status }`

---

### `POST /ssh/session/close` — **tool: `ssh_session_close_POST`**

Close a PTY or exec session.

**Request:** `{ sessionId }` → **Response:** `{ ok }`

---

### `GET /ssh/terminal` — widget-only, no AI tool

Server-side shell/pass-through for the browser terminal widget. The definition renders the `TerminalContainer` widget. No meaningful server response body — the widget opens its own WebSocket/SSE connection to the PTY for real-time I/O.

---

### `GET /ssh/files/list` — **tool: `ssh_files_list_GET`**

List directory contents.

**Request:** `{ connectionId?, path (default "~") }`

**Response:** `{ entries: [{ name, type (file|dir|symlink), size, permissions, modifiedAt }] }`

Local: `fs.readdir` with `stat` per entry. SSH: SFTP `readdir`.

---

### `GET /ssh/files/read` — **tool: `ssh_files_read_GET`**

Read a text file.

**Request:** `{ connectionId?, path, maxBytes? (default 64 KB, max 512 KB), offset? }`

**Response:** `{ content, size, truncated, encoding }`

Local: `fs.readFile`. SSH: SFTP `createReadStream`.

---

### `POST /ssh/files/write` — **tool: `ssh_files_write_POST`**

Write or overwrite a file.

**Request:** `{ connectionId?, path, content, createDirs? (default false) }`

**Response:** `{ ok, bytesWritten }`

Local: `fs.writeFile` (as current process user). SSH: SFTP `createWriteStream`.

---

### `GET /ssh/linux/users/list` — **tool: `ssh_linux_users_list_GET`** (LOCAL_MODE + ADMIN)

List OS user accounts on the host (uid ≥ 1000).

**Response:** `[{ username, uid, gid, homeDir, shell, groups, locked }]`

Parsed from `/etc/passwd` + `groups <username>` + `passwd -S <username>`.

---

### `POST /ssh/linux/users/create` — **tool: `ssh_linux_users_create_POST`** (LOCAL_MODE + ADMIN)

Create a new OS user account.

**Request:**

```
username      — lowercase, alphanumeric + hyphen, 1–32 chars
groups?       — extra groups e.g. ["docker", "www-data"]
shell?        — default /bin/bash
homeDir?      — default /home/{username}
sudoAccess?   — bool, default false
```

**Response:** `{ ok, uid, gid, homeDir, shell }`

Runs: `useradd --create-home --shell <shell> [--groups <groups>] <username>`

---

### `DELETE /ssh/linux/users/[username]` — **tool: `ssh_linux_users_username_DELETE`** (LOCAL_MODE + ADMIN)

Delete an OS user.

**Request:** `{ removeHome? (default false) }` → **Response:** `{ ok }`

Refuses uid < 1000 or the current process user.

---

### `POST /ssh/linux/users/[username]/lock` / `unlock` — **tools: `ssh_linux_users_username_lock/unlock_POST`** (LOCAL_MODE + ADMIN)

Lock or unlock password login for an OS user.

**Response:** `{ ok }`

---

## Widget descriptions

### `exec/widget.tsx` — Command Runner

A split-pane UI:

- **Top half**: text input for the command, connection selector (SSH connections or "Local"), working directory input, timeout selector, Run button.
- **Bottom half**: scrollable output area showing `stdout` in white, `stderr` in amber/red, exit code badge, duration, backend badge (LOCAL/SSH). Output preserves whitespace/monospace.
- **History**: collapsible list of previous commands run in this session (client-side only).
- On submit: calls `ssh_exec_POST`, streams response into output area.

### `terminal/widget.tsx` — Full PTY Terminal

A browser-based terminal using **xterm.js** (`@xterm/xterm` + `@xterm/addon-fit`).

- Renders a full xterm.js instance sized to fill the widget container.
- Connection selector at the top (Local or SSH connection).
- On mount / connection change: calls `ssh_session_open_POST` to get a `sessionId`.
- **Input**: xterm.js `onData` → calls `ssh_session_write_POST` with raw bytes.
- **Output polling**: `setInterval` every 100ms → calls `ssh_session_read_GET` → writes output into xterm.js terminal.
- Resize: `ResizeObserver` on container → `addon-fit` → calls `PATCH /ssh/session/[id]/resize` (or pass cols/rows to next write).
- Disconnect button: calls `ssh_session_close_POST`.
- Widget definition has no meaningful request/response fields — it is purely an interactive widget. The definition exists so it appears in the admin nav and can be navigated to from other widgets.

### `files/list/widget.tsx` — File Browser

- Path breadcrumb bar at the top with back navigation.
- Directory listing as a table: icon (file/dir/symlink), name, size, permissions, modified date.
- Click directory → updates path form field, resubmits.
- Click file → navigates to `files/read` widget for that path.
- "New file" and "Upload" buttons in header.
- Connection selector (Local or SSH).

### `files/read/widget.tsx` — File Viewer / Editor

- Displays file content in a `<pre>` block with monospace font, line numbers.
- "Edit" button switches to textarea edit mode.
- In edit mode: "Save" → calls `ssh_files_write_POST`. "Cancel" → back to view mode.
- Breadcrumb with link back to directory.
- File size, encoding, truncation warning if applicable.

### `connections/list/widget.tsx` — SSH Connections List

- Table of connections: label, host:port, username, auth type, default badge, last tested, status.
- "Add connection" button → navigates to `connections/create` widget.
- Row click → navigates to `connections/[id]` detail widget.
- "Test" button per row → calls `connections/test`, shows latency inline.
- Delete button per row with confirmation.

### `connections/create/widget.tsx` & `connections/[id]/widget.tsx` — Connection Form

- Form: label, host, port, username, auth type selector.
- Auth type drives visible fields: password input, PEM key textarea, or "use SSH agent" note.
- Optional passphrase field.
- "Default connection" toggle.
- Notes textarea.
- "Test connection" button before saving.
- Fingerprint change warning dialog if test returns `FINGERPRINT_CHANGED`.

### `linux/users/list/widget.tsx` — OS User Management

- Table: username, uid, home dir, shell, groups, locked status.
- Lock/unlock toggle per row.
- Delete button per row (with confirmation, refuses current process user).
- "Create user" button → navigates to `linux/users/create` widget.
- Only visible/accessible when `LOCAL_MODE=true`.

### `linux/users/create/widget.tsx` — Create OS User Form

- Username input (validated pattern).
- Groups multi-select (common groups pre-listed: docker, www-data, sudo, etc.).
- Shell selector.
- Home directory input (auto-filled from username).
- Sudo access toggle (off by default, labelled as discouraged).

---

## Session lifecycle (SSH)

```
First exec/session.open with connectionId
  → pool.get(connectionId + threadId) — miss
  → ssh2.Client.connect(decryptCredentials(connection))
  → on 'ready': store in pool, start idle timer
  → execute

Subsequent calls (same connectionId + threadId)
  → pool.get → hit → reuse → reset idle timer

Idle 5 min
  → client.end() → remove from pool

Thread closed / logout
  → close all sessions for threadId

Process restart
  → pool empty → next call reconnects
```

SSH keep-alive: every 30s. On connection drop: entry marked `ERROR`, next call reconnects silently.

---

## Security

### Access control

- All SSH endpoints: `UserRole.ADMIN` required.
- SSH connections: `userId` scoped — users only see their own connections.
- Local exec: runs as current process user. Admin controls the process user at the OS level.
- Linux user management: `LOCAL_MODE=true` + `UserRole.ADMIN` required. Refuses uid < 1000 and current process user.

### SSH secret storage

- Passwords/keys encrypted with `AES-256-GCM` before DB insert.
- Key: `SSH_SECRET_KEY` env (32-byte hex, required for SSH mode).
- Decrypted only at the moment of `ssh2.Client.connect()`. Never logged or returned.

### Local exec sandboxing

- No user switching — commands run exactly as the process user.
- `workingDir` validated: absolute path, no `..` segments.
- `env` values are passed as a flat object to `child_process.exec`, not interpolated into the command string.
- Admins choosing what user to run the app as is the security boundary.

### Host fingerprint (SSH)

- Stored on first successful connect.
- Every reconnect checks: mismatch → `FINGERPRINT_CHANGED` error → session blocked until admin acknowledges.

### Audit log

- Every `exec` call: `userId`, `backend`, `connectionId?`, `command` (truncated to 500 chars), `exitCode`, `durationMs`, `timestamp`.
- PTY `write` calls: content truncated to 200 chars.
- Linux user management: full arguments logged.
- All via existing `EndpointLogger`.

---

## Environment variables

```env
# Local exec
LOCAL_MAX_OUTPUT_BYTES=32768        # per-stream cap (default: 32 KB)
LOCAL_DEFAULT_TIMEOUT_MS=30000      # exec timeout (default: 30 s)

# SSH
SSH_SECRET_KEY=<32-byte hex>        # required for SSH mode
SSH_IDLE_TIMEOUT_MS=300000          # session idle TTL (default: 5 min)
SSH_MAX_OUTPUT_BYTES=32768          # per-stream cap (default: 32 KB)
SSH_DEFAULT_TIMEOUT_MS=30000        # exec timeout (default: 30 s)
```

---

## Dependencies

- `ssh2` + `@types/ssh2` — SSH client (exec, PTY, SFTP). SSH mode only.
- `@xterm/xterm` + `@xterm/addon-fit` — browser terminal. Terminal widget only.
- Node built-in `child_process` — local exec.
- Node built-in `fs/promises` — local file ops.
- Node built-in `crypto` — AES-256-GCM.

---

## AI usage patterns

### LOCAL_MODE — self-hosted VPS

```
User: "Check disk usage"
AI:   ssh_exec_POST { command: "df -h && du -sh /var/* 2>/dev/null | sort -rh | head -20" }
      → formats result for user

User: "Create an account for my developer Alice"
AI:   ssh_linux_users_create_POST { username: "alice", groups: ["www-data"] }
      → "Created OS user alice (uid 1001)"

User: "Show me the nginx config"
AI:   ssh_files_read_GET { path: "/etc/nginx/nginx.conf" }
      → shows content
      → user asks to change something
AI:   ssh_files_write_POST { path: "/etc/nginx/nginx.conf", content: "...", createDirs: false }
      ssh_exec_POST { command: "nginx -t && systemctl reload nginx" }
```

### SSH — remote machines

```
User: "Deploy latest build on prod-web-01"
AI:   ssh_connections_list_GET → finds connectionId "abc"
      ssh_exec_POST { connectionId: "abc", command: "cd /app && git pull && npm ci --production && pm2 restart app" }
      ssh_exec_POST { connectionId: "abc", command: "pm2 status" }
      → summarises
```

---

## Build priority

1. **`ssh_exec_POST`** local backend — `child_process`, input validation, output capping
2. **`ssh_files_list/read/write_GET/POST`** local backend — `fs/promises`
3. **`exec/widget.tsx`** — command runner UI
4. **`files/*/widget.tsx`** — file browser, viewer/editor
5. **`linux/users/*`** — OS user management endpoints + widgets
6. **Admin pages** — `src/app/[locale]/admin/ssh/` layout + pages
7. **`ssh_connections` table** + encryption — SSH credential storage
8. **SSH connections CRUD** + widgets
9. **SSH exec backend** — session pool, keepalive
10. **SSH file ops** — SFTP backend
11. **`terminal/widget.tsx`** — xterm.js PTY terminal (depends on session endpoints)
12. **SSH PTY sessions** — `session/open/write/read/close`
13. **Fingerprint change detection**
