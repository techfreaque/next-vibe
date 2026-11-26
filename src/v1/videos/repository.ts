/**
 * POST /v1/videos - validate, price and queue a video job; the generation
 * runs in the background through the video generation tool (provider
 * routing, storage, billing at the provider's real cost x markup where
 * reported, listed price otherwise; nothing is charged for a failed job).
 */

import "server-only";

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { checkMediaBalance } from "next-vibe/agent/shared/media-generation";
import { scopedTranslation as videoScopedTranslation } from "next-vibe/agent/video-generation/i18n";
import {
  resolveVideoClipSeconds,
  resolveVideoGenRouteForImageInput,
  videoClipCredits,
} from "next-vibe/agent/video-generation/models";
import { VideoGenerationRepository } from "next-vibe/agent/video-generation/repository";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  type StreamingResponse,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";

import type { V1T } from "../i18n";
import { V1_MAX_IMAGE_BYTES } from "../shared/constants";
import { v1Error } from "../shared/errors";
import { gateApiKeyRequest } from "../shared/gate";
import {
  fileToDataUri,
  mediaConsentError,
  mediaToolContext,
  v1ErrorFromToolFailure,
} from "../shared/media";
import {
  createMediaJob,
  mediaJobObject,
  newMediaJobId,
  startMediaJob,
  type V1MediaJobOutput,
} from "../shared/media-jobs";
import {
  type V1MediaJobParams,
  V1MediaJobsRepository,
} from "../shared/media-jobs-repository";
import { resolveV1VideoModel } from "../shared/media-models";
import { openAiErrorResponse, openAiJson } from "../shared/openai";
import {
  V1_VIDEO_ASPECT_RATIOS,
  type V1VideosPostRequestOutput,
} from "./definition";

type VideoAspectRatio = (typeof V1_VIDEO_ASPECT_RATIOS)[number];

function ratioOf(value: string): number {
  const [w, h] = value.split(/[:x]/).map(Number);
  return (w ?? 1) / (h ?? 1);
}

/** "1280x720" -> nearest listed ratio + the resolution bucket ("720p"). */
export function mapVideoSize(size: string): {
  aspectRatio: VideoAspectRatio;
  resolution: string;
} {
  const ratio = ratioOf(size);
  let aspectRatio: VideoAspectRatio = "16:9";
  let best = Number.POSITIVE_INFINITY;
  for (const candidate of V1_VIDEO_ASPECT_RATIOS) {
    const distance = Math.abs(Math.log(ratioOf(candidate)) - Math.log(ratio));
    if (distance < best) {
      best = distance;
      aspectRatio = candidate;
    }
  }
  const [w, h] = size.split("x").map(Number);
  return {
    aspectRatio,
    resolution: `${String(Math.min(w ?? 0, h ?? 0))}p`,
  };
}

