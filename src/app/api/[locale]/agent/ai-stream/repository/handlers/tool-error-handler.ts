/**
 * ToolErrorHandler - Handles tool error events during streaming
 *
 * When the AI model calls a tool not in the visible tools set (e.g. discovered
 * via tool-help), the AI SDK emits a tool-error. This handler catches that
 * case and either:
 * 1. Executes the tool via RouteExecutionExecutor (if it's in availableTools)
 * 2. Returns a "tool disabled by user" error to the model (if not in availableTools)
 * 3. Handles confirmation requirements (if tool requires confirmation)
 */

import type { JSONValue } from "ai";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import { collectServerDefaults } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { filterUserPermissionRoles } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { ToolExecutionContext } from "../../../chat/config";

import { type ToolCall } from "../../../chat/db";
import type { AiStreamT } from "../../stream/i18n";
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
          };
        }
      | undefined;
    threadId: string;
    model: ChatModelId;
    skill: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    /** Set of tool names the model is allowed to execute. null = all allowed. */
    activeToolNames: Set<string> | null;
    /** Confirmation config for tools (from visible tools + active tools). */
    toolsConfig: Map<
      string,
      { requiresConfirmation: boolean; credits: number }
    >;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    t: AiStreamT;
    streamContext: ToolExecutionContext;
  }): Promise<{
    currentParentId: string | null;
  } | null> {
    const {
      part,
      pendingToolMessage,
      threadId,
      model,
      skill,
      sequenceId,
      isIncognito,
      userId,
      user,
      locale,
      activeToolNames,
      toolsConfig,
      dbWriter,
      logger,
      t,
    } = params;

    if (!pendingToolMessage) {
      return null;
    }

    const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

    // Step 1: Check if tool is allowed (activeToolNames permission layer).
    // null = all tools allowed. If set and tool not in it, it's disabled for this user.
    if (activeToolNames !== null && !activeToolNames.has(part.toolName)) {
      // Could be unknown tool or just disabled - check if it exists at all
      const unknownEndpoint = await getEndpoint(part.toolName);
      if (!unknownEndpoint) {
        // Tool doesn't exist at all - emit the original error
        return this.emitOriginalError({
          part,
          toolMessageId,
          toolCallData,
          threadId,
          model,
          skill,
          sequenceId,
          isIncognito,
          userId,
          user,
          dbWriter,
          logger,
          t,
        });
      }

      logger.debug(
        "[AI Stream] Tool not in availableTools - returning disabled error to model",
        {
          toolName: part.toolName,
          toolCallId: part.toolCallId,
          messageId: toolMessageId,
        },
      );

      const disabledError = fail({
        message: t("errors.toolDisabledByUser"),
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
        userId,
        model,
        skill,
        sequenceId,
        toolCall: toolCallWithError,
        toolName: part.toolName,
        result: undefined,
        error: disabledError,
        skipSseEmit: false,
        user,
      });

      return { currentParentId: toolMessageId };
    }

    // Step 2: Check confirmation requirements.
    // toolsConfig already has the resolved value from setup.
    // For fallback tools (not in pinnedTools), lazy-load to get definition default.
    const toolConfig = toolsConfig.get(part.toolName);
    let requiresConfirmation = toolConfig?.requiresConfirmation;
    if (requiresConfirmation === undefined) {
      const endpoint = await getEndpoint(part.toolName);
      requiresConfirmation = endpoint?.requiresConfirmation ?? false;
    }

    if (requiresConfirmation) {
      logger.debug(
        "[AI Stream] Fallback tool requires confirmation - emitting TOOL_WAITING",
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
        userId,
        model,
        skill,
        sequenceId,
        toolCall: toolCallWithConfirmation,
        toolName: part.toolName,
        result: undefined,
        error: undefined,
        skipSseEmit: false,
        user,
      });

      dbWriter.emitToolWaiting();

      return {
        currentParentId: toolMessageId,
      };
    }

    // Step 4: Execute the tool (same as regular tool execution)
    const fallbackResult = await this.executeTool({
      toolName: part.toolName,
      args: toolCallData.toolCall.args,
      user,
      locale,
      logger,
      streamContext: params.streamContext,
    });

    if (fallbackResult && "data" in fallbackResult) {
      logger.debug(
        "[AI Stream] Tool fallback execution succeeded (discovered via tool-help)",
        {
          toolName: part.toolName,
          toolCallId: part.toolCallId,
          messageId: toolMessageId,
        },
      );

      const toolCallWithResult: ToolCall = {
        ...toolCallData.toolCall,
        result: fallbackResult.data,
        creditsUsed: toolsConfig.get(part.toolName)?.credits ?? 0,
      };

      await dbWriter.emitToolResult({
        toolMessageId,
        threadId,
        parentId: toolCallData.parentId,
        userId,
        model,
        skill,
        sequenceId,
        toolCall: toolCallWithResult,
        toolName: part.toolName,
        result: fallbackResult.data,
        error: undefined,
        skipSseEmit: false,
        user,
      });

      logger.debug("[AI Stream] TOOL_RESULT event sent (fallback)", {
        messageId: toolMessageId,
        toolName: part.toolName,
        isIncognito,
      });

      return {
        currentParentId: toolMessageId,
      };
    }

    // Execution failed with a known error - emit it as a tool result so the model can retry
    if (fallbackResult && "error" in fallbackResult) {
      logger.warn("[AI Stream] Emitting tool error result to model", {
        toolName: part.toolName,
        error: fallbackResult.error,
      });

      const toolCallWithError: ToolCall = {
        ...toolCallData.toolCall,
        error: fail({
          message: t("errors.toolExecutionError", {
            error: fallbackResult.error,
          }),
          errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        }),
      };

      await dbWriter.emitToolResult({
        toolMessageId,
        threadId,
        parentId: toolCallData.parentId,
        userId,
        model,
        skill,
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
      };
    }

    // Unknown failure - emit original SDK error
    return this.emitOriginalError({
      part,
      toolMessageId,
      toolCallData,
      threadId,
      model,
      skill,
      sequenceId,
      isIncognito,
      userId,
      user,
      dbWriter,
      logger,
      t,
    });
  }

  /**
   * Execute a tool via RouteExecutionExecutor.
   * Returns { data } on success, { error } on failure so callers can forward errors to the model.
   */
  private static async executeTool(params: {
    toolName: string;
    args: WidgetData | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    streamContext: ToolExecutionContext;
  }): Promise<{ data: WidgetData } | { error: string } | null> {
    const { toolName, args, user, locale, logger } = params;

    try {
      logger.debug(
        "[AI Stream] Attempting fallback execution for discovered tool",
        { toolName },
      );

      // Apply field-level serverDefault callbacks for hidden fields.
      const endpoint = await getEndpoint(toolName);
      const serverDefaultPatch: Record<string, JSONValue> = {};
      if (endpoint) {
        const permissionRoles = filterUserPermissionRoles(user.roles);
        const serverDefaults = collectServerDefaults(
          endpoint.fields,
          permissionRoles,
          Platform.AI,
        );
        for (const [key, resolver] of Object.entries(serverDefaults)) {
          const resolved = resolver({
            user,
            locale,
            platform: Platform.AI,
            streamContext: params.streamContext,
          });
          if (resolved !== undefined) {
            serverDefaultPatch[key] = resolved as JSONValue;
          }
        }
      }

      const patchedArgs = {
        ...((args as Record<string, JSONValue>) ?? {}),
        ...serverDefaultPatch,
      };

      const { RouteExecutionExecutor } =
        await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");

      const result =
        await RouteExecutionExecutor.executeGenericHandler<JSONValue>({
          toolName,
          data: (patchedArgs ?? {}) as Record<string, WidgetData>,
          user,
          locale,
          logger,
          platform: Platform.AI,
          streamContext: params.streamContext,
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

      return { data: result.data };
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
    };
    threadId: string;
    model: ChatModelId;
    skill: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<{
    currentParentId: string | null;
  }> {
    const {
      part,
      toolMessageId,
      toolCallData,
      threadId,
      model,
      skill,
      sequenceId,
      isIncognito,
      userId,
      user,
      dbWriter,
      logger,
      t,
    } = params;

    // Build a proper ErrorResponseType from the SDK error.
    // The SDK's part.error is JSONValue - it may be a string, object, or anything.
    // We never trust it to be ErrorResponseType; always wrap via fail().
    const sdkError = "error" in part ? part.error : undefined;
    const sdkErrorMessage =
      sdkError &&
      typeof sdkError === "object" &&
      sdkError !== null &&
      "message" in sdkError &&
      typeof sdkError.message === "string"
        ? sdkError.message
        : typeof sdkError === "string"
          ? sdkError
          : undefined;

    const error: ErrorResponseType = sdkErrorMessage
      ? fail({
          message: t("errors.toolExecutionError", { error: sdkErrorMessage }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        })
      : fail({
          message: t("errors.toolExecutionFailed"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });

    logger.debug("[AI Stream] Tool error event received", {
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
      userId,
      model,
      skill,
      sequenceId,
      toolCall: toolCallWithError,
      toolName: part.toolName,
      result: undefined,
      error,
      skipSseEmit: false,
      user,
    });

    logger.debug("[AI Stream] TOOL_RESULT event sent (error)", {
      messageId: toolMessageId,
      toolName: part.toolName,
      isIncognito,
    });

    return {
      currentParentId: toolMessageId,
    };
  }
}
