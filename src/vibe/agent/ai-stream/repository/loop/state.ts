/**
 * Shared state contract for the StreamLoop modules.
 *
 * StreamLoop's per-part / per-step logic lives in sibling modules that share
 * mutable instance state. StreamLoopState describes exactly the members those
 * extracted functions need; StreamLoop implements it (structurally) and passes
 * `this` as the first argument, so all state mutations land on the live loop
 * instance.
 */

import "server-only";

import type { ModelMessage, streamText as aiStreamText } from "ai";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { CoreTool } from "next-vibe/platforms/ai/tools-loader";

import type { ChatModelId, ChatModelOption } from "../../models";
import type { AiStreamT } from "../../stream/i18n";
import type { SystemPromptParams } from "../../system-prompt/builder";
import type { ProviderFactory } from "../core/infra";
import type { ToolExecutionContextImpl } from "../core/stream";
import type { StreamingTTSHandler } from "../core/streaming-tts";

/** Everything a StreamLoop needs, assembled by setup + the orchestrator. */
export interface StreamLoopParams {
  provider: ReturnType<typeof ProviderFactory.getProviderForModel>;
  modelConfig: ChatModelOption;
  messages: ModelMessage[];
  streamAbortController: AbortController;
  systemPrompt: string;
  trailingSystemMessage?: string;
  tools: Record<string, CoreTool> | undefined;
  toolsConfig: Map<
    string,
    { requiresConfirmation?: boolean; credits: number; label: string }
  >;
  /** Set of tool names the model is allowed to execute. null = all allowed. */
  activeToolNames: Set<string> | null;
  ctx: ToolExecutionContextImpl;
  threadId: string;
  model: ChatModelId;
  skill: string;
  isIncognito: boolean;
  userId: string | undefined;
  emittedToolResultIds: Set<string> | undefined;
  ttsHandler: StreamingTTSHandler | null;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: AiStreamT;
  toolExecutionContext: ToolExecutionContext;
  /** Cap on tool-call rounds for this stream (ai-run maxTurns). Defaults to MAX_TOOL_CALLS. */
  maxToolCalls?: number;
  imageSize?: string;
  imageQuality?: string;
  musicDuration?: string;
  /** Params to rebuild the system prompt per-step for fresh cortex context */
  systemPromptParams?: SystemPromptParams;
  /**
   * Real-token threshold (from API) above which mid-stream compacting fires in
   * prepareStep. Only set when tools are present (tool-loop sessions).
   * Computed as Math.min(effectiveCompactTrigger, floor(contextWindow *
   * COMPACT_TRIGGER_PERCENTAGE)) — the same logic as pre-stream compacting,
   * applied to real API-reported input token counts.
   */
  midStreamCompactingThreshold: number;
  /** Params forwarded to MidStreamCompactingHandler when mid-stream compacting triggers. */
  midStreamCompactingParams: {
    model: ChatModelId;
    skill: string;
    threadId: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    providerModel: Parameters<typeof aiStreamText>[0]["model"];
    t: AiStreamT;
  };
}

/** Return type from assistant message preparation */
export interface AssistantPrepResult {
  currentAssistantMessageId: string | null;
  currentAssistantContent: string;
  isInReasoningBlock: boolean;
  currentParentId: string | null;
}

/**
 * The slice of StreamLoop that the extracted part/step/finalize modules
 * operate on. StreamLoop implements this interface; extracted functions take
 * it as their first argument.
 */
export interface StreamLoopState {
  readonly p: StreamLoopParams;

  advanceTip(
    messageId: string | null,
    opts: { clearPendingQueueParent: boolean },
  ): void;

  ensureAssistantMessage(
    initialParentId: string | null,
  ): Promise<AssistantPrepResult>;

  finalizeAssistant(params: {
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    finishReason: string | null | undefined;
    totalTokens: number | null | undefined;
    promptTokens: number | null | undefined;
    completionTokens: number | null | undefined;
  }): Promise<void>;
}
