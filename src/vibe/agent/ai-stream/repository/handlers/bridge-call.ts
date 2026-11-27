/** Modality bridge calls (vision / STT / media-URL) + their prompts, driven by GapFillExecutor. */

import "server-only";

import type { FilePart, ImagePart, LanguageModel } from "ai";
import { APICallError, generateText as aiGenerateText } from "ai";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ToolExecutionContext } from "../../../../core/execution-context";
import { fetchStorageFileAsBase64 } from "../../../chat/storage/url-utils";
import type { AgentEnvAvailability } from "../../../env-availability";
import type { Modality } from "../../../models/enum";
import type { ModelOptionTokenBased } from "../../../models/models";
import {
  extractLanguageModelRequestId,
  mergeProviderJobIds,
} from "../../../shared/provider-job-id";
import {
  AUDIO_VISION_FALLBACK_MODEL_IDS,
  IMAGE_VISION_FALLBACK_MODEL_IDS,
  VIDEO_VISION_FALLBACK_MODEL_IDS,
} from "../../constants";
import type { ChatModelId } from "../../models";
import {
  type AudioVisionModelId,
  filterAudioVisionModels,
  filterImageVisionModels,
  filterVideoVisionModels,
  type ImageVisionModelId,
  type VideoVisionModelId,
} from "../../vision-models";
import { attachmentIdOfPart } from "../context/bridged-attachment";
import { ProviderFactory } from "../core/infra";
import type { MessageDbWriter } from "../core/message-db-writer";
import {
  type BridgeContext,
  type MessageVariant,
  ModalityResolver,
} from "../core/modality-resolver";
import { readCacheUsage, TokenAccumulator } from "../loop/token-accumulator";
import {
  AUDIO_CONTENT_REFUSAL_FALLBACK_IDS,
  type BridgeFailureClass,
  IMAGE_CONTENT_REFUSAL_FALLBACK_IDS,
  maxBridgeModels,
  pickBridgeFallback,
  VIDEO_CONTENT_REFUSAL_FALLBACK_IDS,
} from "./vision-fallback";
import { detectVisionRefusal, isModerationError } from "./vision-refusal";

const BRIDGE_PROMPTS = {
  image: `You are a vision bridge. Your output will be the ONLY representation of this image that another AI model will ever receive - it cannot see the image itself.

Describe everything you observe with maximum fidelity and detail:
- **Subject & composition**: What is the main subject? How is it framed and positioned?
- **Objects & elements**: List every significant object, person, animal, text, symbol, or UI element present.
- **Text & typography**: Transcribe ALL text visible in the image exactly as written, including signs, labels, captions, watermarks, UI text.
- **Colors**: Describe colors precisely (e.g. "deep burgundy", "muted sage green") - not just "red" or "green".
- **Spatial layout**: Where are things relative to each other? Foreground/background, left/right, overlapping?
- **Style & medium**: Is it a photograph, illustration, screenshot, chart, diagram, painting? What visual style?
- **Mood & lighting**: What is the atmosphere, lighting condition, time of day if relevant?
- **Fine details**: Expressions, textures, patterns, any small but potentially meaningful details.

Write in flowing prose. Do not summarize. Do not omit. The receiving AI must be able to reconstruct a near-perfect mental model of this image from your description alone.`,

  audio: `You are an audio bridge. Your output will be the ONLY representation of this audio that another AI model will ever receive - it cannot hear the audio itself.

Transcribe and describe everything you hear with maximum fidelity and detail:

**If speech is present:**
- Transcribe ALL spoken words verbatim, exactly as said, including filler words, hesitations, repetitions
- Note speaker characteristics: accent, gender, age estimate, emotional tone, speaking pace
- Note any background voices or overlapping speech

**If music is present:**
- Genre, subgenre, and closest reference artists or songs
- Tempo (BPM estimate), key/scale if discernible, time signature
- All instruments heard and how they interact (e.g. "driving 808 bass under a sparse piano melody")
- Vocals: lyrics verbatim if present, vocal style, harmonies
- Song structure: intro, verse, chorus, bridge - what happens when
- Production style: raw/lo-fi vs polished, reverb, effects, notable characteristics
- Mood and emotional arc over the duration

**For any audio:**
- Duration impression (short clip, full track, extended)
- Sound quality, recording environment (studio, room, outdoor, phone mic)
- Any notable sound effects, ambient sounds, or non-musical audio events
- If silence or near-silence: note that explicitly

Write in structured prose. Do not summarize. Do not omit. The receiving AI must be able to reconstruct a near-perfect mental model of this audio from your description alone.`,

  video: `You are a video bridge. Your output will be the ONLY representation of this video that another AI model will ever receive - it cannot see or hear it.

Describe everything with maximum fidelity and detail:

**Visual content (frame by frame if needed):**
- What happens over time: describe the sequence of scenes, actions, or changes
- Every significant person, object, animal, text, or UI element visible
- Setting/environment: indoor/outdoor, location cues, time of day, era
- Camera work: cuts, pans, zooms, angles, shot types (close-up, wide, POV)
- Text on screen: transcribe ALL text exactly - titles, captions, subtitles, UI labels, watermarks

**Audio (if present):**
- Transcribe ALL speech verbatim, including who is speaking if identifiable
- Background music: genre, tempo, mood, instruments
- Sound effects, ambient audio, notable audio events

**Style & production:**
- Is it a movie, TV show, social media clip, screen recording, animation, news broadcast, tutorial?
- Visual style: realistic, animated, stylized, filtered, documentary?
- Production quality: professional, amateur, lo-fi?

**Mood & arc:**
- What is the emotional tone at the start vs end?
- Is there a narrative, argument, or demonstration being made?

**Duration & pacing:**
- Approximate length, pacing (slow/fast cuts, talking speed)

Write in structured prose. Do not summarize. Do not omit. The receiving AI must be able to reconstruct a near-perfect mental model of this video from your description alone.`,
};

