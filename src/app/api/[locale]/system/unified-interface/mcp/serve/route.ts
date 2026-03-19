import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import serveDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: serveDefinition,
  [Methods.POST]: {
    handler: async ({ logger, locale, user }) => {
      const { MCPServeRepository } = await import("./repository");
      return await MCPServeRepository.startServer(logger, locale, user);
    },
  },
});
