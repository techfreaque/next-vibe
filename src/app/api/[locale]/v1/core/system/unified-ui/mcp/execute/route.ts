import { createSuccessResponse } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import executeDefinition from "./definition";
import { mcpExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: executeDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) => {
      const result = await mcpExecuteRepository.executeTool(
        data,
        user,
        logger,
        locale,
      );
      return createSuccessResponse(result);
    },
  },
});
