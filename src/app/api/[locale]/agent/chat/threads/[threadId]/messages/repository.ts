/**
 * Chat Messages Repository
 * Business logic for message management operations
 */

import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { DefaultFolderId } from "../../../config";
import {
  chatFolders,
  chatMessages,
  chatThreads,
  type ChatMessage,
  type ToolCall,
} from "../../../db";
import {
  ChatMessageRole,
  ThreadStatusDB,
  type ChatMessageRoleDB,
} from "../../../enum";
import {
  canPostInThread,
  canViewThread,
} from "../../../permissions/permissions";
import type {
  MessageCreateRequestOutput,
  MessageCreateResponseOutput,
  MessageListResponseOutput,
} from "./definition";
import { scopedTranslation, type MessagesT } from "./i18n";

/**
 * Messages Repository Implementation
 */
export class MessagesRepository {
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

    // Fetch all messages in the thread to build the tree
    const allMessages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.threadId, threadId))
      .orderBy(chatMessages.createdAt);

    logger.debug("Fetched all thread messages for branch filtering", {
      threadId,
      totalMessageCount: allMessages.length,
      parentMessageId,
    });

    // Build ancestry chain by traversing UP from parent to root.
    // Stop at the most recent SUCCESSFUL compacting message - it contains a
    // summary of everything before it, so we only need it + subsequent messages.
    // This prevents sending the full uncompacted history alongside the summary.
    const messageMap = new Map(allMessages.map((msg) => [msg.id, msg]));
    const ancestorIds = new Set<string>();

    let currentId: string | null = parentMessageId;
    while (currentId) {
      ancestorIds.add(currentId);
      const currentMessage = messageMap.get(currentId);

      // Stop at a successful compacting message (include it, but not its ancestors)
      if (
        currentMessage?.metadata?.isCompacting === true &&
        currentMessage.metadata.compactingFailed !== true
      ) {
        break;
      }

      currentId = currentMessage?.parentId ?? null;
    }

    // Include sibling tool messages: when the parent is a tool message, the AI called
    // multiple tools in parallel. All sibling tool results share the same parent
    // (the assistant message that spawned them). Including only the direct ancestor
    // misses the other tool results, causing the AI to re-call missing tools on revival.
    // Add all tool-role siblings so the AI sees the complete parallel batch.
    const parentMsg = messageMap.get(parentMessageId);
    if (parentMsg?.role === "tool" && parentMsg.parentId) {
      for (const msg of allMessages) {
        if (
          msg.parentId === parentMsg.parentId &&
          msg.role === "tool" &&
          !ancestorIds.has(msg.id)
        ) {
          ancestorIds.add(msg.id);
        }
      }
    }

    // Filter messages to only include ancestors and maintain chronological order
    const branchMessages = allMessages.filter((msg) => ancestorIds.has(msg.id));

    logger.debug("Branch messages after compacting filter", {
      threadId,
      branchMessageCount: branchMessages.length,
      totalMessageCount: allMessages.length,
      stoppedAtCompacting: branchMessages[0]?.metadata?.isCompacting === true,
    });

    // Map to role+content format (keep ERROR messages in chain)
    return branchMessages;
  }

  /**
   * Get parent message for retry/edit operations
   * Note: This method does NOT check thread ownership - that's handled at the API route level
   * We just need to verify the message exists and return its data
   */
  static async getParentMessage(
    messageId: string,
    userId: string | undefined,
    logger: EndpointLogger,
  ): Promise<{
    id: string;
    threadId: string;
    role: ChatMessageRole;
    content: string | null;
    parentId: string | null;
  } | null> {
    // Get the message by ID (supports both user and AI messages)
    const [message] = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.id, messageId))
      .limit(1);

    if (!message) {
      logger.error("Parent message not found", {
        messageId,
        userId: userId ?? "public",
      });
      return null;
    }

    logger.info("Found parent message", {
      messageId: message.id,
      threadId: message.threadId,
      role: message.role,
      authorId: message.authorId,
    });

    return {
      id: message.id,
      threadId: message.threadId,
      role: message.role,
      content: message.content,
      parentId: message.parentId,
    };
  }

  static async createUserMessage(params: {
    messageId: string;
    threadId: string;
    role: (typeof ChatMessageRoleDB)[number];
    content: string;
    parentId: string | null;
    userId: string | undefined;
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
  }): Promise<void> {
    const metadata = {
      ...(params.attachments && params.attachments.length > 0
        ? { attachments: params.attachments }
        : {}),
      ...(params.extraMetadata ?? {}),
    };
    const hasMetadata = Object.keys(metadata).length > 0;

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
    await db.insert(chatMessages).values({
      id: params.messageId,
      threadId: params.threadId,
      role: params.role,
      content: params.content,
      parentId: resolvedParentId,
      authorId: params.userId ?? null,
      authorName: params.authorName ?? null,
      isAI: false,
      metadata: hasMetadata ? metadata : undefined,
    });

    // Update thread's updatedAt and bubble activity to parent folder
    const [updatedThread] = await db
      .update(chatThreads)
      .set({ updatedAt: now })
      .where(eq(chatThreads.id, params.threadId))
      .returning({ folderId: chatThreads.folderId });

    if (updatedThread?.folderId) {
      await db
        .update(chatFolders)
        .set({ updatedAt: now })
        .where(eq(chatFolders.id, updatedThread.folderId));
    }

    params.logger.debug("Created user message", {
      messageId: params.messageId,
      threadId: params.threadId,
      userId: params.userId ?? "public",
      authorName: params.authorName,
      attachmentCount: params.attachments?.length ?? 0,
    });
  }

  /**
   * Re-parent a user message to a new parent (used after compacting inserts itself before the user message).
   */
  static async reparentUserMessage(params: {
    messageId: string;
    newParentId: string;
    logger: EndpointLogger;
  }): Promise<void> {
    await db
      .update(chatMessages)
      .set({ parentId: params.newParentId })
      .where(eq(chatMessages.id, params.messageId));

    params.logger.debug("Re-parented user message after compacting", {
      messageId: params.messageId,
      newParentId: params.newParentId,
    });
  }

  static async createAiMessagePlaceholder(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string | null | undefined;
    sequenceId: string | null;
    logger: EndpointLogger;
  }): Promise<void> {
    await db.insert(chatMessages).values({
      id: params.messageId,
      threadId: params.threadId,
      role: ChatMessageRole.ASSISTANT,
      content: " ",
      parentId: params.parentId,
      authorId: params.userId ?? null,
      sequenceId: params.sequenceId,
      isAI: true,
      model: params.model,
      skill: params.skill ?? null,
    });

    params.logger.info("Created AI message placeholder", {
      messageId: params.messageId,
      threadId: params.threadId,
      sequenceId: params.sequenceId,
      userId: params.userId ?? "public",
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
  }): Promise<ResponseType<void>> {
    try {
      await db.insert(chatMessages).values({
        id: params.messageId,
        threadId: params.threadId,
        role: ChatMessageRole.ASSISTANT,
        content: params.content.trim() || null, // Save null if content is empty/whitespace
        parentId: params.parentId,
        authorId: params.userId ?? null,
        sequenceId: params.sequenceId,
        isAI: true,
        model: params.model,
        skill: params.skill,
      });

      params.logger.debug("Created text message", {
        messageId: params.messageId,
        threadId: params.threadId,
        sequenceId: params.sequenceId,
        userId: params.userId ?? "public",
      });

      return success();
    } catch (error) {
      params.logger.error("Failed to insert chat message", parseError(error), {
        messageId: params.messageId,
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

    try {
      await db.insert(chatMessages).values({
        id: params.messageId,
        threadId: params.threadId,
        role: ChatMessageRole.TOOL,
        content: null, // Tool messages don't have text content, only metadata with toolCall info
        parentId: params.parentId,
        authorId: params.userId ?? null,
        sequenceId: params.sequenceId,
        isAI: true,
        model: params.model,
        skill: params.skill,
        metadata,
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

  static handleAnswerAsAiOperation<
    T extends {
      threadId?: string | null;
      parentMessageId?: string | null;
      content: string;
      role: ChatMessageRole;
    },
  >(
    data: T,
  ): {
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
  } {
    return {
      threadId: data.threadId,
      parentMessageId: data.parentMessageId,
      content: data.content,
      role: data.role,
    };
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
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, data.threadId))
        .orderBy(chatMessages.createdAt);

      // Get pending/running background tasks for this thread
      const rawBackgroundTasks = await db
        .select({
          id: cronTasks.id,
          displayName: cronTasks.displayName,
          wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
        })
        .from(cronTasks)
        .where(
          and(
            eq(cronTasks.wakeUpThreadId, data.threadId),
            sql`${cronTasks.lastExecutionStatus} IN (${CronTaskStatus.PENDING}, ${CronTaskStatus.RUNNING}, ${CronTaskStatus.SCHEDULED})`,
          ),
        );

      const backgroundTasks = rawBackgroundTasks.map((task) => ({
        id: task.id,
        displayName: task.displayName,
        toolCallId: task.wakeUpToolMessageId ?? null,
      }));

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
        dbStreamingState === "aborting" ? "streaming" : dbStreamingState;

      return success({
        streamingState: effectiveStreamingState,
        messages,
        backgroundTasks,
      });
    } catch (error) {
      logger.error("Error listing messages", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
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
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: {
              error: "Parent message not found",
            },
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
        await db
          .update(chatFolders)
          .set({ updatedAt: now })
          .where(eq(chatFolders.id, updatedThread.folderId));
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
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
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
    rootFolderId?: string;
    subFolderId?: string | null;
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
          title: params.prompt.slice(0, 80) || "New Chat",
          rootFolderId:
            (params.rootFolderId as DefaultFolderId | undefined) ??
            DefaultFolderId.PRIVATE,
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
