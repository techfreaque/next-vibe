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
const VENICE_IMAGE_EDIT_URL = "https://api.venice.ai/api/v1/image/edit";

interface VeniceImageResponse {
  data?: Array<{ b64_json?: string; url?: string }>;
  error?: string | { message?: string };
}

/** Error body shape returned by the edit endpoint (JSON on failure only). */
interface VeniceEditErrorResponse {
  error?: string | { message?: string };
  details?: string;
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
  /**
   * Reference image URL. When set, the Venice image EDIT endpoint is used
   * (image-to-image) instead of text-to-image. The bytes are fetched via the
   * same fixture-aware fetchImpl and passed to Venice as a base64 string.
   */
  inputMediaUrl?: string | null;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const {
    providerModel,
    prompt,
    size,
    inputMediaUrl,
    logger,
    locale,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.VENICE_AI_API_KEY) {
    return fail({
      message: t("post.errors.apiKeyNotConfigured"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  if (inputMediaUrl) {
    return editWithVenice({
      providerModel,
      prompt,
      inputMediaUrl,
      logger,
      locale,
      fetchImpl,
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

/** Map a Content-Type header to a safe image mime for the data URI. */
function imageMimeFromContentType(contentType: string | null): string {
  if (contentType?.startsWith("image/")) {
    return contentType.split(";")[0].trim();
  }
  // eslint-disable-next-line i18next/no-literal-string
  return "image/png";
}

function editErrorMessageOf(
  data: VeniceEditErrorResponse,
  status: number,
): string {
  const base =
    typeof data.error === "string"
      ? data.error
      : (data.error?.message ?? `HTTP ${status}`);
  return data.details ? `${base}: ${data.details}` : base;
}

/**
 * Venice.ai image EDIT (image-to-image) via POST /image/edit.
 *
 * The reference image arrives as a URL; its bytes are fetched with the
 * fixture-aware fetchImpl and sent to Venice as a base64 string in the JSON
 * body. Venice returns the edited image as RAW BYTES (not JSON) on success,
 * so the result is wrapped as a data: URI for the repository to fetch and
 * upload to storage. `safe_mode: false` disables Venice's adult-content blur —
 * the model's UNCENSORED content tier already gates who can pick it.
 */
async function editWithVenice(params: {
  providerModel: string;
  prompt: string;
  inputMediaUrl: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const { providerModel, prompt, inputMediaUrl, logger, locale, fetchImpl } =
    params;
  const { t } = scopedTranslation.scopedT(locale);

  logger.debug("[Venice Images] Editing image", {
    model: providerModel,
    promptLength: prompt.length,
  });

  try {
    // Fetch the reference image bytes (fixture-aware) and base64-encode them.
    const refRes = await fetchImpl(inputMediaUrl);
    if (!refRes.ok) {
      logger.error("[Venice Images] Reference image fetch failed", {
        status: refRes.status,
      });
      return fail({
        message: t("post.errors.externalServiceError", {
          message: `reference image fetch HTTP ${refRes.status}`,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const refArrayBuf = await refRes.arrayBuffer();
    const refBase64 = Buffer.from(new Uint8Array(refArrayBuf)).toString(
      "base64",
    );

    const response = await fetchImpl(VENICE_IMAGE_EDIT_URL, {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${agentEnv.VENICE_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: providerModel,
        prompt,
        image: refBase64,
        safe_mode: false,
        output_format: "webp",
      }),
    });

    if (!response.ok) {
      let errorMsg: string;
      try {
        const errData = (await response.json()) as VeniceEditErrorResponse;
        errorMsg = editErrorMessageOf(errData, response.status);
      } catch {
        errorMsg = `HTTP ${response.status}`;
      }
      logger.error("[Venice Images] Edit API error", { error: errorMsg });
      return fail({
        message: t("post.errors.externalServiceError", { message: errorMsg }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Success: body is raw image bytes, not JSON. Wrap as a data: URI so the
    // repository's storage-upload step fetches + persists it (never inlined
    // into model context).
    const outArrayBuf = await response.arrayBuffer();
    if (outArrayBuf.byteLength === 0) {
      logger.error("[Venice Images] Edit returned empty body");
      return fail({
        message: t("post.errors.noImageUrl"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const outBase64 = Buffer.from(new Uint8Array(outArrayBuf)).toString(
      "base64",
    );
    const mime = imageMimeFromContentType(response.headers.get("content-type"));
    const imageUrl = `data:${mime};base64,${outBase64}`;

    logger.debug("[Venice Images] Image edited successfully");
    return success({ imageUrl });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Venice Images] Edit request failed", {
      error: errorMessage,
    });
    return fail({
      message: t("post.errors.requestFailed", { message: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
