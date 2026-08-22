/**
 * Chat Messages Repository
 * Business logic for message management operations
 */

import "server-only";

import { and, desc, eq, ne, sql } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  ChannelDecision,
  RemoteEventHandlerProps,
} from "next-vibe/core/route/handler-realtime";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskStatus } from "next-vibe/tasks/enum";

import type { ChatModelId } from "../../../../ai-stream/models";
import { fetchAncestorBranch } from "../../../../ai-stream/repository/core/tree-walk";
import { bubbleFolderActivity } from "../../../bubble-folder-activity";
import {
  CHAT_MESSAGE_COLUMNS,
  chatFolders,
  type ChatMessage,
  chatMessages,
  chatThreads,
  type ToolCall,
} from "../../../db";
import {
  ChatMessageRole,
  type ChatMessageRoleDB,
  ThreadStatus,
  ThreadStatusDB,
  ThreadStreamingState,
} from "../../../enum";
import { scopedTranslation as chatScopedTranslation } from "../../../i18n";
import {
  canPostInThread,
  canViewThread,
} from "../../../permissions/permissions";
import type definitions from "./definition";
import {
  type MessageCreateRequestOutput,
  type MessageCreateResponseOutput,
  type MessageListResponseOutput,
} from "./definition";
import type { MessagesWsEmit } from "./emitter";
import { type MessagesT, scopedTranslation } from "./i18n";

/**
 * Sentinel createdAt for a mirror STUB row (a message materialized by a relayed
 * content-delta / content-done / tool-result before its authoritative
 * message-created arrived). Epoch guarantees the stub always LOSES the createdAt
 * race: the real message-created carries the origin createdAt and heals it
 * forward on conflict, and an unbackfilled stub never looks newer than a
 * real-timed sibling — so a parent relayed later than its child can't invert the
 * chain (assertParentTimeOrder).
 */
const STUB_CREATED_AT = new Date(0);

/**
 * Messages Repository Implementation
 */
export class MessagesRepository {
  /**
   * resolveChannel for the message stream (`threads/[threadId]/messages`). Loads
   * the thread and applies real per-thread visibility (canViewThread, with folder
   * inheritance), then maps to a channel kind: owner → their own user channel;
   * viewable PUBLIC/SHARED → the shared resource channel; else deny. Same
   * folder-trust the messages emitter uses to pick delivery, so subscribe and
   * emit land on the same channel.
   */
  static async resolveSubscriptionChannel(ctx: {
    user: JwtPayloadType;
    urlPathParams: { readonly threadId?: string };
    logger: EndpointLogger;
    locale: CountryLanguage;
  }): Promise<ChannelDecision> {
    const rawThreadId = ctx.urlPathParams.threadId;
    if (!rawThreadId) {
      return { kind: "deny" };
    }

    // Clients may send a slug-prefixed ID (e.g. "title-words-{uuid}"). Extract
    // the trailing UUID so the DB lookup works regardless of the slug prefix.
    const UUID_SUFFIX =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuidMatch = rawThreadId.match(UUID_SUFFIX);
    const threadId = uuidMatch ? uuidMatch[0] : rawThreadId;

    const [thread] = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);
    if (!thread) {
      // Fresh/optimistic thread not yet persisted (client-minted id mid-stream):
      // owner-private — deliver on the creator's own channel.
      return { kind: !ctx.user.isPublic && !!ctx.user.id ? "user" : "deny" };
    }

    // Owner → their own channel.
    if (!ctx.user.isPublic && ctx.user.id && thread.userId === ctx.user.id) {
      return { kind: "user" };
    }

