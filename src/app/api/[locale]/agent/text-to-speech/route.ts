/**
 * Text-to-Speech API Route
 * Handles text-to-speech conversion requests
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { TextToSpeechRepository } from "./repository";

/**
 * Export endpoint handlers
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t }) =>
      TextToSpeechRepository.convertTextToSpeech(data, user, locale, logger, t),
  },
});
