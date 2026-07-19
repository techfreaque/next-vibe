/**
 * Tax Rate Update Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { TaxRateUpdateRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ urlPathParams, data, user, logger, locale }) =>
      TaxRateUpdateRepository.update(
        urlPathParams,
        data,
        user.id,
        logger,
        locale,
      ),
  },
});
