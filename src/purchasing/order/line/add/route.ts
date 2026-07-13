/**
 * Purchase Order Line Add Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { OrderLineAddRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      OrderLineAddRepository.addLine(
        urlPathParams.poId,
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
