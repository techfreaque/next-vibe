/**
 * Server Development Route
 * Handles development server management operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger }) => {
      const { devRepository } = await import("./repository");
      return await devRepository.execute(data, locale, logger);
    },
  },
});
