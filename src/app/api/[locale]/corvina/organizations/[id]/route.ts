/**
 * Corvina Organization By ID Route Handler
 * GET / PATCH / DELETE on /corvina/organizations/[id]
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CorvinaOrganizationByIdRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, t }) =>
      CorvinaOrganizationByIdRepository.getById(urlPathParams, logger, t),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, t }) =>
      CorvinaOrganizationByIdRepository.update(urlPathParams, data, logger, t),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, t }) =>
      CorvinaOrganizationByIdRepository.deleteById(urlPathParams, logger, t),
  },
});
