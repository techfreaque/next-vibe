# Memory System Spec

## Core Principle

Memory is the persistence layer of intelligence. A model without memory restarts from zero every conversation. The memory system ensures that facts, preferences, expertise, and ongoing context survive across threads, model switches, compaction, and time - and are delivered to the active model at the right moment in the right amount.

The system has three complementary mechanisms that work together: **explicit memories** (the current CRUD store), **semantic retrieval** (embedding-based search), and **compaction-integrated extraction**. Models self-manage memories via tools as before, but the system also extracts and retrieves automatically so nothing important is lost even when the model forgets to call a tool.

---

## Memory Types

Memories are typed by their behavioral contract - how they're injected, how they decay, and how they're managed:

```typescript
type MemoryType =
  | "procedural" // Permanent behavioral rules. Always injected, small, never decay.
  // Examples: "prefers TypeScript", "no bullet points", "response in German"
  | "semantic" // Stable facts about the user. Retrieved by relevance, not recency.
  // Examples: "senior backend developer", "building a SaaS called unbottled.ai"
  | "episodic" // Time-stamped experiences. Decay over time, retrieved by recency + relevance.
  // Examples: "mentioned hating dark mode on March 12", "asked about Rust last week"
  | "working"; // Thread-scoped context. Highest priority during thread, discarded after.
// Examples: "currently building the login form", "refactoring auth module"
```

Type is set at creation time (by model tool call or auto-extraction). It controls injection priority and token budget allocation.

---

## Memory Schema

The existing DB table gains a `type` column and an `embedding` vector column. All other fields remain.

```typescript
interface Memory {
  id: uuid
  userId: uuid
  memoryNumber: number          // auto-incrementing per user
  content: string               // the fact
  type: MemoryType              // new: procedural | semantic | episodic | working
  tags: string[]
  priority: number              // 0-100, higher = injected first within type
  isArchived: boolean
  isShared: boolean             // sync to remote instances
  embedding: vector(1536)       // new: pgvector for semantic search (null until indexed)
  threadId?: uuid               // new: set for working memories, scoped to thread lifetime
  expiresAt?: Date              // new: for episodic decay, null = never expires
  metadata: {
    source: "model" | "auto-extraction" | "compaction"  // how it was created
    confidence?: number         // auto-extraction only: 0-1
    lastAccessed?: Date
    accessCount: number
    syncId?: string
  }
  createdAt: Date
  updatedAt: Date
}
```

---

## Context Injection

At stream start, memories are injected into the system prompt in a defined priority order within a hard token budget.

### Injection Order (highest priority first)

1. **Working memories** for the current `threadId` - always injected fully, no budget competition
2. **Procedural memories** - always injected, sorted by priority desc
3. **Semantic memories** - retrieved by embedding similarity to the current user message (top-k by score)
4. **Episodic memories** - most recent first, filtered by `expiresAt > now`

### Token Budget

The budget cascade is: favorite `memoryLimit` → skill `memoryLimit` → user settings → default 1000 tokens.

Within the budget, working and procedural memories are guaranteed. Semantic and episodic fill the remaining space in order. If semantic + episodic exceed the remaining budget, semantic memories ranked by similarity score take priority over episodic recency.

### Format (unchanged from current)

```
[ID|P:priority|age] content [tags]
```

The system prompt fragment instructs the model to use memory tools proactively (unchanged behavior).

---

## Semantic Retrieval

Every memory has an `embedding` vector (pgvector). At stream start, the current user message is embedded and used to retrieve the most relevant semantic and episodic memories beyond what recency alone would surface.

**Embedding generation:**

- On memory create/update: async job generates and stores embedding
- On old memories without embeddings: background migration job
- Provider: same embedding model used elsewhere in the platform (configurable)

**Retrieval at stream start:**

- Embed current user message (or last N chars if long)
- Query `memories` table: cosine similarity, `type IN ('semantic', 'episodic')`, `isArchived = false`, `userId = current`
- Return top-k by score, k determined by remaining token budget
- Combine with procedural (always) and working (thread-scoped always)

**Memory scope** (configurable per skill/favorite):

```typescript
type MemoryScope = "thread" | "skill" | "global";
```

- `thread` - only working memories for this thread (effectively no long-term memory)
- `skill` - memories tagged with this skill ID + untagged global memories
- `global` - all user memories regardless of tag

Default is `global`. A focused coding tool might use `skill` scope to avoid injecting unrelated personal context.

---

## Auto-Extraction

After every assistant turn, a lightweight background pass checks whether the conversation produced anything worth storing as a memory. This runs async - it never blocks the response.

**Trigger conditions:**

- User message contains a personal fact, preference, or ongoing project mention
- Assistant response confirms or learns something about the user
- Tool result reveals user context (e.g. filesystem structure, git repo name)

**Extraction model:** a fast, cheap LLM (not the active conversation model). One focused call:

