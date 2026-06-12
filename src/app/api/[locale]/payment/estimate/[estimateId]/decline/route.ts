/**
 * Estimate Decline Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import estimateDefinitions from "./definition";
import { EstimateDeclineRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: estimateDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      EstimateDeclineRepository.declineEstimate(
        user.id,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
