/**
 * Headless AI Stream
 * Thin wrapper around AiStreamRepository.createAiStream with headless: true.
 * Runs the full AI pipeline (compacting, tool loops, DB persistence) without SSE.
 * Used by cron step executor for ai_agent steps.
 */

import "server-only";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { and, eq } from "drizzle-orm";

import { DefaultFolderId } from "../../chat/config";
import { NO_CHARACTER_ID } from "../../chat/characters/config";
import {
  isFiltersSelection,
  isManualSelection,
} from "../../chat/characters/create/definition";
import { CharactersRepositoryClient } from "../../chat/characters/repository-client";
import type { MessageMetadata, ToolCallResult } from "../../chat/db";
import { chatMessages } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import { chatFavorites } from "../../chat/favorites/db";
import type { ModelId } from "../../models/models";
import { ensureThread } from "../../chat/threads/repository";
import type { AiStreamPostRequestOutput } from "../definition";
import {
  AiStreamRepository,
  type HeadlessAiStreamResult as InternalHeadlessResult,
} from "./index";

/* eslint-disable i18next/no-literal-string */

/** A pre-fetched tool call result to inject into the thread before the AI runs */
export interface HeadlessPreCall {
  routeId: string;
  args: Record<string, ToolCallResult>;
  result: ToolCallResult;
  success: boolean;
  error?: string;
  executionTimeMs?: number;
}

export interface HeadlessAiStreamParams {
  /**
   * Favorite ID to load model + character from.
   * When provided, model and character are resolved from the saved favorite.
   * Explicit model/character fields override the favorite if also provided.
   */
  favoriteId?: string;
  /**
   * AI model to use. Required unless favoriteId is provided.
   * Overrides the model from the favorite when both are given.
   */
  model?: ModelId;
  /**
   * Character/persona for system prompt. Required unless favoriteId is provided.
   * Overrides the character from the favorite when both are given.
   */
  character?: string;
  /** User prompt — the main question/instruction */
  prompt: string;
  /**
   * Visible tools — what the model sees and can call.
   * null/undefined = agent mode (all tools visible).
   * [] = no tools visible.
   * Array of { toolId, requiresConfirmation } = specific tools visible.
   */
  availableTools?: Array<{
    toolId: string;
    requiresConfirmation: boolean;
  }> | null;
  /**
   * Active tools — permission layer controlling which tools the model may execute.
   * null/undefined = all tools permitted.
   * Array = restrict execution to listed toolIds.
   */
  activeTools?: Array<{ toolId: string; requiresConfirmation: boolean }> | null;
  /**
   * Extra text injected into the headless system prompt section.
   * Use this to prime the model with task-specific context:
   * e.g. "Running via cron job. Schedule: every day at 3am UTC. Task: summarise new leads."
   */
  headlessInstructions?: string;
  /** Max tool call rounds before stopping */
  maxTurns?: number;
  /** Thread mode: "none" = no persistence, "new" = new thread, "append" = continue thread */
  threadMode: "none" | "new" | "append";
  /** Thread ID to continue (for "append" mode) */
  threadId?: string;
  /** Subfolder for thread placement */
  subFolderId?: string;
  /** Override root folder (defaults to INCOGNITO for none, CRON for new/append) */
  rootFolderId?: DefaultFolderId;
  /**
   * Pre-fetched tool call results to inject as tool messages before the AI runs.
   * Written to the thread DB so they appear in UI exactly like regular tool calls.
   */
  preCalls?: HeadlessPreCall[];
  /** System user context for execution */
  user: JwtPayloadType;
  /** Locale for i18n */
  locale: CountryLanguage;
  /** Logger instance */
  logger: EndpointLogger;
}

export interface HeadlessAiStreamResult {
  /** ID of the last assistant message — read content from DB using this */
  lastAiMessageId: string;
  /** Thread ID — undefined when threadMode is "none" */
  threadId?: string;
}

