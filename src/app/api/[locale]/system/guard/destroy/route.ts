/**
 * Guard Destroy Route Handler
 * Handles POST requests for destroying guard environments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import guardDestroyEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: guardDestroyEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger, t }) => {
      const { GuardDestroyRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return GuardDestroyRepository.destroyGuard(data, logger, t);
    },
  },
});
