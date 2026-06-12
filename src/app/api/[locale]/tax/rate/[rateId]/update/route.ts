/**
 * Tax Rate Update Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
