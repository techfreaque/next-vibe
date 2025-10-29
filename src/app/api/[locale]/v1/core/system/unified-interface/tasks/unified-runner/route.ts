/**
 * Unified Task Runner Route
 * Handles unified task runner management operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      // Lazy import to avoid creating connections during route discovery
      const { unifiedTaskRunnerRepository } = await import("./repository");
      return await unifiedTaskRunnerRepository.manageRunner(
        data,
        user,
        locale,
        logger,
      );
    });
  });
});
