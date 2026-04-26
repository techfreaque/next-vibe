/**
 * Video Generation Repository
 * Handles video generation via multiple AI providers
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { getVideoGenModelById } from "@/app/api/[locale]/agent/video-generation/models";
import { STANDARD_MARKUP_PERCENTAGE } from "@/app/api/[locale]/products/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";

import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import type {
  VideoGenerationPostRequestOutput,
  VideoGenerationPostResponseOutput,
} from "./definition";
import type { VideoGenerationT } from "./i18n";
import { generateVideoWithModelsLab } from "./providers/modelslab";

interface MediaGenStreamContext {
  threadId?: string | undefined;
}

export class VideoGenerationRepository {
  /**
   * Generate a video from a text prompt
   */
  static async generateVideo(
    data: VideoGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: VideoGenerationT,
    streamContext: MediaGenStreamContext,
  ): Promise<ResponseType<VideoGenerationPostResponseOutput>> {
    // model is resolved via serverDefault on the field definition (from ToolExecutionContext.videoGenModelId)
    const videoModel = getVideoGenModelById(data.model);

    if (!videoModel) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // duration is now raw seconds from the widget
    const rawDuration = data.duration ?? videoModel.defaultDurationSeconds;

    // Clamp to model's supported duration range first
    const clampedDuration = Math.min(
      Math.max(rawDuration, videoModel.minDurationSeconds ?? 0),
      videoModel.maxDurationSeconds ?? Infinity,
    );

    // If model has a specific list of allowed durations, snap to the closest one
    let durationSeconds = clampedDuration;
    if (
      videoModel.supportedDurations &&
      videoModel.supportedDurations.length > 0
    ) {
      if (!videoModel.supportedDurations.includes(String(clampedDuration))) {
        // Snap to the nearest supported duration
        const supported = videoModel.supportedDurations.map(Number);
        const nearest = supported.reduce((prev, curr) =>
          Math.abs(curr - clampedDuration) < Math.abs(prev - clampedDuration)
            ? curr
            : prev,
        );
        durationSeconds = nearest;
      }
    }

    // Validate aspect ratio
    if (
      data.aspectRatio &&
      videoModel.supportedAspectRatios &&
      videoModel.supportedAspectRatios.length > 0 &&
      !videoModel.supportedAspectRatios.includes(data.aspectRatio)
    ) {
      return fail({
        message: t("post.errors.unsupportedAspectRatio", {
          model: data.model,
          aspectRatio: data.aspectRatio,
          supported: videoModel.supportedAspectRatios.join(", "),
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // Validate resolution
    if (
      data.resolution &&
      videoModel.supportedResolutions &&
      videoModel.supportedResolutions.length > 0 &&
      !videoModel.supportedResolutions.includes(data.resolution)
    ) {
      return fail({
        message: t("post.errors.unsupportedResolution", {
          model: data.model,
          resolution: data.resolution,
          supported: videoModel.supportedResolutions.join(", "),
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // Calculate credit cost - use pricingByResolution override when resolution is selected
    const perSecondCost =
      (data.resolution
        ? videoModel.pricingByResolution?.[data.resolution]
        : undefined) ?? videoModel.creditCostPerSecond;

    const rawCost =
      perSecondCost * durationSeconds * (1 + STANDARD_MARKUP_PERCENTAGE);
    const rounded = Math.round(rawCost * 10) / 10;
    const creditCost = rounded % 1 === 0 ? Math.round(rounded) : rounded;

    logger.debug("[VideoGen] Starting video generation", {
      model: data.model,
      provider: videoModel.apiProvider,
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

    let generationResult: ResponseType<{ videoUrl: string }>;

    switch (videoModel.apiProvider) {
      case ApiProvider.MODELSLAB:
        generationResult = await generateVideoWithModelsLab({
          providerModel: videoModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          aspectRatio: data.aspectRatio,
          resolution: data.resolution,
          logger,
          locale,
        });
        break;

      default:
        return fail({
          message: t("post.errors.notConfigured", {
            label: videoModel.apiProvider,
            envKey: "N/A",
            url: "N/A",
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

    let { videoUrl } = generationResult.data;

    // Upload to our storage so the URL is persistent and access-controlled
    if (streamContext.threadId) {
      try {
        const storage = getStorageAdapter();
        const arrayBuf = await fetch(videoUrl).then((r) => r.arrayBuffer());
        const videoBuffer = Buffer.from(new Uint8Array(arrayBuf));
        const ext = videoUrl.includes("webm") ? "webm" : "mp4";
        const uploadResult = await storage.uploadFile(videoBuffer, {
          filename: `generated-video-${Date.now()}.${ext}`,
          mimeType: `video/${ext}`,
          threadId: streamContext.threadId,
          userId: user.id,
        });
        videoUrl = uploadResult.url;
      } catch (uploadErr) {
        logger.error(
          "[VideoGen] Failed to upload to storage, using provider URL",
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
      "video-generation",
      locale,
      logger,
      tCredits,
    );
    if (!deductResult.success) {
      return deductResult;
    }

    logger.debug("[VideoGen] Video generated successfully", {
      model: data.model,
      creditCost,
      durationSeconds,
    });

    return success({
      videoUrl,
      creditCost,
      durationSeconds,
    });
  }
}