    const folder = thread.folderId
      ? await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1)
          .then(([f]) => f ?? null)
      : null;

    // Non-owner: viewable shared/public thread → shared channel; else deny.
    const canView = await canViewThread(
      ctx.user,
      thread,
      folder,
      ctx.logger,
      ctx.locale,
    );
    return { kind: canView ? "resource" : "deny" };
  }

  /**
   * Fetch message history for a thread, optionally filtered by branch
   * Returns messages in chronological order for AI context
   *
   * Branch filtering logic:
   * - If parentMessageId is null/undefined: Return empty array (new thread root)
   * - If parentMessageId is provided: Traverse UP the tree from that message to root
   *   and return all ancestors in chronological order
   *
   * @param threadId - The thread ID to fetch messages from
   * @param logger - Logger instance
   * @param parentMessageId - Optional parent message ID to filter by branch
   * @returns Array of messages in AI SDK format
   */
  static async fetchMessageHistory(
    threadId: string,
    logger: EndpointLogger,
    parentMessageId: string | null,
  ): Promise<ChatMessage[]> {
    // If no parent message, this is a new root message - return empty history
    if (!parentMessageId) {
      logger.debug("No parent message - returning empty history (new root)", {
        threadId,
      });
      return [];
    }

    // Walk the ancestor chain via the shared fetchAncestorBranch utility.
    // Stops at a successful compacting boundary; returns rows oldest-first.
    // After the walk, a single extra query fetches sibling tool messages
    // (parallel tool calls from the same assistant turn) if needed.
    const branchMessages = await fetchAncestorBranch(
      threadId,
      parentMessageId,
      logger,
    );

    // Sibling tool messages: if the starting parent is a tool message, other tool
    // messages from the same assistant turn share the same parentId. We need them
    // all so the model sees the complete parallel batch. Fetch only their IDs first,
    // then their full rows — avoids loading unrelated messages.
    const parentMsg = branchMessages.find((m) => m.id === parentMessageId);
    if (parentMsg?.role === "tool" && parentMsg.parentId) {
      const siblingAssistantParentId = parentMsg.parentId;
      // Check if any siblings exist that aren't already in the branch
      const branchIds = new Set(branchMessages.map((m) => m.id));
      const siblings = await db
        .select(CHAT_MESSAGE_COLUMNS)
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.parentId, siblingAssistantParentId),
            eq(chatMessages.role, ChatMessageRole.TOOL),
          ),
        );
      for (const sibling of siblings) {
        if (!branchIds.has(sibling.id)) {
          branchMessages.push(sibling);
        }
      }
      // Re-sort after appending siblings
      branchMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    logger.debug("Fetched branch message history via recursive CTE", {
      threadId,
      branchMessageCount: branchMessages.length,
      parentMessageId,
      stoppedAtCompacting: branchMessages[0]?.metadata?.isCompacting === true,
    });

    return branchMessages;
  }

  static async createUserMessage(params: {
    messageId: string;
    threadId: string;
    rootFolderId: DefaultFolderId;
    role: (typeof ChatMessageRoleDB)[number];
    content: string;
    parentId: string | null;
    userId: string | undefined;
    user: JwtPayloadType;
    authorName: string | null;
    logger: EndpointLogger;
    attachments?: Array<{
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
    }>;
    /** Extra metadata to merge into the message (e.g. isQueued, queuedSettings) */
    extraMetadata?: Partial<NonNullable<ChatMessage["metadata"]>>;
    /**
     * Fixture chain of the calling stream — required to embed the message AT
     * WRITE TIME (the row lands with its search vector). Optional so non-stream
     * callers (rare) can skip embedding; those messages simply carry no vector.
     */
    toolExecutionContext: ToolExecutionContext | undefined;
  }): Promise<{
    resolvedParentId: string | null;
    /**
     * In-flight embed of the just-written user message (fired, not awaited). The
     * caller awaits it only where the vector is needed (cortex search). Resolved
     * (no-op) for incognito / no-toolExecutionContext writes.
     */
    embedPromise: Promise<void>;
  }> {
    // Incognito threads live in client storage only — no DB row exists or should be created.
    if (params.rootFolderId === DefaultFolderId.INCOGNITO) {
      params.logger.debug(
        "createUserMessage skipped: incognito folder (expected - no DB persistence for incognito)",
      );
      return {
        resolvedParentId: params.parentId,
        embedPromise: Promise.resolve(),
      };
    }

    const metadata = {
      ...(params.attachments && params.attachments.length > 0
        ? { attachments: params.attachments }
        : {}),
      ...params.extraMetadata,
    };
    const hasMetadata = Object.keys(metadata).length > 0;

    // Verify thread exists before attempting any insert - queued messages can arrive
    // after a thread is deleted, causing an FK violation that surfaces as a 500.
    const [threadExists] = await db
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(eq(chatThreads.id, params.threadId))
      .limit(1);

    if (!threadExists) {
      params.logger.error(
        "createUserMessage: thread does not exist, dropping message",
        {
          threadId: params.threadId,
          messageId: params.messageId,
          rootFolderId: params.rootFolderId,
          isQueued: params.extraMetadata?.isQueued ?? false,
        },
      );
      return {
        resolvedParentId: params.parentId,
        embedPromise: Promise.resolve(),
      };
    }

    // Verify parent exists - the client may reference an optimistic message that was never
    // committed (e.g. stream interrupted mid-flight). Fall back to the actual last committed
    // message in the thread so the conversation stays connected.
    let resolvedParentId = params.parentId;
    if (resolvedParentId) {
      const [parent] = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(eq(chatMessages.id, resolvedParentId))
        .limit(1);
      if (!parent) {
        // Parent wasn't committed - find the actual last message in this thread
        const [lastCommitted] = await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.threadId, params.threadId))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1);
        params.logger.warn(
          "createUserMessage: parent not committed (interrupted stream?), using last committed message",
          {
            requestedParentId: resolvedParentId,
            resolvedParentId: lastCommitted?.id ?? null,
            messageId: params.messageId,
            threadId: params.threadId,
          },
        );
        resolvedParentId = lastCommitted?.id ?? null;
      }
    }

    const now = new Date();
    await db
      .insert(chatMessages)
      .values({
        id: params.messageId,
        threadId: params.threadId,
        role: params.role,
        content: params.content,
        parentId: resolvedParentId,
        authorId: params.userId ?? null,
        authorName: params.authorName ?? null,
        isAI: false,
        metadata: hasMetadata ? metadata : undefined,
      })
      // Queue processor already inserted + updated this message before calling
      // createAiStream — skip the duplicate rather than failing the stream.
      .onConflictDoNothing();

    // Embed the message content — FIRED here (as soon as the row exists) but NOT
    // awaited: the message write must not wait on a network embedding. The
    // caller holds the returned `embedPromise` and awaits it only where the
    // vector is needed (the cortex search in the system prompt), overlapping the
    // embed with all the setup work in between. Best-effort + non-fatal.
    const toolExecutionContext = params.toolExecutionContext;
    const embedPromise: Promise<void> = toolExecutionContext
      ? (async (): Promise<void> => {
          try {
            const { embedMessageContent } =
              await import("../../../../cortex/embeddings/message-embed");
            const fields = await embedMessageContent(
              { role: params.role, content: params.content, metadata: null },
              toolExecutionContext,
            );
            if (fields) {
              await db
                .update(chatMessages)
                .set(fields)
                .where(eq(chatMessages.id, params.messageId));
            }
          } catch (embedErr) {
            params.logger.warn("createUserMessage: embed failed (non-fatal)", {
              messageId: params.messageId,
              error:
                embedErr instanceof Error ? embedErr.message : String(embedErr),
            });
          }
        })()
      : Promise.resolve();

    // Update thread's updatedAt and bubble activity to parent folder
    const [updatedThread] = await db
      .update(chatThreads)
      .set({ updatedAt: now })
      .where(eq(chatThreads.id, params.threadId))
      .returning({ folderId: chatThreads.folderId });

    if (updatedThread?.folderId) {
      await bubbleFolderActivity(
        updatedThread.folderId,
        now,
        params.logger,
        params.user,
      );
    }

    params.logger.debug("Created user message", {
      messageId: params.messageId,
      threadId: params.threadId,
      userId: params.userId ?? "public",
      authorName: params.authorName,
      attachmentCount: params.attachments?.length ?? 0,
    });
    // The parent the row ACTUALLY got — callers must emit THIS, not the
    // requested one, or mirrors rebuild a different chain (and materialize a
    // phantom stub for a never-committed parent id).
    return { resolvedParentId, embedPromise };
  }

  /**
   * Re-parent a user message to a new parent (used after compacting inserts itself before the user message).
   */
  static async reparentUserMessage(params: {
    messageId: string;
    newParentId: string;
    logger: EndpointLogger;
  }): Promise<void> {
    const now = new Date();
    // Bump the message updatedAt so cross-instance sync re-serves the
    // re-parented row (the threads provider filters/LWW by updatedAt; a
    // parentId-only change would otherwise be invisible to a peer that already
    // mirrored the message).
    const [updated] = await db
      .update(chatMessages)
      .set({ parentId: params.newParentId, updatedAt: now })
      .where(eq(chatMessages.id, params.messageId))
      .returning({ threadId: chatMessages.threadId });

    // Also bump the THREAD updatedAt: the sync provider selects threads to
    // serve by thread.updatedAt, so a message-only change in an
    // already-synced thread would never re-serve without this.
    if (updated?.threadId) {
      await db
        .update(chatThreads)
        .set({ updatedAt: now })
        .where(eq(chatThreads.id, updated.threadId));
    }

    params.logger.debug("Re-parented user message after compacting", {
      messageId: params.messageId,
      newParentId: params.newParentId,
    });
  }

  static async createErrorMessage(params: {
    messageId: string;
    threadId: string;
    content: string;
    parentId: string | null;
    user: JwtPayloadType;
    errorType: string;
    errorDetails?: Record<string, string | number | boolean | null>;
    sequenceId?: string | null;
    logger: EndpointLogger;
  }): Promise<void> {
    const metadata: Record<
      string,
      | string
      | number
      | boolean
      | null
      | Record<string, string | number | boolean | null>
    > = {
      errorType: params.errorType,
    };

    if (params.errorDetails) {
      metadata.errorDetails = params.errorDetails;
    }

    await db.insert(chatMessages).values({
      id: params.messageId,
      threadId: params.threadId,
      role: ChatMessageRole.ERROR,
      content: params.content,
      parentId: params.parentId,
      authorId: params.user.id ?? null,
      isAI: false,
      sequenceId: params.sequenceId ?? null,
      metadata,
    });

    params.logger.info("Created ERROR message", {
      messageId: params.messageId,
      threadId: params.threadId,
      errorType: params.errorType,
      userId: params.user.id ?? "public",
    });
  }

  static async createTextMessage(params: {
    messageId: string;
    threadId: string;
    content: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    logger: EndpointLogger;
    locale: CountryLanguage;
    /** Authoritative creation time shared with the message-created wire — see
     *  createToolMessage.createdAt for why wire and DB must agree. */
    createdAt?: Date;
  }): Promise<ResponseType<void>> {
    // Verify thread exists before attempting the insert - same race
    // createUserMessage guards against: queued/streamed messages can arrive
    // after a thread is deleted, which would otherwise surface as an opaque
    // FK-violation error instead of a clear, expected "thread gone" outcome.
    const [threadExists] = await db
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(eq(chatThreads.id, params.threadId))
      .limit(1);
    if (!threadExists) {
      params.logger.error(
        "createTextMessage: thread does not exist, dropping ASSISTANT message",
        {
          threadId: params.threadId,
          messageId: params.messageId,
          parentId: params.parentId,
        },
      );
      const { t } = scopedTranslation.scopedT(params.locale);
      return fail({
        message: t("post.errors.createFailed.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Verify parent exists — a streamed assistant message can race against its
    // own parent commit, causing an FK violation. Fall back to the last committed
    // message in the thread so the chain stays connected.
    let resolvedParentId = params.parentId;
    if (resolvedParentId) {
      const [parent] = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(eq(chatMessages.id, resolvedParentId))
        .limit(1);
      if (!parent) {
        const [lastCommitted] = await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.threadId, params.threadId))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1);
        params.logger.warn(
          "createTextMessage: parent not found, using last committed message",
          {
            requestedParentId: resolvedParentId,
            resolvedParentId: lastCommitted?.id ?? null,
            messageId: params.messageId,
            threadId: params.threadId,
          },
        );
        resolvedParentId = lastCommitted?.id ?? null;
      }
    }

    try {
      await db.insert(chatMessages).values({
        id: params.messageId,
        threadId: params.threadId,
        role: ChatMessageRole.ASSISTANT,
        content: params.content.trim() || null, // Save null if content is empty/whitespace
        parentId: resolvedParentId,
        authorId: params.userId ?? null,
        sequenceId: params.sequenceId,
        isAI: true,
        model: params.model,
        skill: params.skill,
        ...(params.createdAt
          ? { createdAt: params.createdAt, updatedAt: params.createdAt }
          : {}),
      });

      params.logger.debug("Created text message", {
        messageId: params.messageId,
        threadId: params.threadId,
        sequenceId: params.sequenceId,
        userId: params.userId ?? "public",
      });

      return success();
    } catch (error) {
      const parsed = parseError(error);
      // Postgres driver errors carry code/constraint/detail on the raw
      // cause - surface them explicitly instead of only the flattened
      // message, so a NOT NULL vs FK vs unique violation is unambiguous.
      const pgCause =
        error instanceof Error && error.cause instanceof Object
          ? error.cause
          : undefined;
      params.logger.error("Failed to insert chat message", {
        error: parsed.message,
        errorStack: parsed.stack,
        pgCode: pgCause ? Reflect.get(pgCause, "code") : undefined,
        pgDetail: pgCause ? Reflect.get(pgCause, "detail") : undefined,
        pgConstraint: pgCause
          ? Reflect.get(pgCause, "constraint_name")
          : undefined,
        messageId: params.messageId,
        threadId: params.threadId,
        parentId: params.parentId,
        skill: params.skill,
        model: params.model,
      });
      const { t } = scopedTranslation.scopedT(params.locale);
      return fail({
        message: t("post.errors.createFailed.title"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  static async updateMessageContent(params: {
    messageId: string;
    content: string;
    logger: EndpointLogger;
  }): Promise<void> {
    await db
      .update(chatMessages)
      .set({ content: params.content.trim() || null }) // Save null if content is empty/whitespace
      .where(eq(chatMessages.id, params.messageId));

    params.logger.debug("Updated message content", {
      messageId: params.messageId,
      contentLength: params.content.length,
    });
  }

  static async createToolMessage(params: {
    messageId: string;
    threadId: string;
    toolCall: ToolCall;
    parentId: string | null;
    userId: string | undefined;
    sequenceId: string | null;
    model: ChatModelId;
    skill: string;
    logger: EndpointLogger;
    locale: CountryLanguage;
    /**
     * Authoritative creation time. When emitting the message-created SSE, the
     * caller stamps ONE timestamp and passes it here AND into the wire row, so
     * the DB createdAt matches the relayed wire createdAt exactly — a mirror
     * healing from the wire then reproduces the origin's sibling ORDER (a fresh
     * now() here vs a fresh now() in the wire can diverge for parallel tools and
     * invert the mirror chain).
     */
    createdAt?: Date;
  }): Promise<ResponseType<void>> {
    const metadata: Record<
      string,
      | string
      | number
      | boolean
      | null
      | Record<string, string | number | boolean | null>
      | ToolCall
    > = {
      toolCall: params.toolCall,
    };

    // Verify thread exists before attempting the insert - same race
    // createUserMessage guards against: a tool result can land after the
    // thread was deleted, which would otherwise surface as an opaque
    // FK-violation error instead of a clear, expected "thread gone" outcome.
    const [threadExists] = await db
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(eq(chatThreads.id, params.threadId))
      .limit(1);
    if (!threadExists) {
      params.logger.error(
        "createToolMessage: thread does not exist, dropping TOOL message",
        {
          threadId: params.threadId,
          messageId: params.messageId,
          parentId: params.parentId,
          toolName: params.toolCall.toolName,
        },
      );
      const { t } = scopedTranslation.scopedT(params.locale);
      return fail({
        message: t("post.errors.createFailed.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Verify parent exists — tool messages reference an assistant message as parent;
    // parallel tool execution can race against the parent commit. Fall back to last
    // committed so the chain stays connected instead of throwing an FK violation.
    let resolvedParentId = params.parentId;
    if (resolvedParentId) {
      const [parent] = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(eq(chatMessages.id, resolvedParentId))
        .limit(1);
      if (!parent) {
        const [lastCommitted] = await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.threadId, params.threadId))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1);
        params.logger.warn(
          "createToolMessage: parent not found, using last committed message",
          {
            requestedParentId: resolvedParentId,
            resolvedParentId: lastCommitted?.id ?? null,
            messageId: params.messageId,
            threadId: params.threadId,
            toolName: params.toolCall.toolName,
          },
        );
        resolvedParentId = lastCommitted?.id ?? null;
      }
    }

    try {
      await db.insert(chatMessages).values({
        id: params.messageId,
        threadId: params.threadId,
        role: ChatMessageRole.TOOL,
        content: null, // Tool messages don't have text content, only metadata with toolCall info
        parentId: resolvedParentId,
        authorId: params.userId ?? null,
        sequenceId: params.sequenceId,
        isAI: true,
        model: params.model,
        skill: params.skill,
        metadata,
        ...(params.createdAt
          ? { createdAt: params.createdAt, updatedAt: params.createdAt }
          : {}),
      });

      params.logger.debug("Created TOOL message", {
        messageId: params.messageId,
        threadId: params.threadId,
        toolName: params.toolCall.toolName,
        sequenceId: params.sequenceId,
        userId: params.userId ?? "public",
      });
      return success(undefined);
    } catch (error) {
      params.logger.error("Failed to create TOOL message - FULL ERROR", {
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        errorCause:
          error instanceof Error && error.cause
            ? JSON.stringify(
                error.cause,
                Object.getOwnPropertyNames(error.cause),
              )
            : undefined,
        messageId: params.messageId,
        threadId: params.threadId,
        toolName: params.toolCall.toolName,
        parentId: params.parentId,
        sequenceId: params.sequenceId,
      });
      const { t } = scopedTranslation.scopedT(params.locale);
      return fail({
        message: t("post.errors.createFailed.title"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /**
   * List all messages in a thread
   */
  static async listMessages(
    data: { threadId: string },
    user: JwtPayloadType,
    t: MessagesT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MessageListResponseOutput>> {
    try {
      logger.debug("Listing messages", {
        threadId: data.threadId,
        userId: user.id,
        isPublic: user.isPublic,
      });

      // Get thread (without user filter to allow public access)
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, data.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads - they should never be accessed on server
      if (thread.rootFolderId === "incognito") {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get folder for permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      // Check read permission using permission system
      if (!(await canViewThread(user, thread, folder, logger, locale))) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get all messages in thread
      const messages = await db
        .select(CHAT_MESSAGE_COLUMNS)
        .from(chatMessages)
        .where(eq(chatMessages.threadId, data.threadId))
        .orderBy(chatMessages.createdAt);

      // Get pending/running background tasks for this thread.
      // Revival context lives in the parked resume-stream task's taskInput (not typed columns).
      const rawBackgroundTasks = await db
        .select({
          id: cronTasks.id,
          displayName: cronTasks.displayName,
          taskInput: cronTasks.taskInput,
        })
        .from(cronTasks)
        .where(
          sql`${cronTasks.taskInput}->>'threadId' = ${data.threadId}
            AND ${cronTasks.lastExecutionStatus} IN (${CronTaskStatus.PENDING}, ${CronTaskStatus.RUNNING}, ${CronTaskStatus.SCHEDULED})`,
        );

      const backgroundTasks = rawBackgroundTasks.map((task) => {
        const toolMsgId =
          task.taskInput &&
          typeof task.taskInput === "object" &&
          "wakeUpToolMessageId" in task.taskInput
            ? ((task.taskInput as { wakeUpToolMessageId?: string })
                .wakeUpToolMessageId ?? null)
            : null;
        return {
          id: task.id,
          displayName: task.displayName,
          toolCallId: toolMsgId,
        };
      });

      logger.debug("Messages retrieved", {
        threadId: data.threadId,
        count: messages.length,
        backgroundTaskCount: backgroundTasks.length,
      });

      // Return messages directly - let type system handle transformations
      // Use the DB streamingState so clients reconnecting mid-stream see the real state
      // instead of always "idle" (which hides active sub-agent streams after page refresh).
      const dbStreamingState = thread.streamingState;
      // Only expose "idle" or "streaming" from the GET endpoint.
      // "aborting" is a transient server-side state that maps to "streaming" for the client.
      // "waiting" stays as-is since it means a background task is in flight.
      const effectiveStreamingState =
        dbStreamingState === ThreadStreamingState.ABORTING
          ? ThreadStreamingState.STREAMING
          : dbStreamingState;

      return success({
        streamingState: effectiveStreamingState,
        messages,
        backgroundTasks,
      });
    } catch (error) {
      logger.error("Error listing messages", parseError(error));
      return fail({
        message: t("get.errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a new message in a thread
   * PUBLIC users can respond in PUBLIC threads, but authenticated users are needed for other threads
   */
  static async createMessage(
    data: MessageCreateRequestOutput & { threadId: string },
    user: JwtPayloadType,
    t: MessagesT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MessageCreateResponseOutput>> {
    try {
      // Extract user identifier - use leadId for PUBLIC users, userId for authenticated
      const userIdentifier = user.isPublic ? user.leadId : user.id;

      // SECURITY: Only ADMIN users can create ASSISTANT messages.
      // PUBLIC and CUSTOMER users are forced to USER role.
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

      if (data.role === ChatMessageRole.ASSISTANT && !isAdmin) {
        logger.warn("Non-admin attempted to create ASSISTANT message", {
          attemptedRole: data.role,
          userId: userIdentifier,
          isPublic: user.isPublic,
        });

        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const safeRole =
        data.role === ChatMessageRole.ASSISTANT && isAdmin
          ? ChatMessageRole.ASSISTANT
          : ChatMessageRole.USER;

      // SECURITY: PUBLIC users cannot set model
      if (user.isPublic && data.model) {
        logger.warn("PUBLIC user attempted to set model", {
          model: data.model,
          leadId: user.leadId,
        });

        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      logger.debug("Creating message", {
        threadId: data.threadId,
        userIdentifier,
        isPublic: user.isPublic,
        role: safeRole, // Always USER
      });

      // Get thread (without user filter to check permissions)
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, data.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads - they should never be accessed on server
      if (thread.rootFolderId === "incognito") {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get folder for permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      // Check write permission using permission system
      if (!(await canPostInThread(user, thread, folder, logger, locale))) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      if (data.parentId) {
        const [parentMessage] = await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.id, data.parentId),
              eq(chatMessages.threadId, data.threadId),
            ),
          )
          .limit(1);

        if (!parentMessage) {
          return fail({
            message: t("post.errors.validation.parentNotFound"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      const messageId = data.id ?? crypto.randomUUID();

      const [message] = await db
        .insert(chatMessages)
        .values({
          id: messageId,
          threadId: data.threadId,
          role: safeRole,
          content: data.content || "",
          parentId: data.parentId || null,
          authorId: userIdentifier,
          isAI: safeRole === ChatMessageRole.ASSISTANT,
          model: user.isPublic ? null : data.model || null,
          skill: user.isPublic ? null : data.skill || null,
          metadata: data.metadata || {},
        })
        .returning({
          id: chatMessages.id,
          createdAt: chatMessages.createdAt,
        });

      if (!message) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Update thread's updatedAt timestamp and bubble activity to parent folder
      const now = new Date();
      const [updatedThread] = await db
        .update(chatThreads)
        .set({ updatedAt: now })
        .where(eq(chatThreads.id, data.threadId))
        .returning({ folderId: chatThreads.folderId });

      if (updatedThread?.folderId) {
        await bubbleFolderActivity(updatedThread.folderId, now, logger, user);
      }

      logger.debug("Message created", {
        messageId: message.id,
        threadId: data.threadId,
      });

      return success({
        messageId: message.id,
        createdAt: message.createdAt,
      });
    } catch (error) {
      logger.error("Error creating message", parseError(error));
      return fail({
        message: t("post.errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Persist a user prompt + assistant generatedMedia response to the thread.
   * Called by image-generation and music-generation repositories when threadId is provided.
   * Returns the IDs of both created messages.
   */
  static async createGeneratedMediaMessage(params: {
    threadId: string;
    userMessageId: string;
    assistantMessageId: string;
    prompt: string;
    model: ChatModelId;
    skill: string;
    generatedMedia: {
      type: "image" | "audio";
      url: string;
      creditCost: number;
    };
    userId: string | undefined;
    leadId?: string | null;
    rootFolderId: DefaultFolderId;
    subFolderId?: string | null;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<
    ResponseType<{ userMessageId: string; assistantMessageId: string }>
  > {
    try {
      const now = new Date();

      // Ensure thread exists - for Mode A (image/audio) the client pre-creates the
      // thread optimistically but the DB row may not exist yet when we get here.
      const [existingThread] = await db
        .select({ id: chatThreads.id })
        .from(chatThreads)
        .where(eq(chatThreads.id, params.threadId))
        .limit(1);

      if (!existingThread) {
        await db.insert(chatThreads).values({
          id: params.threadId,
          title: chatScopedTranslation
            .scopedT(params.locale)
            .t("common.newChat"),
          rootFolderId: params.rootFolderId ?? DefaultFolderId.PRIVATE,
          folderId: params.subFolderId ?? null,
          userId: params.userId ?? null,
          leadId: params.leadId ?? null,
          status: ThreadStatusDB[0],
          createdAt: now,
          updatedAt: now,
        });
        params.logger.debug("Auto-created thread for generated media", {
          threadId: params.threadId,
        });
      }

      // Find the current leaf message (latest in thread) to use as parent
      const [lastMessage] = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(eq(chatMessages.threadId, params.threadId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(1);

      const parentId = lastMessage?.id ?? null;

      // Insert user message (the prompt)
      await db.insert(chatMessages).values({
        id: params.userMessageId,
        threadId: params.threadId,
        role: ChatMessageRole.USER,
        content: params.prompt,
        parentId,
        authorId: params.userId ?? null,
        isAI: false,
        createdAt: now,
      });

      // Insert assistant message (the generated media)
      await db.insert(chatMessages).values({
        id: params.assistantMessageId,
        threadId: params.threadId,
        role: ChatMessageRole.ASSISTANT,
        content: null,
        parentId: params.userMessageId,
        authorId: null,
        isAI: true,
        model: params.model,
        skill: params.skill,
        metadata: {
          generatedMedia: {
            type: params.generatedMedia.type,
            url: params.generatedMedia.url,
            prompt: params.prompt,
            modelId: params.model,
            creditCost: params.generatedMedia.creditCost,
            status: "complete" as const,
          },
        },
        createdAt: new Date(now.getTime() + 1), // 1ms after user message
      });

      // Update thread's updatedAt
      await db
        .update(chatThreads)
        .set({ updatedAt: now })
        .where(eq(chatThreads.id, params.threadId));

      params.logger.debug("Created generated media messages", {
        userMessageId: params.userMessageId,
        assistantMessageId: params.assistantMessageId,
        threadId: params.threadId,
        type: params.generatedMedia.type,
      });

      return success({
        userMessageId: params.userMessageId,
        assistantMessageId: params.assistantMessageId,
      });
    } catch (error) {
      params.logger.error(
        "Failed to persist generated media message",
        parseError(error),
      );
      // Non-fatal - return success anyway since generation succeeded
      return success({
        userMessageId: params.userMessageId,
        assistantMessageId: params.assistantMessageId,
      });
    }
  }
}

/**
 * Upsert relayed toolCall metadata onto a message row. Relayed events arrive
 * as independent posts with NO ordering guarantee: a tool-result can land
 * BEFORE the tool message's message-created insert. When the thread id is
 * known, write a stub TOOL row carrying the toolCall so the result is never
 * lost — message-created backfills the structural fields on conflict.
 */
async function upsertRemoteToolCallMetadata(
  messageId: string,
  threadId: WidgetData,
  toolCall: ToolCall,
): Promise<void> {
  const toolCallMetadata = JSON.stringify({ toolCall });
  const mergedMetadata = sql`COALESCE(${chatMessages.metadata}, '{}'::jsonb) || jsonb_strip_nulls(${toolCallMetadata}::jsonb)`;
  if (typeof threadId !== "string" || threadId.length === 0) {
    await db
      .update(chatMessages)
      .set({ metadata: mergedMetadata })
      .where(eq(chatMessages.id, messageId))
      .catch(() => undefined);
    return;
  }
  await db
    .insert(chatMessages)
    .values({
      id: messageId,
      threadId,
      role: ChatMessageRole.TOOL,
      isAI: true,
      content: "",
      metadata: { toolCall },
      // Stub time: EPOCH. A relayed tool-result carries no createdAt, so a now()
      // default (mirror-insert time) would make this row look NEWER than a sibling
      // that was created earlier on the origin but relayed sooner — inverting the
      // parent chain (assertParentTimeOrder). Epoch guarantees the real
      // message-created (which carries the authoritative origin createdAt) always
      // heals it forward on conflict, and an unbackfilled stub never looks newer
      // than any real-timed message.
      createdAt: STUB_CREATED_AT,
      updatedAt: STUB_CREATED_AT,
    })
    .onConflictDoUpdate({
      target: chatMessages.id,
      // Heal a mis-typed stub: an out-of-order child message-created may have
      // materialized this id as an empty ASSISTANT parent stub. A tool-result is
      // authoritative that this row is a TOOL message — flip the role (and mark
      // isAI) so the mirror shows the tool call, not a phantom empty assistant.
      set: {
        metadata: mergedMetadata,
        role: ChatMessageRole.TOOL,
        isAI: true,
      },
    })
    .catch(() => undefined);
}

export class MessagesRemoteRepository {
  /**
   * Local re-emit channel for a relayed event. The messages channel is keyed
   * by threadId + rootFolderId, so the re-emit must bind the mirror thread's
   * ACTUAL root — a `requestData: {}` binding builds a different channel
   * string and subscribed viewers (who key on rootFolderId) never match the
   * envelope. fanOut:false — a re-emit must never relay back (echo loop).
   */
  private static async mirrorEmitter(
    threadId: string,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Promise<MessagesWsEmit> {
    const [thread] = await db
      .select({ rootFolderId: chatThreads.rootFolderId })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);
    const { createMessagesEmitter } = await import("./emitter");
    return createMessagesEmitter(
      logger,
      user,
      {
        threadId,
        rootFolderId: thread?.rootFolderId ?? DefaultFolderId.REMOTE,
      },
      { fanOut: false },
    );
  }

  static async applyRemoteMessageCreated({
    responseData,
    urlPathParams,
    user,
    logger,
    originInstanceId,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "message-created"
  >): Promise<void> {
    const raw = responseData.messages?.[0];
    const msgId = raw?.id;
    const msgThreadId = raw?.threadId;
    logger.debug("[MessagesRemote] message-created received", {
      messageId: msgId,
      threadId: msgThreadId,
      role: raw?.role,
      hasParent: !!raw?.parentId,
    });
    if (!msgId || !msgThreadId) {
      return;
    }
    if (!raw.role) {
      // NEVER fabricate a role: a role-less wire message once turned an
      // assistant row into a phantom USER root on the mirror. Drop + trail.
      logger.warn("[MessagesRemote] message-created without role — dropped", {
        messageId: msgId,
        threadId: msgThreadId,
      });
      return;
    }
    const role = raw.role;
    const content = raw.content ?? "";
    const metadata = raw.metadata ?? {};
    const updatedAt = raw.updatedAt ? new Date(raw.updatedAt) : new Date();
    // The thread row itself may not exist yet (live mirroring of a brand-new
    // thread: message events can beat the thread-updated event). Upsert a
    // minimal REMOTE stub — thread-updated / pull-sync places and backfills it.
    const [createdStub] = await db
      .insert(chatThreads)
      .values({
        id: msgThreadId,
        userId: "id" in user && typeof user.id === "string" ? user.id : null,
        rootFolderId: DefaultFolderId.REMOTE,
        title: "",
        // Ownership is a COLUMN: the stub's origin is the SENDING instance
        // (the bridge wire label) — thread-updated refines placement later.
        originInstanceId,
      })
      .onConflictDoNothing()
      .returning({ id: chatThreads.id })
      .catch((): Array<{ id: string }> => []);
    if (createdStub) {
      // Brand-new mirror thread: surface it in open sidebars immediately —
      // thread-updated later delivers title + folder placement.
      const { createFolderContentsEmitter } =
        await import("../../../folder-contents/[rootFolderId]/emitter");
      const now = new Date();
      createFolderContentsEmitter(
        logger,
        user,
        DefaultFolderId.REMOTE,
      )("thread-created", {
        responseData: {
          items: [
            {
              id: msgThreadId,
              type: "thread" as const,
              title: "",
              rootFolderId: DefaultFolderId.REMOTE,
              folderId: null,
              status: ThreadStatus.ACTIVE,
              streamingState: ThreadStreamingState.STREAMING,
              createdAt: now,
              updatedAt: now,
            },
          ],
        },
      });
    }
    // Relayed events arrive as independent HTTP posts with NO ordering
    // guarantee. parent_id carries an FK — if this child applies before its
    // parent's own message-created, the write would fail and the chain break
    // permanently. Materialize a minimal parent stub first (the parent's own
    // event backfills role/content/structure on conflict).
    if (raw.parentId) {
      // Stub time: EPOCH (see STUB_CREATED_AT). The mirror inserts this parent
      // stub LATER than the origin created the real parent, so a now() default
      // would make the parent look newer than its child and break
      // assertParentTimeOrder. Epoch always loses to the parent's real
      // message-created (which heals createdAt forward on conflict). Role is left
      // ASSISTANT only as a placeholder; the real message-created / tool-result
      // backfills the correct role.
      await db
        .insert(chatMessages)
        .values({
          id: raw.parentId,
          threadId: msgThreadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: "",
          metadata: {},
          createdAt: STUB_CREATED_AT,
          updatedAt: STUB_CREATED_AT,
        })
        .onConflictDoNothing()
        .catch(() => undefined);
    }
    // A content-done / tool-result for this message may have landed FIRST and
    // upserted a stub row. On conflict, backfill the structural fields the
    // stub lacks (parent chain, model, author) and merge metadata — but never
    // clobber already-delivered final content with the (empty) creation
    // snapshot.
    //
    // createdAt heal: a single tool message emits message-created TWICE on the
    // origin — once at CREATE (authoritative time) and again at RESULT (later
    // time, when the result is written). Both relay here. Taking the LATER one
    // would push the mirror row forward and invert the parent chain vs a sibling
    // whose result landed sooner. So: if the existing row is an EPOCH stub, adopt
    // the incoming time; otherwise keep the EARLIER of {existing, incoming} — the
    // create-phase time always wins over the result-phase time. When no wire time
    // is present, keep whatever is stored.
    const healCreatedAt = raw.createdAt
      ? sql`CASE
            WHEN ${chatMessages.createdAt} = ${STUB_CREATED_AT} THEN ${new Date(raw.createdAt)}
            ELSE LEAST(${chatMessages.createdAt}, ${new Date(raw.createdAt)})
          END`
      : sql`${chatMessages.createdAt}`;
    await db
      .insert(chatMessages)
      .values({
        id: msgId,
        threadId: msgThreadId,
        role,
        isAI: raw.isAI ?? false,
        content,
        parentId: raw.parentId ?? null,
        authorId: raw.authorId ?? null,
        model: raw.model ?? null,
        skill: raw.skill ?? null,
        metadata,
        sequenceId: raw.sequenceId ?? null,
        createdAt: raw.createdAt ? new Date(raw.createdAt) : STUB_CREATED_AT,
        updatedAt,
      })
      .onConflictDoUpdate({
        target: chatMessages.id,
        // USER rows are CALLER-authoritative (the originator wrote them before
        // the relay; the receiver's mirrored copy carries receiver-side noise
        // like the resolved model) — merge metadata, but HEAL stub rows: when
        // an out-of-order assistant event materialized this id as a role-less
        // parent stub (role defaulted, content ''), the real user
        // message-created MUST claim role/content/parent/createdAt or the
        // mirror permanently shows an empty assistant where the user message
        // belongs. Content only fills emptiness — never clobbers a
        // caller-written body.
        set:
          role === ChatMessageRole.USER
            ? {
                role,
                isAI: raw.isAI ?? false,
                content: sql`CASE WHEN ${chatMessages.content} = '' OR ${chatMessages.content} IS NULL THEN excluded.content ELSE ${chatMessages.content} END`,
                parentId: sql`COALESCE(${chatMessages.parentId}, excluded.parent_id)`,
                authorId: sql`COALESCE(${chatMessages.authorId}, excluded.author_id)`,
                createdAt: healCreatedAt,
                metadata: sql`COALESCE(${chatMessages.metadata}, '{}'::jsonb) || jsonb_strip_nulls(excluded.metadata)`,
                updatedAt,
              }
            : {
                role,
                isAI: raw.isAI ?? false,
                parentId: raw.parentId ?? null,
                authorId: raw.authorId ?? null,
                model: raw.model ?? null,
                skill: raw.skill ?? null,
                sequenceId: raw.sequenceId ?? null,
                content: sql`CASE WHEN excluded.content = '' THEN ${chatMessages.content} ELSE excluded.content END`,
                metadata: sql`COALESCE(${chatMessages.metadata}, '{}'::jsonb) || jsonb_strip_nulls(excluded.metadata)`,
                createdAt: healCreatedAt,
                updatedAt,
              },
      })
      .catch((err: Error) => {
        logger.warn(
          "[MessagesRemote] message-created upsert failed — mirror row incomplete",
          { messageId: msgId, threadId: msgThreadId, error: err.message },
        );
      });
    const state = responseData.streamingState;
    if (state && state !== ThreadStreamingState.IDLE) {
      // Relayed events are UNORDERED: a message-created carrying
      // streamingState:"streaming" can land AFTER stream-finished marked the
      // mirror idle — and nothing would ever reset it. Idle is ABSORBING for
      // remote state writes: only the local relay reconcile
      // (clearStreamingState) or the stream-finished anchor moves a thread
      // out of/into idle.
      await db
        .update(chatThreads)
        .set({ streamingState: state, updatedAt: new Date() })
        .where(
          and(
            eq(chatThreads.id, msgThreadId),
            ne(chatThreads.streamingState, ThreadStreamingState.IDLE),
          ),
        )
        .catch(() => undefined);
    } else if (state) {
      await db
        .update(chatThreads)
        .set({ streamingState: state, updatedAt: new Date() })
        .where(eq(chatThreads.id, msgThreadId))
        .catch(() => undefined);
    }
    (
      await MessagesRemoteRepository.mirrorEmitter(
        urlPathParams.threadId,
        logger,
        user,
      )
    )("message-created", { responseData });
  }

  static async applyRemoteError({
    responseData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<typeof definitions.GET, "error">): Promise<void> {
    const msg = responseData.messages?.[0];
    if (!msg?.id) {
      return;
    }
    await db
      .update(chatMessages)
      .set({
        content: msg.content ?? "",
        metadata: msg.metadata
          ? sql`COALESCE(metadata, '{}'::jsonb) || jsonb_strip_nulls(${JSON.stringify(msg.metadata)}::jsonb)`
          : sql`metadata`,
        updatedAt: new Date(),
      })
      .where(eq(chatMessages.id, msg.id))
      .catch(() => undefined);
    (
      await MessagesRemoteRepository.mirrorEmitter(
        urlPathParams.threadId,
        logger,
        user,
      )
    )("error", { responseData });
  }

  static async applyRemoteContentDone({
    responseData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "content-done"
  >): Promise<void> {
    const msg = responseData.messages?.[0];
    const threadId = urlPathParams.threadId;
    logger.debug("[MessagesRemote] content-done received", {
      messageId: msg?.id,
      hasContent: !!msg?.content,
      promptTokens: msg?.metadata?.promptTokens ?? null,
      creditCost: msg?.metadata?.creditCost ?? null,
    });
    if (!msg?.id || !msg.content || typeof threadId !== "string") {
      return;
    }
    const tokenMetadata = JSON.stringify({
      promptTokens: msg.metadata?.promptTokens ?? null,
      completionTokens: msg.metadata?.completionTokens ?? null,
      totalTokens: msg.metadata?.totalTokens ?? null,
      creditCost: msg.metadata?.creditCost ?? null,
      finishReason: msg.metadata?.finishReason ?? null,
    });
    // Upsert, not update: relayed events have no ordering guarantee, so the
    // final content can arrive BEFORE this message's message-created insert.
    // Write a stub row carrying the content; message-created backfills the
    // structural fields (parent chain, model) on conflict without clobbering it.
    await db
      .insert(chatMessages)
      .values({
        id: msg.id,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        isAI: true,
        content: msg.content,
        metadata: msg.metadata ?? {},
        createdAt: STUB_CREATED_AT,
        updatedAt: STUB_CREATED_AT,
      })
      .onConflictDoUpdate({
        target: chatMessages.id,
        set: {
          content: msg.content,
          metadata: sql`COALESCE(${chatMessages.metadata}, '{}'::jsonb) || jsonb_strip_nulls(${tokenMetadata}::jsonb)`,
        },
      })
      .catch(() => undefined);
    (
      await MessagesRemoteRepository.mirrorEmitter(
        urlPathParams.threadId,
        logger,
        user,
      )
    )("content-done", { responseData });
  }

  /**
   * Cross-instance applier for `content-delta`: append the chunk to the mirror
   * row and re-emit locally so the peer's viewers stream in live. Correct
   * because the bridge delivers a thread's remote events strictly IN ORDER
   * (per-connection ordered relay in the remote-event bridge).
   */
  static async applyRemoteContentDelta({
    responseData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "content-delta"
  >): Promise<void> {
    const msg = responseData.messages?.[0];
    const threadId = urlPathParams.threadId;
    if (!msg?.id || !msg.content || typeof threadId !== "string") {
      return;
    }
    await db
      .insert(chatMessages)
      .values({
        id: msg.id,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        isAI: true,
        content: msg.content,
        metadata: {},
        createdAt: STUB_CREATED_AT,
        updatedAt: STUB_CREATED_AT,
      })
      .onConflictDoUpdate({
        target: chatMessages.id,
        set: { content: sql`${chatMessages.content} || excluded.content` },
      })
      .catch(() => undefined);
    (await MessagesRemoteRepository.mirrorEmitter(threadId, logger, user))(
      "content-delta",
      { responseData },
    );
  }

  /**
   * Cross-instance applier for `reasoning-delta`: append the chunk (reasoning
   * rides in the content field). Ordered bridge delivery keeps appends correct.
   */
  static async applyRemoteReasoningDelta({
    responseData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "reasoning-delta"
  >): Promise<void> {
    const msg = responseData.messages?.[0];
    const threadId = urlPathParams.threadId;
    if (!msg?.id || !msg.content || typeof threadId !== "string") {
      return;
    }
    await db
      .insert(chatMessages)
      .values({
        id: msg.id,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        isAI: true,
        content: msg.content,
        metadata: {},
        createdAt: STUB_CREATED_AT,
        updatedAt: STUB_CREATED_AT,
      })
      .onConflictDoUpdate({
        target: chatMessages.id,
        set: { content: sql`${chatMessages.content} || excluded.content` },
      })
      .catch(() => undefined);
    (await MessagesRemoteRepository.mirrorEmitter(threadId, logger, user))(
      "reasoning-delta",
      { responseData },
    );
  }

  /**
   * Cross-instance applier for `reasoning-done`: settle the reasoning block
   * (authoritative full text replaces the appended chunks) and re-emit.
   */
  static async applyRemoteReasoningDone({
    responseData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "reasoning-done"
  >): Promise<void> {
    const msg = responseData.messages?.[0];
    const threadId = urlPathParams.threadId;
    if (!msg?.id || typeof threadId !== "string") {
      return;
    }
    if (msg.content) {
      await db
        .insert(chatMessages)
        .values({
          id: msg.id,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: msg.content,
          metadata: {},
        })
        .onConflictDoUpdate({
          target: chatMessages.id,
          set: { content: msg.content },
        })
        .catch(() => undefined);
    }
    (await MessagesRemoteRepository.mirrorEmitter(threadId, logger, user))(
      "reasoning-done",
      { responseData },
    );
  }

  static async applyRemoteToolResult({
    responseData,
    urlPathParams,
    user,
    logger,
    instanceId,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "tool-result"
  >): Promise<void> {
    const msg = responseData.messages?.[0];
    const toolCall = msg?.metadata?.toolCall;
    if (!msg?.id || !toolCall) {
      return;
    }
    const resultObj =
      toolCall.result !== null &&
      toolCall.result !== undefined &&
      typeof toolCall.result === "object" &&
      !Array.isArray(toolCall.result) &&
      !(toolCall.result instanceof Date)
        ? toolCall.result
        : null;
    const incomingPending =
      toolCall.status === "pending" ||
      resultObj?.["status"] === "status.pending";
    if (incomingPending) {
      const [existing] = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(eq(chatMessages.id, msg.id))
        .limit(1);
      const existingStatus = existing?.metadata?.toolCall?.status;
      if (existingStatus === "completed" || existingStatus === "failed") {
        return;
      }
    }
    const taggedToolCall = instanceId
      ? { ...toolCall, remoteInstanceId: instanceId }
      : toolCall;
    await upsertRemoteToolCallMetadata(
      msg.id,
      urlPathParams.threadId,
      taggedToolCall,
    );
    (
      await MessagesRemoteRepository.mirrorEmitter(
        urlPathParams.threadId,
        logger,
        user,
      )
    )("tool-result", { responseData });
  }

  static async applyRemoteToolResultUpdated({
    responseData,
    urlPathParams,
    user,
    logger,
    instanceId,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "tool-result-updated"
  >): Promise<void> {
    const msg = responseData.messages?.[0];
    const toolCall = msg?.metadata?.toolCall;
    if (!msg?.id || !toolCall) {
      return;
    }
    const taggedToolCall = instanceId
      ? { ...toolCall, remoteInstanceId: instanceId }
      : toolCall;
    await upsertRemoteToolCallMetadata(
      msg.id,
      urlPathParams.threadId,
      taggedToolCall,
    );
    (
      await MessagesRemoteRepository.mirrorEmitter(
        urlPathParams.threadId,
        logger,
        user,
      )
    )("tool-result-updated", { responseData });
  }

  static async applyRemoteTokensUpdated({
    responseData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "tokens-updated"
  >): Promise<void> {
    const msg = responseData.messages?.[0];
    const threadId = urlPathParams.threadId;
    logger.debug("[MessagesRemote] tokens-updated received", {
      messageId: msg?.id,
      promptTokens: msg?.metadata?.promptTokens ?? null,
      creditCost: msg?.metadata?.creditCost ?? null,
    });
    if (!msg?.id) {
      return;
    }
    const tokenMetadata = {
      promptTokens: msg.metadata?.promptTokens ?? null,
      completionTokens: msg.metadata?.completionTokens ?? null,
      totalTokens: msg.metadata?.totalTokens ?? null,
      creditCost: msg.metadata?.creditCost ?? null,
      finishReason: msg.metadata?.finishReason ?? null,
    };
    const mergedTokenMetadata = sql`COALESCE(${chatMessages.metadata}, '{}'::jsonb) || jsonb_strip_nulls(${JSON.stringify(tokenMetadata)}::jsonb)`;
    if (typeof threadId === "string" && threadId.length > 0) {
      // Upsert, not update: relayed events are unordered — token usage can
      // land before the message's own insert. Stub the row (assistant; the
      // later message-created backfills structure) so the usage is never lost.
      await db
        .insert(chatMessages)
        .values({
          id: msg.id,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: "",
          metadata: msg.metadata ?? {},
        })
        .onConflictDoUpdate({
          target: chatMessages.id,
          set: { metadata: mergedTokenMetadata },
        })
        .catch(() => undefined);
    } else {
      await db
        .update(chatMessages)
        .set({ metadata: mergedTokenMetadata })
        .where(eq(chatMessages.id, msg.id))
        .catch(() => undefined);
    }
    (
      await MessagesRemoteRepository.mirrorEmitter(
        urlPathParams.threadId,
        logger,
        user,
      )
    )("tokens-updated", { responseData });
  }

  static async applyRemoteStreamFinished({
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "stream-finished"
  >): Promise<void> {
    const threadId = urlPathParams.threadId;
    await db
      .update(chatThreads)
      .set({ streamingState: ThreadStreamingState.IDLE, updatedAt: new Date() })
      .where(eq(chatThreads.id, threadId))
      .catch((err: Error) => {
        logger.warn(
          "[messages/repository] stream-finished: failed to mark thread idle",
          { threadId, error: err.message },
        );
      });
    (
      await MessagesRemoteRepository.mirrorEmitter(
        urlPathParams.threadId,
        logger,
        user,
      )
    )("stream-finished", {
      responseData: { streamingState: ThreadStreamingState.IDLE },
    });
  }

  static async applyRemoteStreamingStateChanged({
    responseData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof definitions.GET,
    "streaming-state-changed"
  >): Promise<void> {
    const threadId = urlPathParams.threadId;

    // Idle is ABSORBING for remote state writes (see applyRemoteMessageCreated):
    // relayed events are unordered, so a late "streaming"/"waiting" must never
    // re-stick a mirror that the local reconcile / stream-finished already
    // settled to idle. Writing idle itself is always allowed.
    await db
      .update(chatThreads)
      .set({
        streamingState: responseData.streamingState,
        updatedAt: new Date(),
      })
      .where(
        responseData.streamingState === ThreadStreamingState.IDLE
          ? eq(chatThreads.id, threadId)
          : and(
              eq(chatThreads.id, threadId),
              ne(chatThreads.streamingState, ThreadStreamingState.IDLE),
            ),
      )
      .catch(() => undefined);
    (
      await MessagesRemoteRepository.mirrorEmitter(
        urlPathParams.threadId,
        logger,
        user,
      )
    )("streaming-state-changed", { responseData });
  }
}
