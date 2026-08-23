/** Thread message-tree walking: latest message, leaf resolution, ancestor branch. */

import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db, jsonbBool } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { type ChatMessage, chatMessages } from "../../../chat/db";
import type { ChatMessageRole } from "../../../chat/enum";

/**
 * Branch-aware parent resolution utilities.
 *
 * When inserting deferred messages (wakeUp revival, approve confirmation),
 * the deferred result must be appended to the *current tip* of the branch
 * that was active when the tool was called - not a stale leafMessageId and
 * not the global latest message (which may be on a different branch).
 *
 * walkToLeafMessage walks forward from a given message ID following the
 * latest child at each level, until it reaches a node with no children.
 * That node is the true current branch tip.
 *
 * fetchAncestorBranch walks backward from a starting message ID through
 * parent_id pointers, collecting the full ancestor chain in chronological
 * order. Stops at a successful compacting boundary so pre-summary history
 * is excluded. Used by both MessagesRepository and MessageContextBuilder
 * to avoid duplicating the same recursive CTE.
 */

/**
 * Newest message in a thread by createdAt, optionally filtered by role.
 *
 * Shared by the headless intake phase (append-mode parent resolution), the
 * headless no-assistant-written fallback in createAiStream, and the relay
 * branch's headless result shaping (ASSISTANT-filtered variant).
 *
 * Returns null when the thread has no (matching) messages.
 */
