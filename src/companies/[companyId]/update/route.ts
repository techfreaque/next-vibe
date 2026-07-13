/**
 * Company Update API Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CompanyUpdateRepository } from "./repository";

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
