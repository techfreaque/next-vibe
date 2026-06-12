/**
 * Remove Estimate Line Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import estimateLineDefinitions from "./definition";
import { EstimateLineRemoveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: estimateLineDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      EstimateLineRemoveRepository.removeLine(
        user.id,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
