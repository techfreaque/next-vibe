/**
 * Vibe Stage Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import vibeStageEndpoints from "./definition";
import { VibeStageRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeStageEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale, t }) =>
      VibeStageRepository.execute(data, logger, locale, t),
  },
});
