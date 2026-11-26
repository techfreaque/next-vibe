import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { MAX_UPLOAD_BYTES } from "next-vibe/core/route/body-limit";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../../env";
import { parseBase64DataUri } from "../../shared/media-generation";
import { pollDelay } from "../../shared/poll-delay";
import { scopedTranslation } from "../i18n";

type VideoProviderError =
  | string
  | {
      message?: string;
      code?: number;
      metadata?: {
        routing_funnel?: {
          step?: string;
          endpoint_count?: number;
          reason?: string;
        }[];
      };
    }
  | null;

// A linked provider key can change outside this process. Recheck after five minutes.
const missingLinkedKey = new Map<string, number>();
let openRouterAccount: string | undefined;
const LINKED_KEY_RECHECK_MS = 5 * 60_000;

function requiresLinkedKey(error?: VideoProviderError): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const steps = error.metadata?.routing_funnel;
  return (
    Array.isArray(steps) &&
    steps.some(
      (step) =>
        step?.step === "Add BYOK Endpoints" &&
        step.endpoint_count === 0 &&
        typeof step.reason === "string" &&
        /byok-only/i.test(step.reason) &&
        /you have no .*key/i.test(step.reason),
    )
  );
}

function providerErrorMessage(error?: VideoProviderError): string | undefined {
  return typeof error === "string" ? error : error?.message;
}

interface OpenRouterVideoSubmitResponse {
  id: string;
  polling_url: string;
  status: string;
  generation_id?: string;
  error?: VideoProviderError;
  unsigned_urls?: string[];
  usage?: { cost?: number; is_byok?: boolean };
}

interface OpenRouterVideoRequestBody {
  model: string;
  prompt: string;
  duration?: number;
  aspect_ratio?: string;
  resolution?: string;
  frame_images?: Array<{
    type: "image_url";
    frame_type: "first_frame" | "last_frame";
    image_url: { url: string };
  }>;
  input_references?: Array<
    | { type: "image_url"; image_url: { url: string } }
    | { type: "audio_url"; audio_url: { url: string } }
    | { type: "video_url"; video_url: { url: string } }
  >;
  generate_audio?: boolean;
  negative_prompt?: string;
  negativePrompt?: string;
}

type FrameImageRole = "first" | "last" | "reference";

/**
 * Auto-detect the OpenRouter input-reference kind from the URL file extension.
 * .mp4/.webm/.mov → video, audio files → audio, everything else → image.
 */
export function detectMediaKind(
  url: string,
): "image_url" | "audio_url" | "video_url" {
  if (url.startsWith("data:video/")) {
    return "video_url";
  }
  if (url.startsWith("data:audio/")) {
    return "audio_url";
  }
  if (url.startsWith("data:")) {
    return "image_url";
  }
  const clean = url.split("?")[0]?.split("#")[0]?.toLowerCase() ?? "";
  if (/\.(mp4|webm|mov)$/.test(clean)) {
    return "video_url";
  }
  if (/\.(mp3|wav|m4a|ogg|flac)$/.test(clean)) {
    return "audio_url";
  }
  return "image_url";
}

// Private generated images reach the provider as inline WebP. Some video
// models only accept PNG or JPEG for bookends. Preserve alpha and dimensions.
async function prepareFrameImage(
  url: string,
  logger: EndpointLogger,
): Promise<string> {
  if (!url.startsWith("data:image/webp;")) {
    return url;
  }
  const inline = parseBase64DataUri(url);
  if (!inline || inline.base64.length > Math.ceil(MAX_UPLOAD_BYTES / 3) * 4) {
    return url;
  }
  try {
    const { default: sharp } = await import("sharp");
    const png = await sharp(Buffer.from(inline.base64, "base64"), {
      limitInputPixels: 16_777_216,
    })
      .autoOrient()
      .png()
      .toBuffer();
    if (png.length <= MAX_UPLOAD_BYTES) {
      return `data:image/png;base64,${png.toString("base64")}`;
    }
  } catch (error) {
    logger.warn("[OpenRouter Video] WebP frame conversion failed", {
      reason: parseError(error).message,
    });
  }
  // A model which accepts the original can still handle the request.
  return url;
}

interface OpenRouterVideoStatusResponse {
  id: string;
  polling_url: string;
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "failed"
    | "cancelled"
    | "expired";
  generation_id?: string;
  error?: VideoProviderError;
  unsigned_urls?: string[];
  usage?: { cost?: number; is_byok?: boolean };
}

// Real interval always — pollDelay() collapses to 10ms on REPLAY.
// Video gen can take 1-5 minutes; 5s × 120 = 10 min ceiling.
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 120;

