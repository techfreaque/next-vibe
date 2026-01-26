/**
 * StreamPartHandler - Processes stream parts from AI SDK
 */

import "server-only";

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { JSONValue, streamText, TextStreamPart, ToolSet } from "ai";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ModelId } from "../../../models/models";
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
    streamResult: {
      usage: ReturnType<typeof streamText>["usage"];
      finishReason: ReturnType<typeof streamText>["finishReason"];
    };
    threadId: string;
    model: ModelId;
    character: string;
    isIncognito: boolean;
    userId: string | undefined;
    toolsConfig: Map<string, { requiresConfirmation: boolean }>;
    streamAbortController: AbortController;
    emittedToolResultIds: Set<string> | undefined;
    ttsHandler: StreamingTTSHandler | null;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{ shouldAbort: boolean }> {
    const {
      part,
      ctx,
      streamResult,
      threadId,
      model,
      character,
      isIncognito,
      userId,
      toolsConfig,
      streamAbortController,
      emittedToolResultIds,
      ttsHandler,
      controller,
      encoder,
      logger,
    } = params;

    if (part.type === "finish-step") {
      const { shouldAbort } = await FinishStepHandler.processFinishStep({
        ctx,
        streamResult: {
          usage: streamResult.usage,
          finishReason: streamResult.finishReason,
        },
        isIncognito,
        streamAbortController,
        controller,
        encoder,
        logger,
      });

      return { shouldAbort };
    }

    if (part.type === "text-delta") {
      const result = await TextHandler.processTextDelta({
        textDelta: part.text,
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        threadId,
        currentParentId: ctx.currentParentId,
        currentDepth: ctx.currentDepth,
        model,
        character,
        sequenceId: ctx.sequenceId,
        isIncognito,
        userId,
        controller,
        encoder,
        logger,
        ttsHandler,
      });
      ctx.currentAssistantMessageId = result.currentAssistantMessageId;
      ctx.currentAssistantContent = result.currentAssistantContent;

      // If a new ASSISTANT message was created, update currentParentId/currentDepth
      // Note: TTS handler messageId is already set inside processTextDelta
      if (result.wasCreated) {
        ctx.currentParentId = result.currentAssistantMessageId;
        ctx.currentDepth = result.newDepth;
        ctx.lastParentId = result.currentAssistantMessageId;
        ctx.lastDepth = result.newDepth;
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
        currentDepth: ctx.currentDepth,
        model,
        character,
        sequenceId: ctx.sequenceId,
        isIncognito,
        userId,
        controller,
        encoder,
        logger,
      });
      ctx.currentAssistantMessageId = result.currentAssistantMessageId;
      ctx.currentAssistantContent = result.currentAssistantContent;

      // If a new ASSISTANT message was created, update currentParentId/currentDepth
      if (result.wasCreated) {
        ctx.currentParentId = result.currentAssistantMessageId;
        ctx.currentDepth = result.newDepth;
        ctx.lastParentId = result.currentAssistantMessageId;
        ctx.lastDepth = result.newDepth;
      }

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-delta") {
      const reasoningText = "text" in part ? part.text : "";
      ctx.currentAssistantContent = ReasoningHandler.processReasoningDelta({
        reasoningText,
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        controller,
        encoder,
        logger,
      });

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-end") {
      if (ctx.isInReasoningBlock) {
        ctx.currentAssistantContent = ReasoningHandler.processReasoningEnd({
          currentAssistantMessageId: ctx.currentAssistantMessageId,
          currentAssistantContent: ctx.currentAssistantContent,
          controller,
          encoder,
          logger,
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
          currentDepth: ctx.currentDepth,
          model,
          character,
          sequenceId: ctx.sequenceId,
          isIncognito,
          userId,
          toolsConfig,
          streamAbortController,
          controller,
          encoder,
          logger,
        });
        ctx.currentAssistantMessageId = result.currentAssistantMessageId;
        ctx.currentAssistantContent = result.currentAssistantContent;
        ctx.isInReasoningBlock = result.isInReasoningBlock;

        // Track if this tool requires confirmation
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

        // Update currentParentId/currentDepth to chain each tool call to the previous message
        // This creates: USER → ASSISTANT → TOOL1 → TOOL2 → ASSISTANT (next step)
        // The next tool call should be a child of THIS tool message
        ctx.currentParentId = result.pendingToolMessage.messageId;
        ctx.currentDepth = result.pendingToolMessage.toolCallData.depth;

        // Track the last tool message for the next step
        ctx.lastParentId = result.pendingToolMessage.messageId;
        ctx.lastDepth = result.pendingToolMessage.toolCallData.depth;

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
          controller,
          encoder,
          logger,
        });
        if (result) {
          ctx.currentParentId = result.currentParentId;
          ctx.currentDepth = result.currentDepth;
          ctx.lastParentId = result.currentParentId;
          ctx.lastDepth = result.currentDepth;
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
        controller,
        encoder,
        logger,
        emittedToolResultIds,
      });
      if (result) {
        // Update currentParentId/currentDepth for the next tool call
        // But DON'T update lastParentId/lastDepth here because tool results
        // can arrive in any order (async). lastParentId/lastDepth should only
        // be updated when tool CALLS arrive (which is the correct order).
        ctx.currentParentId = result.currentParentId;
        ctx.currentDepth = result.currentDepth;
        ctx.pendingToolMessages.delete(part.toolCallId);
      }

      return { shouldAbort: false };
    }

    return { shouldAbort: false };
  }
}
