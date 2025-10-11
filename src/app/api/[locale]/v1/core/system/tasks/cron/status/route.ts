/**
 * Cron Status Route
 * API routes for cron system status monitoring
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { GET as cronStatusEndpoint } from "./definition";
import { cronStatusRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: cronStatusEndpoint,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      cronStatusRepository.getStatus(data, user, locale, logger),
  },
});