/**
 * Run a full AI stream without SSE.
 * DB persistence, compacting, and tool loops work exactly like the regular stream.
 * Returns the lastAiMessageId — caller reads message content from DB.
 */
/**
 * Resolve model and character from a favorite ID.
 * Returns the model ID and character ID from the favorite's modelSelection.
 * Falls back to NO_CHARACTER_ID if the favorite has no character set.
 */
async function resolveFavorite(
  favoriteId: string,
  userId: string,
  logger: EndpointLogger,
): Promise<{ model: ModelId; character: string } | null> {
  const [favorite] = await db
    .select()
    .from(chatFavorites)
    .where(
      // drizzle eq is imported in this file already via db
      // Use raw sql-level check via drizzle
      require("drizzle-orm").and(
        require("drizzle-orm").eq(chatFavorites.id, favoriteId),
        require("drizzle-orm").eq(chatFavorites.userId, userId),
      ),
    )
    .limit(1);

  if (!favorite) {
    logger.error("[Headless AI] Favorite not found", { favoriteId, userId });
    return null;
  }

  const character = favorite.characterId || NO_CHARACTER_ID;

  // Resolve model from modelSelection
  const sel = favorite.modelSelection;
  if (sel && isManualSelection(sel)) {
    return { model: sel.modelId as ModelId, character };
  }
  if (sel && isFiltersSelection(sel)) {
    const best = CharactersRepositoryClient.getBestModelForCharacter(sel);
    if (best) {
      return { model: best.id as ModelId, character };
    }
  }

  // CHARACTER_BASED or no selection: we don't have the character's modelSelection here,
  // so caller will need to pass model explicitly or we fall back to a sensible default.
  logger.warn("[Headless AI] Favorite has no resolvable model — caller must provide model", {
    favoriteId,
    characterId: character,
  });
  return null;
}

