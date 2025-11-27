/**
 * Run database seeds Route
 * API route for run database seeds
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import seedEndpoints from "./definition";
import { seedRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: seedEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      logger.debug("🎯 Seed route handler called", { data, locale });
      return seedRepository.execute(data, locale, logger);
    },
  },
});
