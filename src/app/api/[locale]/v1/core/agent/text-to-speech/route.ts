/**
 * Text-to-Speech API Route
 * Handles text-to-speech conversion requests
 */

import "server-only";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

import endpoints from "./definition";
import { textToSpeechRepository } from "./repository";

/**
 * Export endpoint handlers
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      return await textToSpeechRepository.convertTextToSpeech(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
