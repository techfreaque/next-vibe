/** Modality bridge calls (vision / STT / media-URL) + their prompts, driven by GapFillExecutor. */

import "server-only";

import type { FilePart, ImagePart, LanguageModel } from "ai";
import { generateText as aiGenerateText } from "ai";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { fetchStorageFileAsBase64 } from "@/app/api/[locale]/agent/chat/storage/url-utils";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import type { ModelOptionTokenBased } from "@/app/api/[locale]/agent/models/models";
import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";

import type { ChatModelId } from "../../models";
import type {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "../../vision-models";
import { ProviderFactory } from "../core/infra";
import type { MessageDbWriter } from "../core/message-db-writer";
import {
  type BridgeContext,
  type MessageVariant,
  ModalityResolver,
} from "../core/modality-resolver";

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

async function runBridgeCall(params: {
  model: ModelOptionTokenBased;
  modelId: BridgeModelId;
  provider: ReturnType<typeof ProviderFactory.getProviderForModel>;
  contentPart: ImagePart | FilePart;
  promptText: string;
  abortSignal: AbortSignal;
  chatMessageId: string | null;
  bridgeType: "stt" | "vision" | "translation" | "tts";
  modality: Modality;
  creditFeature: string;
  dbWriter: MessageDbWriter;
  user: JwtPayloadType;
  logger: EndpointLogger;
  errorLabel: string;
}): Promise<string | null> {
  const {
    model,
    modelId,
    provider,
    contentPart,
    promptText,
    abortSignal,
    chatMessageId,
    bridgeType,
    modality,
    creditFeature,
    dbWriter,
    user,
    logger,
    errorLabel,
  } = params;

  try {
    // Bridge calls are auxiliary (a description, not the turn itself) and
    // upload large inline payloads (base64 video/audio) — a hung provider
    // connection must never stall the whole stream for the 15-min stream
    // budget. Bound each attempt and retry once; a second timeout falls
    // through to the caller's "could not be processed" placeholder.
    const BRIDGE_ATTEMPT_TIMEOUT_MS = 150_000;
    let result: Awaited<ReturnType<typeof aiGenerateText>> | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        result = await aiGenerateText({
          model: provider.chat(model.providerModel) as LanguageModel,
          abortSignal: AbortSignal.any([
            abortSignal,
            AbortSignal.timeout(BRIDGE_ATTEMPT_TIMEOUT_MS),
          ]),
          messages: [
            {
              role: "user" as const,
              content: [
                contentPart,
                { type: "text" as const, text: promptText },
              ],
            },
          ],
        });
        break;
      } catch (attemptErr) {
        // Parent stream cancelled → stop immediately; per-attempt timeout →
        // retry once, then give up (caller substitutes the placeholder text).
        const parsedAttemptErr = parseError(attemptErr);
        if (abortSignal.aborted || attempt === 1) {
          logger.warn(`[GapFill] ${errorLabel} bridge call failed`, {
            error: parsedAttemptErr.message,
            errorStack: parsedAttemptErr.stack,
            modality,
            bridgeType,
            aborted: abortSignal.aborted,
          });
          return null;
        }
        logger.warn(
          `[GapFill] ${errorLabel} bridge attempt timed out - retrying once`,
          {
            modality,
            error: parsedAttemptErr.message,
            errorStack: parsedAttemptErr.stack,
          },
        );
      }
    }
    if (!result) {
      return null;
    }

    const output = result.text.trim();
    const creditCost = calculateCreditCost(
      model,
      result.usage.inputTokens ?? 0,
      result.usage.outputTokens ?? 0,
    );

    if (chatMessageId && output) {
      const variant: MessageVariant = {
        modality: "text" as Modality,
        content: output,
        modelId,
        creditCost,
        createdAt: new Date().toISOString(),
        bridgeType,
      };

      await dbWriter.emitGapFillCompleted({
        messageId: chatMessageId,
        bridgeType,
        modality,
        variant,
      });

      if (creditCost > 0) {
        await dbWriter.deductAndEmitCredits({
          user,
          amount: creditCost,
          feature: creditFeature,
          type: "model",
          model: modelId,
        });
      }
    }

    return output || null;
  } catch (err) {
    const parsed = parseError(err);
    logger.warn(`[GapFill] ${errorLabel} bridge call failed`, {
      error: parsed.message,
      errorStack: parsed.stack,
      modality,
      bridgeType,
    });
    return null;
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
    streamContext: ToolExecutionContext;
    locale: CountryLanguage;
    availability: AgentEnvAvailability;
  }): Promise<string | null> {
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
        streamContext: params.streamContext,
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
        streamContext: params.streamContext,
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
      streamContext: params.streamContext,
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
    streamContext: ToolExecutionContext;
  }): Promise<string | null> {
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
      return null;
    }

    // ImagePart.image is DataContent | URL — AI SDK accepts it natively
    if (!part.image) {
      logger.warn("[GapFill] Image part has no image data, skipping");
      return null;
    }

    return runBridgeCall({
      model: visionModel,
      modelId: visionModel.id,
      provider: ProviderFactory.getProviderForModel(
        visionModel,
        logger,
        params.streamContext,
      ),
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
      bridgeType,
      modality,
      creditFeature: `vision-bridge:${visionModel.id}`,
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
    streamContext: ToolExecutionContext;
  }): Promise<string | null> {
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
      return null;
    }

    const fileData = resolveFilePart(part, "audio/webm");
    if (!fileData) {
      logger.warn(
        "[GapFill] Audio FilePart has no data or url, skipping audio-vision bridge",
      );
      return null;
    }

    return runBridgeCall({
      model: audioVisionModel,
      modelId: audioVisionModel.id,
      provider: ProviderFactory.getProviderForModel(
        audioVisionModel,
        logger,
        params.streamContext,
      ),
      contentPart: fileData,
      promptText: BRIDGE_PROMPTS.audio,
      abortSignal: params.abortSignal,
      chatMessageId,
      bridgeType,
      modality,
      creditFeature: `audio-vision-bridge:${audioVisionModel.id}`,
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
    streamContext: ToolExecutionContext;
  }): Promise<string | null> {
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
      return null;
    }

    const fileData = resolveFilePart(part, "video/mp4");
    if (!fileData) {
      logger.warn("[GapFill] Video FilePart has no data or url, skipping");
      return null;
    }

    return runBridgeCall({
      model: videoVisionModel,
      modelId: videoVisionModel.id,
      provider: ProviderFactory.getProviderForModel(
        videoVisionModel,
        logger,
        params.streamContext,
      ),
      contentPart: fileData,
      promptText: BRIDGE_PROMPTS.video,
      abortSignal: params.abortSignal,
      chatMessageId,
      bridgeType,
      modality,
      creditFeature: `video-vision-bridge:${videoVisionModel.id}`,
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
    streamContext: ToolExecutionContext;
  }): Promise<string | null> {
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
      return null;
    }

    const visionProvider = ProviderFactory.getProviderForModel(
      visionModel,
      logger,
      params.streamContext,
    );

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
      return null;
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

    try {
      const result = await aiGenerateText({
        model: visionProvider.chat(visionModel.providerModel) as LanguageModel,
        abortSignal,
        messages: [
          {
            role: "user" as const,
            content: [
              contentParts,
              { type: "text" as const, text: promptText },
            ],
          },
        ],
      });

      // Deduct credits for the vision bridge call using actual token usage
      const creditCost = calculateCreditCost(
        visionModel,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
      );
      if (creditCost > 0) {
        await dbWriter.deductAndEmitCredits({
          user,
          amount: creditCost,
          feature: `vision-bridge:${visionModel.id}`,
          type: "model",
          model: visionModel.id,
        });
      }

      const description = result.text.trim();

      // Emit GAP_FILL_COMPLETED + persist variant to DB
      if (chatMessageId && description) {
        const variant = {
          modality: "text" as Modality,
          content: description,
          modelId: visionModel.id,
          creditCost,
          createdAt: new Date().toISOString(),
          bridgeType: "vision" as const,
        };

        await dbWriter.emitGapFillCompleted({
          messageId: chatMessageId,
          bridgeType: "vision",
          modality,
          variant,
        });
      }

      return description || null;
    } catch (err) {
      logger.warn(
        `[GapFill] ${modality} vision bridge for tool result failed`,
        {
          error: err instanceof Error ? err.message : String(err),
          mediaUrl: mediaUrl.slice(0, 80),
        },
      );
      return null;
    }
  }
}