/**
 * Build a FilePart from a raw part that has either `.data` or `.url`.
 * Returns null if neither is present.
 */
function resolveFilePart(
  part: FilePart,
  defaultMimeType: string,
): FilePart | null {
  const mimeType =
    "mediaType" in part && part.mediaType
      ? String(part.mediaType)
      : defaultMimeType;

  if ("data" in part && part.data) {
    return {
      type: "file" as const,
      data: part.data,
      mediaType: mimeType as `${string}/${string}`,
    };
  }
  if ("url" in part && part.url) {
    return {
      type: "file" as const,
      data: new URL(String(part.url)),
      mediaType: mimeType as `${string}/${string}`,
    };
  }
  return null;
}

/**
 * Shared tail for all bridge calls: run aiGenerateText, emit completion, deduct credits.
 */
type BridgeModelId =
  | ChatModelId
  | ImageVisionModelId
  | VideoVisionModelId
  | AudioVisionModelId;

/** Successful bridge description, a failure reason string (prefixed with \0), or null (aborted). */
type BridgeCallResult = string | null;

/** Sentinel prefix to distinguish a bridge failure message from real description text. */
const BRIDGE_FAIL_PREFIX = "\0BRIDGE_FAIL:";

/** Pack a failure reason into a BridgeCallResult sentinel. */
function bridgeFail(reason: string): BridgeCallResult {
  return `${BRIDGE_FAIL_PREFIX}${reason}`;
}

/** True if the result is a packed failure (not real description text). */
export function isBridgeFail(result: BridgeCallResult): result is string {
  return typeof result === "string" && result.startsWith(BRIDGE_FAIL_PREFIX);
}

/** Extract the human-readable reason from a failure sentinel. */
export function getBridgeFailReason(result: string): string {
  return result.slice(BRIDGE_FAIL_PREFIX.length);
}

/** A bridge-capable model option (any vision pool or a chat model). */
type BridgeModelOption = ModelOptionTokenBased & { id: BridgeModelId };

/**
 * Why one attempt ended. refusal-reply / content-filter / empty-output /
 * provider-moderation are content refusals (deterministic, never re-sent to
 * the same model); attempt-deadline and request-error are provider errors.
 */
type BridgeAttemptStage =
  | "ok"
  | "refusal-reply"
  | "content-filter"
  | "empty-output"
  | "provider-moderation"
  | "attempt-deadline"
  | "request-error"
  | "aborted";

/**
 * One model call of a bridge, kept for the single log row of the bridge's
 * outcome. Logged under `visionAttempt` (fingerprint-ignored): the durations
 * and raw provider errors vary per occurrence, the stages do not.
 */
export interface BridgeAttemptRecord {
  modelId: string;
  apiProvider: string;
  /** 1 or 2: the same model gets one retry after a provider error. */
  attempt: number;
  stage: BridgeAttemptStage;
  durationMs: number;
  deadlineMs: number;
  /** Who ended a failed call: our parent stream, our deadline, or upstream. */
  endedBy?: "parent-stream" | "attempt-deadline" | "provider-or-sdk";
  /** Parent stream abort reason (e.g. user_cancelled). */
  abortReason?: string;
  upstreamStatus?: number;
  upstreamRetryable?: boolean;
  finishReason?: string;
  error?: string;
}

