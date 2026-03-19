/**
 * Database Migration Repair API Route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { DatabaseMigrateRepairRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) =>
      DatabaseMigrateRepairRepository.repairMigrations(data, t, logger),
  },
});
