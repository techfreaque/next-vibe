/**
 * Vibe Check Route Handler
 * Handles POST requests for comprehensive code quality checks
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import vibeCheckEndpoints from "./definition";
import { VibeCheckRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeCheckEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, platform, t, locale, streamContext }) =>
      VibeCheckRepository.execute(
        data,
        logger,
        platform,
        t,
        locale,
        streamContext.abortSignal,
      ),
  },
});