/** Outcome of running ONE model (with its single provider-error retry). */
export type BridgeAttemptOutcome =
  | {
      kind: "ok";
      requestStartedAt: number;
      result: Awaited<ReturnType<typeof aiGenerateText>>;
      output: string;
    }
  | { kind: "fail"; reason: string; failureClass: BridgeFailureClass }
  | { kind: "aborted" };

function refusalStage(
  reason: string,
  finishReason: string,
): BridgeAttemptStage {
  if (finishReason === "content-filter") {
    return "content-filter";
  }
  return reason.startsWith("empty description")
    ? "empty-output"
    : "refusal-reply";
}

function abortReasonOf(signal: AbortSignal): string {
  const reason: string | Error | undefined =
    typeof signal.reason === "string" || signal.reason instanceof Error
      ? signal.reason
      : undefined;
  if (reason === undefined) {
    return "unknown";
  }
  return typeof reason === "string" ? reason : parseError(reason).message;
}

/**
 * Run one bridge model: bounded attempts, moderation/refusal detection.
 * Refusals are deterministic, so they are never retried on the same model.
 * Every call lands in `attempts`; only debug lines are logged here, the
 * caller writes ONE row per bridge outcome.
 */
async function attemptBridgeModel(params: {
  model: BridgeModelOption;
  toolExecutionContext: ToolExecutionContext;
  contentPart: ImagePart | FilePart;
  promptText: string;
  abortSignal: AbortSignal;
  logger: EndpointLogger;
  errorLabel: string;
  attempts: BridgeAttemptRecord[];
}): Promise<BridgeAttemptOutcome> {
  const { model, contentPart, promptText, abortSignal, logger, attempts } =
    params;
  const provider = ProviderFactory.getProviderForModel(
    model,
    logger,
    params.toolExecutionContext,
  );

  // Bridge calls are auxiliary (a description, not the turn itself) and
  // upload large inline payloads (base64 video/audio) - a hung provider
  // connection must never stall the whole stream for the 15-min stream
  // budget. Bound each attempt and retry once.
  const BRIDGE_ATTEMPT_TIMEOUT_MS = 150_000;
  for (let attempt = 0; attempt < 2; attempt++) {
    const requestStartedAt = Date.now();
    const attemptDeadline = AbortSignal.timeout(BRIDGE_ATTEMPT_TIMEOUT_MS);
    const base = {
      modelId: model.id,
      apiProvider: model.apiProvider,
      attempt: attempt + 1,
      deadlineMs: BRIDGE_ATTEMPT_TIMEOUT_MS,
    };
    try {
      const result = await aiGenerateText({
        model: provider.chat(model.providerModel) as LanguageModel,
        abortSignal: AbortSignal.any([abortSignal, attemptDeadline]),
        messages: [
          {
            role: "user" as const,
            content: [contentPart, { type: "text" as const, text: promptText }],
          },
        ],
      });
      const output = result.text.trim();
      const refusal = detectVisionRefusal(output, result.finishReason);
      const durationMs = Date.now() - requestStartedAt;
      if (refusal) {
        attempts.push({
          ...base,
          stage: refusalStage(refusal, result.finishReason),
          durationMs,
          finishReason: result.finishReason,
          error: refusal,
        });
        logger.debug(`[GapFill] ${params.errorLabel} bridge model refused`, {
          modelId: model.id,
          reason: refusal,
        });
        return {
          kind: "fail",
          reason: refusal,
          failureClass: "content-refusal",
        };
      }
      attempts.push({
        ...base,
        stage: "ok",
        durationMs,
        finishReason: result.finishReason,
      });
      return { kind: "ok", result, output, requestStartedAt };
    } catch (attemptErr) {
      const parsedAttemptErr = parseError(attemptErr);
      const apiError = APICallError.isInstance(attemptErr) ? attemptErr : null;
      const endedBy = abortSignal.aborted
        ? "parent-stream"
        : attemptDeadline.aborted
          ? "attempt-deadline"
          : "provider-or-sdk";
      const record: BridgeAttemptRecord = {
        ...base,
        stage: "request-error",
        durationMs: Date.now() - requestStartedAt,
        endedBy,
        upstreamStatus: apiError?.statusCode,
        upstreamRetryable: apiError?.isRetryable,
        error: parsedAttemptErr.message,
      };
      // Parent stream cancelled -> stop immediately.
      if (abortSignal.aborted) {
        attempts.push({
          ...record,
          stage: "aborted",
          abortReason: abortReasonOf(abortSignal),
        });
        return { kind: "aborted" };
      }
      // A provider moderation block (Gemini PROHIBITED_CONTENT / SAFETY,
      // Alibaba data_inspection_failed, content-filter refusals) is
      // deterministic: retrying the same payload on the same model only
      // bills a second refusal.
      if (isModerationError(parsedAttemptErr.message)) {
        attempts.push({ ...record, stage: "provider-moderation" });
        return {
          kind: "fail",
          reason: `refused by provider moderation: ${parsedAttemptErr.message}`,
          failureClass: "content-refusal",
        };
      }
      attempts.push({
        ...record,
        stage:
          endedBy === "attempt-deadline" ? "attempt-deadline" : "request-error",
      });
      logger.debug(`[GapFill] ${params.errorLabel} bridge attempt failed`, {
        modelId: model.id,
        attempt: attempt + 1,
        error: parsedAttemptErr.message,
      });
      if (attempt === 1) {
        return {
          kind: "fail",
          reason: parsedAttemptErr.message,
          failureClass: "provider-error",
        };
      }
    }
  }
  return {
    kind: "fail",
    reason: "no attempt completed",
    failureClass: "provider-error",
  };
}

