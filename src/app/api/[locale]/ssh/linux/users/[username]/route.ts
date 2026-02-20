import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { LinuxUserDeleteRepository } from "./repository";

export const { DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.DELETE]: {
    handler: ({ data, logger, urlPathParams }) =>
      LinuxUserDeleteRepository.delete(
        data,
        logger,
        urlPathParams?.["username"] ?? "",
      ),
  },
});
