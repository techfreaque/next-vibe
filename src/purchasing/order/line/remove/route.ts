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
    handler: ({ data, user, logger, locale }) =>
      OrderLineRemoveRepository.removeLine(
        data.poId,
        data.lineId,
        user.id,
        logger,
        locale,
      ),
  },
});
