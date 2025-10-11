/**
 * Database Migration Route
 * API route for running database migrations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

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