export async function generateVideoWithOpenRouter(params: {
  providerModel: string;
  prompt: string;
  durationSeconds?: number;
  aspectRatio?: string;
  resolution?: string;
  frameReferences?: Array<{ url: string; role?: FrameImageRole }>;
  negativePrompt?: string;
  generateAudio?: boolean;
  supportedFrameImages?: readonly string[];
  allowedPassthroughParameters?: readonly string[];
  logger: EndpointLogger;
  locale: CountryLanguage;
  fetchImpl: typeof globalThis.fetch;
}): Promise<
  ResponseType<{
    videoUrl: string;
    /** Real charge of the job in USD (no markup), when reported. */
    upstreamCostUsd?: number;
    downloadHeaders?: Record<string, string>;
  }>
> {
  const {
    providerModel,
    prompt,
    durationSeconds,
    aspectRatio,
    resolution,
    frameReferences,
    negativePrompt,
    generateAudio,
    supportedFrameImages,
    allowedPassthroughParameters,
    logger,
    locale,
    fetchImpl,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  const accountKey = agentEnv.OPENROUTER_API_KEY;
  if (!accountKey) {
    return fail({
      message: t("post.errors.notConfigured", {
        label: "OpenRouter",
        envKey: "OPENROUTER_API_KEY",
        url: "https://openrouter.ai/keys",
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  if (openRouterAccount !== accountKey) {
    missingLinkedKey.clear();
    openRouterAccount = accountKey;
  }
  const unavailableModel = (): ReturnType<typeof fail> =>
    fail({
      message: t("post.errors.providerUnsupported", { label: providerModel }),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  if ((missingLinkedKey.get(providerModel) ?? 0) > Date.now()) {
    return unavailableModel();
  }
  const headers = {
    // eslint-disable-next-line i18next/no-literal-string
    Authorization: `Bearer ${accountKey}`,
    "Content-Type": "application/json",
    // eslint-disable-next-line i18next/no-literal-string
    "HTTP-Referer": "https://unbottled.ai",
    // eslint-disable-next-line i18next/no-literal-string
    "X-Title": "Unbottled AI",
  };

  const body: OpenRouterVideoRequestBody = { model: providerModel, prompt };
  if (durationSeconds !== undefined) {
    body.duration = durationSeconds;
  }
  if (aspectRatio) {
    body.aspect_ratio = aspectRatio;
  }
  if (resolution) {
    body.resolution = resolution;
  }
  // OpenRouter splits image inputs into two arrays:
  //  - frame_images: EXACT bookend frames. Schema (all three fields required):
  //      { type: "image_url", frame_type: "first_frame"|"last_frame",
  //        image_url: { url } }
  //    The `type` literal is "image_url" (the part kind), the first/last
  //    discriminator lives under `frame_type`, image_url is an OBJECT { url }.
  //  - input_references: guiding assets. Schema:
  //      { type: <kind>, <kind>: { url } } where kind is auto-detected
  //      (image_url/audio_url/video_url) from the URL extension.
  const frameImageParts: NonNullable<
    OpenRouterVideoRequestBody["frame_images"]
  > = [];
  const inputReferenceParts: NonNullable<
    OpenRouterVideoRequestBody["input_references"]
  > = [];
  for (const frame of frameReferences ?? []) {
    const isBookend =
      frame.role === "first" ||
      (frame.role === "last" && supportedFrameImages?.includes("last_frame"));
    const url = isBookend
      ? await prepareFrameImage(frame.url, logger)
      : frame.url;
    if (frame.role === "first") {
      frameImageParts.push({
        type: "image_url",
        frame_type: "first_frame",
        image_url: { url },
      });
    } else if (frame.role === "last") {
      if (supportedFrameImages?.includes("last_frame")) {
        frameImageParts.push({
          type: "image_url",
          frame_type: "last_frame",
          image_url: { url },
        });
      }
    } else {
      const kind = detectMediaKind(url);
      if (kind === "video_url") {
        inputReferenceParts.push({ type: "video_url", video_url: { url } });
      } else if (kind === "audio_url") {
        inputReferenceParts.push({ type: "audio_url", audio_url: { url } });
      } else {
        inputReferenceParts.push({ type: "image_url", image_url: { url } });
      }
    }
  }
  if (frameImageParts.length > 0) {
    body.frame_images = frameImageParts;
  }
  if (inputReferenceParts.length > 0) {
    body.input_references = inputReferenceParts;
  }
  if (generateAudio) {
    body.generate_audio = true;
  }

  // Per-model passthrough parameters
  const allowed = allowedPassthroughParameters ?? [];
  if (negativePrompt) {
    if (allowed.includes("negative_prompt")) {
      body.negative_prompt = negativePrompt;
    } else if (allowed.includes("negativePrompt")) {
      body.negativePrompt = negativePrompt;
    }
  }

  logger.debug("[OpenRouter Video] Submitting generation job", {
    model: providerModel,
    duration: durationSeconds,
    aspectRatio,
    resolution,
  });

  try {
    const submitRes = await fetchImpl("https://openrouter.ai/api/v1/videos", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const submitText = await submitRes.text();
    let submitData: OpenRouterVideoSubmitResponse;
    try {
      submitData = JSON.parse(submitText) as OpenRouterVideoSubmitResponse;
    } catch {
      return fail({
        message: t("post.errors.nonJsonResponse", {
          status: String(submitRes.status),
          body: submitText.slice(0, 200),
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (!submitRes.ok || submitData.error) {
      const reason = providerErrorMessage(submitData.error);
      if (submitRes.status === 404 && requiresLinkedKey(submitData.error)) {
        if (openRouterAccount === accountKey) {
          missingLinkedKey.set(
            providerModel,
            Date.now() + LINKED_KEY_RECHECK_MS,
          );
        }
        logger.error(
          "[OpenRouter Video] Model requires a linked provider key",
          {
            providerModel,
            status: submitRes.status,
            reason: "byok-only-missing-provider-key",
            retryAfterMs: LINKED_KEY_RECHECK_MS,
          },
        );
        return unavailableModel();
      }
      logger.error("[OpenRouter Video] Submit failed", {
        status: submitRes.status,
        error: reason ?? submitText.slice(0, 200),
        providerModel,
        frameCount: frameImageParts.length,
        referenceCount: inputReferenceParts.length,
      });
      return fail({
        message: reason
          ? t("post.errors.providerError", { error: reason })
          : t("post.errors.providerHttpError", {
              status: String(submitRes.status),
              body: submitText.slice(0, 200),
            }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const jobId = submitData.id;
    const pollUrl = `https://openrouter.ai/api/v1/videos/${jobId}`;

    logger.debug("[OpenRouter Video] Job submitted, polling", { jobId });

    // Fixture replay: pollDelay collapses to 10ms only when the PREVIOUS provider
    // response was a fixture replay (marked via x-vibe-fixture-replay). Seed it
    // with the submit response and advance it each poll, so a recorded run replays
    // instantly instead of sleeping the full real interval every attempt.
    let lastResponse: Response = submitRes;
    const pollStartedAt = Date.now();
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await pollDelay(POLL_INTERVAL_MS, lastResponse);

      const statusRes = await fetchImpl(pollUrl, { method: "GET", headers });
      lastResponse = statusRes;
      const statusText = await statusRes.text();
      let statusData: OpenRouterVideoStatusResponse;
      try {
        statusData = JSON.parse(statusText) as OpenRouterVideoStatusResponse;
      } catch {
        logger.warn("[OpenRouter Video] Non-JSON poll response, retrying", {
          attempt,
        });
        continue;
      }

      logger.debug("[OpenRouter Video] Poll status", {
        attempt,
        status: statusData.status,
      });

      if (statusData.status === "completed") {
        const videoUrl = statusData.unsigned_urls?.[0];
        if (!videoUrl) {
          return fail({
            message: t("post.errors.noVideoUrl"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        const upstreamCostUsd = statusData.usage?.cost;
        logger.debug("[OpenRouter Video] Generation complete", { videoUrl });
        // The completed video URL is an OpenRouter /videos/<id>/content endpoint
        // that STILL requires the Bearer auth header — a bare GET returns 401 and
        // the "video" downloaded for storage is a tiny error JSON (broken .mp4).
        // Hand the caller the headers it must use to fetch the bytes.
        return success({
          videoUrl,
          upstreamCostUsd,
          downloadHeaders: {
            Authorization: headers.Authorization,
          },
        });
      }

      if (
        statusData.status === "failed" ||
        statusData.status === "cancelled" ||
        statusData.status === "expired"
      ) {
        const reason = providerErrorMessage(statusData.error);
        logger.error("[OpenRouter Video] Job terminal failure", {
          status: statusData.status,
          error: reason,
          // Which upstream model failed and after how long (outage vs. a
          // model-specific rejection); the user is not charged on this path.
          providerModel,
          jobId,
          pollAttempts: attempt + 1,
          elapsedMs: Date.now() - pollStartedAt,
        });
        return fail({
          message: reason
            ? t("post.errors.providerError", { error: reason })
            : t("post.errors.jobFailedStatus", { status: statusData.status }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
    }

    return fail({
      message: t("post.errors.requestTimedOut"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("[OpenRouter Video] Request failed", { error: errorMessage });
    return fail({
      message: t("post.errors.providerError", { error: errorMessage }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}
