/**
 * Coding Agent Route Handler
 * Dispatches to the selected provider config based on data.provider.
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { endpoints } from "./definition";
import { dispatchCodingAgent } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t, cronTaskId, toolExecutionContext }) =>
      dispatchCodingAgent(
        data,
        user,
        logger,
        t,
        cronTaskId,
        toolExecutionContext,
      ),
  },
});
