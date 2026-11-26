/**
 * Company Subscription Get Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CompanySubscriptionGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      CompanySubscriptionGetRepository.getCompanySubscription(
        urlPathParams.companyId,
        user.id,
        logger,
        locale,
      ),
  },
});
