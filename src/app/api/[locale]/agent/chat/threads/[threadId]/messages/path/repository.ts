/**
 * Conversation Path Repository
 * Retrieves all messages in the current chunk (from compaction boundary to all leaves).
 *
 * Two-query approach for type safety:
 * 1. Recursive CTE walks UP the parentId chain from the leaf to the compaction boundary,
 *    returning only the minimal ancestor metadata (id, parentId, isCompacting).
 * 2. A recursive CTE walks DOWN from the oldest ancestor to fetch ALL descendants
 *    (all branch paths within the chunk), returned via a typed Drizzle query.
 *
 * The client receives the full chunk and derives branchIndices locally from the
 * leafMessageId URL param — no round-trips for branch switching.
 */

import "server-only";

import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type { QueryResult, QueryResultRow } from "pg";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatFolders, chatMessages, chatThreads } from "../../../../db";
import { canViewThread } from "../../../../permissions/permissions";
import type {
  PathGetRequestOutput,
  PathGetResponseOutput,
  PathGetUrlVariablesOutput,
} from "./definition";
import type { MessagePathT } from "./i18n";

/**
 * Conversation Path Repository
 */
export class pathRepository {
  /**
   * Walk UP the parentId chain from startId, stopping at (and including)
   * the first compacting message or a root message.
   *
   * Returns the ancestor chain ordered oldest→newest (ASC by created_at).
   */
  private static async fetchAncestorChain(
    startId: string,
    threadId: string,
  ): Promise<
    (QueryResultRow & {
      id: string;
      parentId: string | null;
      isCompacting: boolean;
    })[]
  > {
    // Raw SQL is required for WITH RECURSIVE — Drizzle doesn't support recursive CTEs.
    // db.execute<T>() returns QueryResult<T> (from pg), so .rows is T[] — fully typed.
    const result: QueryResult<
      QueryResultRow & {
        id: string;
        parentId: string | null;
        isCompacting: boolean;
      }
    > = await db.execute<
      QueryResultRow & {
        id: string;
        parentId: string | null;
        isCompacting: boolean;
      }
    >(sql`
      WITH RECURSIVE ancestor_chain AS (
        SELECT
          id,
          parent_id AS "parentId",
          COALESCE((metadata->>'isCompacting')::boolean, false) AS "isCompacting",
          0 AS depth
        FROM chat_messages
        WHERE id = ${startId}
          AND thread_id = ${threadId}

        UNION ALL

        SELECT
          m.id,
          m.parent_id AS "parentId",
          COALESCE((m.metadata->>'isCompacting')::boolean, false) AS "isCompacting",
          ac.depth + 1
        FROM chat_messages m
        INNER JOIN ancestor_chain ac ON m.id = ac."parentId"
        WHERE NOT ac."isCompacting"
      )
      SELECT id, "parentId", "isCompacting"
      FROM ancestor_chain
      ORDER BY depth DESC
    `);

    return result.rows.map((r) => ({
      id: r.id,
      parentId: r.parentId ?? null,
      isCompacting: Boolean(r.isCompacting),
    }));
  }

