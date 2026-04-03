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

import {
  ApiProvider,
  calculateCreditCost,
} from "@/app/api/[locale]/agent/models/models";
import { getVideoGenModelById } from "@/app/api/[locale]/agent/video-generation/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";

import { generateVideoWithModelsLab } from "../ai-stream/providers/modelslab-video";
import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import type {
  VideoGenerationPostRequestOutput,
  VideoGenerationPostResponseOutput,
} from "./definition";
import { VIDEO_DURATION_SECONDS } from "./enum";
import type { VideoGenerationT } from "./i18n";

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

    const creditCost = calculateCreditCost(videoModel, 0, 0);
    const durationSeconds =
      VIDEO_DURATION_SECONDS[data.duration] ??
      videoModel.defaultDurationSeconds;

    logger.info("[VideoGen] Starting video generation", {
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
    if (streamContext?.threadId) {
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

    logger.info("[VideoGen] Video generated successfully", {
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
