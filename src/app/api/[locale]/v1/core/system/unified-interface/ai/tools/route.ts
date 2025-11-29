import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { definitionsRegistry } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definitions/registry";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/platform";

import toolsDefinition from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: toolsDefinition,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, logger, locale }) => {
      const tools = definitionsRegistry.getSerializedToolsForUser(
        Platform.AI,
        user,
        locale,
        logger,
      );
      return success({ tools });
    },
  },
});
