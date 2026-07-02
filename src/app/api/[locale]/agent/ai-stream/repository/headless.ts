/**
 * Headless AI Stream
 * Thin adapter around AiStreamRepository.createAiStream({ headless: true }).
 * Resolves model/skill/favorite, builds the synthetic request data and shapes
 * the HeadlessAiStreamResult. All real work — preCall injection, operation
 * derivation, parent resolution, the agent loop — lives in createAiStream and
 * its setup layer: headless rides the exact same code path as interactive,
 * differing only by props, and returns the last assistant message when done.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getInstanceAvailability } from "@/app/api/[locale]/agent/env-availability";
import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";

import { DefaultFolderId } from "../../chat/config";
import { ChatMessageRole } from "../../chat/enum";
import type { ImageGenModelSelection } from "../../image-generation/models";
import type { MusicGenModelSelection } from "../../music-generation/models";
import type { FavoriteConfig } from "../../skills/favorites/db";
import { resolveFavorite } from "../../skills/resolver";
import type { VideoGenModelSelection } from "../../video-generation/models";
import type { ChatModelId } from "../models";
import { getBestChatModel } from "../models";
import type { AiStreamPostRequestOutput } from "../stream/definition";
import type { AiStreamT } from "../stream/i18n";
import { AiStreamRepository } from "./index";

/** A pre-fetched tool call result to inject into the thread before the AI runs */
export interface HeadlessPreCall {
  routeId: string;
  args: Record<string, WidgetData>;
  result: WidgetData;
  success: boolean;
  error?: string;
  executionTimeMs?: number;
}

export interface HeadlessAiStreamParams {
  /**
   * Favorite ID to load model + skill from. When provided, model and skill
   * are resolved from the saved favorite; explicit model/skill fields
   * override the favorite if also provided.
   */
  favoriteId?: string;
  /** AI model to use. Required unless favoriteId is provided. */
  model?: ChatModelId;
  /** Skill/persona for system prompt. Required unless favoriteId is provided. */
  skill?: string;
  /** User prompt - the main question/instruction */
  prompt: string;
  /** Full favorite config for model/tool/context resolution. null = use skill/system defaults. */
  favoriteConfig: FavoriteConfig | null;
  /**
   * Extra text injected into the headless system prompt section, e.g.
   * "Running via cron job. Schedule: every day at 3am UTC. Task: ...".
   */
  headlessInstructions?: string;
  /** Max tool-call rounds before the agent loop stops (caps stepCountIs). */
  maxTurns?: number;
  /** Thread ID to continue (for "append" mode) */
  threadId?: string;
  /** Subfolder for thread placement */
  subFolderId?: string;
  /** Override root folder (defaults to INCOGNITO for none, CRON for new/append) */
  rootFolderId: DefaultFolderId;
  /**
   * Pre-fetched tool call results to inject as tool messages before the AI
   * runs. Written to the thread DB so they appear in UI like regular tool calls.
   */
  preCalls?: HeadlessPreCall[];
  /** When true, the AI will not see the user's stored memories in its context. */
  excludeMemories?: boolean;
  /**
   * When true, run as a revival with the "wakeup-resume" operation instead of
   * "answer-as-ai": DB history loads normally but CONTINUE_CONVERSATION_PROMPT
   * is NOT injected - the AI sees the deferred tool result as the last context
   * item and responds naturally. Used exclusively by resume-stream.
   */
  wakeUpRevival?: boolean;
  /**
   * Override the derived operation for test / special-case callers. "send"
   * treats the prompt as a new user message appended to the thread history.
   */
  operationOverride?: "send" | "retry" | "edit";
  /**
   * Explicit parent message ID for history loading. Skips the "find last
   * message by createdAt" fallback. Critical for WAIT mode resume where the
   * tool message with the backfilled result must be the ancestry root.
   */
  explicitParentMessageId?: string;
  /**
   * Force a specific sequenceId for the revival AI message so it shares the
   * sequence of the synthetic assistant + deferred tool pair preceding it.
   */
  sequenceIdOverride?: string;
  /** Override resolved media gen models - bypasses the user-settings cascade (tests). */
  mediaModelOverrides?: {
    musicGenModelSelection?: MusicGenModelSelection;
    videoGenModelSelection?: VideoGenModelSelection;
    imageGenModelSelection?: ImageGenModelSelection;
  };
  /** Sub-agent nesting depth (0 = top-level, incremented by ai-run) */
  subAgentDepth: number;
  /** File attachments to include with the user message (images, audio, PDFs, video) */
  attachments?: File[];
  /**
   * Audio input for STT transcription (voice UI flow). Transcribed text
   * replaces the prompt as the user message content - distinct from audio
   * attachments which go through the gap-fill audioVisionModel bridge.
   */
  audioInput?: File | null;
  /**
   * Tool confirmations to process before the AI stream starts. Each entry
   * confirms or rejects a pending tool call by its message ID (tests).
   */
  toolConfirmations?: Array<{
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  }> | null;
  /** Override available tools with custom requiresConfirmation settings (tests). */
  availableTools?: Array<{
    toolId: string;
    requiresConfirmation: boolean;
  }> | null;
  /** System user context for execution */
  user: JwtPayloadType;
  /** Locale for i18n */
  locale: CountryLanguage;
  /** Logger instance */
  logger: EndpointLogger;
  /** Translation function for ai-stream module */
  t: AiStreamT;
  /**
   * Called as soon as the sub-thread ID is determined (before the AI stream
   * starts) - ai-run emits a partial tool result so the parent UI can render
   * sub-thread messages in real-time.
   */
  onThreadCreated?: (threadId: string) => Promise<void>;
  /** Parent stream's abort signal - this sub-stream aborts when the caller does. */
  abortSignal: AbortSignal;
}

