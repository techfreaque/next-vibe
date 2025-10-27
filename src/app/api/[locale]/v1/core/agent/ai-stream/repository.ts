/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { stepCountIs, streamText } from "ai";
import { and, eq } from "drizzle-orm";
import {
  createErrorResponse,
  createStreamingResponse,
  ErrorResponseTypes,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { creditRepository } from "@/app/api/[locale]/v1/core/credits/repository";
import { creditValidator } from "@/app/api/[locale]/v1/core/credits/validator";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { getToolExecutor } from "@/app/api/[locale]/v1/core/system/unified-ui/ai/executor";
import { createToolsFromEndpoints } from "@/app/api/[locale]/v1/core/system/unified-ui/ai/factory";
import { getToolRegistry } from "@/app/api/[locale]/v1/core/system/unified-ui/ai/registry";
import type { CoreTool } from "@/app/api/[locale]/v1/core/system/unified-ui/ai/types";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-ui/shared/config";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { DefaultFolderId } from "../chat/config";
import {
  chatMessages,
  chatThreads,
  type MessageMetadata,
  type ToolCall,
} from "../chat/db";
import { ChatMessageRole } from "../chat/enum";
import { getModelCost } from "../chat/model-access/costs";
import { getModelById, type ModelId } from "../chat/model-access/models";
import { CONTINUE_CONVERSATION_PROMPT } from "./constants";
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
export const maxDuration = 30;

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
 * Tool result type from DB
 */
type ToolResultValue =
  | string
  | number
  | boolean
  | null
  | Record<string, string | number | boolean | null>;

/**
 * Type guard for tool args/result record
 */
function isToolArgsRecord(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
): value is Record<string, string | number | boolean | null> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  // Validate all values in object are primitives
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(value).every(
    (v) =>
      v === null ||
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean",
  );
}

/**
 * Type guard for tool result values
 * Validates that value matches expected tool result types
 */
