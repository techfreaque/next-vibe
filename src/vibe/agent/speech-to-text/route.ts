/**
 * Speech-to-Text Route Handler
 * Production-ready route handler following established pattern
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { SpeechToTextRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, toolExecutionContext }) =>
      SpeechToTextRepository.transcribeAudio(
        data.fileUpload.files,
        user,
        locale,
        logger,
        data.modelId,
        toolExecutionContext,
      ),
  },
});
