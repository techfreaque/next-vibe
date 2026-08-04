/**
 * Cron Stats Route
 * API routes for cron task statistics
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import definitions from "./definition";
import { CronStatsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, t, logger }) =>
      CronStatsRepository.getStats(data, user, t, logger),
  },
});
