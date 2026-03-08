/**
 * StreamPartHandler - Processes stream parts from AI SDK
 */

import "server-only";

import type { JSONValue, TextStreamPart, ToolSet } from "ai";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ToolExecutionContext } from "../../../chat/config";
import type { ModelId } from "../../../models/models";
import type { AiStreamT } from "../../stream/i18n";
import type { StreamContext } from "../core/stream-context";
import type { StreamingTTSHandler } from "../streaming-tts";
import { FinishStepHandler } from "./finish-step-handler";
import { ReasoningHandler } from "./reasoning-handler";
import { TextHandler } from "./text-handler";
import { ToolCallHandler } from "./tool-call-handler";
import { ToolErrorHandler } from "./tool-error-handler";
import { ToolResultHandler } from "./tool-result-handler";

export class StreamPartHandler {
  /**
   * Process a single stream part and update context
   */
  static async processPart<TOOLS extends ToolSet>(params: {
    part: TextStreamPart<TOOLS>;
    ctx: StreamContext;
    threadId: string;
    model: ModelId;
    character: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    locale: CountryLanguage;
    toolsConfig: Map<
      string,
      { requiresConfirmation: boolean; credits: number }
    >;
    /** Set of tool names the model is allowed to execute. null = all allowed. */
    activeToolNames: Set<string> | null;
    streamAbortController: AbortController;
    emittedToolResultIds: Set<string> | undefined;
    ttsHandler: StreamingTTSHandler | null;
    logger: EndpointLogger;
    t: AiStreamT;
    streamContext: ToolExecutionContext;
  }): Promise<{ shouldAbort: boolean }> {
    const {
      part,
      ctx,
      threadId,
      model,
      character,
      isIncognito,
      userId,
      user,
      locale,
      toolsConfig,
      activeToolNames,
      streamAbortController,
      emittedToolResultIds,
      ttsHandler,
      logger,
      t,
      streamContext,
    } = params;

    if (part.type === "finish-step") {
      const { shouldAbort } = await FinishStepHandler.processFinishStep({
        ctx,
        streamAbortController,
        logger,
      });

      return { shouldAbort };
    }

    if (part.type === "text-delta") {
      const textContent = part.text;
      const result = await TextHandler.processTextDelta({
        textDelta: textContent,
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        threadId,
        currentParentId: ctx.currentParentId,
        model,
        character,
        sequenceId: ctx.sequenceId,
        userId,
        getNextAssistantMessageId: ctx.getNextAssistantMessageId.bind(ctx),
        dbWriter: ctx.dbWriter,
        logger,
        ttsHandler,
      });
      ctx.currentAssistantMessageId = result.currentAssistantMessageId;
      ctx.currentAssistantContent = result.currentAssistantContent;
      if (result.currentAssistantMessageId) {
        ctx.lastAssistantMessageId = result.currentAssistantMessageId;
      }

      if (result.wasCreated) {
        ctx.currentParentId = result.currentAssistantMessageId;
        ctx.lastParentId = result.currentAssistantMessageId;
        // Record time-to-first-token on first message creation
        if (ctx.streamStartTime === null) {
          ctx.streamStartTime = Date.now();
        }
      }

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-start") {
      ctx.isInReasoningBlock = true;
      const result = await ReasoningHandler.processReasoningStart({
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        threadId,
        currentParentId: ctx.currentParentId,
        model,
        character,
        sequenceId: ctx.sequenceId,
        userId,
        getNextAssistantMessageId: ctx.getNextAssistantMessageId.bind(ctx),
        dbWriter: ctx.dbWriter,
        logger,
      });
      ctx.currentAssistantMessageId = result.currentAssistantMessageId;
      ctx.currentAssistantContent = result.currentAssistantContent;
      if (result.currentAssistantMessageId) {
        ctx.lastAssistantMessageId = result.currentAssistantMessageId;
      }

      if (result.wasCreated) {
        ctx.currentParentId = result.currentAssistantMessageId;
        ctx.lastParentId = result.currentAssistantMessageId;
      }

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-delta") {
      const reasoningText = part.text;
      ctx.currentAssistantContent = ReasoningHandler.processReasoningDelta({
        reasoningText,
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        dbWriter: ctx.dbWriter,
      });

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-end") {
      if (ctx.isInReasoningBlock) {
        ctx.currentAssistantContent = ReasoningHandler.processReasoningEnd({
          currentAssistantMessageId: ctx.currentAssistantMessageId,
          currentAssistantContent: ctx.currentAssistantContent,
          dbWriter: ctx.dbWriter,
        });
        ctx.isInReasoningBlock = false;
      }

      return { shouldAbort: false };
    }

    if (part.type === "tool-call") {
      if (
        "toolCallId" in part &&
        "toolName" in part &&
        typeof part.toolCallId === "string" &&
        typeof part.toolName === "string"
      ) {
        // Guard against duplicate toolCallIds from the model/provider.
        // Some providers reuse IDs across steps or retries. A second DB row
        // with the same toolCallId causes "tool_use ids must be unique" when
        // the history is later sent to the API (e.g. during compacting).
        if (ctx.allSeenToolCallIds.has(part.toolCallId)) {
          logger.warn(
            "[AI Stream] Duplicate toolCallId from model — skipping",
            {
              toolCallId: part.toolCallId,
              toolName: part.toolName,
            },
          );
          return { shouldAbort: false };
        }
        ctx.allSeenToolCallIds.add(part.toolCallId);

        const result = await ToolCallHandler.processToolCall({
          part: {
            type: "tool-call",
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            input: "input" in part ? (part.input as JSONValue) : undefined,
          },
          ctx,
          currentAssistantMessageId: ctx.currentAssistantMessageId,
          currentAssistantContent: ctx.currentAssistantContent,
          isInReasoningBlock: ctx.isInReasoningBlock,
          threadId,
          currentParentId: ctx.currentParentId,
          model,
          character,
          sequenceId: ctx.sequenceId,
          isIncognito,
          userId,
          toolsConfig,
          streamAbortController,
          dbWriter: ctx.dbWriter,
          logger,
        });
        ctx.currentAssistantMessageId = result.currentAssistantMessageId;
        ctx.currentAssistantContent = result.currentAssistantContent;
        ctx.isInReasoningBlock = result.isInReasoningBlock;
        if (result.currentAssistantMessageId) {
          ctx.lastAssistantMessageId = result.currentAssistantMessageId;
        }

        if (result.requiresConfirmation) {
          ctx.stepHasToolsAwaitingConfirmation = true;
          logger.info(
            "[AI Stream] Tool requires confirmation - will abort at finish-step",
            {
              toolName: part.toolName,
              messageId: result.pendingToolMessage.messageId,
            },
          );
        }

        ctx.currentParentId = result.pendingToolMessage.messageId;
        ctx.lastParentId = result.pendingToolMessage.messageId;

        // Expose the tool message ID to the tool's execute() via streamContext.
        // execute-tool/repository.ts polls this for up to 200ms at startup to
        // handle the race where execute() starts before stream-part-handler processes tool-call.
        streamContext.currentToolMessageId =
          result.pendingToolMessage.messageId;

        ctx.pendingToolMessages.set(part.toolCallId, result.pendingToolMessage);
      }

      return { shouldAbort: false };
    }

    if (part.type === "tool-error") {
      if (
        "toolCallId" in part &&
        "toolName" in part &&
        typeof part.toolCallId === "string" &&
        typeof part.toolName === "string"
      ) {
        const pending = ctx.pendingToolMessages.get(part.toolCallId);
        const result = await ToolErrorHandler.processToolError({
          part: {
            type: "tool-error",
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            error: "error" in part ? (part.error as JSONValue) : undefined,
          },
          pendingToolMessage: pending,
          threadId,
          model,
          character,
          sequenceId: ctx.sequenceId,
          isIncognito,
          userId,
          user,
          locale,
          activeToolNames,
          toolsConfig,
          dbWriter: ctx.dbWriter,
          logger,
          t,
          streamContext,
        });
        if (result) {
          ctx.currentParentId = result.currentParentId;
          ctx.lastParentId = result.currentParentId;
          ctx.pendingToolMessages.delete(part.toolCallId);
        }
      }

      return { shouldAbort: false };
    }

    if (
      part.type === "tool-result" &&
      "toolCallId" in part &&
      "toolName" in part &&
      typeof part.toolCallId === "string" &&
      typeof part.toolName === "string"
    ) {
      const pending = ctx.pendingToolMessages.get(part.toolCallId);
      const result = await ToolResultHandler.processToolResult({
        part: {
          type: "tool-result",
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          output: "output" in part ? (part.output as JSONValue) : undefined,
          isError: "isError" in part ? Boolean(part.isError) : false,
        },
        pendingToolMessage: pending,
        threadId,
        model,
        character,
        sequenceId: ctx.sequenceId,
        isIncognito,
        userId,
        user,
        dbWriter: ctx.dbWriter,
        logger,
        emittedToolResultIds,
        t,
      });
      if (result) {
        ctx.currentParentId = result.currentParentId;
        ctx.lastParentId = result.currentParentId;
        ctx.pendingToolMessages.delete(part.toolCallId);

        // Finalize and reset assistant message state so the next turn creates
        // a fresh message. This is critical for provider-executed tool loops
        // (e.g. Agent SDK) where the entire multi-turn conversation arrives
        // in a single stream without finish-step between turns.
        if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
          const { FinalizationHandler } =
            await import("./finalization-handler");
          await FinalizationHandler.finalizeAssistantMessage({
            currentAssistantMessageId: ctx.currentAssistantMessageId,
            currentAssistantContent: ctx.currentAssistantContent,
            isInReasoningBlock: ctx.isInReasoningBlock,
            finishReason: null,
            totalTokens: null,
            promptTokens: null,
            completionTokens: null,
            dbWriter: ctx.dbWriter,
            logger,
          });
        }
        ctx.currentAssistantMessageId = null;
        ctx.currentAssistantContent = "";
        ctx.isInReasoningBlock = false;

        // Remote tool with callbackMode=wait: pause stream after this step.
        // finish-step-handler will abort when stepHasToolsAwaitingConfirmation is set.
        // /report resumes the thread server-side when the result arrives.
        if (streamContext.waitingForRemoteResult) {
          ctx.stepHasToolsAwaitingConfirmation = true;
          streamContext.waitingForRemoteResult = false;
          logger.info(
            "[AI Stream] Remote tool wait mode — will pause stream at finish-step",
            { toolName: part.toolName, toolCallId: part.toolCallId },
          );
        }
      }

      return { shouldAbort: false };
    }

    return { shouldAbort: false };
  }
}
