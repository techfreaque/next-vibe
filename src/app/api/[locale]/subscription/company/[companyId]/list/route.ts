/**
 * Company Subscription List Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CompanySubscriptionListRepository } from "./repository";
import definitions from "./definition";

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
