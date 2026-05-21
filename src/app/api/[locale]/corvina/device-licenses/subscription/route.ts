import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { DeviceSubscriptionRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      DeviceSubscriptionRepository.get(data, logger, t),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      DeviceSubscriptionRepository.upsert(data, logger, t),
  },
});