/** State the fallback picker sees after a model failed. */
interface BridgeFallbackState {
  tried: readonly BridgeModelOption[];
  refused: readonly BridgeModelOption[];
  failureClass: BridgeFailureClass;
}

type BridgeFallbackResolver = (
  state: BridgeFallbackState,
) => BridgeModelOption | null;

/** Refusal-aware fallback resolver for one modality's vision pool. */
function bridgeFallbackResolver(
  modality: Modality,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): BridgeFallbackResolver {
  return (state) => {
    if (modality === "video") {
      return pickBridgeFallback({
        pool: filterVideoVisionModels(null, user, availability),
        priority: VIDEO_VISION_FALLBACK_MODEL_IDS,
        contentRefusalPriority: VIDEO_CONTENT_REFUSAL_FALLBACK_IDS,
        ...state,
      });
    }
    if (modality === "audio") {
      return pickBridgeFallback({
        pool: filterAudioVisionModels(null, user, availability),
        priority: AUDIO_VISION_FALLBACK_MODEL_IDS,
        contentRefusalPriority: AUDIO_CONTENT_REFUSAL_FALLBACK_IDS,
        ...state,
      });
    }
    return pickBridgeFallback({
      pool: filterImageVisionModels(null, user, availability),
      priority: IMAGE_VISION_FALLBACK_MODEL_IDS,
      contentRefusalPriority: IMAGE_CONTENT_REFUSAL_FALLBACK_IDS,
      ...state,
    });
  };
}

/** Fingerprint-stable summary of a chain: "model:stage" per attempt. */
function attemptStages(attempts: readonly BridgeAttemptRecord[]): string[] {
  return attempts.map((a) => `${a.modelId}:${a.stage}`);
}

/**
 * Run the bridge model chain: the resolved model first, then refusal-aware
 * fallbacks (see vision-fallback.ts) until one describes the media or the
 * chain is exhausted. Exactly ONE warn/error row per bridge that did not
 * succeed on its first call (recovered, failed or aborted), carrying every
 * attempt. Returns the winning outcome and model, or a failure reason.
 */
export async function runBridgeChain(params: {
  model: BridgeModelOption;
  resolveFallback: BridgeFallbackResolver;
  attempt: (
    model: BridgeModelOption,
    attempts: BridgeAttemptRecord[],
  ) => Promise<BridgeAttemptOutcome>;
  bridgeType: "stt" | "vision" | "translation" | "tts";
  modality: Modality;
  inputContext: Record<string, string | number | undefined>;
  logger: EndpointLogger;
  errorLabel: string;
}): Promise<
  | {
      kind: "ok";
      model: BridgeModelOption;
      outcome: Extract<BridgeAttemptOutcome, { kind: "ok" }>;
    }
  | { kind: "fail"; reason: string }
  | { kind: "aborted" }
