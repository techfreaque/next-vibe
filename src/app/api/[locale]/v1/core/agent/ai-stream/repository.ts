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
import type { CoreTool } from "@/app/api/[locale]/v1/core/system/unified-interface/ai/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { DefaultFolderId } from "../chat/config";
import {
  chatMessages,
  chatThreads,
  type MessageMetadata,
  type ToolCall,
  type ToolCallResult,
  type ToolCallWidgetMetadata,
} from "../chat/db";
import { ChatMessageRole } from "../chat/enum";
import { getModelCost } from "../chat/model-access/costs";
import { getModelById, type ModelId } from "../chat/model-access/models";
import {
  CONTINUE_CONVERSATION_PROMPT,
  TOOL_USAGE_GUIDELINES,
} from "./constants";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "./definition";
import { createStreamEvent, formatSSEEvent } from "./events";
import { isUncensoredAIModel } from "./providers/uncensored-ai";
import { handleUncensoredAI } from "./providers/uncensored-handler";

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
 
function isValidToolResult(value: any): value is ToolCallResult {
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
 * Convert lowercase role to ChatMessageRole enum
 */
function toChatMessageRole(
  role: "user" | "assistant" | "system",
):
  | typeof ChatMessageRole.USER
  | typeof ChatMessageRole.ASSISTANT
  | typeof ChatMessageRole.SYSTEM {
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
}: {
  threadId: string | null | undefined;
  rootFolderId: string;
  subFolderId: string | null | undefined;
  userId?: string;
  content: string;
  isIncognito: boolean;
  logger: EndpointLogger;
}): Promise<{ threadId: string; isNew: boolean }> {
  // If threadId provided, verify it exists (unless incognito)
  if (threadId) {
    if (!isIncognito && userId) {
      const [existing] = await db
        .select()
        .from(chatThreads)
        .where(
          and(eq(chatThreads.id, threadId), eq(chatThreads.userId, userId)),
        )
        .limit(1);

      if (!existing?.id) {
        logger.error("Thread not found", { threadId, userId });
        // Return error through Promise rejection - caller will handle
        return await Promise.reject(new Error("THREAD_NOT_FOUND"));
      }
    }
    return { threadId, isNew: false };
  }

  // Create new thread
  const newThreadId = crypto.randomUUID();
  const title = generateThreadTitle(content);

  // Only store in DB if not incognito
  if (!isIncognito && userId) {
    await db.insert(chatThreads).values({
      id: newThreadId,
      userId,
      title,
      rootFolderId: rootFolderId as DefaultFolderId,
      folderId: subFolderId ?? null,
    });

    logger.debug("Created new thread", { threadId: newThreadId, title });
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
  role: "user" | "assistant" | "system";
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

  // DB stores role as ChatMessageRole enum (uppercase), convert to lowercase
  const roleLowercase = message.role.toLowerCase();
  const validRole: "user" | "assistant" | "system" =
    roleLowercase === "user" ||
    roleLowercase === "assistant" ||
    roleLowercase === "system"
      ? roleLowercase
      : "user";

  return {
    id: message.id,
    threadId: message.threadId,
    role: validRole,
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
    role: "user" | "assistant" | "system";
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
    role: "user" | "assistant" | "system";
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
    role: "user" | "assistant" | "system";
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
    role: "user" | "assistant" | "system";
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
    role: "user" | "assistant" | "system";
    content: string;
    parentId: string | null;
    depth: number;
    userId: string;
    logger: EndpointLogger;
  }): Promise<void> {
    await db.insert(chatMessages).values({
      id: params.messageId,
      threadId: params.threadId,
      role: toChatMessageRole(params.role),
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
   * Build message context for AI
   */
  private async buildMessageContext(params: {
    operation: "send" | "retry" | "edit" | "answer-as-ai";
    threadId: string | null | undefined;
    parentMessageId: string | null | undefined;
    content: string;
    role: "user" | "assistant" | "system";
    userId: string | undefined;
    isIncognito: boolean;
    logger: EndpointLogger;
  }): Promise<
    Array<{ role: "user" | "assistant" | "system"; content: string }>
  > {
    if (params.operation === "answer-as-ai") {
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
          const messages = contextMessages.map((msg) => {
            const roleLowercase = msg.role.toLowerCase();
            const validRole: "user" | "assistant" | "system" =
              roleLowercase === "user" ||
              roleLowercase === "assistant" ||
              roleLowercase === "system"
                ? roleLowercase
                : "user";
            return { role: validRole, content: msg.content };
          });

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
      const history = await fetchMessageHistory(
        params.threadId,
        params.userId,
        params.logger,
      );
      return [...history, { role: params.role, content: params.content }];
    } else {
      return [{ role: params.role, content: params.content }];
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

    if (params.requestedTools === null) {
      return { tools, systemPrompt: enhancedSystemPrompt };
    }


    try {
      const {getToolRegistry} = await import(
        "@/app/api/[locale]/v1/core/system/unified-interface/ai/registry",
      );
      const registry = getToolRegistry();

      // Get endpoints filtered by user permissions at framework level
      // This ensures users only get tools they have permission to use
      const allEndpoints = registry.getEndpoints(params.user, Platform.AI);
      const enabledEndpoints =
        params.requestedTools && params.requestedTools.length > 0
          ? allEndpoints.filter((endpoint) =>
              params.requestedTools!.includes(endpoint.toolName),
            )
          : allEndpoints;

      params.logger.debug("Loading tools", {
        requestedCount: params.requestedTools?.length ?? "all",
        enabledCount: enabledEndpoints.length,
        enabledNames: enabledEndpoints.map((endpoint) => endpoint.toolName),
      });

      if (enabledEndpoints.length > 0) {
        const { getToolExecutor } = await import(
          "@/app/api/[locale]/v1/core/system/unified-interface/ai/executor",
        );
        const { createToolsFromEndpoints } = await import(
          "@/app/api/[locale]/v1/core/system/unified-interface/ai/factory",
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

        // Add tool instructions to system prompt
        const toolInstructions = enabledEndpoints
          .map((endpoint) => endpoint.definition.aiTool?.instructions)
          .filter(
            (instructions): instructions is string =>
              typeof instructions === "string" && instructions.length > 0,
          );

        if (toolInstructions.length > 0) {
          const combinedInstructions = toolInstructions.join("\n\n");

          enhancedSystemPrompt = enhancedSystemPrompt
            ? [
                enhancedSystemPrompt,
                combinedInstructions,
                TOOL_USAGE_GUIDELINES,
              ].join("\n\n")
            : [combinedInstructions, TOOL_USAGE_GUIDELINES].join("\n\n");
        }
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
      role: "user" | "assistant" | "system";
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
          // For incognito, use data as-is
          operationResult = this.handleSendOperation(data);
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
      });
    } catch (error) {
      logger.error("Failed to ensure thread", {
        error: parseError(error).message,
      });
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

    // Step 8: Create AI message placeholder
    let aiMessageId = crypto.randomUUID();
    const parentForAiMessage =
      data.operation === "answer-as-ai" || data.operation === "retry"
        ? effectiveParentMessageId
        : userMessageId;
    const aiMessageDepth =
      data.operation === "answer-as-ai" || data.operation === "retry"
        ? messageDepth
        : messageDepth + 1;

    if (!isIncognito && userId) {
      await this.createAiMessagePlaceholder({
        messageId: aiMessageId,
        threadId: threadResult.threadId,
        parentId: parentForAiMessage ?? null,
        depth: aiMessageDepth,
        userId,
        model: data.model,
        persona: data.persona,
        sequenceId: aiMessageId, // First message in sequence uses its own ID
        sequenceIndex: 0, // First message in sequence
        logger,
      });
    } else {
      logger.debug("Generated incognito AI message ID", {
        messageId: aiMessageId,
        operation: data.operation,
      });
    }

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
      const createAiMessagePlaceholder =
        this.createAiMessagePlaceholder.bind(this);
      const stream = new ReadableStream({
        async start(controller): Promise<void> {
          try {
            // Emit thread-created event if new thread
            if (threadResult.isNew) {
              logger.debug("[DEBUG] Emitting THREAD_CREATED event", {
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
              logger.debug("[DEBUG] THREAD_CREATED event emitted", {
                threadId: threadResult.threadId,
              });
            } else {
              logger.debug(
                "[DEBUG] Thread already exists, not emitting THREAD_CREATED",
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
              logger.debug("[DEBUG] Emitting USER MESSAGE_CREATED event", {
                messageId: userMessageId,
                threadId: threadResult.threadId,
                parentId: effectiveParentMessageId || null,
              });
              const userMessageEvent = createStreamEvent.messageCreated({
                messageId: userMessageId,
                threadId: threadResult.threadId,
                role: toChatMessageRole(effectiveRole),
                parentId: effectiveParentMessageId || null,
                depth: messageDepth,
                content: effectiveContent,
              });
              const userMessageEventString = formatSSEEvent(userMessageEvent);
              logger.debug("[DEBUG] USER MESSAGE_CREATED event formatted", {
                messageId: userMessageId,
                eventString: userMessageEventString.substring(0, 200),
              });
              controller.enqueue(encoder.encode(userMessageEventString));
              logger.debug("[DEBUG] USER MESSAGE_CREATED event emitted", {
                messageId: userMessageId,
              });
            } else {
              logger.debug(
                "[DEBUG] Skipping USER MESSAGE_CREATED event for answer-as-ai operation",
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
            let fullContent = "";
            let fullReasoningContent = "";
            let hasReasoning = false; // Track if we have reasoning to chain messages properly
            let aiMessageCreated = false; // Track if we've emitted the AI message-created event

            // Track message sequencing - all messages in this response share the same sequenceId
            const sequenceId = aiMessageId; // First message ID becomes the sequence ID
            let sequenceIndex = 0; // Current position in sequence

            // Track the current parent for chaining messages
            // This gets updated as we create reasoning messages and tool calls
            let currentParentId = initialAiParentId;
            let currentDepth = initialAiDepth;

            // Get the OpenRouter model ID (use openRouterModel if available, otherwise use model ID directly)
            const openRouterModelId =
              modelConfig?.openRouterModel || data.model;

            // Use Vercel AI SDK's built-in multi-step tool calling
            // stopWhen: allows up to 5 steps (tool call + text generation cycles)
            // The model will continue until it generates text without tool calls or reaches the step limit
            const streamResult = streamText({
              model: provider(openRouterModelId),
              messages,
              temperature: data.temperature,
              abortSignal: AbortSignal.timeout(maxDuration * 1000),
              system: systemPrompt || undefined,
              ...(tools
                ? {
                    tools,
                    stopWhen: stepCountIs(5), // Allow up to 5 steps for multi-step tool calling
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
                      });
                    },
                  }
                : {}),
            });

            // Collect tool calls during streaming
            const collectedToolCalls: ToolCall[] = [];
            // Map tool names to their message IDs for result updates
            const toolMessageIds = new Map<string, string>();

            // Track the last assistant message ID for tool message parents
            let lastAssistantMessageId = aiMessageId;
            // Track if we need to create a new assistant message after tool calls
            let needsNewAssistantMessage = false;

            // Get endpoint metadata for display info
            // Filter by user permissions to ensure we only show tools the user can access
            const { getToolRegistry } = await import(
              "@/app/api/[locale]/v1/core/system/unified-interface/ai/registry"
            );
            const registry = getToolRegistry();
            const allEndpoints = registry.getEndpoints(user, Platform.AI);
            const endpointMap = new Map(
              allEndpoints.map((endpoint) => [endpoint.toolName, endpoint]),
            );

            // Stream the response
            logger.info("[AI Stream] Starting to process fullStream");

            // Create initial ASSISTANT message immediately so it shows before any tool calls
            logger.debug("[DEBUG] Creating initial ASSISTANT message", {
              messageId: aiMessageId,
              threadId: threadResult.threadId,
              parentId: currentParentId,
              depth: currentDepth,
              sequenceIndex,
            });

            const initialMessageEvent = createStreamEvent.messageCreated({
              messageId: aiMessageId,
              threadId: threadResult.threadId,
              role: ChatMessageRole.ASSISTANT,
              content: "",
              parentId: currentParentId,
              depth: currentDepth,
              model: data.model,
              persona: data.persona ?? undefined,
              sequenceId,
              sequenceIndex,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(initialMessageEvent)));
            aiMessageCreated = true;

            // Save to database if not incognito
            if (!isIncognito && userId) {
              await createAiMessagePlaceholder({
                messageId: aiMessageId,
                threadId: threadResult.threadId,
                parentId: currentParentId,
                depth: currentDepth,
                userId,
                model: data.model,
                persona: data.persona ?? undefined,
                sequenceId,
                sequenceIndex,
                logger,
              });
              lastAssistantMessageId = aiMessageId;
            }

            for await (const part of streamResult.fullStream) {
              if (part.type === "text-delta") {
                const textDelta = part.text;

                if (
                  textDelta !== undefined &&
                  textDelta !== null &&
                  textDelta !== ""
                ) {
                  // If we need a new assistant message after tool calls, create it
                  // BUT only if we already have content in the previous message
                  // If the previous message was empty (created before tool call), reuse it
                  if (needsNewAssistantMessage && fullContent.length > 0) {
                    // Save the previous message content to database
                    if (aiMessageCreated) {
                      if (!isIncognito && userId) {
                        await db
                          .update(chatMessages)
                          .set({
                            content: fullContent,
                            updatedAt: new Date(),
                          })
                          .where(eq(chatMessages.id, lastAssistantMessageId));

                        logger.info(
                          "Saved assistant message part before tool call",
                          {
                            messageId: lastAssistantMessageId,
                            contentLength: fullContent.length,
                          },
                        );
                      }

                      // Emit content-done for this message part
                      const partDoneEvent = createStreamEvent.contentDone({
                        messageId: lastAssistantMessageId,
                        content: fullContent,
                        totalTokens: null,
                        finishReason: null,
                      });
                      controller.enqueue(
                        encoder.encode(formatSSEEvent(partDoneEvent)),
                      );
                    }

                    // Create new assistant message part
                    aiMessageId = crypto.randomUUID();
                    sequenceIndex++;
                    fullContent = ""; // Reset content for new message

                    logger.debug(
                      "[DEBUG] Creating new assistant message after tool call",
                      {
                        newMessageId: aiMessageId,
                        sequenceIndex,
                        parentId: currentParentId,
                      },
                    );

                    // Emit MESSAGE_CREATED for the new assistant message
                    const newMessageEvent = createStreamEvent.messageCreated({
                      messageId: aiMessageId,
                      threadId: threadResult.threadId,
                      role: ChatMessageRole.ASSISTANT,
                      content: "",
                      parentId: currentParentId,
                      depth: currentDepth,
                      model: data.model,
                      persona: data.persona ?? undefined,
                      sequenceId,
                      sequenceIndex,
                    });
                    controller.enqueue(
                      encoder.encode(formatSSEEvent(newMessageEvent)),
                    );

                    // Save to database if not incognito
                    if (!isIncognito && userId) {
                      await createAiMessagePlaceholder({
                        messageId: aiMessageId,
                        threadId: threadResult.threadId,
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

                    aiMessageCreated = true;
                    lastAssistantMessageId = aiMessageId;
                  }

                  // Reset the flag - either we created a new message or we're reusing the empty one
                  needsNewAssistantMessage = false;

                  // Accumulate the content
                  fullContent += textDelta;

                  logger.debug("[AI Stream] Text delta", {
                    deltaLength: textDelta.length,
                    totalContentLength: fullContent.length,
                  });

                  // Emit content-delta event
                  const deltaEvent = createStreamEvent.contentDelta({
                    messageId: aiMessageId,
                    delta: textDelta,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(deltaEvent)),
                  );
                }
              } else if (part.type === "reasoning-start") {
                // Reasoning starts - just track it, don't create separate message
                fullReasoningContent = "";
                hasReasoning = true;

                logger.debug("[AI Stream] Reasoning started");
              } else if (part.type === "reasoning-delta") {
                // Handle reasoning deltas - accumulate for later wrapping in <think> tags
                const reasoningText = "text" in part ? part.text : "";

                if (
                  reasoningText !== undefined &&
                  reasoningText !== null &&
                  reasoningText !== ""
                ) {
                  fullReasoningContent += reasoningText;

                  logger.debug("[AI Stream] Reasoning delta", {
                    deltaLength: reasoningText.length,
                    totalReasoningLength: fullReasoningContent.length,
                  });
                }
              } else if (part.type === "reasoning-end") {
                // Reasoning ended - will be added to message content wrapped in <think> tags
                logger.debug("[AI Stream] Reasoning ended", {
                  totalLength: fullReasoningContent.length,
                });
              } else if (part.type === "tool-call") {
                // Get endpoint metadata for display info
                const endpoint = endpointMap.get(part.toolName);

                // Try to get widget metadata from endpoint definition
                let widgetMetadata: ToolCallWidgetMetadata | undefined;

                // Extract widget metadata from endpoint definition
                if (endpoint) {
                  try {
                    const { ResponseMetadataExtractor } = await import(
                      "@/app/api/[locale]/v1/core/system/unified-interface/cli/widgets/response-metadata-extractor"
                    );
                    const extractor = new ResponseMetadataExtractor();
                    const metadata =
                      extractor.extractResponseMetadata(endpoint);

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
                    } else {
                      widgetMetadata = undefined;
                    }
                  } catch (error) {
                    logger.error("Failed to extract widget metadata", {
                      error: String(error),
                    });
                    widgetMetadata = undefined;
                  }
                } else {
                  widgetMetadata = undefined;
                }

                // Collect tool call for database storage
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
                collectedToolCalls.push(toolCallData);

                logger.info("[AI Stream] Tool call received", {
                  toolName: part.toolName,
                  argsStringified: JSON.stringify(validatedArgs),
                  toolCallsCount: collectedToolCalls.length,
                });

                // If the current ASSISTANT message has content, finalize it before creating tool message
                // This handles the case where AI generates text BEFORE calling a tool
                if (aiMessageCreated && fullContent.length > 0) {
                  // Save the assistant message content to database
                  if (!isIncognito && userId) {
                    await db
                      .update(chatMessages)
                      .set({
                        content: fullContent,
                        updatedAt: new Date(),
                      })
                      .where(eq(chatMessages.id, aiMessageId));

                    logger.info("Saved assistant message before tool call", {
                      messageId: aiMessageId,
                      contentLength: fullContent.length,
                    });
                  }

                  // Emit CONTENT_DONE for this assistant message
                  const contentDoneEvent = createStreamEvent.contentDone({
                    messageId: aiMessageId,
                    content: fullContent,
                    totalTokens: null,
                    finishReason: null,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(contentDoneEvent)),
                  );

                  logger.debug("[DEBUG] Finalized assistant message before tool call", {
                    messageId: aiMessageId,
                    contentLength: fullContent.length,
                  });
                }

                // Update parent for tool message to be a child of the current assistant message
                currentParentId = aiMessageId;
                currentDepth = currentDepth + 1;

                // Create a separate TOOL message for this tool call
                const toolMessageId = crypto.randomUUID();
                sequenceIndex++; // Increment for tool message

                // Store the tool message ID for later result updates
                toolMessageIds.set(part.toolName, toolMessageId);

                // Save tool message to database (if not incognito)
                if (!isIncognito && userId) {
                  const toolMetadata: MessageMetadata = {
                    toolCalls: [toolCallData],
                  };

                  await db.insert(chatMessages).values({
                    id: toolMessageId,
                    threadId: threadResult.threadId,
                    role: "tool",
                    content: "",
                    parentId: currentParentId,
                    depth: currentDepth,
                    isAI: true,
                    sequenceId,
                    sequenceIndex,
                    metadata: toolMetadata,
                  } as typeof chatMessages.$inferInsert);

                  logger.info("Created tool message in database", {
                    messageId: toolMessageId,
                    toolName: toolCallData.toolName,
                    sequenceIndex,
                  });
                }

                // Emit MESSAGE_CREATED event for tool message
                const toolMessageCreatedEvent =
                  createStreamEvent.messageCreated({
                    messageId: toolMessageId,
                    threadId: threadResult.threadId,
                    role: ChatMessageRole.TOOL,
                    content: "",
                    parentId: currentParentId,
                    depth: currentDepth,
                    model: undefined,
                    persona: undefined,
                    sequenceId,
                    sequenceIndex,
                    // DO NOT include toolCalls here - they are sent via TOOL_CALL and TOOL_RESULT events
                  });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(toolMessageCreatedEvent)),
                );

                // Emit tool-call event to frontend with the tool message ID
                const toolCallEvent = createStreamEvent.toolCall({
                  messageId: toolMessageId,
                  toolName: toolCallData.toolName,
                  args: toolCallData.args,
                });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(toolCallEvent)),
                );

                // Update current parent to this tool message for next message
                currentParentId = toolMessageId;
                currentDepth = currentDepth + 1;

                // Flag that we need a new assistant message after this tool call
                needsNewAssistantMessage = true;
              } else if (part.type === "tool-result") {
                // Handle tool results - update the corresponding tool call with result and widget metadata
                const toolCallIndex = collectedToolCalls.findIndex(
                  (tc) => tc.toolName === part.toolName,
                );

                if (toolCallIndex !== -1) {
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
                          ?
                            (output.error as string)
                          :
                            JSON.stringify(output.error);
                    }
                  }

                  // Clean output by removing undefined values (they break validation)
                  const cleanedOutput = output
                    ? JSON.parse(JSON.stringify(output))
                    : undefined;

                  // Validate and type the output using type guard
                  const validatedOutput: ToolCallResult | undefined =
                    isValidToolResult(cleanedOutput) ? cleanedOutput : undefined;

                  collectedToolCalls[toolCallIndex].result = validatedOutput;
                  collectedToolCalls[toolCallIndex].error = toolError;

                  logger.info("[AI Stream] Tool result validated", {
                    toolName: part.toolName,
                    hasResult: !!validatedOutput,
                    hasError: !!toolError,
                    resultType: typeof validatedOutput,
                    isValid: isValidToolResult(cleanedOutput),
                    wasCleaned: output !== cleanedOutput,
                  });

                  // Get the tool message ID for this tool
                  const toolMessageId = toolMessageIds.get(part.toolName);

                  // Update tool message in database with result (if not incognito)
                  if (toolMessageId && !isIncognito && userId) {
                    await db
                      .update(chatMessages)
                      .set({
                        metadata: {
                          toolCalls: [collectedToolCalls[toolCallIndex]],
                        },
                        updatedAt: new Date(),
                      })
                      .where(eq(chatMessages.id, toolMessageId));

                    logger.info("Updated tool message with result", {
                      messageId: toolMessageId,
                      toolName: part.toolName,
                      hasResult: !!validatedOutput,
                      hasError: !!toolError,
                    });
                  }

                  // Emit tool-result event to frontend with the correct tool message ID
                  const toolResultEvent = createStreamEvent.toolResult({
                    messageId: toolMessageId || aiMessageId, // Fallback to aiMessageId if not found
                    toolName: part.toolName,
                    result: validatedOutput,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(toolResultEvent)),
                  );
                }
              }
            }

            logger.info("[AI Stream] Finished processing fullStream", {
              totalContentLength: fullContent.length,
              toolCallsCount: collectedToolCalls.length,
            });

            // Wait for completion
            const [finishReason, usage, steps] = await Promise.all([
              streamResult.finishReason,
              streamResult.usage,
              streamResult.steps,
            ]);

            logger.info("[AI Stream] Stream completed", {
              finishReason,
              totalTokens: usage.totalTokens,
              stepsCount: steps.length,
              hasReasoning,
              reasoningLength: fullReasoningContent.length,
              stepsDetails: steps.map((step, index) => ({
                stepNumber: index + 1,
                hasText: !!step.text,
                textLength: step.text?.length || 0,
                toolCallsCount: step.toolCalls.length,
                toolResultsCount: step.toolResults.length,
                finishReason: step.finishReason,
              })),
            });

            // Don't inject <think> tags - the model does that on its own
            // Just use the content as-is
            const finalContent = fullContent;

            // Update AI message with final content (if not incognito)
            if (!isIncognito && userId) {
              const metadata: MessageMetadata = {
                totalTokens: usage.totalTokens,
                finishReason: (finishReason ?? "unknown") as string,
                ...(collectedToolCalls.length > 0
                  ? {
                      toolCalls: collectedToolCalls,
                    }
                  : {}),
              };

              await db
                .update(chatMessages)
                .set({
                  content: finalContent,
                  tokens: usage.totalTokens,
                  metadata,
                  updatedAt: new Date(),
                })
                .where(eq(chatMessages.id, aiMessageId));

              logger.info("Updated AI message with final content", {
                messageId: aiMessageId,
                contentLength: finalContent.length,
                tokens: usage.totalTokens,
                toolCallsCount: collectedToolCalls.length,
                toolCallsWithWidgetMetadata: collectedToolCalls.filter(
                  (tc) => tc.widgetMetadata,
                ).length,
              });
            }

            // Emit content-done event with tool calls
            logger.info("[AI Stream] Sending contentDone event", {
              messageId: aiMessageId,
              toolCallsCount: collectedToolCalls.length,
              hasResults: collectedToolCalls.some((tc) => tc.result !== undefined),
              toolCalls: collectedToolCalls.map((tc) => ({
                toolName: tc.toolName,
                hasResult: !!tc.result,
                hasError: !!tc.error,
              })),
            });

            const doneEvent = createStreamEvent.contentDone({
              messageId: aiMessageId,
              content: finalContent,
              totalTokens: usage.totalTokens ?? null,
              finishReason: finishReason || null,
              toolCalls:
                collectedToolCalls.length > 0 ? collectedToolCalls : undefined,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(doneEvent)));

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

            // Emit error event
            const errorEvent = createStreamEvent.error({
              code: "STREAM_ERROR",
              message: errorMessage,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
            controller.close();
          }
        },
      });

      return createStreamingResponse(
        new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
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
