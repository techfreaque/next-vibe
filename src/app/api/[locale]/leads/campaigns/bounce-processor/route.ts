/**
 * Bounce Processor Route Handler
 * POST: save config + run, GET: read config
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { BounceProcessorRepository } from "./repository";

export const { POST, GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t, platform }) =>
      BounceProcessorRepository.run(data, user, logger, t, platform),
  },
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, t, logger }) =>
      BounceProcessorRepository.getConfig(user, t, logger),
  },
});
