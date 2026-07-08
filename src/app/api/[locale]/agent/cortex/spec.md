# Cortex — Shared Brain

Cortex is the AI's long-term memory and the user's second brain. A persistent, path-addressable knowledge store — the coordination layer for all agents (chat, dreamer, autopilot, sub-agents, skills).

User and AI are equal co-authors. The user writes via UI. The AI writes via tools. Every session, the AI reads cortex to know who it's talking to, then updates it with what it learned. Over time it becomes an increasingly precise model of this specific human.

---

## Filesystem Model

```
/
├── memories/       real nodes in cortex_nodes — AI's understanding of the user
│   ├── identity/
│   ├── expertise/
│   ├── context/
│   └── life/       career, health, relationships, finances, growth, purpose
│
├── documents/      real nodes in cortex_nodes — user's working content
│   ├── inbox/
│   ├── projects/
│   ├── knowledge/
│   ├── journal/
│   └── templates/
│
├── threads/        virtual — chat history from chatThreads + chatMessages
├── skills/         virtual — user skills from customSkills
├── tasks/          virtual — cron/background tasks
├── uploads/        virtual — attached file metadata
└── searches/       virtual — web search history by month
```

**Real nodes** (`/memories/`, `/documents/`) live in `cortex_nodes`. The AI can write them. They sync across instances.

**Virtual mounts** are read-only materializations of other tables — they exist for search and system prompt injection only. No data is duplicated into `cortex_nodes`. The AI reads them via `cortex-read`; it cannot write to them directly. Skills are edited via the skills endpoint; threads via the thread endpoints; etc.

Files are atomic: one idea, one file, ideally under 200 words. Paths are permanent identifiers. Frontmatter carries structured metadata: `priority`, `tags`, `archived`, `pinned`, `template-hash`, `last-dreamed`, `last-autopilot`.

---

## System Prompt Assembly

The system prompt is assembled from cortex fragments at runtime. Cortex is a `trailing` fragment (priority 190) — it rebuilds every turn from fresh data. The AI edits its own context by writing to `/memories/`.

**Per-section rules:**

| Section                   | What's shown                             | Budget (default) |
| ------------------------- | ---------------------------------------- | ---------------- |
| `/memories/`              | Full content, priority-ranked            | 2000 tokens      |
| `/documents/`             | Trimmed directory tree only (no content) | 600 tokens       |
| `/threads/`               | Top N semantic chunks for this turn      | 800 tokens       |
| `/tasks/`                 | Recent active tasks only                 | 300 tokens       |
| `/skills/`                | Names + taglines only                    | 200 tokens       |
| `/uploads/`, `/searches/` | Count only                               | overhead         |

Total default budget: 4000 tokens. Per-skill override possible. When a section exceeds budget, all items are trimmed proportionally — breadth-first, not drop-first. At 90% total, a visible `[memory near limit]` marker is added so the AI knows to read on demand.

**Pinning:** any `/memories/` file can be pinned (`pinned: true` in frontmatter). Pinned files appear first and are never trimmed. The AI sets pins itself.

---

## Embeddings

All real nodes get a 3072-dimensional embedding (qwen3-embedding-8b). Embeddings are stored centrally in `cortex_nodes.embedding`. Virtual mount data is embedded when materialised into cortex nodes — but since virtual mounts are never written to `cortex_nodes`, they are **not** embedded via cortex. Each virtual mount domain manages its own embedding strategy if needed.

**Triggers:** every `cortex-write` and `cortex-edit` queues an embedding update. Hash-gated: `contentHash` (SHA-256 of path + content) is checked first — no API call if already current.

**Backfill:** background batch process fills NULL embeddings (~100 nodes/min).

**Search (hybrid):** vector similarity (60%) + full-text (40%). Path-type boost: memories 1.2×, skills 1.1×. Recency boost: linear decay over 30 days. Minimum score: 0.2.

**Relevant context injection:** before each AI turn, the last 8 messages are embedded; top 8 matching cortex nodes are retrieved and injected as `[Relevant Context]` below memories. Costs 0.1 credits/turn. Silently omitted if no embeddings exist yet.

---

## AI Authorship

The AI writes to `/memories/` and `/documents/`. It controls its own context via frontmatter (`priority`, `pinned`, `archived`, `tags`). It does not write to virtual mounts — those are owned by their native tables.

Files created directly by the user (no `template-hash` in frontmatter) are treated as sacred — the AI doesn't overwrite them unless explicitly asked.

---

## Agent Coordination

All agents share cortex as their coordination medium. No handoff files.

```
Chat AI      → writes /memories/ + /documents/
Dreamer      → reads /threads/, /documents/inbox/ → updates /memories/life/, writes dream logs
Autopilot    → reads /memories/life/, dream logs, /documents/projects/ → executes work, writes logs
Sub-agents   → read relevant sections via their skill prompt fragment
```

---

## Sync

Only real nodes (`/memories/`, `/documents/`) sync via the cortex providers. Virtual mounts are never written to `cortex_nodes` — each domain (skills, favorites, threads) syncs its own native table directly. Cortex virtual mounts are derived fresh at read time.

**Provider keys:** `memories` (paths under `/memories/`) and `documents` (paths under `/documents/`) — split so users opt into each independently. Nodes with `syncPolicy = LOCAL` never leave the instance.

**Deletes:** tombstones via `isDeleted = true` + bumped `updatedAt`. Tombstones propagate through cursor sync and are applied as deletes on the receiving side.

**Incognito:** sync suspended. Cortex fragment returns empty.

**Multi-user isolation:** all queries scoped by `userId`. Cross-user reads are architecturally impossible.

For cursor strategy, conflict resolution, loop prevention, and push/pull mechanics see [`../../remote-connection/sync/spec.md`](../../remote-connection/sync/spec.md).

---

## Evolution

Adding a new root folder type:

1. Define its section type (content / tree / semantic-chunks / count-only)
2. Assign its token budget
3. Add its renderer to the fragment builder
4. Add a virtual mount handler if it reads from another table

Everything else — embedding, search, sync — is automatic for real nodes. Virtual mounts manage their own data.
