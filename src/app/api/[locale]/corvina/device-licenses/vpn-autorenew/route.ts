import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { DeviceLicenseVpnAutorenewRepository } from "./repository";

export const { PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      DeviceLicenseVpnAutorenewRepository.update(data, logger, locale),
  },
});
