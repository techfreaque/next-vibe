/**
 * Cron Task History API Route Handler
 * Handles GET requests for task execution history
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { CronHistoryRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, user, t, logger }) =>
      CronHistoryRepository.getTaskHistory(data, user, t, logger),
  },
});
