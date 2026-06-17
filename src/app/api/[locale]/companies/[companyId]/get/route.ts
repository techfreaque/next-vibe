/**
 * Company Get API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CompanyGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, user, locale }) =>
      CompanyGetRepository.getCompany(
        urlPathParams.companyId,
        user.id,
        logger,
        locale,
      ),
  },
});
