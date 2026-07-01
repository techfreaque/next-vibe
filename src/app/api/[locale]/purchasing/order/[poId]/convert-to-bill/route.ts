/**
 * Purchase Order Convert to Bill Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { OrderConvertToBillRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      OrderConvertToBillRepository.convertToBill(
        urlPathParams.poId,
        user.id,
        logger,
        locale,
      ),
  },
});
