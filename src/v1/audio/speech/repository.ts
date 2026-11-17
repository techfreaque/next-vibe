/**
 * POST /v1/audio/speech - OpenAI speech shape over the text-to-speech tool.
 * The tool repository routes the voice, checks credits and bills (the
 * provider's reported cost x markup where it reports one, the voice's listed
 * per-character price otherwise); this layer picks the voice, checks the
 * format, and answers with the audio bytes.
 */

import "server-only";

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { scopedTranslation as ttsScopedTranslation } from "next-vibe/agent/text-to-speech/i18n";
import {
  TextToSpeechRepository,
  TTS_FORMATS_BY_PROVIDER,
  TTS_SPEED_PROVIDERS,
} from "next-vibe/agent/text-to-speech/repository";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  createStreamingResponse,
  type StreamingResponse,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../../i18n";
import { v1Error } from "../../shared/errors";
import { gateApiKeyRequest } from "../../shared/gate";
import {
  decodeDataUri,
  mediaConsentError,
  mediaToolContext,
  readStoredMediaUrl,
  v1ErrorFromToolFailure,
} from "../../shared/media";
import { resolveV1SpeechVoice } from "../../shared/media-models";
import { openAiErrorResponse } from "../../shared/openai";
import type { V1AudioSpeechPostRequestOutput } from "./definition";

/** Content-Type per OpenAI response_format, when the provider sends a generic one. */
const FORMAT_MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  opus: "audio/opus",
  aac: "audio/aac",
  flac: "audio/flac",
  wav: "audio/wav",
  pcm: "audio/pcm",
};

export class V1AudioSpeechRepository {
  static async speak(params: {
    data: V1AudioSpeechPostRequestOutput;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    request: Request | undefined;
    t: V1T;
    toolExecutionContext: ToolExecutionContext;
  }): Promise<StreamingResponse> {
    const { data, user, locale, logger, request, t } = params;
    const gate = await gateApiKeyRequest(user, request, locale, t, logger);
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    const route = resolveV1SpeechVoice(
      data.model,
      data.voice,
      gate.user,
      await getEnvAvailability(),
    );
    if (!route) {
      return openAiErrorResponse(
        v1Error(
          404,
          t("media.errors.voiceNotFound", {
            voice: data.voice ? `${data.model} / ${data.voice}` : data.model,
          }),
          "not_found_error",
          "model_not_found",
          data.voice ? "voice" : "model",
        ),
      );
    }
    const format = data.response_format ?? "mp3";
    const formats = TTS_FORMATS_BY_PROVIDER[route.apiProvider] ?? ["mp3"];
    if (!formats.includes(format)) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.formatUnsupported", {
            voice: route.id,
            supported: formats.join(", "),
          }),
          "invalid_request_error",
          "unsupported_response_format",
          "response_format",
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

    const { t: ttsT } = ttsScopedTranslation.scopedT(locale);
    // No thread: the tool hands the audio back inline instead of storing it.
    const result = await TextToSpeechRepository.convertTextToSpeech(
      { text: data.input, voiceId: route.id },
      gate.user,
      locale,
      logger,
      ttsT,
      mediaToolContext(params.toolExecutionContext, request?.signal, undefined),
      {
        // Always name it: some OpenAI-compatible providers (NanoGPT Kokoro)
        // default to wav, not OpenAI's mp3.
        format,
        speed:
          data.speed !== undefined &&
          data.speed !== 1 &&
          TTS_SPEED_PROVIDERS.includes(route.apiProvider)
            ? data.speed
            : undefined,
      },
    );
    if (!result.success) {
      return openAiErrorResponse(v1ErrorFromToolFailure(result));
    }
    const audio =
      decodeDataUri(result.data.audioUrl) ??
      (await readStoredMediaUrl(result.data.audioUrl));
    if (!audio) {
      logger.error("[v1/audio/speech] Audio not readable after generation", {
        voice: route.id,
      });
      return openAiErrorResponse(
        v1Error(
          502,
          t("media.errors.storageFailed"),
          "server_error",
          "upstream_error",
        ),
      );
    }
    // The provider's own type wins (it says what the bytes are); generic
    // types (application/octet-stream) get the requested format's type.
    const mimeType = audio.mimeType.startsWith("audio/")
      ? audio.mimeType
      : (FORMAT_MIME[format] ?? audio.mimeType);
    return createStreamingResponse(
      new Response(new Uint8Array(audio.buffer), {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": String(audio.buffer.length),
          "X-Credits-Charged": String(result.data.creditCost ?? 0),
          "X-Voice": route.id,
        },
      }),
    );
  }
}
