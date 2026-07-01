/**
 * Chart of Accounts — Period Get Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CoaPeriodGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      CoaPeriodGetRepository.getPeriod(
        urlPathParams.periodId,
        user.id,
        logger,
        locale,
      ),
  },
});
