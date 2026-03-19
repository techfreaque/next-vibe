/**
 * Database Production Migration API Route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { DatabaseMigrateProdRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) =>
      DatabaseMigrateProdRepository.runProductionMigrations(data, t, logger),
  },
});
