/**
 * Purchase Order Receive Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { OrderReceiveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      OrderReceiveRepository.receiveOrder(
        urlPathParams.poId,
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
