/**
 * Company Onboard Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CompanyOnboardRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, logger, locale }) =>
      CompanyOnboardRepository.onboardCompany(
        user.id,
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
