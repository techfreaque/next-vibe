/**
 * Vibe Stage Route Handler
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import vibeStageEndpoints from "./definition";
import { VibeStageRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeStageEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      VibeStageRepository.execute(data, logger, t),
  },
});
