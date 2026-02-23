/**
 * Database Migration Route
 * API route for running database migrations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import migrateEndpoints from "./definition";
import { databaseMigrationRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: migrateEndpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) => {
      return databaseMigrationRepository.runMigrations(data, t, logger);
    },
  },
});
