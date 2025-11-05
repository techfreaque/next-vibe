/**
 * Chat Messages Repository
 * Business logic for message management operations
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  chatFolders,
  chatMessages,
  chatThreads,
  type ToolCall,
} from "../../../db";
import { ChatMessageRole } from "../../../enum";
import {
  canPostInThread,
  canViewThread,
} from "../../../permissions/permissions";
import { validateNotIncognito } from "../../../validation";
import type {
  MessageCreateRequestOutput,
  MessageCreateResponseOutput,
  MessageListResponseOutput,
} from "./definition";

/**
 * Calculate message depth from parent
 * Returns 0 if no parent or if incognito mode
 */
export async function calculateMessageDepth(
  parentMessageId: string | null | undefined,
  isIncognito: boolean,
): Promise<number> {
  if (!parentMessageId || isIncognito) {
    return 0;
  }

  const [parent] = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.id, parentMessageId))
    .limit(1);

  return parent ? parent.depth + 1 : 0;
}

/**
 * Fetch message history for a thread
 * Returns messages in chronological order for AI context
 */
export async function fetchMessageHistory(
  threadId: string,
  userId: string,
  logger: EndpointLogger,
): Promise<Array<{ role: "user" | "assistant" | "system"; content: string }>> {
  const messages = await db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.threadId, threadId),
        eq(chatMessages.authorId, userId),
      ),
    )
    .orderBy(chatMessages.createdAt);

  logger.info("Fetched message history", {
    threadId,
    messageCount: messages.length,
  });

  return messages.map((msg) => {
    const roleLowercase = msg.role.toLowerCase();
    const validRole: "user" | "assistant" | "system" =
      roleLowercase === "user" ||
      roleLowercase === "assistant" ||
      roleLowercase === "system"
        ? roleLowercase
        : "user";
    return {
      role: validRole,
      content: msg.content,
    };
  });
}

/**
 * Get parent message for retry/edit operations
 * Note: This function does NOT check thread ownership - that's handled at the API route level
 * We just need to verify the message exists and return its data
 */
export async function getParentMessage(
  messageId: string,
  userId: string,
  logger: EndpointLogger,
): Promise<{
  id: string;
  threadId: string;
  role: ChatMessageRole;
  content: string;
  parentId: string | null;
  depth: number;
} | null> {
  // Get the message by ID (supports both user and AI messages)
  const [message] = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.id, messageId))
    .limit(1);

  if (!message) {
    logger.error("Parent message not found", { messageId, userId });
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
    depth: message.depth,
  };
}

export async function createUserMessage(params: {
  messageId: string;
  threadId: string;
  role: ChatMessageRole;
  content: string;
  parentId: string | null;
  depth: number;
  userId: string | undefined;
  authorName: string | null;
  logger: EndpointLogger;
}): Promise<void> {
  await db.insert(chatMessages).values({
    id: params.messageId,
    threadId: params.threadId,
    role: params.role,
    content: params.content,
    parentId: params.parentId,
    depth: params.depth,
    authorId: params.userId ?? null,
    authorName: params.authorName,
    isAI: false,
  });

  params.logger.debug("Created user message", {
    messageId: params.messageId,
    threadId: params.threadId,
    userId: params.userId ?? "public",
    authorName: params.authorName,
  });
}

export async function createAiMessagePlaceholder(params: {
  messageId: string;
  threadId: string;
  parentId: string | null;
  depth: number;
  userId: string | undefined;
  model: string;
  persona: string | null | undefined;
  sequenceId: string | null;
  sequenceIndex: number;
  logger: EndpointLogger;
}): Promise<void> {
  await db.insert(chatMessages).values({
    id: params.messageId,
    threadId: params.threadId,
    role: ChatMessageRole.ASSISTANT,
    content: " ",
    parentId: params.parentId,
    depth: params.depth,
    authorId: params.userId ?? null,
    sequenceId: params.sequenceId,
    sequenceIndex: params.sequenceIndex,
    isAI: true,
    model: params.model,
    persona: params.persona ?? undefined,
  });

  params.logger.info("Created AI message placeholder", {
    messageId: params.messageId,
    threadId: params.threadId,
    sequenceId: params.sequenceId,
    sequenceIndex: params.sequenceIndex,
    userId: params.userId ?? "public",
  });
}

export async function createErrorMessage(params: {
  messageId: string;
  threadId: string;
  content: string;
  parentId: string | null;
  depth: number;
  userId: string | undefined;
  errorType: string;
  errorDetails?: Record<string, string | number | boolean | null>;
  sequenceId?: string | null;
  sequenceIndex?: number;
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
    depth: params.depth,
    authorId: params.userId ?? null,
    isAI: false,
    sequenceId: params.sequenceId ?? null,
    sequenceIndex: params.sequenceIndex ?? 0,
    metadata,
  });

  params.logger.info("Created ERROR message", {
    messageId: params.messageId,
    threadId: params.threadId,
    errorType: params.errorType,
    userId: params.userId ?? "public",
  });
}

