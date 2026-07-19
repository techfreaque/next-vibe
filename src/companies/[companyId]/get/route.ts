/**
 * Company Get API Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
