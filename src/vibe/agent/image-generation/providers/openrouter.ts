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
import { scopedTranslation } from "../i18n";

/**
 * OpenRouter dedicated image generation via POST /api/v1/images.
 *
 * Only dedicated text-to-image / image-edit models are routed here (flux.2-*,
 * qwen-image-3*, seedream, riverflow, grok-imagine). Multimodal LLM image
 * models (gemini/gpt image preview) are token-based and go through the headless
 * AI runner instead, never this provider.
 *
 * The old chat/completions path 404s for these models with
 * "... is an image generation model and cannot be used with the
 * chat/completions endpoint. Use the /api/v1/images endpoint instead."
 *
 * Image-to-image/edit: a reference image URL is passed in `input_references`.
 * Response images come back as base64 in `data[i].b64_json` (no hosted URL), so
 * the bytes are wrapped as a `data:` URI for the repository's storage step to
 * fetch and persist (never inlined into model context).
 */

const OPENROUTER_IMAGES_URL = "https://openrouter.ai/api/v1/images";

interface OpenRouterImageData {
  b64_json?: string;
  media_type?: string;
  url?: string;
}

interface OpenRouterImagesResponse {
  data?: OpenRouterImageData[];
  error?: { message?: string; code?: number };
}

/** Coerce the provider-reported media type to a safe image mime. */
function safeImageMime(mediaType: string | undefined): string {
  if (mediaType && mediaType.startsWith("image/")) {
    return mediaType.split(";")[0].trim();
  }
  // eslint-disable-next-line i18next/no-literal-string
  return "image/png";
}

export async function generateWithOpenRouter(params: {
  providerModel: string;
  prompt: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
  inputMediaUrl?: string | null;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, logger, locale, inputMediaUrl, fetchImpl } =
    params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.OPENROUTER_API_KEY) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  logger.debug("[OpenRouter Image] Generating image", {
    model: providerModel,
    promptLength: prompt.length,
    imageToImage: Boolean(inputMediaUrl),
  });

  try {
    const response = await fetchImpl(OPENROUTER_IMAGES_URL, {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${agentEnv.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // eslint-disable-next-line i18next/no-literal-string
        "HTTP-Referer": "https://unbottled.ai",
        // eslint-disable-next-line i18next/no-literal-string
        "X-Title": "Unbottled AI",
      },
      body: JSON.stringify({
        model: providerModel,
        prompt,
        ...(inputMediaUrl
          ? {
              input_references: [
                { type: "image_url", image_url: { url: inputMediaUrl } },
              ],
            }
          : {}),
      }),
    });

    const rawText = await response.text();

    let data: OpenRouterImagesResponse;
    try {
      data = JSON.parse(rawText) as OpenRouterImagesResponse;
    } catch {
      logger.error("[OpenRouter Image] Failed to parse response as JSON", {
        status: response.status,
        body: rawText.slice(0, 500),
      });
      return fail({
        message: t("post.errors.nonJsonResponse", {
          status: response.status,
          body: rawText.slice(0, 200),
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message ?? `HTTP ${response.status}`;
      logger.error("[OpenRouter Image] API error", { error: errorMsg });
      return fail({
        message: t("post.errors.externalServiceError", { message: errorMsg }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Images are returned as base64 in data[i].b64_json (no hosted URL). Wrap as
    // a data: URI so the repository's storage step fetches + persists it. Some
    // providers may return a hosted url instead — honor it when present.
    const first = data.data?.[0];
    const imageUrl = first?.b64_json
      ? `data:${safeImageMime(first.media_type)};base64,${first.b64_json}`
      : first?.url;

    if (!imageUrl) {
      logger.error("[OpenRouter Image] No image in response", {
        hasData: Boolean(data.data),
        dataCount: data.data?.length ?? 0,
      });
      return fail({
        message: t("post.errors.noImageUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    logger.debug("[OpenRouter Image] Image generated successfully");
    return success({ imageUrl });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[OpenRouter Image] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