export async function createTextMessage(params: {
  messageId: string;
  threadId: string;
  content: string;
  parentId: string | null;
  depth: number;
  userId: string | undefined;
  model: string;
  persona: string | null | undefined;
  sequenceId: string | null;
  sequenceIndex: number;
  logger: EndpointLogger;
}): Promise<void> {
  await db.insert(chatMessages).values({
    id: params.messageId,
    threadId: params.threadId,
    role: ChatMessageRole.ASSISTANT,
    content: params.content,
    parentId: params.parentId,
    depth: params.depth,
    authorId: params.userId ?? null,
    sequenceId: params.sequenceId,
    sequenceIndex: params.sequenceIndex,
    isAI: true,
    model: params.model,
    persona: params.persona ?? undefined,
  });

  params.logger.debug("Created text message", {
    messageId: params.messageId,
    threadId: params.threadId,
    sequenceId: params.sequenceId,
    sequenceIndex: params.sequenceIndex,
    userId: params.userId ?? "public",
  });
}

export async function updateMessageContent(params: {
  messageId: string;
  content: string;
  logger: EndpointLogger;
}): Promise<void> {
  await db
    .update(chatMessages)
    .set({ content: params.content })
    .where(eq(chatMessages.id, params.messageId));

  params.logger.debug("Updated message content", {
    messageId: params.messageId,
    contentLength: params.content.length,
  });
}

export async function createToolMessage(params: {
  messageId: string;
  threadId: string;
  toolCall: ToolCall;
  parentId: string | null;
  depth: number;
  userId: string | undefined;
  sequenceId: string | null;
  sequenceIndex: number;
  logger: EndpointLogger;
}): Promise<void> {
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

  await db.insert(chatMessages).values({
    id: params.messageId,
    threadId: params.threadId,
    role: ChatMessageRole.TOOL,
    content: "",
    parentId: params.parentId,
    depth: params.depth,
    authorId: params.userId ?? null,
    sequenceId: params.sequenceId,
    sequenceIndex: params.sequenceIndex,
    isAI: true,
    metadata,
  });

  params.logger.debug("Created TOOL message", {
    messageId: params.messageId,
    threadId: params.threadId,
    toolName: params.toolCall.toolName,
    sequenceId: params.sequenceId,
    sequenceIndex: params.sequenceIndex,
    userId: params.userId ?? "public",
  });
}

export async function handleEditOperation<T extends { parentMessageId?: string | null; content: string; role: ChatMessageRole }>(
  data: T,
  userId: string | undefined,
  logger: EndpointLogger,
): Promise<{
  threadId: string;
  parentMessageId: string | null;
  content: string;
  role: ChatMessageRole;
} | null> {
  if (!data.parentMessageId) {
    logger.error("Edit operation requires parentMessageId");
    return null;
  }

  const parentMessage = await getParentMessage(
    data.parentMessageId,
    userId ?? "",
    logger,
  );

  if (!parentMessage) {
    return null;
  }

  return {
    threadId: parentMessage.threadId,
    parentMessageId: parentMessage.parentId,
    content: data.content,
    role: data.role,
  };
}

export async function handleRetryOperation<T extends { parentMessageId?: string | null }>(
  data: T,
  userId: string | undefined,
  logger: EndpointLogger,
): Promise<{
  threadId: string;
  parentMessageId: string;
  content: string;
  role: ChatMessageRole;
} | null> {
  if (!data.parentMessageId) {
    logger.error("Retry operation requires parentMessageId");
    return null;
  }

  const userMessage = await getParentMessage(
    data.parentMessageId,
    userId ?? "",
    logger,
  );

  if (!userMessage) {
    return null;
  }

  return {
    threadId: userMessage.threadId,
    parentMessageId: data.parentMessageId,
    content: userMessage.content,
    role: userMessage.role,
  };
}

