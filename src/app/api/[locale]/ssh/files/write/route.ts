/**
 * SSH Files Write Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, user, t }) => {
      const { FilesWriteRepository } = await import("./repository");
      return FilesWriteRepository.write(data, logger, user, t);
    },
  },
});
