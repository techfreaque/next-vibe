/**
 * Database Migration Route
 * API route for running database migrations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import migrateEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: migrateEndpoints,
  [Methods.POST]: {
    handler: async ({ t, logger }) => {
      const { DatabaseMigrationRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return DatabaseMigrationRepository.runMigrations(t, logger);
    },
  },
});
