/**
 * Memory Formatting Utilities
 * Isomorphic functions that work on both client and server
 * IMPORTANT: No database imports or server-only code allowed
 */

import { MEMORY_DELETE_ALIAS, MEMORY_UPDATE_ALIAS } from "./[id]/definition";
import { MEMORY_ADD_ALIAS } from "./create/definition";
import { type MemoriesList, MEMORY_LIST_ALIAS } from "./definition";

/** Max characters for the full memory summary (approx 5k tokens) */
const MEMORY_BUDGET = 20000;

/**
 * Format memory summary for system prompt (isomorphic - works on client and server)
 * Single source of truth for memory formatting.
 *
 * Strategy:
 * - Sort by priority desc, then createdAt desc (newest high-priority first)
 * - Fill full entries up to budget
 * - Remaining entries get name-truncated lines if budget allows
 * - Hard cut with marker if still over budget
 */
export function formatMemorySummary(memoriesList: MemoriesList): string {
  const tools = `**Tools:**
- \`${MEMORY_ADD_ALIAS}\` — Store NEW facts only
- \`${MEMORY_UPDATE_ALIAS}\` — Merge/improve existing (use ID number)
- \`${MEMORY_DELETE_ALIAS}\` — Remove wrong/outdated`;

  const management = `## Memory Management

${tools}

**Remember:** User preferences, important facts, ongoing projects, communication style, expertise level, recurring topics, workflow preferences
**Don't remember:** Temporary context, common knowledge, frequently changing info

**Proactive memory:** Don't wait to be asked — if you learn something worth remembering, store it immediately. Good signals: preferences, goals, expertise, recurring topics, communication style, ongoing projects.

**Self-management:** After completing the user's request, consolidate duplicates (>80% overlap → always UPDATE the highest-priority entry first to merge in useful details, THEN DELETE the leftover duplicates), remove stale entries, and briefly mention what you changed.`;

  // Always include memory management instructions even with 0 memories
  if (memoriesList.length === 0) {
    return `## User Memories (0)
No memories stored yet — this is your first opportunity to learn about this user.

**Legend:** ID=memory identifier | P=priority (0-100, higher=more important) | Age=when added

**PRIORITY ACTION:** You have zero memories for this user. As soon as you learn anything useful — their name, preferences, goals, expertise, communication style, ongoing projects — store it immediately using \`${MEMORY_ADD_ALIAS}\`. Don't wait. The sooner you build a memory profile, the more personalized and useful you become.

${management}`;
  }

  // Sort by priority desc, then newest first
  const sorted = [...memoriesList].toSorted((a, b) => {
    const pDiff = (b.priority ?? 0) - (a.priority ?? 0);
    if (pDiff !== 0) {
      return pDiff;
    }
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const header = `## User Memories (${memoriesList.length})`;
  const legend = `**Legend:** ID=memory identifier | P=priority (0-100, higher=more important) | Age=when added`;

  // Reserve space for header + legend + management block + truncation marker
  const reserved = header.length + legend.length + management.length + 80;
  let remaining = MEMORY_BUDGET - reserved;

  const lines: string[] = [];
  let hiddenCount = 0;

  for (let i = 0; i < sorted.length; i++) {
    const memory = sorted[i];
    const memoryNum = memory.memoryNumber;
    const priority = memory.priority ?? 0;
    const age = getRelativeTime(
      memory.createdAt ? new Date(memory.createdAt) : new Date(),
    );
    const fullEntry = `${i + 1}. [ID:${memoryNum} | P:${priority} | ${age}] ${memory.content}`;

    // Compact: truncate content to 60 chars
    const contentTruncated =
      memory.content.length > 60
        ? `${memory.content.slice(0, 57)}...`
        : memory.content;
    const compactEntry = `${i + 1}. [ID:${memoryNum} | P:${priority}] ${contentTruncated}`;

    if (remaining >= fullEntry.length + 1) {
      lines.push(fullEntry);
      remaining -= fullEntry.length + 1;
    } else if (remaining >= compactEntry.length + 1) {
      lines.push(compactEntry);
      remaining -= compactEntry.length + 1;
    } else {
      hiddenCount++;
    }
  }

  const parts = [header, lines.join("\n"), legend];
  if (hiddenCount > 0) {
    parts.push(
      `[... ${hiddenCount} more memor${hiddenCount === 1 ? "y" : "ies"} not shown (lowest priority) — use \`${MEMORY_LIST_ALIAS}\` to view all]`,
    );
  }
  parts.push(`\n${management}`);

  return parts.join("\n\n");
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
