import "server-only";

/**
 * Threads Sync Provider
 * Registers chat threads and their messages for cross-instance sync via the
 * unified SyncProvider interface.
 *
 * Pull-on-connect only — threads are not pushed in real time (too large,
 * high-frequency). On receive, threads land in the REMOTE/{instanceId}
 * subfolder so both sides share the same conversation history.
 *
 * Wire format carries the remote's `instanceId` so the receiver can resolve
 * the correct local subfolder UUID at upsert time.
 */
import { and, asc, eq, gte, inArray, isNull, max } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  ChatMessageRoleDB,
  ThreadStatusDB,
} from "@/app/api/[locale]/agent/chat/enum";
import type { ThreadsSyncCursor } from "@/app/api/[locale]/remote-connection/db";
import {
  type SyncProvider,
  toThreadsCursor,
} from "@/app/api/[locale]/remote-connection/sync-provider";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { WidgetDataSchema } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

import {
  chatFolders,
  type ChatMessage,
  chatMessages,
  chatThreads,
  type MessageMetadata,
} from "../db";

// ─── Wire Schemas ─────────────────────────────────────────────────────────────

const syncedMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(ChatMessageRoleDB),
  content: z.string().nullable(),
  parentId: z.string().uuid().nullable(),
  sequenceId: z.string().uuid().nullable(),
  authorId: z.string().nullable(),
  authorName: z.string().nullable(),
  isAI: z.boolean(),
  model: z.string().nullable(),
  skill: z.string().nullable(),
  metadata: WidgetDataSchema.nullable() as z.ZodType<MessageMetadata | null>,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const syncedThreadSchema = z.object({
  /** Thread UUID — used as syncId */
  id: z.string().uuid(),
  /** Remote's instanceId — receiver resolves local subfolder from this */
  instanceId: z.string(),
  title: z.string(),
  status: z.enum(ThreadStatusDB),
  defaultModel: z.string().nullable(),
  defaultSkill: z.string().nullable(),
  systemPrompt: z.string().nullable(),
  preview: z.string().nullable(),
  tags: z.array(z.string()),
  pinned: z.boolean(),
  archived: z.boolean(),
  updatedAt: z.string(),
  messages: z.array(syncedMessageSchema),
});

type SyncedThread = z.infer<typeof syncedThreadSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Look up or create the REMOTE/{instanceId} subfolder for this user.
 * Returns the folder UUID (to use as folderId on thread rows).
 */
async function resolveRemoteSubfolderId(
  userId: string,
  instanceId: string,
): Promise<string | null> {
  try {
    const [existing] = await db
      .select({ id: chatFolders.id })
      .from(chatFolders)
      .where(
        and(
          eq(chatFolders.userId, userId),
          eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
          eq(chatFolders.name, instanceId),
          isNull(chatFolders.parentId),
        ),
      )
      .limit(1);

    if (existing) {
      return existing.id;
    }

    // Folder not found — cannot upsert threads without a valid subfolder.
    // The connect flow is responsible for creating the folder; if it is absent
    // it means the connection was never established from this side.
    return null;
  } catch {
    return null;
  }
}

/**
 * Push a single thread's current state to connected peers over the sync
 * channel. Used after out-of-band writes to a mirrored thread (detach/wakeUp
 * backfills, revival turns) that happen AFTER the live relay stream closed —
 * the persistent connector on the peer applies it via applySyncPayloads.
 *
 * Only pushes when the thread lives in a REMOTE/<instance> folder (a mirrored
 * thread); local-only threads never sync. Best-effort: the next connect-time
 * push-pull catches anything missed.
 */
