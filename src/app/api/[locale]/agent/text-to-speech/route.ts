/**
 * Text-to-Speech API Route
 * Handles text-to-speech conversion requests
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { TextToSpeechRepository } from "./repository";

/**
 * Export endpoint handlers
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      TextToSpeechRepository.convertTextToSpeech(data, user, locale, logger),
  },
});
