import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { NotificationConfigListRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      NotificationConfigListRepository.list(
        urlPathParams,
        { page: data.page, pageSize: data.pageSize },
        logger,
        locale,
      ),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      NotificationConfigListRepository.create(
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
