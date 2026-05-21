import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { SecurityPolicyDetailRepository } from "./repository";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      SecurityPolicyDetailRepository.getById(urlPathParams, logger, locale),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      SecurityPolicyDetailRepository.update(
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      SecurityPolicyDetailRepository.deleteById(urlPathParams, logger, locale),
  },
});
