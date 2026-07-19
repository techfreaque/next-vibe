/**
 * Confirmations phase — processes pending tool confirmations before the AI
 * stream starts. Extracted verbatim from setup.ts (behavior-preserving).
 */
import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { ResolvedRelayContext } from "next-vibe/realtime/remote-event-bridge/relay-context";

import { type ToolExecutionContext } from "../../../chat/config";
import { type ToolCall } from "../../../chat/db";
import { type AiStreamPostRequestOutput } from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import { ToolConfirmationProcessor } from "../handlers/tool-confirmation-handler";

/** Normalize DB tool config items - ensures requiresConfirmation is always boolean */
interface ConfirmationsPhaseResult {
  toolConfirmationResults: Array<{
    messageId: string;
    sequenceId: string;
    toolCall: ToolCall;
  }>;
  confirmationSetWaitingForRemote: boolean;
}

/**
 * Run the tool-confirmations phase. No-op (empty results) when the request has
 * no confirmations. Resolves to a fail() response on confirmation failure.
 */
export async function runConfirmationsPhase(params: {
  data: AiStreamPostRequestOutput;
  isIncognito: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  aiStreamT: AiStreamT;
  abortSignal: AbortSignal;
  favoriteIdOverride: string | undefined;
  headless: boolean | undefined;
  subAgentDepth: number;
  isRevival: boolean | undefined;
  /** Fixture chain of the stream — confirmed tool executions ride it. */
  toolExecutionContext: ToolExecutionContext;
  resolvedRelayContext?: ResolvedRelayContext;
}): Promise<ResponseType<ConfirmationsPhaseResult>> {
  const {
    data,
    isIncognito,
    locale,
    logger,
    user,
    aiStreamT,
    abortSignal,
    favoriteIdOverride,
    headless,
    subAgentDepth,
    isRevival,
    toolExecutionContext,
  } = params;

  if (!(data.toolConfirmations && data.toolConfirmations.length > 0)) {
    return {
      success: true,
      data: {
        toolConfirmationResults: [],
        confirmationSetWaitingForRemote: false,
      },
    };
  }

  const confirmationtoolExecutionContext: ToolExecutionContext = {
    rootFolderId: data.rootFolderId,
    threadId: data.threadId ?? undefined,
    timezone: toolExecutionContext.timezone,
    voiceEnabled: toolExecutionContext.voiceEnabled,
    aiMessageId: undefined,
    currentToolMessageId: undefined,
    callerToolCallId: undefined,
    callerCallbackMode: undefined,
    pendingToolMessages: undefined,
    duplicateToolCallKeys: undefined,
    executeClaimCount: undefined,
    pendingTimeoutMs: undefined,
    // Pass leafMessageId from request so deferred confirm inserts use the correct branch tip.
    leafMessageId: data.leafMessageId ?? undefined,
    skillId: data.skill,
    favoriteId: favoriteIdOverride,
    headless,
    subAgentDepth,
    isRevival,
    waitingForRemoteResult: undefined,
    onEscalatedTaskCancel: undefined,
    pendingEscalatedTaskId: undefined,
    cancelPendingStreamTimer: undefined,
    abortSignal,
    escalateToTask: undefined,
  };
  const confirmationResult = await ToolConfirmationProcessor.processAll({
    toolConfirmations: data.toolConfirmations,
    messageHistory: data.messageHistory ?? undefined,
    isIncognito,
    locale,
    logger,
    user,
    t: aiStreamT,
    toolExecutionContext: confirmationtoolExecutionContext,
    resolvedRelayContext: params.resolvedRelayContext,
  });

  if (!confirmationResult.success) {
    return confirmationResult;
  }

  // If execute-tool (queue WAIT) set waitingForRemoteResult during confirmation,
  // propagate to the main stream so it aborts without creating an AI response.
  // Without this, the main toolExecutionContext starts with waitingForRemoteResult=undefined
  // and the AI turn runs, creating a response before the revival fires — branch violation.
  return success({
    toolConfirmationResults: confirmationResult.data,
    confirmationSetWaitingForRemote:
      confirmationtoolExecutionContext.waitingForRemoteResult === true,
  });
}
/**
 * AI Stream setup — model + credit validation phase.
 *
 * Pure pre-stream guards extracted verbatim from setupAiStream: auth presence,
 * TTS/STT misroute, provider API-key presence, Agent-SDK admin gate, then credit
 * validation. Returns the validated model config + effective lead + model cost,
 * or a fail ResponseType the orchestrator returns as-is.
 */