```
Given this exchange, what facts about the user, if any, are worth storing long-term?
Return a JSON array of { content, type, tags, confidence } or an empty array.
Only include facts that would be useful in a future unrelated conversation.
Threshold: confidence > 0.7.
```

**Deduplication:** before inserting, semantic similarity check against existing memories. If similarity > 0.9 to an existing memory, update the existing one (merge content if needed) rather than creating a duplicate.

**Source tracking:** auto-extracted memories have `metadata.source = "auto-extraction"` and `metadata.confidence` set. The model can see and manage these like any other memory.

---

## Compaction Integration

Compaction is a two-phase operation:

**Phase 1 - Memory extraction** (new)
Before summarizing, run a focused extraction pass on the messages being compacted:

- Same extraction model and prompt as auto-extraction
- Higher confidence threshold (0.6 instead of 0.7 - compaction is the last chance)
- Extracted memories tagged with `metadata.source = "compaction"`
- Deduplication against existing memories runs here too

**Phase 2 - Summarization** (existing)
Compress the conversation history into a compact summary. The summary can now be shorter because durable facts have been extracted to memory - it only needs to preserve conversational flow and recent context, not facts that will survive in memory anyway.

**Working memory cleanup:** when a thread's compaction runs, working memories for that `threadId` are promoted: if still relevant they're converted to `semantic` or `episodic`, otherwise archived.

---

## Model Self-Management (unchanged + extended)

Models continue to manage memories via the existing 5 tools:

- `memories-add` - store new fact, now accepts `type` field
- `memories-update id=N` - merge, fix, change priority or type
- `memories-delete id=N` - remove
- `memories-list` - full detail view
- `memories-search` - text + tag query

The model is instructed to:

- Set `type` explicitly when creating (procedural for behavioral rules, semantic for facts, episodic for time-stamped events)
- Use `working` type for thread-specific context that shouldn't persist globally
- Self-consolidate overlapping memories (existing behavior unchanged)
- Archive rather than delete when uncertain

Auto-extraction is the safety net - it catches what the model misses. Explicit tool calls are the high-confidence path - the model uses them when it's certain something matters.

---

## Memory Lifecycle

```
User message arrives
      ↓
[Injection] embed message → retrieve semantic + episodic → inject all types by priority within budget
      ↓
AI response generated
      ↓
[Auto-extraction] async: extract facts → deduplicate → store with source="auto-extraction"
      ↓
(if model called memory tools) → stored with source="model"
      ↓
(if compaction triggered) → Phase 1: extract from compacted messages → Phase 2: summarize
      ↓
(on thread end / working memory cleanup) → promote or archive working memories
```

---

## Memory Scope on Skills and Favorites

Skills and favorites declare memory behavior:

```typescript
// on Skill
memoryScope?: MemoryScope          // "thread" | "skill" | "global" (default: "global")
memoryLimit?: number               // token budget override
autoExtraction?: boolean           // whether to run auto-extraction (default: true)

// on Favorite (overrides skill)
memoryScope?: MemoryScope
memoryLimit?: number
autoExtraction?: boolean
```

User settings provide the global defaults. The cascade is:
`favorite → skill → user settings → system default`

A skill that should have no memory (stateless by design) sets `memoryScope: "thread"` and `autoExtraction: false`. Working memories still function within the thread - they just don't persist after.

---

## The Warning Threshold (unchanged)

When memory token usage exceeds 90% of the budget (`checkSelfManageNeeded()`), the model is warned in its system prompt to consolidate. This behavior is unchanged. The difference is that auto-extraction and compaction integration now prevent the store from growing uncontrolled in the first place - the model reaches this threshold less often.

---

## Remote Synchronization (unchanged)

Memories with `isShared: true` sync across instances via `fireAndForgetRemote()`. The `syncId` in metadata tracks sync state. Auto-extracted memories are not shared by default - only model-created memories with `isShared: true` or explicitly shared by the user sync remotely.

---

## Related Files

| File                                                  | Change                                                                           |
| ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| `agent/chat/memories/db.ts`                           | Add `type`, `embedding`, `threadId`, `expiresAt` columns                         |
| `agent/chat/memories/repository.ts`                   | Add embedding generation, semantic search, deduplication, auto-extraction runner |
| `agent/chat/memories/formatter.ts`                    | Type-aware sorting: working → procedural → semantic → episodic                   |
| `agent/chat/memories/system-prompt/prompt.ts`         | Add `type` field to tool instructions; update injection format                   |
| `agent/chat/memories/system-prompt/server.ts`         | Semantic retrieval at load time; scope filtering                                 |
| `agent/chat/skills/config.ts`                         | Add `memoryScope`, `autoExtraction` to Skill interface                           |
| `agent/chat/favorites/db.ts`                          | Add `memoryScope`, `autoExtraction` columns                                      |
| `ai-stream/repository/handlers/compacting-handler.ts` | Two-phase: extract memories before summarizing                                   |
| `ai-stream/repository/stream-setup.ts`                | Pass `memoryScope` into system prompt loading                                    |
