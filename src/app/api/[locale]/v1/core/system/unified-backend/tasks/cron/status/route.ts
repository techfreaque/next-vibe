/**
 * Cron Status Route
 * API routes for cron system status monitoring
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { GET as cronStatusEndpoint } from "./definition";
import { cronStatusRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: cronStatusEndpoint,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      cronStatusRepository.getStatus(data, user, locale, logger),
  },
});