> {
  const { model, resolveFallback, bridgeType, modality, logger, errorLabel } =
    params;
  const attempts: BridgeAttemptRecord[] = [];
  const tried: BridgeModelOption[] = [];
  const refused: BridgeModelOption[] = [];
  const failureClasses: BridgeFailureClass[] = [];
  const reasons: string[] = [];
  let current: BridgeModelOption | null = model;

  const chainContext = (): Record<
    string,
    string | number | string[] | undefined | { attempts: BridgeAttemptRecord[] }
  > => ({
    ...params.inputContext,
    bridgeType,
    modality,
    requestedModelId: model.id,
    modelsTried: tried.length,
    attemptStages: attemptStages(attempts),
    visionAttempt: { attempts },
  });

  while (current) {
    tried.push(current);
    const outcome = await params.attempt(current, attempts);
    if (outcome.kind === "aborted") {
      logger.warn(`[GapFill] ${errorLabel} bridge call aborted`, {
        ...chainContext(),
        aborted: true,
        abortReason: attempts.at(-1)?.abortReason ?? "unknown",
      });
      return { kind: "aborted" };
    }
    if (outcome.kind === "ok") {
      if (attempts.length > 1) {
        logger.warn(
          `[GapFill] ${errorLabel} bridge recovered after failed attempts`,
          {
            ...chainContext(),
            outcome: "recovered",
            modelId: current.id,
            apiProvider: current.apiProvider,
          },
        );
      }
      return { kind: "ok", model: current, outcome };
    }
    reasons.push(`${current.id}: ${outcome.reason}`);
    failureClasses.push(outcome.failureClass);
    if (outcome.failureClass === "content-refusal") {
      refused.push(current);
    }
    current =
      tried.length < maxBridgeModels(failureClasses)
        ? resolveFallback({
            tried,
            refused,
            failureClass: outcome.failureClass,
          })
        : null;
    if (current) {
      logger.debug(`[GapFill] ${errorLabel} bridge falling back`, {
        failedModelId: tried.at(-1)?.id,
        fallbackModelId: current.id,
        failureClass: outcome.failureClass,
      });
    }
  }

  logger.error(`[GapFill] ${errorLabel} bridge failed`, {
    ...chainContext(),
    outcome: failureClasses.every((c) => c === "content-refusal")
      ? "refused"
      : "failed",
    failureClasses: [...new Set(failureClasses)],
  });
  return { kind: "fail", reason: reasons.join("; ") };
}

/**
 * Shared tail for all bridge calls: run the model chain, emit completion,
 * deduct credits. A failure is always returned as an explicit bridgeFail
 * (never as text that could pass for a description).
 */
