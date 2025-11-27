import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { definitionsRegistry } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definitions/registry";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/platform";
import { toolMetadataToMCPTool } from "../converter";

import toolsDefinition from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: toolsDefinition,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, logger, locale }) => {
      // Get serialized tools from shared registry
      const toolsMetadata = definitionsRegistry.getSerializedToolsForUser(
        Platform.MCP,
        user,
        locale,
        logger,
      );

      // Convert to MCP wire format
      const mcpTools = toolsMetadata.map((meta) =>
        toolMetadataToMCPTool(meta, locale),
      );

      return success({ tools: mcpTools });
    },
  },
});
