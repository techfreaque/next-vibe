/**
 * Bounce Processor Configuration API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { BounceProcessorConfigRepository } from "./repository";

export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, t, logger }) => {
      return await BounceProcessorConfigRepository.getConfig(user, t, logger);
    },
  },
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data, user, t, logger }) => {
      return await BounceProcessorConfigRepository.updateConfig(
        data,
        user,
        t,
        logger,
      );
    },
  },
});