async function runBridgeCall(params: {
  model: BridgeModelOption;
  resolveFallback: BridgeFallbackResolver;
  toolExecutionContext: ToolExecutionContext;
  contentPart: ImagePart | FilePart;
  promptText: string;
  abortSignal: AbortSignal;
  chatMessageId: string | null;
  /** Attachment being described (tags the cached variant). */
  attachmentId: string | undefined;
  bridgeType: "stt" | "vision" | "translation" | "tts";
  modality: Modality;
  /** Credit feature label; the model id that produced the output is appended. */
  creditFeaturePrefix: string;
  /** Bill the call even when there is no chat message to attach it to. */
  billWithoutMessage?: boolean;
  dbWriter: MessageDbWriter;
  user: JwtPayloadType;
  logger: EndpointLogger;
  errorLabel: string;
}): Promise<BridgeCallResult> {
  const {
    model,
    contentPart,
    chatMessageId,
    attachmentId,
    bridgeType,
    modality,
    creditFeaturePrefix,
    billWithoutMessage,
    dbWriter,
    user,
    logger,
    errorLabel,
  } = params;

  const media =
    contentPart.type === "file" ? contentPart.data : contentPart.image;
  const mediaBytes =
    media instanceof ArrayBuffer || ArrayBuffer.isView(media)
      ? media.byteLength
      : undefined;
  const inputContext = {
    mediaType: contentPart.mediaType,
    inputRepresentation:
      media instanceof URL
        ? "url"
        : typeof media === "string"
          ? "inline-text"
          : mediaBytes === undefined
            ? "structured"
            : "binary",
    bridgeInputSize: typeof media === "string" ? media.length : mediaBytes,
  };

  try {
    const chain = await runBridgeChain({
      model,
      resolveFallback: params.resolveFallback,
      attempt: (candidate, attempts) =>
        attemptBridgeModel({ ...params, model: candidate, attempts }),
      bridgeType,
      modality,
      inputContext,
      logger,
      errorLabel,
    });
    if (chain.kind === "aborted") {
      return null;
    }
    if (chain.kind === "fail") {
      return bridgeFail(chain.reason);
    }
    const usedModel = chain.model;
    const { result, output, requestStartedAt } = chain.outcome;
    const cache = readCacheUsage(
      result.usage,
      result.providerMetadata,
      usedModel.providerModel.startsWith("anthropic/"),
    );
    const { credits: creditCost, upstreamCost } =
      TokenAccumulator.chargeSingleCall(
        usedModel,
        {
          inputTokens: result.usage.inputTokens ?? 0,
          outputTokens: result.usage.outputTokens ?? 0,
          ...cache,
          requestStartedAt,
          promptCountKnown: (result.usage.inputTokens ?? 0) > 0,
        },
        result.providerMetadata,
        logger,
      );

    if (chatMessageId) {
      const variant: MessageVariant = {
        modality: "text" as Modality,
        content: output,
        modelId: usedModel.id,
        creditCost,
        createdAt: new Date().toISOString(),
        bridgeType,
        ...(attachmentId ? { attachmentId } : {}),
      };

      await dbWriter.emitGapFillCompleted({
        messageId: chatMessageId,
        bridgeType,
        modality,
        variant,
      });
    }

    if (creditCost > 0 && (chatMessageId || billWithoutMessage)) {
      await dbWriter.deductAndEmitCredits({
        user,
        amount: creditCost,
        feature: `${creditFeaturePrefix}:${usedModel.id}`,
        type: "model",
        model: usedModel.id,
        apiProvider: usedModel.apiProvider,
        upstreamCost,
        tokenUsage: {
          cachedInputTokens: cache.cachedInputTokens,
          cacheWriteTokens: cache.cacheWriteTokens,
        },
        providerJob: mergeProviderJobIds([
          extractLanguageModelRequestId(result.response),
        ]),
      });
    }

    return output;
  } catch (err) {
    // Not a model failure (those are caught per attempt): provider setup,
    // the completion emit or the credit deduction threw.
    const parsed = parseError(err);
    logger.warn(`[GapFill] ${errorLabel} bridge threw outside the model call`, {
      ...inputContext,
      error: parsed.message,
      errorStack: parsed.stack,
      modelId: model.id,
      modality,
      bridgeType,
    });
    return bridgeFail(parsed.message);
  }
}

export class BridgeCall {
  static async bridgeAttachment(params: {
    part: ImagePart | FilePart;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    /** Fixture chain of the owning stream — vision-bridge model calls bind it. */
    toolExecutionContext: ToolExecutionContext;
    locale: CountryLanguage;
    availability: AgentEnvAvailability;
  }): Promise<BridgeCallResult> {
    const {
      part,
      chatMessageId,
      bridgeContext,
      dbWriter,
      logger,
      user,
      locale,
      availability,
    } = params;

    const isImage = part.type === "image";
    const mime =
      !isImage && "mediaType" in part && typeof part.mediaType === "string"
        ? part.mediaType
        : "";
    const isVideo = !isImage && mime.startsWith("video/");

    const bridgeType: "stt" | "vision" | "translation" | "tts" = isImage
      ? "vision"
      : isVideo
        ? "vision"
        : "stt";
    const modality: Modality = isImage ? "image" : isVideo ? "video" : "audio";

    // Emit GAP_FILL_STARTED
    if (chatMessageId) {
      dbWriter.emitGapFillStarted({
        messageId: chatMessageId,
        bridgeType,
        modality,
      });
    }

    if (isImage) {
      return BridgeCall.bridgeVision({
        part: part as ImagePart,
        chatMessageId,
        bridgeContext,
        dbWriter,
        abortSignal: params.abortSignal,
        logger,
        user,
        locale,
        modality,
        bridgeType,
        availability,
        toolExecutionContext: params.toolExecutionContext,
      });
    }

    if (isVideo) {
      // Video file → video vision bridge
      return BridgeCall.bridgeVideoFilePart({
        part: part as FilePart,
        chatMessageId,
        bridgeContext,
        dbWriter,
        abortSignal: params.abortSignal,
        logger,
        user,
        locale,
        modality,
        bridgeType,
        availability,
        toolExecutionContext: params.toolExecutionContext,
      });
    }

    // Audio file → audio-vision bridge
    return BridgeCall.bridgeStt({
      part: part as FilePart,
      chatMessageId,
      bridgeContext,
      dbWriter,
      abortSignal: params.abortSignal,
      logger,
      user,
      modality,
      bridgeType,
      availability,
      toolExecutionContext: params.toolExecutionContext,
    });
  }