  /**
   * Collect all descendant IDs starting from the given root IDs, stopping BEFORE
   * any compacting messages. Compacting messages mark the START of the next chunk —
   * they are NOT included in the current chunk (the client loads them as the top of
   * the next chunk when "Show newer messages" is clicked).
   *
   * Returns:
   *   - ids: all message IDs in this chunk (roots + descendants, excluding next compaction)
   */
  private static async fetchAllDescendantIds(
    rootIds: string[],
    threadId: string,
  ): Promise<{ ids: string[] }> {
    if (rootIds.length === 0) {
      return { ids: [] };
    }
    const rootIdsLiteral = rootIds.map((id) => sql`${id}`);
    const rootIdsArray = sql.join(rootIdsLiteral, sql`, `);

    // Walk DOWN from chunk roots, stopping BEFORE the next compacting boundary.
    // The seed row may itself be a compacting boundary (chunk header) — it is seeded
    // unconditionally so its children are walked, but filtered out of the final SELECT
    // (the caller adds it explicitly via allIds.add(oldestAncestor.id)).
    // Expansion stops when a CHILD is compacting (next chunk boundary).
    const descendantsResult: QueryResult<QueryResultRow & { id: string }> =
      await db.execute<QueryResultRow & { id: string }>(sql`
      WITH RECURSIVE descendants AS (
        -- Seed: include chunk roots unconditionally (even if compacting boundary).
        SELECT id, parent_id, COALESCE((metadata->>'isCompacting')::boolean, false) AS is_compacting
        FROM chat_messages
        WHERE id = ANY(ARRAY[${rootIdsArray}]::uuid[])
          AND thread_id = ${threadId}

        UNION ALL

        -- Recursive step: expand children that are NOT themselves a next compaction boundary.
        -- Stop when the CHILD is compacting (that's the start of the next chunk, not this one).
        SELECT m.id, m.parent_id, COALESCE((m.metadata->>'isCompacting')::boolean, false)
        FROM chat_messages m
        INNER JOIN descendants d ON m.parent_id = d.id
        WHERE m.thread_id = ${threadId}
          AND NOT COALESCE((m.metadata->>'isCompacting')::boolean, false)
      )
      -- Exclude compacting rows from the result; caller adds the chunk-header explicitly.
      SELECT id FROM descendants
      WHERE NOT is_compacting
    `);

    const ids = descendantsResult.rows.map((r) => r.id);

    return { ids };
  }

