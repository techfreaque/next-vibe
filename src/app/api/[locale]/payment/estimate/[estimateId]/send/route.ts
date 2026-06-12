/**
 * Estimate Send Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import estimateDefinitions from "./definition";
import { EstimateSendRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: estimateDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      EstimateSendRepository.sendEstimate(
        user.id,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
