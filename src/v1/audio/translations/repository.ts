/**
 * POST /v1/audio/translations - speech to English text. Same pipeline as
 * transcriptions (model choice, credits, billing, response formats) with the
 * translate task, which only Whisper on OpenAI serves.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../../i18n";
import { V1AudioTranscriptionsRepository } from "../transcriptions/repository";
import type { V1AudioTranslationsPostRequestOutput } from "./definition";

export class V1AudioTranslationsRepository {
  static translate(params: {
    data: V1AudioTranslationsPostRequestOutput;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    request: Request | undefined;
    t: V1T;
    toolExecutionContext: ToolExecutionContext;
  }): Promise<StreamingResponse> {
    return V1AudioTranscriptionsRepository.transcribe({
      ...params,
      task: "translate",
    });
  }
}
