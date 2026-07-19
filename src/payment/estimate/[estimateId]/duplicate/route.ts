/**
 * Duplicate Estimate Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
