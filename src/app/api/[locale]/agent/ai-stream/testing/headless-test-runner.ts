/**
 * Headless Test Runner
 * Thin wrapper around runHeadlessAiStream for integration tests.
 * Provides sensible test defaults so individual tests stay concise.
 */

import "server-only";

import { eq } from "drizzle-orm";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type {
  HeadlessAiStreamResult,
  HeadlessPreCall,
} from "@/app/api/[locale]/agent/ai-stream/repository/headless";
import { runHeadlessAiStream } from "@/app/api/[locale]/agent/ai-stream/repository/headless";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type {
  MessageMetadata,
  ToolCallResult,
} from "@/app/api/[locale]/agent/chat/db";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";
import { scopedTranslation } from "../stream/i18n";

export interface TestStreamParams {
  prompt: string;
  user: JwtPayloadType;
  threadId?: string;
  skill?: string;
  /**
   * Explicit parent message ID for retry/branch tests.
   * When set, the user message is created as a child of this message
   * instead of the thread's most recent message.
   *
   * UI equivalent: pass message.parentId here and operation "retry"/"edit"
   * to exactly replicate what branchMessage/retryMessage hooks do.
   */
  explicitParentMessageId?: string;
  /**
   * Override the stream operation. Mirrors the UI's operation field.
   * - "retry": same as UI retryMessage (uses message.parentId as parent)
   * - "edit": same as UI branchMessage (uses message.parentId as parent)
   * - "send": default - new user message (uses last message or explicitParentMessageId)
   * When not provided, headless.ts auto-resolves based on threadId presence.
   */
  operationOverride?: "send" | "retry" | "edit";
  /** File attachments to include with the user message (images, audio, PDFs, video) */
  attachments?: File[];
  /**
   * Audio file for STT transcription (voice UI flow - NOT the attachment gap-fill path).
   * When provided, the audio is transcribed via SpeechToTextRepository before the AI runs.
   * The transcribed text becomes the user message content (no variants, no gap-fill).
   * Use this to test the dedicated STT path; use `attachments` for the audioVisionModel path.
   */
  audioInput?: File | null;
  /**
   * Override the default VIBE_TEST_AI_MODEL for this test.
   * Use when testing a specific model (e.g. native multimodal LLM for image output).
   */
  model?: ChatModelId;
  /**
   * Use a pre-created favorite to load model + skill.
   * Takes precedence over model/skill fields when provided.
   */
  favoriteId?: string;
  /**
   * Pre-fetched tool call results to inject before the AI runs.
   * Appears in the thread DB as tool messages the AI can reason about.
   */
  preCalls?: HeadlessPreCall[];
  /**
   * When true, use wakeup-resume operation (no CONTINUE prompt).
   * Used to simulate revival after a wakeUp-mode deferred tool completes.
   */
  wakeUpRevival?: boolean;
  /**
   * Override resolved media gen models for this test.
   * Bypasses the user-settings cascade so tests run a specific provider.
   */
  mediaModelOverrides?: {
    imageGenModelSelection?: ImageGenModelSelection;
    musicGenModelSelection?: MusicGenModelSelection;
    videoGenModelSelection?: VideoGenModelSelection;
  };
  /**
   * Tools available to the AI for execution (permission layer).
   * Useful for setting requiresConfirmation=true to test approve mode.
   */
  availableTools?: Array<{ toolId: string; requiresConfirmation: boolean }>;
  /**
   * Force all model resolution (chat + image/music/video gen) to a specific API provider.
   * Used by UNBOTTLED self-relay tests to route all inference through the UNBOTTLED provider.
   */
  providerOverride?: ApiProvider;
}

/** Slim message shape - only fields we assert on */
export interface SlimMessage {
  id: string;
  role: string;
  parentId: string | null;
  sequenceId: string | null;
  content: string | null;
  createdAt: Date;
  model: string | null;
  isAI: boolean;
  toolCall: {
    toolName?: string;
    args?: ToolCallResult;
    result?: ToolCallResult;
    isDeferred?: boolean;
    toolCallId?: string;
    originalToolCallId?: string;
  } | null;
  generatedMedia: { type: string; url?: string | null }[] | null;
  /** True when this is a compacting summary message */
  isCompacting: boolean;
  /** Attachment metadata from user messages */
  attachments: MessageMetadata["attachments"] | null;
  /** Gap-fill variants (text descriptions of media) */
  variants: MessageMetadata["variants"] | null;
  /** Token usage metadata (assistant messages only) */
  promptTokens: number | null;
  completionTokens: number | null;
  creditCost: number | null;
  finishReason: string | null;
}

export interface TestStreamResult {
  result: ResponseType<HeadlessAiStreamResult>;
  /** Messages from DB (only when result.success && threadId present) */
  messages: SlimMessage[];
  /**
   * Number of tool schemas loaded into the AI context window.
   * Mirrors result.data.pinnedToolCount - pulled out for convenient assertion.
   * 0 when stream failed.
   */
  pinnedToolCount: number;
}

/**
 * Narrow a ToolCallResult to a plain record for field access in tests.
 * Returns null if the result is not a non-array object.
 */
export function toolResultRecord(
  result: ToolCallResult | undefined,
): Record<string, ToolCallResult> | null {
  if (
    result !== null &&
    result !== undefined &&
    typeof result === "object" &&
    !Array.isArray(result)
  ) {
    return result as Record<string, ToolCallResult>;
  }
  return null;
}

