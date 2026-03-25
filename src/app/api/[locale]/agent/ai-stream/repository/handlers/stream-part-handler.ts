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
import { AbortReason, StreamAbortError } from "../core/constants";
import type { StreamContext } from "../core/stream-context";
import type { StreamingTTSHandler } from "../streaming-tts";
import { FilePartHandler } from "./file-part-handler";
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
    skill: string;
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
    /** Prompt text used for generated media metadata (image/audio models) */
    mediaPrompt: string;
    /** Credit cost for the current model (used for generatedMedia metadata) */
    mediaCreditCost: number;
  }): Promise<{ shouldAbort: boolean }> {
    const {
      part,
      ctx,
      threadId,
      model,
      skill,
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
      mediaPrompt,
      mediaCreditCost,
    } = params;

    if (part.type === "file") {
      await FilePartHandler.processFilePart({
        file: part.file,
        ctx,
        threadId,
        model,
        skill,
        userId,
        isIncognito,
        logger,
        prompt: mediaPrompt,
        creditCost: mediaCreditCost,
      });
      return { shouldAbort: false };
    }

    if (part.type === "finish-step") {
      const { shouldAbort } = await FinishStepHandler.processFinishStep({
        ctx,
        streamAbortController,
        streamContext,
        logger,
      });

      return { shouldAbort };
    }

    if (part.type === "text-delta") {
      // Once a tool in this step requires confirmation, discard any subsequent
      // text-deltas in the same step. The AI often emits follow-up text after
      // tool calls (e.g. "Waiting for your approval...") - we don't want this
      // persisted since the stream will stop at finish-step and the confirm flow
      // takes over. Do NOT abort the stream here - let the step finish naturally.
      if (ctx.stepHasToolsAwaitingConfirmation) {
        return { shouldAbort: false };
      }
      const textContent = part.text;
      const result = await TextHandler.processTextDelta({
        textDelta: textContent,
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        threadId,
        currentParentId: ctx.currentParentId,
        model,
        skill,
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
        skill,
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
            "[AI Stream] Duplicate toolCallId from model - skipping",
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
          skill,
          sequenceId: ctx.sequenceId,
          isIncognito,
          userId,
          toolsConfig,
          streamAbortController,
          dbWriter: ctx.dbWriter,
          logger,
          streamContext,
        });
        ctx.currentAssistantMessageId = result.currentAssistantMessageId;
        ctx.currentAssistantContent = result.currentAssistantContent;
        ctx.isInReasoningBlock = result.isInReasoningBlock;
        if (result.currentAssistantMessageId) {
          ctx.lastAssistantMessageId = result.currentAssistantMessageId;
        }

        ctx.currentParentId = result.pendingToolMessage.messageId;
        ctx.lastParentId = result.pendingToolMessage.messageId;

        // Expose the current tool message ID to streamContext.
        // tools-loader execute() wrapper reads from ctx.pendingToolMessages
        // keyed by toolCallId for parallel-safe per-tool lookup.
        streamContext.currentToolMessageId =
          result.pendingToolMessage.messageId;

        // If escalateToTask() fired BEFORE this TOOL message was created (the common
        // case for interactive tools like claude-code), backfill the correct TOOL message
        // ID onto the escalated task row now that we have it.
        if (streamContext.pendingEscalatedTaskId) {
          const escalatedId = streamContext.pendingEscalatedTaskId;
          streamContext.pendingEscalatedTaskId = undefined; // consume it
          const toolMsgId = result.pendingToolMessage.messageId;
          void (async (): Promise<void> => {
            try {
              const { db: dbInst } =
                await import("@/app/api/[locale]/system/db");
              const { cronTasks: cronTasksTable } =
                await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
              const { eq: drizzleEq } = await import("drizzle-orm");
              await dbInst
                .update(cronTasksTable)
                .set({ wakeUpToolMessageId: toolMsgId })
                .where(drizzleEq(cronTasksTable.id, escalatedId));
              logger.info(
                "[AI Stream] Backfilled wakeUpToolMessageId on escalated task",
                { escalatedId, toolMsgId },
              );
            } catch (err) {
              logger.warn(
                "[AI Stream] Failed to backfill wakeUpToolMessageId on escalated task",
                {
                  escalatedId,
                  toolMsgId,
                  error: err instanceof Error ? err.message : String(err),
                },
              );
            }
          })();
        }

        // Track the branch tip at the time of this tool call.
        // parentId is the assistant message that spawned the tool - this is the
        // correct leaf for deferred result insertion (wakeUp, approve, remote).
        // Updated on every tool-call so it reflects the latest branch tip if
        // multiple sequential tool calls happen in the same step.
        if (result.pendingToolMessage.toolCallData.parentId) {
          streamContext.leafMessageId =
            result.pendingToolMessage.toolCallData.parentId;
        }

        ctx.pendingToolMessages.set(part.toolCallId, result.pendingToolMessage);

        // APPROVE: mark that this stream has approve tools - abort deferred to finish-step.
        // stepHasToolsAwaitingConfirmation persists across steps so sequential tool calls
        // all complete before the stream aborts at the AI-response turn boundary.
        if (result.requiresConfirmation) {
          ctx.stepHasToolsAwaitingConfirmation = true;
          logger.info(
            "[AI Stream] Tool requires confirmation - will abort at finish-step after all tool steps complete",
            {
              toolName: part.toolName,
              messageId: result.pendingToolMessage.messageId,
            },
          );
        }
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
          skill,
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
        streamContext,
        threadId,
        model,
        skill,
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

        // Remote tool with callbackMode=wait: abort stream IMMEDIATELY.
        // Cannot defer to finish-step because the AI SDK continues generating
        // text in the same step after tool-result (no finish-step boundary).
        // /report backfills the real result and resume-stream wakes the thread.
        if (streamContext.waitingForRemoteResult) {
          streamContext.waitingForRemoteResult = false;
          logger.info(
            "[AI Stream] Remote tool wait mode - aborting stream immediately",
            {
              toolName: part.toolName,
              toolCallId: part.toolCallId,
            },
          );
          streamAbortController.abort(
            new StreamAbortError(AbortReason.REMOTE_TOOL_WAIT),
          );
          return { shouldAbort: true };
        }

        // endLoop: defer abort to finish-step (same as approve).
        // The step must fully complete (all parallel tool results received) before
        // aborting - otherwise the abort fires mid-step and kills sibling tools.
        // finish-step fires after all tool results in the step, before the AI SDK
        // makes the next API call, so deferring there is always safe.
        if (ctx.shouldStopLoop) {
          logger.info(
            "[AI Stream] endLoop tool result received - deferring abort to finish-step",
            {
              toolName: part.toolName,
              toolCallId: part.toolCallId,
              pendingTools: ctx.pendingToolMessages.size,
            },
          );
        }
      }

      return { shouldAbort: false };
    }

    return { shouldAbort: false };
  }
}
