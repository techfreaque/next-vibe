import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { NotificationConfigByIdRepository } from "./repository";

export const { POST, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      NotificationConfigByIdRepository.update(
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      NotificationConfigByIdRepository.deleteConfig(
        urlPathParams,
        logger,
        locale,
      ),
  },
});
