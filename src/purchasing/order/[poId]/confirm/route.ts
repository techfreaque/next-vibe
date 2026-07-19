/**
 * Purchase Order Confirm Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { OrderConfirmRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      OrderConfirmRepository.confirmOrder(
        urlPathParams.poId,
        user.id,
        logger,
        locale,
      ),
  },
});
