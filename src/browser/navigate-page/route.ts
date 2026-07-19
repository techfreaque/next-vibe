/**
 * NavigatePage Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import navigatePageEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: navigatePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, toolExecutionContext }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.NAVIGATE_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            type: data.type,
            url: data.url,
            ignoreCache: data.ignoreCache,
            handleBeforeUnload: data.handleBeforeUnload,
            initScript: data.initScript,
            timeout: data.timeout,
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