  private static async bridgeVision(params: {
    part: ImagePart;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
    modality: Modality;
    bridgeType: "stt" | "vision" | "translation" | "tts";
    availability: AgentEnvAvailability;
    /** Fixture chain of the owning stream — vision-bridge model calls bind it. */
    toolExecutionContext: ToolExecutionContext;
  }): Promise<BridgeCallResult> {
    const {
      part,
      chatMessageId,
      bridgeContext,
      dbWriter,
      logger,
      user,
      modality,
      bridgeType,
      availability,
    } = params;

    const visionModel = ModalityResolver.resolveImageVisionModel(
      bridgeContext,
      user,
      availability,
    );
    if (!visionModel) {
      logger.warn(
        "[GapFill] No image vision model configured, skipping image bridge",
        { modality },
      );
      return bridgeFail(
        "no vision model configured — add one in favorite settings",
      );
    }

    // ImagePart.image is DataContent | URL — AI SDK accepts it natively
    if (!part.image) {
      logger.warn("[GapFill] Image part has no image data, skipping");
      return bridgeFail("image data unavailable");
    }

    return runBridgeCall({
      model: visionModel,
      resolveFallback: bridgeFallbackResolver("image", user, availability),
      toolExecutionContext: params.toolExecutionContext,
      contentPart: {
        type: "image" as const,
        image: part.image,
        ...(part.mediaType
          ? { mimeType: part.mediaType as `image/${string}` }
          : {}),
      },
      promptText: BRIDGE_PROMPTS.image,
      abortSignal: params.abortSignal,
      chatMessageId,
      attachmentId: attachmentIdOfPart(part),
      bridgeType,
      modality,
      creditFeaturePrefix: "vision-bridge",
      dbWriter,
      user,
      logger,
      errorLabel: "Vision",
    });
  }

  private static async bridgeStt(params: {
    part: FilePart;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    modality: Modality;
    bridgeType: "stt" | "vision" | "translation" | "tts";
    availability: AgentEnvAvailability;
    /** Fixture chain of the owning stream — vision-bridge model calls bind it. */
    toolExecutionContext: ToolExecutionContext;
  }): Promise<BridgeCallResult> {
    const {
      part,
      chatMessageId,
      bridgeContext,
      dbWriter,
      logger,
      user,
      modality,
      bridgeType,
      availability,
    } = params;

    // Audio attachment bridging uses audio-vision LLM only (e.g. Gemini).
    // Dedicated STT models (Whisper, Deepgram) are reserved for the voice UI
    // transcription flow, not for gap-filling audio file attachments.
    const audioVisionModel = ModalityResolver.resolveAudioVisionModel(
      bridgeContext,
      user,
      availability,
    );
    if (!audioVisionModel) {
      logger.warn(
        "[GapFill] No audio-vision model configured, skipping audio bridge",
        { modality },
      );
      return bridgeFail(
        "no audio-vision model configured — add one in favorite settings",
      );
    }

    const fileData = resolveFilePart(part, "audio/webm");
    if (!fileData) {
      logger.warn(
        "[GapFill] Audio FilePart has no data or url, skipping audio-vision bridge",
      );
      return bridgeFail("audio data unavailable");
    }

    return runBridgeCall({
      model: audioVisionModel,
      resolveFallback: bridgeFallbackResolver("audio", user, availability),
      toolExecutionContext: params.toolExecutionContext,
      contentPart: fileData,
      promptText: BRIDGE_PROMPTS.audio,
      abortSignal: params.abortSignal,
      chatMessageId,
      attachmentId: attachmentIdOfPart(part),
      bridgeType,
      modality,
      creditFeaturePrefix: "audio-vision-bridge",
      dbWriter,
      user,
      logger,
      errorLabel: "Audio-vision LLM",
    });
  }

