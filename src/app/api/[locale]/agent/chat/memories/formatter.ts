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

**Tools:**
- \`${MEMORY_ADD_ALIAS}\` - Store NEW facts only
- \`${MEMORY_UPDATE_ALIAS}\` - Merge/improve existing (use ID number)
- \`${MEMORY_DELETE_ALIAS}\` - Remove wrong/outdated

**Remember:** User preferences, important facts, ongoing projects, communication style
**Don't remember:** Temporary context, common knowledge, frequently changing info

**Auto-consolidate:** When you see >2 similar memories with >80% content overlap, UPDATE the most recent/highest priority one and DELETE duplicates.`;
  }

  // Format as numbered list with IDs, priority, and recency
  const summary = memoriesList
    .map((memory, index) => {
      const memoryNum = memory.memoryNumber;
      const priority = memory.priority ?? 0;
      const age = getRelativeTime(
        memory.createdAt ? new Date(memory.createdAt) : new Date(),
      );
      return `${index + 1}. [ID:${memoryNum} | P:${priority} | ${age}] ${memory.content}`;
    })
    .join("\n");

  return `## User Memories (${memoriesList.length})
${summary}

**Legend:** ID=memory identifier (starts at 0) | P=priority (0-100, higher=more important) | Age=when added

## Memory Management (All memories already loaded above)

**Tools:**
- \`${MEMORY_ADD_ALIAS}\` - Store NEW facts only
- \`${MEMORY_UPDATE_ALIAS}\` - Merge/improve existing (use ID number)
- \`${MEMORY_DELETE_ALIAS}\` - Remove wrong/outdated

**Auto-consolidate:** When you see >2 similar memories with >80% content overlap, UPDATE the most recent/highest priority one and DELETE duplicates.`;
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
