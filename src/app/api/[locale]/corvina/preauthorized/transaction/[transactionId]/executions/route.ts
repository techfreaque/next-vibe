import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { PreauthorizedExecutionsListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      PreauthorizedExecutionsListRepository.list(
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
