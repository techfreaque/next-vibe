/**
 * Video Generation Repository
 * Handles video generation via multiple AI providers
 */

import "server-only";

import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";

import { STANDARD_MARKUP_PERCENTAGE } from "@/products/constants";

import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "../chat/storage/index";
import { ApiProvider, roundMediaCost } from "../models/models";
import {
  checkMediaBalance,
  deductMediaCredits,
  keepsExplicitMediaModel,
  resolveMediaReference,
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
  resolveVideoClipSeconds,
  resolveVideoGenRouteForImageInput,
  videoGenModelOptions,
  type VideoGenModelSelection,
} from "./models";
import { generateVideoWithModelsLab } from "./providers/modelslab";
import { generateVideoWithOpenRouter } from "./providers/openrouter";
import { generateVideoWithUnbottled } from "./providers/unbottled";

function parseAspectRatio(r: string): number {
  const [w, h] = r.split(":").map(Number);
  return (w ?? 1) / (h ?? 1);
}

/**
 * The single image URL that seeds providers taking one input image
 * (modelslab). Prefer an explicit first frame, else the first reference
 * (role omitted or "reference"). Ignores role "last".
 */
function resolveSeedImageUrl(
  frameReferences: VideoGenerationPostRequestOutput["frameReferences"],
): string | undefined {
  const first = frameReferences?.find((f) => f.role === "first");
  if (first) {
    return first.url;
  }
  return frameReferences?.find((f) => f.role !== "last")?.url;
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
    toolExecutionContext: ToolExecutionContext,
    platform: Platform,
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

    // Modality-aware resolution: image-to-video needs an image-capable route.
    // The model usually comes from the favorite's videoGenModelSelection —
    // chosen for text-to-video — and the model field is hidden from the AI
    // (hiddenForPlatforms), so nobody upstream can correct a t2v default for
    // an i2v request. Move to an image-capable route (same model first), or
    // reject: a text-only route would drop the image or fail upstream with a
    // misleading init_image error.
    const seedImageUrl = resolveSeedImageUrl(data.frameReferences);
    const hasFrameImage = (data.frameReferences?.length ?? 0) > 0;
    if (hasFrameImage) {
      const imageRoute = resolveVideoGenRouteForImageInput(videoModel);
      if (!imageRoute) {
        return fail({
          message: t("post.errors.noImageCapableModel"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      if (imageRoute !== videoModel) {
        logger.debug(
          "[VideoGen] Resolved image-capable route for image-to-video request",
          {
            requested: `${videoModel.id}/${videoModel.apiProvider}`,
            resolved: `${imageRoute.id}/${imageRoute.apiProvider}`,
          },
        );
        videoModel = imageRoute;
      }
    }

    // If this model requires image input, validate it's provided
    if (
      videoModel.inputs.includes("image") &&
      !videoModel.inputs.includes("text") &&
      !seedImageUrl
    ) {
      return fail({
        message: t("post.errors.inputMediaRequired"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // duration is now raw seconds from the widget
    const rawDuration = data.duration ?? videoModel.defaultDurationSeconds;

    // Clamp to the route's range, then snap to its listed durations.
    const durationSeconds = resolveVideoClipSeconds(videoModel, rawDuration);

    // Snap aspect ratio to nearest supported
    let aspectRatio = data.aspectRatio;
    if (
      aspectRatio &&
      videoModel.supportedAspectRatios &&
      videoModel.supportedAspectRatios.length > 0 &&
      !videoModel.supportedAspectRatios.includes(aspectRatio)
    ) {
      const target = parseAspectRatio(aspectRatio);
      const nearest = videoModel.supportedAspectRatios.reduce((prev, curr) =>
        Math.abs(parseAspectRatio(curr) - target) <
        Math.abs(parseAspectRatio(prev) - target)
          ? curr
          : prev,
      );
      aspectRatio = nearest as typeof aspectRatio;
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

    // Rounded UP to 0.1 credit (never under-bills).
    const creditCost = roundMediaCost(
      perSecondCost * durationSeconds * (1 + STANDARD_MARKUP_PERCENTAGE),
    );

    logger.debug("[VideoGen] Starting video generation", {
      model: data.model,
      provider: videoModel.apiProvider,
      creditCost,
      durationSeconds,
      promptLength: data.prompt.length,
    });

    // Fail-closed: a paid model with a resolved cost of 0 must never generate for free.
    if (creditCost <= 0) {
      return fail({
        message: t("post.errors.modelUnavailable"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

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
    const fetchImpl = createFixtureFetch(toolExecutionContext, logger);

    // Own storage URLs sit behind the auth-gated files route: read them here
    // with the caller's permissions and hand providers a data URI (they have
    // no session, so a private-thread URL 404s for them). See
    // resolveMediaReference.
    let resolvedFrameReferences: typeof data.frameReferences;
    if (data.frameReferences) {
      resolvedFrameReferences = [];
      for (const frame of data.frameReferences) {
        const url = await resolveMediaReference(
          frame.url,
          user,
          logger,
          locale,
        );
        if (!url) {
          return fail({
            message: t("post.errors.referenceUnavailable"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        resolvedFrameReferences.push({ ...frame, url });
      }
    }
    let resolvedSeedImageUrl: string | undefined;
    if (seedImageUrl) {
      const url = await resolveMediaReference(
        seedImageUrl,
        user,
        logger,
        locale,
      );
      if (!url) {
        return fail({
          message: t("post.errors.referenceUnavailable"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      resolvedSeedImageUrl = url;
    }

    let generationResult: ResponseType<{
      videoUrl: string;
      creditCost?: number;
      durationSeconds?: number;
      /** Headers required to download videoUrl (e.g. OpenRouter Bearer auth). */
      downloadHeaders?: Record<string, string>;
    }>;
    switch (videoModel.apiProvider) {
      case ApiProvider.MODELSLAB:
        generationResult = await generateVideoWithModelsLab({
          providerModel: videoModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          aspectRatio: aspectRatio,
          resolution: data.resolution,
          inputImageUrl: resolvedSeedImageUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.UNBOTTLED:
        generationResult = await generateVideoWithUnbottled({
          // The remote instance cannot read our storage: send the resolved
          // references (data URIs for own files), never our portable paths.
          input: resolvedFrameReferences
            ? { ...data, frameReferences: resolvedFrameReferences }
            : data,
          user,
          locale,
          logger,
          featureLabel: t("post.title"),
          toolExecutionContext,
          platform,
        });
        break;

      case ApiProvider.OPENROUTER:
        generationResult = await generateVideoWithOpenRouter({
          providerModel: videoModel.providerModel,
          prompt: data.prompt,
          durationSeconds: durationSeconds,
          aspectRatio: aspectRatio,
          resolution: data.resolution,
          frameReferences: resolvedFrameReferences,
          negativePrompt: data.negativePrompt,

          generateAudio: videoModel.generateAudio ?? false,
          supportedFrameImages: videoModel.supportedFrameImages,
          allowedPassthroughParameters: videoModel.allowedPassthroughParameters,
          logger,
          locale,
          fetchImpl,
        });
        break;

      default:
        return fail({
          message: t("post.errors.providerUnsupported", {
            label: videoModel.apiProvider,
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
    // Provider-reported cost (OpenRouter usage.cost) is raw upstream USD - apply
    // the standard markup. A 0/missing report falls back to the priced estimate.
    const reportedCost = generationResult.data.creditCost;
    const finalCreditCost =
      reportedCost !== undefined && reportedCost > 0
        ? roundMediaCost(reportedCost * (1 + STANDARD_MARKUP_PERCENTAGE))
        : creditCost;

    // Upload to our storage so the URL is persistent and access-controlled.
    // Incognito threads have no server-side thread row — the file is owned by
    // the caller's leadId and served only to that lead (browser).
    // Standalone calls (tool page, no thread) MUST be re-hosted too: provider
    // URLs like OpenRouter's are authed, so a raw one is unplayable in the
    // browser. They get a fresh thread-less namespace: owned by the account
    // when logged in (never swept as guest media), by the leadId for guests.
    const scThreadId = toolExecutionContext.threadId ?? crypto.randomUUID();
    const isLeadOwned = toolExecutionContext.threadId
      ? toolExecutionContext.rootFolderId === DefaultFolderId.INCOGNITO
      : user.isPublic;
    try {
      const storage = getStorageAdapter();
      // Some providers (OpenRouter) serve the finished video from an authed
      // endpoint — download WITH the provider's headers, else it 401s and we
      // store a tiny error JSON as a broken .mp4.
      const downloadRes = await fetchImpl(videoUrl, {
        headers: generationResult.data.downloadHeaders,
      });
      if (!downloadRes.ok) {
        // oxlint-disable-next-line restricted/restricted-syntax -- intentional throw to fall through to catch
        throw new Error(
          `Video download failed: HTTP ${String(downloadRes.status)}`,
        );
      }
      const arrayBuf = await downloadRes.arrayBuffer();
      const videoBuffer = Buffer.from(new Uint8Array(arrayBuf));
      const ext = videoUrl.includes("webm") ? "webm" : "mp4";
      const uploadResult = await storage.uploadFile(videoBuffer, {
        filename: `generated-video-${Date.now()}.${ext}`,
        mimeType: `video/${ext}`,
        threadId: scThreadId,
        userId: isLeadOwned ? undefined : user.id,
        leadId: isLeadOwned ? user.leadId : undefined,
      });
      videoUrl = uploadResult.url;
    } catch (uploadErr) {
      logger.error(
        "[VideoGen] Failed to upload to storage, using provider URL",
        {
          error:
            uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
        },
      );
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

    const toolMessageId = toolExecutionContext.currentToolMessageId;
    if (toolMessageId && !user.isPublic) {
      const month = new Date().toISOString().slice(0, 7);
      const slug = `${data.prompt
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "-")
        .replaceAll(/^-|-$/g, "")
        .slice(0, 60)}-${toolMessageId}`;
      void Promise.all([
        import("../cortex/mounts/gens"),
        import("../cortex/embeddings/sync-virtual"),
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
                  toolExecutionContext,
                  logger,
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

  /**
   * A human's explicit model pick wins; AI/MCP callers (or an empty pick) get
   * the favorite/skill model.
   */
  static async getRequestDefaults(
    ctx: {
      user: JwtPayloadType;
      toolExecutionContext: ToolExecutionContext;
      platform: Platform;
    },
    requestedModel: string | undefined,
  ): Promise<Partial<VideoGenerationPostRequestInput>> {
    if (
      keepsExplicitMediaModel(ctx.platform, requestedModel, (model) =>
        videoGenModelOptions.some((option) => option.id === model),
      )
    ) {
      return {};
    }
    const { getEnvAvailability } = await import("../env-availability");
    const availability = await getEnvAvailability();
    const userId =
      ctx.user && !ctx.user.isPublic && "id" in ctx.user
        ? ctx.user.id
        : undefined;
    // The stream already resolved this (client favorite config -> favorite
    // -> skill -> default) in setup and advertised it in the system prompt.
    // Re-querying the favorite from the DB diverged whenever the client's
    // favorite was not a saved row: a different model generated than the
    // one the user picked. Only stream-less callers re-run the cascade.
    let sel: VideoGenModelSelection | undefined =
      ctx.toolExecutionContext.resolvedMediaSelections?.videoGenModelSelection;
    if (!sel && userId) {
      const { resolveSkillFavoriteContext } =
        await import("../skills/resolver");
      const { ModalityResolver } =
        await import("../ai-stream/repository/core/modality-resolver");
      const { favorite, skill } = await resolveSkillFavoriteContext({
        favoriteId: ctx.toolExecutionContext.favoriteId ?? null,
        skillId: ctx.toolExecutionContext.skillId ?? null,
        userId,
      });
      sel = ModalityResolver.resolveVideoGenSelection({ favorite, skill });
    }
    const model = filterVideoGenModels(sel, ctx.user, availability)[0]?.id;
    if (!model) {
      return {};
    }
    return { model };
  }
}
