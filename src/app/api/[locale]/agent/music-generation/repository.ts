/**
 * Music Generation Repository
 * Handles music generation via multiple AI providers
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import {
  ApiProvider,
  calculateCreditCost,
} from "@/app/api/[locale]/agent/models/models";
import { getMusicGenModelById } from "@/app/api/[locale]/agent/music-generation/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";

import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import type {
  MusicGenerationPostRequestOutput,
  MusicGenerationPostResponseOutput,
} from "./definition";
import { MUSIC_DURATION_SECONDS } from "./enum";
import type { MusicGenerationT } from "./i18n";
import { generateMusicWithModelsLab } from "./providers/modelslab";
import { generateMusicWithReplicate } from "./providers/replicate";

interface MediaGenStreamContext {
  threadId?: string | undefined;
}

export class MusicGenerationRepository {
  /**
   * Generate music from a text prompt
   */
  static async generateMusic(
    data: MusicGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: MusicGenerationT,
    streamContext?: MediaGenStreamContext,
  ): Promise<ResponseType<MusicGenerationPostResponseOutput>> {
    // model is resolved via fieldDefaults in route.ts (from favorites/skill config)
    if (!data.model) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const audioModel = getMusicGenModelById(data.model);

    if (!audioModel) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const creditCost = calculateCreditCost(audioModel, 0, 0);
    const requestedDuration =
      MUSIC_DURATION_SECONDS[data.duration] ??
      audioModel.defaultDurationSeconds;

    // Clamp to model's minimum duration first
    const clampedDuration = Math.max(
      requestedDuration,
      audioModel.minDurationSeconds ?? 0,
    );

    // If model has a specific list of allowed durations, snap to the closest supported one.
    // supportedDurations may hold enum keys (e.g. "post.duration.long") or seconds as strings.
    let durationSeconds = clampedDuration;
    if (
      audioModel.supportedDurations &&
      audioModel.supportedDurations.length > 0 &&
      !audioModel.supportedDurations.includes(data.duration) &&
      !audioModel.supportedDurations.includes(String(clampedDuration))
    ) {
      // Map each supported entry to seconds (resolve enum keys, fall back to numeric parse)
      const supportedSeconds = audioModel.supportedDurations.map(
        (d) => MUSIC_DURATION_SECONDS[d] ?? Number(d),
      );
      const nearest = supportedSeconds.reduce((prev, curr) =>
        Math.abs(curr - clampedDuration) < Math.abs(prev - clampedDuration)
          ? curr
          : prev,
      );
      durationSeconds = nearest;
    }

    logger.debug("[MusicGen] Starting music generation", {
      model: data.model,
      provider: audioModel.apiProvider,
      creditCost,
      durationSeconds,
      promptLength: data.prompt.length,
    });

    const balanceCheck = await checkMediaBalance(
      user,
      creditCost,
      locale,
      logger,
    );
    if (!balanceCheck.success) {
      return balanceCheck;
    }
    const { tCredits } = balanceCheck.data;

    let generationResult: ResponseType<{ audioUrl: string }>;

    switch (audioModel.apiProvider) {
      case ApiProvider.REPLICATE:
        generationResult = await generateMusicWithReplicate({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          logger,
          locale,
        });
        break;

      case ApiProvider.MODELSLAB:
        generationResult = await generateMusicWithModelsLab({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          logger,
          locale,
        });
        break;

      default:
        return fail({
          message: t("post.errors.notConfigured", {
            label: audioModel.apiProvider,
            envKey: "N/A",
            url: "https://unbottled.ai",
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
    }

    if (!generationResult.success) {
      return fail({
        message: t("post.errors.generationFailed", {
          error: generationResult.message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    let { audioUrl } = generationResult.data;

    // Upload to our storage so the URL is persistent and access-controlled
    const scThreadId = streamContext?.threadId;
    if (scThreadId) {
      try {
        const storage = getStorageAdapter();
        const arrayBuf = await fetch(audioUrl).then((r) => r.arrayBuffer());
        const audioBuffer = Buffer.from(new Uint8Array(arrayBuf));
        const uploadResult = await storage.uploadFile(audioBuffer, {
          filename: `generated-audio-${Date.now()}.mp3`,
          mimeType: "audio/mpeg",
          threadId: scThreadId,
          userId: user.id,
        });
        audioUrl = uploadResult.url;
      } catch (uploadErr) {
        logger.error(
          "[MusicGen] Failed to upload to storage, using provider URL",
          {
            error:
              uploadErr instanceof Error
                ? uploadErr.message
                : String(uploadErr),
          },
        );
      }
    }

    const deductResult = await deductMediaCredits(
      user,
      creditCost,
      t("post.title"),
      locale,
      logger,
      tCredits,
    );
    if (!deductResult.success) {
      return deductResult;
    }

    logger.debug("[MusicGen] Music generated successfully", {
      model: data.model,
      creditCost,
      durationSeconds,
    });

    return success({
      audioUrl,
      creditCost,
      durationSeconds,
    });
  }
}