export async function runHeadlessAiStream(
  params: HeadlessAiStreamParams,
): Promise<ResponseType<HeadlessAiStreamResult>> {
  const {
    favoriteId,
    model: modelOverride,
    character: characterOverride,
    prompt,
    availableTools,
    activeTools,
    headlessInstructions,
    threadMode,
    threadId: existingThreadId,
    subFolderId,
    rootFolderId: rootFolderIdOverride,
    preCalls,
    user,
    locale,
    logger,
  } = params;

  const { t } = simpleT(locale);

  try {
    // ── Resolve model + character ─────────────────────────────────────────────
    let model = modelOverride;
    let character = characterOverride;

    if (favoriteId) {
      const userId = "id" in user ? (user.id as string) : undefined;
      if (userId) {
        const resolved = await resolveFavorite(favoriteId, userId, logger);
        if (!resolved) {
          return fail({
            message: "Favorite not found or has no resolvable model",
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        // Explicit params override favorite values
        model = modelOverride ?? resolved.model;
        character = characterOverride ?? resolved.character;
      }
    }

    if (!model || !character) {
      return fail({
        message: "model and character are required (or provide a favoriteId with a resolved model)",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const rootFolderId =
      rootFolderIdOverride ??
      (threadMode === "none"
        ? DefaultFolderId.INCOGNITO
        : DefaultFolderId.CRON);
    const effectiveThreadId = existingThreadId ?? crypto.randomUUID();
    const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;

    // ── Pre-call injection ─────────────────────────────────────────────────
    // Write pre-call results as proper tool messages in the thread so the AI
    // sees them in context and they render correctly in the UI.
    // Only write to DB for persistent threads (not incognito).
    const userMessageId = crypto.randomUUID();
    let parentMessageIdForAi: string | null = null;

    if (preCalls && preCalls.length > 0 && !isIncognito) {
      // Ensure the thread exists first
      const userId = "id" in user ? (user.id as string) : undefined;
      await ensureThread({
        threadId: effectiveThreadId,
        rootFolderId,
        subFolderId: subFolderId ?? null,
        userId,
        leadId: undefined,
        content: prompt,
        isIncognito: false,
        logger,
        user,
      });

      // Write the user message first
      await db.insert(chatMessages).values({
        id: userMessageId,
        threadId: effectiveThreadId,
        role: ChatMessageRole.USER,
        content: prompt,
        parentId: null,
        depth: 0,
        authorId: userId ?? null,
        sequenceId: null,
        isAI: false,
        model,
        character,
        metadata: {},
      });

      // All pre-call messages share a sequenceId so they render as one grouped bubble
      const preCallSequenceId = crypto.randomUUID();

      // Write a synthetic assistant message that "called" the tools
      const syntheticAssistantId = crypto.randomUUID();
      await db.insert(chatMessages).values({
        id: syntheticAssistantId,
        threadId: effectiveThreadId,
        role: ChatMessageRole.ASSISTANT,
        content: null,
        parentId: userMessageId,
        depth: 1,
        authorId: userId ?? null,
        sequenceId: preCallSequenceId,
        isAI: true,
        model,
        character,
        metadata: {},
      });

      // Write each pre-call as a TOOL message
      let lastToolMessageId = syntheticAssistantId;
      for (const preCall of preCalls) {
        const toolMessageId = crypto.randomUUID();
        await db.insert(chatMessages).values({
          id: toolMessageId,
          threadId: effectiveThreadId,
          role: ChatMessageRole.TOOL,
          content: null,
          parentId: lastToolMessageId,
          depth: 2,
          authorId: userId ?? null,
          sequenceId: preCallSequenceId,
          isAI: true,
          model,
          character,
          metadata: {
            toolCall: {
              toolCallId: `precall_${toolMessageId}`,
              toolName: preCall.routeId,
              args: preCall.args,
              result: preCall.result,
              executionTime: preCall.executionTimeMs,
            },
          } as MessageMetadata,
        });
        lastToolMessageId = toolMessageId;
      }

      parentMessageIdForAi = lastToolMessageId;
    }

    const syntheticData: AiStreamPostRequestOutput = {
      operation: parentMessageIdForAi ? "answer-as-ai" : "send",
      rootFolderId,
      subFolderId: subFolderId ?? null,
      threadId: effectiveThreadId,
      userMessageId: parentMessageIdForAi ? null : userMessageId,
      parentMessageId: parentMessageIdForAi,
      content: parentMessageIdForAi ? "" : prompt,
      role: ChatMessageRole.USER,
      model,
      character,
      activeTools: activeTools ?? null,
      tools: availableTools ?? null,
      toolConfirmations: null,
      messageHistory: [] as AiStreamPostRequestOutput["messageHistory"],
      voiceMode: null,
      audioInput: { file: null },
      resumeToken: null,
      timezone: "UTC",
      attachments: null,
    };

    const result = await AiStreamRepository.createAiStream({
      data: syntheticData,
      locale,
      logger,
      user,
      request: undefined,
      t,
      headless: true,
      extraInstructions: headlessInstructions,
    });

    // headless: true never returns a StreamingResponse — guard for type narrowing only
    if ("__isStreamingResponse" in result) {
      return fail({
        message: "Unexpected streaming response in headless mode",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (!result.success) {
      return result;
    }

    // createAiStream with headless: true always returns InternalHeadlessResult data shape
    const { threadId, lastAiMessageId } = result.data as InternalHeadlessResult;

    logger.info("[Headless AI] Execution complete", {
      model,
      threadId,
      lastAiMessageId,
      threadMode,
    });

    return {
      success: true,
      data: {
        lastAiMessageId,
        threadId: threadMode !== "none" ? threadId : undefined,
      },
    };
  } catch (error) {
    const errorMsg = parseError(error).message;
    logger.error("[Headless AI] Execution failed", {
      model,
      error: errorMsg,
    });

    return fail({
      message: errorMsg,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: errorMsg },
    });
  }
}