export class V1VideosRepository {
  static async create(params: {
    data: V1VideosPostRequestOutput;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    request: Request | undefined;
    t: V1T;
    toolExecutionContext: ToolExecutionContext;
    platform: Platform;
    /**
     * Injection point for tests (no provider call); production runs the
     * generation tool.
     */
    generate?: () => Promise<ResponseType<V1MediaJobOutput>>;
  }): Promise<StreamingResponse> {
    const { data, user, locale, logger, request, t, platform } = params;
    const gate = await gateApiKeyRequest(user, request, locale, t, logger);
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    const model = resolveV1VideoModel(
      data.model,
      gate.user,
      await getEnvAvailability(),
    );
    if (!model) {
      return openAiErrorResponse(
        v1Error(
          404,
          t("openai.modelNotFound", { model: data.model }),
          "not_found_error",
          "model_not_found",
          "model",
        ),
      );
    }

    let reference: string | undefined;
    if (data.input_reference) {
      if (data.input_reference.size > V1_MAX_IMAGE_BYTES) {
        return openAiErrorResponse(
          v1Error(
            400,
            t("media.errors.imageTooLarge", {
              max: V1_MAX_IMAGE_BYTES / 1024 / 1024,
            }),
            "invalid_request_error",
            "file_too_large",
            "input_reference",
          ),
        );
      }
      reference = await fileToDataUri(data.input_reference);
    } else if (data.image_url) {
      if (
        !/^(https?:\/\/|data:image\/[a-z0-9.+-]+;base64,)/i.test(data.image_url)
      ) {
        return openAiErrorResponse(
          v1Error(
            400,
            t("openai.badImageUrl"),
            "invalid_request_error",
            "invalid_value",
            "image_url",
          ),
        );
      }
      reference = data.image_url;
    }
    // The route the tool will run: an image-capable one when a reference
    // image is sent. The API never swaps the model a client named.
    const route = reference ? resolveVideoGenRouteForImageInput(model) : model;
    if (!route || route.id !== model.id) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.modelNoImageInput", { model: model.id }),
          "invalid_request_error",
          "invalid_value",
          "model",
        ),
      );
    }
    if (
      !reference &&
      route.inputs.includes("image") &&
      !route.inputs.includes("text")
    ) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.modelNeedsImage", { model: model.id }),
          "invalid_request_error",
          "missing_required_parameter",
          "input_reference",
        ),
      );
    }
    const consent = await mediaConsentError({
      model: route,
      user: gate.user,
      locale,
      logger,
    });
    if (consent) {
      return openAiErrorResponse(consent);
    }

    const fromSize = data.size ? mapVideoSize(data.size) : undefined;
    const aspectRatio = data.aspect_ratio ?? fromSize?.aspectRatio;
    const supportedResolutions = route.supportedResolutions ?? [];
    if (
      data.resolution &&
      supportedResolutions.length > 0 &&
      !supportedResolutions.includes(data.resolution)
    ) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.resolutionUnsupported", {
            model: model.id,
            supported: supportedResolutions.join(", "),
          }),
          "invalid_request_error",
          "invalid_value",
          "resolution",
        ),
      );
    }
    // A size only implies a resolution the model offers.
    const resolution =
      data.resolution ??
      (fromSize && supportedResolutions.includes(fromSize.resolution)
        ? fromSize.resolution
        : undefined);
    const seconds = resolveVideoClipSeconds(
      route,
      data.seconds ?? route.defaultDurationSeconds,
    );

    // Pre-flight on the listed price, so a short balance is a 402 now and
    // not a failed job later. The tool checks again and bills on success.
    const estimate = videoClipCredits(route, seconds, resolution);
    const balance = await checkMediaBalance(
      gate.user,
      estimate,
      locale,
      logger,
      model.id,
    );
    if (!balance.success) {
      return openAiErrorResponse(v1ErrorFromToolFailure(balance));
    }

    const job = await createMediaJob({
      id: newMediaJobId("video"),
      userId: gate.user.id,
      apiKeyId: gate.key.id,
      kind: "video",
      model: model.id,
      prompt: data.prompt,
      params: {
        seconds,
        size: data.size ?? null,
        aspectRatio: aspectRatio ?? null,
        resolution: resolution ?? null,
      },
    });
    if (!job) {
      return openAiErrorResponse(
        v1Error(500, t("media.errors.jobNotCreated"), "server_error", null),
      );
    }

    const { t: videoT } = videoScopedTranslation.scopedT(locale);
    // Background: no request signal (the job outlives the request).
    const toolContext = mediaToolContext(
      params.toolExecutionContext,
      undefined,
      crypto.randomUUID(),
    );
    startMediaJob(
      job,
      params.generate ??
        (async (): Promise<ResponseType<V1MediaJobOutput>> => {
          const result = await VideoGenerationRepository.generateVideo(
            {
              prompt: data.prompt,
              model: model.id,
              duration: seconds,
              aspectRatio,
              resolution,
              frameReferences: reference
                ? [{ url: reference, role: "first" }]
                : undefined,
              negativePrompt: data.negative_prompt,
            },
            gate.user,
            locale,
            logger,
            videoT,
            toolContext,
            platform,
          );
          if (!result.success) {
            return result;
          }
          return success({
            url: result.data.videoUrl,
            creditCost: result.data.creditCost,
            durationSeconds: result.data.durationSeconds,
          });
        }),
      logger,
    );
    return openAiJson(mediaJobObject(job, request));
  }

  /** GET /v1/videos/{id}: job status (see V1MediaJobsRepository). */
  static get(
    params: Omit<V1MediaJobParams, "kind">,
  ): Promise<StreamingResponse> {
    return V1MediaJobsRepository.get({ ...params, kind: "video" });
  }

  /** GET /v1/videos/{id}/content: the finished file. */
  static content(
    params: Omit<V1MediaJobParams, "kind">,
  ): Promise<StreamingResponse> {
    return V1MediaJobsRepository.content({ ...params, kind: "video" });
  }
}