function isValidToolResult(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
): value is ToolResultValue {
  if (value === null || value === undefined) {
    return true;
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
  if (isToolArgsRecord(value)) {
    return true;
  }
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
    logger: EndpointLogger;
  }): Promise<void> {
    await db.insert(chatMessages).values({
      id: params.messageId,
      threadId: params.threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "",
      parentId: params.parentId,
      depth: params.depth,
      isAI: true,
      model: params.model,
      persona: params.persona ?? null,
    });

    params.logger.info("Created AI message placeholder", {
      messageId: params.messageId,
      threadId: params.threadId,
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
  private loadTools(params: {
    requestedTools: string[] | null | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    systemPrompt: string;
  }): {
    tools: Record<string, CoreTool> | undefined;
    systemPrompt: string;
  } {
    let tools: Record<string, CoreTool> | undefined = undefined;
    let enhancedSystemPrompt = params.systemPrompt;

    if (params.requestedTools === null) {
      return { tools, systemPrompt: enhancedSystemPrompt };
    }

    try {
      const registry = getToolRegistry();

      // Get endpoints filtered by user permissions at framework level
      // This ensures users only get tools they have permission to use
      const userContext = {
        id: params.user.isPublic ? undefined : params.user.id,
        isPublic: params.user.isPublic,
      };

      const allEndpoints = registry.getEndpoints(userContext, Platform.AI);
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
        const toolExecutor = getToolExecutor();
        const toolsMap = createToolsFromEndpoints(
          enabledEndpoints,
          toolExecutor,
          {
            user: {
              id: params.user.isPublic ? undefined : params.user.id,
              email: "",
              isPublic: params.user.isPublic,
            },
            locale: params.locale,
            logger: params.logger,
          },
        );

        tools = Object.fromEntries(toolsMap.entries());

        params.logger.info("Tools created", {
          count: toolsMap.size,
          toolNames: Array.from(toolsMap.keys()),
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
            ? [enhancedSystemPrompt, combinedInstructions].join("\n\n")
            : combinedInstructions;
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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.aiStream.route.errors.authenticationRequired",
        ErrorResponseTypes.AUTH_ERROR,
      );
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
        return createErrorResponse(
          "app.api.v1.core.agent.chat.aiStream.route.errors.creditValidationFailed",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      effectiveLeadId = leadByIpResult.data.leadId;
      validationResult = {
        success: true,
        data: leadByIpResult.data.validation,
      };
    } else {
      // No identifier - should not happen
      logger.error("No user, lead, or IP address provided");
      return createErrorResponse(
        "app.api.v1.core.agent.chat.aiStream.route.errors.noIdentifier",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }

    if (!validationResult.success) {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.aiStream.route.errors.creditValidationFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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

      return createErrorResponse(
        "app.api.v1.core.agent.chat.aiStream.route.errors.insufficientCredits",
        ErrorResponseTypes.FORBIDDEN,
        {
          cost: modelCost.toString(),
          balance: validationResult.data.balance.toString(),
        },
      );
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
            return createErrorResponse(
              "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
              ErrorResponseTypes.NOT_FOUND,
            );
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
            return createErrorResponse(
              "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
              ErrorResponseTypes.NOT_FOUND,
            );
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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
        ErrorResponseTypes.NOT_FOUND,
      );
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
    const aiMessageId = crypto.randomUUID();
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
        const toolsResult = this.loadTools({
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
      // Bind method to preserve 'this' context in async callback
      const deductCredits = this.deductCreditsAfterCompletion.bind(this);
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

            // Emit AI message-created event
            // For answer-as-ai and retry, parent is the message we're responding to
            // For regular operations, parent is the user message we just created
            const aiParentId =
              data.operation === "answer-as-ai" || data.operation === "retry"
                ? (effectiveParentMessageId ?? null)
                : userMessageId;
            const aiDepth =
              data.operation === "answer-as-ai" || data.operation === "retry"
                ? messageDepth
                : messageDepth + 1;

            logger.debug("[DEBUG] Emitting AI MESSAGE_CREATED event", {
              messageId: aiMessageId,
              threadId: threadResult.threadId,
              parentId: aiParentId,
              operation: data.operation,
            });
            const aiMessageEvent = createStreamEvent.messageCreated({
              messageId: aiMessageId,
              threadId: threadResult.threadId,
              role: ChatMessageRole.ASSISTANT,
              parentId: aiParentId,
              depth: aiDepth,
              content: "",
              model: data.model,
              persona: data.persona ?? undefined,
            });
            controller.enqueue(encoder.encode(formatSSEEvent(aiMessageEvent)));
            logger.debug("[DEBUG] AI MESSAGE_CREATED event emitted", {
              messageId: aiMessageId,
            });

            // Start streaming
            let fullContent = "";

            // Get the OpenRouter model ID (use openRouterModel if available, otherwise use model ID directly)
            const openRouterModelId =
              modelConfig?.openRouterModel || data.model;

            // Use Vercel AI SDK's built-in multi-step tool calling with stopWhen
            const streamResult = streamText({
              model: provider(openRouterModelId),
              messages,
              temperature: data.temperature,
              abortSignal: AbortSignal.timeout(maxDuration * 1000),
              ...(tools
                ? {
                    tools,
                    stopWhen: stepCountIs(5),
                    onStepFinish: ({
                      text,
                      toolCalls,
                      toolResults,
                      finishReason,
                      usage,
                    }): void => {
                      logger.debug("[AI Stream] Step finished", {
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

            // Get endpoint metadata for display info
            // Filter by user permissions to ensure we only show tools the user can access
            const registry = getToolRegistry();
            const userContext = {
              id: user.isPublic ? undefined : user.id,
              isPublic: user.isPublic,
            };
            const allEndpoints = registry.getEndpoints(
              userContext,
              Platform.AI,
            );
            const endpointMap = new Map(
              allEndpoints.map((endpoint) => [endpoint.toolName, endpoint]),
            );

            // Stream the response
            for await (const part of streamResult.fullStream) {
              if (part.type === "text-delta") {
                const textDelta = part.text;

                if (
                  textDelta !== undefined &&
                  textDelta !== null &&
                  textDelta !== ""
                ) {
                  fullContent += textDelta;

                  // Emit content-delta event
                  const deltaEvent = createStreamEvent.contentDelta({
                    messageId: aiMessageId,
                    delta: textDelta,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(deltaEvent)),
                  );
                }
              } else if (part.type === "tool-call") {
                // Get endpoint metadata for display info
                const endpoint = endpointMap.get(part.toolName);
                const definition = endpoint?.definition;

                // Try to get widget metadata from endpoint definition
                let widgetMetadata:
                  | {
                      endpointId: string;
                      responseFields: Array<{
                        name: string;
                        widgetType: string;
                        label?: string;
                        description?: string;
                        layout?: Record<string, string | number | boolean>;
                        validation?: Record<string, string | number | boolean>;
                        options?: Array<{ value: string; label: string }>;
                      }>;
                    }
                  | null
                  | undefined;

                // Widget metadata extraction removed - will be added back later
                widgetMetadata = undefined;

                // Collect tool call for database storage
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const rawArgs = "input" in part ? part.input : {};
                const validatedArgs = isToolArgsRecord(rawArgs) ? rawArgs : {};

                const toolCallData = {
                  toolName: part.toolName,
                  displayName: definition?.title || part.toolName,
                  icon: definition?.aiTool?.icon,
                  args: validatedArgs,
                  creditsUsed: definition?.credits ?? 0,
                  widgetMetadata,
                };
                collectedToolCalls.push(toolCallData);

                // Emit tool-call event to frontend
                const toolCallEvent = createStreamEvent.toolCall({
                  messageId: aiMessageId,
                  toolName: toolCallData.toolName,
                  args: toolCallData.args,
                });
                controller.enqueue(
                  encoder.encode(formatSSEEvent(toolCallEvent)),
                );
              } else if (part.type === "tool-result") {
                // Handle tool results - update the corresponding tool call with result and widget metadata
                const toolCallIndex = collectedToolCalls.findIndex(
                  (tc) => tc.toolName === part.toolName,
                );

                if (toolCallIndex !== -1) {
                  // AI SDK returns 'output' as unknown type
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  const output = "output" in part ? part.output : undefined;

                  // Validate and type the output using type guard
                  const validatedOutput = isValidToolResult(output)
                    ? output
                    : undefined;
                  collectedToolCalls[toolCallIndex].result = validatedOutput;

                  logger.debug("[AI Stream] Tool result received", {
                    toolName: part.toolName,
                    hasResult: !!validatedOutput,
                  });

                  // Emit tool-result event to frontend
                  const toolResultEvent = createStreamEvent.toolResult({
                    messageId: aiMessageId,
                    toolName: part.toolName,
                    result: validatedOutput,
                  });
                  controller.enqueue(
                    encoder.encode(formatSSEEvent(toolResultEvent)),
                  );
                }
              }
            }

            // Wait for completion
            const [finishReason, usage] = await Promise.all([
              streamResult.finishReason,
              streamResult.usage,
            ]);

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
                  content: fullContent,
                  tokens: usage.totalTokens,
                  metadata,
                  updatedAt: new Date(),
                })
                .where(eq(chatMessages.id, aiMessageId));

              logger.info("Updated AI message with final content", {
                messageId: aiMessageId,
                contentLength: fullContent.length,
                tokens: usage.totalTokens,
                toolCallsCount: collectedToolCalls.length,
                toolCallsWithWidgetMetadata: collectedToolCalls.filter(
                  (tc) => tc.widgetMetadata,
                ).length,
              });
            }

            // Emit content-done event
            const doneEvent = createStreamEvent.contentDone({
              messageId: aiMessageId,
              content: fullContent,
              totalTokens: usage.totalTokens ?? null,
              finishReason: finishReason || null,
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
