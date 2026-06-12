/**
 * Duplicate Estimate Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import estimateDefinitions from "./definition";
import { EstimateDuplicateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: estimateDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      EstimateDuplicateRepository.duplicateEstimate(
        user.id,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
