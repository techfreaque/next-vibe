/**
 * POST /v1/images/generations and /v1/images/edits - OpenAI image shapes over
 * the image generation tool. The tool repository does everything that costs
 * money (provider routing, credit check, storage, billing at the provider's
 * real cost x markup where reported, listed price otherwise); this layer maps
 * OpenAI parameters onto it and the result back.
 */

import "server-only";

import { createFixtureFetch } from "next-vibe/agent/ai-stream/testing/fetch-cache";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  IMAGE_ASPECT_RATIOS,
  type ImageAspectRatio,
  parseAspectRatio,
} from "next-vibe/agent/image-generation/aspect-ratio";
import type { ImageGenerationPostRequestOutput } from "next-vibe/agent/image-generation/definition";
import {
  ImageQuality,
  type ImageQualityValue,
  ImageSize,
  type ImageSizeValue,
} from "next-vibe/agent/image-generation/enum";
import { scopedTranslation as imageScopedTranslation } from "next-vibe/agent/image-generation/i18n";
import type { ImageGenModelOption } from "next-vibe/agent/image-generation/models";
import { ImageGenerationRepository } from "next-vibe/agent/image-generation/repository";
import { isModelOptionImageBased } from "next-vibe/agent/models/models";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
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
  readStoredMediaUrl,
  signedMediaUrl,
  unixSeconds,
  v1ErrorFromToolFailure,
} from "../shared/media";
import { resolveV1ImageModel } from "../shared/media-models";
import { openAiErrorResponse, openAiJson } from "../shared/openai";
import type { V1ImagesEditsPostRequestOutput } from "./edits/definition";
import type { V1ImagesGenerationsPostRequestOutput } from "./generations/definition";

interface ImageShape {
  size: typeof ImageSizeValue;
  aspectRatio: ImageAspectRatio | undefined;
  /** the client named a size or ratio (an unsupported one is then an error) */
  explicit: boolean;
}

function nearestAspectRatio(ratio: number): ImageAspectRatio {
  let best: ImageAspectRatio = "1:1";
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const candidate of IMAGE_ASPECT_RATIOS) {
    const value = parseAspectRatio(candidate) ?? 1;
    const distance = Math.abs(Math.log(value) - Math.log(ratio));
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
}

function sizeForRatio(ratio: number): typeof ImageSizeValue {
  if (Math.abs(Math.log(ratio)) < 0.05) {
    return ImageSize.SQUARE_1024;
  }
  return ratio > 1 ? ImageSize.LANDSCAPE_1792 : ImageSize.PORTRAIT_1792;
}

/**
 * OpenAI `size` ("1536x1024", "auto") and our `aspect_ratio` extension as the
 * tool's size bucket + ratio. Null = `size` is not WIDTHxHEIGHT or auto.
 */
export function mapImageShape(
  size: string | undefined,
  aspectRatio: ImageAspectRatio | undefined,
): ImageShape | null {
  if (aspectRatio) {
    return {
      size: sizeForRatio(parseAspectRatio(aspectRatio) ?? 1),
      aspectRatio,
      explicit: true,
    };
  }
  const trimmed = size?.trim().toLowerCase();
  if (!trimmed || trimmed === "auto") {
    return {
      size: ImageSize.SQUARE_1024,
      aspectRatio: undefined,
      explicit: false,
    };
  }
  const match = /^(\d{2,5})x(\d{2,5})$/.exec(trimmed);
  if (!match?.[1] || !match[2]) {
    return null;
  }
  const ratio = Number(match[1]) / Number(match[2]);
  if (!(ratio > 0) || !Number.isFinite(ratio)) {
    return null;
  }
  return {
    size: sizeForRatio(ratio),
    aspectRatio: nearestAspectRatio(ratio),
    explicit: true,
  };
}

