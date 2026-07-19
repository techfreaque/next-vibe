/**
 * Public Free-Tier Daily Cap Route Handler
 * /api/credits/public-cap
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
