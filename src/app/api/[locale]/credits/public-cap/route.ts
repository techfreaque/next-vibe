/**
 * Public Free-Tier Daily Cap Route Handler
 * /api/credits/public-cap
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { PublicCapRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ logger, t }) => {
      return await PublicCapRepository.getStatus(logger, t);
    },
  },
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      return await PublicCapRepository.updateCap(data.capAmount, logger, t);
    },
  },
});
