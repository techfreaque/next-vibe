/**
 * Speech-to-Text Route Handler
 * Production-ready route handler following established pattern
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { speechToTextRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      return await speechToTextRepository.transcribeAudio(
        data.fileUpload.file,
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
