/**
 * ClosePage Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import closePageEndpoints, { type ClosePageResponseOutput } from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: closePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeClosePage<ClosePageResponseOutput>(
        {
          toolName: BrowserTool.CLOSE_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            pageId: data.pageId,
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
