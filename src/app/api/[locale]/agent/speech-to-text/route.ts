/**
 * Speech-to-Text Route Handler
 * Production-ready route handler following established pattern
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { SpeechToTextRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      SpeechToTextRepository.transcribeAudio(
        data.fileUpload.file,
        user,
        locale,
        logger,
      ),
  },
});
