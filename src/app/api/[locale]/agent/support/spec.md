# Support System - Spec

## What This Is

Admin-to-admin support across vibe instances. A local vibe admin creates a support thread - it runs through the existing ws-provider protocol, so the thread lives on the remote (unbottled.ai). Both the local admin and the remote admin see it in their SUPPORT folder. They collaborate in the same thread.

No separate relay. No custom transport. The ws-provider protocol already handles thread creation and message delivery across instances.

Phase 1: admin-only (local admin ↔ remote admin).
Phase 2 (later): local customers can also open support threads.

---

## How It Works

Local vibe (in local mode) → POST to ws-provider/stream on unbottled.ai → thread created there with `rootFolderId: SUPPORT` → both sides subscribe to the thread's WS channel → messages flow bidirectionally via existing ws-provider protocol.

No new transport. No custom cross-instance HTTP. The ws-provider already does this.

The local user's `remoteConnections` record points to unbottled.ai - same record used for all other remote features.

---

## Access Control

**Admin-only, everywhere, no exceptions.**

- All support endpoints: `allowedRoles: [UserRole.ADMIN]`
- SUPPORT folder: `rolesView: [UserRole.ADMIN]`
- No customer access. No AI tool. No `escalate-to-human`.
- `allowRemoteControl` user setting: not needed - remove it.

Local mode user = admin of their instance → same access.
Prod cloud user = no access to support system whatsoever.

---

## SUPPORT Folder

`DefaultFolderId.SUPPORT` replaces `REMOTE`.

- `rolesView: [UserRole.ADMIN]`
- Threads in this folder are ws-provider threads - live on the remote instance
- Local admin sees their own support threads (their local view via WS)
- Remote admin sees all support threads from all connected instances
- Normal thread mechanics: messages, files, WS events - all via existing ws-provider

---

## DB: supportSessions

Minimal. Tracks session lifecycle - who opened it, who joined, status.

```
supportSessions {
  id                   UUID PK
  threadId             UUID            -- the remote thread ID (from ws-provider response)
  initiatorId          UUID → users.id -- local admin who opened the session
  initiatorInstanceUrl text            -- NEXT_PUBLIC_PROJECT_URL of local instance
  supporterId          UUID → users.id (null until joined, on remote side)
  status               "pending" | "active" | "closed"
  createdAt / updatedAt
}
```

The session row lives on the remote (unbottled.ai) - created when the ws-provider stream starts with `rootFolderId: SUPPORT`.

---

## Endpoints

All `allowedRoles: [UserRole.ADMIN]`.

### `sessions` - support queue

- Lists pending + active support sessions
- Remote admin: sees all sessions from all connected instances
- Local admin: sees their own sessions (by initiatorInstanceUrl)
- Widget: table with Join/Close, status, origin instance, time-ago

### `join` - remote admin claims a session

- Updates: status=active, supporterId=me
- Posts system message into thread via normal message flow
- Returns `{ threadId }` - admin navigates to thread, posts via ws-provider

### `close` - ends the session

- Updates status=closed
- Posts system message "Support session ended"
- Emits WS to support/sessions channel

---

## Flow

```
Local admin opens new thread with rootFolderId=SUPPORT
  → POST ws-provider/stream on unbottled.ai
  → thread created on unbottled with rootFolderId=SUPPORT
  → supportSessions row created on unbottled (status=pending)
  → WS event to remote support/sessions channel
  → local admin sees thread in their SUPPORT folder via WS subscription

Remote admin sees new session in queue
  → clicks Join
  → session status=active, supporterId set
  → system message posted to thread
  → both sides see it via WS

Both admins post messages normally
  → local: via ws-provider (existing protocol)
  → remote: direct post to thread (same instance as thread)

Either admin closes
  → session status=closed
  → system message in thread
```

---

## What Is Built / TODO

| Component                                                          | Status      |
| ------------------------------------------------------------------ | ----------- |
| ws-provider protocol (thread creation, message delivery)           | ✅ done     |
| `remoteConnections` infra                                          | ✅ done     |
| `supportSessions` DB table (strip old fields, new schema)          | ⬜ refactor |
| `sessions` endpoint (simplify)                                     | ⬜ refactor |
| `join` endpoint (simplify, remove allowRemoteControl)              | ⬜ refactor |
| `close` endpoint (simplify)                                        | ⬜ refactor |
| `SUPPORT` folder replacing `REMOTE`                                | ⬜ rename   |
| ws-provider/stream: support `rootFolderId: SUPPORT`                | ⬜ todo     |
| Remove `escalate`, `notify`, `session-joined`, `message` endpoints | ⬜ todo     |
| Remove `escalate-to-human` alias + from tool lists                 | ⬜ todo     |
| Remove `allowRemoteControl` user setting                           | ⬜ todo     |
| Admin support queue page                                           | ✅ exists   |

---

## Non-Goals (Phase 1)

- Customer-initiated support threads
- AI-triggered escalation
- `allowRemoteControl` / `escalate-to-human`
- Multi-supporter per session
- Session recording
