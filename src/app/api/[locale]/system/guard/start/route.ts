/**
 * Guard Start Route Handler
 * Handles POST requests for starting guard environments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import guardStartEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: guardStartEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { GuardStartRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return GuardStartRepository.startGuard(data, logger, t);
    },
  },
});
