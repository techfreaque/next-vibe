/**
 * Server Start Route Handler
 * Handles POST requests for starting the production server
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import startEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: startEndpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      const { ServerStartRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return ServerStartRepository.startServer(data, user, locale, logger);
    },
  },
});
