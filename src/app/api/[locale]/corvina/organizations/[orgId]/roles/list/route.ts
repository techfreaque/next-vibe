import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CorvinaRolesListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      CorvinaRolesListRepository.list(
        urlPathParams,
        {
          orgId: urlPathParams.orgId,
          page: data.page,
          pageSize: data.pageSize,
        },
        logger,
        locale,
      ),
  },
});
