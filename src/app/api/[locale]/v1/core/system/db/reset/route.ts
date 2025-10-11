/**
 * Database Reset Route
 * API route for resetting database
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

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