/** OpenAI quality words (standard, hd, low, medium, high, auto) as ours. */
export function mapImageQuality(
  quality: string | undefined,
): typeof ImageQualityValue {
  const value = quality?.trim().toLowerCase();
  return value === "hd" || value === "high"
    ? ImageQuality.HD
    : ImageQuality.STANDARD;
}

function isImageSize(value: string): value is typeof ImageSizeValue {
  return Object.values(ImageSize).some((size) => size === value);
}

function isImageQuality(value: string): value is typeof ImageQualityValue {
  return Object.values(ImageQuality).some((quality) => quality === value);
}

/**
 * Tool request for one image, fitted to what the model supports. A size
 * bucket the model lacks becomes the square default plus the ratio (the tool
 * then picks the model's closest size); a quality it lacks becomes its own
 * first one. Token-based (multimodal chat) image models take both as hints.
 */
function toolRequest(
  model: ImageGenModelOption,
  prompt: string,
  shape: ImageShape,
  quality: string | undefined,
  inputMediaUrl: string | undefined,
): ImageGenerationPostRequestOutput {
  let size = shape.size;
  let mappedQuality = mapImageQuality(quality);
  if (isModelOptionImageBased(model)) {
    const sizes = model.supportedSizes ?? [];
    if (sizes.length > 0 && !sizes.includes(size)) {
      const first = sizes.find(isImageSize);
      size = shape.aspectRatio || !first ? ImageSize.SQUARE_1024 : first;
    }
    const qualities = model.supportedQualities ?? [];
    if (qualities.length > 0 && !qualities.includes(mappedQuality)) {
      mappedQuality = qualities.find(isImageQuality) ?? mappedQuality;
    }
  }
  return {
    prompt,
    model: model.id,
    size,
    quality: mappedQuality,
    aspectRatio: shape.aspectRatio,
    inputMediaUrl,
  };
}

interface RunParams {
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  request: Request | undefined;
  t: V1T;
  toolExecutionContext: ToolExecutionContext;
  platform: Platform;
}

interface ImageCall {
  model: string;
  prompt: string;
  n: number | undefined;
  size: string | undefined;
  aspectRatio: ImageAspectRatio | undefined;
  quality: string | undefined;
  responseFormat: "url" | "b64_json" | undefined;
  /** edits: the reference image as a data: URI or http(s) URL */
  inputMediaUrl: string | undefined;
}

export class V1ImagesRepository {
  static generate(
    params: RunParams & { data: V1ImagesGenerationsPostRequestOutput },
  ): Promise<StreamingResponse> {
    const { data } = params;
    return V1ImagesRepository.run(params, {
      model: data.model,
      prompt: data.prompt,
      n: data.n,
      size: data.size,
      aspectRatio: data.aspect_ratio,
      quality: data.quality,
      responseFormat: data.response_format,
      inputMediaUrl: undefined,
    });
  }

