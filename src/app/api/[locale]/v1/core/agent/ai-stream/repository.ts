/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { stepCountIs, streamText } from "ai";
import { and, eq } from "drizzle-orm";
import {
  createStreamingResponse,
  ErrorResponseTypes,
  fail,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { creditRepository } from "@/app/api/[locale]/v1/core/credits/repository";
import { creditValidator } from "@/app/api/[locale]/v1/core/credits/validator";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type {
  CoreTool,
  DiscoveredEndpoint,
} from "@/app/api/[locale]/v1/core/system/unified-interface/ai/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { DefaultFolderId } from "../chat/config";
import {
  chatFolders,
  chatMessages,
  chatThreads,
  type ToolCall,
  type ToolCallResult,
  type ToolCallWidgetMetadata,
} from "../chat/db";
import { ChatMessageRole } from "../chat/enum";
import { getModelCost } from "../chat/model-access/costs";
import { getModelById, type ModelId } from "../chat/model-access/models";
import { CONTINUE_CONVERSATION_PROMPT } from "./system-prompt";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "./definition";
import { createStreamEvent, formatSSEEvent } from "./events";
import { isUncensoredAIModel } from "./providers/uncensored-ai";
import { handleUncensoredAI } from "./providers/uncensored-handler";
import { canWriteFolder, isAdmin } from "../chat/permissions/permissions";

/**
 * Maximum duration for streaming responses (in seconds)
 */
export const maxDuration = 300; // 5 minutes for multi-step tool calling

/**
 * AI Stream Repository Interface
 */
export interface IAiStreamRepository {
  createAiStream(params: {
    data: AiStreamPostRequestOutput;
    t: TFunction;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: Request;
  }): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse>;
}

/**
 * Type guard for tool result values
 * Validates that value is JSON-serializable and matches ToolCallResult type
 */
// eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Type guard requires unknown parameter
function isValidToolResult(value: unknown): value is ToolCallResult {
  if (value === null) {
    return true;
  }
  if (value === undefined) {
    return false; // ToolCallResult does not include undefined
  }
  if (typeof value === "string") {
    return true;
  }
  if (typeof value === "number") {
    return true;
  }
  if (typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    // Arrays are valid - recursively check elements

    return value.every((item) => isValidToolResult(item));
  }
  if (typeof value === "object") {
    // Objects are valid - recursively check values

    return Object.values(value).every((v) => isValidToolResult(v));
  }
  // Reject functions, symbols, etc.
  return false;
}

/**
 * Convert lowercase role string to ChatMessageRole enum
 * Used when receiving roles from API definition (which uses lowercase strings)
 */
function toChatMessageRole(
  role: "user" | "assistant" | "system",
): ChatMessageRole {
  switch (role) {
    case "user":
      return ChatMessageRole.USER;
    case "assistant":
      return ChatMessageRole.ASSISTANT;
    case "system":
      return ChatMessageRole.SYSTEM;
  }
}

/**
 * Convert ChatMessageRole enum to AI SDK compatible role
 * Filters out TOOL and ERROR roles (converts TOOL -> USER, ERROR -> ASSISTANT)
 */
function toAiSdkMessage(message: { role: ChatMessageRole; content: string }): {
  role: "user" | "assistant" | "system";
  content: string;
} | null {
  switch (message.role) {
    case ChatMessageRole.USER:
      return { content: message.content, role: ChatMessageRole.USER };
    case ChatMessageRole.ASSISTANT:
      return { content: message.content, role: ChatMessageRole.ASSISTANT };
    case ChatMessageRole.SYSTEM:
      return { content: message.content, role: ChatMessageRole.SYSTEM };
    case ChatMessageRole.TOOL:
      return { content: message.content, role: ChatMessageRole.USER };
    case ChatMessageRole.ERROR:
      // Error messages become get removed
      return null;
  }
}

function toAiSdkMessages(
  messages: Array<{ role: ChatMessageRole; content: string }>,
): Array<{ role: "user" | "assistant" | "system"; content: string }> {
  return messages.map((msg) => toAiSdkMessage(msg)).filter(Boolean) as Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
}

/**
 * Extract user identifiers from request
 */
function extractUserIdentifiers(
  user: JwtPayloadType,
  request: Request,
  logger: EndpointLogger,
): {
  userId?: string;
  leadId?: string;
  ipAddress?: string;
} {
  logger.debug("Extracting user identifiers", {
    isPublic: user.isPublic,
    hasId: "id" in user,
    hasLeadId: "leadId" in user,
  });

  const userId = !user.isPublic && "id" in user ? user.id : undefined;
  const leadId =
    "leadId" in user && typeof user.leadId === "string"
      ? user.leadId
      : undefined;
  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    undefined;

  logger.debug("Extracted identifiers", { userId, leadId, ipAddress });

  return { userId, leadId, ipAddress };
}

/**
 * Generate thread title from first message
 */
function generateThreadTitle(content: string): string {
  const maxLength = 50;
  const minLastSpace = 20;
  const ellipsis = "...";
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > minLastSpace
    ? `${truncated.substring(0, lastSpace)}${ellipsis}`
    : truncated;
}

/**
 * Create or get thread ID
 */
async function ensureThread({
  threadId,
  rootFolderId,
  subFolderId,
  userId,
  content,
  isIncognito,
  logger,
  user,
}: {
  threadId: string | null | undefined;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null | undefined;
  userId?: string;
  content: string;
  isIncognito: boolean;
  logger: EndpointLogger;
  user: JwtPayloadType;
}): Promise<{ threadId: string; isNew: boolean }> {
  // If threadId provided, verify it exists and check permissions (unless incognito)
  if (threadId) {
    if (!isIncognito && userId) {
      // Get thread without user filter to check permissions properly
      const [existing] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!existing?.id) {
        logger.error("Thread not found", { threadId, userId });
        // Return error through Promise rejection - caller will handle
        return await Promise.reject(new Error("THREAD_NOT_FOUND"));
      }

      // Check if user has permission to write to this thread
      const { canWriteThread } = await import(
        "../chat/permissions/permissions"
      );
      const { chatFolders } = await import("../chat/db");

      // Get folder if thread has one
      let folder: typeof chatFolders.$inferSelect | null = null;
      if (existing.folderId) {
        const [folderResult] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, existing.folderId))
          .limit(1);
        folder = folderResult || null;
      }

      // Check write permission
      const hasPermission = await canWriteThread(
        user,
        existing,
        folder,
        logger,
      );
      if (!hasPermission) {
        logger.error("User does not have permission to write to thread", {
          threadId,
          userId,
          threadUserId: existing.userId,
          rootFolderId: existing.rootFolderId,
        });
        return await Promise.reject(new Error("PERMISSION_DENIED"));
      }

      logger.debug("Thread access granted", {
        threadId,
        userId,
        threadUserId: existing.userId,
        rootFolderId: existing.rootFolderId,
      });
    }
    return { threadId, isNew: false };
  }

  // Create new thread - check permissions first
  const newThreadId = crypto.randomUUID();
  const title = generateThreadTitle(content);

  // Only store in DB if not incognito
  if (!isIncognito && userId) {
    let folder: typeof chatFolders.$inferSelect | null = null;

    if (subFolderId) {
      // Get parent folder to check permissions
      const [folderResult] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, subFolderId))
        .limit(1);

      if (!folderResult) {
        logger.error("Folder not found", { subFolderId });
        return await Promise.reject(new Error("FOLDER_NOT_FOUND"));
      }

      folder = folderResult;
      logger.debug("Found folder for permission check", {
        folderId: folder.id,
        folderName: folder.name,
        rootFolderId: folder.rootFolderId,
        parentId: folder.parentId,
      });
    } else if (rootFolderId === "public" && !subFolderId) {
      // Creating thread directly in PUBLIC root (no folder) - need to check ADMIN permission
      // This is the only case where we need to check for ADMIN role
      const isAdminUser = await isAdmin(userId, logger);

      if (!isAdminUser) {
        logger.error("Only ADMIN can create threads directly in PUBLIC root", {
          userId,
          rootFolderId,
        });
        return await Promise.reject(new Error("PERMISSION_DENIED"));
      }

      // Admin user - allow thread creation in PUBLIC root
      logger.info("ADMIN user creating thread in PUBLIC root", {
        userId,
        rootFolderId,
      });
    }

    // Check if user has permission to create thread in this folder (only if folder exists)
    if (folder) {
      logger.debug("About to check permissions", {
        hasFolder: !!folder,
        folderId: folder?.id,
        folderName: folder?.name,
        folderParentId: folder?.parentId,
        userId,
        rootFolderId,
        subFolderId,
      });
      const hasPermission = await canWriteFolder(user, folder, logger);

      logger.debug("Permission check result", {
        hasPermission,
        userId,
        rootFolderId,
        subFolderId,
      });

      if (!hasPermission) {
        logger.error("User does not have permission to create thread", {
          userId,
          rootFolderId,
          subFolderId,
        });
        return await Promise.reject(new Error("PERMISSION_DENIED"));
      }
    }

    // DO NOT set permission fields - leave as empty arrays to inherit from parent folder
    // Permission inheritance: empty array [] = inherit from parent folder
    // Only set explicit permissions when user overrides via context menu

    await db.insert(chatThreads).values({
      id: newThreadId,
      userId,
      title,
      rootFolderId: rootFolderId as DefaultFolderId,
      folderId: subFolderId ?? null,
      // rolesRead, rolesWrite, rolesHide, rolesDelete are NOT set
      // They default to [] which means inherit from parent folder
    });

    logger.debug("Created new thread", {
      threadId: newThreadId,
      title,
    });
  } else {
    logger.debug("Generated incognito thread ID", { threadId: newThreadId });
  }

  return { threadId: newThreadId, isNew: true };
}

