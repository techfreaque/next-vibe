/**
 * Cron Queue API Route Handler
 * Returns enabled tasks sorted by next execution time (queue order).
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import { endpoints } from "./definition";
import { CronQueueRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, user, locale, t, logger }) =>
      CronQueueRepository.getQueue(data, user, locale, t, logger),
  },
});
