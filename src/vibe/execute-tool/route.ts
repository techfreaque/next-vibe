/**
 * Route Execute Route
 * POST /api/[locale]/system/unified-interface/execute-tool
 */

import { Methods } from "../core/definition/enums";
import { endpointsHandler } from "../core/route/multi";

import executeDefinition from "./definition";
import { RouteExecuteRepository } from "./repository";
import { handleIncomingToolRequest } from "./repository/incoming";
import { handleToolResult } from "./repository/result-handler";

export const { POST, tools } = endpointsHandler({
  endpoint: executeDefinition,
  [Methods.POST]: {
    handler: async ({
      data,
      user,
      locale,
      logger,
      t,
      toolExecutionContext,
      platform,
    }) =>
      RouteExecuteRepository.execute(
        data,
        user,
        locale,
        logger,
        t,
        toolExecutionContext,
        platform,
      ),
    onRemoteEvent: {
      "tool-execute-request": (props) => handleIncomingToolRequest(props),
      "tool-execute-result": (props) => handleToolResult(props),
    },
  },
});
