/**
 * Memories Repository
 * Database operations for user memories with auto-summarization
 */

import { and, desc, eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { memories, type Memory } from "./db";

/**
 * Memory configuration
 */
const MEMORY_LIMITS = {
  MAX_MEMORIES_PER_USER: 50,
  MAX_TOTAL_SIZE_BYTES: 50_000, // 50KB
  SUMMARIZATION_THRESHOLD_BYTES: 45_000, // Trigger at 45KB
} as const;

/**
 * Internal: Get memories as array (for use by other functions)
 */
async function getMemoriesList(params: {
  userId: string;
  logger: EndpointLogger;
}): Promise<Memory[]> {
  const { userId, logger } = params;

  const result = await db
    .select()
    .from(memories)
    .where(eq(memories.userId, userId))
    .orderBy(desc(memories.priority), memories.id);

  logger.debug("Retrieved memories list", {
    userId,
    count: result.length,
  });

  return result;
}

/**
 * Get all memories for a user
 * Returns memories sorted by priority (desc) then sequence number (asc)
 */
export async function getMemories(params: {
  userId: string;
  logger: EndpointLogger;
}): Promise<ResponseType<{ memories: Memory[] }>> {
  const { userId, logger } = params;

  const result = await getMemoriesList({ userId, logger });

  logger.info("Retrieved memories", {
    userId,
    count: result.length,
  });

  return success({ memories: result });
}

/**
 * Add a new memory
 * Auto-summarizes if size limit exceeded
 */
export async function addMemory(params: {
  content: string;
  tags?: string[];
  userId: string;
  priority?: number;
  logger: EndpointLogger;
}): Promise<ResponseType<{ id: number }>> {
  const { content, tags = [], userId, priority = 0, logger } = params;

  // Get next memory number for this user (starts at 0)
  const nextMemoryNumber = await getNextMemoryNumber({ userId });

  // Create new memory
  const [memory] = await db
    .insert(memories)
    .values({
      memoryNumber: nextMemoryNumber,
      content,
      tags,
      userId,
      priority,
      metadata: {
        source: "manual",
        confidence: 1.0,
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      },
    })
    .returning();

  logger.info("Created new memory", {
    memoryId: memory.id,
    memoryNumber: memory.memoryNumber,
    userId,
  });

  // Check if auto-summarization is needed
  await checkAndSummarizeIfNeeded({ userId, logger });

  return success({ id: memory.memoryNumber });
}

/**
 * Update an existing memory
 */
export async function updateMemory(params: {
  memoryNumber: number;
  content?: string;
  tags?: string[];
  priority?: number;
  userId: string;
  logger: EndpointLogger;
}): Promise<ResponseType<{ success: true }>> {
  const { memoryNumber, content, tags, priority, userId, logger } = params;

  const updateData: Partial<typeof memories.$inferInsert> = {
    updatedAt: new Date(),
  };

  // Filter out empty strings - treat as undefined
  if (content !== undefined && content !== "") {
    updateData.content = content;
  }
  if (tags !== undefined) {
    updateData.tags = tags;
  }
  if (priority !== undefined) {
    updateData.priority = priority;
  }

  const [updated] = await db
    .update(memories)
    .set(updateData)
    .where(
      and(eq(memories.memoryNumber, memoryNumber), eq(memories.userId, userId)),
    )
    .returning();

  if (!updated) {
    return fail({
      message: "app.api.agent.chat.memories.id.patch.errors.notFound.title",
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  logger.info("Updated memory", { memoryNumber });
  return success({ success: true });
}

/**
 * Delete a memory
 */
export async function deleteMemory(params: {
  memoryNumber: number;
  userId: string;
  logger: EndpointLogger;
}): Promise<ResponseType<{ success: true }>> {
  const { memoryNumber, userId, logger } = params;

  const result = await db
    .delete(memories)
    .where(
      and(eq(memories.memoryNumber, memoryNumber), eq(memories.userId, userId)),
    )
    .returning();

  if (result.length === 0) {
    return fail({
      message: "app.api.agent.chat.memories.id.delete.errors.notFound.title",
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  logger.info("Deleted memory", { memoryNumber });
  return success({ success: true });
}

/**
 * Generate memory summary for system prompt
 * Returns formatted string with numbered memories
 */
export async function generateMemorySummary(params: {
  userId: string;
  logger: EndpointLogger;
}): Promise<string> {
  const { userId, logger } = params;

  const memoriesList = await getMemoriesList({ userId, logger });

  if (memoriesList.length === 0) {
    return "";
  }

  // Update access metadata
  await updateMemoryAccess({ userId, logger });

  // Format as numbered list with IDs, priority, and recency
  const summary = memoriesList
    .map((memory, index) => {
      const memoryNum = memory.memoryNumber;
      const priority = memory.priority ?? 0;
      const age = getRelativeTime(memory.createdAt ?? new Date());
      return `${index + 1}. [ID:${memoryNum} | P:${priority} | ${age}] ${memory.content}`;
    })
    .join("\n");

  logger.info("Generated memory summary", {
    userId,
    memoryCount: memoriesList.length,
  });

  return `## User Memories (${memoriesList.length})
${summary}

**Legend:** ID=memory identifier (starts at 0) | P=priority (0-100, higher=more important) | Age=when added

## Memory Management (All memories already loaded above)
**Auto-consolidate when you see >2 similar memories (>80% content overlap)**

**Tools:**
- \`memories:add\` - Store NEW facts only
- \`memories:update\` - Merge/improve existing (use ID number)
- \`memories:delete\` - Remove wrong/outdated

**Consolidation Examples:**
1. "User likes coffee" + "Drinks coffee daily" → Update to: "Likes coffee, drinks daily"
2. "Lives in Berlin" + "Berlin resident" + "From Berlin" → Update first, delete others
3. "Testing tools" + "Tool testing" + "Tested all tools" → Merge into one comprehensive memory

**Rules:**
- >2 memories about same topic with >80% overlap = consolidate immediately
- When consolidating: UPDATE most recent/highest priority, DELETE duplicates
- Check priority (P:) and age before deciding which to keep`;
}

// Helper to get relative time
const getRelativeTime = (date: Date): string => {
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
};

/**
 * Get next memory number for a user
 * Each user's memories start at 0 and increment
 */
async function getNextMemoryNumber(params: {
  userId: string;
}): Promise<number> {
  const { userId } = params;

  const [result] = await db
    .select({
      maxNum: sql<number>`COALESCE(MAX(${memories.memoryNumber}), -1)`,
    })
    .from(memories)
    .where(eq(memories.userId, userId));

  return (result?.maxNum ?? -1) + 1;
}

/**
 * Update memory access metadata
 */
async function updateMemoryAccess(params: {
  userId: string;
  logger: EndpointLogger;
}): Promise<void> {
  const { userId, logger } = params;

  await db
    .update(memories)
    .set({
      metadata: sql`jsonb_set(
        jsonb_set(
          ${memories.metadata},
          '{lastAccessed}',
          to_jsonb(${new Date().toISOString()}::text)
        ),
        '{accessCount}',
        to_jsonb((COALESCE((${memories.metadata}->>'accessCount')::int, 0) + 1)::text)
      )`,
    })
    .where(eq(memories.userId, userId));

  logger.debug("Updated memory access metadata", { userId });
}

/**
 * Check if summarization is needed and trigger if necessary
 */
async function checkAndSummarizeIfNeeded(params: {
  userId: string;
  logger: EndpointLogger;
}): Promise<void> {
  const { userId, logger } = params;

  const memoriesList = await getMemoriesList({ userId, logger });

  // Calculate total size
  const totalSize = memoriesList.reduce(
    (sum, memory) => sum + memory.content.length,
    0,
  );

  logger.info("Memory size check", {
    userId,
    totalSize,
    count: memoriesList.length,
    threshold: MEMORY_LIMITS.SUMMARIZATION_THRESHOLD_BYTES,
  });

  // Check if we need to summarize
  if (
    totalSize > MEMORY_LIMITS.SUMMARIZATION_THRESHOLD_BYTES ||
    memoriesList.length > MEMORY_LIMITS.MAX_MEMORIES_PER_USER
  ) {
    logger.warn("Memory limit exceeded - auto-summarization needed", {
      userId,
      totalSize,
      count: memoriesList.length,
    });

    // TODO: Implement AI-powered summarization
    // For now, just log a warning
    // In production, this would call an AI endpoint to consolidate memories
  }
}

/**
 * Get memory statistics
 */
export async function getMemoryStats(params: {
  userId: string;
  logger: EndpointLogger;
}): Promise<{
  count: number;
  totalSize: number;
  oldestMemory: Date | null;
  newestMemory: Date | null;
}> {
  const { userId, logger } = params;

  const memoriesList = await getMemoriesList({ userId, logger });

  const totalSize = memoriesList.reduce(
    (sum, memory) => sum + memory.content.length,
    0,
  );

  const stats = {
    count: memoriesList.length,
    totalSize,
    oldestMemory:
      memoriesList.length > 0
        ? new Date(
            Math.min(
              ...memoriesList.map((m) => m.createdAt?.getTime() ?? Date.now()),
            ),
          )
        : null,
    newestMemory:
      memoriesList.length > 0
        ? new Date(
            Math.max(
              ...memoriesList.map((m) => m.createdAt?.getTime() ?? Date.now()),
            ),
          )
        : null,
  };

  logger.info("Memory stats", { userId, stats });

  return stats;
}
