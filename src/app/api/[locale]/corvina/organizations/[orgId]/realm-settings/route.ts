import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { RealmSettingsRepository } from "./repository";

export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      RealmSettingsRepository.get(urlPathParams, logger, locale),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      RealmSettingsRepository.update(urlPathParams, data, logger, locale),
  },
});