function slimMessages(
  rows: {
    id: string;
    role: string;
    parentId: string | null;
    sequenceId: string | null;
    content: string | null;
    createdAt: Date;
    model: string | null;
    isAI: boolean;
    metadata: MessageMetadata;
  }[],
): SlimMessage[] {
  return rows.map((r) => ({
    id: r.id,
    role: r.role,
    parentId: r.parentId,
    sequenceId: r.sequenceId,
    content: r.content,
    createdAt: r.createdAt,
    model: r.model,
    isAI: r.isAI,
    toolCall: r.metadata?.toolCall
      ? {
          toolName: r.metadata.toolCall.toolName,
          args: r.metadata.toolCall.args,
          result: r.metadata.toolCall.result,
          isDeferred: r.metadata.toolCall.isDeferred === true,
          toolCallId: r.metadata.toolCall.toolCallId,
          originalToolCallId: r.metadata.toolCall.originalToolCallId,
        }
      : null,
    generatedMedia: r.metadata?.generatedMedia
      ? [
          {
            type: r.metadata.generatedMedia.type,
            url: r.metadata.generatedMedia.url,
          },
        ]
      : null,
    isCompacting: r.metadata?.isCompacting === true,
    attachments: r.metadata?.attachments ?? null,
    variants: r.metadata?.variants ?? null,
    promptTokens: r.metadata?.promptTokens ?? null,
    completionTokens: r.metadata?.completionTokens ?? null,
    creditCost: r.metadata?.creditCost ?? null,
    finishReason: r.metadata?.finishReason ?? null,
  }));
}

/** Fetch all messages for a thread from the DB as SlimMessage[] */
export async function fetchThreadMessages(
  threadId: string,
): Promise<SlimMessage[]> {
  const rows = await db
    .select({
      id: chatMessages.id,
      role: chatMessages.role,
      parentId: chatMessages.parentId,
      sequenceId: chatMessages.sequenceId,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
      model: chatMessages.model,
      isAI: chatMessages.isAI,
      metadata: chatMessages.metadata,
    })
    .from(chatMessages)
    .where(eq(chatMessages.threadId, threadId));

  return slimMessages(
    rows
      .map((r) => ({
        ...r,
        metadata: r.metadata ?? {},
      }))
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  );
}

/**
 * Poll until a thread's streamingState returns to 'idle'.
 * Use after runTestStream when the stream aborted into 'waiting' state
 * (queue WAIT mode: task in flight, revival pending).
 *
 * When the revival stream finishes, streamingState transitions idle|waiting → idle.
 * Re-fetches messages once idle so callers get the post-revival thread state.
 *
 * Throws if the thread does not become idle within maxWaitMs.
 */
export async function waitForThreadIdle(
  threadId: string,
  maxWaitMs = 90_000,
): Promise<SlimMessage[]> {
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const pollIntervalMs = 500;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const [row] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    if (row?.streamingState === "idle") {
      return fetchThreadMessages(threadId);
    }
    await new Promise((resolve) => {
      setTimeout(resolve, pollIntervalMs);
    });
  }
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `waitForThreadIdle: thread ${threadId} did not become idle within ${maxWaitMs}ms`,
  );
}

/** Fetch the thread title from DB */
export async function fetchThreadTitle(
  threadId: string,
): Promise<string | null> {
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const [row] = await db
    .select({ title: chatThreads.title })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId));
  return row?.title ?? null;
}

export async function runTestStream(
  params: TestStreamParams,
): Promise<TestStreamResult> {
  const {
    prompt,
    user,
    threadId,
    skill,
    explicitParentMessageId,
    attachments,
    audioInput,
    model,
    favoriteId,
    preCalls,
    wakeUpRevival,
    mediaModelOverrides,
    providerOverride,
    availableTools,
    operationOverride: callerOperationOverride,
  } = params;

  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  // Resolve effective operationOverride:
  // - wakeUpRevival takes precedence (needs wakeup-resume, handled in headless.ts)
  // - caller-provided override (retry/edit) is used as-is when wakeUpRevival is false
  // - fallback: "send" for append turns (threadId present), undefined for new threads
  const resolvedOperationOverride = wakeUpRevival
    ? undefined // headless.ts resolves to wakeup-resume automatically
    : callerOperationOverride
      ? callerOperationOverride
      : threadId
        ? "send"
        : undefined;

  const result = await runHeadlessAiStream({
    prompt,
    // Never inject a fallback model - headless.ts resolves from skill variant or favorite.
    // Explicit model param is only for tests that must target a specific model.
    model,
    favoriteId,
    skill: skill ?? (favoriteId ? undefined : NO_SKILL_ID),
    threadId,
    operationOverride: resolvedOperationOverride,
    rootFolderId: DefaultFolderId.CRON,
    user,
    locale: defaultLocale,
    logger,
    t,
    explicitParentMessageId,
    attachments,
    audioInput,
    preCalls,
    wakeUpRevival,
    mediaModelOverrides,
    providerOverride,
    availableTools: availableTools ?? null,
  });

  let messages: SlimMessage[] = [];

  if (result.success && result.data.threadId) {
    messages = await fetchThreadMessages(result.data.threadId);
  }

  return {
    result,
    messages,
    pinnedToolCount: result.success ? result.data.pinnedToolCount : 0,
  };
}
