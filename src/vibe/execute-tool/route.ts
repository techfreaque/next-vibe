/**
 * Route Execute Route
 * POST /api/[locale]/system/unified-interface/execute-tool
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
      "tool-execute-request": (props) =>
        RouteExecuteRepository.handleIncomingToolRequest(props),
      "tool-execute-result": (props) =>
        RouteExecuteRepository.handleToolResult(props),
    },
  },
});
