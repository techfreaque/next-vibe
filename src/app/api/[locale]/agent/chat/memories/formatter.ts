/**
 * Memory Formatting Utilities
 * Isomorphic functions that work on both client and server
 * IMPORTANT: No database imports or server-only code allowed
 */

import { MEMORY_DELETE_ALIAS, MEMORY_UPDATE_ALIAS } from "./[id]/definition";
import { type MemoriesList, MEMORY_ADD_ALIAS } from "./definition";

/**
 * Format memory summary for system prompt (isomorphic - works on client and server)
 * Single source of truth for memory formatting
 */
export function formatMemorySummary(memoriesList: MemoriesList): string {
  // Always include memory management instructions, even with 0 memories
  if (memoriesList.length === 0) {
    return `## User Memories (0)
No memories stored yet.

**Legend:** ID=memory identifier (starts at 0) | P=priority (0-100, higher=more important) | Age=when added

## Memory Management
**Use memory tools to store important user information across conversations**

**Tools:**
- \`${MEMORY_ADD_ALIAS}\` - Store NEW facts only
- \`${MEMORY_UPDATE_ALIAS}\` - Merge/improve existing (use ID number)
- \`${MEMORY_DELETE_ALIAS}\` - Remove wrong/outdated

**What to remember:**
- User preferences (name, location, interests)
- Important facts shared by user
- Ongoing projects or goals
- Communication preferences

**What NOT to remember:**
- Temporary conversation context
- Common knowledge
- Things that change frequently

**Auto-consolidate when you see >2 similar memories (>80% content overlap)**`;
  }

  // Format as numbered list with IDs, priority, and recency
  const summary = memoriesList
    .map((memory, index) => {
      const memoryNum = memory.memoryNumber;
      const priority = memory.priority ?? 0;
      const age = getRelativeTime(memory.createdAt ? new Date(memory.createdAt) : new Date());
      return `${index + 1}. [ID:${memoryNum} | P:${priority} | ${age}] ${memory.content}`;
    })
    .join("\n");

  return `## User Memories (${memoriesList.length})
${summary}

**Legend:** ID=memory identifier (starts at 0) | P=priority (0-100, higher=more important) | Age=when added

## Memory Management (All memories already loaded above)
**Auto-consolidate when you see >2 similar memories (>80% content overlap)**

**Tools:**
- \`${MEMORY_ADD_ALIAS}\` - Store NEW facts only
- \`${MEMORY_UPDATE_ALIAS}\` - Merge/improve existing (use ID number)
- \`${MEMORY_DELETE_ALIAS}\` - Remove wrong/outdated

**Consolidation Examples:**
1. "User likes coffee" + "Drinks coffee daily" → Update to: "Likes coffee, drinks daily"
2. "Lives in Berlin" + "Berlin resident" + "From Berlin" → Update first, delete others
3. "Testing tools" + "Tool testing" + "Tested all tools" → Merge into one comprehensive memory

**Rules:**
- >2 memories about same topic with >80% overlap = consolidate immediately
- When consolidating: UPDATE most recent/highest priority, DELETE duplicates
- Check priority (P:) and age before deciding which to keep`;
}

// Helper to get relative time (isomorphic)
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return "now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return `${diffDays}d ago`;
}
