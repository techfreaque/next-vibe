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
import type { HeadlessPreCall } from "./setup";

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
  /** ws-provider RECEIVER loop (relay/inference-provider) — confirmation gates apply despite headless. */
  relayReceiver?: boolean;
  /** Transient plumbing thread (async tool executions): excluded from thread sync. */
  syncEligible?: boolean;
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
    rootFolderId,
    wakeUpRevival,
    user,
    locale,
    logger,
    t: aiStreamT,
  } = params;

  const headlessAvailability = await getInstanceAvailability();

  try {
    // ── Resolve model + skill + favorite config ──────────────────────────
    let model = modelOverride;
    let skill = skillOverride;
    let resolvedFavoriteConfig: FavoriteConfig | null =
      favoriteConfigOverride ?? null;

    if (favoriteId && !user.isPublic && user.id) {
      const resolved = await resolveFavorite(
        favoriteId,
        user.id,
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

    const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;

    // ── Synthetic request data — the headless intake phase inside
    // createAiStream derives operation/parent/userMessageId and injects
    // preCalls; this adapter only supplies the raw ingredients.
    const syntheticData: AiStreamPostRequestOutput = {
      operation: "send", // placeholder - headlessIntake derives the real one
      rootFolderId,
      subFolderId: params.subFolderId ?? null,
      threadId: existingThreadId ?? crypto.randomUUID(),
      userMessageId: null, // headlessIntake assigns one when the operation needs it
      parentMessageId: params.explicitParentMessageId ?? null,
      content: prompt,
      role: ChatMessageRole.USER,
      model,
      skill,
      favoriteConfig: resolvedFavoriteConfig,
      toolConfirmations: params.toolConfirmations ?? null,
      messageHistory: [],
      voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE_ID },
      audioInput: { file: params.audioInput ?? null },
      resumeToken: null,
      timezone: "UTC",
      attachments: params.attachments ?? null,
      executionContext: { mode: "local" as const },
    };

    // Lazy import: headless → index → loop → revival → headless is a module
    // cycle; a static import here TDZ-crashes SSR after partial HMR invalidation
    const { AiStreamRepository } = await import("./index");
    const result = await AiStreamRepository.createAiStream({
      data: syntheticData,
      locale,
      logger,
      user,
      request: undefined,
      t: aiStreamT,
      headless: true,
      relayReceiver: params.relayReceiver,
      syncEligible: params.syncEligible,
      headlessIntake: {
        preCalls: params.preCalls,
        operationOverride: params.operationOverride,
      },
      onThreadCreated: params.onThreadCreated,
      isRevival: wakeUpRevival === true,
      extraInstructions: params.headlessInstructions,
      excludeMemories: params.excludeMemories,
      favoriteIdOverride: favoriteId,
      sequenceIdOverride: params.sequenceIdOverride,
      subAgentDepth: params.subAgentDepth,
      mediaModelOverrides: params.mediaModelOverrides,
      parentAbortSignal: params.abortSignal,
      maxToolCalls: params.maxTurns,
    });

    if (!result.success) {
      return result;
    }

    logger.debug("[Headless AI] Execution complete", {
      model,
      threadId: result.data.threadId,
      lastAiMessageId: result.data.lastAiMessageId,
      isIncognito,
      pinnedToolCount: result.data.pinnedToolCount,
    });

    return {
      success: true,
      data: {
        ...result.data,
        threadId: isIncognito ? undefined : result.data.threadId,
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