export async function pushThreadSync(
  threadId: string,
  userId: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    const [thread] = await db
      .select({ rootFolderId: chatThreads.rootFolderId })
      .from(chatThreads)
      .where(and(eq(chatThreads.id, threadId), eq(chatThreads.userId, userId)))
      .limit(1);
    if (!thread || thread.rootFolderId !== DefaultFolderId.REMOTE) {
      return;
    }
    // Bump the thread updatedAt so the PULL path re-serves it too: the sync
    // provider selects threads by thread.updatedAt, and an out-of-band message
    // change (detach/wakeUp backfill) may not have touched the thread row.
    await db
      .update(chatThreads)
      .set({ updatedAt: new Date() })
      .where(eq(chatThreads.id, threadId));
    const { serializeProviders } =
      await import("@/app/api/[locale]/remote-connection/sync-provider");
    const { broadcastSyncNotify } =
      await import("@/app/api/[locale]/system/unified-interface/websocket/emitter");
    const payloads = await serializeProviders(["threads"], userId, logger);
    broadcastSyncNotify(userId, payloads, logger);
  } catch (error) {
    logger.debug("[pushThreadSync] best-effort push failed", {
      threadId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const threadsSyncProvider: SyncProvider = {
  key: "threads",
  labelI18nKey: "remoteConnection.sync.threads",

  async getCursor(userId): Promise<ThreadsSyncCursor> {
    const threads = await db
      .select({ id: chatThreads.id, updatedAt: chatThreads.updatedAt })
      .from(chatThreads)
      .where(eq(chatThreads.userId, userId));

    if (threads.length === 0) {
      return { threadsCursor: new Date(0).toISOString(), messageCursors: {} };
    }

    const threadsCursor = threads
      .map((t) => t.updatedAt.toISOString())
      .reduce((a, b) => (a > b ? a : b));

    // Build per-thread message cursors (latest message updatedAt per thread —
    // matches the updatedAt-based serve filter so in-place backfills/edits are
    // not skipped on the next pull).
    const messageCursors: Record<string, string> = {};
    const lastMessageRows = await db
      .select({
        threadId: chatMessages.threadId,
        lastUpdatedAt: max(chatMessages.updatedAt),
      })
      .from(chatMessages)
      .where(
        inArray(
          chatMessages.threadId,
          threads.map((t) => t.id),
        ),
      )
      .groupBy(chatMessages.threadId);
    for (const row of lastMessageRows) {
      if (row.lastUpdatedAt) {
        messageCursors[row.threadId] = row.lastUpdatedAt.toISOString();
      }
    }

    return { threadsCursor, messageCursors };
  },

  async serializeFromCursor(userId, cursor, logger) {
    const typedCursor = toThreadsCursor(cursor);
    const fallbackCursor: ThreadsSyncCursor = {
      threadsCursor: typedCursor?.threadsCursor ?? new Date(0).toISOString(),
      messageCursors: typedCursor?.messageCursors ?? {},
    };
    try {
      // Serves EVERY thread newer than the cursor, each with ALL its messages
      // newer than that thread's message cursor. Threads are ordered ascending
      // by updatedAt so the cursor of the last served thread is a valid
      // watermark.
      const threads = await db
        .select()
        .from(chatThreads)
        .where(
          typedCursor
            ? and(
                eq(chatThreads.userId, userId),
                gte(chatThreads.updatedAt, new Date(typedCursor.threadsCursor)),
              )
            : eq(chatThreads.userId, userId),
        )
        .orderBy(asc(chatThreads.updatedAt));

      const result: SyncedThread[] = [];

      // Resolve instanceIds from the folder names (REMOTE/{instanceId} subfolders)
      const folderIds = [
        ...new Set(
          threads
            .map((t) => t.folderId)
            .filter((id): id is string => id !== null),
        ),
      ];
      const instanceIdByFolderId = new Map<string, string>();
      if (folderIds.length > 0) {
        const folders = await db
          .select({
            id: chatFolders.id,
            name: chatFolders.name,
            rootFolderId: chatFolders.rootFolderId,
          })
          .from(chatFolders)
          .where(inArray(chatFolders.id, folderIds));
        for (const folder of folders) {
          if (folder.rootFolderId === DefaultFolderId.REMOTE) {
            instanceIdByFolderId.set(folder.id, folder.name);
          }
        }
      }

      // Load messages for all threads in one query, grouped per thread in
      // memory. Ascending createdAt: parents precede children (parentId
      // self-FK), and the per-thread message cursor advances to the last
      // served message.
      const messagesByThreadId = new Map<string, ChatMessage[]>();
      if (threads.length > 0) {
        const allMessages = await db
          .select()
          .from(chatMessages)
          .where(
            inArray(
              chatMessages.threadId,
              threads.map((t) => t.id),
            ),
          )
          .orderBy(asc(chatMessages.createdAt));
        for (const message of allMessages) {
          const group = messagesByThreadId.get(message.threadId);
          if (group) {
            group.push(message);
          } else {
            messagesByThreadId.set(message.threadId, [message]);
          }
        }
      }

      for (const thread of threads) {
        const instanceId = thread.folderId
          ? (instanceIdByFolderId.get(thread.folderId) ?? "")
          : "";

        // Return messages changed since the cursor — by updatedAt, not just
        // createdAt, so an IN-PLACE edit (detach/wakeUp result backfill bumps
        // updatedAt but keeps createdAt) is re-served and mirrored. The cursor
        // is the updatedAt high-water mark of the served batch.
        // REMOTE-folder threads (instanceId set) are owner-authoritative on the
        // receiver: serve ALL their messages so any out-of-band re-parent or
        // backfill is delivered in full — the receiver applies unconditionally
        // and idempotently, so there is nothing to miss at a cursor boundary.
        const isOwnerAuthoritative = instanceId !== "";
        const msgCursor = typedCursor?.messageCursors[thread.id] ?? null;
        const msgCursorTime = msgCursor ? new Date(msgCursor).getTime() : null;
        const messages = (messagesByThreadId.get(thread.id) ?? []).filter(
          (m) =>
            isOwnerAuthoritative ||
            msgCursorTime === null ||
            m.updatedAt.getTime() > msgCursorTime,
        );

        result.push({
          id: thread.id,
          instanceId,
          title: thread.title,
          status: thread.status,
          defaultModel: thread.defaultModel ?? null,
          defaultSkill: thread.defaultSkill ?? null,
          systemPrompt: thread.systemPrompt ?? null,
          preview: thread.preview ?? null,
          tags: thread.tags ?? [],
          pinned: thread.pinned,
          archived: thread.archived,
          updatedAt: thread.updatedAt.toISOString(),
          messages: messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content ?? null,
            parentId: m.parentId ?? null,
            sequenceId: m.sequenceId ?? null,
            authorId: m.authorId ?? null,
            authorName: m.authorName ?? null,
            isAI: m.isAI,
            model: m.model ?? null,
            skill: m.skill ?? null,
            metadata: (m.metadata ?? null) as MessageMetadata | null,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
          })),
        });
      }

      // Cursor derived from the served threads — the batch high-water mark.
      const lastThread = result[result.length - 1];
      const threadsCursor = lastThread
        ? lastThread.updatedAt
        : fallbackCursor.threadsCursor;

      // Merge message cursors: keep the peer's known per-thread cursors and
      // advance threads served in this batch to the MAX updatedAt of the
      // served messages (messages are ordered by createdAt for FK-safe insert,
      // so the last element is not necessarily the latest updatedAt — e.g. a
      // backfilled early message). Matches the updatedAt-based serve filter.
      const messageCursors: Record<string, string> = {
        ...(typedCursor?.messageCursors ?? {}),
      };
      for (const servedThread of result) {
        let maxUpdatedAt: string | null = null;
        for (const m of servedThread.messages) {
          if (maxUpdatedAt === null || m.updatedAt > maxUpdatedAt) {
            maxUpdatedAt = m.updatedAt;
          }
        }
        if (maxUpdatedAt !== null) {
          messageCursors[servedThread.id] = maxUpdatedAt;
        }
      }

      return {
        json: JSON.stringify(result),
        cursor: { threadsCursor, messageCursors },
      };
    } catch (error) {
      logger.error("Failed to serialize threads for sync", parseError(error));
      // Serve nothing and keep the peer's cursor unchanged — never advance
      // past data that was not delivered.
      return { json: "[]", cursor: fallbackCursor };
    }
  },

  async upsertFromJson(json, userId, logger) {
    const remoteThreads = z.array(syncedThreadSchema).parse(JSON.parse(json));
    let synced = 0;

    // Cache subfolder lookups to avoid N queries for the same instanceId
    const folderCache = new Map<string, string | null>();

    // Load existing threads and messages for the incoming ids up front
    const remoteThreadIds = remoteThreads.map((t) => t.id);
    const existingThreadRows =
      remoteThreadIds.length > 0
        ? await db
            .select({ id: chatThreads.id, updatedAt: chatThreads.updatedAt })
            .from(chatThreads)
            .where(
              and(
                inArray(chatThreads.id, remoteThreadIds),
                eq(chatThreads.userId, userId),
              ),
            )
        : [];
    const existingThreadById = new Map(
      existingThreadRows.map((t) => [t.id, t]),
    );

    const remoteMessageIds = remoteThreads.flatMap((t) =>
      t.messages.map((m) => m.id),
    );
    const existingMessageById = new Map<
      string,
      { id: string; updatedAt: Date }
    >();
    for (let i = 0; i < remoteMessageIds.length; i += 5000) {
      const idBatch = remoteMessageIds.slice(i, i + 5000);
      const rows = await db
        .select({ id: chatMessages.id, updatedAt: chatMessages.updatedAt })
        .from(chatMessages)
        .where(inArray(chatMessages.id, idBatch));
      for (const row of rows) {
        existingMessageById.set(row.id, row);
      }
    }

    // New rows are collected and inserted after the loop — threads first so
    // their messages can reference them
    const threadInsertRows: (typeof chatThreads.$inferInsert)[] = [];
    const messageInsertRows: (typeof chatMessages.$inferInsert)[] = [];

    for (const remoteThread of remoteThreads) {
      try {
        // Resolve the local subfolder UUID for this thread's instanceId
        let folderId: string | null = null;
        if (remoteThread.instanceId) {
          const cached = folderCache.get(remoteThread.instanceId);
          if (cached !== undefined) {
            folderId = cached;
          } else {
            folderId = await resolveRemoteSubfolderId(
              userId,
              remoteThread.instanceId,
            );
            folderCache.set(remoteThread.instanceId, folderId);
          }
        }

        const existing = existingThreadById.get(remoteThread.id);

        const remoteTime = new Date(remoteThread.updatedAt).getTime();
        // Owner-authoritative for REMOTE-folder (mirrored) threads — see the
        // message loop below. instanceId is set only for REMOTE-folder threads.
        const ownerAuthoritativeThread = remoteThread.instanceId !== "";

        if (existing) {
          // Owner-authoritative for mirrored threads; else last-writer-wins
          // (tie → remote wins, deterministic tiebreak per spec).
          if (
            ownerAuthoritativeThread ||
            remoteTime >= existing.updatedAt.getTime()
          ) {
            await db
              .update(chatThreads)
              .set({
                title: remoteThread.title,
                status: remoteThread.status,
                defaultModel: remoteThread.defaultModel as ChatModelId | null,
                defaultSkill: remoteThread.defaultSkill,
                systemPrompt: remoteThread.systemPrompt,
                preview: remoteThread.preview,
                tags: remoteThread.tags,
                pinned: remoteThread.pinned,
                archived: remoteThread.archived,
                ...(folderId !== null && { folderId }),
                updatedAt: new Date(remoteThread.updatedAt),
              })
              .where(
                and(
                  eq(chatThreads.id, remoteThread.id),
                  eq(chatThreads.userId, userId),
                ),
              );
          }
        } else {
          // New thread from remote — land in REMOTE/{instanceId} subfolder
          threadInsertRows.push({
            id: remoteThread.id,
            userId,
            rootFolderId: DefaultFolderId.REMOTE,
            folderId: folderId ?? undefined,
            title: remoteThread.title,
            status: remoteThread.status,
            defaultModel: remoteThread.defaultModel as ChatModelId | null,
            defaultSkill: remoteThread.defaultSkill,
            systemPrompt: remoteThread.systemPrompt,
            preview: remoteThread.preview,
            tags: remoteThread.tags,
            pinned: remoteThread.pinned,
            archived: remoteThread.archived,
            updatedAt: new Date(remoteThread.updatedAt),
          });
        }

        // A thread arriving under REMOTE/<instanceId> is OWNED by that remote
        // instance from this receiver's view — we are its mirror. The owner's
        // copy is authoritative for structure (parentId, content), so accept it
        // unconditionally instead of LWW: the local mirror's updatedAt is set
        // by the live-relay processor on an independent clock and would race
        // the owner's out-of-band edits (compacting re-parent, detach backfill).
        const ownerAuthoritative = remoteThread.instanceId !== "";

        // Upsert messages — owner-authoritative for mirrored threads, else LWW.
        for (const remoteMsg of remoteThread.messages) {
          try {
            const existingMsg = existingMessageById.get(remoteMsg.id);

            const msgRemoteTime = new Date(remoteMsg.updatedAt).getTime();

            if (existingMsg) {
              if (
                ownerAuthoritative ||
                msgRemoteTime >= existingMsg.updatedAt.getTime()
              ) {
                await db
                  .update(chatMessages)
                  .set({
                    content: remoteMsg.content,
                    parentId: remoteMsg.parentId,
                    sequenceId: remoteMsg.sequenceId,
                    authorId: remoteMsg.authorId,
                    authorName: remoteMsg.authorName,
                    isAI: remoteMsg.isAI,
                    model: remoteMsg.model as ChatModelId | null,
                    skill: remoteMsg.skill,
                    metadata: (remoteMsg.metadata ?? {}) as MessageMetadata,
                    updatedAt: new Date(remoteMsg.updatedAt),
                  })
                  .where(eq(chatMessages.id, remoteMsg.id));
              }
            } else {
              messageInsertRows.push({
                id: remoteMsg.id,
                threadId: remoteThread.id,
                role: remoteMsg.role,
                content: remoteMsg.content,
                parentId: remoteMsg.parentId,
                sequenceId: remoteMsg.sequenceId,
                authorId: remoteMsg.authorId,
                authorName: remoteMsg.authorName,
                isAI: remoteMsg.isAI,
                model: remoteMsg.model as ChatModelId | null,
                skill: remoteMsg.skill,
                metadata: (remoteMsg.metadata ?? {}) as MessageMetadata,
                createdAt: new Date(remoteMsg.createdAt),
                updatedAt: new Date(remoteMsg.updatedAt),
              });
            }
          } catch (msgError) {
            logger.error("Failed to upsert synced message", {
              id: remoteMsg.id,
              threadId: remoteThread.id,
              ...parseError(msgError),
            });
          }
        }

        synced++;
      } catch (error) {
        logger.error("Failed to upsert synced thread", {
          id: remoteThread.id,
          ...parseError(error),
        });
      }
    }

    // Insert new threads first — their messages reference them
    if (threadInsertRows.length > 0) {
      try {
        await db
          .insert(chatThreads)
          .values(threadInsertRows)
          .onConflictDoNothing();
      } catch (error) {
        logger.error("Failed to upsert synced thread", parseError(error));
      }
    }
    for (let i = 0; i < messageInsertRows.length; i += 1000) {
      const batch = messageInsertRows.slice(i, i + 1000);
      try {
        await db.insert(chatMessages).values(batch).onConflictDoNothing();
      } catch (error) {
        logger.error("Failed to upsert synced message", parseError(error));
      }
    }

    return synced;
  },
};