/**
 * Calculate message depth from parent
 */
async function calculateMessageDepth(
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
async function fetchMessageHistory(
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
async function getParentMessage(
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

/**
 * AI Stream Repository Implementation
 */
class AiStreamRepository implements IAiStreamRepository {
  /**
   * Handle send operation - normal message send
   */
  private handleSendOperation(data: AiStreamPostRequestOutput): {
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
   * Handle edit operation - create branch from existing message
   */
  private async handleEditOperation(
    data: AiStreamPostRequestOutput,
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

  /**
   * Handle retry operation - retry AI response
   */
  private async handleRetryOperation(
    data: AiStreamPostRequestOutput,
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

  /**
   * Handle answer-as-ai operation - user provides AI response
   */
  private handleAnswerAsAiOperation(data: AiStreamPostRequestOutput): {
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
   * Create user message in database
   */
  private async createUserMessage(params: {
    messageId: string;
    threadId: string;
    role: ChatMessageRole;
    content: string;
    parentId: string | null;
    depth: number;
    userId: string;
    logger: EndpointLogger;
  }): Promise<void> {
    await db.insert(chatMessages).values({
      id: params.messageId,
      threadId: params.threadId,
      role: params.role,
      content: params.content,
      parentId: params.parentId,
      depth: params.depth,
      authorId: params.userId,
      isAI: false,
    });

    params.logger.debug("Created user message", {
      messageId: params.messageId,
      threadId: params.threadId,
    });
  }

  /**
   * Create AI message placeholder in database
   */
  private async createAiMessagePlaceholder(params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    depth: number;
    userId: string;
    model: ModelId;
    persona: string | null | undefined;
    sequenceId: string | null; // ID of first message in sequence
    sequenceIndex: number; // Position in sequence
    logger: EndpointLogger;
  }): Promise<void> {
    await db.insert(chatMessages).values({
      id: params.messageId,
      threadId: params.threadId,
      role: ChatMessageRole.ASSISTANT,
      content: " ", // Use space instead of empty string (DB constraint requires non-empty)
      parentId: params.parentId,
      depth: params.depth,
      authorId: params.userId, // Set authorId so user can delete their AI messages
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
    });
  }

  /**
   * Create ERROR message in database
   * Used for all error scenarios (API errors, tool errors, validation errors, etc.)
   */
  private async createErrorMessage(params: {
    messageId: string;
    threadId: string;
    content: string; // User-friendly error message
    parentId: string | null;
    depth: number;
    userId: string;
    errorType: string; // e.g., "STREAM_ERROR", "TOOL_ERROR", "API_ERROR"
    errorDetails?: Record<string, string | number | boolean | null>; // Additional error metadata
    sequenceId?: string | null; // Sequence ID for grouping messages in same stream
    sequenceIndex?: number; // Position in sequence
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
      authorId: params.userId,
      isAI: false,
      sequenceId: params.sequenceId ?? null,
      sequenceIndex: params.sequenceIndex ?? 0,
      metadata,
    });

    params.logger.info("Created ERROR message", {
      messageId: params.messageId,
      threadId: params.threadId,
      errorType: params.errorType,
    });
  }

  /**
   * Create ASSISTANT message for text content in database
   */
  private async createTextMessage(params: {
    messageId: string;
    threadId: string;
    content: string;
    parentId: string | null;
    depth: number;
    userId: string;
    model: ModelId;
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
      authorId: params.userId,
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
    });
  }

  /**
   * Update message content in database
   */
  private async updateMessageContent(params: {
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

  /**
   * Create TOOL message in database
   * Tool calls are stored as separate messages with role=TOOL
   */
  private async createToolMessage(params: {
    messageId: string;
    threadId: string;
    toolCall: ToolCall;
    parentId: string | null;
    depth: number;
    userId: string;
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
      content: "", // Tool messages have empty content, data is in metadata
      parentId: params.parentId,
      depth: params.depth,
      authorId: params.userId,
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
    });
  }

  /**
   * Build message context for AI
   */
  private async buildMessageContext(params: {
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: ChatMessageRole;
    userId: string | undefined;
    isIncognito: boolean;
    messageHistory?: Array<{
      role: ChatMessageRole;
      content: string;
    }> | null;
    logger: EndpointLogger;
  }): Promise<
    Array<{ role: "user" | "assistant" | "system"; content: string }>
  > {
    // SECURITY: Reject messageHistory for non-incognito threads
    // Non-incognito threads must fetch history from database to prevent manipulation
    if (!params.isIncognito && params.messageHistory) {
      params.logger.error(
        "Security violation: messageHistory provided for non-incognito thread",
        {
          operation: params.operation,
          threadId: params.threadId,
          isIncognito: params.isIncognito,
        },
      );
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Security violation should throw immediately
      throw new Error(
        "messageHistory is only allowed for incognito mode. Server-side threads fetch history from database.",
      );
    }

    if (params.operation === "answer-as-ai") {
      // For incognito mode, use provided message history
      if (params.isIncognito && params.messageHistory) {
        const messages = toAiSdkMessages(params.messageHistory);
        if (params.content.trim()) {
          messages.push({ role: "user", content: params.content });
        } else {
          messages.push({
            role: "user",
            content: CONTINUE_CONVERSATION_PROMPT,
          });
        }
        return messages;
      }

      // For non-incognito mode, fetch from database
      if (
        !params.isIncognito &&
        params.userId &&
        params.threadId &&
        params.parentMessageId
      ) {
        const allMessages = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.threadId, params.threadId))
          .orderBy(chatMessages.createdAt);

        const parentIndex = allMessages.findIndex(
          (msg) => msg.id === params.parentMessageId,
        );

        if (parentIndex !== -1) {
          const contextMessages = allMessages.slice(0, parentIndex + 1);
          const messages = toAiSdkMessages(contextMessages);

          if (params.content.trim()) {
            messages.push({ role: "user", content: params.content });
          } else {
            messages.push({
              role: "user",
              content: CONTINUE_CONVERSATION_PROMPT,
            });
          }
          return messages;
        } else {
          params.logger.error("Parent message not found in thread", {
            parentMessageId: params.parentMessageId,
            threadId: params.threadId,
          });
          return params.content.trim()
            ? [{ role: "user", content: params.content }]
            : [];
        }
      } else if (params.content.trim()) {
        return [{ role: "user", content: params.content }];
      } else {
        return [];
      }
    } else if (!params.isIncognito && params.userId && params.threadId) {
      // Non-incognito mode: fetch history from database
      const history = await fetchMessageHistory(
        params.threadId,
        params.userId,
        params.logger,
      );
      const currentMessage = toAiSdkMessage({
        role: params.role,
        content: params.content,
      });
      if (!currentMessage) {
        return history;
      }
      return [...history, currentMessage];
    } else if (params.isIncognito && params.messageHistory) {
      // Incognito mode with message history: use provided history from client
      params.logger.debug("Using provided message history for incognito mode", {
        operation: params.operation,
        historyLength: params.messageHistory.length,
      });
      const historyMessages = toAiSdkMessages(params.messageHistory);
      const currentMessage = toAiSdkMessage({
        role: params.role,
        content: params.content,
      });
      if (!currentMessage) {
        return historyMessages;
      }
      return [...historyMessages, currentMessage];
    } else {
      // Fallback: no thread or no history (new conversation)
      const currentMessage = toAiSdkMessage({
        role: params.role,
        content: params.content,
      });
      if (!currentMessage) {
        return [];
      }
      return [currentMessage];
    }
  }

  /**
   * Deduct credits after successful AI response
   */
  private async deductCreditsAfterCompletion(params: {
    modelCost: number;
    user: JwtPayloadType;
    model: ModelId;
    logger: EndpointLogger;
  }): Promise<void> {
    await creditRepository.deductCreditsForFeature(
      params.user,
      params.modelCost,
      params.model,
      params.logger,
    );
  }

  /**
   * Load and prepare tools for AI
   */
  private async loadTools(params: {
    requestedTools: string[] | null | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    systemPrompt: string;
  }): Promise<{
    tools: Record<string, CoreTool> | undefined;
    systemPrompt: string;
  }> {
    let tools: Record<string, CoreTool> | undefined = undefined;
    let enhancedSystemPrompt = params.systemPrompt;

    // If tools are explicitly disabled (null) or not requested (undefined/empty), don't load any
    if (
      params.requestedTools === null ||
      params.requestedTools === undefined ||
      params.requestedTools.length === 0
    ) {
      params.logger.debug("No tools requested, skipping tool loading");
      return { tools, systemPrompt: enhancedSystemPrompt };
    }

    try {
      const { getToolRegistry } = await import(
        "@/app/api/[locale]/v1/core/system/unified-interface/ai/registry"
      );
      const registry = getToolRegistry();

      // Lazy load ONLY the requested tools by endpoint IDs instead of loading all 143 endpoints
      // This uses the generated/endpoint.ts dynamic import system
      // requestedTools contains endpoint IDs (e.g., "get_v1_core_agent_brave_search")
      const enabledEndpoints = await registry.getEndpointsByIdsLazy(
        params.requestedTools,
        params.user,
      );

      params.logger.debug("Lazy loaded tools by endpoint IDs", {
        requestedCount: params.requestedTools.length,
        loadedCount: enabledEndpoints.length,
        loadedIds: enabledEndpoints.map((endpoint) => endpoint.id),
        loadedNames: enabledEndpoints.map((endpoint) => endpoint.toolName),
      });

      if (enabledEndpoints.length > 0) {
        const { getToolExecutor } = await import(
          "@/app/api/[locale]/v1/core/system/unified-interface/ai/executor"
        );
        const { createToolsFromEndpoints } = await import(
          "@/app/api/[locale]/v1/core/system/unified-interface/ai/factory"
        );
        const toolExecutor = getToolExecutor();
        const toolsMap = createToolsFromEndpoints(
          enabledEndpoints,
          toolExecutor,
          {
            user: params.user,
            locale: params.locale,
            logger: params.logger,
          },
        );

        tools = Object.fromEntries(toolsMap.entries());

        params.logger.info("Tools created", {
          count: toolsMap.size,
          toolNames: [...toolsMap.keys()],
        });

        // Model already knows how to call tools from tool descriptions
        // No need to add extra instructions to system prompt
      }
    } catch (error) {
      params.logger.error("Failed to load tools from registry", {
        error: error instanceof Error ? error.message : String(error),
      });
      // Continue without tools - don't fail the request
    }

    return { tools, systemPrompt: enhancedSystemPrompt };
  }
  /**
   * Create AI streaming response with SSE events
   * Returns StreamingResponse for SSE stream or error ResponseType
   */
  async createAiStream({
    data,
    locale,
    logger,
    user,
    request,
  }: {
    data: AiStreamPostRequestOutput;
    t: TFunction;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: Request;
  }): Promise<ResponseType<AiStreamPostResponseOutput> | StreamingResponse> {
    // Extract user identifiers
    const { userId, leadId, ipAddress } = extractUserIdentifiers(
      user,
      request,
      logger,
    );

    const isIncognito = data.rootFolderId === "incognito";

    logger.debug("Creating AI stream", {
      operation: data.operation,
      model: data.model,
      rootFolderId: data.rootFolderId,
      isIncognito,
      userId,
      leadId,
    });

    // Step 0: Validate that non-logged-in users can only use incognito mode
    if (!userId && !isIncognito) {
      logger.error("Non-logged-in user attempted to use non-incognito folder", {
        rootFolderId: data.rootFolderId,
        leadId,
      });
      return fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.authenticationRequired",
        errorType: ErrorResponseTypes.AUTH_ERROR,
      });
    }

    // Step 1: Validate credits
    const modelCost = getModelCost(data.model);
    let validationResult;
    let effectiveLeadId = leadId;

    if (userId) {
      // Authenticated user
      validationResult = await creditValidator.validateUserCredits(
        userId,
        data.model,
        logger,
      );
    } else if (leadId) {
      // Known lead
      validationResult = await creditValidator.validateLeadCredits(
        leadId,
        data.model,
        logger,
      );
    } else if (ipAddress) {
      // New visitor - get or create lead by IP
      const leadByIpResult = await creditValidator.validateLeadByIp(
        ipAddress,
        data.model,
        locale,
        logger,
      );

      if (!leadByIpResult.success) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.aiStream.route.errors.creditValidationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      effectiveLeadId = leadByIpResult.data.leadId;
      validationResult = {
        success: true,
        data: leadByIpResult.data.validation,
      };
    } else {
      // No identifier - should not happen
      logger.error("No user, lead, or IP address provided");
      return fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.noIdentifier",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    if (!validationResult.success) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.creditValidationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Step 2: Check if user has enough credits (unless free model)
    if (!validationResult.data.canUseModel) {
      logger.warn("Insufficient credits", {
        userId,
        leadId: effectiveLeadId,
        model: data.model,
        cost: modelCost,
        balance: validationResult.data.balance,
      });

      return fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.insufficientCredits",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          cost: modelCost.toString(),
          balance: validationResult.data.balance.toString(),
        },
      });
    }

    logger.debug("Credit validation passed", {
      userId,
      leadId: effectiveLeadId,
      cost: modelCost,
      balance: validationResult.data.balance,
    });

    // Step 3: Handle operation-specific logic
    let operationResult: {
      threadId: string | null | undefined;
      parentMessageId: string | null | undefined;
      content: string;
      role: ChatMessageRole;
    };

    switch (data.operation) {
      case "send":
        operationResult = this.handleSendOperation(data);
        break;

      case "retry":
        if (isIncognito) {
          // For incognito, client provides the context
          logger.info("Retry operation in incognito mode", {
            parentMessageId: data.parentMessageId,
          });
          operationResult = this.handleSendOperation(data);
        } else {
          const retryResult = await this.handleRetryOperation(
            data,
            userId,
            logger,
          );
          if (!retryResult) {
            return fail({
              message:
                "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }
          operationResult = retryResult;
        }
        break;

      case "edit":
        if (isIncognito) {
          // For incognito mode, the client must pass the correct parentId directly
          // The client looks up the source message and passes its parentId
          // This creates a sibling branch with the same parent as the source message
          operationResult = {
            threadId: data.threadId!,
            parentMessageId: data.parentMessageId,
            content: data.content,
            role: data.role,
          };
        } else {
          const editResult = await this.handleEditOperation(
            data,
            userId,
            logger,
          );
          if (!editResult) {
            return fail({
              message:
                "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }
          operationResult = editResult;
        }
        break;

      case "answer-as-ai":
        operationResult = this.handleAnswerAsAiOperation(data);
        logger.info("Answer-as-AI operation", {
          threadId: data.threadId,
          parentMessageId: data.parentMessageId,
        });
        break;
    }

    const effectiveThreadId = operationResult.threadId;
    const effectiveParentMessageId = operationResult.parentMessageId;
    const effectiveContent = operationResult.content;
    const effectiveRole = operationResult.role;

    // Step 4: Ensure thread exists (create if needed)
    let threadResult;
    try {
      threadResult = await ensureThread({
        threadId: effectiveThreadId,
        rootFolderId: data.rootFolderId,
        subFolderId: data.subFolderId,
        userId,
        content: effectiveContent,
        isIncognito,
        logger,
        user,
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to ensure thread", {
        error: errorMessage,
      });

      // Check if it's a permission error
      if (errorMessage === "PERMISSION_DENIED") {
        return fail({
          message:
            "app.api.v1.core.agent.chat.aiStream.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return fail({
        message:
          "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Step 5: Calculate message depth
    const messageDepth = await calculateMessageDepth(
      effectiveParentMessageId,
      isIncognito,
    );

    // Step 6: Create user message (skip for answer-as-ai and retry operations)
    const userMessageId = crypto.randomUUID();
    if (data.operation !== "answer-as-ai" && data.operation !== "retry") {
      if (!isIncognito && userId) {
        await this.createUserMessage({
          messageId: userMessageId,
          threadId: threadResult.threadId,
          role: effectiveRole,
          content: effectiveContent,
          parentId: effectiveParentMessageId ?? null,
          depth: messageDepth,
          userId,
          logger,
        });
      } else {
        logger.debug("Generated incognito user message ID", {
          messageId: userMessageId,
          operation: data.operation,
        });
      }
    }

    // Step 7: Prepare AI message context
    let systemPrompt = data.systemPrompt || "";
    const messages = await this.buildMessageContext({
      operation: data.operation,
      threadId: effectiveThreadId,
      parentMessageId: data.parentMessageId,
      content: effectiveContent,
      role: effectiveRole,
      userId,
      isIncognito,
      messageHistory: data.messageHistory
        ? data.messageHistory.map((msg) => ({
            role: toChatMessageRole(msg.role),
            content: msg.content,
          }))
        : null,
      logger,
    });

    // Add system prompt for non-incognito mode
    if (
      !isIncognito &&
      systemPrompt &&
      messages.length > 0 &&
      messages[0].role !== "system"
    ) {
      messages.unshift({ role: "system", content: systemPrompt });
    }

    // Step 8: Generate AI message ID
    // Note: AI message placeholder is created inside the stream (after line 1260)
    // to avoid duplicate inserts. The placeholder is created when we start streaming content.
    let aiMessageId = crypto.randomUUID();
    logger.debug("Generated AI message ID", {
      messageId: aiMessageId,
      operation: data.operation,
      isIncognito,
    });

    // Step 9: Start AI streaming (for all operations including answer-as-ai)
    try {
      // Special handling for Uncensored.ai - doesn't support streaming
      if (isUncensoredAIModel(data.model)) {
        if (!env.UNCENSORED_AI_API_KEY) {
          logger.error("Uncensored.ai API key not configured");
          return {
            success: false,
            message:
              "app.api.v1.core.agent.chat.aiStream.route.errors.uncensoredApiKeyMissing",
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          };
        }

        const response = await handleUncensoredAI(
          env.UNCENSORED_AI_API_KEY,
          messages,
          data.temperature,
          data.maxTokens,
          locale,
        );

        // Incognito mode: messages are not persisted, streaming handled client-side
        return createStreamingResponse(response);
      }

      const provider = createOpenRouter({
        apiKey: env.OPENROUTER_API_KEY,
      });

      logger.debug("Starting OpenRouter stream", {
        model: data.model,
        tools: data.tools,
      });

      // Get model config to check tool support
      const modelConfig = getModelById(data.model);

      // Load tools if model supports them
      let tools: Record<string, CoreTool> | undefined = undefined;
      if (modelConfig?.supportsTools) {
        const toolsResult = await this.loadTools({
          requestedTools: data.tools,
          user,
          locale,
          logger,
          systemPrompt,
        });
        tools = toolsResult.tools;
        systemPrompt = toolsResult.systemPrompt;
      }

      // Create SSE stream
      const encoder = new TextEncoder();
      // Bind methods to preserve 'this' context in async callback
      const deductCredits = this.deductCreditsAfterCompletion.bind(this);
      const createTextMessage = this.createTextMessage.bind(this);
      const updateMessageContent = this.updateMessageContent.bind(this);
      const createToolMessage = this.createToolMessage.bind(this);
      const createErrorMessage = this.createErrorMessage.bind(this);

      // Track parent/depth/sequence for error handling (accessible in catch block)
      let lastParentId: string | null = null;
      let lastDepth = 0;
      let lastSequenceId: string | null = null;
      let lastSequenceIndex = 0;

      const stream = new ReadableStream({
        async start(controller): Promise<void> {
          try {
            logger.debug("Stream start() called");
            // Emit thread-created event if new thread
            if (threadResult.isNew) {
              logger.debug("Emitting THREAD_CREATED event", {
                threadId: threadResult.threadId,
                rootFolderId: data.rootFolderId,
              });
              const threadEvent = createStreamEvent.threadCreated({
                threadId: threadResult.threadId,
                title: generateThreadTitle(data.content),
                rootFolderId: data.rootFolderId,
                subFolderId: data.subFolderId || null,
              });
              controller.enqueue(encoder.encode(formatSSEEvent(threadEvent)));
              logger.debug("THREAD_CREATED event emitted", {
                threadId: threadResult.threadId,
              });
            } else {
              logger.debug(
                "Thread already exists, not emitting THREAD_CREATED",
                {
                  threadId: threadResult.threadId,
                  isNew: threadResult.isNew,
                },
              );
            }

            // For answer-as-ai, skip user message event and only emit AI message
            // For regular operations, emit both user and AI message events
            if (
              data.operation !== "answer-as-ai" &&
              data.operation !== "retry"
            ) {
              // Emit user message-created event
              logger.debug("Emitting USER MESSAGE_CREATED event", {
                messageId: userMessageId,
                threadId: threadResult.threadId,
                parentId: effectiveParentMessageId || null,
              });
              const userMessageEvent = createStreamEvent.messageCreated({
                messageId: userMessageId,
                threadId: threadResult.threadId,
                role: effectiveRole,
                parentId: effectiveParentMessageId || null,
                depth: messageDepth,
                content: effectiveContent,
              });
              const userMessageEventString = formatSSEEvent(userMessageEvent);
              logger.debug("USER MESSAGE_CREATED event formatted", {
                messageId: userMessageId,
              });
              controller.enqueue(encoder.encode(userMessageEventString));
              logger.debug("USER MESSAGE_CREATED event emitted", {
                messageId: userMessageId,
              });
            } else {
              logger.debug(
                "Skipping USER MESSAGE_CREATED event for answer-as-ai operation",
                {
                  messageId: userMessageId,
                },
              );
            }

            // Calculate initial parent and depth for AI message
            // This will be updated if reasoning occurs
            const initialAiParentId =
              data.operation === "answer-as-ai" || data.operation === "retry"
                ? (effectiveParentMessageId ?? null)
                : userMessageId;
            const initialAiDepth =
              data.operation === "answer-as-ai" || data.operation === "retry"
                ? messageDepth
                : messageDepth + 1;

            // Don't emit AI message-created event yet
            // We'll emit it when we start getting content, so we can set the correct parent
            // (if there's reasoning, the AI message should be a child of the reasoning message)

            // Start streaming
            // NEW ARCHITECTURE: Single ASSISTANT message with inline <think> tags
            // Only interrupted by tool calls
            let currentAssistantMessageId: string | null = null; // Current ASSISTANT message being streamed
            let currentAssistantContent = ""; // Accumulated content (reasoning + text with <think> tags inline)
            let currentToolMessageId: string | null = null; // Current tool message being processed
            let currentToolCallData: {
              toolCall: ToolCall;
              parentId: string | null;
              depth: number;
              sequenceIndex: number;
            } | null = null; // Tool call data (stored until result arrives)
            let isInReasoningBlock = false; // Track if we're inside <think></think> tags

            // Track message sequencing - all messages in this response share the same sequenceId
            const sequenceId = crypto.randomUUID(); // Generate independent sequence ID
            let sequenceIndex = 0; // Current position in sequence

            // Track the current parent for chaining messages
            // This gets updated as we create reasoning messages and tool calls
            let currentParentId = initialAiParentId;
            let currentDepth = initialAiDepth;

            // Update last known values for error handling
            lastSequenceId = sequenceId;
            lastParentId = currentParentId;
            lastDepth = currentDepth;
            lastSequenceIndex = sequenceIndex;

            // Get the OpenRouter model ID (use openRouterModel if available, otherwise use model ID directly)
            const openRouterModelId =
              modelConfig?.openRouterModel || data.model;

            // Use Vercel AI SDK's built-in multi-step tool calling
            // maxSteps: allows up to 50 steps (tool call + text generation cycles)
            // This allows for long-running tool sequences that could take minutes
            logger.info("[AI Stream] ⏱️ Calling streamText");
            const streamResult = streamText({
              model: provider(openRouterModelId),
              messages,
              temperature: data.temperature,
              abortSignal: AbortSignal.timeout(maxDuration * 1000),
              system: systemPrompt || undefined,
              ...(tools
                ? {
                    tools,
                    // Enable multi-step tool calling loop - AI can call tools up to 50 times
                    // stopWhen is required for the loop to continue after tool results
                    stopWhen: stepCountIs(50),
                    onStepFinish: ({
                      text,
                      toolCalls,
                      toolResults,
                      finishReason,
                      usage,
                    }): void => {
                      logger.info("[AI Stream] Step finished", {
                        hasText: !!text,
                        textLength: text?.length || 0,
                        toolCallsCount: toolCalls.length,
                        toolResultsCount: toolResults.length,
                        finishReason,
                        totalTokens: usage.totalTokens,
                        textPreview: text?.substring(0, 100),
                      });
                    },
                  }
                : {}),
            });
            logger.info(
              "[AI Stream] ⏱️ streamText returned, starting iteration",
            );

            // Lazy load endpoint metadata only when tool calls are encountered
            // This avoids loading all 143 endpoints when no tools are used
            let endpointMap: Map<string, DiscoveredEndpoint> | null = null;
            const getEndpointMap = async (): Promise<
              Map<string, DiscoveredEndpoint>
            > => {
              if (!endpointMap) {
                const { getToolRegistry } = await import(
                  "@/app/api/[locale]/v1/core/system/unified-interface/ai/registry"
                );
                const registry = getToolRegistry();
                const allEndpoints = registry.getEndpoints(user, Platform.AI);
                endpointMap = new Map(
                  allEndpoints.map((endpoint) => [endpoint.toolName, endpoint]),
                );
                logger.debug("Lazy loaded endpoint metadata for tool calls", {
                  endpointCount: allEndpoints.length,
                });
              }
              return endpointMap;
            };

            // Stream the response
            logger.info("[AI Stream] ⏱️ Starting to process fullStream");

            // NEW ARCHITECTURE: Don't create initial message
            // Messages are created on-demand as content arrives (reasoning, text, tool calls)

            logger.info("[AI Stream] ⏱️ Entering for-await loop");
            for await (const part of streamResult.fullStream) {
              if (part.type === "start-step") {
                logger.info("[AI Stream] Step started", {
                  stepNumber: ("stepNumber" in part
                    ? String(part.stepNumber)
                    : "unknown") as string,
                });
              } else if (part.type === "finish-step") {
                const finishReason =
                  "finishReason" in part
                    ? String(part.finishReason)
                    : "unknown";
                const usage =
                  "usage" in part && part.usage ? part.usage : undefined;
                logger.info("[AI Stream] Step finished", {
                  finishReason,
                  usage: usage as Record<string, number> | undefined,
                });
              } else if (part.type === "text-delta") {
                const textDelta = part.text;

                if (
                  textDelta !== undefined &&
                  textDelta !== null &&
                  textDelta !== ""
                ) {
                  // NEW ARCHITECTURE: Add text to current ASSISTANT message (or create if doesn't exist)
                  if (!currentAssistantMessageId) {
                    // Generate new message ID for ASSISTANT message
                    currentAssistantMessageId = crypto.randomUUID();
                    currentAssistantContent = textDelta;

                    // Emit MESSAGE_CREATED event
                    const messageEvent = createStreamEvent.messageCreated({
                      messageId: currentAssistantMessageId,
                      threadId: threadResult.threadId,
                      role: ChatMessageRole.ASSISTANT,
                      content: textDelta,
                      parentId: currentParentId,
                      depth: currentDepth,
                      model: data.model,
                      persona: data.persona ?? undefined,
                      sequenceId,
                      sequenceIndex,
                    });
                    controller.enqueue(
                      encoder.encode(formatSSEEvent(messageEvent)),
                    );

                    // Save ASSISTANT message to database if not incognito
                    if (!isIncognito && userId) {
                      await createTextMessage({
                        messageId: currentAssistantMessageId,
                        threadId: threadResult.threadId,
                        content: textDelta,
                        parentId: currentParentId,
                        depth: currentDepth,
                        userId,
                        model: data.model,
                        persona: data.persona ?? undefined,
                        sequenceId,
                        sequenceIndex,
                        logger,
                      });
                    }

                    logger.debug("ASSISTANT message created", {
                      messageId: currentAssistantMessageId,
                      sequenceIndex,
                    });
                  } else {
                    // Accumulate content
                    currentAssistantContent += textDelta;
                  }

                  // Emit content-delta event
                  const deltaEvent = createStreamEvent.contentDelta({
                    messageId: currentAssistantMessageId,
                    delta: textDelta,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(deltaEvent)),
                  );
                }
              } else if (part.type === "reasoning-start") {
                // NEW ARCHITECTURE: Add <think> tag inline to current ASSISTANT message
                isInReasoningBlock = true;
                const thinkTag = "<think>";

                // Create ASSISTANT message if it doesn't exist yet
                if (!currentAssistantMessageId) {
                  currentAssistantMessageId = crypto.randomUUID();
                  currentAssistantContent = thinkTag;

                  // Emit MESSAGE_CREATED event
                  const messageEvent = createStreamEvent.messageCreated({
                    messageId: currentAssistantMessageId,
                    threadId: threadResult.threadId,
                    role: ChatMessageRole.ASSISTANT,
                    content: thinkTag,
                    parentId: currentParentId,
                    depth: currentDepth,
                    model: data.model,
                    persona: data.persona ?? undefined,
                    sequenceId,
                    sequenceIndex,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(messageEvent)),
                  );

                  // Save ASSISTANT message to database if not incognito
                  if (!isIncognito && userId) {
                    await createTextMessage({
                      messageId: currentAssistantMessageId,
                      threadId: threadResult.threadId,
                      content: thinkTag,
                      parentId: currentParentId,
                      depth: currentDepth,
                      userId,
                      model: data.model,
                      persona: data.persona ?? undefined,
                      sequenceId,
                      sequenceIndex,
                      logger,
                    });
                  }

                  logger.debug("ASSISTANT message created with reasoning", {
                    messageId: currentAssistantMessageId,
                    sequenceIndex,
                  });
                } else {
                  // Add <think> tag to existing message
                  currentAssistantContent += thinkTag;

                  // Emit delta for <think> tag
                  const deltaEvent = createStreamEvent.contentDelta({
                    messageId: currentAssistantMessageId,
                    delta: thinkTag,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(deltaEvent)),
                  );
                }

                logger.info("[AI Stream] ⏱️ Reasoning started → <think>");
              } else if (part.type === "reasoning-delta") {
                // NEW ARCHITECTURE: Add reasoning text inline to current ASSISTANT message
                const reasoningText = "text" in part ? part.text : "";

                if (
                  reasoningText !== undefined &&
                  reasoningText !== null &&
                  reasoningText !== "" &&
                  currentAssistantMessageId
                ) {
                  // Accumulate content
                  currentAssistantContent += reasoningText;

                  // Emit content delta
                  const deltaEvent = createStreamEvent.contentDelta({
                    messageId: currentAssistantMessageId,
                    delta: reasoningText,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(deltaEvent)),
                  );
                }
              } else if (part.type === "reasoning-end") {
                // NEW ARCHITECTURE: Add </think> tag inline to current ASSISTANT message
                if (currentAssistantMessageId && isInReasoningBlock) {
                  const thinkCloseTag = "</think>";

                  // Add closing tag
                  currentAssistantContent += thinkCloseTag;

                  // Emit closing tag delta
                  const thinkCloseDelta = createStreamEvent.contentDelta({
                    messageId: currentAssistantMessageId,
                    delta: thinkCloseTag,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(thinkCloseDelta)),
                  );

                  isInReasoningBlock = false;

                  logger.info("[AI Stream] ⏱️ Reasoning ended → </think>", {
                    messageId: currentAssistantMessageId,
                    contentLength: currentAssistantContent.length,
                  });
                }
              } else if (part.type === "tool-call") {
                // NEW ARCHITECTURE: Finalize current ASSISTANT message before creating tool message
                if (currentAssistantMessageId && currentAssistantContent) {
                  // CRITICAL FIX: If reasoning block is still open, close it before tool call
                  if (isInReasoningBlock) {
                    const thinkCloseTag = "</think>";
                    currentAssistantContent += thinkCloseTag;

                    // Emit closing tag delta
                    const thinkCloseDelta = createStreamEvent.contentDelta({
                      messageId: currentAssistantMessageId,
                      delta: thinkCloseTag,
                    });
                    controller.enqueue(
                      encoder.encode(formatSSEEvent(thinkCloseDelta)),
                    );

                    isInReasoningBlock = false;

                    logger.info(
                      "[AI Stream] ⏱️ Reasoning interrupted by tool call → </think>",
                      {
                        messageId: currentAssistantMessageId,
                      },
                    );
                  }

                  // Update ASSISTANT message in database with accumulated content
                  if (!isIncognito && userId) {
                    await updateMessageContent({
                      messageId: currentAssistantMessageId,
                      content: currentAssistantContent,
                      logger,
                    });
                  }

                  logger.debug("Finalized ASSISTANT message before tool call", {
                    messageId: currentAssistantMessageId,
                    contentLength: currentAssistantContent.length,
                  });

                  // Increment sequence index for tool message
                  sequenceIndex++;

                  // Update parent chain: tool message should be child of ASSISTANT message
                  currentParentId = currentAssistantMessageId;
                  currentDepth++;

                  // Update last known values for error handling
                  lastParentId = currentParentId;
                  lastDepth = currentDepth;
                  lastSequenceIndex = sequenceIndex;

                  // Clear current ASSISTANT message (tool call interrupts it)
                  currentAssistantMessageId = null;
                  currentAssistantContent = "";
                  isInReasoningBlock = false;
                }

                // Lazy load endpoint metadata only when tool calls are encountered
                const map = await getEndpointMap();
                const endpoint = map.get(part.toolName);

                // Try to get widget metadata from endpoint definition
                let widgetMetadata: ToolCallWidgetMetadata | undefined;

                // Extract widget metadata from endpoint definition
                if (endpoint) {
                  try {
                    const { ResponseMetadataExtractor } = await import(
                      "@/app/api/[locale]/v1/core/system/unified-interface/cli/widgets/response-metadata-extractor"
                    );
                    const extractor = new ResponseMetadataExtractor();

                    // Debug: Log endpoint structure
                    logger.info("[AI Stream] Endpoint structure", {
                      toolName: part.toolName,
                      hasDefinition: !!endpoint.definition,
                      hasFields: !!endpoint.definition?.fields,
                      fieldsType: typeof endpoint.definition?.fields,
                      fieldsKeys:
                        endpoint.definition?.fields &&
                        typeof endpoint.definition.fields === "object"
                          ? Object.keys(endpoint.definition.fields).slice(0, 5)
                          : [],
                    });

                    const metadata = extractor.extractResponseMetadata(
                      endpoint.definition,
                    );

                    logger.info("[AI Stream] Widget metadata extraction", {
                      toolName: part.toolName,
                      hasMetadata: !!metadata,
                      hasFields: !!metadata?.fields,
                      fieldsCount: metadata?.fields?.length || 0,
                    });

                    if (metadata?.fields && metadata.fields.length > 0) {
                      widgetMetadata = {
                        endpointId: endpoint.toolName,
                        responseFields: metadata.fields.map((field) => ({
                          name: field.name,
                          widgetType: field.widgetType,
                          label: field.label,
                          description: field.description,
                          layout: field.config as Record<
                            string,
                            string | number | boolean
                          >,
                        })),
                      };
                      logger.info("[AI Stream] Widget metadata created", {
                        toolName: part.toolName,
                        endpointId: widgetMetadata.endpointId,
                        responseFieldsCount:
                          widgetMetadata.responseFields.length,
                      });
                    } else {
                      widgetMetadata = undefined;
                      logger.warn(
                        "[AI Stream] No widget metadata fields found",
                        {
                          toolName: part.toolName,
                        },
                      );
                    }
                  } catch (error) {
                    logger.error("Failed to extract widget metadata", {
                      error: String(error),
                      toolName: part.toolName,
                    });
                    widgetMetadata = undefined;
                  }
                } else {
                  logger.warn("[AI Stream] No endpoint found for tool", {
                    toolName: part.toolName,
                  });
                  widgetMetadata = undefined;
                }

                // Validate and prepare tool call data
                const rawArgs = "input" in part ? part.input : {};
                const validatedArgs: ToolCallResult = isValidToolResult(rawArgs)
                  ? rawArgs
                  : {};

                const toolCallData: ToolCall = {
                  toolName: part.toolName,
                  displayName: endpoint?.definition.title || part.toolName,
                  icon: endpoint?.definition.aiTool?.icon,
                  args: validatedArgs,
                  creditsUsed: endpoint?.definition.credits ?? 0,
                  widgetMetadata,
                };

                // NEW ARCHITECTURE: Emit MESSAGE_CREATED for UI, but DON'T store in DB yet
                // DB storage happens only when tool-result arrives
                currentToolMessageId = crypto.randomUUID();

                // Store tool call data for later (when result arrives)
                currentToolCallData = {
                  toolCall: toolCallData,
                  parentId: currentParentId,
                  depth: currentDepth,
                  sequenceIndex,
                };

                // Emit MESSAGE_CREATED event for UI (immediate feedback)
                // Include toolCalls array so frontend can render tool display
                const toolMessageEvent = createStreamEvent.messageCreated({
                  messageId: currentToolMessageId,
                  threadId: threadResult.threadId,
                  role: ChatMessageRole.TOOL,
                  content: "",
                  parentId: currentParentId,
                  depth: currentDepth,
                  sequenceId,
                  sequenceIndex,
                  toolCalls: [toolCallData], // Include tool call data for frontend rendering
                });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(toolMessageEvent)),
                );

                // Emit TOOL_CALL event for real-time UX
                const toolCallEvent = createStreamEvent.toolCall({
                  messageId: currentToolMessageId,
                  toolName: toolCallData.toolName,
                  args: toolCallData.args,
                });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(toolCallEvent)),
                );

                logger.info(
                  "[AI Stream] Tool call started (UI notified, DB storage pending)",
                  {
                    messageId: currentToolMessageId,
                    toolName: part.toolName,
                    sequenceIndex,
                  },
                );

                // Increment sequence index for next message
                sequenceIndex++;

                // Update parent chain: next message should be child of this tool message
                currentParentId = currentToolMessageId;
                currentDepth++;
              } else if (part.type === "tool-result") {
                // NEW ARCHITECTURE: NOW store TOOL message in DB with result
                if (currentToolMessageId && currentToolCallData) {
                  // AI SDK returns 'output' as unknown type
                  const output = "output" in part ? part.output : undefined;

                  logger.info("[AI Stream] Tool result RAW output", {
                    toolName: part.toolName,
                    hasOutput: "output" in part,
                    outputType: typeof output,
                    outputStringified: JSON.stringify(output).substring(0, 500),
                  });

                  // Check if the output is an error result
                  let toolError: string | undefined;
                  if (
                    output &&
                    typeof output === "object" &&
                    "success" in output &&
                    "error" in output
                  ) {
                    if (output.success === false) {
                      toolError =
                        typeof output.error === "string"
                          ? (output.error as string)
                          : JSON.stringify(output.error);
                    }
                  }

                  // Clean output by removing undefined values (they break validation)
                  const cleanedOutput = output
                    ? JSON.parse(JSON.stringify(output))
                    : undefined;

                  // Validate and type the output using type guard
                  const validatedOutput: ToolCallResult | undefined =
                    isValidToolResult(cleanedOutput)
                      ? cleanedOutput
                      : undefined;

                  // If error, create ERROR message first (proper timestamp order)
                  if (toolError && !isIncognito && userId) {
                    const errorMessageId = crypto.randomUUID();
                    await createErrorMessage({
                      messageId: errorMessageId,
                      threadId: threadResult.threadId,
                      content: toolError,
                      errorType: "TOOL_ERROR",
                      parentId: currentToolCallData.parentId,
                      depth: currentToolCallData.depth,
                      userId,
                      sequenceId,
                      sequenceIndex: currentToolCallData.sequenceIndex - 0.5, // Insert before tool message
                      logger,
                    });

                    logger.info(
                      "[AI Stream] ERROR message created for tool error",
                      {
                        errorMessageId,
                        toolError,
                      },
                    );
                  }

                  // Add result to tool call data (for both DB and UI)
                  const toolCallWithResult: ToolCall = {
                    ...currentToolCallData.toolCall,
                    result: validatedOutput,
                    error: toolError,
                  };

                  // NOW create TOOL message in DB with result/error
                  if (!isIncognito && userId) {
                    await createToolMessage({
                      messageId: currentToolMessageId,
                      threadId: threadResult.threadId,
                      toolCall: toolCallWithResult,
                      parentId: currentToolCallData.parentId,
                      depth: currentToolCallData.depth,
                      userId,
                      sequenceId,
                      sequenceIndex: currentToolCallData.sequenceIndex,
                      logger,
                    });
                  }

                  logger.info(
                    "[AI Stream] Tool result validated and saved to DB",
                    {
                      messageId: currentToolMessageId,
                      toolName: part.toolName,
                      hasResult: !!validatedOutput,
                      hasError: !!toolError,
                      resultType: typeof validatedOutput,
                      isValid: isValidToolResult(cleanedOutput),
                      wasCleaned: output !== cleanedOutput,
                    },
                  );

                  // Emit TOOL_RESULT event for real-time UX with updated tool call data
                  const toolResultEvent = createStreamEvent.toolResult({
                    messageId: currentToolMessageId,
                    toolName: part.toolName,
                    result: validatedOutput,
                    error: toolError,
                    toolCall: toolCallWithResult, // Include full tool call data with result
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(toolResultEvent)),
                  );

                  // Clear current tool message tracking
                  currentToolMessageId = null;
                  currentToolCallData = null;

                  logger.info("[AI Stream] Tool result streamed to UI", {
                    toolName: part.toolName,
                    hasResult: !!validatedOutput,
                    hasError: !!toolError,
                  });
                }
              } else {
                // Log unhandled event types
                logger.debug("[AI Stream] Unhandled event type", {
                  type: part.type,
                  partKeys: Object.keys(part),
                });
              }
            }

            logger.info("[AI Stream] Finished processing fullStream");

            // NEW ARCHITECTURE: Finalize current ASSISTANT message if exists
            if (currentAssistantMessageId && currentAssistantContent) {
              // CRITICAL FIX: If reasoning block is still open, close it at stream end
              if (isInReasoningBlock) {
                const thinkCloseTag = "</think>";
                currentAssistantContent += thinkCloseTag;

                // Emit closing tag delta
                const thinkCloseDelta = createStreamEvent.contentDelta({
                  messageId: currentAssistantMessageId,
                  delta: thinkCloseTag,
                });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(thinkCloseDelta)),
                );

                isInReasoningBlock = false;

                logger.info(
                  "[AI Stream] ⏱️ Reasoning closed at stream end → </think>",
                  {
                    messageId: currentAssistantMessageId,
                  },
                );
              }

              // Emit CONTENT_DONE event for ASSISTANT message
              // Wait for completion first to get tokens and finishReason
              const [finishReason, usage] = await Promise.all([
                streamResult.finishReason,
                streamResult.usage,
              ]);

              const contentDoneEvent = createStreamEvent.contentDone({
                messageId: currentAssistantMessageId,
                content: currentAssistantContent,
                totalTokens: usage.totalTokens ?? null,
                finishReason: finishReason || null,
              });
              controller.enqueue(
                encoder.encode(formatSSEEvent(contentDoneEvent)),
              );

              // Update ASSISTANT message in database with final content and tokens
              if (!isIncognito && userId) {
                await db
                  .update(chatMessages)
                  .set({
                    content: currentAssistantContent,
                    tokens: usage.totalTokens,
                    updatedAt: new Date(),
                  })
                  .where(eq(chatMessages.id, currentAssistantMessageId));
              }

              logger.info("Finalized ASSISTANT message", {
                messageId: currentAssistantMessageId,
                contentLength: currentAssistantContent.length,
                tokens: usage.totalTokens,
              });
            }

            // Wait for completion to get final usage stats
            const usage = await streamResult.usage;

            logger.info("[AI Stream] Stream completed", {
              totalTokens: usage.totalTokens,
            });

            // Deduct credits AFTER successful completion (not optimistically)
            await deductCredits({
              modelCost,
              user,
              model: data.model,
              logger,
            });

            controller.close();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            logger.error("Stream error", { error: errorMessage });

            // NEW ARCHITECTURE: Create ERROR message in DB/localStorage
            const errorMessageId = crypto.randomUUID();
            if (!isIncognito && userId) {
              await createErrorMessage({
                messageId: errorMessageId,
                threadId: threadResult.threadId,
                content: `Stream error: ${errorMessage}`,
                errorType: "STREAM_ERROR",
                parentId: lastParentId,
                depth: lastDepth,
                userId,
                sequenceId: lastSequenceId,
                sequenceIndex: lastSequenceIndex,
                logger,
              });
            }

            // Emit ERROR message event for UI
            const errorMessageEvent = createStreamEvent.messageCreated({
              messageId: errorMessageId,
              threadId: threadResult.threadId,
              role: ChatMessageRole.ERROR,
              content: `Stream error: ${errorMessage}`,
              parentId: lastParentId,
              depth: lastDepth,
              sequenceId: lastSequenceId,
              sequenceIndex: lastSequenceIndex,
            });
            controller.enqueue(
              encoder.encode(formatSSEEvent(errorMessageEvent)),
            );

            // Also emit legacy error event for compatibility
            const errorEvent = createStreamEvent.error({
              code: "STREAM_ERROR",
              message: errorMessage,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
            controller.close();
          }
        },
      });

      logger.info("[AI Stream] ⏱️ Returning streaming response to client");
      return createStreamingResponse(
        new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to create AI stream", {
        error: errorMessage,
        model: data.model,
      });

      return {
        success: false,
        message:
          "app.api.v1.core.agent.chat.aiStream.route.errors.streamCreationFailed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: {
          error: errorMessage,
        },
      };
    }
  }
}

/**
 * Singleton instance
 */
export const aiStreamRepository = new AiStreamRepository();
