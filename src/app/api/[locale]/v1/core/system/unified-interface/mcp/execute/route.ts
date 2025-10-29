import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import executeDefinition from "./definition";
import { mcpExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: executeDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) =>
      await mcpExecuteRepository.executeTool(data, user, logger, locale),
  }
});
