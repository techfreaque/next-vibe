/**
 * Company Subscription Get Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CompanySubscriptionGetRepository } from "./repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, locale }) =>
      CompanySubscriptionGetRepository.getCompanySubscription(
        urlPathParams.companyId,
        logger,
        locale,
      ),
  },
});
