import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CorvinaOrgDeleteRepository } from "./repository";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      CorvinaOrgDeleteRepository.deleteOrg(urlPathParams, logger, locale),
  },
});