  /**
   * Bridge a raw video file part to a text description via the video vision model.
   * Used when a user uploads a video file and the active model can't see video.
   */
  private static async bridgeVideoFilePart(params: {
    part: FilePart;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
    modality: Modality;
    bridgeType: "stt" | "vision" | "translation" | "tts";
    availability: AgentEnvAvailability;
    /** Fixture chain of the owning stream — vision-bridge model calls bind it. */
    toolExecutionContext: ToolExecutionContext;
  }): Promise<BridgeCallResult> {
    const {
      part,
      chatMessageId,
      bridgeContext,
      dbWriter,
      logger,
      user,
      modality,
      bridgeType,
      availability,
    } = params;

    const videoVisionModel = ModalityResolver.resolveVideoVisionModel(
      bridgeContext,
      user,
      availability,
    );
    if (!videoVisionModel) {
      logger.warn(
        "[GapFill] No video vision model configured, skipping video bridge",
        { modality },
      );
      return bridgeFail(
        "no video vision model configured — add one in favorite settings",
      );
    }

    const fileData = resolveFilePart(part, "video/mp4");
    if (!fileData) {
      logger.warn("[GapFill] Video FilePart has no data or url, skipping");
      return bridgeFail("video data unavailable");
    }

    return runBridgeCall({
      model: videoVisionModel,
      resolveFallback: bridgeFallbackResolver("video", user, availability),
      toolExecutionContext: params.toolExecutionContext,
      contentPart: fileData,
      promptText: BRIDGE_PROMPTS.video,
      abortSignal: params.abortSignal,
      chatMessageId,
      attachmentId: attachmentIdOfPart(part),
      bridgeType,
      modality,
      creditFeaturePrefix: "video-vision-bridge",
      dbWriter,
      user,
      logger,
      errorLabel: "Video vision",
    });
  }

  /**
   * Bridge a media URL to a text description via the appropriate vision bridge model.
   * Used when a media tool result has a null text field and the active model can't see that modality.
   */
  static async bridgeMediaUrl(params: {
    mediaUrl: string;
    modality: Modality;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
    availability: AgentEnvAvailability;
    /** Fixture chain of the owning stream — vision-bridge model calls bind it. */
    toolExecutionContext: ToolExecutionContext;
  }): Promise<BridgeCallResult> {
    const {
      mediaUrl,
      modality,
      chatMessageId,
      bridgeContext,
      dbWriter,
      abortSignal,
      logger,
      user,
      availability,
    } = params;

    // Pick the correct vision model resolver per modality
    const visionModel =
      modality === "video"
        ? ModalityResolver.resolveVideoVisionModel(
            bridgeContext,
            user,
            availability,
          )
        : modality === "audio"
          ? ModalityResolver.resolveAudioVisionModel(
              bridgeContext,
              user,
              availability,
            )
          : ModalityResolver.resolveImageVisionModel(
              bridgeContext,
              user,
              availability,
            );

    if (!visionModel) {
      logger.warn("[GapFill] No vision model configured for media URL bridge", {
        modality,
      });
      return bridgeFail(
        "no vision model configured — add one in favorite settings",
      );
    }

    const promptText =
      modality === "video"
        ? BRIDGE_PROMPTS.video
        : modality === "audio"
          ? BRIDGE_PROMPTS.audio
          : BRIDGE_PROMPTS.image;

    // Resolve media bytes via direct storage access (bypasses HTTP auth) or HTTP fetch.
    // Direct storage is preferred because:
    // 1. It avoids the authentication requirement on the file-serving endpoint
    // 2. It works for localhost URLs in dev (no external access needed)
    // 3. It works for S3/CDN URLs in production
    const base64Data = await fetchStorageFileAsBase64(mediaUrl);
    if (!base64Data) {
      logger.warn("[GapFill] Failed to resolve media for vision bridge", {
        mediaUrl: mediaUrl.slice(0, 80),
      });
      return bridgeFail("could not retrieve media file from storage");
    }

    // Build content parts per modality - separate paths for correct typing
    const contentParts: ImagePart | FilePart =
      modality === "image"
        ? {
            type: "image" as const,
            image: base64Data,
            mediaType: "image/png",
          }
        : {
            type: "file" as const,
            data: base64Data,
            mediaType: modality === "video" ? "video/mp4" : "audio/mpeg",
          };

    // Emit GAP_FILL_STARTED so the frontend can show a status indicator
    if (chatMessageId) {
      dbWriter.emitGapFillStarted({
        messageId: chatMessageId,
        bridgeType: "vision",
        modality,
      });
    }

    const resolveFallback = bridgeFallbackResolver(
      modality,
      user,
      availability,
    );

    return runBridgeCall({
      model: visionModel,
      resolveFallback,
      toolExecutionContext: params.toolExecutionContext,
      contentPart: contentParts,
      promptText,
      abortSignal,
      chatMessageId,
      attachmentId: undefined,
      bridgeType: "vision",
      modality,
      creditFeaturePrefix: "vision-bridge",
      billWithoutMessage: true,
      dbWriter,
      user,
      logger,
      errorLabel: `${modality} tool-result vision`,
    });
  }
}
