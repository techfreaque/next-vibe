/**
 * Cron Stats Route
 * API routes for cron task statistics
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { GET as cronStatsEndpoint } from "./definition";
import { cronStatsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: cronStatsEndpoint,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      cronStatsRepository.getStats(data, user, locale, logger),
  },
});
