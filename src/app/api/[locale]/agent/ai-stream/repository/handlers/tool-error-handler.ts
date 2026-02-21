/**
 * ToolErrorHandler - Handles tool error events during streaming
 *
 * When the AI model calls a tool not in the visible tools set (e.g. discovered
 * via tool-help), the AI SDK emits a tool-error. This handler catches that
 * case and either:
 * 1. Executes the tool via RouteExecutionExecutor (if it's in activeTools)
 * 2. Returns a "tool disabled by user" error to the model (if not in activeTools)
 * 3. Handles confirmation requirements (if tool requires confirmation)
 */

import type { JSONValue } from "ai";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/parsing";
import { definitionsRegistry } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definitions/registry";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getPreferredToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { type ToolCall, type ToolCallResult } from "../../../chat/db";
import type { MessageDbWriter } from "../core/message-db-writer";

export class ToolErrorHandler {
  /**
   * Process tool-error event from stream.
   *
   * Checks permissions (activeToolNames) and confirmation requirements (toolsConfig)
   * before executing the tool. Mirrors the behavior of a regular tool-call + tool-result
   * flow for tools discovered via tool-help.
   */
  static async processToolError(params: {
    part: {
      type: "tool-error";
      toolCallId: string;
      toolName: string;
      error?: JSONValue;
    };
    pendingToolMessage:
      | {
          messageId: string;
          toolCallData: {
            toolCall: ToolCall;
            parentId: string | null;
            depth: number;
          };
        }
      | undefined;
    threadId: string;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    /** Set of tool names the model is allowed to execute. null = all allowed. */
    activeToolNames: Set<string> | null;
    /** Confirmation config for tools (from visible tools + active tools). */
    toolsConfig: Map<string, { requiresConfirmation: boolean }>;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): Promise<{
    currentParentId: string | null;
    currentDepth: number;
  } | null> {
    const {
      part,
      pendingToolMessage,
      threadId,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      user,
      locale,
      activeToolNames,
      toolsConfig,
      dbWriter,
      logger,
    } = params;

    if (!pendingToolMessage) {
      return null;
    }

    const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

    // Step 1: Check if tool exists in the endpoint registry
    const allEndpoints = definitionsRegistry.getEndpointsForUser(
      Platform.AI,
      user,
    );
    const endpoint = allEndpoints.find(
      (e) => getPreferredToolName(e) === part.toolName,
    );

    if (!endpoint) {
      // Tool doesn't exist at all — emit the original error
      return this.emitOriginalError({
        part,
        toolMessageId,
        toolCallData,
        threadId,
        model,
        character,
        sequenceId,
        isIncognito,
        userId,
        user,
        dbWriter,
        logger,
      });
    }

    // Step 2: Check if tool is allowed (activeToolNames permission layer)
    // null = all tools allowed
    if (activeToolNames && !activeToolNames.has(part.toolName)) {
      logger.info(
        "[AI Stream] Tool not in activeTools — returning disabled error to model",
        {
          toolName: part.toolName,
          toolCallId: part.toolCallId,
          messageId: toolMessageId,
        },
      );

      // Return a clear error to the model so it knows not to retry
      const disabledError = fail({
        message:
          "app.api.agent.chat.aiStream.errors.toolDisabledByUser" as const,
        errorType: ErrorResponseTypes.FORBIDDEN,
      });

      const toolCallWithError: ToolCall = {
        ...toolCallData.toolCall,
        error: disabledError,
      };

      await dbWriter.emitToolResult({
        toolMessageId,
        threadId,
        parentId: toolCallData.parentId,
        depth: toolCallData.depth,
        userId,
        model,
        character,
        sequenceId,
        toolCall: toolCallWithError,
        toolName: part.toolName,
        result: undefined,
        error: disabledError,
        skipSseEmit: false,
        user,
      });

      return {
        currentParentId: toolMessageId,
        currentDepth: toolCallData.depth,
      };
    }

    // Step 3: Check confirmation requirements
    // Client config overrides definition, definition is fallback
    const toolConfig = toolsConfig.get(part.toolName);
    const requiresConfirmation =
      toolConfig?.requiresConfirmation ??
      endpoint.requiresConfirmation ??
      false;

    if (requiresConfirmation) {
      logger.info(
        "[AI Stream] Fallback tool requires confirmation — emitting TOOL_WAITING",
        {
          toolName: part.toolName,
          toolCallId: part.toolCallId,
          messageId: toolMessageId,
        },
      );

      // Update the tool call data with confirmation info
      const toolCallWithConfirmation: ToolCall = {
        ...toolCallData.toolCall,
        requiresConfirmation: true,
        waitingForConfirmation: true,
        isConfirmed: false,
      };

      // Re-emit the tool call with confirmation data and emit TOOL_WAITING
      await dbWriter.emitToolResult({
        toolMessageId,
        threadId,
        parentId: toolCallData.parentId,
        depth: toolCallData.depth,
        userId,
        model,
        character,
        sequenceId,
        toolCall: toolCallWithConfirmation,
        toolName: part.toolName,
        result: undefined,
        error: undefined,
        skipSseEmit: false,
        user,
      });

      dbWriter.emitToolWaiting({
        toolMessageId,
        toolName: part.toolName,
        toolCallId: part.toolCallId,
      });

      return {
        currentParentId: toolMessageId,
        currentDepth: toolCallData.depth,
      };
    }

    // Step 4: Execute the tool (same as regular tool execution)
    const fallbackResult = await this.executeTool({
      toolName: part.toolName,
      args: toolCallData.toolCall.args,
      user,
      locale,
      logger,
    });

    if (fallbackResult && "data" in fallbackResult) {
      logger.info(
        "[AI Stream] Tool fallback execution succeeded (discovered via tool-help)",
        {
          toolName: part.toolName,
          toolCallId: part.toolCallId,
          messageId: toolMessageId,
        },
      );

      const toolCallWithResult: ToolCall = {
        ...toolCallData.toolCall,
        result: fallbackResult.data as ToolCallResult,
        creditsUsed: endpoint.credits ?? 0,
      };

      await dbWriter.emitToolResult({
        toolMessageId,
        threadId,
        parentId: toolCallData.parentId,
        depth: toolCallData.depth,
        userId,
        model,
        character,
        sequenceId,
        toolCall: toolCallWithResult,
        toolName: part.toolName,
        result: fallbackResult.data as ToolCallResult,
        error: undefined,
        skipSseEmit: false,
        user,
      });

      logger.info("[AI Stream] TOOL_RESULT event sent (fallback)", {
        messageId: toolMessageId,
        toolName: part.toolName,
        isIncognito,
      });

      return {
        currentParentId: toolMessageId,
        currentDepth: toolCallData.depth,
      };
    }

    // Execution failed with a known error — emit it as a tool result so the model can retry
    if (fallbackResult && "error" in fallbackResult) {
      logger.warn("[AI Stream] Emitting tool error result to model", {
        toolName: part.toolName,
        error: fallbackResult.error,
      });

      const toolCallWithError: ToolCall = {
        ...toolCallData.toolCall,
        error: {
          message: fallbackResult.error,
          errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        } as ErrorResponseType,
      };

      await dbWriter.emitToolResult({
        toolMessageId,
        threadId,
        parentId: toolCallData.parentId,
        depth: toolCallData.depth,
        userId,
        model,
        character,
        sequenceId,
        toolCall: toolCallWithError,
        toolName: part.toolName,
        result: undefined,
        error: toolCallWithError.error,
        skipSseEmit: false,
        user,
      });

      return {
        currentParentId: toolMessageId,
        currentDepth: toolCallData.depth,
      };
    }

    // Unknown failure — emit original SDK error
    return this.emitOriginalError({
      part,
      toolMessageId,
      toolCallData,
      threadId,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      user,
      dbWriter,
      logger,
    });
  }

  /**
   * Execute a tool via RouteExecutionExecutor.
   * Returns { data } on success, { error } on failure so callers can forward errors to the model.
   */
  private static async executeTool(params: {
    toolName: string;
    args: ToolCallResult | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<{ data: JSONValue } | { error: string } | null> {
    const { toolName, args, user, locale, logger } = params;

    try {
      logger.info(
        "[AI Stream] Attempting fallback execution for discovered tool",
        { toolName },
      );

      const { RouteExecutionExecutor } =
        await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");

      const result = await RouteExecutionExecutor.executeGenericHandler({
        toolName,
        data: (args ?? {}) as CliRequestData,
        user,
        locale,
        logger,
        platform: Platform.AI,
      });

      if (!result.success) {
        logger.warn("[AI Stream] Fallback tool execution failed", {
          toolName,
          error: result.message,
          params: result.messageParams,
        });
        // Return the error so the model can see it and retry with correct params
        const errorMsg = result.messageParams?.error
          ? `${result.message}: ${result.messageParams.error}`
          : result.message;
        return { error: errorMsg };
      }

      return { data: result.data as JSONValue };
    } catch (error) {
      logger.warn("[AI Stream] Fallback tool execution threw", {
        toolName,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Emit the original error result when fallback is not possible.
   */
  private static async emitOriginalError(params: {
    part: {
      type: "tool-error";
      toolCallId: string;
      toolName: string;
      error?: JSONValue;
    };
    toolMessageId: string;
    toolCallData: {
      toolCall: ToolCall;
      parentId: string | null;
      depth: number;
    };
    threadId: string;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): Promise<{
    currentParentId: string | null;
    currentDepth: number;
  }> {
    const {
      part,
      toolMessageId,
      toolCallData,
      threadId,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      user,
      dbWriter,
      logger,
    } = params;

    const error: ErrorResponseType =
      "error" in part && part.error
        ? typeof part.error === "object" &&
          part.error !== null &&
          "message" in part.error &&
          typeof part.error.message === "string"
          ? // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
            (part.error as unknown as ErrorResponseType)
          : fail({
              message:
                "app.api.agent.chat.aiStream.errors.toolExecutionError" as const,
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            })
        : fail({
            message:
              "app.api.agent.chat.aiStream.errors.toolExecutionFailed" as const,
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });

    logger.info("[AI Stream] Tool error event received", {
      toolName: part.toolName,
      error,
      toolCallId: part.toolCallId,
      messageId: toolMessageId,
    });

    const toolCallWithError: ToolCall = {
      ...toolCallData.toolCall,
      error,
    };

    await dbWriter.emitToolResult({
      toolMessageId,
      threadId,
      parentId: toolCallData.parentId,
      depth: toolCallData.depth,
      userId,
      model,
      character,
      sequenceId,
      toolCall: toolCallWithError,
      toolName: part.toolName,
      result: undefined,
      error,
      skipSseEmit: false,
      user,
    });

    logger.info("[AI Stream] TOOL_RESULT event sent (error)", {
      messageId: toolMessageId,
      toolName: part.toolName,
      isIncognito,
    });

    return {
      currentParentId: toolMessageId,
      currentDepth: toolCallData.depth,
    };
  }
}
