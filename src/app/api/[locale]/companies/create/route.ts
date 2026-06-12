/**
 * Companies Create API Route Handler
 * Handles POST requests to create a new company
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CompaniesCreateRepository } from "./repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, user, locale }) =>
      CompaniesCreateRepository.createCompany(data, logger, user.id, locale),
  },
});
