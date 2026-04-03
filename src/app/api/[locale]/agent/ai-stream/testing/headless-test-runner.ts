/**
 * Headless Test Runner
 * Thin wrapper around runHeadlessAiStream for integration tests.
 * Provides sensible test defaults so individual tests stay concise.
 */

import "server-only";

import { eq } from "drizzle-orm";

import type { HeadlessAiStreamResult } from "@/app/api/[locale]/agent/ai-stream/repository/headless";
import { runHeadlessAiStream } from "@/app/api/[locale]/agent/ai-stream/repository/headless";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type {
  MessageMetadata,
  ToolCallResult,
} from "@/app/api/[locale]/agent/chat/db";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
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
  }));
}

export async function runTestStream(
  params: TestStreamParams,
): Promise<TestStreamResult> {
  const {
    prompt,
    user,
    threadId,
    threadMode = "new",
    skill = NO_SKILL_ID,
    explicitParentMessageId,
  } = params;

  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  const result = await runHeadlessAiStream({
    prompt,
    model: agentEnv.VIBE_TEST_AI_MODEL,
    skill,
    threadId,
    threadMode,
    // For test "append" turns, use "send" so the prompt is treated as a new
    // user message (not answer-as-ai which silences the user's text).
    operationOverride: threadMode === "append" ? "send" : undefined,
    rootFolderId: DefaultFolderId.CRON,
    user,
    locale: defaultLocale,
    logger,
    t,
    explicitParentMessageId,
  });

  let messages: SlimMessage[] = [];

  if (result.success && result.data.threadId) {
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
      .where(eq(chatMessages.threadId, result.data.threadId));

    messages = slimMessages(
      rows.map((r) => ({
        ...r,
        metadata: r.metadata ?? {},
      })),
    );
  }

  return { result, messages };
}
