/**
 * Database Production Migration API Route
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import endpoints from "./definition";
import { databaseMigrateProdRepository as repository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      repository.runProductionMigrations(data, user, locale, logger),
  },
});
