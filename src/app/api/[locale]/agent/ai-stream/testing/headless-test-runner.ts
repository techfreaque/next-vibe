/**
 * Headless Test Runner
 * Thin wrapper around runHeadlessAiStream for integration tests.
 * Provides sensible test defaults so individual tests stay concise.
 */

import "server-only";

import { eq } from "drizzle-orm";

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
import type { ImageGenModelId } from "@/app/api/[locale]/agent/image-generation/models";
import type { MusicGenModelId } from "@/app/api/[locale]/agent/music-generation/models";
import type { VideoGenModelId } from "@/app/api/[locale]/agent/video-generation/models";
import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { agentEnv } from "@/app/api/[locale]/agent/env";
import { defaultLocale } from "@/i18n/core/config";
import { scopedTranslation } from "../stream/i18n";

export interface TestStreamParams {
  prompt: string;
  user: JwtPayloadType;
  threadId?: string;
  threadMode?: "none" | "new" | "append";
  skill?: string;
  /**
   * Explicit parent message ID for retry/branch tests.
   * When set, the user message is created as a child of this message
   * instead of the thread's most recent message.
   */
  explicitParentMessageId?: string;
  /** File attachments to include with the user message (images, audio, PDFs, video) */
  attachments?: File[];
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
    imageGenModelId?: ImageGenModelId;
    musicGenModelId?: MusicGenModelId;
    videoGenModelId?: VideoGenModelId;
  };
  /**
   * Tools available to the AI for execution (permission layer).
   * Useful for setting requiresConfirmation=true to test approve mode.
   */
  availableTools?: Array<{ toolId: string; requiresConfirmation: boolean }>;
}

/** Slim message shape — only fields we assert on */
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
    result?: ToolCallResult;
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
          result: r.metadata.toolCall.result,
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
    rows.map((r) => ({
      ...r,
      metadata: r.metadata ?? {},
    })),
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
    threadMode = "new",
    skill,
    explicitParentMessageId,
    attachments,
    model,
    favoriteId,
    preCalls,
    wakeUpRevival,
    mediaModelOverrides,
    availableTools,
  } = params;

  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  const result = await runHeadlessAiStream({
    prompt,
    // When favoriteId is provided, don't pass a default model — let the
    // favorite's resolved model win (including its apiProvider, e.g. UNBOTTLED).
    model: model ?? (favoriteId ? undefined : agentEnv.VIBE_TEST_AI_MODEL),
    favoriteId,
    // When favoriteId is provided, don't pass a default skill — let the
    // favorite's resolved skill win.
    skill: skill ?? (favoriteId ? undefined : NO_SKILL_ID),
    threadId,
    threadMode,
    // For test "append" turns, use "send" so the prompt is treated as a new
    // user message (not answer-as-ai which silences the user's text).
    // wakeUpRevival overrides this — it needs the wakeup-resume operation.
    operationOverride:
      threadMode === "append" && !wakeUpRevival ? "send" : undefined,
    rootFolderId: DefaultFolderId.CRON,
    user,
    locale: defaultLocale,
    logger,
    t,
    explicitParentMessageId,
    attachments,
    preCalls,
    wakeUpRevival,
    mediaModelOverrides,
    availableTools: availableTools ?? null,
  });

  let messages: SlimMessage[] = [];

  if (result.success && result.data.threadId) {
    messages = await fetchThreadMessages(result.data.threadId);
  }

  return { result, messages };
}
