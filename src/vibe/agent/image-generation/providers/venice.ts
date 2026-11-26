import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { fetchPublicUrl } from "next-vibe/core/utils/ssrf-guard";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../../env";
import { parseBase64DataUri } from "../../shared/media-generation";
import {
  extractHeaderRequestId,
  normalizeProviderJobId,
} from "../../shared/provider-job-id";
import { parseAspectRatio } from "../aspect-ratio";
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
  id?: string;
  data?: Array<{ b64_json?: string; url?: string }>;
  error?: string | { message?: string };
}

/** Error body shape returned by the edit endpoint (JSON on failure only). */
interface VeniceEditErrorResponse {
  error?: string | { message?: string };
  details?: string;
}

/**
 * Every `size` Venice's images/generations accepts above 512 px (the schema is
 * a closed enum, no aspect_ratio / width / height). 3:2 and 2:3 are the only
 * way to get near 4:3 / 3:4: mapping those to the 16:9 sizes delivered a 4:7
 * image for a 3:4 request (prod 2026-11-16/18, lustify-v8 + chroma).
 */
const VENICE_SIZES = [
  { size: "1024x1024", ratio: 1 },
  { size: "1536x1024", ratio: 1.5 },
  { size: "1024x1536", ratio: 1024 / 1536 },
  { size: "1792x1024", ratio: 1.75 },
  { size: "1024x1792", ratio: 1024 / 1792 },
] as const;

function mapSizeToVenice(
  size: string,
  aspectRatio: string | undefined,
): string {
  const target = aspectRatio ? parseAspectRatio(aspectRatio) : null;
  if (target !== null) {
    let best: string = VENICE_SIZES[0].size;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const entry of VENICE_SIZES) {
      const distance = Math.abs(Math.log(entry.ratio) - Math.log(target));
      if (distance < bestDistance) {
        best = entry.size;
        bestDistance = distance;
      }
    }
    return best;
  }
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
  /** Requested W:H ratio; picks the closest Venice size when set. */
  aspectRatio?: string;
  /**
   * Reference image: a base64 data URI (own storage files, browser uploads;
   * see resolveMediaReference) or a public URL. When set, the Venice image
   * EDIT endpoint is used (image-to-image) and the bytes go to Venice as a
   * base64 string.
   */
  inputMediaUrl?: string | null;
  onProviderJobId?: (providerJobId: string) => void;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ imageUrl: string; providerJobId?: string }>> {
  const {
    providerModel,
    prompt,
    size,
    aspectRatio,
    inputMediaUrl,
    onProviderJobId,
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
      aspectRatio,
      onProviderJobId,
      logger,
      locale,
      fetchImpl,
    });
  }

  const apiSize = mapSizeToVenice(size, aspectRatio);
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

    // A gateway error page (HTML 502/503) is an outage, not a parse crash.
    const rawText = await response.text();
    let data: VeniceImageResponse;
    try {
      data = JSON.parse(rawText) as VeniceImageResponse;
    } catch {
      data = {
        error: `HTTP ${String(response.status)}: ${rawText.slice(0, 200)}`,
      };
    }
    if (!response.ok || data.error) {
      const errorMsg = errorMessageOf(data, response.status);
      logger.error("[Venice Images] API error", {
        error: errorMsg,
        status: response.status,
        model: providerModel,
        size: apiSize,
      });
      return fail({
        // The status tells a refusal (400/403) from an outage (5xx/429).
        message: t("post.errors.externalServiceError", {
          message: `${errorMsg} (HTTP ${String(response.status)})`,
        }),
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

    const providerJobId =
      normalizeProviderJobId(data.id) ??
      extractHeaderRequestId(response.headers, [
        "x-venice-request-id",
        "x-request-id",
        "request-id",
      ]);
    if (providerJobId) {
      onProviderJobId?.(providerJobId);
    }

    logger.debug("[Venice Images] Image generated successfully", {
      providerJobId: providerJobId ?? null,
    });
    return success({ imageUrl, providerJobId });
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
 * The reference image arrives as a base64 data URI (decoded) or a public URL
 * (fetched SSRF-guarded via the fixture-aware fetchImpl) and is sent to Venice
 * as a base64 string in the JSON body. Venice returns the edited image as RAW BYTES (not JSON) on success,
 * so the result is wrapped as a data: URI for the repository to fetch and
 * upload to storage. `safe_mode: false` disables Venice's adult-content blur —
 * the model's UNCENSORED content tier already gates who can pick it.
 */
async function editWithVenice(params: {
  providerModel: string;
  prompt: string;
  inputMediaUrl: string;
  aspectRatio?: string;
  onProviderJobId?: (providerJobId: string) => void;
  logger: EndpointLogger;
  locale: CountryLanguage;
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ imageUrl: string; providerJobId?: string }>> {
  const {
    providerModel,
    prompt,
    inputMediaUrl,
    aspectRatio,
    onProviderJobId,
    logger,
    locale,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  logger.debug("[Venice Images] Editing image", {
    model: providerModel,
    promptLength: prompt.length,
  });

  try {
    // The repository hands over own storage files (and browser uploads) as
    // a base64 data URI: decode it, never fetch it. Only a public third-party
    // URL is fetched, SSRF-guarded and fixture-aware.
    let refBase64: string;
    const inline = parseBase64DataUri(inputMediaUrl);
    if (inline) {
      refBase64 = inline.base64;
    } else {
      const refRes = await fetchPublicUrl(inputMediaUrl, fetchImpl);
      if (!refRes?.ok) {
        logger.error("[Venice Images] Reference image fetch failed", {
          status: refRes?.status ?? null,
          blocked: refRes === null,
          host: URL.canParse(inputMediaUrl)
            ? new URL(inputMediaUrl).host
            : null,
        });
        return fail({
          message: t("post.errors.externalServiceError", {
            message: `reference image fetch HTTP ${refRes?.status ?? "blocked"}`,
          }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      const refArrayBuf = await refRes.arrayBuffer();
      refBase64 = Buffer.from(new Uint8Array(refArrayBuf)).toString("base64");
    }

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
        aspect_ratio: aspectRatio,
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
      logger.error("[Venice Images] Edit API error", {
        error: errorMsg,
        status: response.status,
      });
      return fail({
        message: t("post.errors.externalServiceError", {
          message: `${errorMsg} (HTTP ${String(response.status)})`,
        }),
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

    const providerJobId = extractHeaderRequestId(response.headers, [
      "x-venice-request-id",
      "x-request-id",
      "request-id",
    ]);
    if (providerJobId) {
      onProviderJobId?.(providerJobId);
    }

    logger.debug("[Venice Images] Image edited successfully", {
      providerJobId: providerJobId ?? null,
    });
    return success({ imageUrl, providerJobId });
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
