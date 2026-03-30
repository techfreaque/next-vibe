import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.DELETE]: {
    handler: async ({ data, logger, urlPathParams, t }) => {
      const { LinuxUserDeleteRepository } = await import("./repository");
      return LinuxUserDeleteRepository.delete(
        data,
        logger,
        urlPathParams?.["username"] ?? "",
        t,
      );
    },
  },
});
