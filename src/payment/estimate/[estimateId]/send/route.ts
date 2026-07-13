/**
 * Estimate Send Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
