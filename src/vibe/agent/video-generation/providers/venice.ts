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
import { pollDelay } from "../../shared/poll-delay";
import { scopedTranslation, type VideoGenerationT } from "../i18n";

/**
 * Venice.ai video generation: async queue + retrieve polling.
 *
 * POST /video/queue  → { model, queue_id, download_url? }
 * POST /video/retrieve → JSON { status: "PROCESSING" } while running, then
 *   either the raw MP4 bytes (Content-Type video/*) or JSON
 *   { status: "COMPLETED" } for models that handed out a private
 *   `download_url` at queue time (fetched without auth, then revoked).
 *
 * The provider always hands the repository the finished BYTES: Venice's
 * result is never a stable URL (retrieve is a POST, download_url expires in
 * 24 h and is revoked here after download), so there is no provider URL that
 * could ever be stored or shown.
 *
 * Venice ships separate model ids per mode: the definition stores the
 * text-to-video id; a seed image switches to the matching image-to-video id.
 */

const VENICE_VIDEO_BASE_URL = "https://api.venice.ai/api/v1/video";
const T2V_MARKER = "text-to-video";
const I2V_MARKER = "image-to-video";
/** Text-to-video needs an aspect ratio; every Venice t2v model lists 16:9. */
const VENICE_DEFAULT_ASPECT_RATIO = "16:9";

// Real interval always — pollDelay() collapses to 10ms on REPLAY.
// Venice P80 for a 5s 720p clip is 1-3 min; 5s × 120 = 10 min ceiling.
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 120;

interface VeniceVideoQueueBody {
  model: string;
  prompt: string;
  duration: string;
  resolution?: string;
  aspect_ratio?: string;
  audio: boolean;
  negative_prompt?: string;
  image_url?: string;
}

interface VeniceVideoQueueResponse {
  model?: string;
  queue_id?: string;
  download_url?: string;
}

interface VeniceVideoRetrieveResponse {
  /** "PROCESSING" while running, "COMPLETED" when done. */
  status?: string;
  average_execution_time?: number;
  execution_duration?: number;
}

interface VeniceErrorBody {
  error?: string | { message?: string };
  details?: string | Record<string, string | string[]>;
  message?: string;
}

/** Venice's own error text plus the status, in the provider's words. */
function veniceErrorText(rawText: string, status: number): string {
  let detail = rawText.slice(0, 300);
  try {
    const body = JSON.parse(rawText) as VeniceErrorBody;
    const base =
      typeof body.error === "string"
        ? body.error
        : (body.error?.message ?? body.message);
    const details =
      typeof body.details === "string"
        ? body.details
        : body.details
          ? JSON.stringify(body.details).slice(0, 200)
          : undefined;
    if (base) {
      detail = details ? `${base}: ${details}` : base;
    }
  } catch {
    // Gateway HTML page (502/503): keep the raw snippet.
  }
  return `${detail} (HTTP ${String(status)})`;
}

/**
 * Map a Venice HTTP failure to a failure the repository can classify.
 * 422 = content policy (Venice docs: "Content violation. Modify the prompt"),
 * 409 = Seedance consent flow (face media), 5xx/429 = outage/capacity.
 * The upstream text stays English so the shared refusal/outage classifier
 * (image-generation/provider-error.ts) reads it in every locale.
 */
