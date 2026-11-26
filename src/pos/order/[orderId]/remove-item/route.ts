/**
 * POS Order Remove Item API Route Handler
 */
import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PosOrderRemoveItemRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      PosOrderRemoveItemRepository.removeItem(
        data,
        user.id,
        logger,
        locale,
        urlPathParams.orderId,
      ),
  },
});
