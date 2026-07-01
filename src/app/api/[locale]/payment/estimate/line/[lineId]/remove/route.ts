/**
 * Remove Estimate Line Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
