/**
 * POST /v1/audio/transcriptions and /v1/audio/translations - OpenAI shapes
 * over the speech-to-text tool. The tool repository routes the model, checks
 * credits and bills (the provider's reported cost x markup where it reports
 * one, the model's listed per-second price otherwise); this layer picks the
 * model and renders the transcript in the requested response_format.
 */

import "server-only";

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { ApiProvider } from "next-vibe/agent/models/models";
import {
  SpeechToTextRepository,
  type SttSegment,
  type SttTranscription,
} from "next-vibe/agent/speech-to-text/repository";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  createStreamingResponse,
  type StreamingResponse,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../../i18n";
import { V1_MAX_AUDIO_BYTES } from "../../shared/constants";
import { v1Error } from "../../shared/errors";
import { gateApiKeyRequest } from "../../shared/gate";
import {
  mediaConsentError,
  mediaToolContext,
  v1ErrorFromToolFailure,
} from "../../shared/media";
import { resolveV1TranscriptionModel } from "../../shared/media-models";
import { openAiErrorResponse, openAiJson } from "../../shared/openai";
import type { V1TranscriptionFormat } from "./definition";

/** Spoken words per second, to time a single cue when the provider gave no duration. */
const WORDS_PER_SECOND = 2.5;

function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}

function timestamp(seconds: number, separator: "," | "."): string {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const ms = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  return `${pad(h)}:${pad(m)}:${pad(s)}${separator}${pad(ms, 3)}`;
}

/** Timed segments, or one segment over the whole clip when the provider gave none. */
export function transcriptSegments(
  result: Pick<SttTranscription, "text" | "duration" | "segments">,
): SttSegment[] {
  if (result.segments && result.segments.length > 0) {
    return result.segments;
  }
  const words = result.text.split(/\s+/).filter(Boolean).length;
  const end =
    result.duration > 0
      ? result.duration
      : Math.max(1, words / WORDS_PER_SECOND);
  return [{ start: 0, end, text: result.text }];
}

export function toSrt(segments: SttSegment[]): string {
  return `${segments
    .map(
      (segment, index) =>
        `${String(index + 1)}\n${timestamp(segment.start, ",")} --> ${timestamp(segment.end, ",")}\n${segment.text}\n`,
    )
    .join("\n")}`;
}

export function toVtt(segments: SttSegment[]): string {
  return `WEBVTT\n\n${segments
    .map(
      (segment) =>
        `${timestamp(segment.start, ".")} --> ${timestamp(segment.end, ".")}\n${segment.text}\n`,
    )
    .join("\n")}`;
}

function textResponse(
  body: string,
  contentType: string,
  credits: number,
): StreamingResponse {
  return createStreamingResponse(
    new Response(body, {
      status: 200,
      headers: {
        "Content-Type": `${contentType}; charset=utf-8`,
        "X-Credits-Charged": String(credits),
      },
    }),
  );
}

export class V1AudioTranscriptionsRepository {
  static async transcribe(params: {
    data: {
      file: File;
      model: string;
      language?: string;
      response_format?: V1TranscriptionFormat;
    };
    task: "transcribe" | "translate";
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    request: Request | undefined;
    t: V1T;
    toolExecutionContext: ToolExecutionContext;
  }): Promise<StreamingResponse> {
    const { data, task, user, locale, logger, request, t } = params;
    const gate = await gateApiKeyRequest(user, request, locale, t, logger);
    if (!gate.ok) {
      return openAiErrorResponse(gate.error);
    }
    if (data.file.size > V1_MAX_AUDIO_BYTES) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.audioTooLarge"),
          "invalid_request_error",
          "file_too_large",
          "file",
        ),
      );
    }
    if (data.file.size === 0) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.fileRequired"),
          "invalid_request_error",
          "invalid_value",
          "file",
        ),
      );
    }
    const route = resolveV1TranscriptionModel(
      data.model,
      gate.user,
      await getEnvAvailability(),
    );
    if (!route) {
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
    if (task === "translate" && route.apiProvider !== ApiProvider.OPENAI_STT) {
      return openAiErrorResponse(
        v1Error(
          400,
          t("media.errors.translationUnsupported", { model: route.id }),
          "invalid_request_error",
          "invalid_value",
          "model",
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

    const result = await SpeechToTextRepository.transcribe(
      [data.file],
      gate.user,
      locale,
      logger,
      route.id,
      mediaToolContext(params.toolExecutionContext, request?.signal, undefined),
      { language: data.language?.toLowerCase(), task },
    );
    if (!result.success) {
      return openAiErrorResponse(v1ErrorFromToolFailure(result));
    }
    const transcript = result.data;
    const credits = transcript.creditCost;
    switch (data.response_format ?? "json") {
      case "text":
        return textResponse(transcript.text, "text/plain", credits);
      case "srt":
        return textResponse(
          toSrt(transcriptSegments(transcript)),
          "application/x-subrip",
          credits,
        );
      case "vtt":
        return textResponse(
          toVtt(transcriptSegments(transcript)),
          "text/vtt",
          credits,
        );
      case "verbose_json":
        return openAiJson({
          task,
          language: task === "translate" ? "en" : transcript.language,
          duration: transcript.duration,
          text: transcript.text,
          segments: transcriptSegments(transcript).map((segment, id) => ({
            id,
            start: segment.start,
            end: segment.end,
            text: segment.text,
          })),
          model: transcript.sttModelId,
          credits_charged: credits,
        });
      default:
        return openAiJson({
          text: transcript.text,
          usage: { type: "duration", seconds: Math.ceil(transcript.duration) },
          model: transcript.sttModelId,
          credits_charged: credits,
        });
    }
  }
}
