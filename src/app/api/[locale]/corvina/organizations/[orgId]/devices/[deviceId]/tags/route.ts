import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CorvinaDeviceTagsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      CorvinaDeviceTagsRepository.getTags(urlPathParams, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      CorvinaDeviceTagsRepository.setTagValue(
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
