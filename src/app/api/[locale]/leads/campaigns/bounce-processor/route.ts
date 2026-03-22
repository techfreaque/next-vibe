/**
 * Bounce Processor Route Handler
 * POST: save config + run, GET: read config
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { BounceProcessorRepository } from "./repository";

export const { POST, GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      BounceProcessorRepository.run(data, user, logger, t),
  },
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, t, logger }) =>
      BounceProcessorRepository.getConfig(user, t, logger),
  },
});
