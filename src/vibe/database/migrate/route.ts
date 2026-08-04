/**
 * Database Migration Route
 * API route for running database migrations
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import migrateEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: migrateEndpoints,
  [Methods.POST]: {
    handler: async ({ t, logger }) =>
      (await import("./repository")).DatabaseMigrationRepository.runMigrations(
        t,
        logger,
      ),
  },
});
