/**
 * Headless AI Stream
 * Thin wrapper around AiStreamRepository.createAiStream with headless: true.
 * Runs the full AI pipeline (compacting, tool loops, DB persistence) without SSE.
 * Used by cron step executor for ai_agent steps.
 */

import "server-only";

import { and, desc, eq } from "drizzle-orm";

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

import { NO_SKILL_ID } from "../../chat/skills/constants";
import {
  isFiltersSelection,
  isManualSelection,
} from "../../chat/skills/create/definition";
import { SkillsRepositoryClient } from "../../chat/skills/repository-client";
import { DefaultFolderId } from "../../chat/config";
import type { MessageMetadata, ToolCallResult } from "../../chat/db";
import { chatMessages } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import { chatFavorites } from "../../chat/favorites/db";
import { ThreadsRepository } from "../../chat/threads/repository";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import type { AiStreamPostRequestOutput } from "../stream/definition";
import type { AiStreamT } from "../stream/i18n";
import { AiStreamRepository } from "./index";

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
   * Favorite ID to load model + skill from.
   * When provided, model and skill are resolved from the saved favorite.
   * Explicit model/skill fields override the favorite if also provided.
   */
  favoriteId?: string;
  /**
   * AI model to use. Required unless favoriteId is provided.
   * Overrides the model from the favorite when both are given.
   */
  model?: ModelId;
  /**
   * Skill/persona for system prompt. Required unless favoriteId is provided.
   * Overrides the skill from the favorite when both are given.
   */
  skill?: string;
  /** User prompt — the main question/instruction */
  prompt: string;
  /**
   * Pinned tools — tools loaded into the AI context window (visible to model).
   * null/undefined = agent mode (all tools visible).
   * [] = no tools visible.
   * Array of { toolId, requiresConfirmation } = specific tools pinned to context.
   */
  pinnedTools?: Array<{
    toolId: string;
    requiresConfirmation: boolean;
  }> | null;
  /**
   * Available tools — permission layer controlling which tools the model may execute.
   * null/undefined = all tools permitted.
   * Array = restrict execution to listed toolIds.
   */
  availableTools?: Array<{
    toolId: string;
    requiresConfirmation: boolean;
  }> | null;
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
  rootFolderId: DefaultFolderId;
  /**
   * Pre-fetched tool call results to inject as tool messages before the AI runs.
   * Written to the thread DB so they appear in UI exactly like regular tool calls.
   */
  preCalls?: HeadlessPreCall[];
  /**
   * When true, the AI will not see the user's stored memories in its context.
   * Use for public bots and isolated tasks that should not inherit personal context.
   */
  excludeMemories?: boolean;
  /**
   * When true, use the "wakeup-resume" operation instead of "answer-as-ai".
   * This loads DB history normally (walking parent chain from the last message)
   * but does NOT inject CONTINUE_CONVERSATION_PROMPT — the AI sees the deferred
   * tool result as the last context item and responds naturally.
   * Used exclusively by resume-stream for wakeUp revival.
   */
  wakeUpRevival?: boolean;
  /**
   * Explicit parent message ID for history loading.
   * When provided, skips the "find last message by createdAt" query and uses
   * this ID directly as the starting point for building message ancestry.
   * Critical for WAIT mode resume where the tool message with backfilled result
   * must be the ancestor chain root — not whatever message was created last.
   */
  explicitParentMessageId?: string;
  /**
   * Force a specific sequenceId for the revival AI message.
   * Used by resume-stream so the revival response shares the same sequence
   * as the synthetic assistant + deferred tool pair that precede it.
   */
  sequenceIdOverride?: string;
  /** System user context for execution */
  user: JwtPayloadType;
  /** Locale for i18n */
  locale: CountryLanguage;
  /** Logger instance */
  logger: EndpointLogger;
  /** Translation function for ai-stream module */
  t: AiStreamT;
}

