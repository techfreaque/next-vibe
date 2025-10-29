import { createSuccessResponse } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import toolsDefinition from "./definition";
import { aiToolsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: toolsDefinition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) => {
      const toolsData = aiToolsRepository.getTools(data, user, logger, locale);
      return createSuccessResponse(toolsData);
    },
  },
});
