/**
 * Database Migration Route
 * API route for running database migrations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import migrateEndpoints from "./definition";
import { databaseMigrationRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: migrateEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return databaseMigrationRepository.runMigrations(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