export async function findLatestThreadMessage(
  threadId: string,
  role?: ChatMessageRole,
): Promise<{ id: string; content: string | null } | null> {
  const [row] = await db
    .select({ id: chatMessages.id, content: chatMessages.content })
    .from(chatMessages)
    .where(
      role
        ? and(eq(chatMessages.threadId, threadId), eq(chatMessages.role, role))
        : eq(chatMessages.threadId, threadId),
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(1);
  return row ?? null;
}

/**
 * Walk forward from `startId` through the latest child chain until we
 * reach a leaf (no children). Returns the leaf message ID.
 *
 * Falls back to `startId` if no children exist (it's already the leaf).
 * Falls back to `fallback` if `startId` is undefined/null.
 *
 * Uses a single recursive CTE instead of N individual DB round-trips.
 * At each level, the latest child (by created_at DESC) is chosen via
 * a LATERAL subquery so branched threads follow the most-recent path.
 * Depth is capped at 500 hops by PostgreSQL's max_recursion_depth default.
 */
export async function walkToLeafMessage(
  threadId: string,
  startId: string | null | undefined,
  fallback: string,
): Promise<string> {
  if (!startId) {
    return fallback;
  }

  const result = await db.execute<{ id: string }>(sql`
    WITH RECURSIVE chain AS (
      -- Base case: the starting message
      SELECT id, created_at
      FROM ${chatMessages}
      WHERE id = ${startId}
        AND thread_id = ${threadId}

      UNION ALL

      -- Recursive case: follow the single latest child at each level
      SELECT next_child.id, next_child.created_at
      FROM chain
      CROSS JOIN LATERAL (
        SELECT id, created_at
        FROM ${chatMessages}
        WHERE parent_id = chain.id
          AND thread_id = ${threadId}
        ORDER BY created_at DESC
        LIMIT 1
      ) AS next_child
    )
    SELECT id FROM chain
    ORDER BY created_at DESC
    LIMIT 1
  `);

  const leaf = result.rows[0];
  return leaf?.id ?? fallback;
}

/**
 * Walk backward from `startId` through parent_id pointers, collecting the
 * full ancestor chain in chronological order (oldest first).
 *
 * Stops at a successful compacting boundary (isCompacting=true,
 * compactingFailed != true) so pre-summary history is not included.
 *
 * Returns an empty array when `startId` is null/undefined (new thread).
 * Uses a single recursive CTE — no N round-trips.
 */
export async function fetchAncestorBranch(
  threadId: string,
  startId: string | null | undefined,
  logger: EndpointLogger,
): Promise<ChatMessage[]> {
  if (!startId) {
    return [];
  }

  let result;
  try {
    result = await db.execute<ChatMessage>(sql`
    WITH RECURSIVE ancestors AS (
      SELECT
        id,
        thread_id        AS "threadId",
        parent_id        AS "parentId",
        sequence_id      AS "sequenceId",
        role,
        content,
        metadata,
        model,
        tone             AS "skill",
        upvotes,
        downvotes,
        author_id        AS "authorId",
        author_name      AS "authorName",
        is_ai            AS "isAI",
        error_type       AS "errorType",
        error_message    AS "errorMessage",
        error_code       AS "errorCode",
        search_vector    AS "searchVector",
        created_at       AS "createdAt",
        updated_at       AS "updatedAt"
      FROM ${chatMessages}
      WHERE id = ${startId}
        AND thread_id = ${threadId}

      UNION ALL

      SELECT
        m.id,
        m.thread_id      AS "threadId",
        m.parent_id      AS "parentId",
        m.sequence_id    AS "sequenceId",
        m.role,
        m.content,
        m.metadata,
        m.model,
        m.tone           AS "skill",
        m.upvotes,
        m.downvotes,
        m.author_id      AS "authorId",
        m.author_name    AS "authorName",
        m.is_ai          AS "isAI",
        m.error_type     AS "errorType",
        m.error_message  AS "errorMessage",
        m.error_code     AS "errorCode",
        m.search_vector  AS "searchVector",
        m.created_at     AS "createdAt",
        m.updated_at     AS "updatedAt"
      FROM ${chatMessages} m
      INNER JOIN ancestors a ON m.id = a."parentId"
        AND m.thread_id = ${threadId}
      WHERE NOT (
        ${jsonbBool(sql.raw("a.metadata"), "isCompacting")} IS TRUE AND ${jsonbBool(sql.raw("a.metadata"), "compactingFailed")} IS NOT TRUE
      )
    )
    SELECT * FROM ancestors
    ORDER BY "createdAt" ASC
  `);
  } catch (error) {
    // Surface threadId/startId so this is diagnosable instead of landing as
    // a bare "Failed query: WITH RECURSIVE..." dump in the generic Next.js
    // handler catch-all. Re-throw - callers need to know history failed to
    // load rather than silently continuing with an empty/wrong branch.
    // parseError also folds in error.cause (Drizzle wraps the raw Postgres
    // error there), which is where the actual DB-level failure reason lives.
    const parsed = parseError(error);
    logger.error("[TreeWalk] fetchAncestorBranch query failed", {
      threadId,
      startId,
      error: parsed.message,
      errorStack: parsed.stack,
    });
    // oxlint-disable-next-line restricted-syntax -- this function returns
    // ChatMessage[] (not ResponseType<T>); callers rely on the exception
    // propagating to the generic handler's catch-all, same as before this
    // try/catch was added - only the diagnostic logging above is new.
    throw error;
  }

  // db.execute returns raw pg driver values: timestamps are Date objects or ISO
  // strings. Guard both undefined (column alias mismatch) and NaN (unparseable),
  // logging the offending value and falling back to the epoch.
  const parseRowDate = (
    raw: Date | string | null | undefined,
    field: string,
    id: string,
  ): Date => {
    const parsed =
      raw instanceof Date ? raw : raw ? new Date(raw) : new Date(0);
    if (isNaN(parsed.getTime())) {
      logger.error(
        `[fetchAncestorBranch] Invalid ${field} for message`,
        new Error("Invalid date"),
        { id, [field]: raw },
      );
      return new Date(0);
    }
    return parsed;
  };

  return result.rows.map((row) => ({
    ...row,
    createdAt: parseRowDate(row.createdAt, "createdAt", row.id),
    updatedAt: parseRowDate(row.updatedAt, "updatedAt", row.id),
  }));
}