  static async edit(
    params: RunParams & { data: V1ImagesEditsPostRequestOutput },
  ): Promise<StreamingResponse> {
    const { data, t } = params;
    if (data.mask) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.maskUnsupported"),
          "invalid_request_error",
          "unsupported_parameter",
          "mask",
        ),
      );
    }
    const files =
      data.image === undefined
        ? []
        : Array.isArray(data.image)
          ? data.image
          : [data.image];
    if (files.length > 1) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.oneImageOnly"),
          "invalid_request_error",
          "invalid_value",
          "image",
        ),
      );
    }
    let inputMediaUrl: string | undefined;
    const [file] = files;
    if (file) {
      if (file.size > V1_MAX_IMAGE_BYTES) {
        return openAiErrorResponse(
          v1Error(
            400,
            t("media.errors.imageTooLarge", {
              max: V1_MAX_IMAGE_BYTES / 1024 / 1024,
            }),
            "invalid_request_error",
            "file_too_large",
            "image",
          ),
        );
      }
      inputMediaUrl = await fileToDataUri(file);
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
      inputMediaUrl = data.image_url;
    } else {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.imageRequired"),
          "invalid_request_error",
          "missing_required_parameter",
          "image",
        ),
      );
    }
    return V1ImagesRepository.run(params, {
      model: data.model,
      prompt: data.prompt,
      n: data.n,
      size: data.size,
      aspectRatio: data.aspect_ratio,
      quality: data.quality,
      responseFormat: data.response_format,
      inputMediaUrl,
    });
  }

  private static async run(
    params: RunParams,
    call: ImageCall,
  ): Promise<StreamingResponse> {
    const { user, locale, logger, request, t, platform } = params;
    const gate = await gateApiKeyRequest(user, request, locale, t, logger);
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    const model = resolveV1ImageModel(
      call.model,
      gate.user,
      await getEnvAvailability(),
    );
    if (!model) {
      return openAiErrorResponse(
        v1Error(
          404,
          t("openai.modelNotFound", { model: call.model }),
          "not_found_error",
          "model_not_found",
          "model",
        ),
      );
    }
    if (call.inputMediaUrl && !model.inputs.includes("image")) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.modelCannotEdit", { model: model.id }),
          "invalid_request_error",
          "invalid_value",
          "model",
        ),
      );
    }
    const consent = await mediaConsentError({
      model,
      user: gate.user,
      locale,
      logger,
    });
    if (consent) {
      return openAiErrorResponse(consent);
    }
    const shape = mapImageShape(call.size, call.aspectRatio);
    if (!shape) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.badSize", { size: call.size ?? "" }),
          "invalid_request_error",
          "invalid_value",
          "size",
        ),
      );
    }
    const toolData = toolRequest(
      model,
      call.prompt,
      shape,
      call.quality,
      call.inputMediaUrl,
    );

    // One storage namespace per call, owned by the key's account.
    const toolContext = mediaToolContext(
      params.toolExecutionContext,
      request?.signal,
      crypto.randomUUID(),
    );
    const { t: imageT } = imageScopedTranslation.scopedT(locale);
    const count = call.n ?? 1;
    const images: Array<{ url: string; creditCost: number }> = [];
    for (let index = 0; index < count; index++) {
      const result = await ImageGenerationRepository.generateImage(
        toolData,
        gate.user,
        locale,
        logger,
        imageT,
        toolContext,
        platform,
      );
      if (!result.success) {
        if (images.length === 0) {
          return openAiErrorResponse(v1ErrorFromToolFailure(result));
        }
        // Earlier images are generated and billed: deliver them.
        logger.warn("[v1/images] Stopped after a failed image", {
          model: model.id,
          delivered: images.length,
          requested: count,
          error: result.message,
        });
        break;
      }
      images.push({
        url: result.data.imageUrl,
        creditCost: result.data.creditCost,
      });
    }

    const data: Array<{ url: string } | { b64_json: string }> = [];
    for (const image of images) {
      if (call.responseFormat !== "b64_json") {
        data.push({ url: signedMediaUrl(image.url, request) });
        continue;
      }
      const stored = await readStoredMediaUrl(image.url);
      if (stored) {
        data.push({ b64_json: stored.buffer.toString("base64") });
        continue;
      }
      // A remote instance's absolute URL: fetch the bytes once.
      const response = await createFixtureFetch(toolContext, logger)(image.url);
      if (!response.ok) {
        return openAiErrorResponse(
          v1Error(
            502,
            t("media.errors.storageFailed"),
            "server_error",
            "upstream_error",
          ),
        );
      }
      data.push({
        b64_json: Buffer.from(await response.arrayBuffer()).toString("base64"),
      });
    }

    return openAiJson({
      created: unixSeconds(),
      model: model.id,
      data,
      credits_charged: roundCredits(
        images.reduce((sum, image) => sum + image.creditCost, 0),
      ),
    });
  }
}

/** Sum of 0.1-credit charges without float noise. */
export function roundCredits(credits: number): number {
  return Math.round(credits * 100) / 100;
}
