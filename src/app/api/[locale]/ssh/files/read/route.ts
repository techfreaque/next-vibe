/**
 * SSH Files Read Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, logger, user, t }) => {
      const { FilesReadRepository } = await import("./repository");
      return FilesReadRepository.read(data, logger, user, t);
    },
  },
});
