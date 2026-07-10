/**
 * Video Generation Repository
 * Handles video generation via multiple AI providers
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { createFixtureFetch } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage/index";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { STANDARD_MARKUP_PERCENTAGE } from "@/app/api/[locale]/products/constants";

import type { ToolExecutionContext } from "../chat/config";
import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import {
  type VideoGenerationPostRequestInput,
  type VideoGenerationPostRequestOutput,
  type VideoGenerationPostResponseOutput,
} from "./definition";
import type { VideoGenerationT } from "./i18n";
import {
  filterVideoGenModels,
  getVideoGenModelById,
  type VideoGenModelSelection,
} from "./models";
import { generateVideoWithModelsLab } from "./providers/modelslab";
import { generateVideoWithOpenRouter } from "./providers/openrouter";
import { generateVideoWithUnbottled } from "./providers/unbottled";

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
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<VideoGenerationPostResponseOutput>> {
    // model is resolved via fieldDefaults in route.ts (from favorites/skill config)
    if (!data.model) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    let videoModel = getVideoGenModelById(data.model);

    if (!videoModel) {
      return fail({
        message: t("post.errors.not_found.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Modality-aware resolution: image-to-video needs an image-capable model.
    // The model usually comes from the favorite's videoGenModelSelection —
    // chosen for text-to-video — and the model field is hidden from the AI
    // (hiddenForPlatforms), so nobody upstream can correct a t2v default for
    // an i2v request. Resolve to the cheapest image-capable model instead of
    // letting the provider fail with a misleading init_image error.
    if (data.inputMediaUrl && !videoModel.inputs.includes("image")) {
      const { getVideoGenModelsByInputModality } = await import("./models");
      const imageCapable = getVideoGenModelsByInputModality("image");
      const substitute = imageCapable.toSorted(
        (a, b) =>
          (a.creditCostPerSecond ?? Infinity) -
          (b.creditCostPerSecond ?? Infinity),
      )[0];
      if (substitute) {
        logger.debug(
          "[VideoGen] Resolved image-capable model for image-to-video request",
          { requested: videoModel.id, resolved: substitute.id },
        );
        videoModel = substitute;
      }
    }

    // If this model requires image input, validate it's provided
    if (
      videoModel.inputs.includes("image") &&
      !videoModel.inputs.includes("text") &&
      !data.inputMediaUrl
    ) {
      return fail({
        message: t("post.errors.inputMediaRequired"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
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

    // One fixture-aware fetch per generation - carries the repeat counter for
    // poll loops, so it must not be recreated per call.
    const fetchImpl = createFixtureFetch(streamContext, logger);

    let generationResult: ResponseType<{
      videoUrl: string;
      creditCost?: number;
      durationSeconds?: number;
    }>;
    switch (videoModel.apiProvider) {
      case ApiProvider.MODELSLAB:
        generationResult = await generateVideoWithModelsLab({
          providerModel: videoModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          aspectRatio: data.aspectRatio,
          resolution: data.resolution,
          inputImageUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.UNBOTTLED:
        generationResult = await generateVideoWithUnbottled({
          input: data,
          user,
          locale,
          logger,
          featureLabel: t("post.title"),
          streamContext,
        });
        break;

      case ApiProvider.OPENROUTER:
        generationResult = await generateVideoWithOpenRouter({
          providerModel: videoModel.providerModel,
          prompt: data.prompt,
          durationSeconds: durationSeconds,
          aspectRatio: data.aspectRatio,
          resolution: data.resolution,
          inputImageUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      default:
        return fail({
          message: t("post.errors.notConfigured", {
            label: videoModel.apiProvider,
            envKey: "N/A",
            url: "",
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
    const finalDurationSeconds =
      generationResult.data.durationSeconds ?? durationSeconds;
    const finalCreditCost = generationResult.data.creditCost ?? creditCost;

    // Upload to our storage so the URL is persistent and access-controlled
    const scThreadId = streamContext.threadId;
    if (scThreadId) {
      try {
        const storage = getStorageAdapter();
        const arrayBuf = await fetchImpl(videoUrl).then((r) => r.arrayBuffer());
        const videoBuffer = Buffer.from(new Uint8Array(arrayBuf));
        const ext = videoUrl.includes("webm") ? "webm" : "mp4";
        const uploadResult = await storage.uploadFile(videoBuffer, {
          filename: `generated-video-${Date.now()}.${ext}`,
          mimeType: `video/${ext}`,
          threadId: scThreadId,
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

    if (videoModel.apiProvider !== ApiProvider.UNBOTTLED) {
      const deductResult = await deductMediaCredits(
        user,
        finalCreditCost,
        t("post.title"),
        locale,
        logger,
        tCredits,
      );
      if (!deductResult.success) {
        return deductResult;
      }
    }

    logger.debug("[VideoGen] Video generated successfully", {
      model: data.model,
      creditCost: finalCreditCost,
      durationSeconds: finalDurationSeconds,
    });

    const toolMessageId = streamContext.currentToolMessageId;
    if (toolMessageId && !user.isPublic) {
      const month = new Date().toISOString().slice(0, 7);
      const slug = `${data.prompt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60)}-${toolMessageId}`;
      void Promise.all([
        import("@/app/api/[locale]/agent/cortex/mounts/gens"),
        import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual"),
      ])
        .then(([{ readGenPath }, { syncVirtualNodeToEmbedding }]) => {
          const path = `/gens/video/${month}/${slug}.md`;
          return readGenPath(user.id, path)
            .then(
              (result) =>
                result &&
                syncVirtualNodeToEmbedding(
                  user.id,
                  path,
                  result.content,
                  streamContext,
                ),
            )
            .catch(() => undefined);
        })
        .catch(() => undefined);
    }

    return success({
      videoUrl,
      creditCost: finalCreditCost,
      durationSeconds: finalDurationSeconds,
    });
  }
}
