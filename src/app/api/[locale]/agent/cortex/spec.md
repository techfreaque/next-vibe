# Cortex — Shared Brain Specification

## What Cortex Is

Cortex is a persistent, path-addressable knowledge store shared between the user and the AI. It is the AI's long-term memory, the user's second brain, and the coordination layer between all agents (chat AI, dreamer, autopilot, sub-agents, skills).

The user and the AI are equal co-authors. The user writes via the UI. The AI writes via tools. Neither owns it — both inhabit it. Every session, the AI reads cortex to know who it's talking to. Every session, it updates cortex with what it learned. Over time, it becomes an increasingly precise model of this specific human's life, work, values, and goals.

The long-term vision: cortex replaces Google Drive, Notion, and a therapist's notes simultaneously — because it is the place where human context lives and where AI understanding deepens.

---

## Core Principle

**The AI edits its own context.**

The system prompt is not static configuration written by developers. It is a living document assembled from cortex at runtime. When the AI writes to `/memories/`, it is literally rewriting the part of its own context that describes who it's talking to. When it updates `/memories/life/career.md`, it is updating the signal it will receive at the start of every future conversation.

This is the loop that makes it symbiotic: the AI understands more → it writes better memories → next session it understands even more.

---

## Filesystem Model

Cortex is a virtual filesystem. Every node is a path. Directories are containers. Files are content.

```
/
├── memories/          — AI's understanding of the user (AI-primary, user-editable)
│   ├── identity/      — Who the user is
│   ├── expertise/     — What they know and can do
│   ├── context/       — Their current situation
│   └── life/          — Their real-world goals across 6 areas
│       ├── career.md
│       ├── health.md
│       ├── relationships.md
│       ├── finances.md
│       ├── growth.md
│       └── purpose.md
│
├── documents/         — User's working content (user-primary, AI-editable)
│   ├── inbox/         — Unprocessed captures
│   ├── projects/      — Active work
│   ├── knowledge/     — Permanent reference
│   ├── journal/       — Dated entries
│   └── templates/     — Reusable structures
│
├── threads/           — Virtual. Chat history materialized as searchable nodes
├── skills/            — Virtual. User-created + system skills as nodes
├── tasks/             — Virtual. Cron/background tasks as nodes
├── uploads/           — Virtual. Attached files metadata
└── searches/          — Virtual. Web search history by month
```

**Design rules:**

- Files are atomic: one idea, one file, ideally under 200 words
- Paths are permanent identifiers — don't rename without reason
- Frontmatter carries structured metadata (priority, tags, archived, template-hash, last-dreamed, last-autopilot)
- Virtual mounts (`/threads/`, `/skills/`, etc) are read-only materializations of other tables — they exist for embedding and search, not direct manipulation

---

## System Prompt Architecture

### Fragment Model

The system prompt is assembled from fragments at runtime. Each fragment has:

- `id` — stable identifier
- `placement` — `leading` (static, once) or `trailing` (dynamic, injected before each AI turn)
- `priority` — render order (lower = earlier)
- `build(data) → string` — renders the fragment given loaded data

Cortex is a `trailing` fragment at priority 190. It rebuilds every turn from fresh data.

### Per-Folder Context Sections

Each root folder type in cortex has its own dedicated section in the system prompt, assembled differently:

**`/memories/` — Full content, priority-ranked**

- Every active (non-archived) memory file is included verbatim
- Sorted by: `priority` frontmatter (desc) → `updatedAt` (desc)
- Pinned files (see Pinning) appear first, always
- Subject to per-section token budget
- Each file shown as: `[filename|P:priority] content`

**`/documents/` — Tree only, not content**

- A trimmed directory tree: folder names + file counts
- Even slot allocation per subdirectory (prevents one big subdir drowning others)
- No file content inline — AI uses `cortex-read` to fetch on demand
- Slots capped to keep token cost predictable

**`/threads/` — Semantic chunks, not full history**

- Top N thread chunks retrieved by vector similarity to the current conversation
- Not the full thread list — only chunks semantically relevant to this turn
- Each chunk: thread title + relevant excerpt + recency
- Volume controlled by thread token budget (separate from memory budget)

**`/tasks/` — Recent + active only**

- Shows up to a configured limit of most-recent active tasks
- Completed tasks excluded unless explicitly requested
- Format: task name + status + next scheduled time

**`/skills/` — Names + taglines only**

- Listed compactly: skill name · tagline
- No content — AI knows skills exist, uses `cortex-read` to load details
- Top 6 user skills shown; system defaults excluded

**`/uploads/` and `/searches/`** — Count only, no inline content

### Token Budget

Every cortex section has a dedicated token budget. The total cortex budget is capped per-request.

```
Total cortex budget: configurable per skill/user (default: 4000 tokens)

Budget allocation (default):
  /memories/     → 2000 tokens  (highest priority — always shown)
  /threads/      →  800 tokens  (semantic chunks for this turn)
  /documents/    →  600 tokens  (tree only, cheap)
  /tasks/        →  300 tokens  (recent active, compact)
  /skills/       →  200 tokens  (names only)
  overhead       →  100 tokens  (headers, labels, examples)
```

**Trim policy**: When a section exceeds its budget, files are trimmed equally — not by dropping low-priority items first, but by proportionally shortening all items. This preserves the full shape of memory at the cost of depth, rather than silently dropping whole files. The AI sees a breadth-first view, not a depth-first one.

