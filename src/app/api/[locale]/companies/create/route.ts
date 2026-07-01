/**
 * Companies Create API Route Handler
 * Handles POST requests to create a new company
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CompaniesCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, user, locale }) =>
      CompaniesCreateRepository.createCompany(data, logger, user.id, locale),
  },
});
