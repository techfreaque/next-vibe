/**
 * Route Execute Route
 * POST /api/[locale]/system/unified-interface/execute-tool
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import executeDefinition from "./definition";
import { RouteExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: executeDefinition,
  [Methods.POST]: {
    handler: async ({
      data,
      user,
      locale,
      logger,
      t,
      streamContext,
      platform,
    }) =>
      RouteExecuteRepository.execute(
        data,
        user,
        locale,
        logger,
        t,
        streamContext,
        platform,
      ),
    onRemoteEvent: {
      "tool-execute-request": async (payload, ctx) =>
        RouteExecuteRepository.handleIncomingToolRequest({
          raw: payload,
          executedByInstance: ctx.instanceId,
          logger: ctx.logger,
          localUserId:
            "id" in ctx.user && typeof ctx.user.id === "string"
              ? ctx.user.id
              : undefined,
        }),
      "tool-execute-result": async (payload, ctx) =>
        RouteExecuteRepository.handleToolResult(payload, ctx.logger),
    },
  },
});