function veniceHttpFailure(
  rawText: string,
  status: number,
  t: VideoGenerationT,
): ResponseType<never> {
  const detail = veniceErrorText(rawText, status);
  if (status === 422) {
    return fail({
      message: t("post.errors.providerError", {
        // eslint-disable-next-line i18next/no-literal-string
        error: `content policy rejection: ${detail}`,
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }
  if (status === 409) {
    return fail({
      message: t("post.errors.consentRequired", { error: detail }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }
  return fail({
    message: t("post.errors.providerError", { error: detail }),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export async function generateVideoWithVenice(params: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  aspectRatio?: string;
  resolution?: string;
  negativePrompt?: string;
  generateAudio?: boolean;
  /** Seed image: a base64 data URI (own storage) or a public URL. */
  inputImageUrl?: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Fixture-aware fetch bound once per generation (see createFixtureFetch). */
  fetchImpl: typeof globalThis.fetch;
}): Promise<ResponseType<{ videoBytes: Uint8Array; mimeType: string }>> {
  const {
    providerModel,
    prompt,
    durationSeconds,
    aspectRatio,
    resolution,
    negativePrompt,
    generateAudio,
    inputImageUrl,
    logger,
    locale,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  if (!agentEnv.VENICE_AI_API_KEY) {
    return fail({
      message: t("post.errors.notConfigured", {
        label: "Venice.ai",
        envKey: "VENICE_AI_API_KEY",
        url: "https://venice.ai/settings/api",
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  const headers = {
    // eslint-disable-next-line i18next/no-literal-string
    Authorization: `Bearer ${agentEnv.VENICE_AI_API_KEY}`,
    "Content-Type": "application/json",
  };

  const isImageToVideo = Boolean(inputImageUrl);
  const model = isImageToVideo
    ? providerModel.replace(T2V_MARKER, I2V_MARKER)
    : providerModel;

  const body: VeniceVideoQueueBody = {
    model,
    prompt,
    duration: `${String(durationSeconds)}s`,
    audio: generateAudio ?? true,
  };
  if (resolution) {
    body.resolution = resolution;
  }
  // Image-to-video takes its framing from the seed image (Venice lists no
  // aspect ratios for the i2v ids and rejects one). Text-to-video requires
  // one: a call without it was rejected 400 "aspect_ratio Required"
  // (prod 2026-11-17), so default to landscape.
  if (!isImageToVideo) {
    body.aspect_ratio = aspectRatio ?? VENICE_DEFAULT_ASPECT_RATIO;
  }
  if (negativePrompt) {
    body.negative_prompt = negativePrompt;
  }
  if (inputImageUrl) {
    body.image_url = inputImageUrl;
  }

  logger.debug("[Venice Video] Submitting generation job", {
    model,
    duration: body.duration,
    aspectRatio: body.aspect_ratio,
    resolution,
    imageToVideo: isImageToVideo,
  });

  try {
    const queueRes = await fetchImpl(`${VENICE_VIDEO_BASE_URL}/queue`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const queueText = await queueRes.text();
    if (!queueRes.ok) {
      logger.error("[Venice Video] Queue failed", {
        status: queueRes.status,
        error: queueText.slice(0, 300),
        model,
        aspectRatio: body.aspect_ratio ?? null,
        resolution: body.resolution ?? null,
        duration: body.duration,
        imageToVideo: isImageToVideo,
      });
      return veniceHttpFailure(queueText, queueRes.status, t);
    }
    let queueData: VeniceVideoQueueResponse;
    try {
      queueData = JSON.parse(queueText) as VeniceVideoQueueResponse;
    } catch {
      return fail({
        message: t("post.errors.nonJsonResponse", {
          status: String(queueRes.status),
          body: queueText.slice(0, 200),
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const queueId = queueData.queue_id;
    if (!queueId) {
      return fail({
        message: t("post.errors.providerHttpError", {
          status: String(queueRes.status),
          body: queueText.slice(0, 200),
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const downloadUrl = queueData.download_url;

    logger.debug("[Venice Video] Job queued, polling", {
      queueId,
      privateDownload: Boolean(downloadUrl),
    });

    let lastResponse: Response = queueRes;
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await pollDelay(POLL_INTERVAL_MS, lastResponse);

      const retrieveRes = await fetchImpl(`${VENICE_VIDEO_BASE_URL}/retrieve`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: queueData.model ?? model,
          queue_id: queueId,
          // Privacy: Venice drops its copy once we hold the bytes.
          delete_media_on_completion: true,
        }),
      });
      lastResponse = retrieveRes;
      const contentType = retrieveRes.headers.get("content-type") ?? "";

      if (retrieveRes.ok && contentType.startsWith("video/")) {
        const bytes = new Uint8Array(await retrieveRes.arrayBuffer());
        if (bytes.byteLength === 0) {
          return fail({
            message: t("post.errors.noVideoUrl"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        logger.debug("[Venice Video] Generation complete (inline bytes)", {
          bytes: bytes.byteLength,
        });
        return success({
          videoBytes: bytes,
          mimeType: contentType.split(";")[0]?.trim() ?? "video/mp4",
        });
      }

      const retrieveText = await retrieveRes.text();
      if (!retrieveRes.ok) {
        // 503 = model at capacity mid-job: keep polling, Venice retries it.
        if (retrieveRes.status === 503 || retrieveRes.status === 429) {
          logger.warn("[Venice Video] Busy while polling, retrying", {
            attempt,
            status: retrieveRes.status,
          });
          continue;
        }
        logger.error("[Venice Video] Retrieve failed", {
          status: retrieveRes.status,
          error: retrieveText.slice(0, 300),
        });
        return veniceHttpFailure(retrieveText, retrieveRes.status, t);
      }

      let statusData: VeniceVideoRetrieveResponse;
      try {
        statusData = JSON.parse(retrieveText) as VeniceVideoRetrieveResponse;
      } catch {
        logger.warn("[Venice Video] Non-JSON poll response, retrying", {
          attempt,
        });
        continue;
      }

      logger.debug("[Venice Video] Poll status", {
        attempt,
        status: statusData.status,
        elapsedMs: statusData.execution_duration,
        p80Ms: statusData.average_execution_time,
      });

      if (statusData.status === "COMPLETED" && downloadUrl) {
        // Private link: no auth header (Venice docs), revoked after use.
        const fileRes = await fetchImpl(downloadUrl, { method: "GET" });
        if (!fileRes.ok) {
          const fileText = await fileRes.text();
          return veniceHttpFailure(fileText, fileRes.status, t);
        }
        const bytes = new Uint8Array(await fileRes.arrayBuffer());
        const fileType = fileRes.headers.get("content-type") ?? "";
        try {
          await fetchImpl(downloadUrl, { method: "DELETE" });
        } catch (revokeError) {
          logger.warn("[Venice Video] Download link revoke failed", {
            error: parseError(revokeError).message,
          });
        }
        if (bytes.byteLength === 0) {
          return fail({
            message: t("post.errors.noVideoUrl"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        logger.debug("[Venice Video] Generation complete (download link)", {
          bytes: bytes.byteLength,
        });
        return success({
          videoBytes: bytes,
          mimeType: fileType.startsWith("video/")
            ? (fileType.split(";")[0]?.trim() ?? "video/mp4")
            : "video/mp4",
        });
      }
      // PROCESSING (or COMPLETED without a link: the bytes arrive on the
      // next retrieve) → keep polling.
    }

    return fail({
      message: t("post.errors.requestTimedOut"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[Venice Video] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.providerError", { error: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
