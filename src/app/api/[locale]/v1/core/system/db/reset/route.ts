/**
 * Database Reset Route
 * API route for resetting database
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import resetEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: resetEndpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger }) => {
      // Lazy import to avoid creating database connections during route discovery
      const { databaseResetRepository } = await import("./repository");
      return await databaseResetRepository.resetDatabase(data, locale, logger);
    },
  },
});
