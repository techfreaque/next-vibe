/**
 * Cron Task History API Route Handler
 * Handles GET requests for task execution history
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import endpoints from "./definition";
import { cronHistoryRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, locale, logger }) =>
      cronHistoryRepository.getTaskHistory(data, locale, logger),
  },
});
