import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../../env";
import { ImageSize } from "../enum";
import { scopedTranslation } from "../i18n";

/**
 * Venice.ai image generation via its OpenAI-compatible endpoint.
 * `moderation: "low"` returns adult content unblurred — the model's content
 * tier (UNCENSORED) already gates who can pick it, so Venice must not
 * second-guess that with a blur.
 */

const VENICE_IMAGES_URL = "https://api.venice.ai/api/v1/images/generations";

interface VeniceImageResponse {
  data?: Array<{ b64_json?: string; url?: string }>;
  error?: string | { message?: string };
}

function mapSizeToVenice(size: string): string {
  if (size === ImageSize.LANDSCAPE_1792) {
    return "1792x1024";
  }
  if (size === ImageSize.PORTRAIT_1792) {
    return "1024x1792";
  }
  return "1024x1024";
}

function errorMessageOf(data: VeniceImageResponse, status: number): string {
  if (typeof data.error === "string") {
    return data.error;
  }
  return data.error?.message ?? `HTTP ${status}`;
}

export async function generateWithVenice(params: {
  providerModel: string;
  prompt: string;
  size: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, size, logger, locale, fetchImpl } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.VENICE_AI_API_KEY) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const apiSize = mapSizeToVenice(size);
  logger.debug("[Venice Images] Generating image", {
    model: providerModel,
    size: apiSize,
    promptLength: prompt.length,
  });

  try {
    const response = await fetchImpl(VENICE_IMAGES_URL, {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${agentEnv.VENICE_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: providerModel,
        prompt,
        n: 1,
        size: apiSize,
        response_format: "b64_json",
        output_format: "webp",
        moderation: "low",
      }),
    });

    const data = (await response.json()) as VeniceImageResponse;
    if (!response.ok || data.error) {
      const errorMsg = errorMessageOf(data, response.status);
      logger.error("[Venice Images] API error", { error: errorMsg });
      return fail({
        message: t("post.errors.externalServiceError", { message: errorMsg }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const first = data.data?.[0];
    const imageUrl = first?.b64_json
      ? `data:image/webp;base64,${first.b64_json}`
      : first?.url;
    if (!imageUrl) {
      logger.error("[Venice Images] No image in response");
      return fail({
        message: t("post.errors.noImageUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    logger.debug("[Venice Images] Image generated successfully");
    return success({ imageUrl });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Venice Images] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
