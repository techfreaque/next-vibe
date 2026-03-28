import "server-only";

import type { LanguageModelV2 } from "@ai-sdk/provider";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";
import {
  createMediaProvider,
  readStringOption,
} from "./shared/media-provider-factory";

interface FalAiResponse {
  images?: Array<{ url: string; width?: number; height?: number }>;
  error?: { message: string };
}
interface FalAiQueueResponse {
  request_id: string;
  status?: string;
}
interface FalAiStatusResponse {
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30;

export async function generateWithFalAi(params: {
  providerModel: string;
  prompt: string;
  size: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
  signal?: AbortSignal;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, size, logger, locale, signal } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.FAL_AI_API_KEY) {
    return fail({
      message: t("errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  let imageSize = "square_hd";
  if (size === "post.size.landscape1792") {
    imageSize = "landscape_4_3";
  } else if (size === "post.size.portrait1792") {
    imageSize = "portrait_4_3";
  }

  logger.info("[Fal.ai] Submitting generation request", {
    model: providerModel,
    imageSize,
    promptLength: prompt.length,
  });

  try {
    const submitResponse = await fetch(
      `https://queue.fal.run/${providerModel}`,
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Key ${agentEnv.FAL_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, image_size: imageSize, num_images: 1 }),
      },
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      logger.error("[Fal.ai] Failed to submit request", {
        status: submitResponse.status,
        error: errorText,
      });
      return fail({
        message: t("errors.externalServiceError", { message: errorText }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const queueResult = (await submitResponse.json()) as FalAiQueueResponse;
    const requestId = queueResult.request_id;
    logger.info("[Fal.ai] Request queued, polling", { requestId });

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      if (signal?.aborted) {
        return fail({
          message: t("errors.requestAborted"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      await new Promise<void>((resolve) => {
        setTimeout(resolve, POLL_INTERVAL_MS);
      });

      const statusResponse = await fetch(
        `https://queue.fal.run/${providerModel}/requests/${requestId}/status`,
        {
          // eslint-disable-next-line i18next/no-literal-string
          headers: { Authorization: `Key ${agentEnv.FAL_AI_API_KEY}` },
        },
      );
      if (!statusResponse.ok) {
        continue;
      }

      const statusData = (await statusResponse.json()) as FalAiStatusResponse;

      if (statusData.status === "COMPLETED") {
        const resultResponse = await fetch(
          `https://queue.fal.run/${providerModel}/requests/${requestId}`,
          {
            // eslint-disable-next-line i18next/no-literal-string
            headers: { Authorization: `Key ${agentEnv.FAL_AI_API_KEY}` },
          },
        );
        if (!resultResponse.ok) {
          return fail({
            message: t("errors.requestFailed", {
              message: String(resultResponse.status),
            }),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        const result = (await resultResponse.json()) as FalAiResponse;
        const imageUrl = result.images?.[0]?.url;
        if (!imageUrl) {
          return fail({
            message: t("errors.noImageUrl"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        logger.info("[Fal.ai] Image generated successfully");
        return success({ imageUrl });
      }

      if (statusData.status === "FAILED") {
        return fail({
          message: t("errors.generationFailed"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      logger.debug("[Fal.ai] Still processing", {
        requestId,
        attempt: attempt + 1,
        status: statusData.status,
      });
    }

    return fail({
      message: t("errors.requestTimedOut"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Fal.ai] Request failed", { error: errorMessage });
    return fail({
      message: t("errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}

export function createFalAiImage(
  logger: EndpointLogger,
  locale: CountryLanguage,
): {
  chat: (modelId: string) => LanguageModelV2;
} {
  return createMediaProvider(logger, {
    provider: ApiProvider.FAL_AI,
    logPrefix: "Fal.ai Image Provider",
    defaultMediaType: "image/png",
    urlKey: "imageUrl",
    generate: (options, prompt, modelId) => {
      const size =
        readStringOption(options.providerOptions, "imageSize") ??
        "post.size.square1024";
      return generateWithFalAi({
        providerModel: modelId,
        prompt,
        size,
        logger,
        locale,
        signal: options.abortSignal,
      });
    },
  });
}
