import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { DeviceLicenseDeviceRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      DeviceLicenseDeviceRepository.getBySerialAndKey(data, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      DeviceLicenseDeviceRepository.getByBody(data, logger, locale),
  },
});
