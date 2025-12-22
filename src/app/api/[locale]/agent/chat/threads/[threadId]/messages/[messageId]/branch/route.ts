/**
 * Branch Message Route Handler
 * Handles POST requests for creating message branches
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { definitions } from "./definition";
import { branchRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, locale, logger }) =>
      branchRepository.createBranch(urlPathParams, data, user, locale, logger),
  },
});
