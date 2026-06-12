/**
 * Add Estimate Line Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import estimateLineDefinitions from "./definition";
import { EstimateLineAddRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: estimateLineDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      EstimateLineAddRepository.addLine(user.id, data, logger, locale),
  },
});
