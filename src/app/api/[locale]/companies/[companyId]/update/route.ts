/**
 * Company Update API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CompanyUpdateRepository } from "./repository";
import definitions from "./definition";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ urlPathParams, data, logger, user, locale }) =>
      CompanyUpdateRepository.updateCompany(
        urlPathParams.companyId,
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
