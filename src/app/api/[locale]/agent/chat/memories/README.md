# Memory Management System

Persistent memory system where curated memories are always in the system prompt. The AI learns about the user and manages memories via tools.

## Quick Start

### Add a Memory

```bash
vibe post /agent/chat/memories \
  --data '{"content": "Profession: Software Engineer", "tags": ["profession"]}'
```

### List Memories

```bash
vibe get /agent/chat/memories
```

### AI Usage

```
User: "Remember that I prefer dark mode"
AI: [Uses add_memory tool]
AI: "I'll remember that you prefer dark mode."
```

## Architecture

```
memories/
├── db.ts           # Database schema
├── repository.ts   # Business logic & CRUD
├── definition.ts   # API definition (auto-generates REST + AI tools)
├── route.ts        # HTTP handlers
└── [id]/
    ├── definition.ts
    └── route.ts
```

## API Endpoints

| Endpoint         | Method | Description       |
| ---------------- | ------ | ----------------- |
| `/memories`      | GET    | List all memories |
| `/memories`      | POST   | Add memory        |
| `/memories/[id]` | PATCH  | Update memory     |
| `/memories/[id]` | DELETE | Delete memory     |

## Database Schema

```typescript
memories {
  id: uuid
  userId: uuid (not null, references users)
  content: text
  tags: jsonb
  sequenceNumber: integer
  priority: integer (0-100)
  metadata: jsonb
  createdAt: timestamp
  updatedAt: timestamp
}
```

## System Prompt Format

```
## User Memories
1. Profession: Software engineer specializing in Python
2. Preferences: Dark mode, coffee over tea

## Memory Tools
- add_memory(content, tags) - Store new facts
- update_memory(id, content) - Modify memory
- delete_memory(id) - Remove memory
```

## Configuration

```typescript
const MEMORY_LIMITS = {
  MAX_MEMORIES_PER_USER: 50,
  MAX_TOTAL_SIZE_BYTES: 50_000,
  SUMMARIZATION_THRESHOLD_BYTES: 45_000,
};
```

## Key Features

- **Always in Context** - Auto-loaded in every AI interaction
- **AI Tools** - AI can add/update/delete memories
- **Auto-Summarization** - Warns at 45KB (ready for AI consolidation)
- **Access Tracking** - Tracks `lastAccessed` and `accessCount`

## Integration Points

### System Prompt Builder

Location: `src/app/api/[locale]/agent/ai-stream/system-prompt-builder.ts`

```typescript
const memorySummary = await generateMemorySummary({
  userId,
  logger,
});
// Injected between platform intro and formatting instructions
```

### Chat DB Export

Location: `src/app/api/[locale]/agent/chat/db.ts`

```typescript
export * from "./memories/db";
```

## Repository Functions

```typescript
// Core CRUD
getMemories({ userId, logger })
addMemory({ content, tags?, priority?, userId, logger })
updateMemory({ memoryId, content?, tags?, priority?, userId, logger })
deleteMemory({ memoryId, userId, logger })

// System Prompt
generateMemorySummary({ userId, logger })

// Analytics
getMemoryStats({ userId, logger })
```

## Testing

```bash
# List all memories
vibe get /agent/chat/memories

# Add a memory
vibe post /agent/chat/memories \
  --data '{"content": "Allergies: Peanuts", "tags": ["health"], "priority": 10}'

# Update memory
vibe patch /agent/chat/memories/[id] \
  --data '{"content": "Allergies: Peanuts and shellfish"}'

# Delete memory
vibe delete /agent/chat/memories/[id]

# Check in AI conversation
# Start chat and say: "What do you remember about me?"
```

## Future Enhancements

- **AI Summarization** - Consolidate memories when limits exceeded
- **Memory Categories** - Group by type (personal, technical, preferences)
- **Memory Sharing** - Share between team members
- **Semantic Search** - Find memories using embeddings
- **Analytics Dashboard** - Most accessed, usage over time

## Notes

- Memories are automatically loaded into system prompts
- Each user has independent memory storage
- Cascade deletes when user is deleted
- Graceful degradation if memory loading fails
- All endpoints auto-generate as AI tools via definition-driven UI
