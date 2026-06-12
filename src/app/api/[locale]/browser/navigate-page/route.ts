/**
 * NavigatePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { BrowserTool, BrowserSharedRepository } from "./repository";

import navigatePageEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: navigatePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
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
        streamContext.threadId,
      ),
  },
});
