import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import helpEndpoints from "./definition";
import { HelpRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: helpEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, platform, locale }) =>
      HelpRepository.getTools(data, user, locale, platform, logger),
  },
});