  /**
   * Given the ancestor chain, fetch ALL messages in the chunk:
   * - The ancestors themselves (active path)
   * - ALL siblings of the oldest ancestor
   * - ALL descendants of all siblings, stopping at (and including) the next compacting message
   *
   * This returns the complete chunk so branch switching is purely local (no server fetch).
   * Returns messages + whether any compacting boundary was found at the bottom.
   */
  private static async fetchChunkMessages(
    ancestorChain: (QueryResultRow & {
      id: string;
      parentId: string | null;
      isCompacting: boolean;
    })[],
    threadId: string,
  ): Promise<{
    messages: (typeof chatMessages.$inferSelect)[];
  }> {
    if (ancestorChain.length === 0) {
      return { messages: [] };
    }

    const oldestAncestor = ancestorChain[0]!;

    // Find all siblings of the oldest ancestor (same parentId).
    // These are the roots of all branch paths in this chunk.
    const siblingCondition =
      oldestAncestor.parentId !== null
        ? eq(chatMessages.parentId, oldestAncestor.parentId)
        : isNull(chatMessages.parentId);

    const chunkRoots = await db
      .select({ id: chatMessages.id })
      .from(chatMessages)
      .where(and(eq(chatMessages.threadId, threadId), siblingCondition));

    const chunkRootIds = chunkRoots.map((r) => r.id);

    // Fetch ALL descendants of all chunk roots, stopping BEFORE the next compaction boundary.
    // Note: fetchAllDescendantIds excludes isCompacting messages from the walk itself,
    // so the compaction boundary (oldestAncestor) is not returned by the CTE.
    // We always include the oldest ancestor explicitly so it appears as the chunk header.
    const { ids: allDescendantIds } =
      await pathRepository.fetchAllDescendantIds(chunkRootIds, threadId);

    // Combine: oldest ancestor (always) + all descendants.
    // The oldest ancestor may be a compaction boundary excluded by fetchAllDescendantIds —
    // explicitly adding it ensures the chunk header is always present.
    // NOTE: do NOT add oldestAncestor.parentId — the parent belongs to the older chunk,
    // not the current one.
    const allIds = new Set<string>(allDescendantIds);
    allIds.add(oldestAncestor.id);

    if (allIds.size === 0) {
      return { messages: [] };
    }

    const rows = await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          inArray(chatMessages.id, [...allIds]),
        ),
      )
      .orderBy(chatMessages.createdAt);

    return { messages: rows };
  }

  /**
   * Get all messages in the current chunk.
   * Returns all messages from the compaction boundary, including ALL branch paths
   * within that chunk so the client can navigate branches locally without refetching.
   */
  static async getPath(
    urlPathParams: PathGetUrlVariablesOutput,
    data: PathGetRequestOutput,
    user: JwtPayloadType,
    t: MessagePathT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PathGetResponseOutput>> {
    try {
      logger.debug("Getting chunk messages", {
        threadId: urlPathParams.threadId,
        userId: user.id,
        leafMessageId: data.leafMessageId,
        before: data.before,
      });

      // Get thread
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, urlPathParams.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (thread.rootFolderId === "incognito") {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      if (!(await canViewThread(user, thread, folder, logger, locale))) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Determine the start ID for upward traversal
      let startId: string | null = null;

      if (data.before) {
        // "Load older": the caller provides the oldest message it already has.
        // Walk up from its parent to start the older chunk.
        // If that parent is a compaction boundary, start FROM it (include it) —
        // the compaction boundary is the bottom of the older chunk (the summary message).
        const [beforeMsg] = await db
          .select({ parentId: chatMessages.parentId })
          .from(chatMessages)
          .where(eq(chatMessages.id, data.before))
          .limit(1);
        const parentId = beforeMsg?.parentId ?? null;
        if (parentId) {
          startId = parentId;
        }
      } else if (data.leafMessageId) {
        // Walk DOWN from the provided leafMessageId to the actual latest leaf.
        // When switching branches, the client passes the branch root sibling ID —
        // we need to follow the newest-child chain to find the true leaf of that branch.
        const latestLeafResult: QueryResult<{ id: string }> = await db.execute<{
          id: string;
        }>(sql`
          WITH RECURSIVE latest_leaf AS (
            SELECT id, parent_id, created_at, 0 AS depth
            FROM chat_messages
            WHERE id = ${data.leafMessageId}
              AND thread_id = ${urlPathParams.threadId}

            UNION ALL

            SELECT m.id, m.parent_id, m.created_at, lf.depth + 1
            FROM chat_messages m
            INNER JOIN latest_leaf lf ON m.parent_id = lf.id
            WHERE m.thread_id = ${urlPathParams.threadId}
              -- Stop before crossing into the next chunk (compacting = next chunk header)
              AND NOT COALESCE((m.metadata->>'isCompacting')::boolean, false)
          )
          SELECT id FROM latest_leaf
          ORDER BY depth DESC, created_at DESC
          LIMIT 1
        `);
        startId = latestLeafResult.rows[0]?.id ?? data.leafMessageId;
      } else {
        // Default: latest message in thread
        const [latest] = await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.threadId, urlPathParams.threadId))
          .orderBy(sql`${chatMessages.createdAt} DESC`)
          .limit(1);
        startId = latest?.id ?? null;
      }

      if (!startId) {
        return success({
          messages: [],
          hasOlderHistory: false,
          hasNewerMessages: false,
          resolvedLeafMessageId: null,
          oldestLoadedMessageId: null,
          compactionBoundaryId: null,
          newerChunkAnchorId: null,
        });
      }

      // Step 1: Get the ancestor chain (recursive CTE, minimal columns)
      const ancestorChain = await pathRepository.fetchAncestorChain(
        startId,
        urlPathParams.threadId,
      );

      if (ancestorChain.length === 0) {
        return success({
          messages: [],
          hasOlderHistory: false,
          hasNewerMessages: false,
          resolvedLeafMessageId: null,
          oldestLoadedMessageId: null,
          compactionBoundaryId: null,
          newerChunkAnchorId: null,
        });
      }

      // Step 2: Fetch ALL messages in the chunk (all branch paths, stopping at next compaction)
      const { messages } = await pathRepository.fetchChunkMessages(
        ancestorChain,
        urlPathParams.threadId,
      );

      const oldestAncestor = ancestorChain[0]!;
      // hasOlderHistory: true if the oldest ancestor has a parent (history exists above it).
      // This includes the case where the oldest is a compaction boundary — the compacted
      // messages are older history that can be loaded via "Show older messages".
      const hasOlderHistory = !!oldestAncestor.parentId;
      const compactionBoundaryId = oldestAncestor.isCompacting
        ? oldestAncestor.id
        : null;
      const oldestLoadedMessageId = oldestAncestor.id;

      // Step 3: For each leaf in the chunk that has a compacting child, record the pair
      // (compactingChildId, leafId). We inject one BOUNDARY_NEWER sentinel per such leaf,
      // with parentId = leafId so it sits correctly in the message tree. Branch switching
      // is local, so every branch that continues into a newer chunk needs its own sentinel.
      const newerSentinelPairs: Array<{ anchorId: string; leafId: string }> =
        [];
      {
        const chunkIds = messages.map((m) => m.id);
        if (chunkIds.length > 0) {
          const chunkIdsLiteral = chunkIds.map((id) => sql`${id}`);
          const chunkIdsArray = sql.join(chunkIdsLiteral, sql`, `);
          const newerResult: QueryResult<
            QueryResultRow & { id: string; parentId: string }
          > = await db.execute<
            QueryResultRow & { id: string; parentId: string }
          >(sql`
            SELECT id, parent_id AS "parentId" FROM chat_messages
            WHERE thread_id = ${urlPathParams.threadId}
              AND parent_id = ANY(ARRAY[${chunkIdsArray}]::uuid[])
              AND COALESCE((metadata->>'isCompacting')::boolean, false)
            ORDER BY created_at ASC
          `);
          for (const row of newerResult.rows) {
            newerSentinelPairs.push({ anchorId: row.id, leafId: row.parentId });
          }
        }
      }

      // Derive legacy scalar for response metadata
      const newerChunkAnchorId = newerSentinelPairs[0]?.anchorId ?? null;
      const hasNewerMessages = newerSentinelPairs.length > 0;

      // Build a set of leaf IDs that have a newer chunk so we can annotate them.
      const leafsWithNewerChunk = new Map(
        newerSentinelPairs.map(({ anchorId, leafId }) => [leafId, anchorId]),
      );

      // Annotate real messages with chunk boundary flags in metadata:
      // - oldest message: hasOlderHistory=true if older chunks exist
      // - leaf messages that continue into a newer chunk: hasNewerHistory=true + newerAnchorId
      const messagesWithFlags: (typeof chatMessages.$inferSelect)[] =
        messages.map((msg) => {
          const isOldestAnchor = msg.id === oldestLoadedMessageId;
          const newerAnchorId = leafsWithNewerChunk.get(msg.id) ?? null;
          const needsFlags =
            (isOldestAnchor && hasOlderHistory) || newerAnchorId !== null;
          if (!needsFlags) {
            return msg;
          }
          return {
            ...msg,
            metadata: {
              ...msg.metadata,
              ...(isOldestAnchor && hasOlderHistory
                ? { hasOlderHistory: true }
                : {}),
              ...(newerAnchorId !== null
                ? { hasNewerHistory: true, newerAnchorId }
                : {}),
            },
          };
        });

      logger.debug("Chunk messages retrieved", {
        threadId: urlPathParams.threadId,
        chunkSize: messages.length,
        hasOlderHistory,
        hasNewerMessages,
        startId,
      });

      return success({
        messages: messagesWithFlags,
        hasOlderHistory,
        hasNewerMessages,
        resolvedLeafMessageId: startId,
        oldestLoadedMessageId,
        compactionBoundaryId,
        newerChunkAnchorId,
      });
    } catch (error) {
      logger.error("Error getting chunk messages", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