export interface HeadlessAiStreamResult {
  /** ID of the last assistant message — read content from DB using this */
  lastAiMessageId: string;
  /** Thread ID — undefined when threadMode is "none" */
  threadId?: string;
  /** Final text content — populated in memory even for incognito (no DB read needed) */
  lastAiMessageContent: string | null;
}

/**
 * Run a full AI stream without SSE.
 * DB persistence, compacting, and tool loops work exactly like the regular stream.
 * Returns the lastAiMessageId — caller reads message content from DB.
 */
/**
 * Resolve model and skill from a favorite ID.
 * Returns the model ID and skill ID from the favorite's modelSelection.
 * Falls back to NO_SKILL_ID if the favorite has no skill set.
 */
export async function resolveFavorite(
  favoriteId: string,
  userId: string,
  user: JwtPayloadType,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<{ model: ModelId; skill: string } | null> {
  const [favorite] = await db
    .select()
    .from(chatFavorites)
    .where(
      and(eq(chatFavorites.id, favoriteId), eq(chatFavorites.userId, userId)),
    )
    .limit(1);

  if (!favorite) {
    logger.error("[Headless AI] Favorite not found", { favoriteId, userId });
    return null;
  }

  const skill = favorite.skillId || NO_SKILL_ID;

  // Resolve model from modelSelection
  const sel = favorite.modelSelection;
  if (sel && isManualSelection(sel) && "manualModelId" in sel) {
    return {
      model: sel.manualModelId as ModelId,
      skill,
    };
  }
  if (sel && isFiltersSelection(sel)) {
    const best = SkillsRepositoryClient.getBestModelForSkill(sel, user);
    if (best) {
      return { model: best.id as ModelId, skill };
    }
  }

  // CHARACTER_BASED or no selection: load the skill to get its modelSelection
  if (skill !== NO_SKILL_ID) {
    const { SkillsRepository } = await import("../../chat/skills/repository");
    const skillResult = await SkillsRepository.getSkillById(
      { id: skill },
      user,
      logger,
      locale,
    );
    if (skillResult.success) {
      const charSel = skillResult.data.modelSelection;
      if (
        charSel &&
        (isManualSelection(charSel) || isFiltersSelection(charSel))
      ) {
        const best = SkillsRepositoryClient.getBestModelForSkill(charSel, user);
        if (best) {
          return { model: best.id as ModelId, skill };
        }
      }
    }
  }

  logger.warn(
    "[Headless AI] Favorite has no resolvable model — pass model explicitly",
    {
      favoriteId,
      skillId: skill,
    },
  );
  return null;
}

export async function runHeadlessAiStream(
  params: HeadlessAiStreamParams,
): Promise<ResponseType<HeadlessAiStreamResult>> {
  const {
    favoriteId,
    model: modelOverride,
    skill: skillOverride,
    prompt,
    pinnedTools,
    availableTools,
    headlessInstructions,
    threadMode,
    threadId: existingThreadId,
    subFolderId,
    rootFolderId: rootFolderIdOverride,
    preCalls,
    excludeMemories,
    wakeUpRevival,
    explicitParentMessageId,
    sequenceIdOverride,
    user,
    locale,
    logger,
    t: aiStreamT,
  } = params;

  try {
    // ── Resolve model + skill ─────────────────────────────────────────────────
    let model = modelOverride;
    let skill = skillOverride;

    if (favoriteId) {
      const userId = "id" in user ? (user.id as string) : undefined;
      if (userId) {
        const resolved = await resolveFavorite(
          favoriteId,
          userId,
          user,
          logger,
          locale,
        );
        if (!resolved) {
          return fail({
            message: aiStreamT("headless.errors.favoriteNotFound"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        // Explicit params override favorite values
        model = modelOverride ?? resolved.model;
        skill = skillOverride ?? resolved.skill;
      }
    }

    // ── Resolve model from skill if only skill is provided ────────────
    if (!model && skill && skill !== NO_SKILL_ID) {
      const { SkillsRepository } = await import("../../chat/skills/repository");
      const skillResult = await SkillsRepository.getSkillById(
        { id: skill },
        user,
        logger,
        locale,
      );
      if (skillResult.success) {
        const charSel = skillResult.data.modelSelection;
        if (charSel) {
          if (isManualSelection(charSel) && "manualModelId" in charSel) {
            model = charSel.manualModelId;
          } else if (isFiltersSelection(charSel)) {
            const best = SkillsRepositoryClient.getBestModelForSkill(
              charSel,
              user,
            );
            if (best) {
              model = best.id;
            }
          }
        }
      }
    }

    if (!model || !skill) {
      return fail({
        message: aiStreamT("headless.errors.missingModelOrSkill"),
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
      const userId = user.isPublic ? undefined : user.id;
      await ThreadsRepository.ensureThread({
        threadId: effectiveThreadId,
        rootFolderId,
        subFolderId: subFolderId ?? null,
        userId,
        leadId: undefined,
        content: prompt,
        isIncognito: false,
        logger,
        user,
        locale,
      });

      // Write the user message first
      await db.insert(chatMessages).values({
        id: userMessageId,
        threadId: effectiveThreadId,
        role: ChatMessageRole.USER,
        content: prompt,
        parentId: null,
        authorId: userId ?? null,
        sequenceId: null,
        isAI: false,
        model: null,
        skill: null,
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
        authorId: userId ?? null,
        sequenceId: preCallSequenceId,
        isAI: true,
        model,
        skill: skill,
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
          authorId: userId ?? null,
          sequenceId: preCallSequenceId,
          isAI: true,
          model,
          skill: skill,
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

    // For "append" mode with no preCalls, determine the parent message for history.
    // explicitParentMessageId takes priority — critical for WAIT mode resume where
    // the tool message with its backfilled result must be the history root, not
    // whatever message was created most recently by timestamp.
    if (threadMode === "append" && !parentMessageIdForAi && existingThreadId) {
      if (explicitParentMessageId) {
        parentMessageIdForAi = explicitParentMessageId;
      } else {
        const [lastMsg] = await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.threadId, existingThreadId))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1);

        if (lastMsg) {
          parentMessageIdForAi = lastMsg.id;
        }
      }
    }

    // wakeUpRevival uses "wakeup-resume" — same as answer-as-ai but without
    // CONTINUE_CONVERSATION_PROMPT. The AI sees the deferred tool result as
    // the last message and responds naturally.
    const operation =
      wakeUpRevival && parentMessageIdForAi
        ? "wakeup-resume"
        : parentMessageIdForAi
          ? "answer-as-ai"
          : "send";

    logger.debug("[Headless] operation resolved", {
      operation,
      wakeUpRevival,
      parentMessageIdForAi,
      existingThreadId,
    });

    const syntheticData: AiStreamPostRequestOutput = {
      operation,
      rootFolderId,
      subFolderId: subFolderId ?? null,
      threadId: effectiveThreadId,
      userMessageId: parentMessageIdForAi ? null : userMessageId,
      parentMessageId: parentMessageIdForAi,
      content: prompt,
      role: ChatMessageRole.USER,
      model,
      skill: skill,
      availableTools: availableTools ?? null,
      pinnedTools: pinnedTools ?? null,
      toolConfirmations: null,
      messageHistory: [] as AiStreamPostRequestOutput["messageHistory"],
      voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE },
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
      t: aiStreamT,
      headless: true,
      extraInstructions: headlessInstructions,
      excludeMemories,
      favoriteIdOverride: favoriteId,
      sequenceIdOverride,
    });

    if (!result.success) {
      return result;
    }

    const { threadId, lastAiMessageId, lastAiMessageContent } = result.data;

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
        lastAiMessageContent,
        threadId: threadMode !== "none" ? threadId : undefined,
      },
    };
  } catch (error) {
    const errorMsg = parseError(error).message;
    logger.error("[Headless AI] Execution failed", {
      model: modelOverride,
      favoriteId,
      error: errorMsg,
    });

    return fail({
      message: aiStreamT("errors.unexpectedError", { error: errorMsg }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
