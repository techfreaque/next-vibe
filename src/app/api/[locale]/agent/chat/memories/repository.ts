/**
 * Memories Repository
 * Database operations for user memories with auto-summarization
 */

import { and, desc, eq, ilike, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import { getRemoteSession } from "@/app/api/[locale]/system/unified-interface/cli/auth/remote-session-cache";
import { fireAndForgetRemote } from "@/app/api/[locale]/system/unified-interface/remote/remote-call";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { defaultLocale } from "@/i18n/core/config";

import { DefaultFolderId } from "../config";
import type { MemoriesListResponseOutput } from "./definition";
import type { MemoryAddResponseOutput } from "./create/definition";
import type { MemoryUpdateResponseOutput } from "./[id]/definition";
import type { MemoryByIdT } from "./[id]/i18n";
import { memories, type Memory } from "./db";
import { formatMemorySummary } from "./formatter";

export class MemoriesRepository {
  private static readonly LIMITS = {
    MAX_TOTAL_TOKENS: 10_000, // ~10k tokens total memory budget
    CHARS_PER_TOKEN: 4, // rough estimate
    SELF_MANAGE_THRESHOLD_RATIO: 0.9, // warn model to self-manage at 90%
  } as const;

  private static get MAX_TOTAL_CHARS(): number {
    return (
      MemoriesRepository.LIMITS.MAX_TOTAL_TOKENS *
      MemoriesRepository.LIMITS.CHARS_PER_TOKEN
    );
  }

  private static get SELF_MANAGE_THRESHOLD_CHARS(): number {
    return Math.floor(
      MemoriesRepository.MAX_TOTAL_CHARS *
        MemoriesRepository.LIMITS.SELF_MANAGE_THRESHOLD_RATIO,
    );
  }

  /**
   * Internal: Get memories as array (for use by other methods)
   * @param rootFolderId - Root folder ID (public/shared for exposed folders)
   */
  static async getMemoriesList(params: {
    userId: string;
    logger: EndpointLogger;
    rootFolderId: DefaultFolderId;
    includeArchived?: boolean;
  }): Promise<Memory[]> {
    const { userId, logger, rootFolderId, includeArchived = false } = params;
    const publicOnly =
      rootFolderId === DefaultFolderId.PUBLIC ||
      rootFolderId === DefaultFolderId.SHARED;

    const conditions = [eq(memories.userId, userId)];
    if (publicOnly) {
      conditions.push(eq(memories.isPublic, true));
    }
    if (!includeArchived) {
      conditions.push(eq(memories.isArchived, false));
    }

    const result = await db
      .select()
      .from(memories)
      .where(and(...conditions))
      .orderBy(desc(memories.priority), memories.id);

    logger.debug("Retrieved memories list", {
      userId,
      count: result.length,
      publicOnly,
    });

    return result;
  }

  /**
   * Get all memories for a user
   * Returns memories sorted by priority (desc) then sequence number (asc)
   */
  static async getMemories(params: {
    userId: string;
    logger: EndpointLogger;
    rootFolderId: DefaultFolderId;
  }): Promise<ResponseType<MemoriesListResponseOutput>> {
    const { userId, logger, rootFolderId } = params;

    const result = await MemoriesRepository.getMemoriesList({
      userId,
      logger,
      rootFolderId,
    });

    logger.info("Retrieved memories", {
      userId,
      count: result.length,
    });

    return success({
      memories: result.map(
        ({
          memoryNumber: id,
          content,
          tags,
          priority,
          isPublic,
          isArchived,
          isShared,
          createdAt,
        }) => ({
          id,
          content,
          tags: tags ?? [],
          priority,
          isPublic,
          isArchived,
          isShared,
          createdAt,
        }),
      ),
    });
  }

  /**
   * Add a new memory
   * Auto-summarizes if size limit exceeded
   */
  static async addMemory(params: {
    content: string;
    tags: string[] | undefined;
    userId: string;
    priority: number | undefined;
    isPublic: boolean;
    isShared: boolean;
    logger: EndpointLogger;
  }): Promise<ResponseType<MemoryAddResponseOutput>> {
    const {
      content,
      tags = [],
      userId,
      priority = 0,
      isPublic,
      isShared = false,
      logger,
    } = params;

    // Get next memory number for this user (starts at 0)
    const nextMemoryNumber = await MemoriesRepository.getNextMemoryNumber({
      userId,
    });

    // Create new memory
    const [memory] = await db
      .insert(memories)
      .values({
        memoryNumber: nextMemoryNumber,
        content,
        tags,
        userId,
        priority,
        isPublic,
        isShared,
        metadata: {
          source: "manual",
          confidence: 1.0,
          lastAccessed: new Date().toISOString(),
          accessCount: 0,
          ...(isShared ? { syncId: crypto.randomUUID() } : {}),
        },
      })
      .returning();

    logger.debug("Created new memory", {
      memoryId: memory.id,
      memoryNumber: memory.memoryNumber,
      userId,
    });

    // Mirror to remote if shared
    if (isShared) {
      const remoteSession = await getRemoteSession(userId);
      if (remoteSession) {
        const createDefinitions = await import("./create/definition");
        fireAndForgetRemote({
          definition: createDefinitions.default.POST,
          data: {
            content,
            tags: tags ?? [],
            priority: priority ?? 0,
            isPublic,
            isShared: true,
          },
          token: remoteSession.token,
          leadId: remoteSession.leadId,
          remoteUrl: remoteSession.remoteUrl,
          locale: defaultLocale,
          logger,
        });
      }
    }

    return success({ id: memory.memoryNumber });
  }

  /**
   * Update an existing memory
   */
  static async updateMemory(params: {
    memoryNumber: number;
    content?: string;
    tags?: string[];
    priority?: number;
    isPublic?: boolean;
    isArchived?: boolean;
    isShared?: boolean;
    userId: string;
    logger: EndpointLogger;
    t: MemoryByIdT;
  }): Promise<ResponseType<MemoryUpdateResponseOutput>> {
    const {
      memoryNumber,
      content,
      tags,
      priority,
      isPublic,
      isArchived,
      isShared,
      userId,
      logger,
      t,
    } = params;

    const updateData: Partial<typeof memories.$inferInsert> = {
      updatedAt: new Date(),
    };

    // Never overwrite content with empty or whitespace-only strings
    if (content !== undefined && content.trim() !== "") {
      updateData.content = content;
    }
    if (tags !== undefined) {
      updateData.tags = tags;
    }
    if (priority !== undefined) {
      updateData.priority = priority;
    }
    if (isPublic !== undefined) {
      updateData.isPublic = isPublic;
    }
    if (isArchived !== undefined) {
      updateData.isArchived = isArchived;
    }
    if (isShared !== undefined) {
      updateData.isShared = isShared;
    }

    const [updated] = await db
      .update(memories)
      .set(updateData)
      .where(
        and(
          eq(memories.memoryNumber, memoryNumber),
          eq(memories.userId, userId),
        ),
      )
      .returning();

    if (!updated) {
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Mirror to remote if shared (current state) or if explicitly unsharing (propagate tombstone)
    if (updated.isShared || isShared === false) {
      const remoteSession = await getRemoteSession(userId);
      if (remoteSession) {
        const idDefinitions = await import("./[id]/definition");
        fireAndForgetRemote({
          definition: idDefinitions.default.PATCH,
          data: {
            ...(content !== undefined && { content }),
            ...(tags !== undefined && { tags }),
            ...(priority !== undefined && { priority }),
            ...(isPublic !== undefined && { isPublic }),
            ...(isArchived !== undefined && { isArchived }),
            ...(isShared !== undefined && { isShared }),
          },
          urlPathParams: { id: memoryNumber },
          token: remoteSession.token,
          leadId: remoteSession.leadId,
          remoteUrl: remoteSession.remoteUrl,
          locale: defaultLocale,
          logger,
        });
      }
    }

    // Assign syncId when isShared transitions to true (if not already present)
    if (isShared) {
      const meta = updated.metadata;
      if (!meta?.syncId) {
        await db
          .update(memories)
          .set({
            metadata: sql`COALESCE(${memories.metadata}, '{}'::jsonb) || ${JSON.stringify({ syncId: crypto.randomUUID() })}::jsonb`,
          })
          .where(eq(memories.id, updated.id));
      }
    }

    logger.info("Updated memory", { memoryNumber });
    return success({ success: true });
  }

  /**
   * Delete a memory
   */
  static async deleteMemory(params: {
    memoryNumber: number;
    userId: string;
    logger: EndpointLogger;
    t: MemoryByIdT;
  }): Promise<
    ResponseType<{
      content: string;
      tags: string[];
      priority: number;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    const { memoryNumber, userId, logger, t } = params;

    const result = await db
      .delete(memories)
      .where(
        and(
          eq(memories.memoryNumber, memoryNumber),
          eq(memories.userId, userId),
        ),
      )
      .returning();

    if (result.length === 0) {
      return fail({
        message: t("delete.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const deleted = result[0];
    logger.info("Deleted memory", { memoryNumber });

    // Mirror delete to remote if memory was shared
    if (deleted.isShared) {
      const remoteSession = await getRemoteSession(userId);
      if (remoteSession) {
        const idDefinitions = await import("./[id]/definition");
        fireAndForgetRemote({
          definition: idDefinitions.default.DELETE,
          data: {},
          urlPathParams: { id: memoryNumber },
          token: remoteSession.token,
          leadId: remoteSession.leadId,
          remoteUrl: remoteSession.remoteUrl,
          locale: defaultLocale,
          logger,
        });
      }
    }

    return success({
      content: deleted.content,
      tags: deleted.tags ?? [],
      priority: deleted.priority,
      createdAt: deleted.createdAt,
      updatedAt: deleted.updatedAt,
    });
  }

  /**
   * Generate memory summary for system prompt (server-side)
   * Fetches memories from database and formats them using shared formatter
   */
  static async generateMemorySummary(params: {
    userId: string;
    logger: EndpointLogger;
    rootFolderId: DefaultFolderId;
  }): Promise<string> {
    const { userId, logger, rootFolderId } = params;

    const memoriesList = await MemoriesRepository.getMemoriesList({
      userId,
      logger,
      rootFolderId,
    });

    // Update access metadata if memories exist
    if (memoriesList.length > 0) {
      await MemoriesRepository.updateMemoryAccess({ userId, logger });
    }

    logger.debug("Generated memory summary", {
      userId,
      memoryCount: memoriesList.length,
    });

    // Map memoryNumber → id so formatter type matches MemoriesList
    const mapped = memoriesList.map((m) => ({ ...m, id: m.memoryNumber }));

    // Use shared formatter (DRY - same logic as client)
    return formatMemorySummary(mapped);
  }

  /**
   * Update memory access metadata
   */
  static async updateMemoryAccess(params: {
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
   * Search memories by content using ILIKE
   * Returns matching memories with total count
   */
  static async searchMemories(params: {
    userId: string;
    query: string;
    includeArchived?: boolean;
    tags?: string[];
    logger: EndpointLogger;
  }): Promise<
    ResponseType<{
      results: Memory[];
      total: number;
    }>
  > {
    const { userId, query, includeArchived = false, tags, logger } = params;

    const conditions = [
      eq(memories.userId, userId),
      ilike(memories.content, `%${query}%`),
    ];

    if (!includeArchived) {
      conditions.push(eq(memories.isArchived, false));
    }

    if (tags && tags.length > 0) {
      // Filter memories that have at least one of the specified tags
      conditions.push(
        sql`${memories.tags} ?| array[${sql.join(
          tags.map((tag) => sql`${tag}`),
          sql`, `,
        )}]`,
      );
    }

    const results = await db
      .select()
      .from(memories)
      .where(and(...conditions))
      .orderBy(desc(memories.priority), memories.id);

    logger.debug("Searched memories", {
      userId,
      query,
      includeArchived,
      tags,
      resultsCount: results.length,
    });

    return success({
      results,
      total: results.length,
    });
  }

  /**
   * Get memory statistics
   */
  static async getMemoryStats(params: {
    userId: string;
    logger: EndpointLogger;
    rootFolderId: DefaultFolderId;
  }): Promise<{
    count: number;
    totalTokens: number;
    oldestMemory: Date | null;
    newestMemory: Date | null;
  }> {
    const { userId, logger, rootFolderId } = params;

    const memoriesList = await MemoriesRepository.getMemoriesList({
      userId,
      logger,
      rootFolderId,
    });

    const totalChars = memoriesList.reduce(
      (sum, memory) => sum + memory.content.length,
      0,
    );
    const totalTokens = Math.ceil(
      totalChars / MemoriesRepository.LIMITS.CHARS_PER_TOKEN,
    );

    const stats = {
      count: memoriesList.length,
      totalTokens,
      oldestMemory:
        memoriesList.length > 0
          ? new Date(
              Math.min(
                ...memoriesList.map(
                  (m) => m.createdAt?.getTime() ?? Date.now(),
                ),
              ),
            )
          : null,
      newestMemory:
        memoriesList.length > 0
          ? new Date(
              Math.max(
                ...memoriesList.map(
                  (m) => m.createdAt?.getTime() ?? Date.now(),
                ),
              ),
            )
          : null,
    };

    logger.info("Memory stats", { userId, stats });

    return stats;
  }

  /**
   * Get next memory number for a user
   * Each user's memories start at 0 and increment
   */
  private static async getNextMemoryNumber(params: {
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
   * Check total memory size and return whether the self-manage threshold is reached.
   * No hard count limit — only token-based size is enforced.
   */
  static async checkSelfManageNeeded(params: {
    userId: string;
    logger: EndpointLogger;
    rootFolderId: DefaultFolderId;
  }): Promise<{
    nearLimit: boolean;
    totalTokens: number;
    limitTokens: number;
  }> {
    const { userId, logger, rootFolderId } = params;

    const memoriesList = await MemoriesRepository.getMemoriesList({
      userId,
      logger,
      rootFolderId,
    });

    const totalChars = memoriesList.reduce(
      (sum, memory) => sum + memory.content.length,
      0,
    );
    const totalTokens = Math.ceil(
      totalChars / MemoriesRepository.LIMITS.CHARS_PER_TOKEN,
    );

    const nearLimit =
      totalChars >= MemoriesRepository.SELF_MANAGE_THRESHOLD_CHARS;

    logger.debug("Memory size check", {
      userId,
      totalChars,
      totalTokens,
      limitTokens: MemoriesRepository.LIMITS.MAX_TOTAL_TOKENS,
      nearLimit,
    });

    return {
      nearLimit,
      totalTokens,
      limitTokens: MemoriesRepository.LIMITS.MAX_TOTAL_TOKENS,
    };
  }
}
