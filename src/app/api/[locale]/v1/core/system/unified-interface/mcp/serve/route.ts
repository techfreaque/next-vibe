import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import serveDefinition from "./definition";
import { mcpServeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: serveDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) => {
      return await mcpServeRepository.startServer(data, user, logger, locale);
    },
  },
});
