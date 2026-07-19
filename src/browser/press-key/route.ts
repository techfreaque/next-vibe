/**
 * PressKey Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import pressKeyEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pressKeyEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, toolExecutionContext }) =>
      BrowserSharedRepository.executePressKey(
        {
          toolName: BrowserTool.PRESS_KEY,
          args: BrowserSharedRepository.filterUndefinedArgs({
            key: data.key,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        toolExecutionContext.threadId,
      ),
  },
});
