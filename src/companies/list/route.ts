/**
 * Companies List API Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CompaniesListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, logger, user, locale }) =>
      CompaniesListRepository.listUserCompanies(user.id, data, logger, locale),
  },
});
