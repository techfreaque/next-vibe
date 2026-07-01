/**
 * Company Subscription List Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CompanySubscriptionListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, locale }) =>
      CompanySubscriptionListRepository.listCompanySubscriptions(
        urlPathParams.companyId,
        logger,
        locale,
      ),
  },
});
