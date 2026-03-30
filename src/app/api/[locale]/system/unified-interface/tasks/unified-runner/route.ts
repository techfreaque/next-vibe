/**
 * Unified Task Runner Route
 * Handles unified task runner management operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { UnifiedTaskRunnerRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return UnifiedTaskRunnerRepository.manageRunner(
        data,
        user,
        locale,
        logger,
        true,
      );
    },
  },
});