**Near-budget warning**: When total usage exceeds 90%, a visible indicator is added to the section: `[memory near limit — some content trimmed]`. The AI knows to be selective about what it writes vs. reads on demand.

**Per-skill override**: Skills can increase or decrease the total budget and per-section allocations. A research skill may want more thread context. A focused coding skill may want fewer memories.

---

## Pinning

Any file in `/memories/` can be pinned. Pinned files:

- Always appear at the top of their section, regardless of priority score
- Are never trimmed (they survive budget overflow)
- Show a pin indicator in the debug UI

**How pinning is set:**

- Via frontmatter: `pinned: true`
- The AI can set this itself: `cortex-edit path=/memories/identity/name.md frontmatter.pinned=true`
- The user can set it via the UI

**When the AI should pin:**

- Files it knows it will need in every conversation (name, role, active projects)
- Files containing user preferences that must never be forgotten
- Files the user has explicitly said are always relevant

The AI decides what to pin. It is editing its own context.

---

## Embedding Architecture

All cortex nodes (except directories) have a 3072-dimensional embedding vector (qwen3-embedding-8b).

**Embedding triggers:**

1. **Any write or edit** — every `cortex-write` and `cortex-edit` queues an embedding update, regardless of who triggered it (user, AI, dreamer, autopilot, API)
2. **Hash-gated** — `contentHash` (SHA-256 of path + content) is checked before the API call; if it matches the stored hash, the embedding is already current and no call is made
3. **Backfill** — background batch process fills NULL embeddings for nodes that were created before embedding was available (~100 nodes/min)
4. **Pre-computed** — system templates and built-in skills ship with embeddings baked into source files via `vibe gen`; zero API cost per user at seed time

**Search is hybrid:**

- Vector similarity (60% weight) + full-text search (40% weight)
- Path-type boost: memories 1.2x, skills 1.1x, others 1.0x
- Recency boost: linear decay over 30 days
- Result deduplication by path
- Minimum score threshold: 0.2

**Relevant context injection:**

- Before each AI turn, the last 8 messages are embedded (combined)
- Top 8 semantically-matching nodes retrieved across all types
- These appear as a `[Relevant Context]` section below memories
- Costs 0.1 credits per turn (the embedding query)
- If embeddings don't exist yet: section is omitted silently

---

## The AI as Author

The AI is not just a reader of cortex. It is a primary author. This is architecturally intentional.

**What the AI writes:**

- `/memories/*` — updates its own understanding of the user
- `/documents/inbox/` → routes to correct location
- `/documents/projects/` — creates and updates project files
- `/memories/life/*` — updates life area state after meaningful events
- Dream logs, autopilot logs, knowledge articles

**What the AI controls about its own context:**

- `priority` frontmatter on any memory file — affects its own render order
- `pinned: true` — guarantees inclusion even under budget pressure
- `archived: true` — removes from active context
- `tags` — for search and grouping
- `last-dreamed`, `last-autopilot` — coordination stamps between agents

**What the AI should NOT change:**

- Virtual mount sources (threads, tasks, uploads) — read-only
- User-marked files (files with no `template-hash` in frontmatter that were created by the user directly) — treat as sacred unless explicitly asked

---

## Agent Coordination

Multiple agents share cortex as their coordination medium. No explicit handoff files.

```
User (chat)
  ↓ writes goals, projects, context
  ↓ reads AI's memories to verify understanding

Dreamer (overnight)
  ↓ reads /threads/ (what happened today)
  ↓ reads /documents/inbox/ (what the user captured)
  ↓ updates /memories/life/* (what this means for the user's life)
  ↓ writes /documents/dream-log/YYYY-MM-DD.md

Autopilot (background)
  ↓ reads /memories/life/* (full life picture)
  ↓ reads /documents/dream-log/ (what dreamer found)
  ↓ reads /documents/projects/ (what's active)
  ↓ executes highest-leverage work
  ↓ writes /documents/autopilot-log/YYYY-MM-DD.md
  ↓ updates /memories/life/* (last-autopilot stamp)

Sub-agents / skills
  ↓ read relevant cortex sections via their own prompt fragment
  ↓ write results back to designated locations
```

The dreamer's output (dream log) is the autopilot's input. The autopilot's output (autopilot log + updated life areas) is the user's and next dreamer's input. Everything flows through cortex.

---

## Sync & Isolation

**Sync policy** is per-node (inherited from parent if unset):

- `SYNC` — replicated to connected remote instances (e.g. Hermes)
- `LOCAL` — stays on this instance only

**Incognito mode** — cortex fragment returns empty. No memories, no context, no logging. The AI has no persistent knowledge of the user in incognito sessions.

**Multi-user isolation** — all queries are scoped by `userId`. Cross-user reads are architecturally impossible.

---

## Evolution

Cortex is designed to grow. The folder structure, the section types, the budget allocations — all are configuration, not architecture. Adding a new root folder type means:

1. Define its section type (content / tree / semantic-chunks / count-only)
2. Assign its token budget
3. Add its renderer to the fragment builder
4. (Optional) add a virtual mount handler if it reads from another table

The system prompt does not need to be redesigned. A new section is additive.

The embedding pipeline does not need to change. Any new node type automatically gets embedded and becomes searchable.

The AI does not need to be retrained. It learns the new folder through the system prompt itself.
