/**
 * Public Free-Tier Daily Cap Route Handler
 * /api/credits/public-cap
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { PublicCapRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ logger, t }) => PublicCapRepository.getStatus(logger, t),
  },
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      PublicCapRepository.updateCap(data.capAmount, logger, t),
  },
});
