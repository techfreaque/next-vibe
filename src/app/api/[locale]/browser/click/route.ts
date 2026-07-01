/**
 * Click Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import clickEndpoints, { type ClickResponseOutput } from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: clickEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeClick<ClickResponseOutput>(
        {
          toolName: BrowserTool.CLICK,
          args: BrowserSharedRepository.filterUndefinedArgs({
            uid: data.uid,
            dblClick: data.dblClick,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
