/**
 * Browser API Route Handlers
 * Next.js API route handlers for Chrome DevTools MCP tool execution
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import browserEndpoints from "./definition";
import { browserRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: browserEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      // Execute the Chrome DevTools MCP tool
      const result = await browserRepository.executeTool(
        data,
        user,
        logger,
        locale,
      );

      return result;
    },
  },
});