export interface HeadlessAiStreamResult {
  /** ID of the last assistant message - read content from DB using this */
  lastAiMessageId: string;
  /** Thread ID - undefined when threadMode is "none" */
  threadId?: string;
  /** Final text content - populated in memory even for incognito (no DB read needed) */
  lastAiMessageContent: string | null;
  /** URL of the last generated media (image/audio/video) - set when native file parts are emitted */
  lastGeneratedMediaUrl?: string | null;
  /** Total credits deducted during this stream (model + tools) - for cost display in callers */
  totalCreditsDeducted?: number;
  /**
   * Number of tool schemas loaded into the AI context window for this stream.
   * 0 = no tools. Used in tests to assert skill/favorite tool configuration.
   */
  pinnedToolCount: number;
}

export async function resolveFavorite(
  favoriteId: string,
  userId: string,
  user: JwtPayloadType,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<{
  model: ChatModelId;
  skill: string;
  favoriteConfig: FavoriteConfig;
} | null> {
  const favoriteIdCondition = isUuid(favoriteId)
    ? eq(chatFavorites.id, favoriteId)
    : eq(chatFavorites.slug, favoriteId);
  const [favorite] = await db
    .select(FAVORITE_CONFIG_COLUMNS)
    .from(chatFavorites)
    .where(and(favoriteIdCondition, eq(chatFavorites.userId, userId)))
    .limit(1);

  if (!favorite) {
    logger.error("[Headless AI] Favorite not found", { favoriteId, userId });
    return null;
  }

  const skill = favorite.skillId || NO_SKILL_ID;
  const availability = await getInstanceAvailability();

  const sel = favorite.modelSelection;

  if (sel && isManualSelection(sel) && "manualModelId" in sel) {
    return {
      model: sel.manualModelId,
      skill,
      favoriteConfig: favorite,
    };
  }
  if (sel && isFiltersSelection(sel)) {
    const best = getBestChatModel(sel, user, availability);
    if (best) {
      return { model: best.id, skill, favoriteConfig: favorite };
    }
  }

  if (skill !== NO_SKILL_ID) {
    const { SkillsRepository } = await import("../../skills/repository");
    const skillResult = await SkillsRepository.getSkillById(
      { id: skill },
      user,
      logger,
      locale,
    );
    if (skillResult.success) {
      const variants = skillResult.data.variants;
      const { variantId: favoriteVariantId } = parseSkillId(favorite.skillId);
      const variant = variants
        ? favoriteVariantId
          ? variants.find((v) => v.id === favoriteVariantId)
          : (variants.find((v) => v.isDefault) ?? variants[0])
        : null;
      const varSel = variant?.modelSelection;
      if (varSel && (isManualSelection(varSel) || isFiltersSelection(varSel))) {
        const best = getBestChatModel(varSel, user, availability);
        if (best) {
          return { model: best.id, skill, favoriteConfig: favorite };
        }
      }
    }
  }

  logger.warn(
    "[Headless AI] Favorite has no resolvable model - pass model explicitly",
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
    favoriteConfig: favoriteConfigOverride,
    threadId: existingThreadId,
    subFolderId,
    rootFolderId: rootFolderIdOverride,
    preCalls,
    excludeMemories,
    wakeUpRevival,
    operationOverride,
    explicitParentMessageId,
    sequenceIdOverride,
    mediaModelOverrides,
    attachments: headlessAttachments,
    audioInput,
    toolConfirmations: headlessToolConfirmations,
    user,
    locale,
    logger,
    t: aiStreamT,
    abortSignal: parentAbortSignal,
  } = params;

  const headlessAvailability = await getInstanceAvailability();

  try {
    // ── Resolve model + skill + favorite config ──────────────────────────
    let model = modelOverride;
    let skill = skillOverride;
    let resolvedFavoriteConfig: FavoriteConfig | null =
      favoriteConfigOverride ?? null;

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
        // Use resolved favorite config if caller didn't provide one
        if (!resolvedFavoriteConfig) {
          resolvedFavoriteConfig = resolved.favoriteConfig;
        }
      }
    }

    // ── Apply availableTools override to favoriteConfig ──────────────────
    // Lets integration tests inject requiresConfirmation settings without
    // needing a pre-configured favorite that has those settings saved.
    if (
      params.availableTools !== null &&
      params.availableTools !== undefined &&
      resolvedFavoriteConfig
    ) {
      resolvedFavoriteConfig = {
        ...resolvedFavoriteConfig,
        availableTools: params.availableTools,
      };
    }

    // When favoriteConfig is passed directly (no favoriteId), resolve model+skill from it.
    if (resolvedFavoriteConfig && (!model || !skill)) {
      if (!model && resolvedFavoriteConfig.modelSelection) {
        const best = getBestChatModel(
          resolvedFavoriteConfig.modelSelection,
          user,
          headlessAvailability,
        );
        if (best) {
          model = best.id;
        }
      }
      if (!skill && resolvedFavoriteConfig.skillId) {
        skill = resolvedFavoriteConfig.skillId;
      }
    }

    if (!model || !skill) {
      return fail({
        message: aiStreamT("headless.errors.missingModelOrSkill"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const rootFolderId = rootFolderIdOverride;
    const effectiveThreadId = existingThreadId ?? crypto.randomUUID();
    const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;

    // Notify caller of the thread ID before the AI stream starts.
    // ai-run uses this to emit a partial tool result so the parent UI
    // can start rendering sub-thread messages in real-time.
    if (params.onThreadCreated) {
      await params.onThreadCreated(effectiveThreadId);
    }

    // ── Pre-call injection ─────────────────────────────────────────────────
    // Write pre-call results as proper tool messages in the thread so the AI
    // sees them in context and they render correctly in the UI.
    // Only write to DB for persistent threads (not incognito).
    const userMessageId = crypto.randomUUID();
    let parentMessageIdForAi: string | null = null;

    if (preCalls && preCalls.length > 0 && !isIncognito) {
      // Ensure the thread exists first
      const userId = user.isPublic ? undefined : user.id;
      const ensureResult = await ThreadsRepository.ensureThread({
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
      if (!ensureResult.success) {
        return ensureResult;
      }

      // For append mode, find the current last message so user msg chains correctly
      let preCallUserParentId: string | null = null;
      if (existingThreadId) {
        const [lastMsg] = await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.threadId, existingThreadId))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1);
        preCallUserParentId = lastMsg?.id ?? null;
      }

      // Write the user message first
      await db.insert(chatMessages).values({
        id: userMessageId,
        threadId: effectiveThreadId,
        role: ChatMessageRole.USER,
        content: prompt,
        parentId: preCallUserParentId,
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
    // explicitParentMessageId takes priority - critical for WAIT mode resume where
    // the tool message with its backfilled result must be the history root, not
    // whatever message was created most recently by timestamp.
    if (existingThreadId && !parentMessageIdForAi) {
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

    // wakeUpRevival uses "wakeup-resume" - same as answer-as-ai but without
    // CONTINUE_CONVERSATION_PROMPT. The AI sees the deferred tool result as
    // the last message and responds naturally.
    const operation =
      operationOverride ??
      (wakeUpRevival && parentMessageIdForAi
        ? "wakeup-resume"
        : parentMessageIdForAi
          ? "answer-as-ai"
          : "send");

    logger.debug("[Headless] operation resolved", {
      operation,
      wakeUpRevival,
      parentMessageIdForAi,
      existingThreadId,
    });

    // When preCalls are used, the user message was already written manually above.
    // Override to "answer-as-ai" so stream-setup doesn't re-insert the same userMessageId.
    const effectiveOperation =
      preCalls && preCalls.length > 0 && parentMessageIdForAi
        ? "answer-as-ai"
        : operation;

    // ── Synthetic request data — the headless intake phase inside
    // createAiStream derives operation/parent/userMessageId and injects
    // preCalls; this adapter only supplies the raw ingredients.
    const syntheticData: AiStreamPostRequestOutput = {
      operation: effectiveOperation,
      rootFolderId,
      subFolderId: subFolderId ?? null,
      threadId: effectiveThreadId,
      userMessageId:
        effectiveOperation !== "answer-as-ai" ? userMessageId : null,
      parentMessageId: parentMessageIdForAi,
      content: prompt,
      role: ChatMessageRole.USER,
      model,
      skill: skill,
      favoriteConfig: resolvedFavoriteConfig,
      toolConfirmations: headlessToolConfirmations ?? null,
      messageHistory: [] as AiStreamPostRequestOutput["messageHistory"],
      voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE_ID },
      audioInput: { file: audioInput ?? null },
      resumeToken: null,
      timezone: "UTC",
      attachments: headlessAttachments ?? null,
      executionContext: { mode: "local" as const },
    };

    const result = await AiStreamRepository.createAiStream({
      data: syntheticData,
      locale,
      logger,
      user,
      request: undefined,
      t: aiStreamT,
      headless: true,
      isRevival: wakeUpRevival === true,
      extraInstructions: headlessInstructions,
      excludeMemories,
      favoriteIdOverride: favoriteId,
      sequenceIdOverride,
      subAgentDepth: params.subAgentDepth,
      mediaModelOverrides,
      parentAbortSignal,
    });

    if (!result.success) {
      return result;
    }

    const {
      threadId,
      lastAiMessageId,
      lastAiMessageContent,
      lastGeneratedMediaUrl,
      totalCreditsDeducted,
      pinnedToolCount,
    } = result.data;

    logger.debug("[Headless AI] Execution complete", {
      model,
      threadId,
      lastAiMessageId,
      isIncognito,
      pinnedToolCount,
    });

    return {
      success: true,
      data: {
        lastAiMessageId,
        lastAiMessageContent,
        lastGeneratedMediaUrl,
        totalCreditsDeducted,
        pinnedToolCount,
        threadId: isIncognito ? undefined : threadId,
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
