/**
 * Purchase Order Line Remove Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { OrderLineRemoveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      OrderLineRemoveRepository.removeLine(
        urlPathParams.poId,
        urlPathParams.lineId,
        user.id,
        logger,
        locale,
      ),
  },
});