export function handleAnswerAsAiOperation<T extends { threadId?: string | null; parentMessageId?: string | null; content: string; role: ChatMessageRole }>(data: T): {
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
 * Messages Repository Interface
 */
export interface MessagesRepositoryInterface {
  listMessages(
    data: { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageListResponseOutput>>;

  createMessage(
    data: MessageCreateRequestOutput & { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageCreateResponseOutput>>;
}

/**
 * Messages Repository Implementation
 */
export class MessagesRepositoryImpl implements MessagesRepositoryInterface {
  /**
   * List all messages in a thread
   */
  async listMessages(
    data: { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
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
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.notFound.title" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads - they should never be accessed on server
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.get",
      );
      if (incognitoError) {
        return incognitoError;
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
      if (!(await canViewThread(user, thread, folder, logger))) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get all messages in thread
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.threadId, data.threadId))
        .orderBy(chatMessages.createdAt);

      logger.debug("Messages retrieved", {
        threadId: data.threadId,
        count: messages.length,
      });

      // Map messages to include toolCalls from metadata and sequencing fields
      const mappedMessages = messages.map((msg) => {
        // Only extract toolCalls for TOOL role messages
        let toolCalls: ToolCall[] | undefined = undefined;

        if (msg.role === "tool" && msg.metadata) {
          // Check if metadata has toolCall object (new format)
          if (
            msg.metadata.toolCall &&
            typeof msg.metadata.toolCall === "object"
          ) {
            toolCalls = [msg.metadata.toolCall as ToolCall];
          }
          // Fallback: check if metadata has individual tool call fields (old format)
          else if (msg.metadata.toolName) {
            toolCalls = [
              {
                toolName: msg.metadata.toolName,
                displayName: msg.metadata.displayName || msg.metadata.toolName,
                icon: msg.metadata.icon,
                args: msg.metadata.args || {},
                result: msg.metadata.result,
                error: msg.metadata.error,
                executionTime: msg.metadata.executionTime,
                widgetMetadata: msg.metadata.widgetMetadata,
                creditsUsed: msg.metadata.creditsUsed,
              },
            ];
          }
        }

        return {
          id: msg.id,
          threadId: msg.threadId,
          role: msg.role,
          content: msg.content,
          parentId: msg.parentId,
          depth: msg.depth,
          authorId: msg.authorId,
          isAI: msg.isAI,
          model: msg.model,
          tokens: msg.tokens,
          sequenceId: msg.sequenceId ?? null,
          sequenceIndex: msg.sequenceIndex ?? 0,
          toolCalls: toolCalls ?? null,
          createdAt: msg.createdAt.toISOString(),
          updatedAt: msg.updatedAt.toISOString(),
        };
      });

      return createSuccessResponse({ messages: mappedMessages });
    } catch (error) {
      logger.error("Error listing messages", parseError(error));
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.server.title" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Create a new message in a thread
   * PUBLIC users can respond in PUBLIC threads, but authenticated users are needed for other threads
   */
  async createMessage(
    data: MessageCreateRequestOutput & { threadId: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessageCreateResponseOutput>> {
    try {
      // Extract user identifier - use leadId for PUBLIC users, userId for authenticated
      const userIdentifier = user.isPublic ? user.leadId : user.id;

      // SECURITY: Force role to USER for all user-created messages
      // Only the AI stream system can create ASSISTANT/SYSTEM/TOOL/ERROR messages
      if (data.message?.role && data.message.role !== ChatMessageRole.USER) {
        logger.warn("Attempted to create message with non-USER role", {
          attemptedRole: data.message.role,
          userId: userIdentifier,
          isPublic: user.isPublic,
        });

        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // SECURITY: Force role to USER regardless of input
      const safeRole = ChatMessageRole.USER;

      // SECURITY: PUBLIC users cannot set model
      if (user.isPublic && data.message?.model) {
        logger.warn("PUBLIC user attempted to set model", {
          model: data.message.model,
          leadId: user.leadId,
        });

        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
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
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Reject incognito threads - they should never be accessed on server
      const incognitoError = validateNotIncognito(
        thread.rootFolderId,
        locale,
        "app.api.v1.core.agent.chat.threads.threadId.messages.post",
      );
      if (incognitoError) {
        return incognitoError;
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
      if (!(await canPostInThread(user, thread, folder, logger))) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title" as const,
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Calculate depth if parent exists
      let depth = 0;
      if (data.message?.parentId) {
        const [parentMessage] = await db
          .select()
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.id, data.message.parentId),
              eq(chatMessages.threadId, data.threadId),
            ),
          )
          .limit(1);

        if (!parentMessage) {
          return fail({
            message:
              "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.validation.title",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: {
              error:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.validation.parentNotFound",
            },
          });
        }

        depth = parentMessage.depth + 1;
      }

      // Create message with safe values
      const [message] = await db
        .insert(chatMessages)
        .values({
          threadId: data.threadId,
          role: safeRole, // Always USER
          content: data.message?.content || "",
          parentId: data.message?.parentId || null,
          depth,
          authorId: userIdentifier,
          isAI: false, // Always false for user messages
          model: user.isPublic ? null : data.message?.model || null, // No model for PUBLIC users
        })
        .returning({
          id: chatMessages.id,
          createdAt: chatMessages.createdAt,
        });

      if (!message) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Update thread's updatedAt timestamp
      await db
        .update(chatThreads)
        .set({ updatedAt: new Date() })
        .where(eq(chatThreads.id, data.threadId));

      logger.debug("Message created", {
        messageId: message.id,
        threadId: data.threadId,
      });

      return createSuccessResponse({
        id: message.id,
        createdAt: message.createdAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error creating message", parseError(error));
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

export const messagesRepository = new MessagesRepositoryImpl();
