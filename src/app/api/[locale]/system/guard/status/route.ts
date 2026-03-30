/**
 * Guard Status Route Handler
 * Handles GET requests for checking guard status
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import guardStatusEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: guardStatusEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger, t }) => {
      const { GuardStatusRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return GuardStatusRepository.getStatus(data, logger, t);
    },
  },
});
