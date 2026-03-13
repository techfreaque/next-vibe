/**
 * Cron Queue API Route Handler
 * Returns enabled tasks sorted by next execution time (queue order).
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { cronQueueRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, user, locale, t, logger }) => {
      return await cronQueueRepository.getQueue(data, user, locale, t, logger);
    },
  },
});
