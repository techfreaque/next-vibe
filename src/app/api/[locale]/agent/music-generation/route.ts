/**
 * Music Generation API Route
 * Handles music generation requests via multiple AI providers
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { MusicGenerationRepository } from "./repository";

/**
 * Export endpoint handlers
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, streamContext }) =>
      MusicGenerationRepository.generateMusic(
        data,
        user,
        locale,
        logger,
        t,
        streamContext,
      ),
    requestDefaults: (ctx) => MusicGenerationRepository.getRequestDefaults(ctx),
  },
});
